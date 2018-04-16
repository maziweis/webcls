using System.Web.Http;
using WebApi.BasicService;
using WebApi.Models;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using System.IO;
using System.Text;

namespace WebApi.Controllers
{
    public class CheckController : ApiController
    {
        public string Get(string account,string password)
        {
            BasicServiceClient basicServiceClient = new BasicServiceClient();
            if (basicServiceClient.CheckLogin(account, password) == 1)
            {
                C_UserInfo UserInfolist = basicServiceClient.GetUserInfo(account);
                string UserJson = EnSerialize<C_UserInfo>(UserInfolist);
                return UserJson;
            }
            else {
                return basicServiceClient.CheckLogin(account, password).ToString();
            }
            
        }
        /// <summary>
        /// 对象序列化为JSON
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="data"></param>
        /// <returns></returns>
        private string EnSerialize<T>(T data)
        {
            try
            {
                DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(T));//data.GetType()
                using (MemoryStream ms = new MemoryStream())
                {
                    serializer.WriteObject(ms, data);
                    return Encoding.UTF8.GetString(ms.ToArray());
                }
            }
            catch
            {
                return null;
            }
        }
    }
}
