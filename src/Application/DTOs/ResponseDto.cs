namespace Application.DTOs;

public class ResponseDt {
    public List<string> Errors { get; set; } = new List<string>();
    public bool hasSucceed = false;
}
