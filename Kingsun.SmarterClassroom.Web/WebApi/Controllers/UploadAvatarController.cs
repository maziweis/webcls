using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Web;
using System.Web.Http;
using WebApi.Models;
using System.Web.Script.Serialization;
namespace WebApi.Controllers
{
    public class UploadAvatarController : ApiController
    {
        [HttpPost]
        public string Post(string id)
        {
            //WebClient client = new WebClient();
            //string SchoolUrl = System.Configuration.ConfigurationManager.AppSettings["SchoolUrl"].ToString();
            //byte[] bt = client.UploadFile(SchoolUrl + "api/UploadAvatar/" + avatar.UserID, null, avatar.FilePath);
            //string temp = System.Text.Encoding.UTF8.GetString(bt);
            //List<string> ls = temp.Split(',').ToList();
            //List<string> ls1 = ls[4].Split('\"').ToList();
            //return ls1[3];
            //UploadAvatar
            
            string PrePath = System.Web.Hosting.HostingEnvironment.MapPath("~/KingsunFiles/AvatarFile");
            KingResponse response;
            string Extension="";
            try
            {
                HttpFileCollection files = HttpContext.Current.Request.Files;
                HttpPostedFile file = files[files.AllKeys[0]];
                if (!string.IsNullOrEmpty(file.FileName))
                {
                    if (!Directory.Exists(PrePath))
                    {
                        Directory.CreateDirectory(PrePath);
                    }
                    Extension = Path.GetExtension(file.FileName);
                    //////////////重新命名文件名///////////////
                    PrePath = PrePath + "\\" + id + Extension;
                    try
                    {
                        if (File.Exists(PrePath))
                        {
                            File.Delete(PrePath);
                        }
                        file.SaveAs(PrePath);
                    }
                    catch (Exception ex)
                    {
                        response = KingResponse.GetErrorResponse("保存文件失败:" + ex.Message);
                        //return response;
                    }
                    //response = UploadAvatarFile(file, PrePath, id);
                }
                else
                {
                    response = KingResponse.GetErrorResponse("文件不存在！");
                }

            }
            catch
            {
                response = KingResponse.GetErrorResponse("处理过程中出现错误！");
                //return response;
            }
            string FilePath = string.Format("{0}/{1}/{2}{3}", System.Configuration.ConfigurationManager.AppSettings["FileAddress"].ToString(), "KingsunFiles/AvatarFile", id, Extension);
            //JavaScriptSerializer serializer = new JavaScriptSerializer();
            //string str = serializer.Serialize(FilePath);
            //HttpResponseMessage result = new HttpResponseMessage { Content = new StringContent(str, Encoding.GetEncoding("UTF-8"), "application/json") };
            //return result;
            string strGUID = System.Guid.NewGuid().ToString();
            return FilePath+"?ranM="+strGUID;
            //return response;
        }



        /// <summary>
        /// 用户头像上传
        /// </summary>
        /// <param name="file"></param>
        /// <param name="uploaPath"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public static KingResponse UploadAvatarFile(HttpPostedFile file, string uploaPath, string id)
        {
            KingResponse response;
            if (!Directory.Exists(uploaPath))
            {
                Directory.CreateDirectory(uploaPath);
            }
            string Extension = Path.GetExtension(file.FileName);
            //////////////重新命名文件名///////////////
            uploaPath = uploaPath + "\\" + id + Extension;
            try
            {
                if (File.Exists(uploaPath))
                {
                    File.Delete(uploaPath);
                }
                file.SaveAs(uploaPath);
            }
            catch (Exception ex)
            {
                //response = KingResponse.GetErrorResponse("保存文件失败:" + ex.Message);
                //return response;
            }
            Extension = Extension.Remove(Extension.IndexOf('.'), 1);
            response = KingResponse.GetResponse(null, new
            {
                ID = id,
                FileName = file.FileName.Substring(0, file.FileName.IndexOf('.')),
                //FilePath = string.Format("{0}/{1}/{2}.{3}", GetFileServerHttp(), "KingsunFiles/AvatarFile", id, Extension)
                 FilePath = string.Format("{0}/{1}/{2}{3}", System.Configuration.ConfigurationManager.AppSettings["FileAddress"].ToString(), "KingsunFiles/AvatarFile", id, Extension)
        });
            return response;
        }
    }
}



