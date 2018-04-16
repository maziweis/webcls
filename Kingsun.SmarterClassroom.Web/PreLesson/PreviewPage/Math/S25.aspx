<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="S25.aspx.cs" Inherits="SmarterClassroomWeb.PreLesson.PreviewPage.Math.S25" %>

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
    <div class="S S25">
        <h3></h3>
        <div class="textBox">
            <ul>
            </ul>
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
        <div class="keyboard" >
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
                    <input class="text txt1" type="button" value="←" id="deleBtn"/>
                </li>
                <li>
                    <input type="button" value="(" />
                    <input type="button" value=")" />
                    <input class="default2" type="button" value="……" />
                    <input type="button" value="%" />
                    <input type="button" value="≈" />
                    <input type="button" value="x²" disabled="disabled" style="background-color: buttonface;color:graytext;"/>
                    <input type="button" value="x³" disabled="disabled" style="background-color: buttonface;color:graytext;" />
                    <input type="button" value="°" />
                    <input class="text txt2" type="button" value="确定" id="okBtn"/>
                </li>
            </ul>
        </div>
    </div>
    <script type="text/javascript">
        var accessType = 0;
        var questionID = '', parentID = '';
        var stuTaskID = '';
        var blankAnswer = [];
        var stuAnswer = '';
        var startTime, endTime, spendTime;
        var hasDone = false;//错题模式下是否已做过
        var isFenShi = false, isHasInt = false, currentInput = '';//是否为分式题、是否包含整数（几又几分之几）、当前输入框ID
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
            if (keyCode == 13) {
                toggleInput();
            }
            else if (keyCode >= 48 && keyCode <= 57) {
                clickKeyboard($(".keyboard ul input[value='" + String.fromCharCode(keyCode) + "']"));
            } else if (keyCode >= 96 && keyCode <= 105) {
                clickKeyboard($(".keyboard ul input[value='" + String.fromCharCode(keyCode - 48) + "']"));
            } else if (keyCode == 8 || keyCode == 46) {//Backspace键 8
                clickKeyboard($("#deleBtn"));
            } else if (keyCode == 110 || keyCode == 190) {//Backspace键 8
                clickKeyboard($(".keyboard ul input[value='.']"));
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
                            //$(".textBox ul").append(result.Data.QuestionContent);
                            var question = result.Data[0];
                            //rightCount = eval("(" + result.Data + ")").Count;//答对小题数
                            minQueCount = question.MinQueCount;//小题数
                            parentID = question.ParentID;

                            $(".textBox ul").append(Common.MatchFenShi(question.QuestionContent));
                            for (var i = 0; i < question.BlankAnswer.length; i++) {
                                blankAnswer.push(question.BlankAnswer[i].Answer);
                            }
                            //blankAnswer = question.BlankAnswer[0].Answer;
                            if (question.StuAnswer) {
                                stuAnswer = question.StuAnswer.Answer;
                                $(".textBox ul").append(getContentHTML(stuAnswer, true));
                            } else {
                                $(".textBox ul").append(getContentHTML(blankAnswer[0], false));
                            }
                            if (blankAnswer[0].length > 4) {
                                $("#txtAnswer").css("width", blankAnswer[0].length * 30 + "px");
                            }
                            clickInput($(".textBox input:eq(0)"));

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
            var inputVal = $("#" + currentInput).val();
            if ($(obj).attr("id") == "okBtn") {//确定
                $(".keyboard ul input").removeClass("on");
                saveAnswer();
            } else if ($(obj).attr("id") == "deleBtn") {//
                $(".keyboard ul input").removeClass("on");
                if (inputVal.length > 0) {
                    $("#" + currentInput).val(inputVal.substring(0, inputVal.length - 1));
                    if (accessType == 3) {
                        saveAnswer();
                    }
                }
            } else {
                $(".keyboard ul input").removeClass("on");
                $(obj).addClass("on");
                $("#" + currentInput).val(inputVal + $(obj).val());
                if (accessType == 3) {
                    saveAnswer();
                }
            }

        }

        function clickInput(obj) {
            $(".textBox input").removeClass("on");
            currentInput = $(obj).attr("id");
            $(obj).addClass("on");
        }
        //按Enter切换输入框
        function toggleInput() {
            if (currentInput == "txtFirst") {
                clickInput($("#txtUp"));
            } else if (currentInput == "txtUp") {
                clickInput($("#txtDown"));
            } else if (currentInput == "txtDown") {
                if ($("#txtFirst").val()) {
                    clickInput($("#txtFirst"));
                } else {
                    clickInput($("#txtUp"));
                }
            }
        }

        //获取分式的题目内容展示HTML
        function getAnswerHTML(answer) {
            var cHtml = '<ul><li><p>正确答案：</p></li>';
            var contentArray = answer.replace("，", ",").split(",");
            if (contentArray.length == 2) {//第二种情形{()/()}
                cHtml += '<span class="MathJye"><table class="table" style="margin-right:1px" cellpadding="0" cellspacing="0"><tbody>'
                        + '<tr><td style="border-bottom:1px solid red">' + contentArray[0] + '</td></tr>'
                        + '<tr><td>' + contentArray[1] + '</td></tr></tbody></table></span>';
            } else if (contentArray.length == 3) {//第三种情形(){()/()}
                isHasInt = true;
                cHtml += '<span class="MathJye">' + contentArray[0] + '<table class="table" style="margin-right:1px" cellpadding="0" cellspacing="0"><tbody>'
                        + '<tr><td style="border-bottom:1px solid red">' + contentArray[1] + '</td></tr>'
                        + '<tr><td>' + contentArray[2] + '</td></tr></tbody></table></span>';
            }
            cHtml += '</ul>';
            return cHtml;
        }

        //获取分式的题目内容展示HTML
        function getContentHTML(answer, hasAnswer) {
            var cHtml = '';
            var contentArray = answer.replace("，", ",").split(",");
            if (!hasAnswer) {//未做
                if (contentArray.length == 1) {//第一种情形：整数
                    cHtml += '<li><input type="text" readonly=\"readonly\" value="" class="answer" id="txtAnswer" onclick="clickInput(this)"></li>';
                } else if (contentArray.length == 2) {//第二种情形{()/()}
                    isFenShi = true;
                    cHtml += '<span class="MathJye"><table class="table" style="margin-right:1px" cellpadding="0" cellspacing="0"><tbody>'
                        + '<tr><td style="border-bottom:1px solid white"><input type="text" readonly=\"readonly\" id="txtUp" onclick="clickInput(this)"/></td></tr>'
                        + '<tr><td><input type="text" readonly=\"readonly\" id="txtDown" onclick="clickInput(this)"/></td></tr></tbody></table></span>';
                } else if (contentArray.length == 3) {//第三种情形(){()/()}
                    isFenShi = true;
                    isHasInt = true;
                    cHtml += '<span class="MathJye"><input type="text" id="txtFirst" readonly=\"readonly\" onclick="clickInput(this)"/><table class="table" style="margin-right:1px" cellpadding="0" cellspacing="0"><tbody>'
                        + '<tr><td style="border-bottom:1px solid white"><input type="text" readonly=\"readonly\" id="txtUp" onclick="clickInput(this)"/></td></tr>'
                        + '<tr><td><input type="text" readonly=\"readonly\" id="txtDown" onclick="clickInput(this)"/></td></tr></tbody></table></span>';
                }
            } else {//已做
                if (contentArray.length == 1) {//第一种情形：整数
                    cHtml += '<li><input type="text" readonly=\"readonly\" value="' + contentArray[0] + '" maxlength="2" class="answer" id="txtAnswer" onclick="clickInput(this)"></li>';
                } else if (contentArray.length == 2) {//第二种情形{()/()}
                    isFenShi = true;
                    cHtml += '<span class="MathJye"><table class="table" style="margin-right:1px" cellpadding="0" cellspacing="0"><tbody>'
                        + '<tr><td style="border-bottom:1px solid white"><input type="text" readonly=\"readonly\" id="txtUp" value="' + contentArray[0] + '" onclick="clickInput(this)"/></td></tr>'
                        + '<tr><td><input type="text" readonly=\"readonly\" id="txtDown" value="' + contentArray[1] + '" onclick="clickInput(this)"/></td></tr></tbody></table></span>';
                } else if (contentArray.length == 3) {//第三种情形(){()/()}
                    isFenShi = true;
                    isHasInt = true;
                    cHtml += '<span class="MathJye"><input type="text" readonly=\"readonly\" id="txtFirst" value="' + contentArray[0] + '" onclick="clickInput(this)"/><table class="table" style="margin-right:1px" cellpadding="0" cellspacing="0"><tbody>'
                        + '<tr><td style="border-bottom:1px solid white"><input type="text" readonly=\"readonly\" id="txtUp" value="' + contentArray[1] + '" onclick="clickInput(this)"/></td></tr>'
                        + '<tr><td><input type="text" readonly=\"readonly\" id="txtDown" value="' + contentArray[2] + '" onclick="clickInput(this)"/></td></tr></tbody></table></span>';
                }
            }
            return cHtml;
        }

        //拼接要保存的学生答案
        function getAnswer() {
            var sAnswer = '';
            if (isFenShi) {
                if (isHasInt) {
                    if ($("#txtFirst").val() == "") {
                        return '';
                    }
                    sAnswer = $("#txtFirst").val() + ",";
                }
                if ($("#txtUp").val() == "") {
                    return '';
                }
                sAnswer += $("#txtUp").val() + ",";
                if ($("#txtDown").val() == "") {
                    return '';
                }
                sAnswer += $("#txtDown").val() + ",";
                if (sAnswer != "") {
                    sAnswer = sAnswer.substring(0, sAnswer.length - 1);
                }
            } else {
                if ($("#txtAnswer").val() == "") {
                    return '';
                }
                sAnswer = $("#txtAnswer").val();
            }
            return sAnswer;
        }

        function saveAnswer() {
            if (accessType >= 3) {
                stuAnswer = getAnswer();;
                var isRight = false;
                //填完才能保存答案
                if (stuAnswer == "") {
                    return;
                }
                for (var i = 0; i < blankAnswer.length; i++) {
                    if (stuAnswer == blankAnswer[i]) {
                        isRight = true;
                        break;
                    }
                }
                //isRight = stuAnswer == blankAnswer;

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
                                if (!isFenShi || (isFenShi & isRight)) {
                                    window.parent.ShowAnswer(isRight, isRight ? "" : "<span class='w'>" + blankAnswer[0] + "</span>");
                                } else {
                                    window.parent.ShowMathAnswer(getAnswerHTML(blankAnswer[0]));
                                }
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
                    window.parent.ShowAnswer(isRight, isRight ? "" : "<span class='w'>" + blankAnswer[0] + "</span>");
                }
            }
        }
    </script>
</body>
</html>