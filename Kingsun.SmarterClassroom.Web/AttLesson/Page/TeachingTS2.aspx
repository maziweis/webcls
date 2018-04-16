<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="TeachingTS2.aspx.cs" Inherits="SmarterClassroomWeb.AttLesson.Page.TeachingTS2" %>


<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
    <%--<link rel="stylesheet" href="../../App_Theme/css/base.css" />--%>
    <link href="../../App_Theme/css/audio.css" rel="stylesheet" />
    <link rel="stylesheet" href="../../App_Theme/css/page.css" />
    <link rel="stylesheet" href="../../App_Theme/css/beike.css" />
    <link href="../../App_Theme/css/idangerous.swiper.css" rel="stylesheet" />
    <link href="../../App_Theme/css/solid.css" rel="stylesheet" />
    <link href="../../App_Theme/css/simple.css" rel="stylesheet" />
    <script src="../../App_Theme/js/jquery-1.10.2.min.js"></script>
    <script src="../../CommonJs/jquery/jquery.json-2.4.js"></script>
    <script src="../../App_Theme/js/audioControls.js"></script>
    <script src="../../App_Theme/js/jquery.cookie.js"></script>
    <script src="../../App_Theme/js/common.js"></script>
    <script src="../../App_Theme/js/idangerous.swiper.min.js"></script>
    <script src="../../App_Theme/dialog/artDialog.js"></script>
    <script src="../../CommonJs/CommonDB/CommonDB.js"></script>
    <script src="../../CommonJs/CommonJS/CommonFuncJS.js"></script>
    <script src="../Js/Management/TeachLessonManage.js"></script>
    <%--<script src="../../PreLesson/Js/Management/PreLessonManagement.js"></script>--%>
    <%--<script src="../../CommonJs/CommonJS/RecordFunc.js"></script>--%>
    <script src="../../CommonJs/CommonJS/OperFunc.js"></script>
    <script src="../Js/PageInit/TeachingInit.js"></script>
    <script src="../Js/Teaching.js"></script>
    <%--<script src="../../App_Theme/js/vconsole.min.js"></script>--%>
    <title>上课</title>
    <style type="text/css">
        body {
            background-color: #ffffff;
        }
    </style>
</head>
<body onselectstart="return false;">
    <div id="loadingDiv"><i></i></div>
    <header class="headTitle reset">
        <a class="goback fl" href="SelectBook.aspx"><i></i>返回</a>
        <div id="unitFull">Unit 1 Hello</div>
    </header>
    <aside class="pageList teachingCatalog">
        <h3 id="unitName" class="currentName">目录</h3>
        <ol id="unitList" class="catalogOl">
        </ol>
    </aside>
    <div class="device" id="device">
        <a class="arrow-left" href="#">上一页<i></i></a>
        <a class="arrow-right" href="#">下一页</a>
        <div class="swiper-container">
            <div class="swiper-wrapper"></div>
            <div class="botTools">
            </div>
            <div class="audioDiv" style="display: none;">
                <audio id="audio">
                    <source src="#" type="audio/mpeg" id="mp3" />
                </audio>
            </div>
        </div>
        <div class="pagination"></div>
    </div>
    <a class="fullDiv on" id="fullDiv" href="javascript:void(0)" name="full" onclick="SetFull(this)"><i></i></a>
    <%--<script src="../../App_Theme/js/jquery.nicescroll.js"></script>--%>
    <script>
        userInfo = commonFuncJS.getDataF('UserInfo');
        if (userInfo.Type === 26) {
            $(".teachMap").hide();
        }
        $(window).load(function () {
            $('#loadingDiv').hide();
        })
    </script>
</body>
</html>
