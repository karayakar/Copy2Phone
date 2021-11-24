using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Threading.Tasks;

namespace CopyToPhone
{
    public class Channels
    {
        public Channels() { }
        public List<Channel> Channel { get; set; }
        public string ChannelsKey { get; set; }
    }
    public class Channel
    {
        public Channel() { }
        public List<socketHolder> Clients { get; set; }
        public string ChannelId { get; set; }
    }
    public class socketHolder
    {
        public socketHolder() { }
        public WebSocket socket { get; set; }
        public string socketId { get; set; }
    }

    public class socketChannel
    {
        public socketChannel() { }
        public WebSocket socket { get; set; }
        public string socketId { get; set; }
        public string ChannelId { get; set; }
    }
}

