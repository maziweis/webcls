using Kingsun.SmarterClassroom.Com;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace SmarterClassroomWeb.CommonPage.Page
{
    public partial class Head : System.Web.UI.UserControl
    {
        public string UserName;
        public string IP;
        public string MyConn;
        public string InitFirstCata;
        protected void Page_Load(object sender, EventArgs e)
        {
            string type = HTRequest.GetQueryString("type");
            string url = Request.Url.Query;
            if (!string.IsNullOrEmpty(type))
            {
                type = url.Substring(6, 1);
            }
            MyConn = System.Configuration.ConfigurationManager.AppSettings["WebApiUrl"].ToString();
            InitFirstCata = System.Configuration.ConfigurationManager.AppSettings["InitFirstCata"].ToString();
            HttpCookie cookie = Request.Cookies["t"];
            if (cookie == null)
            {
                if (type == "1")
                {
                    //Response.Redirect(MyConn);
                }
                else {
                    //Response.Redirect("../../Login.aspx");
                }
            }
            IP = GetIp(Request);
        }
        /// <summary>
        /// 获取访问者IP
        /// </summary>
        /// <returns></returns>
        public static string GetIp(HttpRequest Request)
        {
            string ip = "";

            if (Request.ServerVariables["HTTP_X_FORWARDED_FOR"] != "")// 如果使用代理，获取真实IP  
            {
                ip = Request.ServerVariables["REMOTE_ADDR"];
            }
            else
            {
                ip = Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
            }

            if (ip == null || ip == "")
            {
                ip = Request.UserHostAddress;
            }

            return ip;
        }
    }
}