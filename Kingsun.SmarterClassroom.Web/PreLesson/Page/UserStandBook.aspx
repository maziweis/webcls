<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="UserStandBook.aspx.cs" Inherits="SmarterClassroomWeb.PreLesson.Page.UserStandBook" %>

<%@ Register Src="~/CommonPage/Page/Head.ascx" TagPrefix="uc1" TagName="Head" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
    <%--<link href="../../App_Theme/css/base.css" rel="stylesheet" />--%>
    <link href="../../App_Theme/css/page.css" rel="stylesheet" />
    <title>备课</title>
</head>
<body onselectstart="return false;">
    <uc1:Head runat="server" ID="Head" />
    <header class="headTitle">
        <a class="goback fl ifhide" id="btnBlack" href="#"><i></i>返回</a><label>同步教材</label>
        <%--<a class="add" id="btnAddBook" href="javascript:void(0)"><i></i>添加教材</a>--%>
    </header>
    <div class="selectTable bottomType">
        <div style="display:none">
        <span>学科：
            <select id="selectSubject">
            </select>
        </span>
        <span>版本：
            <select id="selectEdition">
            </select>
        </span>
        <span>年级：
		    <select id="selectGrade">
            </select>
        </span>
        <span style="display:none">教材类型：
            <select id="selectBookType">
                <option>自然拼读</option>
            </select>
        </span>
        <span style="display:none">学段：
            <select id="selectStage">
                <option>小学低年段</option>
            </select>
        </span>
            </div>
        <%--<input type="button" value="清空备课数据" onclick="previewInit.DeleteUserPre()" />--%>
        <ul class="bookParentType">
            <li class="allType"><i></i>全部教材</li>
            <li class="tongbu"><i></i>同步教材</li>
            <li class="fudao"><i></i>教材辅导</li>
            <li class="tese"><i></i>特色教材</li>
        </ul>
    </div>
    <div class="content beike">

        <div class="searchList beikeList">
            <ul id="divStandBookToSelect">
            </ul>
            <%--<ul>
                <li class="addBook"><a id="btnAddBook" href="javascript:void(0)"><i></i><br />添加教材</a></li>
                <li class="tongbuList"><a><img src="../../App_Theme/images/cover2.png" /><h4>牛津版小学英语</h4><p>四年级下册</p><span><i></i>同步教材</span></a></li>
                <li class="fudaoList"><a><img src="../../App_Theme/images/cover2.png" /><h4>牛津版小学英语</h4><p>四年级下册</p><span><i></i>教材辅导</span></a></li>
                <li class="teseList"><a><img src="../../App_Theme/images/cover2.png" /><h4>牛津版小学英语</h4><p>四年级下册</p><span><i></i>特色教材</span></a></li>
            </ul>--%>
            <div class="clear"></div>
        </div>
        <div class="comingSoon" style="display:none">
            你还没有添加电子教材~赶紧去添加吧！
        </div>
    </div>
    <%--<div class="bottomType">
        <ul>
        </ul>
    </div>--%>
    <script src="../../App_Theme/js/jquery-1.10.2.min.js"></script>
    <script src="../../App_Theme/js/jquery.cookie.js"></script>
    <script src="../../CommonJs/jquery/jquery.json-2.4.js"></script>
    <script src="../../App_Theme/dialog/artDialog.js"></script>
    <script src="../../App_Theme/js/common.js"></script> 
    <script src="../../CommonJs/CommonDB/CommonDB.js"></script>
    <%--<script src="../../AttLesson/Js/Management/TeachLessonManage.js"></script>--%>
    <script src="../../CommonJs/CommonJS/CommonFuncJS.js"></script>
    <script src="../Js/Management/PreLessonManagement.js"></script>
    <script src="../Js/PageInit/UserStandBookInit.js"></script>
    <script>
        $(function () {
            //alert("width:"+$(window).width()+";height:"+$(window).height())
            $(".content .beikeList").css("height", $(window).height() - $(".headTitle").height() - $(".selectTable").height() - 28 - 40);
        })
    </script>
</body>
</html>
