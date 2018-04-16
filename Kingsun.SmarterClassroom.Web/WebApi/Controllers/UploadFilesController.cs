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
    public class UploadFilesController : ApiController
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
            //string id1 = param.UserID;
            string PrePath = System.Web.Hosting.HostingEnvironment.MapPath("~/KingsunFiles/AvatarFile");
            KingResponse response;
            string Extension = "";
            try
            {
                HttpFileCollection files = HttpContext.Current.Request.Files;
                string sds = HttpContext.Current.Request.Form.ToString();
                //data =% 7b % 22BookID % 22 % 3a % 22413 % 22 % 2c % 22SubjectID % 22 % 3a % 221 % 22 % 2c % 22UnitID % 22 % 3a % 22300014 % 22 % 2c % 22UserID % 22 % 3a % 22f46fff02 - 9e9d - 46fa - 88c0 - a81bbf3927c0 % 22 % 7d % 0a
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
                        WebClient client = new WebClient();
                        string SchoolUrl = System.Configuration.ConfigurationManager.AppSettings["SchoolUrl"].ToString();
                        byte[] bt = client.UploadFile(SchoolUrl + "api/UploadAvatar/" + id, null, PrePath);
                        File.Delete(PrePath);
                        string temp = System.Text.Encoding.UTF8.GetString(bt);
                        List<string> ls = temp.Split(',').ToList();
                        List<string> ls1 = ls[4].Split('\"').ToList();
                        string strGUID1 = System.Guid.NewGuid().ToString();
                        return ls1[3] + "?ranM=" + strGUID1;
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
            catch(Exception e)
            {
                response = KingResponse.GetErrorResponse(e.Message);
                //return response;
            }
            string FilePath = string.Format("{0}/{1}/{2}{3}", System.Configuration.ConfigurationManager.AppSettings["FileAddress"].ToString(), "KingsunFiles/AvatarFile", id, Extension);
            //JavaScriptSerializer serializer = new JavaScriptSerializer();
            //string str = serializer.Serialize(FilePath);
            //HttpResponseMessage result = new HttpResponseMessage { Content = new StringContent(str, Encoding.GetEncoding("UTF-8"), "application/json") };
            //return result;
            string strGUID = System.Guid.NewGuid().ToString();
            return FilePath + "?ranM=" + strGUID;
            //return response;
        }
    }
}
