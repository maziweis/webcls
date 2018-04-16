<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Index.aspx.cs" Inherits="SmarterClassroomWeb.Index" %>
<%@ Register Src="~/CommonPage/Page/Head.ascx" TagPrefix="uc1" TagName="Head" %>
<!doctype html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
    <meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
    <%--<link href="App_Theme/css/base.css" rel="stylesheet" type="text/css">--%>
    <link href="App_Theme/css/page.css" rel="stylesheet" type="text/css">
    <link href="App_Theme/css/swiper-3.4.2.min.css" rel="stylesheet" />
    <title>互动课堂--教师端首页</title>
</head>

<body class="bodyNum1" onselectstart="return false;">
    <uc1:Head runat="server" ID="Head" />
    <div id="loadingDiv"><i></i></div>
    <%--    <header class="userName">
        <a href="javascript:void(0);">
            <h1></h1>
        </a>
        <%--欢迎您，<%=UserName %>老师--%>
    <!--<a href="#" onclick="ExitEvent()" class="exit">退出</a>-->
    <%--<a href="#" onclick="fullScreen()" class="exit">全屏</a>--%>
    <%--  </header>--%>
    <div class="homeTop">
        <span class="userName"><a href="PersonCenter/Index1.aspx" ondragstart="return false">
                <img src="App_Theme/images/defaultHead.png" alt="用户头像" /><b id="username"></b></a></span>
        <div class="teachingFor"><label>公共班级</label><i></i>
                <div class="top"><i></i>
                <ul id="divClassToSelect">
                <li  class="on">一（1）班</li>
                <li>一（2）班</li>
                <li>一（3）班</li>
                <li>一（4）班</li>
                </ul>
                    </div></div>
        <span class="teacherAide isEk"  style="display:none"><label>启用教师助手</label><i></i><em></em></span>
        <span class="dtTime"><b class="left"></b><b class="right"></b></span>
    </div>
    <div class="bookrack">
        <div class="bookList">
            <ul id="divStandBookToSelect">
                
            </ul>
        </div>
        <a class="moreTeachingRec" href="AttLesson/Page/SelectBook.aspx">更多上课教材<i></i></a>
        <div class="comingSoon" style="display:none">
            <a class="addBook" href="PreLesson/Page/AddStandBook.aspx?page=Index&BookType=1">添加</a>
        </div>
    </div>
    <div class="userModule">
        <ul>
           <%-- <li class="classShow"><a><i></i><label>课堂秀</label></a></li>--%>
            <li class="classBeike"><a><i></i><label>去备课</label></a></li>
        </ul>
    </div>
    <script src="App_Theme/js/jquery-1.10.2.min.js"></script>
    <script src="App_Theme/js/swiper-3.4.2.jquery.min.js"></script>
    <script src="CommonJs/CommonDB/CommonDB.js"></script>
    <script src="CommonJs/CommonJS/CommonFuncJS.js"></script>
    <script src="CommonJs/jquery/jquery.json-2.4.js"></script>
    <script src="AttLesson/Js/Management/TeachLessonManage.js"></script>
    <script type="text/javascript">
        $.fn.isChildAndSelfOf = function (b) {
            return (this.closest(b).length > 0);
        };
        $(function () {
            if (commonFuncJS.OS.isTablet && !commonFuncJS.OS.isAndroid) {
                $(".userModule,.bookrack .bookList ul li.addBook").hide();
            }


            $(".isEk").on("click", function () {
                $(this).toggleClass("disableEk");
            })
            var time = commonFuncJS.GetServiceDateTime();
            //var week = new Date(time).getDay();
            var timestemp = Date.parse(new Date(time));//将获取的日期字符串转换为时间戳
            var weekStr = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
            showTime();
            setInterval(function () {
                timestemp += 1000;
                showTime();
            }, 1000);
            function showTime() {
                var nowtime = new Date(timestemp);
                var ymd = nowtime.getFullYear() + "-" + (nowtime.getMonth() + 1) + "-" + (nowtime.getDate() < 10 ? "0" + nowtime.getDate() : nowtime.getDate());
                var hm = (nowtime.getHours() < 10 ? "0" + nowtime.getHours() : nowtime.getHours()) + ":" + (nowtime.getMinutes() < 10 ? "0" + nowtime.getMinutes() : nowtime.getMinutes());
                var week = nowtime.getDay();
                var output = weekStr[week] + "<br/>" + ymd;
                $(".dtTime b.left").html(output);
                $(".dtTime b.right").html(hm);
            }

            $(".teachingFor").on("click", function () {
                $(this).find(".top").slideToggle();
            });
            $(".teachingFor .top ul li").on("click", function () {
                var txt = $(this).text();
                $(this).parents(".teachingFor").find("label").text(txt);
                $(this).parents(".top").find("li").removeClass("on");
                $(this).addClass("on");
            })
            $("body").on("click", function (event) {
                var e = event || window.event || e;
                var obj = $(e.srcElement || e.target);
                if ($(obj).isChildAndSelfOf(".teachingFor")) {

                }
                else {
                    $(".teachingFor .top").slideUp();
                }
            });
            $(".teacherAide").on("click", function () {
                $(this).toggleClass("close");
            })
        });
        //callHostFunction C#注册 供js调用函数的变量
        var isDefined = true;
        try {
            callHostFunction;
        } catch (e) {
            isDefined = false;
        }
        function fromformtext(msg) {
            //alert("来自窗体的信息:"+msg);
        }
        ////////////////////////////////////
        ////////////////退出////////////////
        ////////////////////////////////////
        function Exit() {
            commonFuncJS.openConfirm("是否退出账号？", function () {
                if (typeof WebViewJavascriptBridge != "undefined") {
                    window.WebViewJavascriptBridge.callHandler(
                        'Islogin '
                        , "login"
                        , function (responseData) {
                        });
                }
                window.location.href = "login.aspx";
            }, function () {
                return false;
            })
        }
        function openEK() {
            if (userInfo.Type === 26) {
                $(".isEk").addClass("disableEk");
            }
            else {
                $(".isEk").css("display", "inline-block");
            }
        }
        ////////////////////////////////////
        ////////////////全屏////////////////
        ////////////////////////////////////
        function fullScreen() {
            if (isDefined == true) {
                callHostFunction.callBackFullScreen1();
            }
        }

        ////////////////////////////////////
        ////////////////上课////////////////
        ////////////////////////////////////
        function lesson() {
            if (isDefined == true) {
                callHostFunction.callBackLesson();
            }
        }


        $(function () {
            userInfo = commonFuncJS.getDataF('UserInfo');
            if (userInfo == null) {
                window.location.href = "Login.aspx";
            }
            var userInfoCls = userInfo;
            if (userInfo.Type === 26) {
                $("#username").text("欢迎您，" + userInfoCls.Name + "同学");
                $(".classBeike,.teacherAide,.teachingFor i").hide();
                $(".teachingFor").unbind();
            }
            else {
                $("#username").text("欢迎您，" + userInfoCls.Name + "老师");
            }
            $(".classBeike").on("click", function () {
                //记录用户选择备课操作
                teachLessonManage.SaveOperData(userInfoCls.Id, userInfoCls.Type, Constant.OperType.PrelessonM_TYPE, '备课模块');
                var type = getUrlParam('type');
                if (type != null)
                    window.location.href = "PreLesson/page/UserStandBook.aspx?type=" + type;
                else
                    window.location.href = "PreLesson/page/UserStandBook.aspx";
            });
            $(".menu .li2").on("click", function () {
                //记录用户选择上课操作
                teachLessonManage.SaveOperData(userInfoCls.Id, userInfoCls.Type, Constant.OperType.TeachM_TYPE, '上课模块');
                window.location.href = "AttLesson/Page/SelectBook.aspx";
            });
        });

        //loading加载···
        $(window).load(function () {
            $('#loadingDiv').hide();
        })
    </script>
    <%--先加载功能库文件，分担备课页面压力--%>
    <script src="App_Theme/dialog/artDialog.js"></script>
    <script src="PreLesson/Js/Management/PreLessonManagement.js"></script>
    <script src="PreLesson/Js/PageInit/IndexInit.js"></script>
</body>
</html>
