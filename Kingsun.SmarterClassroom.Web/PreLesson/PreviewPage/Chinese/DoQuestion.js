/// <reference path="../Common.js" />
/// <reference path="../Plugins/jplayer/jquery.jplayer.min.js" />
/// <reference path="../Plugins/ChinesePlayer.js" />
/// <reference path="../Client.js" />
/// <reference path="../../App_Themes/js/artDialog/artDialog.js" />
//学生做作业页面js

var AccessType = parseInt(Common.QueryString.GetValue("AccessType"));
var StuTaskID;
var TaskID;
var QuestionID;
var PageIndex = 1;
var TaskState = 0;
var TaskQuestionList = [];
var QIndex = -1;
var Mp3Obj = null, BackMp3Obj = null,RecordObj=null,soloObj=null;
var submitDialog, helpDialog;
var autoScrollHeight = 0;

var classTaskID = Common.QueryString.GetValue("ClassTaskID");//是否来自课时
var classPackName = unescape(Common.QueryString.GetValue("TaskName"));//课时标题
var backurl = escape(Common.QueryString.GetValue("backurl"));//记录返回到优教学课时的返回路径
var Subject = parseInt(Common.QueryString.GetValue("Subject"));
var urldialog = null;
var IsDoubleScreen = 0;
var Csstype = Common.QueryString.GetValue("Csstype");//判断是否来自云平台

