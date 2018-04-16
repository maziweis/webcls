<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Y18.aspx.cs" Inherits="SmarterClassroomWeb.PreLesson.PreviewPage.Chinese.Y18" %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title></title>
    <link href="../../../App_Theme/css/base1.css" rel="stylesheet" />
    <link href="../../../App_Theme/css/chinese.css" rel="stylesheet" />
    <script src="../../../CommonJs/jquery/jquery-1.11.2.min.js"></script>
    <script src="../../../App_Theme/js/jquery.nicescroll.js"></script>
    <script src="../../../CommonJs/CommonDB/CommonDB.js"></script>
    <script src="../../../CommonJs/jquery/jquery.json-2.4.js"></script>
</head>

<body>
    <div class="Y Y18">
        <div class="stem">
            <div class="stemBox">
            </div>
        </div>
        <div class="problem">
            <div class="problemBox">
            </div>
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

        var hasContent = true;//是否有短文内容
        var minQuestionID = '';
        var minIsRight = '';
        var isSplit = 0;//默认不可拆分

        var QueSum = 0;//题目(大小题)总数
        var QueAndScore = new Array();//题目与分数

        $(function () {
            //禁用音频
            window.parent.HidePlay();

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
            obj = { QuestionID: QuestionID, StuTaskID: StuTaskID == "undefined" ? "" : StuTaskID, AccessType: AccessType };

            $.post(Constant.SunnyTask + "TaskApi/Question/GetQuestionInfo", obj, function (data) {
                if (data.Success) {
                    QueSum = data.Data.length - 1;

                    //题目Html
                    var questionHtml = "";
                    for (var i = 0; i < data.Data.length; i++) {
                        //获取题干音频
                        if (data.Data[i].ParentID == "") {
                            ParentID = data.Data[i].QuestionID;
                            if (data.Data[i].QuestionContent) {
                                hasContent = true;
                                $(".stemBox").html('<div class="titBox">' + data.Data[i].QuestionContent + '</div>');
                            } else {
                                hasContent = false;
                            }
                            isSplit = data.Data[i].IsSplit;
                        }
                            //获取小题的内容
                        else {
                            questionHtml += '<h3>';
                            questionHtml += '<em class="num">（' + data.Data[i].Sort + '）</em>';
                            questionHtml += '<span class="sp">' + data.Data[i].QuestionContent + '</span></h3>';
                            questionHtml += '<table id="' + data.Data[i].QuestionID + '"><tr>';
                            $.each(data.Data[i].SelectList, function (index, value) {
                                var isDo = false;
                                //若是学生做题，判断题目是否已做
                                if (AccessType == 3 && data.Data[i].StuAnswer != null) {
                                    isDo = true;
                                }
                                if (isDo) {
                                    //学生答题选项class=on
                                    if (data.Data[i].StuAnswer.Answer == value.Sort) {
                                        questionHtml += '<td><a href="javascript:void(1)" class="on" onclick="liClick(this)" id="' + data.Data[i].QuestionID + '_' + value.Sort + '_'+data.Data[i].Sort+'"><em class="em">'
                                            + (String.fromCharCode(64 + value.Sort)) + '</em><span>' + value.SelectItem + '</span></a></td>';
                                    }
                                    else {
                                        questionHtml += '<td><a href="javascript:void(1)" onclick="liClick(this)" id="' + data.Data[i].QuestionID + '_' + value.Sort + '_' + data.Data[i].Sort + '"><em class="em">'
                                            + (String.fromCharCode(64 + value.Sort)) + '</em><span>' + value.SelectItem + '</span></a></td>';
                                    }
                                }
                                else {
                                    questionHtml += '<td><a href="javascript:void(1)" onclick="liClick(this)" id="' + data.Data[i].QuestionID + '_' + value.Sort + '_' + data.Data[i].Sort + '"><em class="em">'
                                        + (String.fromCharCode(64 + value.Sort)) + '</em><span>' + value.SelectItem + '</span></a></td>';
                                }
                                if (value.Sort % 2 == 0) {
                                    questionHtml += '</tr><tr>';
                                }

                                //获取题目标准答案
                                if (value.IsAnswer) {
                                    //if (AccessType < 4) {
                                        modelAnswer[i - 1] = data.Data[i].QuestionID + '_' + value.Sort;
                                    //} else {
                                    //    modelAnswer[i] = data.Data[i].QuestionID + '_' + value.Sort;
                                    //}
                                    //modelAnswer[data.Data[i].Sort - 1] = data.Data[i].QuestionID + '_' + value.Sort;
                                }
                            });
                            questionHtml += '</tr></table>';
                            minQNum += 1;

                            //将题目ID与分数存入 QueAndScore中
                            QueAndScore.push({ QuestionID: data.Data[i].QuestionID, Score: (data.Data[i].StuAnswer != null ? data.Data[i].StuAnswer.StuScore : 0) });
                        }
                    }
                    $(".problemBox").html(questionHtml);

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
            if (hasContent) {
                window.parent.autoSetPosition(0, 1);
                $('.Y .stem').niceScroll({ touchbehavior: false, autohidemode: false, cursorcolor: "#dcdcdc", cursoropacitymax: 1, cursorwidth: 8 });
                $('.Y .problem').niceScroll({ touchbehavior: false, autohidemode: false, cursorcolor: "#dcdcdc", cursoropacitymax: 1, cursorwidth: 8 });
            } else {
                window.parent.autoSetPosition(0, 0);
                $('.Y').niceScroll({ touchbehavior: false, autohidemode: false, cursorcolor: "#dcdcdc", cursoropacitymax: 1, cursorwidth: 8 });
            }
        }

        ////点击选择项
        function liClick(index) {
            $.each($("#" + (index.id.split('_')[0]) + " a"), function (val) {
                $("#" + (this.id)).removeClass();
            });
            $(index).addClass("on");

            //若是学生做错题
            if (AccessType == 4 || AccessType == 5) {
                //检查是否全部选择
                var num = 0;
                $.each($(".problem table tr td a"), function (val) {
                    if ($("#" + (this.id)).hasClass("on")) {
                        num += 1;
                        var i = $(".problem table").sort;
                        stuAnswer[this.id.split('_')[0]] = this.id.split('_')[1];
                    }
                });

                //若全部已选，出答案，选项不可再点击
                if (num == minQNum) {
                    $.each($(".problem table tr td a"), function (val) {
                        document.getElementById(this.id).onclick = function () { };
                    });

                    //验证答案
                    var isRight = 1;
                    var resultHtml = "";
                    $.each($(".problem table tr td a"), function (val) {                       
                        if ($("#" + (this.id)).hasClass("on")) {
                            var q = this.id.split('_')[0];
                            for (var j = 0; j < modelAnswer.length; j++)
                            {                                
                                if (modelAnswer[j].split('_')[0] == q)
                                {
                                    minQuestionID += "," + q;
                                    if (this.id.split('_')[1] == modelAnswer[j].split('_')[1]) {
                                        resultHtml += "<span class='r'>（" + (this.id.split('_')[2]) + "）"
                                            + String.fromCharCode(64 + parseInt(modelAnswer[j].split('_')[1])) + "</span>";
                                        minIsRight += ',' + 1;
                                    }
                                    else {
                                        isRight = 0;
                                        resultHtml += "<span class='w'>（" + (this.id.split('_')[2]) + "）"
                                            + String.fromCharCode(64 + parseInt(modelAnswer[j].split('_')[1])) + "</span>";
                                        minIsRight += ',' + 0;
                                    }                                    
;                                }
                            }
                        }                        
                    });

                    if (AccessType == 4) {
                        if (isSplit == 0) {
                            //保存答案
                            obj = { StuTaskID: StuTaskID == "undefined" ? "" : StuTaskID, QuestionID: QuestionID, IsRight: isRight, AccessType: AccessType }
                        } else {
                            obj = { StuTaskID: StuTaskID == "undefined" ? "" : StuTaskID, QuestionID: minQuestionID.substring(1), IsRight: minIsRight.substring(1), AccessType: AccessType }
                        }
                        $.post("?action=saveWQue&rand=" + Math.random(), obj, function (data) {
                            if (data) {
                                data = eval("(" + data + ")");
                                if (data.Success) {
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
            //obj = { QuestionID: QueAndAnswer.split('_')[0], StuTaskID: StuTaskID, Answer: QueAndAnswer.split('_')[1], IsRight: isRight, SpendTime: spendTime, ParentID: ParentID }

            //保存数据
            var stuScore = ((isRight == "1" || isRight == 1) ? 100 / QueSum : 0);
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
