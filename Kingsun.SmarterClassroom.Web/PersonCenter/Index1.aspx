<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Index1.aspx.cs" Inherits="SmarterClassroomWeb.PersonCenter.Index" %>

<%@ Register Src="~/CommonPage/Page/Head.ascx" TagPrefix="uc1" TagName="Head" %>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
    <link rel="stylesheet" href="../../App_Theme/css/page.css" />
    <link href="../App_Theme/css/swiper-3.4.2.min.css" rel="stylesheet" />
    <title>个人中心</title>
    <style type="text/css">
        body {
            background-color: #fff;
        }
    </style>
</head>
<body onselectstart="return false;">
    <div id="loadingDiv"><i></i></div>
    <uc1:Head runat="server" ID="Head" />
    <header class="headTitle"><a class="goback fl ifhide" id="btnBlack" href="../../index.aspx"><i></i>返回</a><label>个人中心</label><a class="glines"><i></i>新手教程</a></header>
    <div class="centerMain">
        <div class="userTop">
            <img src="../App_Theme/images/defaultHead.png" onclick="ChangePhoto()" alt="用户头像" class="userHead" />
            <h3>
                <label></label><b></b></h3>
            <p></p>
        </div>
        <div class="userNav">
            <ul>
                <li class="pswLi"><a href="page/ChangePswd.aspx">修改密码<i class="rightArrow"></i></a></li>
                <li class="versionLi">当前版本<i class="versionNum">V1.2</i></li>
                <li class="helpLi"><a href="page/HelpCenter.aspx">帮助中心<i class="rightArrow"></i></a></li>
                <li class="classLi"><a href="page/MyClass.aspx">我的班级<i class="rightArrow"></i></a></li>
            </ul>
            <p><a class="exit">退出账号</a></p>
        </div>
    </div>
    <p class="footNumber">联系客服：400-111-8080</p>
    <script src="../App_Theme/js/jquery-1.10.2.min.js"></script>
    <script src="../CommonJs/jquery/jquery.json-2.4.js"></script>
    <script src="../App_Theme/js/swiper-3.4.2.jquery.min.js"></script>
    <script src="../CommonJs/CommonDB/CommonDB.js"></script>
    <script src="../CommonJs/CommonJS/CommonFuncJS.js"></script>
    <script src="js/Index.js"></script>
    
</body>
</html>
