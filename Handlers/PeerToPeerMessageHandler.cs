using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net.WebSockets;
using System.Text;
using CopyToPhone;
using Newtonsoft.Json;

namespace CopyToPhone
{
    public class PeerToPeerMessageHandler : WebSocketHandler
    {
        public string defaultChannel = "default";
        public PeerToPeerMessageHandler(WebSocketConnectionManagerV2 webSocketConnectionManager) : base(webSocketConnectionManager)
        {
        }

        public override async Task OnConnected(WebSocket socket, string channelId)
        {
            await base.OnConnected(socket, channelId);

            var socketId = WebSocketConnectionManager.GetId(socket);
            await SendMessageToAllAsync($"{socketId} is now connected", channelId);
        }

        public override async Task ReceiveAsync(WebSocket socket, WebSocketReceiveResult result, byte[] buffer)
        {
            socketChannel _socketChannel = WebSocketConnectionManager.GetId(socket);
            var message = $"{_socketChannel.socketId} said: {Encoding.UTF8.GetString(buffer, 0, result.Count)}";

            await SendMessageToAllAsync(message, _socketChannel.ChannelId);
        }

        public override async Task OnDisconnected(WebSocket socket)
        {
            socketChannel _socketChannel = WebSocketConnectionManager.GetId(socket);

            await base.OnDisconnected(socket);
            await SendMessageToAllAsync($"{_socketChannel.socketId} disconnected", _socketChannel.ChannelId);
        }
    }


}
