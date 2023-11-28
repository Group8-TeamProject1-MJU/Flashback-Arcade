using System.Text.Json.Serialization;

namespace Application.Chat;

public class ChatMessage {
    public string message { get; set; } = string.Empty;

    public DateTime sentTime { get; set; } = default;

    public string userName { get; set; } = string.Empty;

    public ChatMessage() { }

    public ChatMessage(string msg, DateTime time, string name) {
        message = msg;
        sentTime = time;
        userName = name;
    }

    public ChatMessage(ChatMessage chatMessage) {
        this.message = chatMessage.message;
        this.sentTime = chatMessage.sentTime;
        this.userName = chatMessage.userName;
    }

    public bool isEqual(ChatMessage mesToCompare) {
        return message.CompareTo(mesToCompare.message) == 0 && sentTime.CompareTo(mesToCompare.sentTime) == 0 && userName.CompareTo(mesToCompare.userName) == 0;
    }
}
