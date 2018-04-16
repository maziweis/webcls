using System;
using System.Collections.Generic;
using System.Linq;
using Kingsun.SmarterClassroom.Mod;
using Kingsun.SmarterClassroom.Com;
using Kingsun.SmarterClassroom.DAL;
//using Kingsun.SmarterClassroom.API.BigDataService;
//using Kingsun.SmarterClassroom.API.BasicService;
using System.Net.Http;
using System.Text;
using System.Net.Http.Headers;
using System.Configuration;
using FzDatabase.Room;

namespace Kingsun.SmarterClassroom.BLL
{
    public class TeachImplement : BaseImplement
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
                case "CheckLoad"://验证登录
                    response = CheckLoad(request);
                    break;
                case "CheckLoadDF"://验证登录
                    response = CheckLoadDF(request);
                    break;
                case "GetUserInfoList"://用GUID获取用户账号
                    response = GetUserInfoList(request);
                    break;
                case "GetUserInfoByGuid"://用GUID获取用户账号
                    response = GetUserInfoByGuid(request);
                    break;
                case "AddUserStandBook"://用户添加教材
                    response = AddUserStandBook(request);
                    break;
                case "SaveUserPresson"://保存用户备课数据
                    response = SaveUserPresson(request);
                    break;
                case "GetUserPressonJsonByWhere"://获取用户备课数据
                    response = GetUserPressonJsonByWhere(request);
                    break;
                case "SaveInitData"://保存SelectBook页面初始化数据
                    response = SaveInitData(request);
                    break;
                case "SelectInitData"://查询SelectBook页面初始化数据
                    response = SelectInitData(request);
                    break;
                case "UpdateInitData"://更新SelectBook页面初始化数据
                    response = UpdateInitData(request);
                    break;
                case "SelectTeachingData"://查询Teaching页面初始化数据
                    response = SelectTeachingData(request);
                    break;
                case "SaveTeachingData"://保存Teaching页面初始化数据
                    response = SaveTeachingData(request);
                    break;
                case "UpdateTeachingData"://更新Teaching页面初始化数据
                    response = UpdateTeachingData(request);
                    break;
                case "SelBookPageData"://查询页面数据从智慧教室后台
                    response = SelBookPageData(request);
                    break;
                case "GetTextBookResource"://查询页面水滴数据从智慧校园
                    response = GetTextBookResource(request);
                    break;
                case "SaveOperData"://保存用户操作记录
                    response = SaveOperData(request);
                    break;
                case "GetUserResource"://获取用户资源
                    response = GetUserResource(request);
                    break;
                case "SaveOperationRecord"://保存用户操作记录
                    response = SaveOperationRecord(request);
                    break;
                case "SavsUserFinallyOperationRecord"://保存用户最后的操作
                    response = SavsUserFinallyOperationRecord(request);
                    break;
                case "GetUserFinallyOperationRecord"://获取用户最后的操作
                    response = GetUserFinallyOperationRecord(request);
                    break;
                case "SaveUserUploadResource"://保存用户上传资源
                    response = SaveUserUploadResource(request);
                    break;
                case "SelExercises"://查询是否存在课堂练习
                    response = SelExercises(request);
                    break;
                case "InsertExercises"://插入课堂练习
                    response = InsertExercises(request);
                    break;
                case "UpdateExercises"://更新课堂练习
                    response = UpdateExercises(request);
                    break;
                case "GetUserResourceByKey"://检索用户资源
                    response = GetUserResourceByKey(request);
                    break;
                case "CheckPreLessonResource"://检查备课中的资源
                    response = CheckPreLessonResource(request);
                    break;
                case "SaveUserTeachMap"://保存用户教学地图数据
                    response = SaveUserTeachMap(request);
                    break;
                case "GetUserTeachMapJsonByWhere"://获取用户教学地图数据
                    response = GetUserTeachMapJsonByWhere(request);
                    break;
                case "GetSchoolResourceList"://获取校本资源数据
                    response = GetSchoolResourceList(request);
                    break;
                case "ShareUserResource"://用户分享资源
                    response = ShareUserResource(request);
                    break;
                case "DeletePreLessonResource"://用户删除备课水滴资源
                    response = DeletePreLessonResource(request);
                    break;
                case "DeletePreLesson"://用户删除备课水滴资源
                    response = DeletePreLesson(request);
                    break;
                case "UpdateStanBookUsingTime":
                    response = UpdateStanBookUsingTime(request);//修改用户使用教材时间
                    break;
                case "GetResourceUrlByFileID":
                    response = GetResourceUrlByFileID(request);//获取资源地址
                    break;
                default:
                    response = null;
                    break;
            }
            return response;
        }

        private SyncResponse DeletePreLesson(SyncRequest request)
        {
            PreLessonContent preLessonContent = new PreLessonContent();
            clr_preLesson submitData = JsonHelper.DecodeJson<clr_preLesson>(request.Data);
            using (var db = new fz_wisdomcampusEntities())
            {
                List<clr_preLesson> prelessonList = db.clr_preLesson.Where(p => p.UserID == submitData.UserID).ToList();
                foreach (var prelesson in prelessonList)
                {
                    db.clr_preLesson.Remove(prelesson);
                    db.SaveChanges();
                }
                return SyncResponse.GetResponse(request, true);
            }
        }

        /// <summary>
        /// 获取资源地址
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        private SyncResponse GetResourceUrlByFileID(SyncRequest request)
        {
            UserResource submitData = JsonHelper.DecodeJson<UserResource>(request.Data);
            HttpClient myHttpClient = new HttpClient();
            myHttpClient.BaseAddress = new Uri(webapi_url); //webapi_url
            HttpResponseMessage response = myHttpClient.GetAsync("ResourcePreview?id=" + submitData.FileID).Result;
            if (response.IsSuccessStatusCode)
            {
                string json = response.Content.ReadAsStringAsync().Result;
                if (json.IndexOf("http")!=-1)
                    return SyncResponse.GetResponse(request, json);
                else
                    return SyncResponse.GetResponse(request,false);
            }
            else
            {
                return SyncResponse.GetResponse(request, null);
            }
        }

        private SyncResponse UpdateStanBookUsingTime(SyncRequest request)
        {
            clr_electronic_book submitData = JsonHelper.DecodeJson<clr_electronic_book>(request.Data);
            using (var db = new fz_wisdomcampusEntities())
            {
                clr_electronic_book book = db.clr_electronic_book.FirstOrDefault(b => b.UserID == submitData.UserID && b.BookID == submitData.BookID);
                book.EndUseDate = DateTime.Now;
                db.SaveChanges();
                return SyncResponse.GetResponse(request, true);
            }
        }

        private SyncResponse DeletePreLessonResource(SyncRequest request)
        {
            PreLessonContent preLessonContent = new PreLessonContent();
            clr_preLesson submitData = JsonHelper.DecodeJson<clr_preLesson>(request.Data);
            PreLessonBtn submitDataBtn = JsonHelper.DecodeJson<PreLessonBtn>(request.Data);
            using (var db = new fz_wisdomcampusEntities())
            {
                List<clr_preLesson> prelessonList = db.clr_preLesson.Where(p => p.UserID == submitData.UserID).ToList();
                foreach (var prelesson in prelessonList)
                {
                    preLessonContent = JsonHelper.DecodeJson<PreLessonContent>(prelesson.PreLessonContent);
                    for (int i = preLessonContent.btns.Count - 1; i >= 0; i--)
                    {
                        if (submitDataBtn.sourceUrl.IndexOf(preLessonContent.btns[i].sourceUrl) != -1)
                            preLessonContent.btns.Remove(preLessonContent.btns[i]);
                    }
                    string jsonContent = JsonHelper.DeepEncodeJson(preLessonContent);
                    prelesson.PreLessonContent = jsonContent;
                    prelesson.CreateDate = DateTime.Now;
                    db.SaveChanges();
                }
                return SyncResponse.GetResponse(request, true);
            }
        }

        /// <summary>
        /// 用户分享资源
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        private SyncResponse ShareUserResource(SyncRequest request)
        {
            ShareResource submitData = JsonHelper.DecodeJson<ShareResource>(request.Data);
            HttpClient myHttpClient = new HttpClient();
            myHttpClient.BaseAddress = new Uri(webapi_url); //webapi_url
            string json = JsonHelper.DeepEncodeJson(submitData);
            var content = new StringContent(json, Encoding.UTF8);
            content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            HttpResponseMessage response = myHttpClient.PostAsync("ResourceShare", content).Result;
            if (response.IsSuccessStatusCode)
                return SyncResponse.GetResponse(request, response.Content.ReadAsStringAsync().Result);
            else
                return SyncResponse.GetResponse(request, response.IsSuccessStatusCode);
        }

        /// <summary>
        /// 获取校本资源数据
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        private SyncResponse GetSchoolResourceList(SyncRequest request)
        {
            UserResource submitData = JsonHelper.DecodeJson<UserResource>(request.Data);
            PageParameter parameter = JsonHelper.DecodeJson<PageParameter>(request.Data);

            HttpClient myHttpClient = new HttpClient();
            myHttpClient.BaseAddress = new Uri(webapi_url); //webapi_url
            string type;
            if (submitData.ResourceStyle == "0")
                type = "null";
            else
                type = submitData.ResourceStyle;
            HttpResponseMessage response = myHttpClient.GetAsync("GetSchoolResourceList?PageIndex=" + parameter.PageIndex + "&PageSize=" + parameter.PageSize + "&SubjectID=" + submitData.SubjectID + "&Catalogs=" + submitData.Catalogs + "&ResourceStyle=" + type).Result;
            if (response.IsSuccessStatusCode)
            {
                string json = response.Content.ReadAsStringAsync().Result;
                if (json.Length > 2)
                    return SyncResponse.GetResponse(request, json);
                else
                    return SyncResponse.GetResponse(request, null);
            }
            else
            {
                return SyncResponse.GetResponse(request, null);
            }
        }

        /// <summary>
        /// 获取用户教学地图数据
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        private SyncResponse GetUserTeachMapJsonByWhere(SyncRequest request)
        {
            clr_teachmap submitData = JsonHelper.DecodeJson<clr_teachmap>(request.Data);
            using (var db = new fz_wisdomcampusEntities())
            {
                var map = db.clr_teachmap.FirstOrDefault(m => m.UserID == submitData.UserID && m.BookID == submitData.BookID && m.UnitID == submitData.UnitID);
                if (map == null)
                {
                    HttpClient myHttpClient = new HttpClient();
                    myHttpClient.BaseAddress = new Uri(webapi_url); //webapi_url
                    HttpResponseMessage response = myHttpClient.GetAsync("GetTextBookMap?BookID=" + submitData.BookID + "&unitId=" + submitData.UnitID).Result;
                    if (response.IsSuccessStatusCode)
                    {
                        string json = response.Content.ReadAsStringAsync().Result;
                        if (json.IndexOf("\"[") != -1)
                            json = json.Substring(1, json.Length - 2);
                        if (json.Length > 2 && json != "null")
                        {
                            json = json.Replace("/", "").Replace("\\", "");
                            return SyncResponse.GetResponse(request, json);
                        }
                        else
                            return SyncResponse.GetResponse(request, "");
                    }
                    else
                    {
                        return SyncResponse.GetResponse(request, null);
                    }
                }
                else
                {
                    return SyncResponse.GetResponse(request, map.Map);
                }
            }
        }

        /// <summary>
        /// 保存用户教学地图数据
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        private SyncResponse SaveUserTeachMap(SyncRequest request)
        {
            BookMap submitData = JsonHelper.DecodeJson<BookMap>(request.Data);
            UserInfo userData = JsonHelper.DecodeJson<UserInfo>(request.Data);
            if (userData.Type == 4)//管理员
            {
                HttpClient myHttpClient = new HttpClient();
                myHttpClient.BaseAddress = new Uri(webapi_url); //webapi_url
                string json = JsonHelper.DeepEncodeJson(submitData);
                var content = new StringContent(json, Encoding.UTF8);
                content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                HttpResponseMessage response = myHttpClient.PostAsync("GetTextBookMap", content).Result;
                return SyncResponse.GetResponse(request, response.IsSuccessStatusCode);
            }
            else
            {
                using (var db = new fz_wisdomcampusEntities())
                {
                    var map = db.clr_teachmap.FirstOrDefault(m => m.UserID == userData.UserID && m.BookID == submitData.bookId && m.UnitID == submitData.unitId);
                    if (map != null)
                    {
                        map.Map = submitData.MapContent;
                        map.CreateTime = DateTime.Now;
                        db.SaveChanges();
                    }
                    else
                    {
                        clr_teachmap model = new clr_teachmap();
                        model.ID = Guid.NewGuid();
                        model.UserID = userData.UserID;
                        model.BookID = submitData.bookId;
                        model.UnitID = submitData.unitId;
                        model.Map = submitData.MapContent;
                        model.CreateTime = DateTime.Now;
                        db.clr_teachmap.Add(model);
                        db.SaveChanges();
                    }
                }
                return SyncResponse.GetResponse(request, true);
            }
        }

        /// <summary>
        /// 检查备课中的资源
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        private SyncResponse CheckPreLessonResource(SyncRequest request)
        {
            Resource submitData = JsonHelper.DecodeJson<Resource>(request.Data);
            UserInfo userDate= JsonHelper.DecodeJson<UserInfo>(request.Data);

            string[] resourceArr = submitData.ResourceID.Split(',');

            bool result = false;
            foreach (var item in resourceArr)
            {
                using (var db = new fz_wisdomcampusEntities())
                {
                    IList<clr_preLesson> preLessonlist = db.clr_preLesson.Where(p => p.PreLessonContent.Contains(item) && p.UserID == userDate.UserID).ToList();
                    if (preLessonlist != null&& preLessonlist.Count!=0)
                        result = true;
                    IList<clr_teachmap> maplist = db.clr_teachmap.Where(m =>m.Map.Contains(item)&&m.UserID == userDate.UserID).ToList();
                    if (maplist!= null && maplist.Count != 0)
                        result = true;
                }
            }
            return SyncResponse.GetResponse(request,result);
        }

        /// <summary>
        /// 检索用户资源
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        private SyncResponse GetUserResourceByKey(SyncRequest request)
        {
            UserResource submitData = JsonHelper.DecodeJson<UserResource>(request.Data);
            HttpClient myHttpClient = new HttpClient();
            myHttpClient.BaseAddress = new Uri(webapi_url);//
            HttpResponseMessage response = myHttpClient.GetAsync("GetUserResourceByKey?UserID=" + submitData.UserID + "&SubjectID=" + submitData.SubjectID+ "&key=" + submitData.ResourceName).Result;
            if (response.IsSuccessStatusCode)
            {
                string json = response.Content.ReadAsStringAsync().Result;
                List<UserResource> list = JsonHelper.JosnDeserializer<UserResource>(json);
                return SyncResponse.GetResponse(request, list);
            }
            else
            {
                return SyncResponse.GetResponse(request, null);
            }
        }

        /// <summary>
        /// 保存用户上传资源
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        private SyncResponse SaveUserUploadResource(SyncRequest request)
        {
            List<UploadFile> submitDataList = JsonHelper.DecodeJson<List<UploadFile>>(request.Data);
            string json = JsonHelper.DeepEncodeJson(submitDataList);

            HttpClient myHttpClient = new HttpClient();
            myHttpClient.BaseAddress = new Uri(webapi_url); /*webapi_url*/
            var content = new StringContent(json, Encoding.UTF8);
            content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            HttpResponseMessage response = myHttpClient.PostAsync("Resource", content).Result;

            return SyncResponse.GetResponse(request, response.Content.ReadAsStringAsync().Result);
        }

        private SyncResponse GetUserFinallyOperationRecord(SyncRequest request)
        {
            PageInit submitData = JsonHelper.DecodeJson<PageInit>(request.Data);
            using (var db = new fz_wisdomcampusEntities())
            {
                clr_pageInit page = db.clr_pageInit.FirstOrDefault(p => p.UserID == submitData.UserID && p.AspxName == "Common");
                return SyncResponse.GetResponse(request, page);
            }
        }

        /// <summary>
        /// 保存用户最后的操作
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        private SyncResponse SavsUserFinallyOperationRecord(SyncRequest request)
        {
            clr_pageInit submitData = JsonHelper.DecodeJson<clr_pageInit>(request.Data);
            using (var db = new fz_wisdomcampusEntities())
            {
                clr_pageInit page = db.clr_pageInit.FirstOrDefault(p => p.UserID == submitData.UserID && p.AspxName == "Common");
                if (page != null)
                {
                    page.BookType = submitData.BookType;
                    page.Stage = submitData.Stage;
                    page.GradeID = submitData.GradeID;
                    page.SubjectID = submitData.SubjectID;
                    page.EditionID = submitData.EditionID;
                    page.BookID = submitData.BookID;
                    page.UnitID = submitData.UnitID;
                    page.PageNum = submitData.PageNum;
                    db.SaveChanges();
                }
                else
                {
                    submitData.PageInitID = Guid.NewGuid().ToString();
                    submitData.CreateTime = DateTime.Now;
                    submitData.AspxName = "Common";
                    db.clr_pageInit.Add(submitData);
                    db.SaveChanges();
                }
                return SyncResponse.GetResponse(request, true);
            }
        }

        /// <summary>
        /// 保存用户操作记录
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        private SyncResponse SaveOperationRecord(SyncRequest request)
        {
            UserOperData submitData = JsonHelper.DecodeJson<UserOperData>(request.Data);
            HttpClient myHttpClient = new HttpClient();
            myHttpClient.BaseAddress = new Uri(webapi_url);

            string json = JsonHelper.DeepEncodeJson(submitData);
            var content = new StringContent(json, Encoding.UTF8);
            content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            HttpResponseMessage response = myHttpClient.PostAsync("ClrLogMonitorWeb_Add", content).Result;
            return SyncResponse.GetResponse(request, response.IsSuccessStatusCode);
        }

        /// <summary>
        /// 获取用户资源
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        private SyncResponse GetUserResource(SyncRequest request)
        {
            Resource submitData = JsonHelper.DecodeJson<Resource>(request.Data);
            HttpClient myHttpClient = new HttpClient();
            myHttpClient.BaseAddress = new Uri(webapi_url);//webapi_url
            HttpResponseMessage response = myHttpClient.GetAsync("Resource?UserID=" + submitData.UserID + "&CatalogIds=" + submitData.UnitID).Result;
            if (response.IsSuccessStatusCode)
            {
                string json = response.Content.ReadAsStringAsync().Result;
                List<UserResource> list = JsonHelper.JosnDeserializer<UserResource>(json);
                return SyncResponse.GetResponse(request, list);
            }
            else
            {
                return SyncResponse.GetResponse(request, null);
            }

        }

        /// <summary>
        /// 获取用户备课数据
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        private SyncResponse GetUserPressonJsonByWhere(SyncRequest request)
        {
            clr_preLesson submitData = JsonHelper.DecodeJson<clr_preLesson>(request.Data);
            using (var db = new fz_wisdomcampusEntities())
            {
                clr_preLesson prelesson = db.clr_preLesson.FirstOrDefault(p => p.UserID == submitData.UserID && p.BookID == submitData.BookID && p.Page == submitData.Page);
                if (prelesson == null)
                {
                    HttpClient myHttpClient = new HttpClient();
                    myHttpClient.BaseAddress = new Uri(webapi_url);
                    HttpResponseMessage response = myHttpClient.GetAsync("TextbookResource?bookId=" + submitData.BookID + "&pages=" + submitData.Page).Result;

                    if (response.IsSuccessStatusCode)
                    {
                        string json = response.Content.ReadAsStringAsync().Result;
                        if (json.Length > 2)
                            return SyncResponse.GetResponse(request, json);
                        else
                            return SyncResponse.GetResponse(request, null);
                    }
                    else
                        return SyncResponse.GetResponse(request, null);
                }
                else
                    return SyncResponse.GetResponse(request, prelesson.PreLessonContent);
            }
        }
        /// <summary>
        /// 保存用户备课数据
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        private SyncResponse SaveUserPresson(SyncRequest request)
        {
            List<clr_preLesson> submitData = JsonHelper.DecodeJson<List<clr_preLesson>>(request.Data);
            List<UserInfo> userData = JsonHelper.DecodeJson<List<UserInfo>>(request.Data);
            if (userData[0].Type == 4)//管理员
            {
                HttpClient myHttpClient = new HttpClient();
                myHttpClient.BaseAddress = new Uri(webapi_url);

                string json = JsonHelper.DeepEncodeJson(submitData);
                var content = new StringContent(json, Encoding.UTF8);
                content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                HttpResponseMessage response = myHttpClient.PostAsync("TextbookResource", content).Result;
                return SyncResponse.GetResponse(request, response.IsSuccessStatusCode);
            }
            else
            {
                foreach (var item in submitData)
                {
                    using (var db = new fz_wisdomcampusEntities())
                    {
                        var prelesson = db.clr_preLesson.FirstOrDefault(p => p.BookID == item.BookID && p.Page == item.Page && p.UserID == item.UserID);
                        if (prelesson != null)
                        {
                            prelesson.PreLessonContent = item.PreLessonContent;
                            prelesson.CreateDate = DateTime.Now;
                            db.SaveChanges();
                        }
                        else
                        {
                            item.PreLessonID = Guid.NewGuid().ToString();
                            item.CreateDate = DateTime.Now;
                            db.clr_preLesson.Add(item);
                            db.SaveChanges();
                        }
                    }
                }
                return SyncResponse.GetResponse(request, true);
            }
        }

        /// <summary>
        /// 用户添加教材
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        private SyncResponse AddUserStandBook(SyncRequest request)
        {
            try
            {
                UserStandBookModul submitData = JsonHelper.DecodeJson<UserStandBookModul>(request.Data);
                using (var db = new fz_wisdomcampusEntities())
                {
                    List<StandBook> AddList =new List<StandBook>();
                    List<clr_electronic_book> RemoveList = new List<clr_electronic_book>(); ;
                    var list = db.clr_electronic_book.Where(b => b.UserID == submitData.UserID).ToList();

                    ////////////////添加的教材为空的时候,清空用户教材//////////////////////
                    if (submitData.StandBookList.Count() == 0)
                    {
                        foreach (var item in list)
                            db.clr_electronic_book.Remove(item);
                        db.SaveChanges();
                    }
                    else
                    {
                        ///////////////匹配获取需要添加的教材//////////////////
                        foreach (var book in submitData.StandBookList)
                        {
                            clr_electronic_book model = list.FirstOrDefault(b=>b.BookID==book.ID);
                            if (model == null)
                                AddList.Add(book);
                        }
                        ///////////////匹配获取需要删除的教材//////////////////
                        foreach (var book in list)
                        {
                            StandBook model = submitData.StandBookList.FirstOrDefault(b => b.ID == book.BookID);
                            if (model == null)
                                RemoveList.Add(book);
                        }
                        ///////////////删除教材/////////////////
                        foreach (var item in RemoveList)
                        {
                            clr_electronic_book model = list.FirstOrDefault(b=>b.BookID==item.BookID);
                            db.clr_electronic_book.Remove(model);
                            db.SaveChanges();
                        }
                        ///////////////添加教材/////////////////
                        foreach (var book in AddList)
                        {
                            clr_electronic_book model = new clr_electronic_book();
                            model.BookID = book.ID;
                            model.SubjectID = book.Subject;
                            model.EditionID = book.Edition;
                            model.GradeID = book.Grade;
                            model.BookType = book.BookType;
                            model.Stage = book.Stage;
                            model.UserID = submitData.UserID;
                            model.CreateDate = DateTime.Now;
                            db.clr_electronic_book.Add(model);
                        }
                        db.SaveChanges();
                    }
                }
                return SyncResponse.GetResponse(request, true);
            }
            catch (Exception ex)
            {
                return SyncResponse.GetErrorResponse(ex.Message);
            }
        }

        /// <summary>
        /// 根据用户账号获取用户信息
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        private SyncResponse GetUserInfoList(SyncRequest request)
        {
            UserInfo submitData = JsonHelper.DecodeJson<UserInfo>(request.Data);
            HttpClient myHttpClient = new HttpClient();
            myHttpClient.BaseAddress = new Uri(webapi_url);
            HttpResponseMessage response = myHttpClient.GetAsync("GetUserInfo/" + submitData.UserAccount).Result;
            string json = null;
            if (response.IsSuccessStatusCode)
            {
                json = response.Content.ReadAsStringAsync().Result;
            }
            return SyncResponse.GetResponse(request, json);
        }
        /// <summary>
        /// 根据GUID获取用户账号
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        private SyncResponse GetUserInfoByGuid(SyncRequest request)
        {
            UserInfo submitData = JsonHelper.DecodeJson<UserInfo>(request.Data);

            HttpClient myHttpClient = new HttpClient();
            myHttpClient.BaseAddress = new Uri(webapi_url);
            HttpResponseMessage response = myHttpClient.GetAsync("GetAccount?ticket=" + submitData.UserAccount + "&ip=" + submitData.IP).Result;
            string UserInfolist = response.Content.ReadAsStringAsync().Result;
            return SyncResponse.GetResponse(request, UserInfolist);
        }

        /// <summary>
        /// 查询SelectBook页面操作数据
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        private SyncResponse SelectInitData(SyncRequest request)
        {
            clr_pageInit submitData = JsonHelper.DecodeJson<clr_pageInit>(request.Data);
            using (var db = new fz_wisdomcampusEntities())
            {
                List<clr_pageInit> list = db.clr_pageInit.Where(p => p.UserID == submitData.UserID && p.AspxName == submitData.AspxName).ToList();
                return SyncResponse.GetResponse(request, list);
            }
        }
        /// <summary>
        /// 保存SelectBook页面操作数据
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        private SyncResponse SaveInitData(SyncRequest request)
        {
            clr_pageInit submitData = JsonHelper.DecodeJson<clr_pageInit>(request.Data);
            using (var db = new fz_wisdomcampusEntities())
            {
                db.clr_pageInit.Add(submitData);
                db.SaveChanges();
                return SyncResponse.GetResponse(request, true);
            }
        }

        /// <summary>
        /// 更新SelectBook页面操作数据
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        private SyncResponse UpdateInitData(SyncRequest request)
        {
            clr_pageInit submitData = JsonHelper.DecodeJson<clr_pageInit>(request.Data);
            using (var db = new fz_wisdomcampusEntities())
            {
                List<clr_pageInit> list = db.clr_pageInit.Where(p => p.UserID == submitData.UserID && p.AspxName == submitData.AspxName).ToList();
                foreach (var item in list)
                {
                    item.GradeID = submitData.GradeID;
                    item.ClassID = submitData.ClassID;
                    item.SubjectID = submitData.SubjectID;
                    item.EditionID = submitData.EditionID;
                    item.BookType = submitData.BookType;
                    item.Stage = submitData.Stage;
                    item.BookID = submitData.BookID;
                    item.CreateTime = submitData.CreateTime;
                }
                db.SaveChanges();
                return SyncResponse.GetResponse(request, true);
            }
        }

        /// <summary>
        /// 查询Teaching页面操作数据
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        private SyncResponse SelectTeachingData(SyncRequest request)
        {
            clr_pageInit submitData = JsonHelper.DecodeJson<clr_pageInit>(request.Data);
            using (var db = new fz_wisdomcampusEntities())
            {
                List<clr_pageInit> list = db.clr_pageInit.Where(
                    p => p.UserID == submitData.UserID &&
                    p.BookID == submitData.BookID &&
                    p.ClassID == submitData.ClassID &&
                    p.AspxName == submitData.AspxName
                    ).ToList();
                return SyncResponse.GetResponse(request, list);
            }
        }
        /// <summary>
        /// 保存Teaching页面操作数据
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        private SyncResponse SaveTeachingData(SyncRequest request)
        {
            clr_pageInit submitData = JsonHelper.DecodeJson<clr_pageInit>(request.Data);
            using (var db = new fz_wisdomcampusEntities())
            {
                db.clr_pageInit.Add(submitData);
                db.SaveChanges();
                return SyncResponse.GetResponse(request, true);
            }
        }

        /// <summary>
        /// 更新Teaching页面操作数据
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        private SyncResponse UpdateTeachingData(SyncRequest request)
        {
            clr_pageInit submitData = JsonHelper.DecodeJson<clr_pageInit>(request.Data);
            using (var db = new fz_wisdomcampusEntities())
            {
                clr_pageInit item = db.clr_pageInit.Where(
                    p => p.UserID == submitData.UserID &&
                    p.ClassID == submitData.ClassID &&
                    p.BookID == submitData.BookID &&
                    p.AspxName == submitData.AspxName
                    ).OrderByDescending(o=>o.CreateTime).FirstOrDefault();               
                    item.UnitID = submitData.UnitID;
                    item.PageNum = submitData.PageNum;
                    item.CreateTime = submitData.CreateTime;
                    item.UnitName = submitData.UnitName;                
                db.SaveChanges();
                return SyncResponse.GetResponse(request, true);
            }
        }

        /// <summary>
        /// 查询页面备课数据从智慧教室后台
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        private SyncResponse SelBookPageData(SyncRequest request)
        {
            BookInfo submitData = JsonHelper.DecodeJson<BookInfo>(request.Data);
            //List<int> pages = new List<int>(submitData.Pages);
            using (var db = new fz_wisdomcampusEntities())
            {
                List<clr_preLesson> list = db.clr_preLesson.Where(
                    p => p.UserID == submitData.UserID &&
                    p.BookID == submitData.BookID &&
                    submitData.Pages.Contains((int)p.Page)
                    ).ToList();
                return SyncResponse.GetResponse(request, list);
            }
        }

        /// <summary>
        /// 查询备课表中缺少的水滴数据从智慧校园接口
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        private SyncResponse GetTextBookResource(SyncRequest request)
        {
            BookInfo submitData = JsonHelper.DecodeJson<BookInfo>(request.Data);
            HttpClient myHttpClient = new HttpClient();
            myHttpClient.BaseAddress = new Uri(webapi_url);
            HttpResponseMessage response = myHttpClient.GetAsync("TextbookResource?bookId=" + submitData.BookID + "&pages=" + string.Join("_", submitData.Pages)).Result;
            if (response.IsSuccessStatusCode)
            {
                string json = response.Content.ReadAsStringAsync().Result;

                return SyncResponse.GetResponse(request, json);
            }
            else
            {
                return SyncResponse.GetResponse(request, null);
            }
        }
        /// <summary>
        /// 保存用户操作记录
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        private SyncResponse SaveOperData(SyncRequest request)
        {
            UserOperData submitData = JsonHelper.DecodeJson<UserOperData>(request.Data);
            HttpClient myHttpClient = new HttpClient();
            myHttpClient.BaseAddress = new Uri(webapi_url);//webapi_url

            string json = JsonHelper.DeepEncodeJson(submitData);
            var content = new StringContent(json, Encoding.UTF8);
            content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            HttpResponseMessage response = myHttpClient.PostAsync("ClrLogMonitorWeb_Add", content).Result;
            return SyncResponse.GetResponse(request, response.IsSuccessStatusCode);
        }
        /// <summary>
        /// 检查用户账号密码
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public SyncResponse CheckLoad(SyncRequest request)
        {
            UserInfo submitData = JsonHelper.DecodeJson<UserInfo>(request.Data);
            HttpClient myHttpClient = new HttpClient();
            myHttpClient.BaseAddress = new Uri(webapi_url);
            //myHttpClient.BaseAddress = new Uri(webapi_url);
            HttpResponseMessage response = myHttpClient.GetAsync("CheckLogin?account=" + submitData.UserAccount + "&password=" + submitData.UserPassword).Result;
            string json = "-4";
            if (response.IsSuccessStatusCode)
            {
                json = response.Content.ReadAsStringAsync().Result;
            }
            return SyncResponse.GetResponse(request, json);
        }
        /// <summary>
        /// 检查用户账号密码
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public SyncResponse CheckLoadDF(SyncRequest request)
        {
            UserInfo submitData = JsonHelper.DecodeJson<UserInfo>(request.Data);
            HttpClient myHttpClient = new HttpClient();
            myHttpClient.BaseAddress = new Uri(webapi_url);
            string Pswd = DES.Decrypt(submitData.UserPassword);//密码解密
            //myHttpClient.BaseAddress = new Uri(webapi_url);
            HttpResponseMessage response = myHttpClient.GetAsync("CheckLogin?account=" + submitData.UserAccount + "&password=" + Pswd).Result;
            string json = "-4";
            if (response.IsSuccessStatusCode)
            {
                json = response.Content.ReadAsStringAsync().Result;
            }
            return SyncResponse.GetResponse(request, json);
        }
        private SyncResponse SelExercises(SyncRequest request)
        {
            clr_exercises submitData = JsonHelper.DecodeJson<clr_exercises>(request.Data);
            using (var db = new fz_wisdomcampusEntities())
            {
                List<clr_exercises> list = db.clr_exercises.Where(e => e.UserID == submitData.UserID).ToList();
                return SyncResponse.GetResponse(request, list);
            }
        }
        private SyncResponse InsertExercises(SyncRequest request)
        {
            clr_exercises submitData = JsonHelper.DecodeJson<clr_exercises>(request.Data);
            using (var db = new fz_wisdomcampusEntities())
            {
                db.clr_exercises.Add(submitData);
                db.SaveChanges();
                return SyncResponse.GetResponse(request, true);
            }
        }
        private SyncResponse UpdateExercises(SyncRequest request)
        {
            clr_exercises submitData = JsonHelper.DecodeJson<clr_exercises>(request.Data);
            using (var db = new fz_wisdomcampusEntities())
            {
                List<clr_exercises> list = db.clr_exercises.Where(e => e.UserID == submitData.UserID).ToList();
                if (list != null)
                {
                    foreach (var item in list)
                        item.Resources = submitData.Resources;
                    db.SaveChanges();
                    return SyncResponse.GetResponse(request, true);
                }
                else
                {
                    return SyncResponse.GetResponse(request, false);
                }
            }
        }
    }
}