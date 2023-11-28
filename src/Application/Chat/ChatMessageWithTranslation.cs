using System.Text.Json.Serialization;

namespace Application.Chat;

public class ChatMessageWithTranslation : ChatMessage {
    public string translation { get; set; } = string.Empty;
    public bool showTranslatedText = false;

    public ChatMessageWithTranslation() { }
    public ChatMessageWithTranslation(ChatMessage chatMessage) {
        this.message = chatMessage.message;
        this.sentTime = chatMessage.sentTime;
        this.userName = chatMessage.userName;
    }

    public ChatMessageWithTranslation(string msg, DateTime time, string name) {
        this.message = msg;
        this.sentTime = time;
        this.userName = name;
    }
}
