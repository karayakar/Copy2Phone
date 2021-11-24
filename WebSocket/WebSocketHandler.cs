using CopyToPhone;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;


namespace CopyToPhone
{


    public abstract class WebSocketHandler
    {
        protected WebSocketConnectionManagerV2 WebSocketConnectionManager { get; set; }

        public string ChannelId = "";

        public WebSocketHandler(WebSocketConnectionManagerV2 webSocketConnectionManager)
        {
            WebSocketConnectionManager = webSocketConnectionManager;
        }

        public virtual async Task OnConnected(WebSocket socket, string channel)
        {
            await WebSocketConnectionManager.AddSocket(socket, channel);
        }

        public virtual async Task OnDisconnected(WebSocket socket)
        {
            await WebSocketConnectionManager.RemoveSocket(WebSocketConnectionManager.GetId(socket));
        }

        public async Task SendMessageAsync(WebSocket socket, string message)
        {
            if (socket.State != WebSocketState.Open)
                return;

            await socket.SendAsync(buffer: new ArraySegment<byte>(array: Encoding.ASCII.GetBytes(message), offset: 0, count: message.Length), messageType: WebSocketMessageType.Text, endOfMessage: true, cancellationToken: CancellationToken.None);
        }

        public async Task SendMessageAsync(string socketId, string message)
        {
            await SendMessageAsync(WebSocketConnectionManager.GetSocketById(socketId), message);
        }

        public async Task SendMessageToAllAsync(string message, string channel)
        {
            foreach (var pair in WebSocketConnectionManager.getAllSockets(channel))
            {

                if (pair.socket.State == WebSocketState.Open)
                    await SendMessageAsync(pair.socket, message);
            }
        }

        public abstract Task ReceiveAsync(WebSocket socket, WebSocketReceiveResult result, byte[] buffer);
    }
}