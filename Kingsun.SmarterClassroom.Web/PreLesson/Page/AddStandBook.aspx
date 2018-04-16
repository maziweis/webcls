<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="AddStandBook.aspx.cs" Inherits="SmarterClassroomWeb.PreLesson.Page.AddStandBook" %>

<%@ Register Src="~/CommonPage/Page/Head.ascx" TagPrefix="uc1" TagName="Head" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
        <%--<link href="../../App_Theme/css/base.css" rel="stylesheet" />--%>
        <link href="../../App_Theme/css/page.css" rel="stylesheet" />
		<title>添加教材</title>
    <style type="text/css">
        body{background-color:#e2e6ef;}
    </style>
</head>
<body onselectstart="return false;">
    <uc1:Head runat="server" ID="Head" />
    <header class="headTitle"><a class="goback fl" id="btnBlack" href="#"><i></i>返回</a>添加教材</header>
    <div class="addLeft">
        <div class="topType bottomType">
            <ul class="bookParentType"><li id="1" class="tongbu on"><i></i>同步教材</li><li id="2" class="fudao"><i></i>教材辅导</li><li id="3" class="tese"><i></i>特色教材</li></ul>
        </div>
    <div class="selectTable">
				<span>
						学科：
                            <select id="selectSubject">
                            </select> </span>
                <span>版本：
                            <select id="selectEdition">

                            </select></span>
                <span style="display:none">教材类型：
                            <select>
                                <option>自然拼读</option>
                            </select></span>
                   
			</div>
        <div class="content">
			<div class="beikeList">
				<ul id="divStandBookList">
                    <%--<li class="selected"><a><img src="../../App_Theme/images/cover1.png" alt="三年级下册"><p>三年级下册</p></a></li>
                    <li  class="selected"><a><img src="../../App_Theme/images/cover1.png" alt="三年级下册"><p>三年级下册</p></a></li>
                    <li class="selected"><a><img src="../../App_Theme/images/cover1.png" alt="三年级下册"><p>三年级下册</p></a></li>
                    <li  class="selected"><a><img src="../../App_Theme/images/cover1.png" alt="三年级下册"><p>三年级下册</p></a></li>
                    <li class="selected"><a><img src="../../App_Theme/images/cover1.png" alt="三年级下册"><p>三年级下册</p></a></li>
                    <li><a><img src="../../App_Theme/images/cover1.png" alt="三年级下册"><p>三年级下册</p></a></li>
                    <li><a><img src="../../App_Theme/images/cover1.png" alt="三年级下册"><p>三年级下册</p></a></li>
                    <li><a><img src="../../App_Theme/images/cover1.png" alt="三年级下册"><p>三年级下册</p></a></li>--%>
				</ul>
                 <div class="clear"></div>
			</div>
            <div class="addtoBookList"><button id="btnSave" disabled="disabled">保存(0)</button></div>
           </div>
        </div>
            <div class="addRight">
                <div class="aliveBookTitle"><b>已添加教材</b><label id="lblBookNum">(0)</label></div>
            <div id="divUserSelect" class="selectDiv">
                <ol id="liUserBook">
                </ol>
                <%--没有添加过教材提示--%>
                <div class="noneAddList" style="display:none"></div>
            </div>
                </div>
        <script src="../../App_Theme/js/jquery-1.10.2.min.js"></script>
        <script src="../../App_Theme/js/jquery.cookie.js"></script>
        <script src="../../CommonJs/jquery/jquery.json-2.4.js"></script>
    <script src="../../CommonJs/CommonDB/CommonDB.js"></script>
    <%--<script src="../../AttLesson/Js/Management/TeachLessonManage.js"></script>--%>
    <script src="../../CommonJs/CommonJS/CommonFuncJS.js"></script>
    <script src="../Js/Management/PreLessonManagement.js"></script>
    <script src="../Js/PageInit/AddStandBookInit.js"></script>
        <script type="text/javascript">
            //$(function () {
            //    var userInfo = commonFuncJS.getDataF('UserInfo');
            //    if (userInfo == null) {
            //        window.location.href = "../../Login.aspx";
            //    }
            //})
            // 移动端长按处理
            $(function () {
                autoHeight();
            })
            $(window).resize(function () {
                autoHeight();
            });
            $.fn.longPress = function (fn) {
                var timeout = undefined;
                var $this = this;
                for (var i = 0; i < $this.length; i++) {
                    $this[i].addEventListener('touchstart', function (event) {
                        timeout = setTimeout(fn, 800);  //长按时间超过800ms，则执行传入的方法
                    }, false);
                    $this[i].addEventListener('touchend', function (event) {
                        clearTimeout(timeout);  //长按时间少于800ms，不会执行传入的方法
                    }, false);
                }
            }

            $('.object').longPress(function () {
                //do something...
            });


            function autoHeight() {
                var allH = $(window).height();
                var headH = $(".headTitle").height();
                var selectH = $(".selectTable").height() + 25 * 2 + 1;//选择框高度
                var typeH = $(".topType").height() + 1;
                var btnH = $(".aliveBookTitle").height() + 1;//已添加列表标题
                $(".addLeft .beikeList").css("height", allH - headH - selectH - typeH - $(".addtoBookList").height() - 15);
                $(".addRight .selectDiv").css("height", allH - headH - btnH - 20);
            }
        </script>
</body>
</html>
