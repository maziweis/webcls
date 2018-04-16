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
    /// ReceiveHandler 的摘要说明
    /// 1.通过webservice接口从智慧校园获取数据
    /// 2.暂时弃用
    /// </summary>
    public class ReceiveHandler : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.AddHeader("Access-Control-Allow-Origin", "*");
            string Json = "";
            string filepath=context.Request.AppRelativeCurrentExecutionFilePath;
            if (filepath.IndexOf("GetCatalogByBookId")!=-1)
            {
                Json = GetCatalogByBookID(context);
            }
            else if (filepath.IndexOf("GetSBListByStages") != -1)
            {
                Json = GetStandBook(context);
            }
            else if (filepath.IndexOf("GetResourceByCatalogIds") != -1)
            {
                Json = GetResourceByCatalogIds(context);
            }
            context.Response.Write(context.Request.QueryString["callback"]);
            context.Response.Write("(");
            context.Response.Write(Json);
            context.Response.Write(")");
            context.Response.End();
            return;
        }

        private string GetResourceByCatalogIds(HttpContext context)
        {
            string Json=null;
            string cataIDs = context.Request["t[CatalogIds]"];
            string classID = context.Request["t[ResourceClass]"];
            string keys = context.Request["t[Keys]"];
            string subjectID = context.Request["t[Subject]"];
            BasicServiceClient basicWebService = new BasicServiceClient();
            R_Resource[] resourcelist = null;
            if (classID == "资源检索")
                resourcelist = basicWebService.GetResourceByKey(keys, Utils.StrToInt(subjectID, 0));
            else if(classID == null)
                resourcelist = basicWebService.GetResourceByCatalogIds(cataIDs, null);
            else
                resourcelist = basicWebService.GetResourceByCatalogIds(cataIDs, Utils.StrToInt(classID, 0));
            List<R_Resource> list = new List<R_Resource>();
            list = resourcelist.ToList();
            Json = "{\"Data\":" + JsonHelper.JsonSerializer(list) + "}";
            return Json;
        }

        private string GetCatalogByBookID(HttpContext context)
        {
            string Json;
            string bookID = context.Request["t[BookId]"];
            BasicServiceClient basicWebService = new BasicServiceClient();
            C_TextbookCatalog[] cataList = basicWebService.GetTextbookCatalogDict(Utils.StrToInt(bookID, 0));

            List<Catalog> list = new List<Catalog>();
            foreach (var item in cataList)
            {

                if (item.PId == 0)
                {
                    Catalog model = new Catalog();
                    model.id = item.Id;
                    model.title = item.Name;
                    list.Add(model);
                }
                else
                {
                    AddChildren(list, item);
                }
            }
            Json =JsonHelper.JsonSerializer(list);
            return Json;
        }

        private void AddChildren(List<Catalog> list, C_TextbookCatalog item)
        {
            foreach (var cata in list)
            {
                
                if (cata.id == item.PId)
                {
                    Catalog model = new Catalog();
                    model.id = item.Id;
                    model.title = item.Name;
                    cata.children.Add(model);
                }
                else
                {
                    if (cata.children != null)
                    {
                        AddChildren(cata.children, item);
                    }
                }
            }
        }

        /// <summary>
        /// 获取教材
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        private static string GetStandBook(HttpContext context)
        {
            string Json;
            string stage = context.Request["t[Stage]"];
            string subject = context.Request["t[Subject]"];
            string grade = context.Request["t[Grade]"];
            string edition = context.Request["t[Edition]"];
            string booklet = context.Request["t[Booklet]"];

            BasicServiceClient basicWebService = new BasicServiceClient();
            C_Textbook[] standbookList = basicWebService.GetTextbookDict(Utils.StrToInt(stage, 0), Utils.StrToInt(subject, 0), Utils.StrToInt(grade, 0), Utils.StrToInt(booklet, 0), Utils.StrToInt(edition, 0));

            List<StandBook> list = new List<StandBook>();
            foreach (var item in standbookList)
            {
                StandBook model = new StandBook();
                model.ID = item.Id;
                model.Stage = item.Stage;
                model.Subject = item.Subject;
                model.Grade = item.Grade;
                model.Edition = item.Edition;
                model.Booklet = item.Booklet;
                model.BooKName = item.BookName;
                model.BookCover = item.BookCover;
                list.Add(model);
            }
            Json = "{\"Data\":" + JsonHelper.JsonSerializer(list) + "}";
            return Json;
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