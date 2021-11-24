using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using CopyToPhone.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

using QRCoder;
using System.Drawing;
using System.IO;
using static System.Net.Mime.MediaTypeNames;
 
using System.Drawing.Imaging;
using static QRCoder.Base64QRCode;
using System.Text.RegularExpressions;

namespace CopyToPhone.Controllers
{
    [Route("api/[controller]")]
    public class QRController : Controller
    {
        [AllowAnonymous]
        [HttpGet]
        [Route("test")]
        public string test()
        {
            
            return "OK";
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("GetQr")]
        public IActionResult GetQr(string code)
        {
            QRCodeGenerator qrGenerator = new QRCodeGenerator();
            QRCodeData qrCodeData = qrGenerator.CreateQrCode(code, QRCodeGenerator.ECCLevel.Q);
            PngByteQRCode qrCode = new PngByteQRCode(qrCodeData);
            byte[] qrCodeAsPngByteArr = qrCode.GetGraphic(20);

            //From here on, you can implement your platform-dependent byte[]-to-image code 

            //e.g. Windows 10 - Full .NET Framework
            Bitmap qrCodeImage;
            byte[] bytes;
            using (var ms = new MemoryStream(qrCodeAsPngByteArr))
            {
                qrCodeImage = new Bitmap(ms);
                var ms2 = new MemoryStream();
                qrCodeImage.Save(ms2, ImageFormat.Jpeg);
                bytes = ms.ToArray();
            }

            return File(bytes, "image/jpeg");
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("GetQrImg")]
        public string GetQrImg(string code)
{
            var imgType = Base64QRCode.ImageType.Jpeg;
            QRCodeGenerator qrGenerator = new QRCodeGenerator();
            QRCodeData qrCodeData = qrGenerator.CreateQrCode(code, QRCodeGenerator.ECCLevel.Q);
            Base64QRCode qrCode = new Base64QRCode(qrCodeData);
            string qrCodeImageAsBase64 = qrCode.GetGraphic(20, Color.Black, Color.White, true, imgType);
            return $"<img  width=\"250\" height=\"250\" alt=\"Embedded QR Code\" src=\"data:image/{imgType.ToString().ToLower()};base64,{qrCodeImageAsBase64}\" />";
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("GetmyIp")]
        public   string GetMyIp()
        {
            var ips =System.Net.Dns.GetHostAddressesAsync(System.Net.Dns.GetHostName()).Result;

            
           return ips[4].ToString();
        }
    }
}
