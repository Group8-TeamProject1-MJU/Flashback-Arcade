using Microsoft.AspNetCore.SignalR;

namespace Server.Hubs;

public class ChatHub : Hub {
    // 정적 변수로 연결된 클라이언트 수 추적
    private static int connectedClients = 0;

    public async override Task OnConnectedAsync() {
        ++connectedClients;
        await Clients.All.SendAsync("UpdateConnectedClientsCount", connectedClients);
        await base.OnConnectedAsync();
    }

    public async override Task OnDisconnectedAsync(Exception exception) {
        --connectedClients;
        await Clients.All.SendAsync("UpdateConnectedClientsCount", connectedClients);
        await base.OnDisconnectedAsync(exception);
    }

    public async Task SendMessage(string user, string message) {
        await Clients.All.SendAsync("ReceiveMessage", user, message);
    }
}
