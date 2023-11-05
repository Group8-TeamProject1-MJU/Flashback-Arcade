using Microsoft.AspNetCore.SignalR;

namespace Server.Hubs;

public class ChatHub : Hub {
    // 정적 변수로 연결된 클라이언트 수 추적
    private static int _connectedClients = 0;
    private static Queue<string> _prevMessages = new();
    private static readonly Mutex _connectedClientsMutex = new();
    private static readonly Mutex _prevMessagesMutex = new();

    public static void GetInNewMessage(string newMes) {
        _prevMessages.Enqueue(newMes);
        if (_prevMessages.Count > 50)
            _prevMessages.Dequeue();
    }

    public async override Task OnConnectedAsync() {
        _connectedClientsMutex.WaitOne();
        ++_connectedClients;
        _connectedClientsMutex.ReleaseMutex();

        await Clients.All.SendAsync("UpdateConnectedClientsCount", _connectedClients);
        await Clients.Caller.SendAsync("ReceivePrevMessages", _prevMessages);

        await base.OnConnectedAsync();
    }

    public async override Task OnDisconnectedAsync(Exception exception) {
        _connectedClientsMutex.WaitOne();
        --_connectedClients;
        _connectedClientsMutex.ReleaseMutex();

        await Clients.All.SendAsync("UpdateConnectedClientsCount", _connectedClients);
        await base.OnDisconnectedAsync(exception);
    }

    public async Task SendMessage(string user, string message) {
        var now = DateTime.Now;
        var formattedTime = now.ToString("(HH시:mm분:ss초)");
        var encodedMsg = $"{formattedTime} {user}: {message}";

        _prevMessagesMutex.WaitOne();
        GetInNewMessage(encodedMsg);
        _prevMessagesMutex.ReleaseMutex();

        await Clients.All.SendAsync("ReceiveMessage", encodedMsg);
    }

    public async Task DeleteMessage(string message) {
        _prevMessagesMutex.WaitOne();
        _prevMessages = new Queue<string>(_prevMessages.Where(msg => msg != message));
        _prevMessagesMutex.ReleaseMutex();

        await Clients.All.SendAsync("DeleteMessage", message);
    }
}
