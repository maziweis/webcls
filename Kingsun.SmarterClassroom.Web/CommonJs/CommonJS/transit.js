/**
 * Created by reamd on 2017-11-2.
 */
(function(){
    var _frameName = 'webViewShell';
    var _hostUrl = location.protocol + '//' + location.host; //webShell域名
    var _cHostUrl = ''; // 轻应用域名
    //var _defBackFlag = false; // 返回按钮是否自定义
    var _webJsBridge = {
        init: function () {

        },

        //读取资源配置
        getConfig: function (cbId, params) {
            /*var data = {
                "vision":"1.0",
                "title":"Let's study",
                "movMinWidth":1280,
                "movMinHeight":720,
                "moveRadio":"16:9",
                "type":"200",
                "isSend":false
            };*/
            getConfigData(params);
        },

        //获取录音权限
        recordAuthority: function(cbId, params){
            params.resourceName = getUrlParam("BookID") + oldRmbPage + curSourceGuiId; //数据重组，string 资源唯一标识（bookId+pageId+fileId）
            sClassJSBridge.call('recordAuthority',  //向上发送请求
                params,
                function (res) {
                    _execFun(cbId, res);    //向下传递数据
                })
        },

        //开始录音
        startRecord: function(cbId, params){
            sClassJSBridge.call('startRecord');
        },

        //正常结束录音
        endRecord: function(cbId, params){
            var uploadPath = Constant.upload_file_Url;
            var userList = commonFuncJS.getDataF("UserInfo");
            var userID = userList.Id;
            params = {
                host: uploadPath,               //string 服务器地址
                resourcerecord: curSourceGuiId, //string 资源hash
                resourceType: 101,              // number 文件类型
                userId: userID                  //string 用户id
            }

            sClassJSBridge.call('endRecord',
                params,
                function(res){
                    _execFun(cbId, res);
                }
            )
        },

        //强制结束录音
        stopRecord: function(cbId, params){
            sClassJSBridge.call('stopRecord')
        },

        //回放录音
        playRecording: function(cbId, params){
            sClassJSBridge.call('playRecording', params);
        },

        //停止回放录音
        stopPlayRecording: function(cbId, params){
            sClassJSBridge.call('stopPlayRecording', params);
        },

        //资源弹窗顶部工具条的显示
        showToolBar: function(cbId, params){
            ChangeToolBar();
        },

        //资源弹窗顶部工具条的隐藏
        hideToolBar: function(cbId, params){
            ChangeToolBar();
        },

        //初始化资源
        initially: function(cbId, params){
            var data = {
                //status:"goBack" || "reset" || ""    //string 初始化资源
                // goBack 回到上一个保存的页面（如电影片段）
                // reset 通知资源先调用ending事件，再重置资源页
                // "" 直接初始化资源
            }
            _execFun('initially',data);
        }
    }

    function _execFun(cbId, data) { // cbId：轻应用的回调方法id，data：webShell返回给js桥回调的数据
        if(window.frames[_frameName]) { //同源
            if(isNaN(parseInt(cbId))) {
                window.frames[_frameName].sClassJSBridge.common[cbId]();
            }else {
                window.frames[_frameName].sClassJSBridge.handleMessageFromXT(cbId, data);
            }
        }else {
            if(_cHostUrl === '') {
                _cHostUrl = $('iframe[name="OpenAct"]').attr('src').match(/https{0,1}:\/\/[^/]+/i)[0];
            }

            if(window.frames['OpenAct']) {
                window.frames['OpenAct'].postMessage({
                    cbId: cbId,
                    data: data
                }, _cHostUrl);
            }
        }
    }

    window.webJsBridge = _webJsBridge;

    window.addEventListener('message', function (e) {
        var obj = e.data;
        var fName = obj.fName;
        if (/_n/.test(fName)) {
            fName = fName.replace('_n', '');
        }
        if (window.frames['OpenAct']) { //创建的资源iframe name
            if(fName) {
                _cHostUrl = e.origin;
                _webJsBridge[fName](obj.cbId, obj.message);
            }
        } else if (window.frames['myframe']) {//访问crossOriginAccess.html的iframe name
            _webJsBridge[fName](obj.cbId, obj.message);
        }
    },false);
})();