//和后台交互功能,如录音和跨域交互功能
var checkStr = "";//软硬件检测结果
var recordSoundPath = "";//录制好的声音文件路径
var targetOrigin = "";//指向子域的地址，如：http://192.168.3.89:8072;
//var timer1;//录音定时器
var isRecording = false;//是否正在录音，状态值
var currentData; //检测权限时，资源传过来的数据

//判断是否加载了EXE外壳程序
var isDefined = true;
try {
    callHostFunction;//注册函数
} catch (e) {
    isDefined = false;
}

////////////////////////////////////////////////////////////postmessage跨域传递消息//////////////////////////////////////////////////////////////////
//监听跨域子窗传来的信息
window.addEventListener("message", messageHandler, true);

//消息句柄并判断来源
function messageHandler(e) {
    //targetOrigin = curSourceUrl;
    console.log(e.origin + "," + targetOrigin);
    if (e.origin == targetOrigin) {
        notify(e.data);
    } else {
        // 忽略从其它域来的消处
    }
}

//根据参数调用不同的方法
function notify(message) {
    //console.log(message);
    if (typeof message === 'object') {
        return;
    }
    var msgArr = message.split(':');
    var newArr = "";
    for (var i = 1; i < msgArr.length; i++) {
        newArr += msgArr[i] + ":";
    }
    newArr = newArr.substring(0, newArr.length - 1);//第一个冒号后面的字符串
    if (msgArr[0] == "getCheckState") {//获取软硬环境
        //数据结构
        //parameter = {"name": name,"zimu": word,"type": "en.pred.score","wordIndex": 1};
        console.log("一次检测++++++++");
        currentData = newArr;
        //checkState();//检测状态
        var state = checkState();//检测状态
        if (typeof callHostFunction != "undefined") {//在pc上打开角色扮演，传递消息给资源
            sendString("getCheckState#" + state);//返回值
        }
    }
    else if (msgArr[0] == "starting") {//调用录音函数  
        recording(msgArr[1]);
    }
    else if (msgArr[0] == "ending") {//调用结束录音函数  
        endRecording();
    }
    else if (msgArr[0] == "stopRecording") {//强制结束录音函数  
        exitRecord();
    }
    else if (msgArr[0] == "noticeMaxWin") {//最大化窗口  
        openMax();
    }
    else if (msgArr[0] == "noticeMinWin") {//最小化窗口  
        openMin();
    }
    else if (msgArr[0] == "Playback") { //调用回放
        console.log("教师端收到回放指令！");
        playRecord(newArr);
    }
    else if (msgArr[0] == "ChangeToolBar") {  //弹窗顶上的工具栏显隐
        ChangeToolBar(msgArr[1]);
    } else if (msgArr[0] == "stopPlayRecord") { //停止回放录音
        stopPlayRecord(msgArr[1]);
    } else if (msgArr[0] == "videoStart") { //开始播放视频
        VideoStart();
    }
}
//录音开始
function recording(message) {   
    console.log("准备录音，声音时长为：" + message);    
    var uploadPath = Constant.upload_file_Url;
    var soundSrc = "";
    //var dataS = "";
    if (browserRedirect()) {//移动端                
        //todo:调用移动设备的录音功能   
        isRecording = true;
        console.log("移动端调用了开始录音函数，准备录音！");
        //调用安卓平台的startRcord开始录音函数，此为一个无参数的函数
        window.WebViewJavascriptBridge.callHandler(
        'startRcord', {}, function (responseData) {
            //alert("调用移动端的开始录音函数");           
        });       
    }
    else {//PC端  
        isRecording = true;
        console.log("pc端调用了开始录音函数，准备录录音！");        
        callHostFunction.recordStart();//开始录音   
        //timer1 = setTimeout(function () {
        //    endRecording();
        //},1000);
    }
}

//向子域发送消息的函数
function sendString(s) {
    console.log("向子域发送消息的函数:"+s);
    var iframes = $("iframe[name='OpenAct']").get(0);//当前弹窗中的IFRAME对象
    //alert($(iframes).attr("name"));
    var thisFrameObj = iframes.contentWindow;//当前页面的iframe对象
    thisFrameObj.postMessage(s, targetOrigin);    
}

