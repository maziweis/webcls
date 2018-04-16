$(function () {
        $("#npswd").focus(function () {
            $("html,body").animate({ scrollTop: 100 }, 200);
        })
        if (commonFuncJS.OS.isTablet && commonFuncJS.OS.isAndroid) {
            $("#npswd1").focus(function () {
                $("html,body").animate({ scrollTop:$("body").height() }, 200);
            })
        }
        else if (commonFuncJS.OS.isTablet && !commonFuncJS.OS.isAndroid) {
            $("#npswd1").focus(function () {
                $("html,body").animate({ scrollTop: 200 }, 200);
            })
        }
    $("#opswd").focus();
    userInfo = commonFuncJS.getDataF('UserInfo');
    $(document).keydown(function (e) {
        var keyCode = e.keyCode;
        switch (keyCode) {
            case 13: {	//enter
                e.preventDefault();
                ChangePswd();
                //$('.prev').click();
                break;
            }

        }
    });
    $("#newLoginBtn").click(function () {
        if (typeof WebViewJavascriptBridge != "undefined") {
            window.WebViewJavascriptBridge.callHandler(
                'Islogin '
                , "login"
                , function (responseData) {
                });
        }        
    })
});

$("#opswd").blur(function () {
    $("#opswd").parent().next().remove();
    var password = $("#opswd").val();
    if (password != "") {
        var account = userInfo.Account;
        var data = { account: account, password: password };
        $.ajax({
            type: "GET",
            url: Constant.webapi_Url + "CheckLogin/",
            data: data,
            dataType: "json",
            async: true,
            success: function (response) {
                if (response != 1) {
                    $("#opswd").parents("li").addClass("errorInput");
                    $("#opswd").parents("li").append("<span class=\"errorTip\">旧密码输入错误，请重新输入</span>");
                }
                else {
                    $("#opswd").parents("li").removeClass("errorInput");
                }
            },
            error: function (request, status, error) {
                //alert("请求失败！提示：" + status + error);
            }
        });
    }
    else {
        $("#opswd").parents("li").addClass("errorInput");
        $("#opswd").parents("li").append(" <span class=\"errorTip\">旧密码不能为空</span>");
    }
});
$("#npswd").blur(function () {
    $("#npswd").parent().next().remove();
    var password = $("#npswd").val();
    var password1 = $("#opswd").val();
    if (password == "") {
        $("#npswd").parents("li").addClass("errorInput");
        $("#npswd").parents("li").append("<span class=\"errorTip\">新密码不能为空</span>");
    }
    else {
        if (password == password1) {
            $("#npswd").parents("li").addClass("errorInput");
            $("#npswd").parents("li").append("<span class=\"errorTip\">新密码和旧密码不能相同</span>");
        }
        else if (password.length < 6 || password.length > 16) {
            $("#npswd").parents("li").addClass("errorInput");
            $("#npswd").parents("li").append("<span class=\"errorTip\">请输入6-16位新密码</span>");
        }
        else {
            $("#npswd").parents("li").removeClass("errorInput");
        }
    }
});
var userInfo;
function ChangePswd() {
    $(".updatePws li span.errorTip").remove(); 
    $(".updatePws li").removeClass("errorInput");
    var OldPasswd = $("#opswd").val();
    var NewPasswd = $("#npswd").val();
    var NewPasswd1 = $("#npswd1").val();
    if (OldPasswd == null || OldPasswd.toString() == "") {
        $("#opswd").parents("li").append(" <span class=\"errorTip\">旧密码不能为空</span>");
        $("#opswd").parents("li").addClass("errorInput");
        return false;
    }
    else if (typeof $("#opswd").parent().parent("li.errorInput")[0] != "undefined") {
        $("#opswd").parents("li").append("<span class=\"errorTip\">旧密码输入错误，请重新输入</span>");
        $("#opswd").parents("li").addClass("errorInput");
        return false;
    }
    if (NewPasswd == null || NewPasswd.toString() == "") {
        $("#npswd").parents("li").addClass("errorInput");
        $("#npswd").parents("li").append(" <span class=\"errorTip\">新密码不能为空</span>");
        return false;
    }
    else if (NewPasswd.length < 6 || NewPasswd.length > 16) {
        $("#npswd").parents("li").addClass("errorInput");
        $("#npswd").parents("li").append(" <span class=\"errorTip\">请输入6-16位新密码</span>");
        return false;
    }
    else if (NewPasswd == OldPasswd) {
        $("#npswd").parents("li").addClass("errorInput");
        $("#npswd").parents("li").append(" <span class=\"errorTip\">新密码和旧密码不能相同</span>");
        return false;
    }
    if (NewPasswd1 == null || NewPasswd1.toString() == "") {
        $("#npswd1").parents("li").addClass("errorInput");
        $("#npswd1").parents("li").append(" <span class=\"errorTip\">确认密码不能为空</span>");
        return false;
    }
    else if (NewPasswd != NewPasswd1) {
        $("#npswd1").parents("li").addClass("errorInput");
        $("#npswd1").parents("li").append(" <span class=\"errorTip\">两次输入密码不一致哦</span>");
        return false;
    }
    if (OldPasswd != "") {
        var data = { OldPasswd: OldPasswd, NewPasswd: NewPasswd };
        $.ajax({
            type: "POST",
            url: Constant.webapi_Url + "ChangePasswd/" + userInfo.Id,
            data: data,
            dataType: "json",
            async: true,
            success: function (response) {
                if (response == 200) {
                    $(".updatePws").hide();
                    $(".successTip").show();
                }
                else if (response == -1) {
                    $("#npswd1").parents("li").append("<span class=\"errorTip\">账号不存在</span>");
                }
                else if (response == 100) {
                    $("#opswd").parents("li").addClass("errorInput");
                    $("#opswd").parents("li").append("<span class=\"errorTip\">旧密码输入错误，请重新输入</span>");
                }
                else if (response == 400) {
                    $("#npswd1").parents("li").append("<span class=\"errorTip\">修改失败</span>");
                }
                else {
                    if (NewPasswd != "") {
                        $("#opswd").parents("li").addClass("errorInput");
                        $("#opswd").parents("li").append("<span class=\"errorTip\">旧密码输入错误，请重新输入</span>");
                    }
                    else {

                    }
                }
            },
            error: function (request, status, error) {
                //alert("请求失败！提示：" + status + error);
            }
        });

    }
}