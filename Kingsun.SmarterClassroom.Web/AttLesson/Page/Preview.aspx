<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Preview.aspx.cs" Inherits="SmarterClassroomWeb.AttLesson.Page.Preview" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
		<meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
        <%--<link href="../../App_Theme/css/base.css" rel="stylesheet" />--%>
        <link href="../../App_Theme/css/page.css" rel="stylesheet" />
		<title>上课</title>
</head>
<body onselectstart="return false;">
    <header class="headTitle"><a class="goback fl" href="../../index.html"><i></i>返回</a>电子教材</header>
		<div class="content">
			<table class="selectTable">
				<tr>
					<td>教材选择</td>
					<td>年级：
						<div style="display: inline-block;">
					     <select class="rule-html-select" >
					     <option value="1">一年级</option>
                        </select></div>
					</td>
					<td>
						学科：
						<div style="display: inline-block;"><select class="rule-html-select" >
					     <option value="1">英语</option>
                        </select></div>
					</td>
					<td>
						版本：
						<div style="display: inline-block;"><select class="rule-html-select" >
					     <option value="1">人教PEP版</option>
                        </select></div>
					</td>
					<td>
						<span class="searchBox"><input type="text" placeholder="请输入关键词"/><a class="tc">搜索</a></span>
					</td>
				</tr>
			</table>
			<div class="searchList">
				<ul>
					<li><a href="../../catalog.html?book=2"><img src="../../App_Theme/images/cover1.png" alt="人教PEP五年级下册"><p>人教PEP五年级下册</p></a><em></em></li>
					<li class="add"><a></a><em></em></li>
				</ul>
                 <div class="clear"></div>
			</div>
		</div>
        <script src="../../App_Theme/js/jquery-1.10.2.min.js"></script>
        <script src="../../App_Theme/js/jquery.cookie.js"></script>
		<script type="text/javascript" src="../../fzcontrols/jquery.form.controls.js?skin=black"></script>
</body>
</html>