$(function () {
    $(".mp3Cont em.num").html("");
    autoSetPosition(1, IsDoubleScreen);
    switch (AccessType) {
        case 1:
        case 2:
            GetPreviewQuestions();
            break;

        case 3:
            GetStuTaskQuestions();
            break;
        case 4:
            GetStuWrongQuestions();
            break;

        case 5:
            GetWrongQueDo();
            break;
        case 6:
            //GetPreviewQuestions();
            break;
        default:
            break;
    }

    $("#divrecord").KingsunRecord({
        swfPath: "../../../App_Theme/js/KingRecord/YunzhishengForWeb.swf",
        Text: "",
        RecordEnd: function (value) {
            self.frames[0].EndRecord(value);
        }
    });
    $("#afinish").bind("click", function () {
        //判断是否在录音
        if ($("#record").next("div").find(".pause").hasClass("on")) {
            $("#record").next("div").find(".pause").click();
        }
        self.frames[0].EndRecord();
    });
    if (Common.Validate.IsInt(Common.QueryString.GetValue("PageIndex"))) {
        PageIndex = parseInt(Common.QueryString.GetValue("PageIndex"));
    }
    if (Common.Validate.IsInt(Common.QueryString.GetValue("TaskState"))) {
        TaskState = parseInt(Common.QueryString.GetValue("TaskState"));
    }
    $(window).resize(function () {
        autoSetPosition(0, IsDoubleScreen);
    });
});
//预览——获取指定题目信息
function GetPreviewQuestions() {
    if (Common.QueryString.GetValue("QuestionID")) {
        var qRound = Common.QueryString.GetValue("Round");
        QuestionID = Common.QueryString.GetValue("QuestionID");
        $.post(Constant.SunnyTask + "TaskApi/Question/GetPreviewQuestions", { QuestionID: QuestionID }, function (result) {
            TaskQuestionList = [];
            if (result) {
                if (result.Success) {
                    $.each(result.Data, function (index, value) {
                        var tmpurl = value.QuestionModel + ".aspx?AccessType=" + AccessType + "&QuestionID=" + value.QuestionID
                            + "&Round=" + qRound + "&QIndex=" + index + "&Sub=" + value.QuestionModel[0];
                        TaskQuestionList.push({ Url: tmpurl, QuestionTitle: value.QuestionTitle, Round: qRound, QuestionModel: value.QuestionModel });
                    });
                    QIndex = 0;
                    //默认到第一个未做的题目
                    loadQuestion(QIndex);
                } else {
                    alert(result.Message);
                    backList();
                }
            } else {
                alert("未获取到信息哦！");
                backList();
            }
        });
    }
}
//做作业——获取学生作业题目
function GetStuTaskQuestions() {
    if (Common.QueryString.GetValue("StuTaskID")) {
        StuTaskID = Common.QueryString.GetValue("StuTaskID");
        TaskID = Common.QueryString.GetValue("TaskID");
        $.post("?action=GetStuTaskQuestions&Rand=" + Math.random(), { StuTaskID: StuTaskID, TaskID: TaskID }, function (result) {
            TaskQuestionList = [];
            if (result) {
                if (result.Success) {
                    $.each(result.Data, function (index, value) {
                        if (value.IsDo == 0 && QIndex < 0) {
                            QIndex = index;
                        }
                        var tmpurl = value.QuestionModel + ".aspx?AccessType=" + AccessType + "&StuTaskID=" + value.StuTaskID + "&IsDo=" + value.IsDo
                                + "&QuestionID=" + value.QuestionID + "&Round=" + value.Round + "&QIndex=" + index + "&Sub=" + value.QuestionModel[0] + "&ParentID=" + value.ParentID;
                        ////清除语文录音缓存
                        Common.Cookie.delcookie(StuTaskID+value.QuestionID + "Recorder");
                        TaskQuestionList.push({ Url: tmpurl, QuestionTitle: value.QuestionTitle, Round: value.Round, QuestionModel: value.QuestionModel });
                    });
                    if (QIndex < 0) {
                        QIndex = TaskQuestionList.length - 1;
                    }
                    //默认到第一个未做的题目
                    loadQuestion(QIndex);
                } else {
                    alert(result.Message);
                    backList();
                }
            } else {
                alert("未获取到信息哦！");
                backList();
            }
        });
    }
}
//错题重做——获取学生作业错题
function GetStuWrongQuestions() {
    if (Common.QueryString.GetValue("StuTaskID")) {
        StuTaskID = Common.QueryString.GetValue("StuTaskID");
        TaskID = Common.QueryString.GetValue("TaskID");
        $.post("?action=GetStuWrongQuestions&Rand=" + Math.random(), { StuTaskID: StuTaskID, TaskID: TaskID }, function (result) {
            TaskQuestionList = [];
            if (result) {
                result = eval("(" + result + ")");//JSON.parse
                var tempParentID = '';
                if (result.Success) {
                    $.each(result.Data, function (index, value) {
                        if (value.QuestionModel == "Y18" && value.ParentID !=null&&value.ParentID != '') {
                            if (value.ParentID != tempParentID) {
                                tempParentID = value.ParentID;
                                tmpurl = value.QuestionModel + ".aspx?AccessType=" + AccessType + "&StuTaskID=" + value.StuTaskID + "&IsDo=" + value.IsDo
                                            + "&QuestionID=" + value.ParentID + "&Round=" + value.Round + "&QIndex=" + index + "&Sub=" + value.QuestionModel[0] + "&ParentID=" + value.ParentID;
                                TaskQuestionList.push({ Url: tmpurl, QuestionTitle: value.QuestionTitle, Round: value.Round, QuestionModel: value.QuestionModel });
                            }
                        } else {
                            tmpurl = value.QuestionModel + ".aspx?AccessType=" + AccessType + "&StuTaskID=" + value.StuTaskID + "&IsDo=" + value.IsDo
                                    + "&QuestionID=" + value.QuestionID + "&Round=" + value.Round + "&QIndex=" + index + "&Sub=" + value.QuestionModel[0] + "&ParentID=" + value.ParentID;
                            TaskQuestionList.push({ Url: tmpurl, QuestionTitle: value.QuestionTitle, Round: value.Round, QuestionModel: value.QuestionModel });
                        }
                        ////清除语文录音缓存
                        Common.Cookie.delcookie(StuTaskID+value.QuestionID + "Recorder");                      
                    });
                    QIndex = 0;
                    //默认到第一个未做的题目
                    loadQuestion(QIndex);
                } else {
                    alert(result.Message);
                    backList();
                }
            } else {
                alert("未获取到信息哦！");
                backList();
            }
        });
    }
}

