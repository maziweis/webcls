<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Y20.aspx.cs" Inherits="SmarterClassroomWeb.PreLesson.PreviewPage.Chinese.Y20" %>


<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>写一写</title>
<link href="../../../App_Theme/css/base1.css" rel="stylesheet" />
    <link href="../../../App_Theme/css/chinese.css" rel="stylesheet" />
    <script src="../../../CommonJs/jquery/jquery-1.11.2.min.js"></script>
    <script src="../../../App_Theme/js/jquery.nicescroll.js"></script>
    <script src="../../../CommonJs/CommonDB/CommonDB.js"></script>
    <script src="../../../CommonJs/jquery/jquery.json-2.4.js"></script>
</head>
<body>
    <form id="form1" runat="server">
        <div class="Y20">
            <div class="shell"><p>写一写</p></div>
            <p id="p">温馨提示：如需上传听写答案，请至手机APP拍照上传哦！</p>           
        </div>
    </form>
</body>
    <script type="text/javascript">
        //获取页面url
        var QuestionID = "";
        var StuTaskID = "";
        var AccessType = "";
        var startTime, endTime, spendtime;
        var ParentID = "";
        $(function () {
            startTime = new Date();
            //获取页面url
            QuestionID = Common.QueryString.GetValue("QuestionID");
            ParentID = Common.QueryString.GetValue("ParentID");
            StuTaskID = Common.QueryString.GetValue("StuTaskID");
            //1：教师预览；2：总体预览；3：学生做题；4：错题重做；5：错题集
            AccessType = Common.QueryString.GetValue("AccessType");

            //设置参数  
            if (AccessType == 1 || AccessType == 2) {
                if (QuestionID == "undefined") {
                    alert("未获取到相应参数，不能获取题目内容！");
                    window.parent.backList();
                }
            }
            else if (AccessType == 3 || AccessType == 4) {
                if (QuestionID == "undefined" || StuTaskID == "undefined") {
                    alert("未获取到相应参数，不能获取作业题目信息！");
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
            obj = { QuestionID: QuestionID, StuTaskID: StuTaskID == "undefined" ? "" : StuTaskID, ParentID: ParentID };

            //获取题目信息
            $.post(Constant.SunnyTask + "TaskApi/Question/GetQuestionInfo", obj, function (data) {
                if (data.Success) {
                    ParentID = data.Data.ParentID;
                    //音频
                    window.parent.InitPlay(data.Data.Mp3Url);
                    //判断有无学生答案
                    if (AccessType == 3 && data.Data.StuAnswer != null) {
                        //判断学生是否上传图片
                        if (data.Data.StuAnswer.Answer != "") {
                            $(".shell").hide();
                            $("#p").hide();
                            $(".Y20").html('<img src="' + data.Data.StuAnswer.Answer + '" alt=""/>');
                        }
                    }
                    else {
                        //保存学生答案
                        if (AccessType == 3) {

                            //var spendtime = new Date().getTime() -startTime;
                            obj = {
                                StuScore: -1, SpendTime: 1, StuTaskID: StuTaskID, QuestionID: QuestionID, ParentID: ParentID
                            }
                            $.post("?action=SaveAnswer&rand=" + Math.random(), obj, function (data) {
                                data = eval("(" + data + ")");
                                if (data.Success) {

                                }
                                else {
                                    alert(data.Message);
                                }
                            });

                        }
                        else if (AccessType == 4) {
                            $.post("?action=SaveStuWrongQue&Rand=" + Math.random(), {
                                StuTaskID: StuTaskID, QuestionID: QuestionID, IsRight: 1, ParentID: ParentID
                            }, function (result) {
                                if (result) {
                                    result = eval("(" + result + ")");//JSON.parse
                                    if (result.Success) {

                                    } else {
                                        alert(result.Message);
                                    }
                                }
                                else {
                                    alert(result.Message);
                                }
                            });
                        }
                    }

                    //每个小题需要调用一次父页面的自动布局
                    resizeWindow();
                }
            });

        });

        function resizeWindow() {
            window.parent.autoSetPosition(0, 0);
            $('.Y').niceScroll({ touchbehavior: false, autohidemode: false, cursorcolor: "#dcdcdc", cursoropacitymax: 1, cursorwidth: 8 });
        }
    </script>
</html>
