using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApi.Models;

namespace WebApi.Controllers
{
    public class AlterController : ApiController
    {
        public async void Post([FromBody]AlterPswd avatar)
        {
            string SchoolUrl = System.Configuration.ConfigurationManager.AppSettings["SchoolUrl"].ToString();
            string url = string.Format("{0}api/ChangePasswd/{1}", SchoolUrl, avatar.ID);
            //var handler = new HttpClientHandler() { AutomaticDecompression = DecompressionMethods.GZip };
            using (var http = new HttpClient())
            {
                var content = new FormUrlEncodedContent(new Dictionary<string, string>() {
                    { "UserID",avatar.ID},
                    { "OldPasswd", avatar.OldPasswd },
                    { "NewPasswd", avatar.NewPasswd }
                });
                var task = await http.PostAsync(url, content);
            }
               
        }
    }
}