//错题集做题，获取题目  AccessType=5
function GetWrongQueDo() {
    if (Common.QueryString.GetValue("UnitID") && Common.QueryString.GetValue("QuestionID")) {
        var UnitID = Common.QueryString.GetValue("UnitID");
        var QuestionID = (Common.QueryString.GetValue("QuestionID") == "undefined" ? "" : Common.QueryString.GetValue("QuestionID"));
        $.post("?action=GetWrongQueDo&Rand=" + Math.random(), { QuestionID: QuestionID, UnitID: UnitID }, function (result) {
            TaskQuestionList = [];
            if (result) {
                result = eval("(" + result + ")");//JSON.parse
                if (result.Success) {
                    $.each(result.Data, function (index, value) {
                        var tmpurl = value.QuestionModel + ".aspx?AccessType=" + AccessType + "&IsDo=" + value.IsDo
                                + "&QuestionID=" + value.QuestionID + "&Round=" + value.Round + "&QIndex=" + index + "&Sub=" + value.QuestionModel[0];
                        ////清除语文录音缓存
                        Common.Cookie.delcookie(StuTaskID + value.QuestionID + "Recorder");
                        TaskQuestionList.push({ Url: tmpurl, QuestionTitle: value.QuestionTitle, Round: value.Round, QuestionModel: value.QuestionModel });
                    });
                    QIndex = 0;
                    //默认到第一个未做的题目
                    loadQuestion(QIndex);
                } else {
                    alert(result.Message);
                    backList();
                }
            } else {
                alert("未获取到信息哦！");
                backList();
            }
        });
    }
}



//返回上一页
function backList() {
    var BookID = Common.QueryString.GetValue("BookID");
    var BookType = Common.QueryString.GetValue("BookType");
    var BookReel = Common.QueryString.GetValue("BookReel");
    var StageID = Common.QueryString.GetValue("StageID");
    var GradeID = Common.QueryString.GetValue("GradeID");
    var SubjectID = Common.QueryString.GetValue("SubjectID");
    var EditionID = Common.QueryString.GetValue("EditonID");
    var html = '?BookID=' + BookID + '&SubjectID=' + SubjectID + '&EditonID=' + EditionID + '&GradeID=' + GradeID + '&StageID=' + StageID + "&BookReel=" + BookReel + "&BookType=" + BookType;
    //location.href = "../../Page/PerLessonForJF.aspx" + html;
    artFull.close();
    //if (classTaskID != "" && classTaskID != "undefined") {
    //    location.href = "../Others/TaskArrange.aspx?ClassTaskID=" + classTaskID + "&TaskName=" + escape(classPackName) + "&backurl=" + backurl;
    //} else {
    //    switch (AccessType) {
    //        case 1://预览：返回布置作业
    //            location.href = "../Teacher/TaskArrange.aspx" + (Csstype != "undefined" ? "?Csstype=cloudHeader" : "");
    //            break;
    //        case 2://预览：返回作业篮
    //            location.href = "../Teacher/TaskBasket.aspx" + (Csstype != "undefined" ? "?Csstype=cloudHeader" : "");
    //            break;
    //        case 3://做作业：返回任务列表
    //            location.href = "../Student/StuTaskList.aspx?PageIndex=" + PageIndex + "&TaskState=" + TaskState + "&Subject=" + Subject;
    //            break;
    //        case 4://错题重做：返回作业报告
    //            location.href = "../Student/StuReport.aspx?StuTaskID=" + StuTaskID + "&PageIndex=" + PageIndex + "&TaskState=" + TaskState + "&Subject=" + Subject;
    //            break;
    //        case 5://错题集：返回返回错题集
    //            location.href = "../Student/StuWrongQue.aspx?dBid=" + Common.QueryString.GetValue("dBid") + "&UnitID=" + Common.QueryString.GetValue("UnitID") + "&SubID=" + Common.QueryString.GetValue("SubID");;
    //            break;
    //        default:
    //            break;
    //    }
    //}
}
//打开跟读题帮助
function openHelpDialog() {
    //切换时停止播放
    if (Mp3Obj) {
        Mp3Obj.Stop();
    }
    //暂停录音回放
    if ($("#aSmall").hasClass("on")) {
        BackMp3Obj.jPlayer("stop");
        $("#aSmall").removeClass("on");
    }

    var dialogHtml = '<div class="tipCont" id="helpDiv"><em style="background: url(../App_Themes/images/close_bg.png) center center no-repeat; position: absolute; cursor: pointer; right: 0px; width: 30px; height: 30px; margin-top: -10px; margin-right: -10px;" onclick="closeDialog(helpDialog)"></em>'
        + '<dl>'
            + '<dt>录音流程：</dt>'
            + '<dd><span>点击</span><em class="em1">&nbsp;</em><span>开始跟读</span><em class="em">&nbsp;</em><span>原音播放</span><em class="em">&nbsp;</em><span>自动开始录音</span><em class="em">&nbsp;</em><span>录音结束显示本次录音得分；</span></dd>'
            + '<dt>温馨提示：</dt>'
            + '<dd><span>原音播放和录音过程可点击</span><em class="em2">&nbsp;</em><span>按钮暂停；</span></dd>'
            + '<dd><span>录音结束后可点击</span><em class="em3">&nbsp;</em><span>听自己的声音；</span></dd>'
            + '<dd><span>读完规定次数后，还可以继续跟读哦，最终成绩取最高分；</span></dd>'
            + '<dt><span>注意：</span></dt>'
            + '<dd><span>一定要读完规定次数哦，若没有完成，不会有最终成绩。</span></dd>'
            + '<dt><span>若不小心拒绝了麦克风，按F5键刷新点“允许”哦！</span></dt>'
        + '</dl>'
    + '</div>';
    helpDialog = art.dialog({
        id: 'IsHelp',
        opacity: .1,
        padding: 0,
        lock: true,
        content: dialogHtml
    });
    $(".aui_close").hide();//隐藏弹窗的关闭按钮
}
//提交作业
function submitTask() {
    //切换时停止播放
    if (Mp3Obj) {
        Mp3Obj.Stop();
        $("#aPlay").removeClass("on");
    }
    if (soloObj) {
        soloObj.jPlayer("pause");
    }
    if (BackMp3Obj) {
        if ($("#aSmall").hasClass("on")) {
            BackMp3Obj.jPlayer("stop");
            $("#aSmall").removeClass("on");
        }
    }
    if (RecordObj) {
        $("#record").next("div").find(".pause").click();
        $(".li4").attr("title", "点击开始");
    }

    var isFinish = true;
    $.post("?action=CheckIsFinish&Rand=" + Math.random(), { StuTaskID: StuTaskID, TaskID: TaskID }, function (result) {
        if (result) {
            result = eval("(" + result + ")");//JSON.parse
            if (result.Success) {
                isFinish = result.Data;
                var dialogText = '', btn1Text = '', btn2Text = '';
                if (isFinish) {
                    dialogText = '作业完成啦~还可以修改哦！检查一下再提交吧？';
                    btn1Text = '返回修改';
                    btn2Text = '不，我要提交';
                } else {
                    dialogText = '作业还没有做完哦！把剩下的做完再提交吧~';
                    btn1Text = '继续做题';
                    btn2Text = '不，我要提交';
                }

                var dialogHTML = '<div class="submitMsg"><span><h4>提示</h4><p>' + dialogText + '</p></span>'
                    + '<div><a class="btn1' + (isFinish ? '' : ' on') + '" onclick="closeSubmitDialog(0)">' + btn1Text + '</a>'
                    + '<a class="btn2 ' + (isFinish ? ' on' : '') + '" onclick="closeSubmitDialog(1)">' + btn2Text + '</a></div></div>';
                submitDialog = art.dialog({
                    id: 'IsSubmit',
                    opacity: .1,
                    padding: 0,
                    lock: true,
                    content: dialogHTML
                });
                $(".aui_close").hide();//隐藏弹窗的关闭按钮
            } else {
                alert(result.Message);
                location.href = "../Student/StuTaskList.aspx?PageIndex=" + PageIndex + "&TaskState=" + TaskState + "&Subject=" + Subject;
            }
        }
    });
}
function closeDialog(dialogObj) {
    dialogObj.close();
}

