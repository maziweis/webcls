<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ClassInfo.aspx.cs" Inherits="SmarterClassroomWeb.PersonCenter.page.ClassInfo" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />   
    <link rel="stylesheet" href="../../App_Theme/css/page.css" />
    <title>我的班级</title>
    <style type="text/css">
        body{background-color:#fff;}
    </style>
</head>
<body onselectstart="return false;">
    <header class="headTitle"><a class="goback fl ifhide" id="btnBlack" href="MyClass.aspx"><i></i>返回</a><label></label></header>
    <form id="form1" runat="server">
    <div class="studentList group1" style="display:block;">
        <div class="studentGroup">
             <label class="title">班级成员</label><a class="groupView type1"><i></i><label>按分组查看</label></a>
        </div>
        <div class="studentInfo">
            <ul>
                
            </ul>
            <div class="comingSoon" style="display:none;"><label>请联系管理员添加学生吧~</label></div>
        </div>
    </div>
        <div class="studentList group2" style="display:none;">
        <div class="studentGroup">
             <label class="title">分组查看</label><a class="groupView type2"><i></i><label>按班级查看</label></a>
            <ul>
                 <li class="on" id="g0">全学科分组</li>
                 <li id="g3">英语分组</li>
                 <li id="g2">数学分组</li>
                 <li id="g1">语文分组</li>
                 <%--<li id="g4">临时分组</li>--%>
             </ul>
        </div>
        <div class="studentInfo">
            <ul>
               
            </ul>
            <div class="comingSoon" style="display:none;"><label>请联系管理员进行分组吧~</label></div>
        </div>
    </div>
    </form>
    <script src="../../CommonJs/jquery/jquery-1.11.2.min.js"></script>
    <script src="../../CommonJs/jquery/jquery.json-2.4.js"></script>
    <script src="../../CommonJs/CommonDB/CommonDB.js"></script>
    <script src="../../CommonJs/CommonJS/CommonFuncJS.js"></script>
    <script src="../js/ClassInfo.js"></script>
</body>
</html>
