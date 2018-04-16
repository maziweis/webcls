<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ResourcePreview.aspx.cs" Inherits="SmarterClassroomWeb.CommonPage.Page.ResourcePreview" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<title></title>
    <style>
        *{margin:0;padding:0;}
        form{width:100%;height:100%;}
        html,body{width:100%;height:100%;text-align:center;vertical-align:middle;overflow:hidden;}
    </style>
</head>
<script src="../../CommonJs/jquery/jquery-1.11.2.min.js"></script>
<script src="../../CommonJs/jquery/jquery.json-2.4.js"></script>
<script src="../../CommonJs/jquery/jquery.cookie.js"></script>
<script src="../../CommonJs/CommonDB/CommonDB.js"></script>
<script src="../../PreLesson/Js/Management/PreLessonManagement.js"></script>
<script src="../../App_Theme/dialog/artDialog.js"></script>
<script src="../Js/PageInit/ResourcePreviewInit.js"></script>
<body onselectstart="return false;">
    <form id="form1" runat="server">    
        <iframe id="previewPage" src="../Html/DefaultPageView.html" scrolling="no" frameborder="0"  style="width:100%;height:100%;margin:0 auto;overflow:hidden;"></iframe>
    </form>    
</body>
</html>