////////////////////////////////////////////////////////////和后台程序交互//////////////////////////////////////////////////////////////////
//检测软硬件环境，是否加载了EXE壳，麦克风是否准备好了	    
function checkState() {
    var state = "";//返回的json字符串
    var data = currentData; //旧的回传的是 "测试通讯" ,新的回传所有信息；
    if (data == "测试通讯") {
        data = "";
    } else {
        data = JSON.parse(data);
    };
    //data = { "name": "Unit1Lesson1say", "zimu": "In Photo 1, Sally was a baby.She was about two months old. She was small and cute.In Photo 2, Sally was one year old.Her hair was short and her eyes were big.In Photo 3, Sally was about six years old.She was a primary school student.Now Sally is 14 years old.She goes to junior high school.She is tall and pretty. Her hair is long.", "type": "en.pred.score", "wordIndex": 1 };
    //console.log(data);
    if (browserRedirect()) {//移动端           
        //移动端默认就有麦克风，无需检测，但要检测是否有录音权限        
        console.log("移动端调用了检测录音权限的函数！");
        window.WebViewJavascriptBridge.callHandler(
            'checkRcord', data ,
            function (responseData) {});
    }
    else {
        if (isDefined == true) {
            var isHasMicro = callHostFunction.existMicro(JSON.stringify(data));//检查麦克风状态,  data为所有信息
            if (isHasMicro) {
                state = 'hasMicro:true';
            }
            else {
                state = 'hasMicro:false';
            }
        }
        else {//未加载壳，也视为无麦克风支持
            state = 'hasMicro:false';
            commonFuncJS.openAlert('录音功能仅支持在客户端下使用!', ReSest);
        }        
    }
    console.log(state);
    return state;
}
//重置资源
function ReSest() {
    if ($("iframe[name='OpenAct']").eq(0).is(":visible")) {
        var jsonS = "reset";
        sendString("initially#" + jsonS);   //初始化状态
    }
    
}
//大小同屏,开始播放或者开始角色扮演时，顶部工具栏的显示
var playStyle = false;  //记录开始播放或者开始角色扮演的状态
function VideoStart() {
    var urlS = window.location.href;
    //判断是否在壳里向并且是教师端上课页面
    //flagT = "true";
    //console.log("flagT=======" + flagT);
    if (flagT == "true" && (urlS.indexOf("Teaching.aspx") != -1 || urlS.indexOf("TeachingTS.aspx") != -1)) {
        $(".newWin .aui_topT a").hide();
        $(".newWin .aui_retuen").show();
        playStyle = true;
        //console.log("我在测试~");
    } else {
        $(".newWin .aui_topT a").hide();
        $(".newWin .aui_retuen").show();
    }
}
//开始录音，参数为动画视频的总时长，传回值为录好的声音文件路径
//function startRecord(recordTims) {
//    //alert("资源ID为：" + curSourceGuiId);//从全局变量
//    var uploadPath = Constant.upload_file_Url;
//    var soundSrc = "";
//    if (browserRedirect()) {//移动端                
//        //todo:调用移动设备的录音功能   
//        isRecording = true;
//        //调用安卓平台的startRcord开始录音函数，此为一个无参数的函数
//        window.WebViewJavascriptBridge.callHandler(
//        'startRcord', function (responseData) {
//            //alert("调用移动端的开始录音函数");           
//        });
//        //timer1 = setTimeout(function () {
//        //    var userList = commonFuncJS.getDataF("UserInfo");
//        //    var userID = userList.Id;
//        //    //alert("用户ID为：\n\t" + userID + " \n\t资源ID为：\n\t" + curSourceGuiId);
//        //    mobieEndRecord(userID, curSourceGuiId, uploadPath);//调用结束录音函数
//        //    window.clearTimeout(timer1);//清除定时器
//        //}, recordTims);
//    }
//    else {//PC端        
//        if (isDefined == true) {
//            //当它开始时就调用后台的录音开始方法，要计算出动画的总时长，因为音频要和视频一致，才能保持字幕同步，所以需要强制结束录音方法
//            //alert("开始调用录音功能！录音时长为：" + recordTims);
//            var isHasMicro = callHostFunction.existMicro();//检查麦克风状态
//            if (isHasMicro) {
//                isRecording = true;
//                callHostFunction.recordStart();//开始录音    
//                //起动定时执行函数，在规定的时间内执行结束录音函数
//                //timer1 = setTimeout(function () {
//                //    var userList = commonFuncJS.getDataF("UserInfo");
//                //    var userID = userList.Id;
//                //    //alert("用户ID为：\n\t" + userID + " \n\t资源ID为：\n\t" + curSourceGuiId);
//                //    endRecord(userID, curSourceGuiId, uploadPath);//调用结束录音函数
//                //    window.clearTimeout(timer1);//清除定时器
//                //}, recordTims);
//            }
//            else {
//                isRecording = false;
//                openAlert("没有检查到麦克风，角色扮演功能不可使用！");
//                $(".alertModal").css({ "z-index": "2000" });
//            }
//        }
//        else {
//            isRecording = false;
//            openAlert('请在应用程序下使用录音功能！');
//            $(".alertModal").css({ "z-index": "2000" });
//            //endRecord();
//        }
//    }    
//}

