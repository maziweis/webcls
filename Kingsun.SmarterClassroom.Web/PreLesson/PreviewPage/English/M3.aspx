<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="M3.aspx.cs" Inherits="SmarterClassroomWeb.PreLesson.PreviewPage.English.M3" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="x-ua-compatible" content="IE=edge, chrome=1" />
    <title></title>
    <link href="../../../App_Theme/css/base.css" rel="stylesheet" />
    <link href="../../../App_Theme/css/task.css" rel="stylesheet" />
    <script src="../../../CommonJs/jquery/jquery-1.11.2.min.js"></script>
    <script src="../../../CommonJs/CommonDB/CommonDB.js"></script>
    <script src="../../../CommonJs/jquery/jquery.json-2.4.js"></script>
<script src="../../../App_Theme/js/jquery.nicescroll.js"></script>
</head>
<body>
    <div class="M M3">
        <h3></h3>
        <div class="textBox">
            <ul>
            </ul>
        </div>
        <%--//英文键盘  id="div_KeyBoard1"--%>
        <div class="keyboard" id="div_KeyBoard1">
            <ul>
                <li>
                    <input type="button" value="q" />
                    <input type="button" value="w" />
                    <input type="button" value="e" />
                    <input type="button" value="r" />
                    <input type="button" value="t" />
                    <input type="button" value="y" />
                    <input type="button" value="u" />
                    <input type="button" value="i" />
                    <input type="button" value="o" />
                    <input type="button" value="p" />
                </li>
                <li>
                    <input type="button" value="a" />
                    <input type="button" value="s" />
                    <input type="button" value="d" />
                    <input type="button" value="f" />
                    <input type="button" value="g" />
                    <input type="button" value="h" />
                    <input type="button" value="j" />
                    <input type="button" value="k" />
                    <input type="button" value="l" />
                    <input id="deleBtn" class="text txt1" type="button" value="←" />
                </li>
                <li>
                    <input id="changeBtn" type="button" class="text txt2" value="大写" />
                    <input type="button" value="z" />
                    <input type="button" value="x" />
                    <input type="button" value="c" />
                    <input type="button" value="v" />
                    <input type="button" value="b" />
                    <input type="button" value="n" />
                    <input type="button" value="m" />
                    <%--<input id="deleBtn" type="button" value=" " />--%>
                    <input id="btn_sign" class="text txt2" type="button" value="符号" />
                    <input id="btn_save1" class="text txt2" type="button" value="确定" />
                </li>
            </ul>
        </div>

        <%--//数字标点键盘  id="div_KeyBoard2"--%>
        <div class="keyboard" style="display: none;" id="div_KeyBoard2">
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
                    <input type="button" value="," />
                    <input type="button" value="…" />
                    <input type="button" value="?" />
                    <input type="button" value="!" />
                    <input type="button" value=":" />
                    <input type="button" value=";" />
                    <input type="button" value='"' />
                    <input type="button" value="'" />
                    <input id="deleBtn_Sign" class="text txt1" type="button" value="←" />
                </li>
                <li>
                    <input type="button" value="(" />
                    <input type="button" value=")" />
                    <input class="default1" type="button" value="" />
                    <input type="button" value="-" />
                    <input type="button" value="—" />
                    <input type="button" value="/" />
                    <input id="btn_Char" class="text txt2" type="button" value="字母" />
                    <input id="btn_save2" class="text txt2" type="button" value="确定" />
                </li>
            </ul>
        </div>

    </div>
    <script type="text/javascript">
        var accessType = 0;
        var questionID = '', parentID = '';
        var stuTaskID = '';
        var blankAnswer = '', answerArray;
        var focusIndex = 0;
        var rightAnswer = '', stuAnswer = '';
        var startTime, endTime, spendTime;
        var strAlphbet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        var strNumber = "0123456789";
        var hasDone = false;//错题模式下是否已做过

        var lineCount = 0;//当前行的字母（即输入框）个数
        var lineLength = 0;
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

            if (keyCode == 20) {//Caps Lock键 20
                clickKeyboard($("#changeBtn"));
            } else if (keyCode == 8 || keyCode == 46) {//Backspace键 8
                clickKeyboard($("#deleBtn"));
            } else if (keyCode >= 65 && keyCode <= 90) {//字母键
                if ($("#changeBtn").attr("class") == "text txt2 on") {
                    if ($(".keyboard ul input[value='" + String.fromCharCode(keyCode) + "']").val()) {//非IE6模式
                        clickKeyboard($(".keyboard ul input[value='" + String.fromCharCode(keyCode) + "']"));
                    } else {//IE6模式下
                        clickKeyboard($(".keyboard ul input[value='" + String.fromCharCode(keyCode + 32) + "']"));
                    }
                } else {
                    clickKeyboard($(".keyboard ul input[value='" + String.fromCharCode(keyCode + 32) + "']"));
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
                obj = { QuestionID: questionID, StuTaskID: stuTaskID == "undefined" ? "" : stuTaskID };
                $.post(Constant.SunnyTask + "TaskApi/Question/GetQuestionInfo", obj, function (result) {
                    if (result) {
                        if (result.Success) {
                            var question = result.Data[0];
                            //rightCount = eval("(" + result.Data + ")").Count;//答对小题数
                            minQueCount = question.MinQueCount;//小题数
                            Common.CheckIndexOf();
                            window.parent.InitPlay(question.Mp3Url);
                            parentID = question.ParentID;
                            blankAnswer = question.BlankAnswer[0].Answer.replace("…", "...");
                            answerArray = blankAnswer.split(" ");
                            //按空格分割处理
                            for (var i = 0; i < answerArray.length; i++) {
                                if (lineCount + answerArray[i].length <= 14) {
                                    $(".textBox ul").append(addContent(answerArray[i]));
                                    lineCount += answerArray[i].length;
                                } else {
                                    if (lineLength <= $(".textBox ul").width()) {
                                        $(".textBox ul").append('<br/>');
                                    }
                                    $(".textBox ul").append(addContent(answerArray[i]));
                                    lineLength = 0;
                                    lineCount = answerArray[i].length;
                                }
                                if (i < answerArray.length - 1) {//拼接空格
                                    $(".textBox ul").append('<li class="symbol space"></li>');
                                    lineLength += 19;
                                }
                            }
                            //for (var i = 0; i < blankAnswer.length; i++) {
                            //    if (strAlphbet.indexOf(blankAnswer.charAt(i)) >= 0) {
                            //        rightAnswer += blankAnswer.charAt(i);
                            //        $(".textBox ul").append('<li><input type="text" value="" maxlength="1" index="' + $(".textBox ul input").length + '" onclick="clickInput(this)" /></li>');
                            //    } else {
                            //        if (blankAnswer.charAt(i) == " ") {//空格
                            //            $(".textBox ul").append('<li class="symbol space"></li>');
                            //        } else if (blankAnswer.charAt(i) == "-" || blankAnswer.charAt(i) == "=" || strNumber.indexOf(blankAnswer.charAt(i)) >= 0) {//等号、分隔符、数字
                            //            $(".textBox ul").append('<li class="symbol long">' + blankAnswer.charAt(i) + '</li>');
                            //        } else {
                            //            $(".textBox ul").append('<li class="symbol short">' + blankAnswer.charAt(i) + '</li>');
                            //        }
                            //    }
                            //}
                            resizeWindow();
                            if (question.StuAnswer && question.StuAnswer.QuestionID!=null) {
                                stuAnswer = question.StuAnswer.Answer;
                                $.each($(".textBox ul li input"), function (index, value) {
                                    if (stuAnswer.charAt(index) != "") {
                                        $(value).val(stuAnswer.charAt(index));
                                    }
                                });
                                focusIndex = stuAnswer.length - 1;
                            }
                            $(".textBox ul input").eq(focusIndex).focus();
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

            //切换符号
            $("#btn_sign").click(function () {
                $("#div_KeyBoard1").hide();
                $("#div_KeyBoard2").show();
            });
            //切换字母
            $("#btn_Char").click(function () {
                $("#div_KeyBoard2").hide();
                $("#div_KeyBoard1").show();
            });

        });
        //拼接要显示的内容
        function addContent(content) {
            var result = '';
            for (var i = 0; i < content.length; i++) {
                if (strAlphbet.indexOf(content.charAt(i)) >= 0) {
                    result += '<li><input type="text" value="" maxlength="1" index="' + rightAnswer.length + '" onclick="clickInput(this)" /></li>';
                    rightAnswer += content.charAt(i);
                    lineLength += 64;
                } else {
                    //非字母显示规则：空格--"symbol space"，等号、分隔符、数字---"symbol long"，其他--"symbol short"
                    if (content.charAt(i) == " ") {//空格
                        result += '<li class="symbol space"></li>';
                        lineLength += 19;
                    } else if (content.charAt(i) == "-" || content.charAt(i) == "=" || strNumber.indexOf(content.charAt(i)) >= 0) {//等号、分隔符、数字
                        result += '<li class="symbol long">' + content.charAt(i) + '</li>';
                        lineLength += 24;
                    } else {
                        result += '<li class="symbol short">' + content.charAt(i) + '</li>';
                        lineLength += 14;
                    }
                }
            }
            return result;
        }

        function resizeWindow() {
            window.parent.autoSetPosition(0, 0);
            $('.M').niceScroll({ touchbehavior: false, autohidemode: false, cursorcolor: "#dcdcdc", cursoropacitymax: 1, cursorwidth: 8 });
        }

        function autoFocus() {
            $(".textBox ul input").eq(focusIndex).focus();
        }

        function clickInput(obj) {
            focusIndex = parseInt($(obj).attr("index"));
        }

        //虚拟键盘点击事件
        function clickKeyboard(obj) {
            if (hasDone) {//错题模式下，若已作答，则不可再答题
                return;
            }
            var key = $(obj).val();
            if ($(obj).attr("id") == "changeBtn") {
                if ($(obj).attr("class") == "text txt2 on") {
                    $(obj).val("大写");
                    $(".keyboard ul input").removeClass("on");
                    shiftKey(false);
                } else {
                    $(obj).val("小写");
                    $(".keyboard ul input").removeClass("on");
                    $(obj).addClass("on");
                    shiftKey(true);
                }
            } else if ($(obj).attr("id") == "deleBtn" || $(obj).attr("id") == "deleBtn_Sign") {
                deleteKey();
                $(obj).addClass("on");
                toggleShiftKey();
            } else if ($(obj).attr("id") == "btn_sign" || $(obj).attr("id") == "btn_Char" || $(obj).attr("id") == "btn_save1" || $(obj).attr("id") == "btn_save2") {
                //按钮 符号 字母 确定1 确定2

            } else {
                $(".textBox ul li input").eq(focusIndex).val(key);
                toggleShiftKey();
                $(obj).addClass("on");
                if (focusIndex < rightAnswer.length - 1) {
                    focusIndex++;
                }
            }
            $(".textBox ul input").eq(focusIndex).focus();
            saveAnswer();
        }
        //大小写转换键状态切换
        function toggleShiftKey() {
            if ($("#changeBtn").attr("class") == "text txt2 on") {
                $(".keyboard ul input").removeClass("on");
                $("#changeBtn").addClass("text txt2 on");
            } else {
                $(".keyboard ul input").removeClass("on");
            }
        }
        //大小写转换键，相差32
        function shiftKey(isShift) {
            if (isShift) {//小写转大写
                $.each($(".keyboard ul input[type='button']"), function (index, value) {
                    var keyValue = $(value).val();
                    var keyID = $(value).attr("id");
                    if (keyID != "changeBtn" && keyID != "deleBtn") {
                        $(value).val(keyValue.toUpperCase());
                    }
                });
            } else {//大写转小写
                $.each($(".keyboard ul input"), function (index, value) {
                    var keyValue = $(value).val();
                    var keyID = $(value).attr("id");
                    if (keyID != "changeBtn" && keyID != "deleBtn") {
                        $(value).val(keyValue.toLowerCase());
                    }
                });
            }
        }
        //删除键
        function deleteKey() {
            if (focusIndex > 0) {
                if ($(".textBox ul li input").eq(focusIndex).val() == "") {
                    focusIndex--;
                }
            }
            $(".textBox ul li input").eq(focusIndex).val("");
        }

        function saveAnswer() {
            if (accessType >= 3) {
                stuAnswer = '';
                var inputVals = $(".textBox ul li input");
                var isRight = false;
                $.each($(".textBox ul li input"), function (index, value) {
                    if ($(value).val() == "") {
                        isRight = false;
                    }
                    stuAnswer += $(value).val();
                });
                //填完才能保存答案
                if (stuAnswer.length < rightAnswer.length) {
                    return;
                }
                isRight = stuAnswer == rightAnswer;

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
                    //var obj = { StuTaskID: stuTaskID, ParentID: parentID, QuestionID: questionID, Answer: stuAnswer, IsRight: isRight, SpendTime: spendTime };
                    var minQAnswer = {
                        StuTaskID: stuTaskID, QuestionID: questionID, ParentID: parentID,
                        Answer: stuAnswer, IsRight: isRight==true?1:0, StuScore: stuScore, SpendTime: spendTime
                    };
                    var parentQAnswer = {
                        StuTaskID: stuTaskID, QuestionID: parentID,
                        IsRight: parentQScore == 100 ? 1 : 0, StuScore: parentQScore, SpendTime: spendTime
                    };
                    var obj = { MinQAnswer: $.toJSON(minQAnswer), ParentQAnswer: $.toJSON(parentQAnswer) };
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

