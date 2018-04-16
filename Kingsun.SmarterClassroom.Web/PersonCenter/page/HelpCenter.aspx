<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="HelpCenter.aspx.cs" Inherits="SmarterClassroomWeb.PersonCenter.HelpCenter" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />   
    <link rel="stylesheet" href="../../App_Theme/css/page.css" />
    <title>帮助中心</title>
    <style type="text/css">
        body{background-color:#e2e6ef;}
    </style>
</head>
<body>
    <header class="headTitle"><a class="goback fl ifhide" id="btnBlack" href="../Index1.aspx"><i></i>返回</a><label>帮助中心</label></header>
    <div class="helpMain">
        <i class="backShadow"></i>
        <div class="QAList">
            <ul>
            </ul>
        </div>
    </div>
    <script type="text/javascript" src="../../App_Theme/js/jquery-1.10.2.min.js"></script>
    <script type="text/javascript" src="../js/HelpDB.js"></script>
    <script type="text/javascript">
        var helpDb = QAList;
        var openHelpWin;
        $(function () {
            loadData();
            $(".QAList").css("height", $(window).height() - $(".headTitle").height() - 60 - 40);
        })
        $(window).resize(function () {
            $(".QAList").css("height", $(window).height() - $(".headTitle").height() - 60 - 40);
        })

        var loadData = function () {
            var strHtml = '';
            $.each(helpDb, function (infoIndex, info) {
                strHtml += "<li data-id=\"" + info["id"] +"\" onclick=\"openHelpWin(this,"+infoIndex+")\" >";
                strHtml += "<i></i>";
                strHtml += "<label>" + (infoIndex+1) + "."+info["question"] + "</label>";
                strHtml += "</li>";
            });
            $(".QAList ul").append(strHtml);
        }
        openHelpWin = function (obj, index) {
            var num = index;
            var title = helpDb[index].question;
            var imgPath = helpDb[index].sourcePath;
            var content = helpDb[index].answer;
            var htmlStr = '<div class="helpModal"><h3 class="modalHead"><i></i>';
            htmlStr += '<label>' + (parseInt(index)+1) + '.' + title + '</label></h3>';
            htmlStr += '<div class="modalBody"><i></i>';
            if (imgPath) htmlStr += '<p>' + content + '<br /><img src="' + imgPath + '" />' + '</p></div>';
            else htmlStr += '<p>' + content + '</p></div>';
            htmlStr += '<div class="closeDiv"><a class="close"></a></div></div>';
            htmlStr += '<div class="helpBackdrop"></div>';
            $("body").append(htmlStr);
            $(".helpModal .modalBody p").css("height", $(".helpModal").height() - $(".modalHead").height() - $(".closeDiv").height() - 80);
            $('.helpModal .close').on("click", function () {
                $(this).parents(".helpModal").next(".helpBackdrop").remove();
                $(this).parents(".helpModal").remove();
            });
        }

    </script>
</body>
</html>
