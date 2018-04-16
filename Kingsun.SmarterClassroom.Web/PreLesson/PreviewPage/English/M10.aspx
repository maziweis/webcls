<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="M10.aspx.cs" Inherits="SmarterClassroomWeb.PreLesson.PreviewPage.English.M10" %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title></title>
<link href="../../../App_Theme/css/base.css" rel="stylesheet" />
    <link href="../../../App_Theme/css/task.css" rel="stylesheet" />
    <script src="../../../CommonJs/jquery/jquery-1.11.2.min.js"></script>
    <script src="../../../CommonJs/CommonDB/CommonDB.js"></script>
    <script src="../../../CommonJs/jquery/jquery.json-2.4.js"></script>
<script src="../../../App_Theme/js/jquery.nicescroll.js"></script>
</head>

<body>
    <div class="M M10">
    <div class="w">
    </div>
</div>

    <script type="text/javascript">
        //获取页面url
        var QuestionID = "";
        var StuTaskID = "";
        var AccessType = "";

        //记录开始时间
        var startTime = "";
        var obj = "";
        var minQNum = 0;
        //记录题目标准答案
        var modelAnswer = new Array();
        var stuAnswer = new Array();

        //记录题目大题ID
        var ParentID = "";

        var QueSum = 0;//题目(大小题)总数
        var QueAndScore = new Array();//题目与分数

        $(function () {
            //获取页面url
            QuestionID = Common.QueryString.GetValue("QuestionID");
            StuTaskID = Common.QueryString.GetValue("StuTaskID");
            //1：教师预览；2：学生做题；3：错题重做
            AccessType = Common.QueryString.GetValue("AccessType");

            //设置参数  
            if (AccessType == 1 || AccessType == 2) {
                if (QuestionID == "undefined") {
                    alert("未获取到相应参数，不能获取题目内容！");
                    window.parent.backList();
                }
            }
            else if (AccessType == 3) {
                if (QuestionID == "undefined" || StuTaskID == "undefined") {
                    alert("未获取到相应参数，不能获取作业题目信息！");
                    window.parent.backList();
                }
            }
            else if (AccessType == 4) {
                if (QuestionID == "undefined" || StuTaskID == "undefined") {
                    alert("未获取到相应参数，不能获取题目内容！");
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

            $.post(Constant.SunnyTask + "TaskApi/Question/GetQuestionInfo", obj, function (data) {
                if (data.Success) {
                    QueSum = data.Data.length - 1;
                    //获取小题选项中最长的长度
                    var maxLen = 0;
                    for (var i = 0; i < data.Data.length; i++) {
                        if (data.Data[i].ParentID != "") {
                            $.each(data.Data[i].SelectList, function (index, value) {
                                if (maxLen < value.SelectItem.length) {
                                    maxLen = value.SelectItem.length;
                                }
                            });
                        }
                    }

                    //题目Html
                    var questionHtml = "";
                    for (var i = 0; i < data.Data.length; i++) {
                        //获取题干音频
                        if (data.Data[i].ParentID == "") {
                            ParentID = data.Data[i].QuestionID;
                            //音频
                            window.parent.InitPlay(data.Data[i].Mp3Url);
                        }
                        //获取小题的内容
                        else {
                            if (data.Data[i].QuestionModel.substring(0, 1) == "M") {
                                questionHtml += '<h3><em class="num">(' + data.Data[i].Sort + ')</em>';
                            } else {
                                questionHtml += '<h3><em class="num">（' + data.Data[i].Sort + '）</em>';
                            }
                            questionHtml += '<span class="sp">' + data.Data[i].QuestionContent.replace(/\\n/g, "<br/>").replace(/\/n/g, "<br/>").replace("[", "<u>").replace("]", "</u>") + '</span></h3>';
                            questionHtml += '<table id="' + data.Data[i].QuestionID + '"><tr>';
                            $.each(data.Data[i].SelectList, function (index, value) {
                                var isDo = false;
                                //若是学生做题，判断题目是否已做
                                if (AccessType == 3 && data.Data[i].StuAnswer != null) {
                                    isDo=true;
                                }
                                if (isDo) {
                                    //学生答题选项class=on
                                    if (data.Data[i].StuAnswer.Answer == value.Sort) {
                                        questionHtml += '<td><a href="javascript:void(1)" class="on" onclick="liClick(this)" id="' + data.Data[i].QuestionID + '_' + value.Sort + '">';
                                    }
                                    else {
                                        questionHtml += '<td><a href="javascript:void(1)" onclick="liClick(this)" id="' + data.Data[i].QuestionID + '_' + value.Sort + '">';
                                    }
                                }                               
                                else {
                                    questionHtml += '<td><a href="javascript:void(1)" onclick="liClick(this)" id="' + data.Data[i].QuestionID + '_' + value.Sort + '">';
                                }
                                questionHtml += '<em class="em">' + (String.fromCharCode(64 + value.Sort)) + '</em>';
                                if (maxLen > 27) {
                                    questionHtml += '<span style="width:680px;">';
                                } else {
                                    questionHtml += '<span>';
                                }
                                questionHtml += value.SelectItem.replace(/\\n/g, "<br/>").replace(/\/n/g, "<br/>").replace("[", "<u>").replace("]", "</u>") + '</span></a></td>';


                                if (maxLen > 27) {
                                    questionHtml += '</tr><tr>';
                                } else {
                                    if (value.Sort % 2 == 0) {
                                        questionHtml += '</tr><tr>';
                                    }
                                }

                                //获取题目标准答案
                                if (value.IsAnswer) {
                                    modelAnswer[data.Data[i].Sort - 1] = data.Data[i].QuestionID + "_" + value.Sort;
                                }
                            });
                            questionHtml += '</tr></table>';
                            minQNum += 1;

                            //将题目ID与分数存入 QueAndScore中
                            QueAndScore.push({ QuestionID: data.Data[i].QuestionID, Score: (data.Data[i].StuAnswer != null ? data.Data[i].StuAnswer.StuScore : 0) });

                        }
                    }
                    questionHtml += '</div>';
                    $(".w").html(questionHtml);

                    //每个小题需要调用一次父页面的自动布局
                    resizeWindow();

                    if (AccessType == 3) {
                        startTime = new Date();
                    }

                } else {
                    alert(data.Message);
                }
            });

        });

        function resizeWindow() {
            window.parent.autoSetPosition(0, 0);
            $('.M').niceScroll({ touchbehavior: false, autohidemode: false, cursorcolor: "#dcdcdc", cursoropacitymax: 1, cursorwidth: 8 });
        }

        ////点击选择项
        function liClick(index) {
            $.each($("#" + (index.id.split('_')[0]) + " a"), function (index) {
                $("#" + (this.id)).removeClass();
            });
            $(index).addClass("on");                  

            //若是学生做错题
            if (AccessType == 4 || AccessType == 5) {
                //检查是否全部选择
                var num = 0;
                $.each($(".w table tr td a"), function (index) {
                    if ($("#" + (this.id)).hasClass("on")) {
                        num += 1;
                        var i = $(".w table").sort;
                        stuAnswer[this.id.split('_')[0]] = this.id.split('_')[1];
                    }
                });

                //若全部已选，出答案，选项不可再点击
                if (num == minQNum) {
                    //去除选项点击事件
                    $.each($(".w table tr td a"), function (index) {
                        document.getElementById(this.id).onclick = function () { };
                    });

                    //验证答案
                    var isRight = 1;
                    var resultHtml = "";
                    var jnum = 0;
                    //获取学生答案并判断对错
                    $.each($(".w table tr td a"), function (i) {
                        if ($("#" + (this.id)).hasClass("on"))
                        {
                            if (this.id.split('_')[1] == modelAnswer[jnum].split('_')[1]) {
                                resultHtml += "<span class='r'>(" + (jnum + 1) + ")"
                                    + String.fromCharCode(64 + parseInt(modelAnswer[jnum].split('_')[1])) + "</span>";
                            }
                            else {
                                isRight = 0;
                                resultHtml += "<span class='w'>(" + (jnum + 1) + ")"
                                    + String.fromCharCode(64 + parseInt(modelAnswer[jnum].split('_')[1])) + "</span>";
                            }
                            jnum++;
                        }
                    });
                    if (AccessType == 4) {
                        obj = { StuTaskID: StuTaskID == "undefined" ? "" : StuTaskID, QuestionID: QuestionID, IsRight: isRight, AccessType: AccessType }
                        $.post("?action=saveWQue&rand=" + Math.random(), obj, function (data) {
                            if (data) {
                                data = eval("(" + data + ")");
                                if (data.Success) {
                                    //if (isRight == 1) {
                                    //    //页面显示 恭喜你，答对了  先用alert提示
                                    //    alert("恭喜你，答对了！");
                                    //} else {
                                    //    alert("正确答案：" + resultHtml);
                                    //}
                                    window.parent.ShowAnswer(isRight, isRight == 1 ? "" : resultHtml);
                                }
                                else {
                                    alert(data.Message);
                                }
                            }
                        });
                    } else {
                        window.parent.ShowAnswer(isRight, isRight == 1 ? "" : resultHtml);
                    }
                }
            }

            //若是学生做题，保存答案
            if (AccessType == 3) {
                //记录答题时间
                var spendTime = new Date() - startTime;
                startTime = new Date();
                SaveAnswer(index.id, spendTime);
            }
        }

        //保存答案
        function SaveAnswer(QueAndAnswer, spendTime) {
            var isRight = 0;
            //验证答案
            $.each(modelAnswer, function (i, value) {
                if (QueAndAnswer.split('_')[0] == value.split('_')[0]) {
                    if (QueAndAnswer.split('_')[1] == value.split('_')[1]) {
                        isRight = 1;
                    }
                }
            });

            //保存数据
            var stuScore = (isRight == "1" ? 100 / QueSum : 0);
            //修改大题分数 并求和 QueAndScore
            var parentQScore = 0;
            var nowRightCount = 0; //答对的总题数
            $.each(QueAndScore, function (n) {
                if (QueAndScore[n].QuestionID == QueAndAnswer.split('_')[0]) {
                    QueAndScore[n].Score = stuScore;
                }
                if (QueAndScore[n].Score != 0 && QueAndScore[n].Score != "0") {
                    nowRightCount++;
                }
                //parentQScore = parentQScore + QueAndScore[n].Score;
            });
            parentQScore = 100 * nowRightCount / QueSum;

            var minQAnswer = {
                StuTaskID: StuTaskID, QuestionID: QueAndAnswer.split('_')[0], ParentID: ParentID,
                Answer: QueAndAnswer.split('_')[1], IsRight: isRight, StuScore: stuScore, SpendTime: spendTime
            };
            var parentQAnswer = {
                StuTaskID: StuTaskID, QuestionID: ParentID,
                IsRight: parentQScore == 100 ? 1 : 0, StuScore: parentQScore, SpendTime: spendTime
            };

            //
            var objQue = { minQAnswer: $.toJSON(minQAnswer), parentQAnswer: $.toJSON(parentQAnswer) };

            //obj = { QuestionID: QueAndAnswer.split('_')[0], StuTaskID: StuTaskID, Answer: QueAndAnswer.split('_')[1],IsRight: isRight,SpendTime: spendTime, ParentID: ParentID }
            $.post("?action=SaveAnswer&rand=" + Math.random(), objQue, function (data) {
                data = eval("(" + data + ")");
                if (data.Success) {
                }
                else {
                    alert(data.Message);
                }
            });
        }

</script>
</body>
</html>
