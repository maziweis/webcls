<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="PerLessonForTS2.aspx.cs" Inherits="SmarterClassroomWeb.PreLesson.Page.PerLessonForTS2" %>
<%@ Register Src="~/CommonPage/Page/Head.ascx" TagPrefix="uc1" TagName="Head" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
    <link href="../../App_Theme/css/audio.css" rel="stylesheet" />
    <%--<link rel="stylesheet" href="../../App_Theme/css/base.css" />--%>
    <link rel="stylesheet" href="../../App_Theme/css/page.css" />
    <link rel="stylesheet" href="../../App_Theme/css/beike.css" />  
    <link href="../../App_Theme/css/dragWin.css" rel="stylesheet" />
    <link href="../../App_Theme/css/simple.css" rel="stylesheet" /> 

    <style type="text/css">
        body {background-color: #e2e6ef;box-shadow:none;}
        .pageList{position:fixed;z-index:100;}
        .headTitle{top:0;z-index:1}        
        .pageDiv{overflow-y:auto;}
        #dragToolBar .title {
	        position:relative;
	        height:37px;
            line-height:27px;
            padding-left:30px;
            overflow:hidden;
            background-color:#89a7e6;
            color:#fff;
            width: auto;
            margin: 0;
        }
        #dragToolBar .title h2 {
	        font-size:1rem;
	        height:37px;
	        line-height:34px;
        }
        a.open {
	        position:absolute;
	        top:60px;
	        right:0px;
	        margin-left:-10px;
	        /*background-position:0 0;*/
            width:34px;
            height:75px;
            background:#f9a158;
            -webkit-border-radius: 10px 0 0 10px;
            z-index:999;
            padding:13px 0 0 12px;
            font-size:1.25rem;color:#ffffff;
        }
        a.open:hover{-webkit-border-radius: 10px 0 0 10px;}
        a.open:before {
        content:"资源";
        }
        #dragToolBar .title a.close {
	        background:none;border:1px #b8caf0 solid;color:#fff;width:70px;height:26px;-webkit-border-radius:15px;line-height:26px;margin-right:20px;margin-top:2px;text-align:center;
        }
        #dragToolBar .title a.close:before{content:"隐藏";color:#ffffff;font-size:0.875rem;}
        #dragToolBar .title .min,#dragToolBar .title .max,#dragToolBar .title .revert{display:none;}
        #dragToolBar .resizeL,#dragToolBar .resizeR,#dragToolBar .resizeT,#dragToolBar .resizeB,#dragToolBar .resizeLB,#dragToolBar .resizeLT,#dragToolBar .resizeBR,#dragToolBar .resizeTR{display:none;}
        #soundDom a{border:0;}
        .insetLoading{background:#fff url(../../App_Theme/images/dialog/loading.gif) no-repeat center 130px;width:100%;height:100%;background-size: 50%;}
        .insetLoading i{display:block;/*background:url(../../App_Theme/images/dialog/loadingCircle.gif) no-repeat center 290px;*/width:100%;height:100%;background-size: 60px;}    
        .pagecontrols{width:550px;}
        </style>
    <title>我的资源</title>
</head>

<body onselectstart="return false;">
    <uc1:head runat="server" id="Head" />
    <header class="headTitle">
        <a class="goback fl" id="btnBlack"><i></i>返回</a>
        <div id="unitFull"></div>
        <a class="record" id="btnRecord" href="javascript:void(0)">录制</a>
        <a class="save" href="javascript:void(0)" onclick="save()">保存</a>
        <a class="play" id="btnPlay" href="javascript:void(0);" target="_blank">放映</a>
    </header>    
    <div class="main" id="mainTS">
        <div class="leftColumn2">
            <div id="minbox">目<br />录</div>
            <div class="trash">
                <img src="../../App_Theme/images/Icon_1.png" alt="垃圾箱" id="trashImg" />
            </div>
            <div id="soundDom"></div>
            <div id="dragPalcer">
                
            </div>
            <div class="audioDiv" style="display: none;">
                <audio id="audio">
                    <source src="#" type="audio/mpeg" id="mp3" />
                </audio>
            </div>            
            <div class="pageListTs">                
                <h3 class="currentName"><i></i><span id="unitname">页码</span></h3>
                <div id="pageBox">
                    <ul class="pageUl">                        
                    </ul> 
                </div>  
                <h3 id="jxMap" class="currentName"><i></i><span>教学地图</span><em></em></h3>
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
            </div>
        </div>        
        <div class="rightColumn2" id="dragToolBar">
            <ul id="tablist">
                <li class="link1 active">我的资源</li>
                <li class="link6">校本资源</li>
                <li class="link2 searchTab" title="资源检索">资源检索</li>
            </ul>
            <div id="tabbox">
                <div class="tab cont1" id="mytab">
                    <div class="navTop">
                        <div class="searchbar">
                            <select id="selectUserBook" style="width:100px; display:none">
                            </select>
                            <select id="selectUserCatalog" style="width:auto;">
                            </select>
                            <select id="selectUserUnit" style="width:100px;">
                            </select>
                        </div>
                        <div class="options" id="divUserNav">
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
                                <ol id="tbSetResourceInfo" style="display: none"></ol>
                            </div>
                        </div>
                        <ul></ul>
                        <div id="divSaveUplaod" class="pagecontrols" style="height: 0; padding: 0">
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
                            <select id="selectSchoolCatalog" style="width:auto">
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
                <div class="tab cont2" id="tab4" style="display: none;">
                    <div class="searchBox">
                        <input id="txtSearchValue" type="text" /><a id="benSearch" class="searchBtn">搜索</a>
                    </div>
                    <div id="divSearchResource" class="searchResult">
                        <div class="insetLoading" style="display: none"><i></i></div>
                    </div>
                    <div id="divSearchResult" class="emptySearch" style="display: none">
                        很遗憾，暂无资源，换个关键词搜索试一试...
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="../../App_Theme/js/jquery-1.10.2.min.js"></script>
    <script src="../../CommonJs/jquery/jquery.json-2.4.js"></script> 
    <script src="../../App_Theme/js/audioControls.js"></script>   
    <script src="../../App_Theme/js/common.js"></script>
    <script src="../../App_Theme/dialog/artDialog.js"></script>
    <script src="../../CommonJs/CommonDB/CommonDB.js"></script>
    <script src="../../CommonJs/CommonJS/CommonFuncJS.js"></script>
    <%--<script src="../../CommonJs/CommonJS/RecordFunc.js"></script>--%>
    <script src="../../CommonJs/CommonJS/OperFunc.js"></script>
    <script src="../../App_Theme/js/dragElement.js"></script>
    <script src="../../App_Theme/js/dragItem.js"></script>    
    <script src="../../App_Theme/js/tab.js"></script>
    <script src="../../App_Theme/js/dragWin.js"></script>
    <script src="../../App_Theme/js/beike.js"></script>
    <%--<script src="../../AttLesson/Js/Management/TeachLessonManage.js"></script>--%>
    <script src="../../App_Theme/js/KJajaxUpload.js"></script>
    <script src="../Js/Management/PreLessonManagement.js"></script>
    <script src="../Js/PageInit/PreLessonForTS2.js"></script>
    <script src="../Js/PageInit/PreLessonPageInit2.js"></script>
    <script src="../Js/PageInit/Sortable.js"></script>
    <script type="text/javascript">        
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
</body>
</html>
