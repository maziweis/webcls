<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="S8.aspx.cs" Inherits="SmarterClassroomWeb.PreLesson.PreviewPage.Math.S8" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
<link href="../../../App_Theme/css/base1.css" rel="stylesheet" />
    <link href="../../../App_Theme/css/math.css" rel="stylesheet" />
    <script src="../../../CommonJs/jquery/jquery-1.11.2.min.js"></script>
    <script src="../../../CommonJs/CommonDB/CommonDB.js"></script>
    <script src="../../../CommonJs/jquery/jquery.json-2.4.js"></script>
<script src="../../../App_Theme/js/jquery.nicescroll.js"></script>
</head>
<body>

    <!--S8——T012-->
    <div class="S S8">
        <div class="w">
            <h3>
            </h3>
            <ul class="imgUl" id="ul_Img">
            </ul>
            <ul class="optionUl" id="ul_Answer">
            </ul>
        </div>
    </div>


    <%--// 页面加载,读取题目数据--%>
    <script type="text/javascript">
        var startTime = ""; //记录进入页面的时间即开始时间 [从题目加载完成后开始]
        var AnsweIndex = 0;//当前答案位置
        var StuTaskID; //学生作业ID--只有在学生做题页面才有这个ID
        var QuestionID;//题目ID
        var AccessType;//页面类型：1=教师预览  2=学生做题  3=学生错题重做
        var BlankAnswer;// = new Array(); //填空题答案
        var DoTaskTxt = new Array();//填空题文本框ID序列
        var IsDo = false; //记录作业是否已做
        var ParentID = ""; //大题ID

        var QueSum = 0;//题目(大小题)总数
        var QueAndScore = new Array();//题目与分数

        $(function () {

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
                        var ImgHtml = "";
                        var AnswerHtml = "";
                        var queNum = 1;
                        BlankAnswer = new Array(data.Data.length - 1);
                        $.each(data.Data, function (i) {
                            if (this.ParentID != null && this.ParentID != "") {
                                //当前题为小题
                                ImgHtml += "<li onclick=\"ImgClick('" + queNum + "')\"><a href=\"javascript:void(0)\">" +
                                        "<img src=\"" + this.ImgUrl + "\" alt='' /><em class=\"em\">" + queNum + "</em></a></li>";

                                var stuAnswer = "";
                                if (this.StuAnswer != undefined) {
                                    stuAnswer = "value=\"" + this.StuAnswer.Answer + "\"";
                                    IsDo = true;
                                }
                                AnswerHtml += "<li><input class=\"\" name=\"txtAnswer\" num=\"" + queNum + "\" QueAnswer=\"\" id=\""  //+ this.QuestionID
                                            + "\" onclick=\"AnswerTextClick('" + queNum + "')\" type=\"text\" "
                                            + " maxlength=\"1\" readonly=\"readonly\"/></li>";//

                                queNum++;

                                if (this.BlankAnswer[0].Answer != undefined) {
                                    BlankAnswer[this.BlankAnswer[0].Answer - 1] = this.Sort;
                                }
                                DoTaskTxt.push({ QuestionID: this.QuestionID, Sort: this.Sort, QueAnswer: this.BlankAnswer[0].Answer, StuAnswer: this.StuAnswer });

                                //将题目ID与分数存入 QueAndScore中
                                QueAndScore.push({ QuestionID: this.QuestionID, Score: (this.StuAnswer != null ? this.StuAnswer.StuScore : 0) });
                            }
                            else {
                                ParentID = this.QuestionID;
                                //标题
                                if (this.QuestionContent != "") {
                                    $(".w h3").html(this.QuestionContent);
                                }
                            }
                        });

                        if (queNum < 6) {
                            $("#ul_Img").css("text-align", "center");
                        }
                        $("#ul_Img").html(ImgHtml);
                        $("#ul_Answer").html(AnswerHtml);

                        // 题目加载完成之后重新修改答案输入框的ID QueAnswer StuAnswer
                        UpdTextAttr();

                        //每个小题需要调用一次父页面的自动布局
                        resizeWindow();

                        //定位首个答题框、答题序列
                        var allText = $("input:text");
                        $.each(allText, function (i) {
                            if (AnsweIndex == 0) {
                                if ($(this).val() != undefined && $(this).val() == "") {
                                    AnsweIndex = i + 1;//答案开始的位置
                                    $(this).addClass("on");
                                }
                            }
                        });

                        startTime = new Date(); //题目加载完成后的时间
                    }
                }
            });

        });

        function resizeWindow() {
            window.parent.autoSetPosition(0, 0);
            $('.S').niceScroll({ touchbehavior: false, autohidemode: false, cursorcolor: "#dcdcdc", cursoropacitymax: 1, cursorwidth: 8 });
        }

        // 题目加载完成之后重新修改答案输入框的ID QueAnswer StuAnswer
        function UpdTextAttr() {
            var allText = $("input:text");
            for (var i = 0; i < DoTaskTxt.length; i++) {
                if ($(allText[DoTaskTxt[i].QueAnswer])) {
                    //alert($(allText[DoTaskTxt[i].Answer - 1]).attr("id"));
                    $(allText[DoTaskTxt[i].QueAnswer - 1]).attr("id", DoTaskTxt[i].QuestionID);
                    $(allText[DoTaskTxt[i].QueAnswer - 1]).attr("QueAnswer", DoTaskTxt[i].Sort);
                    if (DoTaskTxt[i].StuAnswer) {
                        //$(allText[DoTaskTxt[i].QueAnswer - 1]).val(DoTaskTxt[i].StuAnswer.Answer);
                        //if (DoTaskTxt[i].StuAnswer.Answer == DoTaskTxt[i].QueAnswer) {
                        if (DoTaskTxt[i].StuAnswer.IsRight) {
                            $(allText[DoTaskTxt[i].QueAnswer - 1]).val(DoTaskTxt[i].Sort);
                        }
                        else {
                            $(allText[DoTaskTxt[i].QueAnswer - 1]).val(DoTaskTxt[i].StuAnswer.Answer);
                        }
                    }
                }
            }
        }

        //答案文本框点击事件
        function AnswerTextClick(index) {
            $($("input:text")[AnsweIndex - 1]).removeClass();
            AnsweIndex = index;
            $($("input:text")[AnsweIndex - 1]).addClass("on");
        }

        //图片点击事件
        function ImgClick(ImgNum) {
            //点击图片 重置选中边框
            var img_A = $("#ul_Img li a");
            $.each(img_A, function (i) {
                if ($(this) != undefined) {
                    if (i == (ImgNum - 1)) {
                        $(this).addClass("on");
                    }
                    else {
                        $(this).removeClass("on");
                    }
                }
            });

            var allText = $("input:text");
            if (allText[AnsweIndex - 1] != undefined) { //判断当前答案输入框是否存在
                $(allText[AnsweIndex - 1]).val(ImgNum).removeClass(); //赋值点击的序号，同时移除答案框上的样式
                //此处判断是否要保存答案 或显示正确答案
                if (AccessType == 3) { //学生做题，实时保存答案
                    var spendTime = new Date() - startTime; //时间
                    var Isright = (ImgNum == $(allText[AnsweIndex - 1]).attr("QueAnswer") ? 1 : 0); //是否是正确答案
                    var Answer = Isright == 1 ? $(allText[AnsweIndex - 1]).attr("num") : $(allText[AnsweIndex - 1]).val();
                    //var Answer = $(allText[AnsweIndex - 1]).val();
                    //var obj = { QuestionID: $(allText[AnsweIndex - 1]).attr("id"), StuTaskID: StuTaskID, Answer: Answer, Isright: Isright, spendTime: spendTime, ParentID: ParentID };

                    var qid = $(allText[AnsweIndex - 1]).attr("id");
                    //保存数据
                    var stuScore = ((Isright == "1" || Isright == 1) ? 100 / QueSum : 0);
                    //修改大题分数 并求和 QueAndScore
                    var parentQScore = 0;
                    var nowRightCount = 0; //答对的总题数
                    $.each(QueAndScore, function (n) {
                        if (QueAndScore[n].QuestionID == qid) {
                            QueAndScore[n].Score = stuScore;
                        }
                        if (QueAndScore[n].Score != 0 && QueAndScore[n].Score != "0") {
                            nowRightCount++;
                        }
                        //parentQScore = parentQScore + QueAndScore[n].Score;
                    });
                    parentQScore = 100 * nowRightCount / QueSum;

                    var minQAnswer = {
                        StuTaskID: StuTaskID, QuestionID: qid, ParentID: ParentID,
                        Answer: Answer, IsRight: Isright, StuScore: stuScore, SpendTime: spendTime
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
                            startTime = new Date(); //保存一题后，重新计时
                        }
                        else {
                            alert(data.Message);
                        }
                    });
                }

                AnsweIndex++; //答案序列加1

                //填完当前序列的答案后 判断做题类型+是否需要移除答案框的点击事件
                var hasAnswerText = 0;
                $.each(allText, function (i) {
                    if (hasAnswerText == 0) {
                        if ($(this).val() == undefined || $(this).val() == "") {
                            hasAnswerText = i + 1;
                        }
                    }
                });
                //判断答案框是否全部填了值， 全部填写了值 就显示正确答案 AccessType == 4,5 错题重做,显示正确答案
                if (AccessType == 4 || AccessType == 5) { //错题重做 显示正确答案
                    if (hasAnswerText == 0) {
                        //做完最后一个小题就需要显示答案了
                        //移除所有答案框的点击事件
                        $.each(allText, function () {
                            if ($(this) != undefined) {
                                $(this).removeAttr("onclick");
                            }
                        });

                        //显示答案方法
                        QueWrongAnswer();
                        AnsweIndex = -1;
                    }
                }


                if (AccessType != 4 && AccessType != 5) {
                    //当前是最后一个答案序列，回到第一个序列位置,只有在非错题下
                    if (AnsweIndex > allText.length) {
                        AnsweIndex = 1;
                    }
                }

                //if (hasAnswerText != 0) {
                if ($(allText[AnsweIndex - 1]) != undefined) { //判断答案序列+1后 是否还有对应的答案输入框
                    $(allText[AnsweIndex - 1]).addClass("on"); //添加高亮样式
                }

                //判断是否是最后一个答案序列，是：判断以前的序列是否有未答的
                if (AnsweIndex > allText.length) {
                    if (hasAnswerText > 0) { //当前答案序列大于最高序列 才进入循环==即仅循环一次
                        if ($(allText[hasAnswerText - 1]).val() == undefined || $(allText[hasAnswerText - 1]).val() == "") {
                            $(allText[hasAnswerText - 1]).addClass("on");
                            AnsweIndex = hasAnswerText;
                        }
                    }
                }
                //}
                //else { //所有答案都输入了  中断向后移动答案输入序列
                //    AnsweIndex = allText.length + 1;
                //}
            }
        }

        //错题重做显示答案
        function QueWrongAnswer() {
            //alert("错题重做 做完了");
            var allText = $("input:text");
            var hanError = 0;//是否有答错的题  0=全对  1=有错题
            var answerHtml = "";
            $.each(allText, function (i) {
                if ($(this).val() != BlankAnswer[i]) {
                    hanError = 1;
                    //answerHtml += "[" + BlankAnswer[i] + "]" + " ";
                    answerHtml += "<span class=\"w\">" + BlankAnswer[i] + "</span>" + "   ";
                }
                else {
                    //answerHtml += "" + BlankAnswer[i] + "" + " ";
                    answerHtml += "<span class=\"r\">" + BlankAnswer[i] + "</span>" + "   ";
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
