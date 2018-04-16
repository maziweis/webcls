<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="M1.aspx.cs" Inherits="SmarterClassroomWeb.PreLesson.PreviewPage.English.M1" %>

<!DOCTYPE HTML>
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
    <link href="../../../App_Theme/css/base.css" rel="stylesheet" />
    <link href="../../../App_Theme/css/task.css" rel="stylesheet" />
    <script src="../../../CommonJs/jquery/jquery-1.11.2.min.js"></script>
    <script src="../../../CommonJs/CommonDB/CommonDB.js"></script>
    <script src="../../../CommonJs/jquery/jquery.json-2.4.js"></script>
<script src="../../../App_Theme/js/jquery.nicescroll.js"></script>
</head>
<body>
    <div class="M M1">
        <h3 id="qContent"></h3>
        <ul>
            <li>
                <img id="qImg" src="" alt="" /></li>
        </ul>
    </div>
    <script type="text/javascript">
        var accessType = 0;
        var questionID = '', parentID = '';
        var stuTaskID = '';
        var requireRound = 0, readRound = 0;//要求跟读次数、已读次数
        var startTime, endTime;
        var stuscore = 0, backurl = '', spendtime = 0;//学生得分，录音返回地址，用时
        var qMp3Url = '', qAnswer = '';//题目音频，题目答案

        var highRecord;//跟读最高得分记录
        var answerList;//跟读大题下的小题答案记录
        var minQueCount = 0;
        var spendTime = 0;//小题用时
        var rightCount = 0;
        $(function () {
            startTime = new Date().getTime();
            accessType = parseInt(Common.QueryString.GetValue("AccessType"));
            stuTaskID = Common.QueryString.GetValue("StuTaskID");
            questionID = Common.QueryString.GetValue("QuestionID");
            parentID = Common.QueryString.GetValue("ParentID");
            requireRound = parseInt(Common.QueryString.GetValue("Round"));
            if (accessType == 3 && (stuTaskID == "undefined" || questionID == "undefined")) {
                alert("未获取到作业哦！");
                window.parent.backList();
            } else if ((accessType <= 2) && questionID == "undefined") {
                alert("未获取到题目哦！");
                window.parent.backList();
            } else if (accessType == 4 && (stuTaskID == "undefined" || questionID == "undefined")) {
                alert("未获取到题目哦！");
                window.parent.backList();
            } else if ((accessType == 5) && questionID == "undefined") {
                alert("未获取到题目哦！");
                window.parent.backList();
            } else {
                obj = { QuestionID: questionID, StuTaskID: stuTaskID == "undefined" ? "" : stuTaskID };
                $.post(Constant.SunnyTask + "TaskApi/Question/GetQuestionInfo", obj, function (result) {
                    if (result) {
                        if (result.Success) {
                            var question = result.Data[0];
                            answerList = result.AnswerList;
                            var qAnswerList = [], qMp3List = [];
                            $("#qContent").html(question.QuestionContent.replace(/\\n/g, "<br/>").replace(/\/n/g, "<br/>").replace("[", "<u>").replace("]", "</u>"));
                            $("#qImg").attr("src", question.ImgUrl);
                            resizeWindow();
                            qMp3Url = question.Mp3Url;
                            qAnswer = question.BlankAnswer[0].Answer;
                            window.parent.InitRecord(qMp3Url, qAnswer, true);
                            parentID = question.ParentID;
                            minQueCount = question.MinQueCount;
                            readRound = 0;
                            //学生已达到跟读次数，有答案记录
                            if (question.StuAnswer && question.StuAnswer.QuestionID!=null) {
                                readRound = requireRound;
                                stuscore = question.StuAnswer.StuScore;
                                backurl = question.StuAnswer.Answer;
                                window.parent.ShowResult(stuscore, readRound, requireRound, backurl);
                                highRecord = question.StuAnswer;
                                spendTime = question.StuAnswer.SpendTime;
                            } else if (question.ReadRecordList && question.ReadRecordList.length>0) {
                                readRound = question.ReadRecordList.length;
                                stuscore = question.ReadRecordList[readRound - 1].StuScore;
                                backurl = question.ReadRecordList[readRound - 1].StuAnswer;
                                spendTime = question.ReadRecordList[readRound - 1].SpendTime;
                                window.parent.ShowResult(stuscore, readRound, requireRound, backurl);
                                //获取得分最高的记录
                                var tempScore=0;
                                for (var i = 0; i < question.ReadRecordList.length; i++)
                                {
                                    if (tempScore < question.ReadRecordList[i].StuScore)
                                    {
                                        tempScore = question.ReadRecordList[i].StuScore;
                                        highRecord = question.ReadRecordList[i];
                                    }
                                }                                
                            }
                        } else {
                            alert(result.Message);
                            window.parent.backList();
                        }
                    } else {
                        alert("未获取到作业哦！");
                        window.parent.backList();
                    }
                });
            }
        });
        function resizeWindow() {
            window.parent.autoSetPosition(0, 0);
            $('.M').niceScroll({ touchbehavior: false, autohidemode: false, cursorcolor: "#dcdcdc", cursoropacitymax: 1, cursorwidth: 8 });
        }

        function EndRecord(data) {
            readRound++;
            //stuscore = parseInt(data.lines[0].score);
            stuscore = parseInt(Math.sqrt(data.lines[0].score) * 10);
            window.parent.ShowScore(stuscore, readRound, requireRound);
            window.parent.Mp3Obj.NextRecord(true);
            backurl = window.parent.KSRecord.GetReplayPath();
            endTime = new Date().getTime();
            spendtime = (endTime - startTime) / 1000;
            spendTime += spendtime;
            startTime = endTime;//重新计时
            if (accessType != 3) {
                $.post("?action=UploadAudioFile&Rand=" + Math.random(), { BackUrl: backurl }, function (result) {
                    if (result) {
                        result = eval("(" + result + ")");//JSON.parse
                        if (result.Success) {
                            backurl = result.Data;
                            window.parent.ShowBackPlayer(backurl);
                            if (accessType == 4) {//作业报告——错题重做
                                $.post("?action=SaveStuWrongQue&Rand=" + Math.random(), {
                                    StuTaskID: stuTaskID,
                                    QuestionID: questionID, IsRight: stuscore >= 60 ? 1 : 0
                                }, function (result) {
                                    if (result) {
                                        result = eval("(" + result + ")");//JSON.parse
                                        if (result.Success) {
                                            //window.parent.InitRecord(qMp3Url, qAnswer, false);
                                        } else {
                                            alert(result.Message);
                                        }
                                    }
                                    else {
                                        alert(result.Message);
                                    }
                                });
                            }
                        } else {
                            readRound--;
                            alert(result.Message);
                        }
                    } else {
                        readRound--;
                        alert("保存失败，请重试!");
                    }
                });
            }
            //做作业时保存跟读记录
            else {
                var obj = {};
                var parentScore = 0;
                var heighScore = 0;
                rightCount = 0;
                if (highRecord != null && highRecord != undefined) {
                    heighScore = highRecord.StuScore;
                }
                if (answerList != null) {
                    for (var i = 0; i < answerList.length; i++) {
                        if (answerList[i].IsRight == 1)
                        {
                            rightCount = rightCount+1;
                        }
                        if (answerList[i].QuestionID != questionID) {
                            parentScore += answerList[i].StuScore;
                        }
                    }
                }
                //已有答案，对比答案表中记录
                if (readRound > requireRound) {
                    //本次得分高于答案记录
                    if (stuscore > heighScore) {
                        obj = {
                            QuestionID: questionID, ParentID: parentID, StuTaskID: stuTaskID,
                            StuScore: stuscore, SpendTime: spendTime, BackUrl: backurl,
                            ParentScore: (parentScore + stuscore) / minQueCount, parentAddTime: spendtime,
                            ParentIsRight: (rightCount + (stuscore < 60 ? 0 : 1)) == minQueCount ? 1 : 0
                        };
                    }
                    else {
                        obj = {
                            QuestionID: questionID, ParentID: parentID, StuTaskID: stuTaskID,
                            StuScore: heighScore, SpendTime: spendTime, Answer: highRecord.Answer, BackUrl: highRecord.Remark,
                            ParentScore: (parentScore + heighScore) / minQueCount, parentAddTime: spendtime, newBackUrl: backurl,
                            ParentIsRight: (rightCount + (heighScore < 60 ? 0 : 1)) == minQueCount ? 1 : 0
                        };
                    }
                    
                    $.post("?action=UpdateStuAnswer&Rand=" + Math.random(), obj, function (result) {
                        if (result) {
                            result = eval("(" + result + ")");//JSON.parse
                            if (result.Success) {
                                if (result.Message == "") {
                                    highRecord = result.Data.Answer;
                                    backurl = result.Data.NewBackUrl;
                                } else {
                                    backurl = result.Data;
                                    readRound--;
                                    alert(result.Message);
                                }
                                window.parent.ShowBackPlayer(backurl);
                            } else {
                                readRound--;
                                alert(result.Message);
                            }
                        } else {
                            readRound--;
                            alert("保存失败，请重试!");
                        }
                    });
                }
                //刚好达到跟读次数，对比跟读记录，取最高分
                else if (readRound == requireRound) {
                    if (stuscore >= heighScore) {
                        obj = {
                            StuScore: stuscore, SpendTime: spendTime, BackUrl: backurl, StuTaskID: stuTaskID,
                            QuestionID: questionID, ParentID: parentID,
                            ParentScore: (parentScore + stuscore) / minQueCount, ParentIsRight: (rightCount + (stuscore < 60 ? 0 : 1)) == minQueCount ? 1 : 0
                        };
                    } else {
                        obj = {
                            StuScore: heighScore, SpendTime: spendTime, BackUrl: highRecord.BackUrl, StuTaskID: stuTaskID,
                            QuestionID: questionID, ParentID: parentID, Answer: highRecord.StuAnswer,
                            ParentScore: (parentScore + heighScore) / minQueCount, NewBackUrl: backurl, ParentIsRight: (rightCount + (heighScore < 60 ? 0 : 1)) == minQueCount ? 1 : 0
                        };
                    }
                    
                    $.post("?action=AddStuAnswer&Rand=" + Math.random(), obj, function (result) {
                        if (result) {
                            result = eval("(" + result + ")");//JSON.parse
                            if (result.Success) {                               
                                if (result.Message == "") {
                                    backurl = result.Data.NewBackUrl;
                                    highRecord = result.Data.Answer;
                                } else {
                                    backurl = result.Data;
                                    readRound--;
                                    alert(result.Message);
                                }
                                window.parent.ShowBackPlayer(backurl);
                            } else {
                                readRound--;
                                alert(result.Message);
                            }
                        } else {
                            readRound--;
                            alert("保存失败，请重试!");
                        }
                    });
                }
                //未达到跟读次数，保存记录表
                else {                   
                    obj = {
                        StuScore: stuscore, SpendTime: spendTime, BackUrl: backurl, StuTaskID: stuTaskID,
                            QuestionID: questionID, ParentID: parentID, Round: readRound
                        };
                    $.post("?action=InsertReadRecord&Rand=" + Math.random(), obj, function (result) {
                        if (result) {
                            result = eval("(" + result + ")");//JSON.parse
                            if (result.Success) {
                                backurl = result.Data.StuAnswer;
                                if (result.Data.StuScore >= heighScore) {
                                    highRecord = result.Data;
                                }
                                window.parent.ShowBackPlayer(backurl);
                            } else {
                                readRound--;
                                alert(result.Message);
                            }
                        } else {
                            readRound--;
                            alert("保存失败，请重试!");
                        }
                    });
                }
            }
        }

    </script>
</body>
</html>
