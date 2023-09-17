namespace Domain.IServices;

public interface IEmailService {
    Task<bool> SendFromServerAsync(string to, string subject, string body);
}
