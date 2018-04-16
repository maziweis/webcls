﻿<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="PerLessonForJF.aspx.cs" Inherits="SmarterClassroomWeb.PreLesson.Page.PerLessonForJF" %>

<%@ Register Src="~/CommonPage/Page/Head.ascx" TagPrefix="uc1" TagName="Head" %>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
    <link href="../../App_Theme/css/audio.css" rel="stylesheet" />
    <%--<link rel="stylesheet" href="../../App_Theme/css/base.css" />--%>
    <link rel="stylesheet" href="../../App_Theme/css/page.css" />
    <link rel="stylesheet" href="../../App_Theme/css/beike.css" />
    <link href="../../App_Theme/css/simple.css" rel="stylesheet" />
    <title>我的资源</title>
    <style type="text/css">
        body {background-color: #e2e6ef;box-shadow:none;}
        .pageList{position:fixed;z-index:100;}
        .headTitle{top:0;z-index:1}
        .main{position:absolute;top:60px;right:0;left:185px;margin-left:0;overflow-y:auto;bottom:0;}
        .pageDiv{overflow-y:auto;}
        /*.aui_dialog .view .aui_loading  span{text-indent:-9999px;
           position:absolute;
           width:100%;
           height:100%;
           left:0;
           top:0;
           background:#fff url(../../App_Theme/images/dialog/loading.gif) no-repeat center 150px;
           background-size:initial;
        }*/
        /*.aui_dialog .aui_loading{width:480px; height:420px; text-align:left; text-indent:-999em; overflow:hidden; background:#fff url(../../App_Theme/images/dialog/loading.gif) no-repeat center 150px;background-size:contain;margin-top:-200px;}*/

        </style>
</head>
<body onselectstart="return false;">
    <div id="loadingDiv"><i></i></div>
    <uc1:Head runat="server" ID="Head" />
    <header class="headTitle">
        <a class="goback fl" id="btnBlack"><i></i>返回</a>
        <div id="unitFull"></div>
        <a class="record" id="btnRecord" href="javascript:void(0)">录制</a>
        <a class="save" href="javascript:void(0)" onclick="save()">保存</a>
        <a class="play" id="btnPlay" href="javascript:void(0);">放映</a>
        <%--<a class="play" href="../../AttLesson/Page/Teaching.aspx?page=2-11">放映</a>--%>
    </header>
    <ol id="unitList" class="catalogOl">
    </ol>
    <aside class="pageList">
        <p id="txtModulName" class="currentName"><em></em></p>
        <h3 id="unitName" class="currentName"><i></i><label></label></h3>
        <div class="pageDiv">
            <ul id="divPagebox">
            </ul>
        </div>
        <h3 id="jxMap" class="currentName"><i></i><label>教学地图</label><em></em></h3>
        <div class="jxDiv">
            <div class="jxScroll">
                <%--<div class="sortTab">
                    <h4 class="open"><span class="ico"></span>第一步<em class="setEm"></em></h4>
                    <ul id="sortlist1">
                        <li drag-id="0"><a href="javascript:void(0)">我是资源</a></li>
                        <li drag-id="1"><a href="javascript:void(0)">我是资源</a></li>
                        <li drag-id="2"><a href="javascript:void(0)">我是资源</a></li>
                        <li drag-id="3"><a href="javascript:void(0)">我是资源</a></li>
                    </ul>
                </div>--%>
            </div>
            
            <div>
                <input type="button" class="btnAdd" value="添加" onclick="addItem()"/>
            </div>
        </div>
    </aside>
    <div class="main">
        <div class="leftColumn">
            <div class="trash">
                <img src="../../App_Theme/images/Icon_1.png" alt="垃圾箱" id="trashImg" />
            </div>
            <div id="dragPalcer"></div>
        </div>
        <div class="audioDiv" style="display: none;">
            <audio id="audio">
                <source src="#" type="audio/mpeg" id="mp3" />
            </audio>
        </div>
        <div class="rightColumn">
            <ul id="tablist">
                <li class="link1 active">教辅资源</li>
                <li class="link3">我的资源</li>
                <li class="link6">校本资源</li>
                <li class="link4 searchTab" title="资源检索">资源检索</li>
            </ul>
            <div id="tabbox">
                <div class="tab cont1 JFCont" id="tab1" style="display: block;">
                    <div class="navTop up">
                        <div class="searchbar">
                            <select id="selectCatalog" >
                                
                            </select>
                            <select id="selectUnit">
                                
                            </select>                     
                        </div>
                        <div id="divTypeList" class="typelist">
                         </div>
                        <label  class="toggle"></label>
                    </div>
                    <div id="divResourceList" class="toolbar">
                    </div>
                   <%-- <div id="11" class="toolbar">
                        <ul>
                            <li>
                                <label class="checkInput"><input type="checkbox" /></label>
                                <div class="dragEnable" title="拖动我到左边框中" id="33">
                                    <span>Look，listen and choose，听音选正确答案</span>
                                    <a><i></i><label>预览</label></a>
                                </div>
                            </li>
                        </ul>
                    </div>--%>
                    <div  class="comingSoon" style="display: none">
                        即将上线，敬请期待！
                    </div>
                </div>
                <div class="tab cont3" id="tab3" style="display: none;">
                    <div class="navTop">
                        <div class="searchbar">
                            <select id="selectUserBook">
                            </select>
                            <select id="selectUserCatalog">
                            </select>
                            <select id="selectUserUnit">
                            </select>
                        </div>
                        <div class="options"  id="divUserNav">
                            <label>
                                <input name="allcheckbox" type="checkbox" /><span></span>全选</label>
                            <a id="btnDelUserResource" class="delete">删除</a>
                            <a class="" id="btnUpLoadFile"></a>
                        </div>
                    </div>
                    <div id="divUserResource" class="toolbar">
                        <div class="uploadList">
                            <div class="uploadBar">
                                <table id="tabUpload">
                                </table>
                                <ol id="tbSetResourceInfo" style="display:none">
                                </ol>
                            </div>
                        </div>
                         <ul>
                        </ul>
                        <div id="divSaveUplaod" class="pagecontrols" style="height:0;padding:0">
                           <a id="btnSaveUplaod" class="pagebtn">保存</a>
                       </div>
                    </div>
                    <div id="divUserComingSoon" class="emptyRec" style="display: none">
                       您还没有上传资源哦!
                    </div>
                </div>
                <div class="tab cont6" id="tab6" style="display: none;">
                    <div class="navTop up">
                        <div class="searchbar">
                            <select id="selectSchoolBook">
                            </select>
                            <select id="selectSchoolCatalog">
                            </select>
                            <select id="selectSchoolUnit">
                            </select>                     
                        </div>
                        <div id="divSchoolTypeList" class="typelist">
                        </div>
                        <label id="lbSchoolToggle" class="toggle"></label>
                    </div>

                    <div id="divSchoolResource" class="toolbar">
                    </div>
                    <div id="divSchoolComingSoon" class="comingSoon" style="display: none">
                        即将上线，敬请期待！
                    </div>
                </div>
                <div class="tab cont4" id="tab4" style="display: none;">
                    <div class="searchBox">
                        <input id="txtSearchValue" type="text" /><a id="benSearch" class="searchBtn">搜索</a>
                    </div>
                    <div id="divSearchResource" class="searchResult">
                        <div class="insetLoading" style="display: none"><i></i></div>
                    </div>
                    <div  id="divSearchResult" class="emptySearch" style="display: none">
                       很遗憾，暂无资源，换个关键词搜索试一试...
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <script src="../../App_Theme/js/jquery-1.10.2.min.js"></script>
    <script src="../../CommonJs/jquery/jquery.json-2.4.js"></script>
    <script src="../../App_Theme/js/audioControls.js"></script>
    <script src="../../CommonJs/CommonDB/CommonDB.js"></script>
    <script src="../../CommonJs/CommonJS/CommonFuncJS.js"></script>
    <script src="../../App_Theme/dialog/artDialog.js"></script>
    <script src="../../App_Theme/js/common.js"></script>
    <script src="../../App_Theme/js/dragElement.js"></script>
    <script src="../../App_Theme/js/dragItem.js"></script>    
    <script src="../../App_Theme/js/tab.js"></script>
    <script src="../../AttLesson/Js/Management/TeachLessonManage.js"></script>
    <script src="../../App_Theme/js/KJajaxUpload.js"></script>
    <script src="../Js/Management/PreLessonManagement.js"></script>
    <%--<script src="../Js/PageInit/PreLessonResourceInit.js"></script>--%>
    <script src="../Js/PageInit/PreLessonForJFInit.js"></script>
    <script src="../Js/PageInit/PreLessonPageInit.js"></script>
    <script src="../Js/PageInit/Sortable.js"></script>   
    <%--<script src="../../CommonJs/CommonJS/RecordFunc.js"></script>--%>
    <script src="../../CommonJs/CommonJS/OperFunc.js"></script>
    <script src="../../App_Theme/js/beike.js"></script>
    <!--移动端调试-->
    <%--<script src="../../App_Theme/js/vconsole.min.js"></script>--%>
    <script type="text/javascript">
        //$(function () {
        //    var userInfo = commonFuncJS.getDataF('UserInfo');
        //    if (userInfo == null) {
        //        window.location.href = "../../Login.aspx";
        //    }
        //});
        function uploadfile(valudata) {
            $("#divUserResource ul").hide();
            $("#btnDelUserResource").unbind("click");
            var input = $("#divUserNav").find("input[name='allcheckbox']");
            $(input).attr("disabled", "disabled");
            var data = [];
            data.push(valudata);
            preLessonPageInit.InitEditionUploadFile(data, "android");
        }        
    </script>
    <script>
        $(window).load(function () {
            $('#loadingDiv').hide();
        });
    </script>
</body>
</html>