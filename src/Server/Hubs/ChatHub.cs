using Microsoft.AspNetCore.SignalR;

namespace Server.Hubs;

public class ChatHub : Hub {
    // 정적 변수로 연결된 클라이언트 수 추적
    private static int _connectedClients = 0;
    private static Queue<string> _prevMessages = new();
    private static List<string> _connetedUserNames = new();
    private static readonly Mutex _connectedClientsMutex = new();
    private static readonly Mutex _prevMessagesMutex = new();
    private static readonly Mutex _connetedUserMutex = new();

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
        await Clients.Caller.SendAsync("ReceiveConnectedUserNames", _connetedUserNames);

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
        _prevMessagesMutex.WaitOne();
        GetInNewMessage($"{user}: {message}");
        _prevMessagesMutex.ReleaseMutex();

        await Clients.All.SendAsync("ReceiveMessage", user, message);
    }

    public async Task DeleteMessage(string message) {
        _prevMessagesMutex.WaitOne();
        _prevMessages = new Queue<string>(_prevMessages.Where(msg => msg != message));
        _prevMessagesMutex.ReleaseMutex();

        await Clients.All.SendAsync("DeleteMessage", message);
    }

    public async Task AddConnectedUserName(string user) {
        _connetedUserMutex.WaitOne();
        _connetedUserNames.Add(user);
        _connetedUserMutex.ReleaseMutex();

        await Clients.All.SendAsync("ReceiveNewConnectedUserName", user);
    }

    public async Task RemoveConnectedUserName(string user) {
        _connetedUserMutex.WaitOne();
        _connetedUserNames.Remove(user);
        _connetedUserMutex.ReleaseMutex();

        await Clients.All.SendAsync("RemoveConnectedUserName", user);
    }
}
