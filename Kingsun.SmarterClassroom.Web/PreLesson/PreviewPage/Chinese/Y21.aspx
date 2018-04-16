<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Y21.aspx.cs" Inherits="SmarterClassroomWeb.PreLesson.PreviewPage.Chinese.Y21" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>我会读</title>
<link href="../../../App_Theme/css/base1.css" rel="stylesheet" />
    <link href="../../../App_Theme/css/chinese.css" rel="stylesheet" />
    <script src="../../../CommonJs/jquery/jquery-1.11.2.min.js"></script>
    <script src="../../../App_Theme/js/jquery.nicescroll.js"></script>
    <script src="../../../CommonJs/CommonDB/CommonDB.js"></script>
    <script src="../../../CommonJs/jquery/jquery.json-2.4.js"></script>
</head>
<body>
    <form id="form1" runat="server">
    <div class="Y Y21">
    </div>
    </form>
</body>
    <script type="text/javascript">
        //获取页面url
        var QuestionID = "";
        var StuTaskID = "";
        var AccessType = "";
        var startTime, endTime, spendtime;

        var backurl = "";
        var lasturl = "";
        $(function () {
            startTime = new Date().getTime();
            //获取页面url
            QuestionID = Common.QueryString.GetValue("QuestionID");
            StuTaskID = Common.QueryString.GetValue("StuTaskID");
            //1：教师预览；2：总体预览；3：学生做题；4：错题重做；5：错题集
            AccessType = Common.QueryString.GetValue("AccessType");

            if (Common.Cookie.getcookie(StuTaskID + QuestionID + "Recorder")) {
                lasturl = Common.Cookie.getcookie(StuTaskID + QuestionID + "Recorder");
                backurl = lasturl;
                window.parent.PauseState();
            } else {
                window.parent.ChangeTitle(1);
            }


            //设置参数  
            if (AccessType == 1 || AccessType == 2) {
                if (QuestionID == "undefined") {
                    alert("未获取到相应参数，不能获取题目内容！");
                    window.parent.backList();
                }
            }
            else if (AccessType == 3 || AccessType == 4) {
                if (QuestionID == "undefined" || StuTaskID == "undefined") {
                    alert("未获取到相应参数，不能获取作业题目信息！");
                    window.parent.backList();
                }
            }
            else if (AccessType == 5) {
                if (QuestionID == "undefined") {
                    alert("未获取到相应参数，不能获取题目内容！");
                    window.parent.backList();
                }
            }
            else {
                alert("未获取到相应参数！");
                window.parent.backList();
            }
            obj = { QuestionID: QuestionID, StuTaskID: StuTaskID == "undefined" ? "" : StuTaskID };

            //获取题目信息
            $.post(Constant.SunnyTask + "TaskApi/Question/GetQuestionInfo", obj, function (data) {
                if (data.Success) {
                    for (var i = 0; i < data.Data.length; i++) {
                        if (data.Data[i].ParentID == "") {
                            //判断是短文还是诗歌
                            if (data.Data[i].QuestionTitle.indexOf("*") < 0) {
                                //短文
                                ShowEssay(data.Data);
                            } else {
                                //诗歌
                                ShowPoetry(data.Data);
                            }
                            resizeWindow();
                            //题目音频
                            window.parent.InitYWPlay(data.Data[i].Mp3Url);

                            if (lasturl != "") {
                                window.parent.InitBackPlay(lasturl);
                                window.parent.ChangeTitle(0);
                            }
                            window.parent.Record(1);
                            //做作业情况下
                            if (AccessType == 3) {
                                //判断是否有做过，做过给回放按钮
                                if (data.Data[i].StuAnswer != null) {
                                    window.parent.InitBackPlay(data.Data[i].StuAnswer.Answer);
                                    window.parent.ShowYWResult();
                                }
                            }
                            if (AccessType == 4 || AccessType == 5) {
                                if (Common.Cookie.getcookie(StuTaskID + QuestionID + "Recorder")) {
                                    window.parent.InitBackPlay(Common.Cookie.getcookie(StuTaskID + QuestionID + "Recorder"));
                                }
                            }
                        }
                    }
                }
            });

        });

        function resizeWindow() {
            window.parent.autoSetPosition(0, 0);
            $('.Y').niceScroll({ touchbehavior: false, autohidemode: false, cursorcolor: "#dcdcdc", cursoropacitymax: 1, cursorwidth: 8 });
        }

        function EndRecord(urlData) {
            var isFinish = 0;
            if (urlData != "" && urlData != undefined) {
                backurl = window.parent.KSRecord.GetReplayPath();
            } else {
                isFinish = 1;
            }
            endTime = new Date().getTime();
            spendtime = (endTime - startTime) / 1000;
            startTime = endTime;//重新计时

            //上传录音
            $.post("?action=UploadAudioFile", {
                BackUrl: backurl, LastUrl: lasturl, QuestionID: QuestionID,
                StuTaskID: StuTaskID, SpendTime: spendtime == 0 ? 1 : spendtime, AccessTpe: AccessType, IsFinish: isFinish
            }, function (result) {
                if (result) {
                    result = eval("(" + result + ")");//JSON.parse
                    if (result.Success) {
                        backurl = result.Data;
                        lasturl = backurl;
                        window.parent.InitBackPlay(backurl);
                        Common.Cookie.setcookie(StuTaskID + QuestionID + "Recorder", backurl);
                        if (result.Message == "") {
                            if (urlData == "" || urlData == undefined) {
                                lasturl = '';
                                //完成录音按钮隐藏
                                window.parent.HideFinishBtn();
                                window.parent.ShowYWResult();
                                Common.Cookie.delcookie(StuTaskID + QuestionID + "Recorder");
                            }
                        } else {
                            alert(result.Message);
                        }
                    }
                }
            });
        }

        //拼接拼音文字
        function Joint(content, secondC) {
            var contentHtml = '';
            if (secondC != undefined && secondC != "") {
                secondC = secondC.replace(/[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g, "");
                secondC = secondC.replace(/\s+/g," ");
                secondC = secondC.split(' ');
            }

            for (var i = 0, j = 0; i < content.length; i++, j++) {
                if (IsPunctuation(content[i]) || content[i] == " ") {
                    contentHtml += '<div class="bag s">';
                    contentHtml += '<span class="sign">' + content[i] + '</span>';
                    j = j - 1;
                } else {
                    if (secondC != undefined && secondC != "") {
                        contentHtml += '<div class="bag">';
                        contentHtml += '<span class="pin">' + (secondC[j] == '^' ? '' : secondC[j]) + '</span>';
                    } else {
                        contentHtml += '<div class="bag">';
                    }
                    contentHtml += '<span class="text">' + content[i] + '</span>';
                }
                contentHtml += '</div>';
            }

            return contentHtml;
        }

        //判断是否是标点符号
        function IsPunctuation(word) {
            //匹配这些中文标点符号 。 ？ ！ ， 、 ； ： “ ” ‘ ' （ ） 《 》 〈 〉 【 】 『 』 「 」 ﹃ ﹄ 〔 〕 … — ～ ﹏ ￥
            var reg = /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/;
            if (reg.test(word)) {
                return true;
            } else {
                return false;
            }
        }

        //短文展示
        function ShowEssay(content) {
            var essayHtml = '';
            //判断是否有拼音 
            if (content[2].SecondContent != "") {
                essayHtml += '<div class="pshell"><ol class="pytitle dw">';
                for (var i = 0; i < content.length; i++) {
                    if (content[i].ParentID != "") {
                        if (i == 1) {
                            //标题
                            if (content[i].QuestionContent != "") {
                                essayHtml += '<li class="title">' + Joint(content[1].QuestionContent, content[i].SecondContent) + '</li>';
                            }
                        } else {
                            if (content[i].QuestionContent == "") {
                                essayHtml += '<li class="li"><div class="bag"><span class="text"></span></div></li>';
                            } else {
                                //内容
                                essayHtml += '<li class="li"><div class="bag"><span class="sign"></span></div><div class="bag"><span class="sign"></span></div>'
                                    + Joint(content[i].QuestionContent, content[i].SecondContent) + '</li>';
                            }
                        }
                    }
                }
                essayHtml += '</ol>';
            }
                //无拼音
            else {
                essayHtml += '<div class="shell">';
                for (var i = 0; i < content.length; i++) {
                    if (content[i].ParentID != "") {
                        if (i == 1) {
                            //标题
                            if (content[i].QuestionContent != "") {
                                essayHtml += '<p class="title">' + content[i].QuestionContent + '</p>';
                            }
                        } else {
                            //内容
                            if (content[i].QuestionContent == "") {
                                essayHtml += '<p style="height:25px;"></p>';
                            } else {
                                essayHtml += '<p>' + content[i].QuestionContent + '</p>';

                            }
                        }
                    }
                }
            }
            $(".Y").html(essayHtml + '</div>');
        }

        //诗歌展示
        function ShowPoetry(content) {
            var essayHtml = '';
            //判断长度
            var len = 1;
            for (var i = 0; i < content.length; i++) {
                if (content[i].ParentID != "") {
                    var temp = content[i].QuestionContent.replace(/<font style=\"font-family:GB Pinyinok-C\">/g, "").replace(/<\/font>/g, "").length;
                    if (temp > len) {
                        len = temp;
                    }
                }
            }
            //有拼音
            if (content[2].SecondContent != "") {
                essayHtml += '<div class="pshell"><ol class="pytitle">';
                for (var i = 0; i < content.length; i++) {
                    if (content[i].ParentID != "") {
                        if (i == 1) {
                            //标题
                            if (content[i].QuestionContent != "") {
                                essayHtml += '<li class="title">' + Joint(content[1].QuestionContent, content[i].SecondContent) + '</li>';
                            }
                        } else {
                            //内容
                            if (content[i].QuestionContent == "") {
                                essayHtml += '<li class="li"><div class="bag"><span class="text"></span></div></li>';
                            } else {
                                essayHtml += '<li class="li">' + Joint(content[i].QuestionContent, content[i].SecondContent) + '</li>';
                            }
                        }
                    }
                }
            }
                //无拼音
            else {
                essayHtml += '<div class="pshell"><ol>';
                for (var i = 0; i < content.length; i++) {
                    if (content[i].ParentID != "") {
                        if (i == 1) {
                            //标题
                            if (content[i].QuestionContent != "") {
                                essayHtml += '<li class="title">' + content[i].QuestionContent + '</li>';
                            }
                        } else {
                            //内容
                            if (content[i].QuestionContent == "") {
                                essayHtml += '<li class="li"></li>';
                            } else {
                                essayHtml += '<li class="li">' + content[i].QuestionContent + '</li>';
                            }
                        }
                    }
                }
            }          
            $(".Y").html(essayHtml + '</ol></div>');
            var w = "";
            $.each($(".Y21 .pshell ol li"), function () {
                if (w < $(this).width()) {
                    w = $(this).width();
                } else {
                    w = w;
                }
            })
            $(".Y21 .pshell ol li").css("display", "block");
            $(".Y21 .pshell ol").css("width", w+5);//避免w取整长度不够
        }
    </script>
</html>
