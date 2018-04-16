<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="S23.aspx.cs" Inherits="SmarterClassroomWeb.PreLesson.PreviewPage.Math.S23" %>

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
    <div class="S S23">
        <div class="picbox" style="min-height: 375px;">
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
        <div class="clear"></div>
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
                    <input type="button" value="x²" disabled="disabled" style="background-color: buttonface;color:graytext;"/>
                    <input type="button" value="x³" disabled="disabled" style="background-color: buttonface;color:graytext;" />
                    <input type="button" value="°" />
                    <input class="text txt2" type="button" value="确定" id="okBtn" />
                </li>
            </ul>
        </div>
    </div>
    <script type="text/javascript">
        var accessType = 0;
        var questionID = '', parentID = '';
        var stuTaskID = '';
        var blankAnswer = '', secondContent = '';
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

            if (keyCode >= 48 && keyCode <= 57) {
                clickKeyboard($(".keyboard ul input[value='" + String.fromCharCode(keyCode) + "']"));
            } else if (keyCode >= 96 && keyCode <= 105) {
                clickKeyboard($(".keyboard ul input[value='" + String.fromCharCode(keyCode - 48) + "']"));
            } else {//Backspace键 8
                switch (keyCode) {
                    case 8 || 46://Backspace键  Delete键
                        clickKeyboard($("#deleBtn"));
                        break;
                    case 106:
                        clickKeyboard($(".keyboard ul input[value='×']"));
                        break;
                    case 107:
                        clickKeyboard($(".keyboard ul input[value='＋']"));
                        break;
                    case 109:
                        clickKeyboard($(".keyboard ul input[value='－']"));
                        break;
                    case 111 || 191:
                        clickKeyboard($(".keyboard ul input[value='÷']"));
                        break;
                    case 110 || 190:
                        clickKeyboard($(".keyboard ul input[value='.']"));
                        break;
                    case 187:
                        clickKeyboard($(".keyboard ul input[value='＝']"));
                        break;
                    default:
                        break;
                }
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
                obj = { AccessType: accessType, QuestionID: questionID, StuTaskID: stuTaskID };
                $.post(Constant.SunnyTask + "TaskApi/Question/GetQuestionInfo",obj, function (result) {
                    if (result) {
                        if (result.Success) {
                            var question = result.Data[0];
                            //rightCount = eval("(" + result.Data + ")").Count;//答对小题数
                            minQueCount = question.MinQueCount;//小题数
                            parentID = question.ParentID;

                            var contentHtml = '';
                            if (question.QuestionContent) {
                                contentHtml += '<div class="tit">' + Common.MatchFenShi(question.QuestionContent) + '</div>';
                            }
                            contentHtml += '<ul>';
                            if (question.ImgUrl) {
                                contentHtml += '<li class="pic"><img src="' + question.ImgUrl + '" onclick="window.parent.FullScreen(\'' + question.ImgUrl + '\')" title="点击图片可放大" /></li>';
                            } else {
                                contentHtml += '<li class="pic"></li>';
                            }
                            if (question.StuAnswer) {
                                stuAnswer = question.StuAnswer.Answer;
                            }
                            if (question.SecondContent) {
                                isFenShi = true;
                                secondContent = question.SecondContent;
                                blankAnswer = question.BlankAnswer[0].Answer;
                                contentHtml += getSecondContentHTML(secondContent, stuAnswer);
                            } else {
                                for (var i = 0; i < question.BlankAnswer.length; i++) {
                                    blankAnswer += ";" + question.BlankAnswer[i].Answer;
                                }
                                blankAnswer = blankAnswer.substring(1);//多个答案以分号拼接
                                contentHtml += '<li class="normal"><input class="normal" readonly="readonly" type="text" value="' + stuAnswer + '"  maxlength="10" id="txtNormal" onclick="clickInput(this)"/>'
                                    + '<div class="normalline"></div></li>';
                            }

                            contentHtml += '</ul>';
                            $(".picbox").append(contentHtml);
                            
                            resizeWindow();
                            clickInput($(".picbox input:eq(0)"));
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

        //字符串是否为括号
        function IsKH(inputStr) {
            return inputStr && (inputStr == "()" || inputStr == "（）");
        }

        //获取分式的题目内容展示HTML
        function getAnswerHTML(content, bAnswer) {
            var cHtml = '<ul><li><p>正确答案：</p></li>';
            var contentArray = content.split(/{|\/|}/);//按{，/，}三个分隔符处理字符串,分割后数组长度为4
            var baArray = bAnswer.split(",");
            if (contentArray[0] == "") {//第一种情形{()/()}、{d/()}、{()/d}
                cHtml += '<span class="MathJye"><table class="table" style="margin-right:1px" cellpadding="0" cellspacing="0"><tbody>'
                        + '<tr><td style="border-bottom:1px solid red">' + (IsKH(contentArray[1]) ? baArray[0] : contentArray[1]) + '</td></tr>'
                        + '<tr><td>' + (IsKH(contentArray[2]) ? (baArray[1] ? baArray[1] : baArray[0]) : contentArray[2]) + '</td></tr></tbody></table></span>';
            } else {//第二种情形(){()/()},d{()/()},...
                isHasInt = true;
                cHtml += '<span class="MathJye">' + (IsKH(contentArray[0]) ? baArray[0] : contentArray[0]) + '<table class="table" style="margin-right:1px" cellpadding="0" cellspacing="0"><tbody>'
                        + '<tr><td style="border-bottom:1px solid red">' + (IsKH(contentArray[1]) ? (baArray[1] ? baArray[1] : baArray[0]) : contentArray[1]) + '</td></tr>'
                        + '<tr><td>' + (IsKH(contentArray[2]) ? baArray[baArray.length - 1] : contentArray[2]) + '</td></tr></tbody></table></span>';
            }
            cHtml += '</ul>';
            return cHtml;
        }
        //获取分式的题目内容展示HTML
        function getSecondContentHTML(content, sAnswer) {
            var cHtml = '';
            var contentArray = content.split(/{|\/|}/);//按{，/，}三个分隔符处理字符串,分割后数组长度为4
            if (sAnswer == '') {//未做
                if (contentArray[0] == "") {//第一种情形{()/()}、{d/()}、{()/d}
                    cHtml += '<li class="num">';
                    cHtml += '<input class="ups" readonly="readonly" type="text" value="' + (IsKH(contentArray[1]) ? '' : contentArray[1]) + '" maxlength="2" id="txtUp" ' + (IsKH(contentArray[1]) ? 'onclick="clickInput(this)"' : 'disabled="disabled"') + '/>';
                    cHtml += '<div class="numline"></div>';
                    cHtml += '<input class="downs" readonly="readonly" type="text" value="' + (IsKH(contentArray[2]) ? '' : contentArray[2]) + '" maxlength="2" id="txtDown" ' + (IsKH(contentArray[2]) ? 'onclick="clickInput(this)"' : 'disabled="disabled"') + '/>';
                    cHtml += '</li>';
                } else {//第二种情形(){()/()},d{()/()},...
                    isHasInt = true;
                    cHtml += '<li class="Znum">';
                    cHtml += '<input type="text" readonly="readonly" value="' + (IsKH(contentArray[0]) ? '' : contentArray[0]) + '" maxlength="2" id="txtFirst" ' + (IsKH(contentArray[0]) ? 'onclick="clickInput(this)"' : 'disabled="disabled"') + '/>'
                    + '</li><li class="num">'
                    + '<input class="ups" type="text" readonly="readonly" value="' + (IsKH(contentArray[1]) ? '' : contentArray[1]) + '" maxlength="2" id="txtUp" ' + (IsKH(contentArray[1]) ? 'onclick="clickInput(this)"' : 'disabled="disabled"') + '/>'
                    + '<div class="numline"></div>'
                    + '<input class="downs" type="text" readonly="readonly" value="' + (IsKH(contentArray[2]) ? '' : contentArray[2]) + '" maxlength="2" id="txtDown" ' + (IsKH(contentArray[2]) ? 'onclick="clickInput(this)"' : 'disabled="disabled"') + '/>';
                    cHtml += '</li>';
                }
            } else {//已做
                var saArray = sAnswer.split(",");
                if (contentArray[0] == "") {//第一种情形{()/()}、{d/()}、{()/d}
                    cHtml += '<li class="num">';
                    cHtml += '<input class="ups" readonly="readonly" type="text" value="' + (IsKH(contentArray[1]) ? saArray[0] : contentArray[1]) + '" maxlength="2" id="txtUp" ' + (IsKH(contentArray[1]) ? 'onclick="clickInput(this)"' : 'disabled="disabled"') + '/>';
                    cHtml += '<div class="numline"></div>';
                    cHtml += '<input class="downs" readonly="readonly" type="text" value="' + (IsKH(contentArray[2]) ? (saArray[1] ? saArray[1] : saArray[0]) : contentArray[2]) + '" maxlength="2" id="txtDown" ' + (IsKH(contentArray[2]) ? 'onclick="clickInput(this)"' : 'disabled="disabled"') + '/>';
                    cHtml += '</li>';
                } else {//第二种情形(){()/()},d{()/()},...
                    isHasInt = true;
                    cHtml += '<li class="Znum">';
                    cHtml += '<input type="text" readonly="readonly" value="' + (IsKH(contentArray[0]) ? saArray[0] : contentArray[0]) + '" maxlength="2" id="txtFirst" ' + (IsKH(contentArray[0]) ? 'onclick="clickInput(this)"' : 'disabled="disabled"') + '/>'
                    + '</li><li class="num">'
                    + '<input class="ups" type="text" readonly="readonly" value="' + (IsKH(contentArray[1]) ? (saArray[1] ? saArray[1] : saArray[0]) : contentArray[1]) + '" maxlength="2" id="txtUp" ' + (IsKH(contentArray[1]) ? 'onclick="clickInput(this)"' : 'disabled="disabled"') + '/>'
                    + '<div class="numline"></div>'
                    + '<input class="downs" type="text" readonly="readonly" value="' + (IsKH(contentArray[2]) ? saArray[saArray.length - 1] : contentArray[2]) + '" maxlength="2" id="txtDown" ' + (IsKH(contentArray[2]) ? 'onclick="clickInput(this)"' : 'disabled="disabled"') + '/>';
                    cHtml += '</li>';
                }
            }
            return cHtml;
        }

        function clickInput(obj) {
            currentInput = $(obj).attr("id");
            $(obj).focus();
        }

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
                var reg = new RegExp(/\d/);
                if (!isFenShi || reg.test($(obj).val())) {
                    $(".keyboard ul input").removeClass("on");
                    $(obj).addClass("on");
                    $("#" + currentInput).val(inputVal + $(obj).val());
                    if (accessType == 3) {
                        saveAnswer();
                    }
                }
            }

        }

        //拼接要保存的学生答案
        function getAnswer() {
            var sAnswer = '';
            if (isFenShi) {
                if (isHasInt) {
                    if ($("#txtFirst").attr("disabled") != "disabled") {
                        if ($("#txtFirst").val() == "") {
                            return '';
                        }
                        sAnswer = $("#txtFirst").val() + ",";
                    }
                }
                if ($("#txtUp").attr("disabled") != "disabled") {
                    if ($("#txtUp").val() == "") {
                        return '';
                    }
                    sAnswer += $("#txtUp").val() + ",";
                }
                if ($("#txtDown").attr("disabled") != "disabled") {
                    if ($("#txtDown").val() == "") {
                        return '';
                    }
                    sAnswer += $("#txtDown").val() + ",";
                }
                if (sAnswer != "") {
                    sAnswer = sAnswer.substring(0, sAnswer.length - 1);
                }
            } else {
                if ($("#txtNormal").val() == "") {
                    return '';
                }
                sAnswer = $("#txtNormal").val();
            }
            return sAnswer;
        }

        function saveAnswer() {
            if (accessType >= 3) {
                stuAnswer = getAnswer();
                var isRight = false;
                //填完才能保存答案
                if (stuAnswer == "") {
                    return;
                }
                var tmpArray = blankAnswer.split(";");
                for (var i = 0; i < tmpArray.length; i++) {
                    if (tmpArray[i] == stuAnswer) {
                        isRight = true;
                        break;
                    }
                }

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
                                    window.parent.ShowAnswer(isRight, isRight ? "" : "<span class='w'>" + blankAnswer + "</span>");
                                } else {
                                    window.parent.ShowMathAnswer(getAnswerHTML(secondContent, blankAnswer));
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
                    window.parent.ShowAnswer(isRight, isRight ? "" : "<span class='w'>" + blankAnswer + "</span>");
                }
            }
        }
    </script>
</body>
</html>
