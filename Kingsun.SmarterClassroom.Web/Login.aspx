<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Login.aspx.cs" Inherits="SmarterClassroomWeb.Login" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
    <meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
    <%--<link href="App_Theme/css/base.css" rel="stylesheet" />--%>
    <link href="App_Theme/css/page.css" rel="stylesheet" />
    <title>登录</title>
</head>
<body class="bgImg" onselectstart="return false;">
    <div id="loadingDiv"<%-- style="display:none"--%>><i></i></div>
    <form id="form1" runat="server">
        <div style="display:none" id="userInfo"><%=Info %></div>
        <div style="display:none" id="pswd1"><%=Pswd1 %></div>
        <div style="display:none" id="pswd2"><%=clspswd %></div>
        <div class="fixedHeight">
        <div class="loginBox">
            <a class="set" onclick="setIpAndPort()" style="display:none"></a>
            <ul>
                <li class="user">
                    <span>
                        <input type="text" id="txt_Account" placeholder="账号" value="" spellcheck="false" runat="server" autocomplete="off"/></span>
                    <p class="validationTip" id="account"></p>
                </li>
                <li class="pass">
                    <span>
                        <input type="password" id="txt_Password" placeholder="密码" value="" runat="server"/></span>
                    <p class="validationTip" runat="server" id="password"></p>
                </li>
            </ul>
            <p class="pS1">忘记密码请联系学校管理员！</p>
            <p class="pS2">
                <asp:Button class="loginBtn" ID="btn_Login" runat="server" Text="登 录" OnClick="btn_Login_Click" OnClientClick="return SaveAccount()"/>
              <%--<a class="loginBtn" href="index.html">登录</a>--%>
            </p>
        </div> 
      </div>
        <div class="copyRight">&copy;&nbsp;2017&nbsp;&nbsp;&nbsp;&nbsp;深圳市方直科技股份有限公司</div>
        <script src="App_Theme/js/jquery-1.10.2.min.js"></script>
        <script src="CommonJs/jquery/jquery.json-2.4.js"></script>
        <script src="CommonJs/CommonDB/CommonDB.js"></script>
        <script src="CommonJs/CommonJS/CommonFuncJS.js"></script>
        <script src="AttLesson/Js/Management/TeachLessonManage.js"></script>
        <script src="PreLesson/Js/Management/PreLessonManagement.js"></script>
        <script src="App_Theme/js/exit.js"></script>
         <%--先加载功能库文件，分担备课页面压力--%>
        <script src="App_Theme/js/audioControls.js"></script>
        <script src="App_Theme/js/KJajaxUpload.js"></script>
        <script>
            $(function () {
                $(".fixedHeight").css("min-height", $(window).height() - $(".copyRight").height() - 20);
                $(".copyRight").css("position", "static");
                if (commonFuncJS.OS.isTablet && !commonFuncJS.OS.isAndroid) {
                    $("#txt_Password,.pass span").focus(function () {
                            $("html,body").animate({ scrollTop: 180 }, 200);
                    })
                }
            })
            //loading加载···
            $(window).load(function () {
                $('#loadingDiv').hide();
            })
        </script>
    </form>
</body>
</html>
