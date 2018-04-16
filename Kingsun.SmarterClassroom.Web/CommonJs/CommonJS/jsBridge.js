(function() {
    if (window.sClassJSBridge) {
        return;
    }
    function getQuery (name) {
        var reg = new RegExp("(?:^|&)"+ name +"=([^&]*)(?:&|$)");
        var res = window.location.search.substr(1).match(reg);
        if(res !== null){
            return  decodeURIComponent(res[1]);
        }
        return null;
    }
    function getOS() {
        var userAgent = navigator.userAgent;
        return userAgent.match(/iphone|ipad|mac/i) ? 'ios' : userAgent.match(/Android/i) ? 'android' : '';
    }
    function isDesktopHub() {
        if(typeof callHostFunction !== "undefined"){//桌面端
            return true;
        }else{
            //pc web
            return false
        }
    }
    var callbacksCount = 1;
    var callbacks = {};
    var osFlag = getOS();

//用于创建桥接对象的函数，兼容安卓和IOS平台，这段代码是固定的，必须要放到js中
    function setupWebJSBridge(callback) {
        if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }

        //否则，如果不存在，在安卓平台则添加一个监听器来执行callback函数
        if (typeof WebViewJavascriptBridge !== "undefined") {
            document.addEventListener('WebViewJavascriptBridgeReady', function () {
                callback(WebViewJavascriptBridge)
            }, false)
            return;
        }

        if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
        window.WVJBCallbacks = [callback];
        var WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
    }
    setupWebJSBridge(function (bridge) {
        bridge.registerHandler('recordMessageHandler', function (data) {
            var isSucced = data.success;
            if (isSucced) {
                var filepath = data.FilePath;
                alert(filepath);
            }
        })
    })

    function _handleMessageFromSC(callbackId, message) {
        console.log('js桥结束:', callbackId, message)
        while (typeof message === 'string') {
            message = JSON.parse(message);
        }
        try {
            var callback = callbacks[callbackId];
            if (!callback) {
                return;
            }
            callback.apply(null, [message]);
        } catch (e) {
            alert(e)
        }
    }
    function _call(functionName, message, callback) {
        var functionName = functionName + '_n';
        var message = typeof message === 'undefined'? {} : message;
        var hasCallback = callback && typeof callback == "function";
        // var callbackId = hasCallback ? callbacksCount++ : 0;
        var callbackId = functionName;
        var callback = callback;
        if (hasCallback) {
            callbacks[functionName] = callback;
        }
        callback = typeof callback === 'function'? callback : function(){};
        message['cbId'] = callbackId;
        console.log('js桥开始:', functionName, message, window.name)
        if(osFlag === 'ios' && window.name !== 'OpenAct') { //移动端
            setupWebJSBridge(function(bridge) {
                bridge.callHandler(functionName, message, callback);
            })
        }else if(osFlag === 'android' && window.name !== 'OpenAct'){
            window.WebViewJavascriptBridge.callHandler(functionName, message, callback);
        }else if (isDesktopHub() && window.name !== 'OpenAct'){ //桌面端的js桥方法调用
            window.callHostFunction[functionName](JSON.stringify(message));
        }else { //web端的js桥方法调用
            var pHostUrl = getQuery('hostName');
            var cHostUrl = location.host;
            if(pHostUrl === cHostUrl) {//同源
                if(!(window.parent.webJsBridge && window.parent.webJsBridge)[functionName]) {
                    return;
                }
                window.parent.webJsBridge[functionName](callbackId, message);
                return;
            }else{
                window.parent.postMessage({
                    fName: functionName,
                    cbId: callbackId,
                    message: message
                }, '*');
                return;
            }
            return;
        }
    }
    function _registerHandle(functionName, callback) {
        if(osFlag === 'android'){
            window.WebViewJavascriptBridge.registerHandler(functionName, callback);
        }
    }

    var __sClassJSBridge = {
        call: _call,
        register: _registerHandle,
        handleMessage: _handleMessageFromSC,
        common: {
            back: function() {
                if(history.length > 1) {
                    history.go(-1);
                }
            },
            refresh: function () {
                location.reload();
            },
            initially: function(e){
                switch(e){
                    case 'goBack':
                        console.log('回到上一个保存的页面（如电影片段）!');
                        break;
                    case 'reset':
                        console.log('通知资源先调用ending事件，再重置资源页!');
                        break;
                    case '':
                        console.log('直接初始化资源');
                        break;
                    default:
                        break;
                }
            }
        }
    };

    window.sClassJSBridge = __sClassJSBridge;
    window.setupWebJSBridge = setupWebJSBridge;

    //web端js桥监听
    if (!((getOS() || isDesktopHub()) && window.name !== 'OpenAct')) {
        window.addEventListener('message', function(e) {
            var obj = e.data;
            if(obj.type === "webpackOk") {
                return;
            }
            if (typeof obj.cbId === 'undefined') {
                return;
            }
            if(!(/_n$/i.test(obj.cbId))) {
                __sClassJSBridge.common[obj.cbId](obj.data)
                return;
            }
            _handleMessageFromSC(obj.cbId, obj.data);
        },false);
    }
})()