namespace Domain.IServices;

public interface IEmailService {
    Task<bool> SendFromServerAsync(List<string> recipients, string subject, string body);
}
