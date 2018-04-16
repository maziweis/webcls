<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Y7.aspx.cs" Inherits="SmarterClassroomWeb.PreLesson.PreviewPage.Chinese.Y7" %>

<!DOCTYPE html>

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
    <div class="Y Y7">
        <div class="w">
        </div>
    </div>

    <script type="text/javascript">
        //记录开始时间
        var startTime = "";
        //获取页面url
        var QuestionID = "";
        var StuTaskID = "";
        var AccessType = "";
        //判断题目是否已做（教师模板与错题集为false）
        var IsDo = false;
        var obj = "";

        //记录题目标准答案
        var modelAnswer = "";
        //记录题目大题ID
        var ParentID = "";
        var minQueCount = 0;
        var rightCount = 0;
        $(function () {
            //禁用音频
            window.parent.HidePlay();

            //获取页面url
            QuestionID = Common.QueryString.GetValue("QuestionID");
            ParentID = Common.QueryString.GetValue("ParentID");
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
            obj = { QuestionID: QuestionID, StuTaskID: StuTaskID == "undefined" ? "" : StuTaskID, AccessType: AccessType, ParentID: ParentID };

            //获取题目信息
            $.post(Constant.SunnyTask + "TaskApi/Question/GetQuestionInfo", obj, function (data) {
                if (data.Success) {
                    var question = data.Data[0];
                    //rightCount = eval("(" + data.Data + ")").Count;
                    ParentID = question.ParentID;
                    minQueCount = question.MinQueCount;

                    //判断有无学生答案
                    if (AccessType == 3 && question.StuAnswer != null) {
                        IsDo = true;
                    }
                    //音频
                    if (question.Mp3Url != "") {
                        window.parent.InitPlay(question.Mp3Url);
                    }
                    //题目Html
                    var questionHtml = "";
                    questionHtml += '<div class="titBox">';
                    if (question.QuestionContent != "") {
                        questionHtml += '<h3>' + question.QuestionContent + '</h3>';
                    }
                    if (question.ImgUrl != "") {
                        questionHtml += '<img src="' + question.ImgUrl + '" alt="" onclick=“window.parent.FullScreen(\'' + question.ImgUrl + '\')" title="点击图片可放大" />';
                    }
                    questionHtml += '</div><ul class="wOrR">';
                    $.each(question.SelectList, function (index, value) {
                        if (IsDo) {
                            if (value.Sort == question.StuAnswer.Answer) {
                                questionHtml += '<li onclick="Click(this)" class="on" id="' + value.Sort + '"><a class="' + (value.SelectItem == "TRUE" ? "right" : "wrong") + '" href="javascript:void(0)">&nbsp;</a></li>';
                            } else {
                                questionHtml += '<li onclick="Click(this)" id="' + value.Sort + '"><a class="' + (value.SelectItem == "TRUE" ? "right" : "wrong") + '" href="javascript:void(0)">&nbsp;</a></li>';
                            }
                        } else {
                            questionHtml += '<li onclick="Click(this)" id="' + value.Sort + '"><a class="' + (value.SelectItem == "TRUE" ? "right" : "wrong") + '" href="javascript:void(0)">&nbsp;</a></li>';
                        }
                        //获取题目标准答案
                        if (value.IsAnswer) {
                            modelAnswer = value.Sort + "_" + value.SelectItem;
                        }
                    })
                    questionHtml += '</ul>';
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
            $('.Y').niceScroll({ touchbehavior: false, autohidemode: false, cursorcolor: "#dcdcdc", cursoropacitymax: 1, cursorwidth: 8 });
        }

        //选项切换
        function Click(index) {
            $(".wOrR li.on").removeClass("on");
            $(index).addClass("on");

            var isRight = 0;
            //若是学生做错题，直接显示答案是否正确，不可再点击
            if (AccessType == 4 || AccessType == 5) {
                //去除选项点击事件
                $.each($(".wOrR li"), function (index) {
                    document.getElementById(this.id).onclick = function () { };
                });

                //答案正确               
                if (index.id == modelAnswer.split('_')[0]) {
                    isRight = 1;
                }
                if (AccessType == 4) {
                    obj = { StuTaskID: StuTaskID == "undefined" ? "" : StuTaskID, QuestionID: QuestionID, IsRight: isRight, AccessType: AccessType }
                    $.post("?action=saveWQue&rand=" + Math.random(), obj, function (data) {
                        if (data) {
                            data = eval("(" + data + ")");
                            if (data.Success) {
                                window.parent.ShowAnswer(isRight, isRight == 1 ? "" : "<span class='w'>"
                                    + (modelAnswer.split('_')[1] == "TRUE" ? "√" : "×") + "</span>");
                            }
                            else {
                                alert(data.Message);
                            }
                        }
                    });
                } else {
                    window.parent.ShowAnswer(isRight, isRight == 1 ? "" : "<span class='w'>"
                                    + (modelAnswer.split('_')[1] == "TRUE" ? "√" : "×") + "</span>");
                }

            }
            //若是学生做题，保存答案
            if (AccessType == 3) {
                //记录答题时间
                var endTime = new Date().getTime();
                var spendTime = (endTime - startTime) / 1000;
                startTime = endTime;
                SaveAnswer(index.id, spendTime);
            }
        }

        //保存答案
        function SaveAnswer(answer, spendTime) {
            //bj = { QuestionID: QuestionID, StuTaskID: StuTaskID, Answer: answer, IsRight: answer == modelAnswer.split('_')[0] ? 1 : 0, SpendTime: spendTime, ParentID: ParentID }
            var stuScore = 0;
            var isRight = 0;
            var parentQScore = 0;
            var nowRightCount = rightCount;
            if (answer == modelAnswer.split('_')[0]) {
                isRight = 1;
                stuScore = 100 / minQueCount;
                nowRightCount = nowRightCount + 1;
            }
            parentQScore = 100 * nowRightCount / minQueCount;
            var minQAnswer = {
                StuTaskID: StuTaskID, QuestionID: QuestionID, ParentID: ParentID,
                Answer: answer, IsRight: isRight, StuScore: stuScore, SpendTime: spendTime
            };
            var parentQAnswer = {
                StuTaskID: StuTaskID, QuestionID: ParentID,
                IsRight: parentQScore == 100 ? 1 : 0, StuScore: parentQScore, SpendTime: spendTime
            };
            obj = { MinQAnswer: $.toJSON(minQAnswer), ParentQAnswer: $.toJSON(parentQAnswer) };
            $.post("?action=SaveAnswer&rand=" + Math.random(), obj, function (data) {
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
