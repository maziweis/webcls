/// <reference path="../Common.js" />
/// <reference path="../Client.js" />
/// <reference path="../../App_Themes/js/artDialog/artDialog.js" />
//学生做作业页面js

var AccessType = parseInt(Common.QueryString.GetValue("AccessType"));
var StuTaskID;
var QuestionID;
var PageIndex = 1;
var TaskState = 0;
var TaskQuestionList = [];
var QIndex = -1;
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
        $.post(Constant.SunnyTask + "API/Question/GetPreviewQuestions", { QuestionID: QuestionID }, function (result) {
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
                result = eval("(" + result + ")");//JSON.parse
                if (result.Success) {
                    $.each(result.Data, function (index, value) {
                        if (value.IsDo == 0 && QIndex < 0) {
                            QIndex = index;
                        }
                        var tmpurl = value.QuestionModel + ".aspx?AccessType=" + AccessType + "&StuTaskID=" + value.StuTaskID + "&IsDo=" + value.IsDo
                                + "&QuestionID=" + value.QuestionID + "&Round=" + value.Round + "&QIndex=" + index + "&Sub=" + value.QuestionModel[0] + "&ParentID=" + value.ParentID;
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
                var tempParentID = '';
                result = eval("(" + result + ")");//JSON.parse
                if (result.Success) {
                    $.each(result.Data, function (index, value) {
                        var tmpurl = '';                       
                        if (value.QuestionModel == "S18"&& value.ParentID !=null&&value.ParentID!='') {      
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
    artFul.close();
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
//提交作业
function submitTask() {
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
    if (QIndex > 0) {
        QIndex--;
        loadQuestion(QIndex);
    }
}
//下一题
function nextQuestion() {
    $("#nextA").hide();
    if (QIndex < TaskQuestionList.length - 1) {
        QIndex++;
        loadQuestion(QIndex);
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
function loadQ(qindex) {
    $(".solution,.judgeN").hide();
    $(".titBox").hide();
    $(".titCont").hide();

    if (TaskQuestionList[qindex].QuestionTitle[0] == "*") {
        TaskQuestionList[qindex].QuestionTitle = TaskQuestionList[qindex].QuestionTitle.substring(1);
    }
    var tmpTitle = TaskQuestionList[qindex].QuestionTitle;
    if (tmpTitle.length > 36) {
        tmpTitle = tmpTitle.substring(0, 33) + "...";
    }

    $("#topicTitle").html((qindex + 1) + "/" + TaskQuestionList.length + "、" + tmpTitle).attr("title", tmpTitle);
    $("#iframe1").attr("src", TaskQuestionList[qindex].Url);

    if (TaskQuestionList.length == 1) {
        if (AccessType == 3) {
            $("#submitA").show();
        }
        $("#prevA").hide();
        $("#nextA").hide();
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
            $('.S', document.getElementById('iframe1').contentWindow.document).css("height", iframeHeight + "px");
            $('.box').css({ "position": "absolute", "top": setYH + "px" });
        } else {//上下分屏
            var stemHeight = $('.S .stem', document.getElementById('iframe1').contentWindow.document).height();
            var problemHeight = $('.S .problem', document.getElementById('iframe1').contentWindow.document).height();
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
            $('.S .stem', document.getElementById('iframe1').contentWindow.document).css("height", stemHeight + "px");
            $('.S .problem', document.getElementById('iframe1').contentWindow.document).css("height", problemHeight + "px");
            $('.box').css({ "position": "absolute", "top": setYH + "px" });
        }
    }
}

//错题模式下显示正确答案
//answerHtml格式：<span class="w">(1)book</span><span class="r">(2)book</span><span class="w">(3)book</span>
function ShowAnswer(isRight, answerHtml) {
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

function ShowMathAnswer(answerHtml) {
    $(".judgeN").html(answerHtml);
    $(".li1").hide();
    $(".judgeN").show();
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