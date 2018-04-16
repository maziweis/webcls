<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="MyClass.aspx.cs" Inherits="SmarterClassroomWeb.PersonCenter.MyClass" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />   
    <link rel="stylesheet" href="../../App_Theme/css/page.css" />
    <title>我的班级</title>
</head>
<body onselectstart="return false;">
    <header class="headTitle"><a class="goback fl ifhide" id="btnBlack" href="../Index1.aspx"><i></i>返回</a><label>我的班级</label></header>
    <form id="form1" runat="server">
    <div class="classList">
        <ul>
           
        </ul>
        <div class="comingSoon" style="display:none"></div>
    </div>
    </form>
    
    <script src="../../CommonJs/jquery/jquery-1.11.2.min.js"></script>
    <script src="../../CommonJs/jquery/jquery.json-2.4.js"></script>
    <script src="../../CommonJs/CommonDB/CommonDB.js"></script>
    <script src="../../CommonJs/CommonJS/CommonFuncJS.js"></script>
    <script src="../js/MyClass.js"></script>
</body>
</html>