//结束录音，这是正常的录音过程，非强制中断，需要返回结果
function endRecording() {    
    console.log("资源ID：" + curSourceGuiId);
    var uploadPath = Constant.upload_file_Url;
    console.log("上传路径：" + uploadPath);
    var userList = commonFuncJS.getDataF("UserInfo");
    var userID = userList.Id;
    console.log("用户ID：" + userID);
    if (browserRedirect()) {//移动端,录制完成，调用函数recordMessageHandler回传值给子域  
        console.log("移动端调用录音结束事件");
        //var JsonFile = { FileID: curSourceGuiId, ResourceStyle: 101, UserName: userID };        
        //JsonFile = JSON.stringify(JsonFile);
        //console.log("json字符串为：" + JsonFile);
        //var uploadUrl = uploadPath + "/" + userID + "/" + curSourceGuiId;
        //var uploadUrl = uploadPath + "?id=" + userID + "&userName=" + curSourceGuiId;
        //var uploadUrl = uploadPath + "?JsonFile=" + JsonFile;        
        var uploadUrl = {FilePath:uploadPath, FileID: curSourceGuiId, ResourceStyle: 101, UserName: userID};
        console.log("传入的路径为：" + uploadUrl);
        //调用移动端的结束录音函数，并返回是由安卓显示调用recordMessageHandler函数来回传地址的
        window.WebViewJavascriptBridge.callHandler(
            'stopRcord',
            uploadUrl,
            function (responseData) { });       
    }
    else {//pc端,录制完成，显式回传值给子域  
        console.log("pc端调用录音结束事件"); 
        callHostFunction.recordEnd(userID, curSourceGuiId, uploadPath);//结束录音,并返回值 
    }
    isRecording = false;
}
//获取录音地址
function cpGetLuyinPath(path) {
    //var filePath = "http://192.168.3.184:8099/kingsunFiles/SmartClassFile/92E0AF7A-4C21-456C-82E8-B27E51CC3EDB/82145173-a531-4471-917d-887912b5dd5d.mp3";
    console.log("录完了，声音为：" + path);
    if (path == "上传失败") {
        var jsonS = "";
        sendString("initially#" + jsonS);   //初始化状态
    } else {
        sendString("getBackSoundFile#" + path);//返回值
    }
}
//强制退出录音，无需返回结果
function exitRecord(val) {
    //参数为空为老版本调用方法，新版本传评测分数和评测成功状态
    if (val == "" || val == null)
    {
        console.log("调用强制退出录音");
        if (browserRedirect()) { //移动端       
            window.WebViewJavascriptBridge.callHandler(
                'stopRcord',
                "",
                function (responseData) { });
        }
        else {//PC端
            if (isDefined) {
                callHostFunction.recordStop();
            }
            
        }
    } else {
        //console.log(val);
        var data = JSON.parse(val);
        if (data.score) {
            console.log("分数：" + data.score);
            sendString("getBackScore#" + data.score);    //给子窗体传递分数
        } else if (data.error == "error") {
            console.log("评测有误！返回初始状态~");
            var jsonS = "";
            sendString("initially#" + jsonS);   //初始化状态
        } else if (data.submitRcord) {
            //$.submitSuccess();
        }
    }
}

//从windows获取测评分数
function cpgetScore(score) {
    //alert(score);
    sendString("getBackScore#" + score);    //给子窗体传递分数
}