//关闭提交作业询问窗口
function closeSubmitDialog(isSubmit) {
    closeDialog(submitDialog);
    if (isSubmit == 1) {
        confirmSubmitTask();
    } else {
        history.go(0);
    }
}
//确认提交作业
function confirmSubmitTask() {
    var dialog = art.dialog({
        id: 'loading',
        opacity: .1,
        padding: '0',
        lock: true,
        content: '<img style="width:305px;height:304px;align:center" src="../App_Themes/images/Loading.gif" />'
    });
    $(".aui_close").hide();//隐藏弹窗的关闭按钮
    $.post("?action=SubmitTask&Rand=" + Math.random(), { StuTaskID: StuTaskID }, function (result) {
        TaskQuestionList = [];
        if (result) {
            result = eval("(" + result + ")");//JSON.parse
            if (result.Success) {
                if (result.Data != "") {
                    alert(result.Data);
                    location.replace("../Student/StuTaskList.aspx?StuTaskID=" + StuTaskID + "&PageIndex=" + PageIndex + "&TaskState=" + TaskState+ "&Subject=" + Subject);
                } else {
                    if (confirm("提交成功！是否查看作业报告？")) {
                        location.replace("../Student/StuReport.aspx?StuTaskID=" + StuTaskID + "&PageIndex=" + PageIndex + "&TaskState=" + TaskState + "&Subject=" + Subject);
                    } else {
                        location.replace("../Student/StuTaskList.aspx?StuTaskID=" + StuTaskID + "&PageIndex=" + PageIndex + "&TaskState=" + "&Subject=" + Subject);
                    }
                }
            } else {
                alert(result.Message);
                dialog.close();
            }
        }
    });
}
//上一题
function prevQuestion() {
    $("#prevA").hide();
    clear();
    if (QIndex > 0) {
        QIndex--;
        //if (RecordObj) {
        //    $("#record").next("div").find(".pause").click();
        //    $(".li4").html('<div id="record" style="display:none"></div>');
        //    $(".li4").attr("title", "点击开始");
        //    setTimeout("loadQuestion(QIndex)", "300");
        //} else {
            loadQuestion(QIndex);
        //}
    }
}
//下一题
function nextQuestion() {
    $("#nextA").hide();
    clear();
    if (QIndex < TaskQuestionList.length - 1) {
        QIndex++;
        //if (RecordObj) {
        //    $("#record").next("div").find(".pause").click();
        //    $(".li4").html('<div id="record" style="display:none"></div>');
        //    $(".li4").attr("title", "点击开始");
        //    setTimeout("loadQuestion(QIndex)", "300");
        //} else {
            loadQuestion(QIndex);
        //}
    }
}
//加载题目
function loadQuestion(qindex) {
    //做作业时检测作业是否被老师撤销
    if (AccessType == 3) {
        $.post("?action=CheckIsUndo&Rand=" + Math.random(), { StuTaskID: StuTaskID }, function (result) {
            if (result) {
                result = eval("(" + result + ")");//JSON.parse
                if (result.Success) {
                    loadQ(qindex);
                } else {
                    alert(result.Message);
                    location.href = "../Student/StuTaskList.aspx?PageIndex=" + PageIndex + "&TaskState=" + TaskState + "&Subject=" + Subject;
                }
            }
        });
    } else {
        loadQ(qindex);
    }
}
function clear()
{
    $(".li1").hide();
    $(".li2").hide();
    $(".li3").hide();
    $(".li5").hide();
    $(".li4").hide();
    $(".playing").hide();
    $(".doll").hide();
    $(".conts").hide();
}
function loadQ(qindex) {
    //$(".solution,.judgeN").hide();
    //$(".titBox").hide();
    //$(".titCont").hide();
    $(".mp3Cont em.num").html("");
    //切换时停止播放
    if (Mp3Obj) {
        Mp3Obj.Stop();
    }
    if (soloObj) {
        soloObj.jPlayer("pause");
        $("#aPlay").removeClass("on");
    }
    if (RecordObj) {
        RecordObj.Stop();
        $(".li4").html('<div id="record" style="display:none"></div>');
    }

    //移除语文原因播放按钮
    //$(".li3").hide();
    //$(".li5").hide();
    //$(".li4").hide();
    //$(".playing").hide();
    //$(".doll").hide();
    //切换题目时移除回放按钮
    InitBackPlay("");

    if (TaskQuestionList[qindex].QuestionTitle[0] == "*") {
        TaskQuestionList[qindex].QuestionTitle = TaskQuestionList[qindex].QuestionTitle.substring(1);
    }
    var tmpTitle = TaskQuestionList[qindex].QuestionTitle;
    if (TaskQuestionList[qindex].QuestionModel == "M1" || TaskQuestionList[qindex].QuestionModel == "M2") {
        if (tmpTitle.length > 32) {
            tmpTitle = tmpTitle.substring(0, 29) + "...";
        }
        tmpTitle += "<b>听读" + TaskQuestionList[qindex].Round + "遍</b>"
    } else {
        if (tmpTitle.length > 36) {
            tmpTitle = tmpTitle.substring(0, 33) + "...";
        }
    }

    if (TaskQuestionList.length == 1) {
        if (AccessType == 3) {
            $("#submitA").show();
        }
        //$("#prevA").hide();
        //$("#nextA").hide();
    } else {
        if (qindex == 0) {
            $("#prevA").hide();
            $("#nextA").show();
        } else if (qindex == TaskQuestionList.length - 1) {
            if (AccessType == 3) {
                $("#submitA").show();
            }
            $("#prevA").show();
            $("#nextA").hide();
        } else {
            $("#prevA").show();
            $("#nextA").show();
        }
    }

    $("#topicTitle").html((qindex + 1) + "/" + TaskQuestionList.length + "、" + tmpTitle).attr("title", tmpTitle);
    $("#iframe1").attr("src", TaskQuestionList[qindex].Url);
}
//自适应屏幕大小
function autoSetPosition(isInit, isDoubleScreen) {
    IsDoubleScreen = isDoubleScreen;
    var windowHeight = $(window).height();
    var iframeHeight = document.getElementById('iframe1').contentWindow.document.documentElement.scrollHeight;
    var contCHeight = iframeHeight + 40;//音频控件多出的高度：40px
    var boxHeight = contCHeight + 154; //上、下栏高度共：154px;
    boxHeight = boxHeight > 600 ? boxHeight : 600;//最小高度为600px
    var setYH = 0;//上、下间隔
    if (windowHeight < boxHeight) {
        setYH = 10;
    } else {
        setYH = (windowHeight - boxHeight) / 2
    }
    autoScrollHeight = 66 + setYH / 2;

    if (isInit == 1) {//初次加载(没有内容)时，固定iframe最小高度:426px (620-154-40)
        $(document.getElementById('iframe1')).css("height", "426px");
        $('.box').css({ "position": "absolute", "top": setYH + "px" });
    }
    else {
        if (windowHeight <= 620) {//页面高度不足620（600+10+10）时
            iframeHeight = 426;
        } else {
            if (windowHeight < boxHeight) {//做题框的高度大于页面高度时，iframe的高度：页面高度-154-40-10*2
                iframeHeight = windowHeight - 214;
            } else if (iframeHeight < 426) {
                iframeHeight = 426;
            }
        }

        if (isDoubleScreen == 0) {//一屏
            $(document.getElementById('iframe1')).css("height", iframeHeight + "px");
            $('.Y', document.getElementById('iframe1').contentWindow.document).css("height", iframeHeight + "px");
            $('.box').css({ "position": "absolute", "top": setYH + "px" });
        } else {//上下分屏
            var stemHeight = $('.Y .stem', document.getElementById('iframe1').contentWindow.document).height();
            var problemHeight = $('.Y .problem', document.getElementById('iframe1').contentWindow.document).height();
            if (stemHeight > (iframeHeight - 10) / 2) {//上屏高度大于整体的一半时，固定高度
                if (problemHeight > (iframeHeight - 10) / 2) {
                    stemHeight = (iframeHeight - 10) / 2;
                    problemHeight = (iframeHeight - 10) / 2;
                } else {
                    stemHeight = iframeHeight - 10 - problemHeight;
                }
            } else {
                problemHeight = iframeHeight - 10 - stemHeight;
            }

            $(document.getElementById('iframe1')).css("height", iframeHeight + "px");
            $('.Y .stem', document.getElementById('iframe1').contentWindow.document).css("height", stemHeight + "px");
            $('.Y .problem', document.getElementById('iframe1').contentWindow.document).css("height", problemHeight + "px");
            $('.box').css({ "position": "absolute", "top": setYH + "px" });
        }
    }
}

