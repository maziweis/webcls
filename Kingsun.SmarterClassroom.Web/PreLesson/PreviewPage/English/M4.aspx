<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="M4.aspx.cs" Inherits="SmarterClassroomWeb.PreLesson.PreviewPage.English.M4" %>

<!DOCTYPE html>

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
    <div class="M M4">
    <div class="w">
        <h3></h3>
        <div class="rankList">
        </div>
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
        var obj ={};

        //记录题目标准答案
        var modelAnswer = "";
        //记录题目大题ID
        var ParentID = "";
        var minQueCount = 0;
        var rightCount = 0;
        $(function () {

            //获取页面url
            QuestionID = Common.QueryString.GetValue("QuestionID");
            ParentID = Common.QueryString.GetValue("ParentID");
            StuTaskID = Common.QueryString.GetValue("StuTaskID");
            //1：教师预览；2：总体预览；3：学生做题；4：错题重做；5：错题集
            AccessType = Common.QueryString.GetValue("AccessType");

            //设置参数  
            if (AccessType == 1 || AccessType == 2)
            {
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
            else if (AccessType ==4) {
                if (QuestionID == "undefined" || StuTaskID == "undefined") {
                    alert("未获取到相应参数，不能获取题目内容！");
                    window.parent.backList();
                }
            }
            else if (AccessType == 5)
            {
                if (QuestionID == "undefined") {
                    alert("未获取到相应参数，不能获取题目内容！");
                    window.parent.backList();
                }
            }
            else {
                alert("未获取到相应参数！");
                window.parent.backList();
            }
            obj = { QuestionID: QuestionID, StuTaskID: StuTaskID == "undefined" ? "" : StuTaskID, AccessType: AccessType ,ParentID:ParentID};

            //获取题目信息
            $.post(Constant.SunnyTask + "TaskApi/Question/GetQuestionInfo", obj, function (data) {
                if (data.Success) {
                    var question = data.Data[0];
                    //var question = eval("(" + data.Data + ")").QuestionInfo;
                    //rightCount = eval("(" + data.Data + ")").Count;
                    //ParentID = question.ParentID;
                    //minQueCount = question.MinQueCount;
                    //判断有无学生答案
                    if (AccessType == 3 && question.StuAnswer != null)
                    {
                        IsDo = true;
                    }
                    //音频
                    window.parent.InitPlay(question.Mp3Url);

                    $(".w h3").html(question.QuestionContent.replace(/\\n/g, "<br/>").replace(/\/n/g, "<br/>").replace("[","<u>").replace("]","</u>"));
                    //题目Html
                    var questionHtml = "";

                    if (question.SelectList.length < 4) {
                        questionHtml += '<ul style="text-align:center">';
                    }
                    else {
                        questionHtml += '<ul>';
                    }
                    $.each(question.SelectList, function (index, value) {                       
                        if (IsDo) {
                            if (value.Sort == question.StuAnswer.Answer) {
                                questionHtml += '<li class="on" onclick="ClickLi(this)" id="' + value.Sort + '"><a href="javascript:void(0)"><img src="' + value.ImgUrl + '" alt=""/><span>' + String.fromCharCode(64 + parseInt(value.Sort)) + '</span></a></li>';
                            } else {
                                questionHtml += '<li onclick="ClickLi(this)" id="' + value.Sort + '"><a href="javascript:void(0)"><img src="' + value.ImgUrl + '" alt=""/><span>' + String.fromCharCode(64 + parseInt(value.Sort)) + '</span></a></li>';
                            }
                        } else {
                            questionHtml += '<li onclick="ClickLi(this)" id="' + value.Sort + '"><a href="javascript:void(0)"><img src="' + value.ImgUrl + '" alt=""/><span>' + String.fromCharCode(64 + parseInt(value.Sort)) + '</span></a></li>';
                        }
                        //获取题目标准答案
                        if (value.IsAnswer)
                        {
                            modelAnswer = value.Sort;
                        }
                    })
                    questionHtml += '</ul>';
                    $(".rankList").html(questionHtml);

                    //每个小题需要调用一次父页面的自动布局
                    resizeWindow();

                    if (AccessType == 3)
                    {
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

        //选项切换
        function ClickLi(index) {
            $(".rankList ul li.on").removeClass("on");
            $(index).addClass("on");
            var isRight = 0;
            //若是学生做错题，直接显示答案是否正确，不可再点击
            if (AccessType == 4||AccessType ==5)
            {
                //去除选项点击事件
                $.each($(".rankList ul li"), function (index) {
                    document.getElementById(this.id).onclick = function () { };
                });                

                //答案正确               
                if (index.id == modelAnswer) {
                    isRight = 1;                    
                }

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
                                //    alert("正确答案：" + String.fromCharCode(64 + parseInt(modelAnswer)));                               
                                //}
                                window.parent.ShowAnswer(isRight, isRight == 1 ? "" : "<span class='w'>"
                                    + String.fromCharCode(64 + parseInt(modelAnswer)) + "</span>");
                            }
                            else {
                                alert(data.Message);
                            }
                        }
                    });
                }
                else {
                    window.parent.ShowAnswer(isRight, isRight == 1 ? "" : "<span class='w'>"
                                    + String.fromCharCode(64 + parseInt(modelAnswer)) + "</span>");
                }
            }

            //若是学生做题，保存答案
            if (AccessType == 3)
            {
                //记录答题时间
                var endTime = new Date().getTime();
                var spendTime = (endTime - startTime) / 1000;
                startTime = endTime;
                SaveAnswer(index.id, spendTime);
            }
        }

        //保存答案
        function SaveAnswer(answer, spendTime) {
            var stuScore = 0;
            var isRight = 0;
            var parentQScore = 0;
            var nowRightCount = rightCount;
            if (answer == modelAnswer) {
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
            $.post("?action=SaveStuAnswer&rand=" + Math.random(), obj, function (data) {
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
