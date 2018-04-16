<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="DefaultW.aspx.cs" Inherits="SmarterClassroomWeb.DefaultW" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
    <script src="CommonJs/jquery/jquery-1.10.2.min.js"></script>
    <script src="CommonJs/jquery/jquery.json-2.4.js"></script>
    <script src="AttLesson/Js/Management/TeachLessonManage.js"></script>
    <script src="CommonJs/CommonDB/CommonDB.js"></script>
    <%--<script src="App_Theme/js/common.js"></script>--%>
</head>
<body onselectstart="return false;">
    <form id="form1" runat="server">
    <div>
    <p class="data"></p>
    </div>
    </form>
    <script type="text/javascript">
        $(function () {
            //大小同屏时从windows壳获取数据
            var data = callHostFunction.getUserEKLoginData();
            var data11 = JSON.parse(data);
            var account = data11.account;
            var passward = data11.password;
            var param = data11.param;
            //var isTrue = teachLessonManage.CheckLoadDF(account, passward);
            //if (isTrue != 1) {
            //    window.location.href = "Login.aspx";
            //}
            //else {
                var userInfo = teachLessonManage.GetUserInfoList(account);
                toSelectAspx(userInfo, param);
            //}            
        });
       
        function toSelectAspx(userInfo, param) {
            var uInfoObj =JSON.parse(userInfo);
            var account = uInfoObj.Account;
            setDataF("UserAccount", account);
            setDataF("UserInfo", uInfoObj);
            //var UserInfoJson = getDataF("UserInfo");
            writeCookie("t", uInfoObj.Name, 168);
            window.location.href = param;
        }
        //用sessionStorage储存数据
        function setDataF(key, value) {
            // 存储值：将对象转换为Json字符串 
            sessionStorage.setItem(key, JSON.stringify(value));
        }
        //用sessionStorage取数据
        function getDataF(key) {
            // 取值时：把获取到的Json字符串转换回对象 
            var data = sessionStorage.getItem(key);
            var dataObj = JSON.parse(data);
            return dataObj;
        };
        function writeCookie(name, value, hours) //name表示写入的变量，Value表示name变量的值，hours表示保存时间。
        {
            var expire = "";
            if (hours != null) {
                expire = new Date((new Date()).getTime() + hours * 3600000);
                expire = "; expires=" + expire.toGMTString();
            }
            document.cookie = name + "=" + escape(value) + expire + ";path=/";
        }
    </script>
</body>
</html>
