//var userAccount;//用于存储用户登录信息
//var userPsw;
window.onload = function () {
    //var closeStr = '<header id="exitApp"><a class="exit">x</a></header>';
    var isPC = IsPC();
    var exitWin = $("body");
    if (isPC) {
        //exitWin.prepend(closeStr);
        $(".loginBox .set").css("display", "none");
    }
    else {
        //exitWin.find("#exitApp").remove();
        $(".loginBox .set").css("display", "block");
    }
    //登录页加载后清空浏览器localstotage,防止在pad上直接中断进程，再次进来时受影响
    window.localStorage.clear();
}

function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
    }
    return flag;
}
if (typeof WebViewJavascriptBridge != "undefined") {
    function getLoginSetting(settingData) {
        var dataStr = settingData.split(":");
        if (document.getElementById("txt_Account").value == "" && document.getElementById("txt_Password").value == "") {
            if (dataStr[0] != "" && dataStr[1] != "") {
                document.getElementById("txt_Account").value = dataStr[0];
                document.getElementById("txt_Password").value = dataStr[1];
                $("#btn_Login").click();
            }
        }
    }
};

$(function () {
    /*与OC交互的所有JS方法都要放在此处注册，才能调用，通过JS调用OC或者让OC调用这里的JS*/
    setupWebViewJavascriptBridge(function (bridge) {
        //alert("调用");
        //OC调用JS方法，用于js接收oc的callHandler，handler用一个key标记，可以注册多个handler
        bridge.registerHandler('recordMessageHandler', function (data) {
            var isSucced = data.success;
            if (isSucced) {
                var filepath = data.FilePath;
                alert(filepath);
            }
        })
    })
    $(".loginBtn").focus();
    var act = getCookie("clsaccount");
    var pswd = $("#pswd1").html();
    if (act != null && pswd != null) {
        document.getElementById("txt_Account").value = act;
        document.getElementById("txt_Password").value = pswd;
    }
});
function SaveAccount() {
    //var date = new Date('2018-05-31 23:59:59');
    //var date1 = new Date('2018-05-01 00:00:00');
    //var now = new Date();
    //if (now > date) {
    //    commonFuncJS.tipAlert("系统已过期");
    //    return false;
    //}
    //else if (now > date1) {
    //    commonFuncJS.tipAlert("系统即将到期");
    //}
    
    window.sessionStorage.clear();
    var account = document.getElementById("txt_Account").value;
    var data = account;
    if (typeof WebViewJavascriptBridge != "undefined") {
        window.WebViewJavascriptBridge.callHandler(
            'loginName '
            , data
            , function (responseData) {
            });
    }
    var passward = document.getElementById("txt_Password").value;
    if (!IsPC()) {
        window.sessionStorage.setItem("loginUserSet", account + ":" + passward);//记录传给移动端的账号密码
    }
    if (account == null || account.toString() == "") {
        commonFuncJS.tipAlert("账号不能为空");
        return false;
    }
    else if (passward == null || passward.toString() == "") {
        commonFuncJS.tipAlert("密码不能为空");
        return false;
    }
    var isTrue = teachLessonManage.CheckLoad(account, passward);
    if (isTrue == "-1") {
        commonFuncJS.tipAlert("账号不存在");
        return false;
    }
    else if (isTrue == "-2") {
        commonFuncJS.tipAlert("密码错误");
        return false;
    }
    else if (isTrue == "-3") {
        commonFuncJS.tipAlert("账号已停用");
        return false;
    }
    else if (isTrue == "-4") {
        commonFuncJS.tipAlert("请求失败");
        return false;
    }
    var serIp = Constant.room_Url;
    if (!IsPC()) {
        var data;
        data = window.sessionStorage.getItem("loginUserSet");
        data = data + ',' + serIp;
        if (typeof WebViewJavascriptBridge != "undefined") {
            window.WebViewJavascriptBridge.callHandler(
                'loginSet'
                , data
                , function (responseData) {
                });
        }
    }
};

function SaveUerInfo() {
    $("#loadingDiv").show();    //延迟  显示loading
    //alert("dsfds");
    var type = getDataF('type');
    if (type == 1) {
        setDataF('type', 0);
    }
    var account = document.getElementById("txt_Account").value;
    setDataF("UserAccount", account);
    var userInfo = $("#userInfo").html();
    var userInfoCls = JSON.parse(userInfo);
    setDataF("UserInfo", userInfoCls);
    //记录用户登录操作
    if (getCookie("t") == null || getCookie("t") == "") {
        writeCookie("t", userInfoCls.Name, 168);
        writeCookie("clsaccount", userInfoCls.Account, 168);
        writeCookie("clspassword", $("#pswd2").html(), 168);
        var ds = getCookie("t");
    }
    teachLessonManage.SaveOperData(userInfoCls.Id, userInfoCls.Type, Constant.OperType.Load_TYPE, '登录');
    window.location.href = "Index.aspx";
}

function writeCookie(name, value, hours) //name表示写入的变量，Value表示name变量的值，hours表示保存时间。
{
    var expire = "";
    if (hours != null) {
        expire = new Date((new Date()).getTime() + hours * 3600000);
        expire = "; expires=" + expire.toGMTString();
    }
    document.cookie = name + "=" + escape(value) + expire + ";path=/";
}
//用sessionStorage储存数据
function setDataF(key, value) {
    // 存储值：将对象转换为Json字符串 
    sessionStorage.setItem(key, JSON.stringify(value));
};
//用sessionStorage取数据
function getDataF(key) {
    // 取值时：把获取到的Json字符串转换回对象 
    var data = sessionStorage.getItem(key);
    //console.log(sessionStorage.getItem(key));
    var dataObj = JSON.parse(data);
    //console.log(dataObj.name); //输出
    return dataObj;
};
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
};
function setIpAndPort() {
    window.WebViewJavascriptBridge.callHandler(
        'setIpAndPort'
        , {}
        , function (responseData) {
            if (isSucced) {
            }
            else {
            }
        }
    );
};
//账号已登录提示
function WrongModal() {
    var t;
    var htmlStr = '<div class="wrongModal"><div class="alertBody">';
    htmlStr += '<p><i></i><label>账号已登录</label></p>';
    htmlStr += '</div></div>';
    htmlStr += '<div class="backdrop2"></div>';
    $("body").append(htmlStr);
    clearTimeout(t);
    t = setTimeout(function () {
        $(".wrongModal").next(".backdrop2").remove();
        $(".wrongModal").remove();
    }, 2500);//2秒后自动关闭
};
function setUrl(callback) {
    var htmlStr = '<div class="urlModal alertModal"><div class="alertBody">';
    htmlStr += '<h4>请输入服务器地址</h4>';
    htmlStr += '<p><input type="text" /></p>';
    htmlStr += '<div class="alertFooter"><a class="cancel">取消</a><a class="save">确定</a></div>';
    htmlStr += '</div></div>';
    htmlStr += '<div class="backdrop"></div>';
    $("body").append(htmlStr);
    $('.urlModal .save').on("click", function () {
        callback();
        $(this).parents(".urlModal").next().remove();
        $(this).parents(".urlModal").remove();
    });
    $(".urlModal .cancel").on("click", function (e) {
        //if (typeof (cancel) != "undefined") {
        //    cancel();
        //}
        $(this).parents(".urlModal").next().remove();
        $(this).parents(".urlModal").remove();
    })
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
