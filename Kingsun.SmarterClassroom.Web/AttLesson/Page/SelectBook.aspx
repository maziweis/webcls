<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="SelectBook.aspx.cs" Inherits="SmarterClassroomWeb.AttLesson.Page.SelectBook" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
    <%--<link href="../../App_Theme/css/base.css" rel="stylesheet" />--%>
    <link href="../../App_Theme/css/page.css" rel="stylesheet" />
    <script src="../../App_Theme/js/jquery-1.10.2.min.js"></script>
    <script src="../../App_Theme/js/jquery.cookie.js"></script>
    <script src="../../CommonJs/jquery/jquery.json-2.4.js"></script>
    <script src="../../App_Theme/dialog/artDialog.js"></script>
    <script src="../../App_Theme/js/swiper-3.4.2.jquery.min.js"></script>
    <script src="../../App_Theme/js/common.js"></script>
    <script src="../../CommonJs/CommonDB/CommonDB.js"></script>
    <script src="../../CommonJs/CommonJS/CommonFuncJS.js"></script>
    <%--<script src="../Js/PageInit/TeachLessonInit.js"></script>--%>
    <script src="../Js/Management/TeachLessonManage.js"></script>
    <%--    <script src="../../PreLesson/Js/Management/PreLessonManagement.js"></script>--%>
    <script src="../Js/PageInit/SelectBookInit.js"></script>
    <title>授课班级选择</title>
</head>
<body onselectstart="return false;">
    <form id="form1" runat="server">

        <header class="headTitle"><a class="goback fl ifhide" href="#" id="shoukeBack"><i></i>返回</a>授课</header>
        <div style="display: none" id="requestip"><%=IP %></div>
        <div style="display: none" id="myconn"><%=MyConn %></div>
        <div class="selectTable teachingTable bottomType">
            <div style="display: none">
                <span>学科：
                        <select id="selectSubject">
                        </select></span>
                <span>版本：
                        <select id="selectEdition">
                        </select></span>
                <span>年级：
					     <select id="selectGrade">
                         </select></span>
                <span style="display: none">教材类型：
                        <select id="selectBookType">
                        </select>
                </span>
                <span style="display: none">学段：
                        <select id="selectStage">
                        </select>
                </span>
            </div>
            <ul class="bookParentType">
            </ul>
            <div class="fixedLeft">
                <div class="h3">
                    <span></span><i></i>
                    <div class="top">
                        <i></i>
                        <ul id="divClassToSelect">
                        </ul>
                    </div>
                </div>
            </div>
            <div class="addBtn teachList teacherAide" style="display: none">
                <a href="#" class="isEk" style="display: inline-block;">
                    <label>启用教师助手</label><i></i><em></em></a>
            </div>
            <div><a href="../../PreLesson/Page/UserStandBook.aspx">去备课</a></div>
        </div>
        <div class="content">
            <div class="searchList beikeList">
                <ul id="divStandBookToSelect">
                </ul>
                <div class="clear"></div>
            </div>
        </div>
        <div class="comingSoon" style="display: none">
            你还没有添加电子教材~赶紧去添加吧！
        </div>
        <div class="iPadTip" style="display: none;">如需备课请前往电脑端或安卓端吧~</div>
        <script type="text/javascript">
            //判断是否为子元素或者当前元素
            $.fn.isChildAndSelfOf = function (b) {
                return (this.closest(b).length > 0);
            };
            $(function () {
                userInfo = commonFuncJS.getDataF('UserInfo');
                //计算列表区域实际高度
                if (commonFuncJS.OS.isTablet && !commonFuncJS.OS.isAndroid) {
                    $(".iPadTip").show();
                    $(".content .beikeList").css("height", $(window).height() - $(".headTitle").height() - 57 - 28 - 40 - $(".iPadTip").height());
                }
                else $(".content .beikeList").css("height", $(window).height() - $(".headTitle").height() - 57 - 28 - 40);
                $(".teacherAide").on("click", function () {
                    $(this).toggleClass("disableEk");
                })
                $(".fixedLeft .h3").on("click", function () {
                    $(this).find(".top").slideToggle();
                });
                $("body").on("click", function (event) {
                    var e = event || window.event || e;
                    var obj = $(e.srcElement || e.target);
                    if ($(obj).isChildAndSelfOf(".fixedLeft")) {

                    }
                    else {
                        $(".fixedLeft .top").slideUp();
                    }
                });
                if (userInfo.Type === 26) {
                    $(".fixedLeft .h3 i").hide();
                    $(".fixedLeft .h3").unbind();
                }
                $("#shoukeBack").on("click", function () {
                    window.opener = null;
                    window.open('', '_self');
                    window.close();
                })
            });
            function openEK() {
                if (userInfo.Type === 26) {
                    $(".isEk").addClass("disableEk");
                }
                else {
                    $(".isEk").css("display", "inline-block");
                }
            }
        </script>
    </form>
</body>
</html>
