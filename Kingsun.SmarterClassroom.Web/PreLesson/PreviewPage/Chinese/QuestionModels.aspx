<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="QuestionModels.aspx.cs" Inherits="SmarterClassroomWeb.PreLesson.PreviewPage.Chinese.QuestionModels" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>优作业——做题</title>
    <link rel="Shortcut Icon" href="../favicon.ico" />
    <link href="../../../App_Theme/css/base.css" rel="stylesheet" />
    <link href="../../../App_Theme/css/chinese.css" rel="stylesheet" />
    <script type="text/javascript" src="../../../CommonJs/jquery/jquery-1.11.2.min.js"></script>
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
            <div class="" id="divrecord" style="width: 1px; height: 1px; position: relative; z-index: 999; left: 400px; top: 250px">
            </div>
            <div class="box">
                <div class="topC">
                    <%--<a class="returnA" href="javascript:backList()">&nbsp;</a>--%>
<%--                    <a class="helpA" id="helpA" style="display:none" href="javascript:openHelpDialog()">&nbsp;</a>--%>
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
                    <div class="doll" style="display:none"></div>
                    <ul class="actUl">
                        <li class="li1" style="display:none">
                            <div class="mp3player" id="mp3player">
                            </div>
                        </li>
                        <li class="li2" style="display:none">
                            <a id="aSmall" title="回放"></a>
                            <div id="backplayer"></div>
                        </li>
                        <li class="li3" style="display:none">
                            <a id="aPlay" title="播放"></a>
                            <div id="ywplayer"></div>
                        </li>
                       <li class="li4" style="display:none" title="点击开始">
                            <%--<a id="aRecord" title="录音"></a>--%>
                           <div id="record"></div>
                        </li>
                        <li class="li5" style="display:none">
                            <a id="afinish" href="javascript:void(0)">完成录音</a>
                        </li>
                    </ul>
                    <div class="playing" style="display:none">
                        <p>录音中</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="../../../CommonJs/jquery/jquery.json-2.4.js"></script>
    <script type="text/javascript" src="../../../CommonJs/CommonDB/CommonDB.js"></script>
    <script type="text/javascript" src="../Js/Client.js"></script>
    <script src="../../../App_Theme/js/jplayer/jquery.jplayer.min.js"></script>
    <script type="text/javascript" src="../Js/KingsunMp3Player.js"></script>
    <script src="../Js/ChinesePlayer.js"></script>
    <script src="../../../App_Theme/js/KingRecord/swfobject.js"></script>
    <script src="../../../App_Theme/js/KingRecord/KingsunRecord.js"></script>
    <link href="../../../App_Theme/js/KingRecord/KingsunRecord.css" rel="stylesheet" />
    <script type="text/javascript" src="DoQuestion.js"></script>
    
</body>
</html>