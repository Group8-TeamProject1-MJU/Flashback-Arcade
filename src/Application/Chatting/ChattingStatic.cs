namespace Application.Chatting;

static public class ChattingStatic {
    public static Queue<string> messages = new();

    public static void GetInNewMessage(string newMes) {
        messages.Enqueue(newMes);
        if (messages.Count > 50)
            messages.Dequeue();
    }
}