//回放录音
function playRecord(index) { 
    //console.log("收到的wordIndex:" + index);
    var data = JSON.parse(index);   //带参wordIndex
    window.WebViewJavascriptBridge.callHandler(
        'playRecord'
        , data
        , function (responseData) {
            console.log("播放录音成功！");
        })
}

function stopPlayRecord(index) {
    var data;
    if (browserRedirect()) {    //移动端
        window.WebViewJavascriptBridge.callHandler(
            'stopPlayRecord'
            , data
            , function (responseData) {

            })
    }
}
    

//安卓回调的录音文件
function recordMessageHandler(filePath) {
    console.log("安卓端的回调，文件名为：" + filePath);
    var isUrl = checkURL(filePath);
    console.log("是否为URL：" + isUrl);
    if (isUrl) {
        console.log("声音文件地址：" + filePath);
        sendString("getBackSoundFile#" + filePath);//返回值 
    }
    else{
        console.log("安卓端的录音权限值：" + filePath);
        sendString("getCheckState#" + filePath);//通知UI        
}       
}
    
//获取录音后的声音文件路径
//回放录音，返回声音文件的绝对路径
function getSoundPath() {
    var soundFilePath = "";
    if (browserRedirect()) {
        //移动端
        //todo:调用移动设备的录音功能
        //alert("移动端");
    }
    else {
        //PC端
        soundFilePath = callHostFunction.recordPlay();//录好声音的文件
        //alert("获取录音文件并准备回传" + soundFilePath);
        backSoundFilePath();//返回声音文件路径给子窗体
    }
    isRecording = false;
}

