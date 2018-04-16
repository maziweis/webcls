using Kingsun.SmarterClassroom.API.BasicService;
using Kingsun.SmarterClassroom.Com;
using Kingsun.SmarterClassroom.Mod;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SmarterClassroomWeb
{
    /// <summary>
    /// BasicHandler 的摘要说明
    /// 1.通过webservice接口从智慧校园获取基础数据
    /// 2.暂时弃用
    /// </summary>
    public class BasicHandler : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.AddHeader("Access-Control-Allow-Origin", "*");
            string type = context.Request.Form["t"];
            context.Response.Write(context.Request.QueryString["callback"]);
            context.Response.Write("(");
            switch (type)
            {
                case "ED":
                    GetEditionList(context);
                    break;
                case "GRADE":
                    GetGradeList(context);
                    break;
                case "SUB":
                    GetSubjectList(context);
                    break;
                default:
                    break;
            }
            context.Response.Write(")");
            context.Response.End();
            return;
        }
        /// <summary>
        /// 获取科目数据
        /// </summary>
        /// <param name="context"></param>
        private void GetSubjectList(HttpContext context)
        {
            BasicServiceClient basicWebService = new BasicServiceClient();
            Dictionary<int, string> subDic = basicWebService.GetSubjectDict();
            List<Subject> subList = subDic.Select(s => new Subject { ID = s.Key, CodeName = s.Value }).ToList();

            string Json = "{\"SUB\":" + JsonHelper.EncodeJson(subList) + "}";

            context.Response.Write(Json);
        }

        /// <summary>
        /// 获取年级
        /// </summary>
        /// <param name="context"></param>
        private void GetGradeList(HttpContext context)
        {
            BasicServiceClient basicWebService = new BasicServiceClient();
            Dictionary<int, string> graDic = basicWebService.GetGradeDict();
            List<Grade> graList = graDic.Select(s => new Grade { ID = s.Key, CodeName = s.Value }).ToList();

            string Json = "{\"GRADE\":" + JsonHelper.EncodeJson(graList) + "}";

            context.Response.Write(Json);
        }

        /// <summary>
        /// 获取版本
        /// </summary>
        private void GetEditionList(HttpContext context)
        {
            BasicServiceClient basicWebService = new BasicServiceClient();
            Dictionary<int, string> ediDic = basicWebService.GetEditionDict();
            List<Edition> ediList = ediDic.Select(s => new Edition { ID = s.Key, CodeName = s.Value }).ToList();
            
            string Json ="{\"ED\":"+JsonHelper.EncodeJson(ediList)+"}";

            context.Response.Write(Json);
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