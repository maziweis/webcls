using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace SmarterClassroomWeb.Handler
{
    /// <summary>
    /// FileUploadHandler 的摘要说明
    /// </summary>
    public class FileUploadHandler : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {

            foreach (string fieldName in context.Request.Files.AllKeys)
            {
                HttpPostedFile file = context.Request.Files[fieldName];
                //////////保存图片到本地/////////////
                string fileUrl = GetSavePath(context)+"\\"+file.FileName;
                string imgUrl = fileUrl;
                file.SaveAs(fileUrl);

                //////////删除本地图片/////////////
                if (File.Exists(fileUrl))
                {
                    File.Delete(fileUrl);
                }
            }
            string Json = "{\"code\":0}";
            context.Response.Write(Json);
        }
        private string GetSavePath(HttpContext context)
        {
            string topDir = context.Server.MapPath("../UpLoad");
            string dayDir = System.IO.Path.Combine(topDir, DateTime.Now.ToString("yyyy\\\\MM\\\\dd"));
            if (!Directory.Exists(dayDir))
            {
                Directory.CreateDirectory(dayDir);
            }
            return dayDir;
        }
        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}