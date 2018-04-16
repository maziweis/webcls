//using Kingsun.SmarterClassroom.API.BasicService;
using Kingsun.SmarterClassroom.Com;
using Kingsun.SmarterClassroom.Mod;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Kingsun.SmarterClassroom.BLL
{
    public class LoginBLL
    {
        //BasicServiceClient bs = new BasicServiceClient();
        private string webapi_url = ConfigurationSettings.AppSettings["WebApiUrl"].ToString();
        public string CheckAcnt(string acnt,string pswd)
        {
            HttpClient myHttpClient = new HttpClient();
            myHttpClient.BaseAddress = new Uri(webapi_url);
            HttpResponseMessage response = myHttpClient.GetAsync("CheckLogin?account=" + acnt + "&password=" + pswd).Result;
            string json = null;
            if (response.IsSuccessStatusCode)
            {
                json = response.Content.ReadAsStringAsync().Result;
            }
            return json;
            
        }

        public C_UserInfo GetUserInfo(string acnt)   //待修改返回用户信息
        {
            HttpClient myHttpClient = new HttpClient();
            myHttpClient.BaseAddress = new Uri(webapi_url);
            HttpResponseMessage response = myHttpClient.GetAsync("GetUserInfo/" + acnt).Result;
            string json = null;
            if (response.IsSuccessStatusCode)
            {
                json = response.Content.ReadAsStringAsync().Result;
            }
            C_UserInfo submitData = JsonHelper.DecodeJson<C_UserInfo>(json);
            return submitData;
        }
    }
}
