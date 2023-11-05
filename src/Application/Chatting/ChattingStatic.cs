namespace Application.Chatting;

static public class ChattingStatic {
    public static Queue<string> messages = new();

    public static void GetInNewMessage(string newMes) {
        messages.Enqueue(newMes);
        if (messages.Count > 50)
            messages.Dequeue();
    }

    public static void DeleteMessage(string message) {
        // 메시지 큐에서 특정 메시지를 삭제
        if (messages.Contains(message)) {
            messages = new Queue<string>(messages.Where(msg => msg != message));
        }
    }
}
