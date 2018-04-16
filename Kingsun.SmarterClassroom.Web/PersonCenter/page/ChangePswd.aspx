<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ChangePswd.aspx.cs" Inherits="SmarterClassroomWeb.PersonCenter.ChangePswd" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />   
    <link rel="stylesheet" href="../../App_Theme/css/page.css" />
    <title>修改密码</title>
    <style type="text/css">
        body{background-color:#fff;}
    </style>
</head>
<body onselectstart="return false;">
    <header class="headTitle"><a class="goback fl ifhide" id="btnBlack" href="../Index1.aspx"><i></i>返回</a><label>修改密码</label></header>
    <form id="form1" runat="server">
   <div class="centerMain">
        <ul class="updatePws" style="display:block;">
            <li><i></i><label>旧密码</label><span class="inputSpan"><input id="opswd" type="password" placeholder="请输入当前密码"/></span>
            </li>
            <li><i></i><label>新密码</label><span class="inputSpan"><input id="npswd" type="password" placeholder="请输入6-16位新密码"/></span>
            </li>
            <li><i></i><label>确认密码</label><span class="inputSpan"><input id="npswd1" type="password" placeholder="请再次输入新密码"/></span>
            </li>
            <li class="tc"><button type="button" class="submit" onclick="ChangePswd()">确定</button></li>
        </ul>
       <div class="successTip" style="display:none;">
           <p><i></i><label>恭喜你，密码修改成功！</label></p>
           <p><a href="../../Login.aspx" class="newLoginBtn" id="newLoginBtn">使用新密码重新登录</a></p>
       </div>
    </div>
    </form>
    <script src="../../CommonJs/jquery/jquery-1.11.2.min.js"></script>
    <script src="../../CommonJs/jquery/jquery.json-2.4.js"></script>
    <script src="../../CommonJs/CommonDB/CommonDB.js"></script>
    <script src="../../CommonJs/CommonJS/CommonFuncJS.js"></script>
    <script src="../js/ChangePswd.js"></script>
</body>
</html>
