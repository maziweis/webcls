using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Kingsun.SmarterClassroom.Com;
using Kingsun.SmarterClassroom.BLL;
using Kingsun.SmarterClassroom.Mod;
//using Kingsun.SmarterClassroom.API.BasicService;

namespace SmarterClassroomWeb
{
    public partial class Login : System.Web.UI.Page
    {
        public string Pswd1;
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                HttpCookie act = Request.Cookies["clsaccount"];
                HttpCookie pswd = Request.Cookies["clspassword"];
                //HttpCookie act2 = Request.Cookies["act"];
                if (pswd != null)
                {
                    //this.txt_Account.Value = act.Value;
                    Pswd1 = DES.Decrypt(pswd.Value);//密码解密
                                                    //this.txt_Password.Value = Pswd1;
                }
            }
        }

        public C_UserInfo userInfo;
        public string Info;
        public string clspswd;
        protected void btn_Login_Click(object sender, EventArgs e)
        {
            LoginBLL login = new LoginBLL();
            string account = this.txt_Account.Value;
            string Pswd = this.txt_Password.Value;

            userInfo = login.GetUserInfo(account);
            Info = JsonHelper.EncodeJson(userInfo);
            string name = userInfo.Name;
            Response.Cookies["t"].Value = name;
            Response.Cookies["clsaccount"].Value = account;
            string pswd = DES.Encrypt(Pswd);//密码加密
            Response.Cookies["clspassword"].Value = pswd;
            clspswd = pswd;
            Response.Cookies["clsaccount"].Expires = DateTime.Now.AddDays(7);
            Response.Cookies["clspassword"].Expires = DateTime.Now.AddDays(7);
            Response.Cookies["t"].Expires = DateTime.Now.AddDays(7);
            //将用户信息保存到Session
            ClientScript.RegisterStartupScript(ClientScript.GetType(), "script", "SaveUerInfo()", true);
        }       
    }
}