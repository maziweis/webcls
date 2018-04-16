var classid = "";//班级ID
var schoolurl = "";//智慧校园地址
var schoolFileRrl = "";//智慧校园文件服务器地址
var classname = "";//班级名称
$(function () {
    $(".group1 .studentInfo").css("height", $(window).height() - $(".headTitle").height() - $(".studentGroup").height() - 85);
    $(".group2 .studentInfo").css("height", $(window).height() - $(".headTitle").height() - $(".studentGroup").height() - 5);
    $(".studentGroup .type1,.studentGroup .type2").on("click", function () {
        $(".comingSoon").hide();
        $(".group1").toggle();
        $(".group2").toggle();
    });
    $(".studentGroup .type1").on("click", function () {
        GetClassGroupInfo(classid, 0);
    });
    $(".group2 .studentGroup ul li").on("click", function () {
        $(this).parent().find("li").removeClass("on");
        $(this).addClass("on");
        $(".group2 .studentInfo").scrollTop(0);
        GetClassGroupInfo(classid, $(this)[0].id.split("g")[1]);
    })
    classid = getUrlParam("classid");
    classname = commonFuncJS.getDataF("classname");
    schoolurl = Constant.webapi_Url.split("/api")[0];
    schoolFileRrl = Constant.school_file_Url;
    $(".headTitle label").text(classname);
    //按分组查看
    //GetClassGroupInfo(classid, 0);

    //按班级查看
    $.ajax({
        type: "GET",
        url: Constant.webapi_Url + "GetStudents/" + classid,
        dataType: "json",
        async: true,
        success: function (response) {
            if (response != "") {
                $(".comingSoon").hide();
                var html = "";
                $.each(response, function (s, stu) {
                    if (stu.Avatar.indexOf('default') != -1) {
                        html += "<li stuAct=\"" + stu.Account + "\"><img src='" + schoolurl + stu.Avatar + "' /><br /><label title=" + stu.Name + ">" + stu.Name + "</label></li>";
                    }
                    else {
                        html += "<li stuAct=\"" + stu.Account + "\"><img src='" + schoolFileRrl + 'KingsunFiles/AvatarFile/' + stu.Avatar +'.jpg'+ "' /><br /><label title=" + stu.Name + ">" + stu.Name + "</label></li>";
                    }
                });
                $(".group1 .studentInfo ul").html(html);
            }
            else {
                $(".comingSoon").show();
            }
        },
        error: function (request, status, error) {
            //alert("请求失败！提示：" + status + error);
        }
    });
})
$(window).resize(function () {
    $(".group1 .studentInfo").css("height", $(window).height() - $(".headTitle").height() - $(".studentGroup").height() - 85);
    $(".group2 .studentInfo").css("height", $(window).height() - $(".headTitle").height() - $(".studentGroup").height() - 5);
})

function GetClassGroupInfo(ClassId, SubjectId) {
    $(".studentGroup ul li").removeClass("on");
    $(".studentGroup ul li[id=g"+SubjectId+"]").addClass("on");
    $(".group2 .studentInfo ul").html();
    $.ajax({
        type: "GET",
        url: Constant.webapi_Url + "GetClassGroupInfo?ClassId=" + ClassId + "&SubjectId=" + SubjectId,
        dataType: "json",
        async: true,
        success: function (response) {
            if (response.length == 0) {
                $(".group2 .studentInfo ul").html("");
                $(".comingSoon").show();
                return;
            }
            else {
                $(".comingSoon").hide();
                var html = "";
                $.each(response, function (i, item) {
                    if (item.LeaderUrl.indexOf('default') != -1) {
                        html += "<li stuid=\"" + item.GroupId + "\"><h3>" + item.GroupName + "</h3><dl><dt><span><img  src='" + schoolurl + item.LeaderUrl + "'/><i></i></span><br /><label title=" + item.LeaderName + ">" + item.LeaderName + "</label></dt><dd>";
                    } else {
                        html += "<li stuid=\"" + item.GroupId + "\"><h3>" + item.GroupName + "</h3><dl><dt><span><img  src='" + schoolFileRrl + 'KingsunFiles/AvatarFile/' + item.LeaderUrl + '.jpg' + "'/><i></i></span><br /><label title=" + item.LeaderName + ">" + item.LeaderName + "</label></dt><dd>";
                    }
                    $.each(item._ListStu, function (s, stu) {
                        if (stu.StuUrl.indexOf('default') != -1) {
                            html += "<span stuid=\"" + stu.StuId + "\"><img src='" + schoolurl + stu.StuUrl + "'/><br /><label title=" + stu.StuName + ">" + stu.StuName + "</label></span>";
                        }
                        else {
                            html += "<span stuid=\"" + stu.StuId + "\"><img src='" + schoolFileRrl + 'KingsunFiles/AvatarFile/' + stu.StuUrl + '.jpg' + "'/><br /><label title=" + stu.StuName + ">" + stu.StuName + "</label></span>";
                        }
                    });
                    html += "</dd></dl></li>";
                });
                $(".group2 .studentInfo ul").html(html);
            }
        },
        error: function (request, status, error) {
            //alert("请求失败！提示：" + status + error);
        }
    });
}

