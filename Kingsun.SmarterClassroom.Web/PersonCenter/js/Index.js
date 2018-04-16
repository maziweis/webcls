$(window).resize(function () {
    $(".centerMain").css("min-height", $(window).height() - $(".headTitle").height() - $(".footNumber").height() - 55);
})
$(function () {
    var isPC = function () {
        var userAgentInfo = navigator.userAgent;
        var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
        }
        return flag;
    }
    
    $(".centerMain").css("min-height", $(window).height() - $(".headTitle").height() - $(".footNumber").height() - 55);
    var userInfo = getDataF('UserInfo');
    $(".userTop h3 label").html(userInfo.Name);
    $(".userTop h3 b").html("(" + userInfo.Account + ")");
    if (isPC()) {
        $(".centerMain .versionLi,.glines").hide();
    }
    else {
        if (userInfo.Type === 26) {
            $(".helpLi,.glines").hide();
        }
    }
    $.ajax({
        type: "GET",
        url: Constant.webapi_Url + "GetSchool/",
        dataType: "json",
        async: true,
        success: function (response) {
            $(".userTop p").html(response.SchlName);
        },
        error: function (request, status, error) {
            //alert("请求失败！提示：" + status + error);
        }
    });
    //$(".userTop img").unbind("click");
    //$(".userTop img").on("touchstart.drag.founder", function () {
    //    $(".userTop").remove();
    //    if (typeof WebViewJavascriptBridge != "undefined") {

    //        var data = Constant.webapi_Url + "UploadAvatar/" + userInfo.Id;
    //        window.WebViewJavascriptBridge.callHandler(
    //            'upLoadPhoto'
    //            , data
    //            , function (responseData) {
    //                var isSucced = responseData.scuss;
    //            });
    //    }
    //    else {
    //        $(".userTop h3 label").html("2");
    //    }
    //});
    $(".exit").click(function () {
        commonFuncJS.openConfirm("是否退出账号？", function () {
            if (typeof WebViewJavascriptBridge != "undefined") {
                window.WebViewJavascriptBridge.callHandler(
                    'Islogin '
                    , "login"
                    , function (responseData) {
                    });
            }            
            window.location.href = "../../login.aspx";
        }, function () {
            return false;
        })
    });
    $.ajax({
        type: "GET",
        url: Constant.webapi_Url + "GetAvatarByIdTch/" + userInfo.Id,
        dataType: "json",
        async: true,
        success: function (response) {
            if (response != null) {
                $(".userTop img").attr("src", response + "?random=" + Math.random());
                $('#loadingDiv').hide();
            }
            else {
                $('#loadingDiv').hide();
            }

        },
        error: function (request, status, error) {
            $('#loadingDiv').hide();
            //alert("请求失败！提示：" + status + error);
        }
    });
    /*与OC交互的所有JS方法都要放在此处注册，才能调用，通过JS调用OC或者让OC调用这里的JS*/
    setupWebViewJavascriptBridge(function (bridge) {
        //alert("调用");
        //OC调用JS方法，用于js接收oc的callHandler，handler用一个key标记，可以注册多个handler
        bridge.registerHandler('recordMessageHandler', function (data) {
            var isSucced = data.success;
            if (isSucced) {
                var filepath = data.FilePath;
                //alert(filepath);
            }
        })
    });
    //新手指引
    $(".glines").on("click", function () {
        commonFuncJS.openGuidelines();
    })
});
function ChangePhoto() {
    var userInfo = getDataF('UserInfo');
    if (typeof WebViewJavascriptBridge != "undefined") {
        var data = Constant.webapi_Url + "UploadAvatar/" + userInfo.Id;
        window.WebViewJavascriptBridge.callHandler(
            'upLoadPhoto'
            , data
            , function (responseData) {
                var isSucced = responseData.scuss;
            });
    }
}
//用sessionStorage取数据
function getDataF(key) {
    // 取值时：把获取到的Json字符串转换回对象 
    var data = sessionStorage.getItem(key);
    //console.log(sessionStorage.getItem(key));
    var dataObj = JSON.parse(data);
    //console.log(dataObj.name); //输出
    return dataObj;
}
//用sessionStorage储存数据
function setDataF(key, value) {
    // 存储值：将对象转换为Json字符串 
    sessionStorage.setItem(key, JSON.stringify(value));
}
//平板上传头像回调这个方法
function getAvatarUrl(data) {
    var datau = JSON.parse(data);
    //setDataF("AvatarUrl", datau.FilePath);
    $(".userTop img").attr("src", datau.FilePath + "?random=" + Math.random());
};
function setupWebViewJavascriptBridge(callback) {
    /*安卓平台---------------------*/
    //如果桥接对象已经存在，则直接调用callback函数
    if (window.WebViewJavascriptBridge) {
        return callback(WebViewJavascriptBridge);
    }
    if (typeof WebViewJavascriptBridge != "undefined") {
        //否则，如果不存在，在安卓平台则添加一个监听器来执行callback函数
        document.addEventListener('WebViewJavascriptBridgeReady', function () {
            callback(WebViewJavascriptBridge)
        }, false)
        return;
    }
    //else {
    //    document.addEventListener('WebViewJavascriptBridgeReady', function () {
    //        callback(WebViewJavascriptBridge)
    //    }, false)
    //    return;
    //}
    /*IOS平台----------------------*/
    if (window.WVJBCallbacks) {
        return window.WVJBCallbacks.push(callback);
    }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function () { document.documentElement.removeChild(WVJBIframe) }, 0)
};