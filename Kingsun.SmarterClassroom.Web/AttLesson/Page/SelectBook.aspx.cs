using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Kingsun.SmarterClassroom.BLL;
using Kingsun.SmarterClassroom.Mod;

namespace SmarterClassroomWeb.AttLesson.Page
{
    public partial class SelectBook : System.Web.UI.Page
    {
        public string IP;
        public string MyConn;
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                string url = Request.Url.Query;
                int type;
                if (url == "")
                {
                    type = 0;
                }
                else
                {
                    type = int.Parse(url.Substring(6, 1));
                }
                MyConn = System.Configuration.ConfigurationManager.AppSettings["WebApiUrl"].ToString();
                HttpCookie cookie = Request.Cookies["t"];
                if (cookie == null)
                {
                    //Response.Redirect("../../Login.aspx");
                }
                IP = GetIp(Request);
            }
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