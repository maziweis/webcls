<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="M2.aspx.cs" Inherits="SmarterClassroomWeb.PreLesson.PreviewPage.English.M2" %>

<!DOCTYPE html>

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
    <!--M2——T002-->
    <div class="M M2">
        <ul id="qContent">
        </ul>
    </div>
    <script type="text/javascript">
        var accessType = 0;
        var questionID = '';
        var stuTaskID = '';
        var focusIndex = -1, qLength = 0;//当前是第几小题、共多少小题
        var readRecordList = [];//保存每句的跟读分数、地址及用时
        var requireRound = 0, readRound = 0;//要求跟读次数、已读次数
        var startTime, endTime;
        var stuscore = 0, backurl = '', allbackurl = '', spendtime = 0;//学生得分，录音返回地址，拼接起来的录音地址，用时
        var qAnswerList = '', qMp3List = '';
        var strAlphbet = "abcdefghijklmnopqrstuvwxyz";

        var recordList = [];//记录跟读
        var spendTime = 0;
        var highScore = 0;//记录最高分
        $(function () {
            startTime = new Date().getTime();
            accessType = parseInt(Common.QueryString.GetValue("AccessType"));
            stuTaskID = Common.QueryString.GetValue("StuTaskID");
            questionID = Common.QueryString.GetValue("QuestionID");
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
            } else {
                obj = { QuestionID: questionID, StuTaskID: stuTaskID == "undefined" ? "" : stuTaskID };
                $.post(Constant.SunnyTask + "TaskApi/Question/GetQuestionInfo", obj, function (result) {
                    if (result) {
                        if (result.Success) {
                            Common.CheckIndexOf();
                            var ulHtml = '';
                            //requireRound = result.Data[0].Round;
                            readRound = 0;
                            qLength = result.Data.length - 1;
                            var highRound = 0;//记录最高得分的round
                            $.each(result.Data, function (index, value) {
                                if (index == 0) {
                                    //已达到规定次数
                                    if (value.StuAnswer) {
                                        readRound = requireRound;
                                        stuscore = value.StuAnswer.StuScore;
                                        recordList.push({
                                            StuAnswerID: value.StuAnswer.StuAnswerID, QuestionID: value.StuAnswer.QuestionID,
                                            StuScore: value.StuAnswer.StuScore, BackUrl: '',
                                            StuAnswer: '', SpendTime: value.StuAnswer.SpendTime,isParent:1
                                        });
                                        spendTime = value.StuAnswer.SpendTime;
                                        highScore = value.StuAnswer.StuScore;
                                    } else if (value.ReadRecordList && value.ReadRecordList.length>0) {//未达到跟读次数，但有记录
                                        readRound = value.ReadRecordList.length;
                                        stuscore = value.ReadRecordList[readRound - 1].StuScore;
                                        spendTime = value.ReadRecordList[readRound - 1].SpendTime;
                                        //获取最高跟读记录
                                        var tempscore = 0;
                                        for (var i = 0; i < readRound; i++)
                                        {
                                            if (tempscore < value.ReadRecordList[i].StuScore) {
                                                recordList.push({
                                                    QuestionID: value.ReadRecordList[i].QuestionID, StuScore: value.ReadRecordList[i].StuScore,
                                                    BackUrl: '', StuAnswer: '', SpendTime: value.ReadRecordList[i].SpendTime, isParent: 1
                                                });
                                                tempscore = value.ReadRecordList[i].StuScore;
                                                highRound = value.ReadRecordList[i].Round;
                                            }                                          
                                        }
                                        highScore = tempscore;
                                    }
                                } else {
                                    var minReadRecord = [];
                                    var hasName = 1;//0-无人名；1-有冒号:的人名；2-有中括号【】的人名
                                    var qContent = value.QuestionContent.replace(/\\n/g, "<br/>").replace(/\/n/g, "<br/>").replace("[", "<u>").replace("]", "</u>");
                                    var qName;
                                    if (qContent.indexOf(":") > 0) {
                                        qName = qContent.split(":")[0].split(" ");
                                        for (var j = 0; j < qName.length; j++) {
                                            //判断人名：第一个冒号前的所有单词的首字母是否大写
                                            if (strAlphbet.indexOf(qName[j].charAt(0)) >= 0) {
                                                hasName = 0;
                                                break;
                                            }
                                        }
                                    } else if (qContent.indexOf("】") > 0) {
                                        hasName = 2;
                                    }else {
                                        hasName = 0;
                                    }
                                    if (hasName == 1) {
                                        ulHtml += '<li><p qid="' + value.QuestionID + '"><b>【' + qContent.split(":")[0] + '】</b>' + qContent.substring(qContent.split(":")[0].length + 1);
                                    } else if (hasName == 2) {
                                        ulHtml += '<li><p qid="' + value.QuestionID + '"><b>' + qContent.split("】")[0] + '】</b>' + qContent.substring(qContent.split("】")[0].length + 1);
                                    } else {
                                        ulHtml += '<li><p qid="' + value.QuestionID + '">' + qContent;
                                    }
                                    if (value.StuAnswer) {
                                        ulHtml += '<em class="s">' + value.StuAnswer.StuScore + '</em>';
                                        allbackurl += ';' + value.StuAnswer.Answer;
                                        recordList.push({
                                            StuAnswerID: value.StuAnswer.StuAnswerID, QuestionID: value.StuAnswer.QuestionID,
                                            StuScore: value.StuAnswer.StuScore,
                                            BackUrl: value.StuAnswer.Remark, StuAnswer: value.StuAnswer.Answer,
                                            SpendTime: value.StuAnswer.SpendTime, isParent: 0
                                        });
                                    } else if (value.ReadRecordList && value.ReadRecordList.length > 0) {
                                        ulHtml += '<em class="s">' + value.ReadRecordList[readRound - 1].StuScore + '</em>';
                                        allbackurl += ';' + value.ReadRecordList[readRound - 1].StuAnswer;
                                        for (var i = 0; i < readRound; i++) {
                                            if (value.ReadRecordList[i].Round==highRound) {
                                                recordList.push({
                                                    QuestionID: value.ReadRecordList[i].QuestionID, StuScore: value.ReadRecordList[i].StuScore,
                                                    BackUrl: value.ReadRecordList[i].BackUrl, StuAnswer: value.ReadRecordList[i].StuAnswer,
                                                    SpendTime: value.ReadRecordList[i].SpendTime, isParent: 0
                                                });
                                            }
                                        }
                                    }
                                    ulHtml += '</p></li>';
                                    qAnswerList += ';' + value.BlankAnswer[0].Answer.replace(";", " ");
                                    qMp3List += ';' + value.Mp3Url.replace(";", " ");
                                }
                            });
                            $("#qContent").append(ulHtml);
                            resizeWindow();
                            if (qMp3List.length > 0) {
                                qMp3List = qMp3List.substring(1);
                            }
                            if (qAnswerList.length > 0) {
                                qAnswerList = qAnswerList.substring(1);
                            }
                            if (allbackurl.length > 0) {
                                allbackurl = allbackurl.substring(1);
                            }
                            window.parent.InitRecord(qMp3List, qAnswerList, true);
                            if (allbackurl.length > 0) {
                                window.parent.ShowResult(stuscore, readRound, requireRound, allbackurl);
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
            $('.M').niceScroll({ touchbehavior: false, autohidemode: false, cursorcolor: "#dcdcdc", cursoropacitymax: 1, cursorwidth: 10 });
        }
        //返回分数，处理并显示
        function EndRecord(data) {
            //stuscore = parseInt(data.lines[0].score);
            stuscore = parseInt(Math.sqrt(data.lines[0].score) * 10);
            backurl = window.parent.KSRecord.GetReplayPath();

            if (focusIndex == -1) {
                allbackurl = backurl;
            } else {
                allbackurl += ";" + backurl;
            }
            endTime = new Date().getTime();
            spendtime = (endTime - startTime) / 1000;
            startTime = endTime;//重新计时
            focusIndex++;
            if ($("#qContent li:eq(" + focusIndex + ") p .s")) {
                $("#qContent li:eq(" + focusIndex + ") p .s").remove();
            }
            $("#qContent li:eq(" + focusIndex + ") p").append('<em class="s">' + stuscore + '</em>');

            showOn();
            window.parent.Mp3Obj.NextRecord(true);

            if (focusIndex > readRecordList.length - 1) {
                readRecordList.push({
                    QuestionID: $("#qContent li:eq(" + focusIndex + ") p").attr("qid"),
                    StuScore: stuscore, BackUrl: backurl, SpendTime: spendtime
                });
                //$("#qContent li:eq(" + focusIndex + ") p").append('<em class="s">' + stuscore + '</em>');
            } else {
                readRecordList[focusIndex] = {
                    QuestionID: $("#qContent li:eq(" + focusIndex + ") p").attr("qid"),
                    StuScore: stuscore, BackUrl: backurl, SpendTime: spendtime
                };
                //$("#qContent li:eq(" + focusIndex + ") p").append('<em class="s">' + stuscore + '</em>');
            }

            //读完完整的一遍后
            if (focusIndex >= qLength - 1) {
                focusIndex = -1;
                readRound++;
                //获取大题分数及用时
                stuscore = 0;
                spendtime = 0;
                var newBackUrl = '';//录音路径集合
                for (var i = 0; i < readRecordList.length; i++) {
                    stuscore += readRecordList[i].StuScore;
                    spendtime += readRecordList[i].SpendTime;
                    newBackUrl += ";"+readRecordList[i].BackUrl;
                }
                stuscore = parseInt(Math.floor(stuscore / qLength));
                if (newBackUrl != "")
                {
                    newBackUrl = newBackUrl.substring(1);
                }
                window.parent.ShowScore(stuscore, readRound, requireRound);

                if (accessType != 3) {//预览模式下，仅显示记录，不保存
                    $.post("?action=UploadAudioFile&Rand=" + Math.random(), { BackUrl: allbackurl }, function (result) {
                        if (result) {
                            result = eval("(" + result + ")");//JSON.parse
                            if (result.Success) {
                                window.parent.ShowBackPlayer(result.Data);
                            }
                        }
                    });
                    if (accessType == 4) {
                        $.post("?action=SaveStuWrongQue&Rand=" + Math.random(), {
                            StuTaskID: stuTaskID,
                            QuestionID: questionID, IsRight: stuscore >= 60 ? 1 : 0
                        }, function (result) {
                            if (result) {
                                result = eval("(" + result + ")");//JSON.parse
                                if (result.Success) {
                                    window.parent.InitRecord(qMp3List, qAnswerList, false);
                                } else {
                                    alert(result.Message);
                                }
                            }
                            else {
                                alert(result.Message);
                            }
                        });
                    }
                } else {//做作业模式下，保存跟读记录
                    var obj = {};
                    spendTime += spendtime;
                    //未达到跟读次数
                    if (readRound < requireRound)
                    {
                        var jsonData = {
                            StuTaskID: stuTaskID, ParentID: questionID, StuScore: stuscore,
                            SpendTime: spendTime, ReadRecordList: readRecordList, Round: readRound
                        };
                        obj = { FormData: $.toJSON(jsonData) };
                       $.post("?action=InsertReadRecord&Rand=" + Math.random(), obj, function (result) {
                           if (result) {
                               result = eval("(" + result + ")");//JSON.parse
                               if (result.Success) {
                                   if (stuscore>=highScore) {
                                       var backUrlList = result.Data.split(';');
                                       highScore = stuscore;
                                       recordList = [];
                                       recordList.push({
                                           QuestionID: questionID, StuScore: stuscore, BackUrl: '', StuAnswer: '', SpendTime: spendTime, isParent: 1
                                       });
                                       for (var i = 0; i < readRecordList.length; i++) {
                                           recordList.push({
                                               QuestionID: readRecordList[i].QuestionID, StuScore: readRecordList[i].StuScore,
                                               BackUrl: readRecordList[i].BackUrl, StuAnswer: backUrlList[i],
                                               SpendTime: readRecordList[i].SpendTime, isParent: 0
                                           });
                                       }
                                   }
                                   window.parent.ShowBackPlayer(result.Data);
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
                    //刚达到跟读次数
                    else if (readRound == requireRound) {
                        var jsonData = {};
                        if (stuscore >= highScore) {
                            jsonData = {
                                StuTaskID: stuTaskID, ParentID: questionID, StuScore: stuscore,
                                SpendTime: spendTime, ReadRecordList: readRecordList
                            };
                        } else {
                            var minRecordList = [];
                            var score = 0;
                            for (var i = 0; i < recordList.length; i++) {
                                if (recordList[i].isParent != null && recordList[i].isParent == 1) {
                                    score = recordList[i].StuScore;
                                } else {
                                    minRecordList.push(recordList[i]);
                                }
                            }
                            jsonData = {
                                StuTaskID: stuTaskID, ParentID: questionID, StuScore: score,
                                SpendTime: spendTime, ReadRecordList: minRecordList
                            };
                        }                      
                        obj = { FormData: $.toJSON(jsonData), NewBackUrl: newBackUrl };
                        $.post("?action=AddStuAnswer&Rand=" + Math.random(), obj, function (result) {
                            if (result) {
                                result = eval("(" + result + ")");//JSON.parse
                                if (result.Success) {
                                    var url = '';
                                    if (result.Message == "") {
                                        url = result.Data.NewBackUrl;
                                        recordList = [];
                                        $.each(result.Data.AnswerList, function (index, value) {
                                            if (index == 0) {
                                                highScore = value.StuScore;
                                                recordList.push({
                                                    StuAnswerID: value.StuAnswerID, QuestionID: value.QuestionID,
                                                    StuScore: value.StuScore, BackUrl: value.Remark,
                                                    StuAnswer: value.Answer, SpendTime: value.SpendTime, isParent: 1
                                                });
                                            } else {
                                                recordList.push({
                                                    StuAnswerID: value.StuAnswerID, QuestionID: value.QuestionID,
                                                    StuScore: value.StuScore, BackUrl: value.Remark,
                                                    StuAnswer: value.Answer, SpendTime: value.SpendTime, isParent: 0
                                                });
                                            }
                                        });                                       
                                    } else {
                                        url = result.Data;
                                    }
                                    window.parent.ShowBackPlayer(url);
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
                    //已有答案记录，更新答案
                    else {
                        if (stuscore >= highScore) {
                            var stuAnswerID = '';
                            var minStuAnswerList = [];
                            for (var i = 0; i < recordList.length; i++) {
                                if (i == 0) {
                                    stuAnswerID = recordList[i].StuAnswerID;
                                } else {
                                    for (var j = 0; j < readRecordList.length; j++) {
                                        if (recordList[i].QuestionID == readRecordList[j].QuestionID) {
                                            minStuAnswerList.push({
                                                StuTaskID: recordList[i].StuAnswerID, BackUrl: readRecordList[j].BackUrl,
                                                StuScore: readRecordList[j].StuScore, SpendTime: readRecordList[j].SpendTime, QuestionID: readRecordList[j].QuestionID
                                            });
                                            break;
                                        }
                                    }
                                }
                            }
                            jsonData = {
                                StuTaskID: stuAnswerID, StuScore: stuscore, ParentID: questionID,
                                SpendTime: spendTime, ReadRecordList: minStuAnswerList
                            };

                            obj = { FormData: $.toJSON(jsonData), NewBackUrl: newBackUrl, StuTaskID: stuTaskID };
                            $.post("?action=UpdateStuAnswer&Rand=" + Math.random(), obj, function (result) {
                                if (result) {
                                    result = eval("(" + result + ")");//JSON.parse
                                    if (result.Success) {
                                        var url = '';
                                        if (result.Message == "") {
                                            url = result.Data.NewBackUrl;
                                            recordList = [];
                                            $.each(result.Data, function (index, value) {
                                                if (index == 0) {
                                                    highScore = value.StuScore;
                                                    recordList.push({
                                                        StuAnswerID: value.StuAnswerID, QuestionID: value.QuestionID,
                                                        StuScore: value.StuScore, BackUrl: value.Remark,
                                                        StuAnswer: value.Answer, SpendTime: value.SpendTime, isParent: 1
                                                    });
                                                } else {
                                                    recordList.push({
                                                        StuAnswerID: value.StuAnswerID, QuestionID: value.QuestionID,
                                                        StuScore: value.StuScore, BackUrl: value.Remark,
                                                        StuAnswer: value.Answer, SpendTime: value.SpendTime, isParent: 0
                                                    });
                                                }

                                            });
                                        } else {
                                            url = result.Data;
                                        }
                                        window.parent.ShowBackPlayer(url);
                                    } else {
                                        alert(result.Message);
                                    }
                                } else {
                                    alert("保存失败，请重试!");
                                }
                            });
                        }
                        else {
                            $.post("?action=UploadUrl&Rand=" + Math.random(), { ReadUrl: newBackUrl }, function (result) {
                                if (result) {
                                    result = eval("(" + result + ")");//JSON.parse
                                    if (result.Success) {
                                        window.parent.ShowBackPlayer(result.Data);
                                    }
                                }
                            });
                        }
                    }
                }
            }
        }
        //隐藏每句分数
        function hideScore() {
            if (arguments[0]) {
                focusIndex = arguments[0] - 1;
            }
            if (focusIndex == -1) {
                $("#qContent li p .s").remove();
            } else {
                $("#qContent li p:gt(" + focusIndex + ") .s").remove();
            }
        }

        function showOn() {
            $("#qContent li").removeClass("on");
            $("#qContent li:eq(" + (focusIndex + 1) + ")").addClass("on");
            if (focusIndex >= 4 && focusIndex < qLength - 1) {
                var v = $("#qContent li.on").offset().top + $("#qContent li.on").height() + 20 - parseInt(window.parent.autoScrollHeight);
                $('.M').animate({ scrollTop: v }, 'slow');
            }
        }

    </script>
</body>
</html>
