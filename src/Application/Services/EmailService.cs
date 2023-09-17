using Domain.IServices;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit;
using MimeKit.Text;

namespace Application.Services;

public class EmailService : IEmailService {
    private readonly IConfiguration _configuration;
    private readonly string _from;
    private readonly string _SMTP;
    private readonly string _port;
    private readonly string _password;


    public EmailService(
        IConfiguration configuration
    ) {
        _configuration = configuration;

        _from = Environment.GetEnvironmentVariable("EMAIL_FROM") ?? _configuration["Email:From"]!;
        _SMTP = Environment.GetEnvironmentVariable("EMAIL_SMTP") ?? _configuration["Email:SMTP"]!;
        _port = Environment.GetEnvironmentVariable("EMAIL_PORT") ?? _configuration["Email:Port"]!;
        _password = Environment.GetEnvironmentVariable("EMAIL_PASSWORD") ?? _configuration["Email:Password"]!;
    }

    public async Task<bool> SendFromServerAsync(string to, string subject, string body) {
        if (string.IsNullOrWhiteSpace(to) || string.IsNullOrWhiteSpace(subject)
            || string.IsNullOrWhiteSpace(body))
            return false;

        var email = new MimeMessage();
        email.From.Add(MailboxAddress.Parse(_from));
        email.To.Add(MailboxAddress.Parse(to));
        email.Subject = subject;
        email.Body = new TextPart(TextFormat.Html) { Text = body };

        using var smtp = new SmtpClient();
        await smtp.ConnectAsync(_SMTP, int.Parse(_port), SecureSocketOptions.StartTls);
        await smtp.AuthenticateAsync(_from, _password);
        await smtp.SendAsync(email);
        await smtp.DisconnectAsync(true);

        return true;
    }
}
