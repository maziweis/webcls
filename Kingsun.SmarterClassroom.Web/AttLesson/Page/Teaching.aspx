<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Teaching.aspx.cs" Inherits="SmarterClassroomWeb.AttLesson.Page.Teaching" %>
<%@ Register Src="~/CommonPage/Page/Head.ascx" TagPrefix="uc1" TagName="Head" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />   
    <title>上课</title> 
    <link href="../../App_Theme/css/audio.css" rel="stylesheet" />
    <link rel="stylesheet" href="../../App_Theme/css/page.css" />
    <link rel="stylesheet" href="../../App_Theme/css/beike.css" />    
    <link href="../../App_Theme/css/swiper-3.4.2.min.css" rel="stylesheet" />
    <link href="../../App_Theme/css/solid.css" rel="stylesheet" />   
    <link href="../../App_Theme/css/simple.css" rel="stylesheet" /> 
    <style type="text/css">
        body {
            background-color: #ffffff;
        }
    </style>
</head>
<body onselectstart="return false;">
    <div id="loadingDiv"><i></i></div>
    <uc1:Head runat="server" ID="Head" />
    <header class="headTitle reset">
        <a class="goback fl" href="#"><i></i>返回</a>
        <div id="unitFull">Unit 1 Hello</div>
    </header>
    <aside class="pageList teachingCatalog">
        <h3 id="unitName" class="currentName">目录</h3>
        <ol id="unitList" class="catalogOl">
            <%--<li class="module">Module 1 Learn</li>
        <li>Unit 1 Hello</li>
            --%>
        </ol>
        
    </aside>
    <div class="teachMap">
        <div class="mapTab"><i></i></div>
        <h3 id="jxMap" class="currentName"><i></i><label>教学地图</label><em></em></h3>
        <div class="jxDiv">
            <div class="jxScroll">
                <%--<div class="sortTab">
                    <h4 class="open"><span class="ico"></span><b>第一步</b></h4>
                    <ul id="sortlist1">
                        <li drag-id="0"><a href="javascript:void(0)">我是资源</a></li>
                        <li drag-id="1"><a href="javascript:void(0)">我是资源</a></li>
                        <li drag-id="2"><a href="javascript:void(0)">我是资源</a></li>
                        <li drag-id="3"><a href="javascript:void(0)">我是资源</a></li>
                    </ul>
                </div>--%>
            </div>
        </div>
    </div>
    <div class="device" id="device">
        <a class="arrow-left" href="#">上一页<i></i></a>
        <a class="arrow-right" href="#">下一页</a>        
        <div class="swiper-container">
            <div class="swiper-wrapper"></div>
            <div class="botTools">
                <!--<a href="itemList.html" title="目录" class="btnBack"></a>-->
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
    
    <script src="../../App_Theme/js/jquery-1.10.2.min.js"></script>
    <script src="../../CommonJs/jquery/jquery.json-2.4.js"></script>    
    <script src="../../App_Theme/js/jquery.cookie.js"></script>
    <script src="../../App_Theme/dialog/artDialog.js"></script>    
    <script src="../../App_Theme/js/swiper-3.4.2.jquery.min.js"></script>    
    <script src="../../App_Theme/js/common.js"></script>
    <script src="../../CommonJs/CommonDB/CommonDB.js"></script>
    <script src="../../CommonJs/CommonJS/CommonFuncJS.js"></script>    
    <script src="../Js/Management/TeachLessonManage.js"></script>
    <%--<script src="../../PreLesson/Js/Management/PreLessonManagement.js"></script>    --%>
    <script src="../../CommonJs/CommonJS/OperFunc.js"></script>
    <script src="../Js/PageInit/TeachingInit.js"></script>
    <script src="../Js/Teaching.js"></script>
    <script src="../../CommonJs/CommonJS/jsBridge.js"></script>
    <script src="../../CommonJs/CommonJS/transit.js"></script>
    <%--<script src="../../App_Theme/js/vconsole.min.js"></script>--%>
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