//听力题音频加载
function InitPlay(Mp3Url) {
    $("#divrecord").css({ "z-index": "0", top: "0px", left: "0px" });
    $("#record1").css({ width: "1px", height: "1px" });
    $(".li1").show();
    //检测页面是否已加载播放控件
    if (Mp3Obj) {
        Mp3Obj.jPlayer("destroy");
        $(".li1").html('<div class="mp3player" id="mp3player"></div>');
    }
    //初始化音频播放
    Mp3Obj = $("#mp3player").ChinesePlayer({
        swfPath: "../../../App_Theme/js/jplayer/",
        mp3: Mp3Url,
        module: 0,
        OnlyOne: true
    });
}
//加载音频回放按钮
function InitBackPlay(Mp3Url) {
    $(".li2").show();
    if (Mp3Url) {
        var tmpBackUrl = Mp3Url.split(";");
        var backindex = 0;
        if (BackMp3Obj) {
            //移除绑定的时间以及清除录音回放控件
            Common.removeHandler(document.getElementById("aSmall"), "click", backClickHandler);
            BackMp3Obj.jPlayer("destroy");
        }
        //初始化回放按钮
        BackMp3Obj = $("#backplayer").jPlayer({
            ready: function () {
                $(this).jPlayer("setMedia", {
                    mp3: tmpBackUrl[backindex]
                });
            },
            ended: function () {
                if (backindex < tmpBackUrl.length - 1) {
                    backindex = backindex + 1;
                    $(this).jPlayer("setMedia", {
                        mp3: tmpBackUrl[backindex]
                    }).jPlayer("play");
                }
                else {
                    backindex = 0;
                    $(this).jPlayer("setMedia", {
                        mp3: tmpBackUrl[backindex]
                    });
                    $("#aSmall").removeClass("on");
                }
            },
            supplied: "mp3",
            wmode: "window",
            swfPath: "../Scripts/Plugins/jplayer/"
        });
        //回放按钮点击事件
        Common.addHandler(document.getElementById("aSmall"), "click", backClickHandler);
        //$(".li2").show();
        $("#aSmall").attr("class", "");
    } else {
        if (BackMp3Obj) {
            //移除绑定的时间以及清除录音回放控件
            if ($("#aSmall").hasClass("on")) {
                BackMp3Obj.jPlayer("stop");
                $("#aSmall").removeClass("on");
            }
            Common.removeHandler(document.getElementById("aSmall"), "click", backClickHandler);
            BackMp3Obj.jPlayer("destroy");
        }
        $(".li2").hide();
    }
}
//回放按钮点击事件句柄
function backClickHandler() {
    if ($("#aSmall").hasClass("on")) {
        BackMp3Obj.jPlayer("stop");
        $("#aSmall").removeClass("on");
    }
    else {
        //检测是否播放原音
        if (soloObj) {
            soloObj.jPlayer("pause");
            $("#aPlay").removeClass("on");
        }
        $("#aSmall").addClass("on");
        BackMp3Obj.jPlayer("play");
    }
}

