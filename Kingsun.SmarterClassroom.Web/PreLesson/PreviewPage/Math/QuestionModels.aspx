<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="QuestionModels.aspx.cs" Inherits="SmarterClassroomWeb.PreLesson.PreviewPage.Math.QuestionModels" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>优作业——做题</title>
    <link rel="Shortcut Icon" href="../favicon.ico" />
    <link href="../../../App_Theme/css/base.css" rel="stylesheet" />
    <link href="../../../App_Theme/css/math.css" rel="stylesheet" />
    <script src="../../../CommonJs/jquery/jquery-1.11.2.min.js"></script>
    <!--[if IE 6]>
    <script src="../App_Themes/js/DD_belatedPNG_0.0.8a-min.js"></script>
    <script>
      /* EXAMPLE */
      DD_belatedPNG.fix('.topC');
      DD_belatedPNG.fix('.topC a');
      DD_belatedPNG.fix('.btmC');
      DD_belatedPNG.fix('.btmC a.prevA');
      DD_belatedPNG.fix('.btmC a.nextA');
      DD_belatedPNG.fix('.btmC .titCont em');
      /* string argument can be any CSS selector */
      /* .png_bg example is unnecessary */
      /* change it to what suits you! */
    </script>
    <![endif]-->
</head>
<body class="template">
    <div class="wrap">
        <div class="main">
            <div class="box">
                <div class="topC">
                    <%--<a class="returnA" href="javascript:backList()">&nbsp;</a>--%>
                    <h2 class="topic" id="topicTitle"></h2>
                    <a id="submitA" class="submitA" style="display:none" href="javascript:submitTask()">提交</a>
                </div>
                <div class="centerC">
                    <div class="cont">
                        <iframe id="iframe1" name="iframe1" frameborder="0" scrolling="no" allowtransparency="true" style="border: 0; padding: 0; background-color: transparent; width: 100%; margin: 0 auto;min-height:426px;"></iframe>
                    
                    </div>
                </div>
                <div class="btmC">
                    <a id="prevA" class="prevA" style="display:none" href="javascript:prevQuestion()">上一题</a>
                    <a id="nextA" class="nextA" style="display:none" href="javascript:nextQuestion()">下一题</a>

                    <div class="solution" style="display:none">
                    </div>
                    <div class="judgeN" style="display:none">
                    </div>
                    <div class="titCont" style="display:none"></div>
                    <div class="titBox" style="display:none"><span></span></div>
                </div>
            </div>
        </div>
    </div>
    <script src="../../../CommonJs/jquery/jquery.json-2.4.js"></script>
    <script src="../../../CommonJs/CommonDB/CommonDB.js"></script>
    <script src="../Js/Client.js"></script>
    <script src="DoQuestion.js" charset="gbk" type="text/javascript"></script>
</body>
</html>