//录音error通知子窗体资源初始化状态
function errorStyle() {
    var jsonS = "";
    sendString("initially#" + jsonS);
}


    //用于创建桥接对象的函数，兼容安卓和IOS平台，这段代码是固定的，必须要放到js中
    function setupWebViewJavascriptBridge(callback) {
        /*安卓平台---------------------*/
        //如果桥接对象已经存在，则直接调用callback函数
        if (window.WebViewJavascriptBridge) {
            return callback(WebViewJavascriptBridge);
        }
        if (checkPlatform() == 1) {
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
    }
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
        //添加js调用oc方法的测试按钮，也可以将js调用方法写在此函数的外面，如下所示：
        //window.WebViewJavascriptBridge.callHandler(
        //   'startRcord',//这是移动端注册的函数名称，在移动端端注册后，JS就可以直接通过这个handleName与移动进行交互。 
        //   data, //这是JSON字符串，传到移动端会被WebViewJavascriptBridge自动转换成id对象，然后在回调处看到的就是字典对象了。
        //   下面这就是个js函数名或匿名函数，在iOS端收到回调后，拿到了参数，然后通过闭包回调反馈给js端，这个反馈就是通过callback函数来传值给js。
        //   function (responseData) {
        //       var isSucced = responseData.scuss;
        //       if (isSucced) {/*调用成功的代码*/}else {/*调用失败的代码*/}
        //});
        //var callbackButton = document.getElementById('buttons').appendChild(document.createElement('button'))
        //callbackButton.innerHTML = 'Fire testObjcCallback'
        //callbackButton.onclick = function(e) {
        //    e.preventDefault()
        //    log('JS调用"testObjcCallback"')
        //    //调用桥接对象的callHandler方法给oc发消息，三个参数分别是关联的key，传值信息，以及oc对js的回调
        //    bridge.callHandler('testObjcCallback', {'foo': 'bar'}, function(response) {
        //        log('JS获得的回传值', response)
        //    })
        //}
    })
    ////////////////////////////////////////////////////////////跨域--父窗体调用子窗体的方法//////////////////////////////////////////////////////////////////
    //跨域访问子窗体中
    function exec_sub(funType, sourceFilePath) {
        var localUrl = window.location.href;
        var domainName = localUrl.split('/')[2];//本地域名     
        var crossOrigFilePath = domainName + "/PreLesson/Page&par=" + funType;//本地的跨域解析脚本文件(crossOriginAccess.html)的目录地址
        var temp = sourceFilePath.substr(0, sourceFilePath.lastIndexOf('/'));
        var sourceCrossOrigFilePath = temp + "/crossOriginAccess.html";//远程文件的跨域解析脚本文件(crossOriginAccess.html)的目录地址
        if (typeof (exec_obj) == 'undefined') {
            exec_obj = document.createElement('iframe');
            exec_obj.id = 'jsonframe';
            exec_obj.name = 'myframe';
            exec_obj.src = sourceCrossOrigFilePath + '?domainName=' + crossOrigFilePath + '&hostName=' + location.host;//参数para用于区分不同的函数
            exec_obj.style.display = 'none';
            document.body.appendChild(exec_obj);
        } else {
            if (funType == 3) {//回传录好的声音文件
                var oldUrl = exec_obj.src;
                oldUrl = oldUrl.substr(0, oldUrl.length - 1);
                var newUrl = oldUrl + funType + "&soundfile=" + recordSoundPath;
                exec_obj.src = newUrl;
            }
            if (funType == 4) {//回传录好的声音文件
                var oldUrl = exec_obj.src;
                oldUrl = oldUrl.substr(0, oldUrl.length - 1);
                var newUrl = oldUrl + funType + "&checkState=" + checkStr;
                exec_obj.src = newUrl;
            }
            else {
                exec_obj.src = sourceCrossOrigFilePath + '?' + Math.random() + '&domainName=' + crossOrigFilePath + '&hostName=' + location.host;
            }
        }
    }

    //父窗体通知子窗体最大化
    //function maxIframe() {
    //    exec_sub(0);
    //}
    //父窗体通知子窗体最小化
    //function minIframe() {
    //    exec_sub(1);
    //}

    //父窗体获取子域中配置文件
    function getConfigJson(sourceFilePath) {    
        exec_sub(2, sourceFilePath);
        curHtmlPath = sourceFilePath;    
    }
    //父窗体回传给子域录好的声音文件地址
    //function backSoundFilePath() {
    //    console.log("准备回传值给子窗体");
    //    exec_sub(3, curHtmlPath);
    //}
    //父窗体回传给子域软硬件检查结果
    function backState(checkStr) {
        console.log("准备回传值给子窗体" + checkStr);
        exec_sub(4,curHtmlPath);
    }
    ////////////////////////////////////////////////////////////跨域--子窗体调用父窗体的方法//////////////////////////////////////////////////////////////////

    //最大化打开
    function openMax() {
        //alert("执行最大化方法");
        d.config.isMaxWin = false;
        d.max();
    }
    //最小化打开
    function openMin() {
        //alert("执行最小化方法");
        d.config.isMaxWin = true;
        d.max();
    }
    //子窗体通知父窗体放大框架
    function soundRecord() {
        var iframe = document.getElementsByTagName("iframe")[0];
        iframe.style.width = "600px";
        iframe.style.height = "200px";
    }

    ////////////////////////////////////////////////////////////通用功能//////////////////////////////////////////////////////////////////
    //检测是否移动设备来访
    function browserRedirect() {
        var sUserAgent = navigator.userAgent.toLowerCase();
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        var bIsAndroid = sUserAgent.match(/android/i) == "android";
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
        if (bIsIpad || bIsAndroid || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsCE || bIsWM) {
            return true;
        } else {
            return false;
        }
    }
    //检测平台
    function checkPlatform() {
        var system =
        {
            win: false,
            mac: false,
            xll: false
        };
        //检测平台
        var p = navigator.platform;

        system.win = p.indexOf("Win") == 0;
        system.mac = p.indexOf("Mac") == 0;
        system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
        //跳转语句
        if (system.win || system.mac || system.xll) {
            //console.log("PC端");
            return 0;
        }
        else {
            if (navigator.userAgent.indexOf("Mac") < 0) {
                //console.log("安卓端");
                return 1;
            }
            else {
                //console.log("苹果端");
                return 2;
            }
        }
    }

    //判断url是否是合法http（s）
    function checkURL(URL) {
        var str = URL;
        //判断URL地址的正则表达式为:http(s)?://([\w-]+\.)+[\w-]+(/[\w- ./?%&=]*)?
        //下面的代码中应用了转义字符"\"输出一个字符"/"
        var Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
        var objExp = new RegExp(Expression);
        if (objExp.test(str) == true) {
            return true;
        } else {
            return false;
        }
    }