using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Kingsun.SmarterClassroom.Mod;
using Kingsun.SmarterClassroom.DAL;
using Kingsun.SmarterClassroom.Com;
using System.Configuration;
//using Kingsun.SmarterClassroom.API.BasicService;
using System.Net.Http;
using FzDatabase.Room;

namespace Kingsun.SmarterClassroom.BLL
{
    public class BasicDataImplement : BaseImplement
    {
        private string webapi_url = ConfigurationSettings.AppSettings["WebApiUrl"].ToString();
        public override SyncResponse ProcessRequest(SyncRequest request)
        {
            if (string.IsNullOrEmpty(request.Function))
            {
                return SyncResponse.GetErrorResponse("无法确定接口信息！", request);
            }
            if (string.IsNullOrEmpty(request.Data))
            {
                return SyncResponse.GetErrorResponse("提交的数据不能为空！", request);
            }
            SyncResponse response = null;
            switch (request.Function.Trim())
            {
                case "GetUrlStr"://获取基础数据地址
                    response = GetUrlStr(request);
                break;
                case "GetUserStandBook"://根据用户ID获取教材数据
                    response = GetUserStandBook(request);
                    break;
                case "DelUserResource"://删除用户上传资源
                    response = DelUserResource(request);
                    break;
                case "GetServiceDateTime"://获取系统当前时间
                    response = GetServiceDateTime(request);
                    break;
                case "GetBookList"://获取配置的教材ID列表
                    response = GetBookList(request);
                    break;
                case "GetBookListForTop"://获取配置的教材ID列表
                    response = GetBookListForTop(request);
                    break;
                case "DeleteUserPreLessonData"://
                    response = DeleteUserPreLessonData(request);
                    break;
                    
                default:
                    response = null;
                    break;
            }
            return response;
        }

        private SyncResponse GetBookListForTop(SyncRequest request)
        {
            UserStandBook submitData = JsonHelper.DecodeJson<UserStandBook>(request.Data);
            using (var db = new fz_wisdomcampusEntities())
            {
                List<clr_electronic_book> booklist = db.clr_electronic_book.Where(b => b.UserID == submitData.UserID).OrderByDescending(o => o.CreateDate).OrderByDescending(o => o.EndUseDate).Take(3).ToList();
                return SyncResponse.GetResponse(request, booklist);
            }
        }

        private SyncResponse DeleteUserPreLessonData(SyncRequest request)
        {
            UserInfo submitData = JsonHelper.DecodeJson<UserInfo>(request.Data);
            using (var db=new fz_wisdomcampusEntities())
            {
                var list = db.clr_preLesson.Where(p=>p.UserID==submitData.UserID).ToList();
                foreach (var item in list)
                {
                    db.clr_preLesson.Remove(item);
                }
                db.SaveChanges();
            }
            return SyncResponse.GetResponse(request,true);
        }

        private SyncResponse GetBookList(SyncRequest request)
        {
            string booklist = ConfigurationSettings.AppSettings["BookList"];
            return SyncResponse.GetResponse(request, booklist);
        }

        /// <summary>
        /// 获取系统当前时间
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        private SyncResponse GetServiceDateTime(SyncRequest request)
        {
            return SyncResponse.GetResponse(request,DateTime.Now.ToString());
        }

        /// <summary>
        /// 删除用户上传资源
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        private SyncResponse DelUserResource(SyncRequest request)
        {
            Resource submitData = JsonHelper.DecodeJson<Resource>(request.Data);
            HttpClient myHttpClient = new HttpClient();
            myHttpClient.BaseAddress = new Uri(webapi_url);
            var content = new FormUrlEncodedContent(new Dictionary<string, string>()
                {
                    {"ResourceIDs",submitData.ResourceID},
                    {"UserID",submitData.UserID}
                 });
            HttpResponseMessage response = myHttpClient.PostAsync("ResourceDelete", content).Result;
            return SyncResponse.GetResponse(request, response.IsSuccessStatusCode);
        }
        /// <summary>
        /// 获取基础数据地址
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        private SyncResponse GetUrlStr(SyncRequest request)
        {
            UrlModel submitData = JsonHelper.DecodeJson<UrlModel>(request.Data);
            string url= ConfigurationManager.AppSettings[submitData.Type].ToString();
            return SyncResponse.GetResponse(request, url);
        }
        /// <summary>
        /// 根据用户ID获取教材数据
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        private SyncResponse GetUserStandBook(SyncRequest request)
        {
            UserStandBook submitData = JsonHelper.DecodeJson<UserStandBook>(request.Data);
            using (var db=new fz_wisdomcampusEntities())
            {
                List<clr_electronic_book> booklist = db.clr_electronic_book.Where(b=>b.UserID== submitData.UserID).ToList();
                return SyncResponse.GetResponse(request, booklist);
            }
            
        }
    }
}
