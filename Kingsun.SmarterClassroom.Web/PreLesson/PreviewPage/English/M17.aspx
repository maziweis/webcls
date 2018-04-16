<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="M17.aspx.cs" Inherits="SmarterClassroomWeb.PreLesson.PreviewPage.English.M17" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
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
    <!--M17——T023-->
    <div class="M M17">
        <div class="stem">
            <div class="stemBox">
                <h3 id="h_QuestionContent"></h3>
            </div>
        </div>
        <div class="problem">
            <div class="problemBox">
                <table id="tb_Answer">
                </table>
            </div>
        </div>
    </div>

    <%--// 页面加载,读取题目数据--%>
    <script type="text/javascript">
        var startTime = ""; //记录进入页面的时间即开始时间 [从题目加载完成后开始]
        var AnsweIndex = 0;//当前答案位置
        var StuTaskID; //学生作业ID--只有在学生做题页面才有这个ID
        var QuestionID;//题目ID
        var AccessType;//页面类型：1=教师预览  2=学生做题  3=学生错题重做
        var BlankAnswer = new Array(); //填空题答案--标准答案
        var AnswerList = new Array();  //学生的答案--已经作答
        var IsDo = false; //记录作业是否已做
        var ParentID = ""; //大题ID
        var QueSum = 0;//题目(大小题)总数
        var QueAndScore = new Array();//题目与分数
        $(function () {
            //M17 调试路径
            //http://192.168.3.94:8010/QuestionModels/M17.aspx?QuestionID=00686DD8-D974-48BF-A6D9-D66789E5B87B&AccessType=2&StuTaskID=4dba4256-c3e2-4be8-9f68-187352320ecf

            StuTaskID = Common.QueryString.GetValue("StuTaskID"); //学生作业ID--只有在学生做题页面才有这个ID
            QuestionID = Common.QueryString.GetValue("QuestionID");//题目ID
            AccessType = Common.QueryString.GetValue("AccessType");//页面类型：1=教师预览  2=学生做题  3=学生错题重做

            //获取题目信息
            var obj = {};
            if (AccessType == "1" || AccessType == "2" || AccessType == "5") { //教师预览，学生错题重做
                obj = { AccessType: AccessType, QuestionID: QuestionID };
            }
            else if (AccessType == "3" || AccessType == "4") { //学生做作业
                obj = { AccessType: AccessType, QuestionID: QuestionID, StuTaskID: StuTaskID };
            }
            else { }
            $.post(Constant.SunnyTask + "TaskApi/Question/GetQuestionInfo", obj, function (data) {
                if (data.Success) {
                    QueSum = data.Data.length - 1;
                    if (data.Data.length != undefined) {
                        window.parent.HidePlay(); //调用父窗体 隐藏音频播放按钮
                        var AnswerHtml = "<tr>"; //填充答案框+文本
                        var queNum = 1;
                        $.each(data.Data, function (i) {
                            if (this.ParentID != null && this.ParentID != "") {
                                var stuAnswer = "";
                                if (this.StuAnswer != undefined) {
                                    stuAnswer = "value=\"" + this.StuAnswer.Answer + "\"";
                                    AnswerList.push(this.StuAnswer.Answer);
                                    IsDo = true;
                                }
                                else {
                                    AnswerList.push(null);
                                }

                                AnswerHtml += "<td><em>" + queNum + "、</em><input name=\"txtAnswer\" id=\"" + this.QuestionID
                                            + "\" onclick=\"AnswerTextClick('" + queNum + "')\" type=\"text\" " + stuAnswer + " queNum=\""
                                            + queNum + "\" maxlength=\"1\"/></td>";//
                                if (queNum % 2 == 0) {
                                    AnswerHtml += "</tr><tr>";
                                }
                                queNum++;

                                if (this.BlankAnswer[0].Answer != undefined) {
                                    BlankAnswer.push(this.BlankAnswer[0].Answer);
                                }

                                //将题目ID与分数存入 QueAndScore中
                                QueAndScore.push({ QuestionID: this.QuestionID, Score: (this.StuAnswer != null ? this.StuAnswer.StuScore : 0) });
                            }
                            else {
                                ParentID = this.QuestionID;
                                //$("#h_Title").html(this.QuestionTitle);
                                $("#h_QuestionContent").html((this.QuestionContent.replace(/\[/g, '<u>').replace(/\]/g, '</u>').replace(/\\n/g, '<br/>').replace(/\/n/g, '<br/>')));
                            }
                        });
                        $("#tb_Answer").html((AnswerHtml + "</tr>").replace("<tr></tr>", ""));

                        //每个小题需要调用一次父页面的自动布局
                        resizeWindow();

                        //定位首个答题框、答题序列
                        var allText = $("input:text");
                        $.each(allText, function (i) {
                            if (AnsweIndex == 0) {
                                if ($(this).val() != undefined && $(this).val() == "") {
                                    AnsweIndex = i + 1;//答案开始的位置
                                    $(this).focus();
                                    startTime = new Date(); //题目加载完成后的时间
                                }
                            }
                        });
                    }
                    //绑定答案输入框的焦点事件..防止Tab切换 无法记录答案序列
                    $("input:text").focus(function () {
                        if ($(this) != undefined) {
                            AnsweIndex = ($(this).attr("queNum"));
                            startTime = new Date(); //切换一题后，重新计时
                        }
                    });

                    //文本框失去焦点
                    $("input:text").blur(function () {
                        if ($(this) != undefined) {
                            txtBlur($(this).attr("id"));
                        }
                    });

                    //文本框输入控制
                    $("input:text").keydown(function (event) {
                        event = event ? event : window.event;
                        if (event.keyCode >= 65 && event.keyCode <= 90) {
                            $(this).val(String.fromCharCode(event.keyCode).toUpperCase());
                        }

                    });
                }
            });
        });

        function resizeWindow() {
            window.parent.autoSetPosition(0, 1);
            $('.M .stem').niceScroll({ touchbehavior: false, autohidemode: false, cursorcolor: "#dcdcdc", cursoropacitymax: 1, cursorwidth: 8 });
            $('.M .problem').niceScroll({ touchbehavior: false, autohidemode: false, cursorcolor: "#dcdcdc", cursoropacitymax: 1, cursorwidth: 8 });
        }

        //答案文本框点击事件
        function AnswerTextClick(index) {
            //$($("input:text")[AnsweIndex - 1]).removeClass();
            AnsweIndex = index;
            //$($("input:text")[AnsweIndex - 1]).addClass("on");
        }

        //答案输入框失去焦点
        function txtBlur(txtId) {
            $("#" + txtId).val($("#" + txtId).val().toUpperCase());
            if (AccessType == 3) { //学生做题，实时保存答案
                AnswerSave(txtId);
            }
            if (AccessType == 4 || AccessType == 5) { //错题重做 
                var hasAnswerText = 0;  //是否全部做完
                var allText = $("input:text");
                $.each(allText, function (i) {
                    if (hasAnswerText == 0) {
                        if ($(this).val() == undefined || $(this).val() == "") {
                            hasAnswerText = i + 1;
                        }
                    }
                });
                if (hasAnswerText == 0) {
                    QueWrongAnswer();
                }
            }
        }

        //答案保存
        function AnswerSave(txtId) {
            if ($("#" + txtId) != undefined) {
                var spendTime = new Date() - startTime;
                var stuAnswer = $.trim($("#" + txtId).val().replace("/^\s+|\s+$/", "")).toUpperCase();
                if (AnswerList[AnsweIndex - 1] != null) {  //当前小题有答题记录,直接保存
                    if (stuAnswer != AnswerList[AnsweIndex - 1]) {
                        //与历史答案不一致，重新保存
                        var spendTime = new Date() - startTime;
                        var Isright = (stuAnswer == BlankAnswer[AnsweIndex - 1].toUpperCase() ? 1 : 0);
                        //var obj = { QuestionID: txtId, StuTaskID: StuTaskID, Answer: stuAnswer, Isright: Isright, spendTime: spendTime, ParentID: ParentID };
                        //保存数据
                        var stuScore = ((Isright == "1" || Isright == 1) ? 100 / QueSum : 0);
                        //修改大题分数 并求和 QueAndScore
                        var parentQScore = 0;
                        var nowRightCount = 0; //答对的总题数
                        $.each(QueAndScore, function (n) {
                            if (QueAndScore[n].QuestionID == txtId) {
                                QueAndScore[n].Score = stuScore;
                            }
                            if (QueAndScore[n].Score != 0 && QueAndScore[n].Score != "0") {
                                nowRightCount++;
                            }
                            //parentQScore = parentQScore + QueAndScore[n].Score;
                        });
                        parentQScore = 100 * nowRightCount / QueSum;

                        var minQAnswer = {
                            StuTaskID: StuTaskID, QuestionID: txtId, ParentID: ParentID,
                            Answer: stuAnswer, IsRight: Isright, StuScore: stuScore, SpendTime: spendTime
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
                }
                else { //当前小题 无答题记录，判断输入的答案是否有效，再进行保存
                    if (stuAnswer) {
                        var spendTime = new Date() - startTime;
                        var Isright = (stuAnswer == BlankAnswer[AnsweIndex - 1].toUpperCase() ? 1 : 0);
                        //var obj = { QuestionID: txtId, StuTaskID: StuTaskID, Answer: stuAnswer, Isright: Isright, spendTime: spendTime, ParentID: ParentID };

                        //保存数据
                        var stuScore = ((Isright == "1" || Isright == 1) ? 100 / QueSum : 0);
                        //修改大题分数 并求和 QueAndScore
                        var parentQScore = 0;
                        var nowRightCount = 0; //答对的总题数
                        $.each(QueAndScore, function (n) {
                            if (QueAndScore[n].QuestionID == txtId) {
                                QueAndScore[n].Score = stuScore;
                            }
                            if (QueAndScore[n].Score != 0 && QueAndScore[n].Score != "0") {
                                nowRightCount++;
                            }
                            //parentQScore = parentQScore + QueAndScore[n].Score;
                        });
                        parentQScore = 100 * nowRightCount / QueSum;

                        var minQAnswer = {
                            StuTaskID: StuTaskID, QuestionID: txtId, ParentID: ParentID,
                            Answer: stuAnswer, IsRight: Isright, StuScore: stuScore, SpendTime: spendTime
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
                }
            }
        }

        //错题重做： 监控页面所有小题是否都已经作答-- 都已经作答后 显示[全对提示]或[正确/错误答案]
        function QueWrongAnswer() {
            //alert("错题重做 做完了");
            var allText = $("input:text");
            var hanError = 0;//是否有答错的题  0=全对  1=有错题
            var answerHtml = "";
            $.each(allText, function (i) {
                //移除所有答案输入框的焦点事件,设置为只读
                //$(this).removeAttr("focus").removeAttr("blur");
                $(this).unbind();
                $(this).attr("readonly", "readonly");

                if ($(this).val() != BlankAnswer[i]) {
                    hanError = 1;
                    //answerHtml += "[" + BlankAnswer[i] + "]" + " ";
                    answerHtml += "<span class=\"w\">(" + (i + 1) + ")" + BlankAnswer[i] + "</span>";
                }
                else {
                    //answerHtml += "" + BlankAnswer[i] + "" + " ";
                    answerHtml += "<span class=\"r\">(" + (i + 1) + ")" + BlankAnswer[i] + "</span>";
                }
            });
            var WrongIsRight; //错题重做 是否做对
            if (hanError == 0) {
                WrongIsRight = 1;
            }
            else {
                WrongIsRight = 0;
            }
            //调用方法 将此题移除错题集
            if (AccessType == 4) {
                var objUpdWrongQue = { StuTaskID: StuTaskID == "undefined" ? "" : StuTaskID, QuestionID: QuestionID, IsRight: WrongIsRight, AccessType: AccessType }
                $.post("?action=updstuwrongque&rand=" + Math.random(), objUpdWrongQue, function (data) {
                    if (data) {
                        data = eval("(" + data + ")");
                        if (data.Success) {
                            //页面显示 恭喜你，答对了  先用alert提示
                            if (WrongIsRight == 1) {
                                //alert("恭喜你，答对了！");
                                window.parent.ShowAnswer(WrongIsRight, "");
                            }
                            else {
                                //alert("正确答案：" + answerHtml);
                                window.parent.ShowAnswer(WrongIsRight, answerHtml);
                            }
                        }
                    }
                });
            }
            else if (AccessType == 5) {
                if (WrongIsRight == 1) {
                    window.parent.ShowAnswer(WrongIsRight, "");
                }
                else {
                    window.parent.ShowAnswer(WrongIsRight, answerHtml);
                }
            }
        }

    </script>
</body>
</html>
