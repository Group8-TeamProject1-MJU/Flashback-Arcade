using System.Text.Json;
using Application.Chat;
using Microsoft.AspNetCore.SignalR;

namespace Server.Hubs;

public class ChatHub : Hub {
    // 정적 변수로 연결된 클라이언트 수 추적
    private static int _connectedClients = 0;
    private static Queue<ChatMessage> _prevMessages = new();
    private static readonly Mutex _connectedClientsMutex = new();
    private static readonly Mutex _prevMessagesMutex = new();

    public static void GetInNewMessage(ChatMessage newMes) {
        _prevMessages.Enqueue(newMes);
        if (_prevMessages.Count > 50)
            _prevMessages.Dequeue();
    }

    public async override Task OnConnectedAsync() {
        _connectedClientsMutex.WaitOne();
        ++_connectedClients;
        _connectedClientsMutex.ReleaseMutex();

        await Clients.All.SendAsync("UpdateConnectedClientsCount", _connectedClients);
        await Clients.Caller.SendAsync("ReceivePrevMessages", JsonSerializer.Serialize(_prevMessages));

        await base.OnConnectedAsync();
    }

    public async override Task OnDisconnectedAsync(Exception exception) {
        _connectedClientsMutex.WaitOne();
        --_connectedClients;
        _connectedClientsMutex.ReleaseMutex();

        await Clients.All.SendAsync("UpdateConnectedClientsCount", _connectedClients);
        await base.OnDisconnectedAsync(exception);
    }

    public async Task SendMessage(string userName, string message) {
        var chatMessage = new ChatMessage {
            message = message,
            sentTime = DateTime.UtcNow,
            userName = userName
        };

        // var 

        await Clients.All.SendAsync(method: "ReceiveMessage", JsonSerializer.Serialize(chatMessage));

        _prevMessagesMutex.WaitOne();
        GetInNewMessage(chatMessage);
        _prevMessagesMutex.ReleaseMutex();
    }

    public async Task DeleteMessage(string messageToDeleteJson) {
        var messageToDelete = JsonSerializer.Deserialize<ChatMessage>(messageToDeleteJson);

        await Clients.All.SendAsync("DeleteMessage", JsonSerializer.Serialize(messageToDelete));

        _prevMessagesMutex.WaitOne();
        _prevMessages = new Queue<ChatMessage>(_prevMessages.Where(msg => !msg.isEqual(messageToDelete!)));
        _prevMessagesMutex.ReleaseMutex();
    }
}
