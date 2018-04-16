$(function () {
    $(".classList").css("height", $(window).height() - $(".headTitle").height() - 120);
    var colorArr = ["#ffab68", "#f36b7e", "#89a7e6", "#10e0a4", "#3b5998", "#ff6239", "#5a78f0", "#0fc6c6", "#cfa972"];   
    var userInfo = commonFuncJS.getDataF('UserInfo');
    var html = "";
    if (userInfo.userClass != null && userInfo.userClass.length != 0) {
        $.each(userInfo.userClass, function (index, item) {            
            html += "<li " + "clasid=" + item.ClassId + "><a><h3><i></i><label>" + item.GradeName.split("年级")[0] + item.ClassName + "</label></h3><p>" + item.StuNum + "人</p></a></li>"
        });
    }
    $(".classList ul").html(html);
    if (html == "") {
        $(".comingSoon").show();
    }
    $(".classList ul li").unbind();
    $(".classList ul li").click(function () {
        var id = $(this).attr("clasid");
        var clsname = $(this).find("label").text();
        commonFuncJS.setDataF("classname", clsname);
        window.location.href = "ClassInfo.aspx?classid=" + id;
    });
    $(".classList ul li").each(function (index) {
        var num = index % colorArr.length;
        $(this).find("i").css("background-color", colorArr[num]);
    });
})
$(window).resize(function () {
    $(".classList").css("height", $(window).height() - $(".headTitle").height() - 120);
})