//错题模式下显示正确答案
//answerHtml格式：<span class="w">(1)book</span><span class="r">(2)book</span><span class="w">(3)book</span>
function ShowAnswer(isRight, answerHtml) {
    //切换时停止播放
    if (Mp3Obj) {
        Mp3Obj.Stop();
    }
    //切换题目时移除回放按钮
    InitBackPlay("");
    var aHtml = '<div class="conts ' + (isRight ? 'good' : 'bad') + '"><div class="boxS"><table><tr><td><em></em></td><td>';
    if (isRight) {
        aHtml += '<span>恭喜你，答对了！</span>';
    } else {
        aHtml += '<span class="first">正确答案:</span>' + answerHtml;
    }
    aHtml += '</td></tr></table></div></div>';
    $(".solution").html(aHtml);
    $(".li1").hide();
    $(".solution").show();
}

function HidePlay() {
    $(".li1").hide();
    $(".li2").hide();
    $("#divrecord").css({ "z-index": "-1", top: "0px", left: "0px" });
    $("#record1").css({ width: "1px", height: "1px" });
}

//显示跟读结果
function ShowBackPlayer(backUrl) {
    $("#aSmall").attr("class", "");
    InitBackPlay(backUrl);
}

//语文播放按钮点击事件句柄
function ywplayerClickHandler() {
    if ($("#aPlay").hasClass("on")) {
        soloObj.jPlayer("pause");
        $("#aPlay").removeClass("on");
    }
    else {
        //检测是否在录音
        if ($("#record").next("div").find(".pause").hasClass("on")) {
            $("#record").next("div").find(".pause").click();
        }
        //检测是否在回放
        if (BackMp3Obj) {
            BackMp3Obj.jPlayer("stop");
            $("#aSmall").removeClass("on");
        }
        $("#aPlay").addClass("on");
        soloObj.jPlayer("play");
    }
}

