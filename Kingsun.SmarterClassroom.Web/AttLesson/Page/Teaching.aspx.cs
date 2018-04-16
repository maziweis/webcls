using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace SmarterClassroomWeb.AttLesson.Page
{
    public partial class Teaching : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            object cookie = Request.Cookies["t"];
            if (cookie == null)
            {
                //string myConn = System.Configuration.ConfigurationManager.AppSettings["WebApiUrl"].ToString();
                //Response.Redirect(myConn);
                Response.Redirect("../../Login.aspx");
            }            
        }
    }
}