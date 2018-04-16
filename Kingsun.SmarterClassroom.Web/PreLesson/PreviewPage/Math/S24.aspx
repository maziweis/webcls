<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="S24.aspx.cs" Inherits="SmarterClassroomWeb.PreLesson.PreviewPage.Math.S24" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="x-ua-compatible" content="IE=edge, chrome=1" />
    <title></title>
    <link href="../../../App_Theme/css/base1.css" rel="stylesheet" />
    <link href="../../../App_Theme/css/math.css" rel="stylesheet" />
    <script src="../../../CommonJs/jquery/jquery-1.11.2.min.js"></script>
    <script src="../../../CommonJs/CommonDB/CommonDB.js"></script>
    <script src="../../../CommonJs/jquery/jquery.json-2.4.js"></script>
<script src="../../../App_Theme/js/jquery.nicescroll.js"></script>
</head>
<body>
    <div class="S S24">
        <div class="shell">
            <div class="box1" style="min-height: 175px;">
            </div>
            <%--<div class="keyboard">
                <ul>
                    <li>
                        <input type="button" value="1" />
                        <input type="button" value="2" />
                        <input type="button" value="3" />
                        <input type="button" value="4" />
                        <input type="button" value="5" />
                        <input type="button" value="6" />
                        <input type="button" value="7" />
                        <input type="button" value="8" />
                        <input type="button" value="9" />
                        <input type="button" value=" " class="del" id="deleBtn" />
                    </li>
                    <li>
                        <input type="button" value="0" />
                        <input type="button" value="＋" />
                        <input type="button" value="－" />
                        <input type="button" value="×" />
                        <input type="button" value="÷" />
                        <input type="button" value="＞" />
                        <input type="button" value="＜" />
                        <input type="button" value="＝" />
                        <input type="button" value="." />
                        <input type="button" value="确定" class="ok" id="okBtn" />
                    </li>
                </ul>
            </div>--%>
            <%--//数字 运算符键盘--数学使用  id="div_KeyBoard3"--%>
            <div class="keyboard">
                <ul>
                    <li>
                        <input type="button" value="0" />
                        <input type="button" value="1" />
                        <input type="button" value="2" />
                        <input type="button" value="3" />
                        <input type="button" value="4" />
                        <input type="button" value="5" />
                        <input type="button" value="6" />
                        <input type="button" value="7" />
                        <input type="button" value="8" />
                        <input type="button" value="9" />
                    </li>
                    <li>
                        <input type="button" value="." />
                        <input type="button" value="＋" />
                        <input type="button" value="－" />
                        <input type="button" value="×" />
                        <input type="button" value="÷" />
                        <input type="button" value="＞" />
                        <input type="button" value="＜" />
                        <input type="button" value="＝" />
                        <input type="button" value=":" />
                        <input class="text txt1" type="button" value="←" id="deleBtn" />
                    </li>
                    <li>
                        <input type="button" value="(" />
                        <input type="button" value=")" />
                        <input class="default2" type="button" value="……" />
                        <input type="button" value="%" />
                        <input type="button" value="≈" />
                        <input type="button" value="x²" disabled="disabled" style="background-color: buttonface; color: graytext;" />
                        <input type="button" value="x³" disabled="disabled" style="background-color: buttonface; color: graytext;" />
                        <input type="button" value="°" />
                        <input class="text txt2" type="button" value="确定" id="okBtn" />
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        var accessType = 0;
        var questionID = '', parentID = '';
        var stuTaskID = '';
        var blankAnswer = '';
        var stuAnswer = '';
        var startTime, endTime, spendTime;
        var hasDone = false;//错题模式下是否已做过
        var minQueCount = 0;
        var rightCount = 0;
        document.body.onkeydown = function (event) {
            event = event ? event : window.event;
            var keyCode = event.keyCode;
            if (event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
            if (keyCode >= 48 && keyCode <= 57) {
                clickKeyboard($(".keyboard ul input[value='" + String.fromCharCode(keyCode) + "']"));
            } else if (keyCode >= 96 && keyCode <= 105) {
                clickKeyboard($(".keyboard ul input[value='" + String.fromCharCode(keyCode - 48) + "']"));
            } else if (keyCode == 8 || keyCode == 46) {//Backspace键 8
                clickKeyboard($("#deleBtn"));
            }
        };
        $(function () {
            startTime = new Date().getTime();
            accessType = parseInt(Common.QueryString.GetValue("AccessType"));
            stuTaskID = Common.QueryString.GetValue("StuTaskID");
            questionID = Common.QueryString.GetValue("QuestionID");
            parentID = Common.QueryString.GetValue("ParentID");
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
                $.post(Constant.SunnyTask + "TaskApi/Question/GetQuestionInfo", { StuTaskID: stuTaskID == "undefined" ? "" : stuTaskID, QuestionID: questionID, AccessType: accessType, ParentID: parentID }, function (result) {
                    if (result) {
                        if (result.Success) {
                            var question = result.Data[0];
                            //rightCount = eval("(" + result.Data + ")").Count;//答对小题数
                            minQueCount = question.MinQueCount;//小题数
                            parentID = question.ParentID;

                            var contentHtml = '<input type="text" value="' + question.QuestionContent + '" maxlength="2" disabled="disabled" />';
                            contentHtml += '<div class="p"><input type="text" value="' + question.SecondContent + '" maxlength="2" disabled="disabled" />';

                            if (question.StuAnswer) {
                                stuAnswer = question.StuAnswer.Answer;
                                contentHtml += '<input type="text" value="' + stuAnswer + '" maxlength="2" class="answer" id="txtAnswer"  />';
                            } else {
                                contentHtml += '<input type="text" value="" maxlength="2" class="answer" id="txtAnswer" />';
                            }
                            contentHtml += '</div>';
                            $(".box1").append(contentHtml);
                            $("#txtAnswer").focus();
                            blankAnswer = question.BlankAnswer[0].Answer;

                            resizeWindow();
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

            $(".keyboard ul input").click(function () {
                clickKeyboard(this);
            });
        });

        function resizeWindow() {
            window.parent.autoSetPosition(0, 0);
            $('.S').niceScroll({ touchbehavior: false, autohidemode: false, cursorcolor: "#dcdcdc", cursoropacitymax: 1, cursorwidth: 8 });
        }

        //虚拟键盘点击事件
        function clickKeyboard(obj) {
            if (hasDone) {//错题模式下，若已作答，则不可再答题
                return;
            }
            var inputVal = $("#txtAnswer").val();
            if ($(obj).attr("id") == "okBtn") {//确定
                $(".keyboard ul input").removeClass("on");
                saveAnswer();
            } else if ($(obj).attr("id") == "deleBtn") {//
                $(".keyboard ul input").removeClass("on");
                if (inputVal.length > 0) {
                    $("#txtAnswer").val(inputVal.substring(0, inputVal.length - 1));
                    if (accessType == 3) {
                        saveAnswer();
                    }
                }
            } else {
                var reg = new RegExp(/\d/);
                if (reg.test($(obj).val())) {
                    $(".keyboard ul input").removeClass("on");
                    $(obj).addClass("on");
                    $("#txtAnswer").val(inputVal + $(obj).val());
                    if (accessType == 3) {
                        saveAnswer();
                    }
                }
            }

        }

        function saveAnswer() {
            if (accessType >= 3) {
                stuAnswer = Common.TrimSpace($("#txtAnswer").val());
                var isRight = false;
                //填完才能保存答案
                if (stuAnswer == "") {
                    return;
                }
                isRight = stuAnswer == blankAnswer;

                if (accessType == 3) {
                    endTime = new Date().getTime();
                    spendTime = (endTime - startTime) / 1000;
                    startTime = endTime;//重新计时
                    var stuScore = 0;
                    var parentQScore = 0;
                    var nowRightCount = rightCount;
                    if (isRight == true) {
                        stuScore = 100 / minQueCount;
                        nowRightCount = nowRightCount + 1;
                    }
                    parentQScore = 100 * nowRightCount / minQueCount;

                    var minQAnswer = {
                        StuTaskID: stuTaskID, QuestionID: questionID, ParentID: parentID,
                        Answer: stuAnswer, IsRight: isRight == true ? 1 : 0, StuScore: stuScore, SpendTime: spendTime
                    };
                    var parentQAnswer = {
                        StuTaskID: stuTaskID, QuestionID: parentID,
                        IsRight: parentQScore == 100 ? 1 : 0, StuScore: parentQScore, SpendTime: spendTime
                    };
                    var obj = { MinQAnswer: $.toJSON(minQAnswer), ParentQAnswer: $.toJSON(parentQAnswer) };
                    //var obj = { StuTaskID: stuTaskID, ParentID: parentID, QuestionID: questionID, Answer: stuAnswer, IsRight: isRight, SpendTime: spendTime };
                    $.post("?action=SaveAnswer&Rand=" + Math.random(), obj);
                } else if (accessType == 4) {
                    $.post("?action=SaveStuWrongQue&Rand=" + Math.random(), {
                        StuTaskID: stuTaskID,
                        QuestionID: questionID,
                        IsRight: (isRight ? 1 : 0)
                    }, function (result) {
                        if (result) {
                            result = eval("(" + result + ")");//JSON.parse
                            if (result.Success) {
                                hasDone = true;
                                window.parent.ShowAnswer(isRight, isRight ? "" : "<span class='w'>" + blankAnswer + "</span>");
                            } else {
                                alert(result.Message);
                            }
                        }
                        else {
                            alert(result.Message);
                        }
                    });
                } else if (accessType == 5) {
                    hasDone = true;
                    window.parent.ShowAnswer(isRight, isRight ? "" : "<span class='w'>" + blankAnswer + "</span>");
                }
            }
        }
    </script>
</body>
</html>