//语文跟读音频播放
function InitYWPlay(mp3Url)
{
    $(".li4").show();
    $(".li3").show();
    //检测页面是否已加载播放控件
    if (soloObj) {
        soloObj.jPlayer("destroy");
        Common.removeHandler(document.getElementById("aPlay"), "click", ywplayerClickHandler);
    }
    //暂停录音回放
    if ($("#aSmall").hasClass("on")) {
        BackMp3Obj.jPlayer("stop");
        $("#aSmall").removeClass("on");
    }
    if (mp3Url) {
        //初始化音频播放
        soloObj = $("#ywplayer").jPlayer({
            ready: function () {
                $(this).jPlayer("setMedia", {
                    mp3: mp3Url
                });
            },
            pause: function () {

            },
            ended: function () {
                $("#aPlay").removeClass("on");
            },
            supplied: "mp3",
            wmode: "window",
            swfPath: "../Scripts/Plugins/jplayer/"
        });
        Common.addHandler(document.getElementById("aPlay"), "click", ywplayerClickHandler);
        $("#aPlay").attr("class", "");
    } else {
        alert("此题没有声音哦");
    }
}

//语文录音
function Record(type) {
    
    //检测QQ浏览器是否为极速模式
    if (Client.ua.indexOf("QQ") >= 0 && Client.browser.chrome > 0) {
        art.dialog({
            id: 'QQDetect',
            opacity: .1,
            width: 300,
            lock: true,
            cancelVal: '取消',
            cancel: function () {
                backList();
            },
            content: '<span style="font-size:20px;color:red;"><b>请先切换为“兼容模式”哦！</b></span><img style="align:center" src="../App_Themes/images/QQBrowserConfig.png" />'
        });
        $(".aui_close").hide();//隐藏弹窗的关闭按钮
    } else {

        $("#divrecord").css({ "z-index": "999", top: "250px", left: "400px" });
        $("#record1").css({ width: "220px", height: "140px" });

        KSRecord.KingRecord = swfobject.getObjectById("record1");
        var tmpInterval = setInterval(function () {
            try {
                if (KSRecord.MicroReady()) {
                    $(".li4").show();
                    clearInterval(tmpInterval);
                }
            } catch (e) {

            }
        }, 1000);

        if (RecordObj)
        {
            RecordObj.Stop();
            $(".li4").html('<div id="record" style="display:none"></div>');
        }

        //初始化音频播放
        RecordObj = $("#record").ChinesePlayer({
            swfPath: "../Scripts/Plugins/jplayer/",
            mp3: 'http://yjx.kingsunedu.com/SunnyTask/QuestionFiles/牛津上海本地版/练习部分/4B/M4 Unit 3/Mp3/M4U3T403.mp3',
            content: '123123',
            module: 1,
            ksRecord: KSRecord,
            AutoNext: false,
            OnlyOne: true,
            StartRecord: function (cIndex) {
                //暂停录音回放
                if ($("#aSmall").hasClass("on")) {
                    BackMp3Obj.jPlayer("stop");
                    $("#aSmall").removeClass("on");
                }

                $(".titBox").hide();
                $(".li2").hide();
                $(".doll").hide();
            },
            StartProgress: function () {
                if (type == 2) {
                    self.frames[0].isShowText(0);
                }
                $(".playing").show();
                $(".li5").show();
                $(".li4").attr("title", "录音中...");
            },
            EndProgress: function () {
                if (type == 2) {
                    self.frames[0].isShowText(1);
                }
                $(".playing").hide();
                $(".li2").show();
                $(".li4").attr("title", "录音暂停");
            },
            IsClickMicro: true
        });
    } 
}

//隐藏完成录音按钮
function HideFinishBtn() {
    $(".li5").hide();
    ChangeTitle(1);
}

function ChangeTitle(type) {
    if (type == 1) {
        $(".li4").attr("title", "点击开始");
    } else {
        $(".li4").attr("title", "录音暂停");
    }
}

function ShowYWResult() {
    var title = $(".li4").attr("title");
    if (title == "点击开始") {
        $(".doll").show();
    }
}

//暂停状态
function PauseState() {
    $(".li4").attr("title", "录音暂停");
    $(".li5").show();
    $(".doll").hide();
}
//开始状态
function StartState() {
    $(".li4").attr("title", "点击开始");
    $(".li5").hide();
}
//全屏显示
function FullScreen(imgUrl) {
    urldialog = art.dialog({
        id: 'answerUrl',
        opacity: 0.7,
        background: '#000',
        padding: '0',
        lock: true,

        content: '<img id="clockBtn" style="align:center;" src="' + imgUrl + '" />'   //width:800px;height:600px;
    });
    $("#clockBtn").bind("click", function () { urldialog.close(); urldialog = null; });
}
