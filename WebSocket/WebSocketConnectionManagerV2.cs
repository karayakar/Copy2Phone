using CopyToPhone;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;

namespace CopyToPhone
{
    public class WebSocketConnectionManagerV2
    {
        private ConcurrentDictionary<string, Channels> _channels = new ConcurrentDictionary<string, Channels>();

        public Channels GetChannelById(string id)
        {
            return _channels.FirstOrDefault(p => p.Key == id).Value;
        }
        public ConcurrentDictionary<string, Channels> GetAll()
        {
            return _channels;
        }

        public List<socketHolder> getAllSockets(string channelName = "public")
        {
            List<socketHolder> lstw = new List<socketHolder>();
            foreach (Channels channels in _channels.Select(p => p.Value))
            {
                foreach (Channel channel in channels.Channel)
                {
                    if (channel.ChannelId == channelName)
                    {
                        foreach (socketHolder _socket in channel.Clients)
                        {
                            lstw.Add(_socket);
                        }
                    }
                }
            }
            return lstw;
        }

        public socketChannel GetId(WebSocket socket)
        {
            socketChannel socketChannel = new socketChannel();
            foreach (Channels channels in _channels.Select(p => p.Value))
            {

                foreach (Channel channel in channels.Channel)
                {
                    var socketFound = channel.Clients.Find(x => x.socket == socket);
                    if (socketFound?.socket != null)
                    {
                        socketChannel.ChannelId = channel.ChannelId;
                        socketChannel.socket = socketFound.socket;
                        socketChannel.socketId = socketFound.socketId;
                        return socketChannel;
                    }
                }

            }
            return null;
        }

        public WebSocket GetSocketById(string id)
        {

            WebSocket socket = null;
            foreach (Channels channels in _channels.Select(p => p.Value))
            {
                foreach (Channel channel in channels.Channel)
                {
                    foreach (socketHolder _socket in channel.Clients)
                    {
                        if (_socket.socketId == id)
                        {
                            socket = _socket.socket;
                        }
                    }
                }
            }
            return socket;
        }

        public string GetChannelId(WebSocket socket)
        {
            foreach (Channels channels in _channels.Select(p => p.Value))
            {

                foreach (Channel channel in channels.Channel)
                {
                    foreach (socketHolder _socket in channel.Clients)
                    {
                        if (_socket.socket == socket)
                        {
                            return channel.ChannelId;
                        }
                    }
                }
            }

            return null;
        }

        public string GetChannelsKey(WebSocket socket)
        {
            foreach (Channels channels in _channels.Select(p => p.Value))
            {
                foreach (Channel channel in channels.Channel)
                {
                    foreach (socketHolder _socket in channel.Clients)
                    {
                        if (_socket.socket == socket)
                        {
                            return channels.ChannelsKey;
                        }
                    }
                }
            }
            return null;
        }

        public string GetChannelsId(WebSocket socket)
        {

            foreach (Channels channels in _channels.Select(p => p.Value))
            {
                foreach (Channel channel in channels.Channel)
                {
                    foreach (socketHolder _socket in channel.Clients)
                    {
                        if (_socket.socket == socket)
                        {
                            return channel.ChannelId;
                        }
                    }
                }
            }
            return null;
        }

        public bool addSocketSync(WebSocket socket, string channelid)
        {
            foreach (Channels channels in _channels.Select(p => p.Value))
            {
                if (channels.Channel.Where(x => x.ChannelId == channelid).FirstOrDefault() != null)
                {
                    foreach (Channel channel in channels.Channel)
                    {
                        if (channel.ChannelId == channelid)
                        {

                            channel.Clients.Add(new socketHolder() { socket = socket, socketId = CreateConnectionId() });
                        }
                    }
                }
                else
                {
                    List<socketHolder> lws = new List<socketHolder>();
                    lws.Add(new socketHolder() { socket = socket, socketId = CreateConnectionId() });
                    channels.Channel.Add(new Channel { ChannelId = channelid, Clients = lws });
                }

            }

            if (_channels.Count == 0)
            {
                List<socketHolder> lws = new List<socketHolder>();
                lws.Add(new socketHolder() { socket = socket, socketId = CreateConnectionId() });
                Channels channels = new Channels();

                List<Channel> lstChannel = new List<Channel>();
                Channel channel = new Channel();
                channel.ChannelId = channelid;
                channel.Clients = lws;
                lstChannel.Add(channel);
                channels.Channel = lstChannel;
                channels.ChannelsKey = CreateConnectionId();
                _channels.AddOrUpdateConcurrent(CreateConnectionId(), channels);

            }
            return true;
        }

        public async Task AddSocket(WebSocket socket, string channel)
        {
            var result = await Task.Run(() => addSocketSync(socket, channel));

        }

        public async Task RemoveSocket(socketChannel _socketChannel)
        {
            WebSocket socket;

            foreach (Channels channels in _channels.Select(p => p.Value))
            {
                if (channels.Channel.Where(x => x.ChannelId == _socketChannel.ChannelId).FirstOrDefault() != null)
                {
                    foreach (Channel channel in channels.Channel)
                    {
                        if (channel.ChannelId == _socketChannel.ChannelId)
                        {
                            socket = channel.Clients.Find(x => x.socketId == _socketChannel.socketId).socket;
                            channel.Clients.Remove(channel.Clients.Find(x => x.socketId == _socketChannel.socketId));

                            await socket.CloseAsync(closeStatus: WebSocketCloseStatus.NormalClosure, statusDescription: "Closed by the WebSocketManager", cancellationToken: CancellationToken.None);
                        }
                    }
                }

            }

        }

        public async Task RemoveChannel(string ChannelId)
        {
            foreach (Channels channels in _channels.Select(p => p.Value))
            {
                if (channels.Channel.Where(x => x.ChannelId == ChannelId).FirstOrDefault() != null)
                {
                    foreach (Channel channel in channels.Channel)
                    {
                        if (channel.ChannelId == ChannelId)
                        {
                            foreach (socketHolder _sh in channel.Clients)
                            {
                                await _sh.socket.CloseAsync(closeStatus: WebSocketCloseStatus.NormalClosure, statusDescription: "Closed by the WebSocketManager", cancellationToken: CancellationToken.None);
                                channel.Clients.Remove(_sh);
                            }

                        }
                    }
                }
            }
        }

        private string CreateConnectionId()
        {
            return Guid.NewGuid().ToString();
        }
    }
}