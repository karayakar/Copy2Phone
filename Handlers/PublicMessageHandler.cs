using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net.WebSockets;
using System.Text;
using CopyToPhone;
using Newtonsoft.Json;

using System.Net.Http;
using System.Net;
using Microsoft.AspNetCore.Http;
using CopyToPhone.Helpers;

namespace CopyToPhone
{
    public class PublicMessageHandler : WebSocketHandler
    {
        private static readonly HttpClient client = new HttpClient();
        public PublicMessageHandler(WebSocketConnectionManagerV2 webSocketConnectionManager) : base(webSocketConnectionManager)
        {
        }

        public override async Task OnConnected(WebSocket socket, string channelId)
        {
            await base.OnConnected(socket, channelId);
            socketChannel _socketChannel = WebSocketConnectionManager.GetId(socket);
            
            await SendMessageToAllAsync("Connected", _socketChannel.ChannelId);
        }

        public override async Task ReceiveAsync(WebSocket socket, WebSocketReceiveResult result, byte[] buffer)
        {
            
            var message = Encoding.UTF8.GetString(buffer, 0, result.Count);
           
           
             
                try
                {
                    

                   socketChannel _socketChannel = WebSocketConnectionManager.GetId(socket);
                  //await SendMessageAsync(_socketChannel.socketId, message);
                await SendMessageToAllAsync(message, _socketChannel.ChannelId);


            }
                catch (Exception ex)
                {
                    

                }
             
        }

        
    }
}
