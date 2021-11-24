using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace CopyToPhone
{
    public class Program
    {
        //public static void Main(string[] args)
        //{
        //    BuildWebHost().Run();
        //}
        //public static IWebHost BuildWebHost()
        //{


        //    return new WebHostBuilder()
        //        .UseKestrel(options =>
        //        {
        //            options.Limits.MaxRequestBodySize = 52428800;

        //        })
        //        .ConfigureAppConfiguration((builderContext, config) =>
        //        {
        //            IWebHostEnvironment env = builderContext.HostingEnvironment;

        //            config.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);

        //        })
        //        .UseContentRoot(Directory.GetCurrentDirectory())
        //        //.UseIISIntegration()
        //        .UseStartup<Startup>()
        //        .UseUrls("http://0.0.0.0:5555")
        //        .Build();

        //    //host.Run();
        //}

        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
            .ConfigureLogging((hostingContext, logging) =>
            {
                 
            })
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
