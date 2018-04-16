// JavaScript Document
var timeObjId = 1;
var timeObjId1 = 1;
var timeObjId2 = 1;
var firstPageId = 0;
var curPageItems = 0;//当前页中声音文件的数量
var isAll = 0;//全文朗读模式，0为关闭，1为打开
var timeS = 0;  //音频时长
var setT1;
var setT2;
var curPlayObj;
var srcString;
var configJson = [];//config.json中获取的配置数据
var curHtmlPath = "";//当前要打开的HTML5资源路径
var dataStr;    //config.json中的配置数据数据
var isPreLesson;
var curSourceUrl = "";//当前弹窗中的域名
var artFull;//全屏弹窗变量
var objectName; //子域获取的课件名称
var oldRmbPage = ""; //记录点击资源所在页码
var flagT = Common.QueryString.GetValue('DXTP');  //大小同屏时存Session为true；
var _resourceType;
(function () {
    var MFlag = false
    // 是否开启调试模式CTRL + M + 0
    window.addEventListener('keyup', function (e) {
        var keyCode = e.keyCode || e.which || e.charCode;
        if (keyCode === 77) {
            MFlag = false
        }
    })
    window.addEventListener('keydown', function (e) {
        var keyCode = e.keyCode || e.which || e.charCode;
        var ctrlKey = e.ctrlKey || e.metaKey;
        if (keyCode === 77) {
            MFlag = true
        }
        if (ctrlKey && MFlag && keyCode === 48) {
            var dom = document.createElement('script')
            dom.setAttribute('src', '../../App_Theme/js/vconsole.min.js')
            document.body.appendChild(dom)
        }
    })
}());
if (flagT == "true") {
    sessionStorage.setItem("flagT", flagT);
}
$.cachedScript('../../CommonJs/CommonJS/RecordFunc.js');//缓存加载js文件
//实时加载声音控件
$.cachedScript("../../App_Theme/js/audioControls.js");
var pptTitle; //PPT的title
//播放---单句的模式。
function playAudio(soundPath, obj) {
    SaveOperData($(obj).attr("filetype"), "点读");    //记录点击；
    curPlayObj = obj;
    pause();//暂停以前的声音
    //移除状态
    isAll = 0;
    //清除定时器 延时器
    clearInterval(timeObjId);
    clearInterval(timeObjId1);
    clearTimeout(setT1);
    $("a.readbox").css({ "border": "0px red solid" });
    if ($(obj).hasClass("on")) {
        $(obj).removeClass("on");
    } else {
        $(".readbox").removeClass("on");
        $(obj).addClass("on");
        //高亮当前句
        $(".audioDiv #mp3").attr("src", soundPath);
        var audio = document.getElementById("audio");
        $(obj).css({ "border": "2px red solid", "border-radius": "10px" });
        audio.load();
        audio.play();
        timeObjId = setInterval("checkSingleSndIsEnd()", 100);
    }
}
//检查声音是否播完
function checkSingleSndIsEnd() {
    var audio = document.getElementById("audio");
    if (audio.ended) {
        isAll = 0;
        //清除定时器 延时器
        clearInterval(timeObjId);
        clearInterval(timeObjId1);
        clearTimeout(setT1);
        $(curPlayObj).removeClass("on").css({ "border": "0px red solid" });
        audio.pause();
    }
}
////播放---单句的模式。
//var firstPlay = true; //第一次点读
//var oldPlayTime;    //上一次记录点读的时间节点
//var oldSoundPath;   //记录上次点读的音频路径
//function playAudio(soundPath, obj) {
//    SaveOperData($(obj).attr("filetype"), "点读");    //记录点击；
//    curPlayObj = obj;
//    $(".readbox").removeClass("on").css({ "border": "0px red solid" });
//    if (soundPath != oldSoundPath) {    //判断是否点击了不同点读
//        firstPlay = true;
//    }
//    var audio = document.getElementById("audio");
//    if (firstPlay) {    //第一次点读
//        clearInterval(timeObjId);
//        oldSoundPath = soundPath;
//        $(".audioDiv #mp3").attr("src", soundPath);
//        oldPlayTime = 0;
//        audio.load();
//        firstPlay = false;
//    }
//    if (audio.paused && soundPath == oldSoundPath) {
//        //console.log("开始播放！");
//        $(obj).addClass("on");
//        $(obj).css({ "border": "2px red solid", "border-radius": "10px" });
//        audio.currentTime = oldPlayTime;
//        audio.play();
//    } else {
//       //console.log("已经暂停！");
//        $(obj).css({ "border": "2px red solid", "border-radius": "10px" });
//        $(obj).removeClass("on").css("border-color", "#2a5ff5");
//        audio.pause();
//        clearInterval(timeObjId);
//        return false;
//    }
//    timeObjId = setInterval("checkSingleSndIsEnd()", 100);
//}

////检查声音是否播完
//function checkSingleSndIsEnd() {
//    var audio = document.getElementById("audio");
//    oldPlayTime = audio.currentTime;
//    //console.log(oldPlayTime);
//    if (audio.ended) {
//        isAll = 0;
//        //清除定时器 延时器
//        clearInterval(timeObjId);
//        clearInterval(timeObjId1);
//        clearTimeout(setT1);
//        $(curPlayObj).css({ "border": "0px red solid" });
//        audio.pause();
//        firstPlay = true;
//    }
//    if (audio.paused) {
//        clearInterval(timeObjId);
//    }
//}
//声音暂停
function pause() {
    var audio = document.getElementById("audio");
    if (audio) {
        audio.pause();
    }
}
//播放声音
function play(name) {
    playAudio(name);
}
var hidpageN = "";
//全文跟读
function allRead(obj) {
    if (clicktag == 0) {
        clicktag = 1;
        SaveOperData($(obj).attr("sourcetype"), "全文跟读");    //记录点击；
        hidpageN = $(obj).parent().attr("hidpage");
        var audio = document.getElementById("audio");
        audio.pause();
        $(".readbox").css("border", "0px red solid");
        //清除定时器 延时器
        clearInterval(timeObjId);
        clearInterval(timeObjId1);
        clearTimeout(setT1);
        if (isAll == 0) {
            playAudioForFullMode('1');
            currentPlayNum = 1;
            startFullPlayMode();
            isAll = 1;
        } else {
            isAll = 0;
        }
        setTimeout(function () {
            clicktag = 0;
        }, 500);
    }
}
//播放
function playAudioForFullMode(name) {
    //高亮当前句
    var n = parseInt(name);
    var curFilePath = "";
    if (n > 0) {
        curPageItems = 0;
        var indexN = 0;
        $("a.readbox[hidpage=" + hidpageN + "]").each(function (index, items) {
            var typeNum = $(items).attr("filetype");
            if (typeNum == 5) {
                //var curIndex = $("a.readbox").index($(this));
                if (n == indexN + 1) {
                    
                    $(this).css({ "border": "2px red solid", "border-radius": "10px" });
                    curFilePath = $(this).attr("soundStr");
                }
                else {
                    $(this).css({ "border": "0px red solid" });
                }
                indexN++;
                curPageItems++;
            }
            
        })
        //console.log(curPageItems);
    }
    $(".audioDiv #mp3").attr("src", curFilePath);
    var audio = document.getElementById("audio");

    audio.load();
    audio.play();
    //获取音频时长
    audio.ontimeupdate = function () {
        timeS = audio.duration;
    };
}

function startFullPlayMode() {
    timeObjId1 = setInterval("PerSecondListen()", 500);
    /*每1秒执行，并命名计时器名称为A*/
}

//---全文播放时，侦测单个声音是否播放完成。
function PerSecondListen() {
    var audio = document.getElementById("audio");
    if (audio.ended) {
        //---全部恢复黑色。
        $("a.readbox").each(function () {
            $(this).css({ "border": "0px red solid" });
        })
        audio.pause();
        //延迟跟读
        clearInterval(timeObjId1);
        setT1 = setTimeout(function () {
            startFullPlayMode();
            currentPlayNum++;
            if (currentPlayNum > curPageItems) {//当前页声音播放完毕...
                //清除定时器 
                isAll = 0;
                clearInterval(timeObjId1);
                
            }
            else {
                playAudioForFullMode(String(currentPlayNum));
            }
        }, timeS * 1000 * 1.2); //延迟时间段的120%
    }
}


//报听写
var numb;
var arrS;   //路径数组
var arrWord;    //重置路径数组
var arrTime = new Array;    //延迟播放时间数组;
function wordRead(obj) {
    isPlay = true; //每次触发报听写，开始为播放状态
    var s = $("a.readbox");
    //获取当前页报听写的单词点读
    var hidpageN = $(obj).parents(".doubleInbox").attr("hidpage");
    if (hidpageN) {
        s = $("a.readbox[hidpage=" + hidpageN + "]");
    }
    var ss = [];
    $.each(s, function (index, items) {
        if ($(items).attr("filetype") == 7) {
            ss.push($(items).attr("soundstr"));
        }
    })
    movWin1(ss, 8);
}
function movWin1(filePath, icoType) {
    SaveOperData(icoType, "报听写"); //记录点击；
    var dologW, dologH;
    dologW = 450; //dologH = 103;
    dologH = 132;
    var strContent = "";
    arrS = filePath;
    var length = filePath[0].lastIndexOf("/") + 1;
    var urlSt = srcString = filePath[0].substring(0, length);	//获取路径
    var wordNum;
    arrWord = new Array();
    arrTime = [];
    $.each(arrS, function (index, value) {
        if (index == 0) {
            arrWord.push("../../App_Theme/sounds/start01.mp3");
            arrTime.push("3");
            arrWord.push(arrS[index]);
            arrTime.push("3");
            arrWord.push(arrS[index]);
            arrTime.push("5");
        } else if (index == arrS.length - 1) {
            //console.log("我是最后一个!");
            arrWord.push(arrS[index]);
            arrTime.push("3");
            arrWord.push(arrS[index]);
            arrTime.push("0");      //最后一个不需要延长时间
        } else if (index % 2 == 0) {
            //偶数
            arrWord.push(arrS[index]);
            arrTime.push("3");
            arrWord.push(arrS[index]);
            arrTime.push("5");
        } else {
            //奇数
            arrWord.push(arrS[index]);
            arrTime.push("3");
            arrWord.push(arrS[index]);
            arrTime.push("5");
        }
    })
    //console.log(arrTime);
    wordNum = (arrWord.length - 1) / 2;
    numb = 0;
    if (icoType == 8) {
        strContent += '<div class="b_Close"><a class="closeA" href="javascript:void(0)" onclick="winClose()"></a></div>';
        //strContent += '<video id="videoPl" src="#" autoplay="true" controls="controls" width="' + dologW + '" height="' + dologH + '" style="display:none">您的浏览器不支持 video 标签。</video>';
        strContent += '<div class="audioPl" style="display:none"><audio id="audioPlay"><source src="#" type="audio/mpeg" id="mp3Pl"></source></audio></div>';
        strContent += '<div class="videoC">';
        strContent += ' <a class="btnA pause" href="javascript:void(0)" onclick="playOrPause1(this)">暂停</a><a class="closeA" href="javascript:void(0)" onclick="pauseFun()">停止</a><span><font class="numb">' + numb + '</font>/' + wordNum + '</span>';
        strContent += '</div>';
    }
    d = art.dialog({
        id: "Act",
        width: dologW,
        height: dologH,
        cancel: false,
        title: '',
        skin: 'baotin',
        padding: 0,
        border: 0,
        lock: true,
        background: '#000', // 背景色
        opacity: 0.8,	// 透明度
        content: strContent
    });
    $(".baotin").css({ "border": 0, "background-image": "url(\"../../App_Theme/images/btx_bg.png\")" });
    //$(".aui_outer").css("background", "none");
    $(".ui-dialog-content").css("background", "none");
    $(".videoC").css("background", "none");
    $(".b_Close a.closeA").css({ "width": "20px", "height": "20px", "display": "block", "position": "absolute", "right": "5px", "top": "5px", "background": "none", "background-image": "url(\"../../App_Theme/images/cloceA_bg.png\")", "border": "0", "border-radius": "0" });
    firstRead();//初始播放
    var audio = document.getElementById("audio");
    audio.pause();
    $("a.readbox").css({ "border": "0px red solid" });

   //st = setInterval("pause1()", 100);
}
//首次报听写播放事件
function firstRead() {
    var audio = document.getElementById("audioPlay");
    audio.pause();
    isAll = 0;
    //清除定时器 延时器
    clearInterval(timeObjId1);
    clearTimeout(setT1);
    playSingleAudioByIndex('0');
    currentPlayNum = 0;
    startFullPlayMode1();    
}
//播放当前指定序号的声音文件
function playSingleAudioByIndex(name) {
    //高亮当前句
    var n = parseInt(name);
    var curFilePath = "";    
    curFilePath = arrWord[n];
    $(".audioPl #mp3Pl").attr("src", curFilePath);
    var audio = document.getElementById("audioPlay");
    audio.load();
    audio.play();
}
//报听写暂停/播放按钮
var isPlay = true;//播放/暂停切换状态
var clicktag = 0;
var isGoOn = false;//是否是点击过暂停按钮
function playOrPause1(obj) {
    //使用全局变量clicktag，防止快速点击按钮;
    if (clicktag == 0) {
        clicktag = 1;
        var audio = document.getElementById("audioPlay");
        if (isPlay) {//暂停           
            isPlay = false;
            clearTimeout(setT2);
            clearInterval(timeObjId2);
            audio.pause();
            isGoOn = true;
            $(obj).removeClass("pause").addClass("play").html("播放");
            
        } else {//播放或继续播放   
            //console.log("监听，当前进度：" + numb + " 当前序号：" + currentPlayNum)
            isPlay = true; 
            clearTimeout(setT2);
            clearInterval(timeObjId2);
            if (isGoOn) {//如果是继续播放，将序号多加1
                if (currentPlayNum < arrWord.length - 1) {
                    currentPlayNum++;
                    numb++;
                } else {    //快速切换暂停播放至最后一个
                    pauseFun();
                }
                
            }
            playSingleAudioByIndex(currentPlayNum);
            if (numb < arrWord.length - 1) {
                if (numb % 2 == 0) {
                    $(".numb").html(numb / 2);
                } else {
                    $(".numb").html((numb / 2) + 0.5);
                }
            }
            //else if (numb > arrWord.length - 1) {
            //    console.log("numb:" + numb); 
            //    pauseFun();
            //}
            startFullPlayMode1();            
            $(obj).removeClass("play").addClass("pause").html("暂停");
            isGoOn = false;
        }
        setTimeout(function () {
            clicktag = 0;
        }, 500);
    }
}
//启动定时器连续播放事件
function startFullPlayMode1() {
    timeObjId2 = setInterval("secondListening()", 10);
}
//单个声音播放结束监听事件
function secondListening() {
    var audio = document.getElementById("audioPlay");
    if (audio) {
        if (audio.ended) {
            clearInterval(timeObjId2);
            audio.pause();
            setT2 = setTimeout(function () {
                startFullPlayMode1();
                if (currentPlayNum >= arrWord.length - 1) {//当前页声音播放完毕...                    
                    pauseFun();
                }
                else {
                    currentPlayNum++;
                    numb++;
                    //console.log("下一个页码序号：" + numb + " 下一个声音序号：" + currentPlayNum);
                    if (numb % 2 == 0) {
                        $(".numb").html(numb / 2);
                    } else {
                        $(".numb").html((numb / 2) + 0.5);
                    }
                    playSingleAudioByIndex(String(currentPlayNum));//调用下一个声音事件
                }
            }, parseInt(arrTime[currentPlayNum]) * 1000);
        } else {
            return false;
        }
    }
}
//停止事件
function pauseFun() {
    //clearInterval(st);   
    isPlay = false;
    currentPlayNum = 0;
    numb = 0;
    var audio = document.getElementById("audioPlay");
    if (audio) {
        audio.pause();
        $(".videoC .btnA").removeClass("pause").addClass("play").html("播放");
        $(".numb").html(numb);
    }
    clearTimeout(setT2);
    clearInterval(timeObjId2);
    //console.log("停止");
}
//esc退出窗体
function EscFun() {
    $(document).keyup(function (event) {
        if (event.keyCode == 27) {
            pauseFun();
            console.log("esc");
        }
    })
}
//关闭窗体
function winClose() {
    pauseFun();
    d.close();
}

//弹出音频控件
function showAudio(url) {
    switchSoundSrc(url);
}

//全屏fullscreen
//监控fullscreen
//各浏览器fullscreenchange 事件处理
//document.addEventListener('fullscreenchange', function () { fullscreenEnable() });
//document.addEventListener('webkitfullscreenchange', function () { fullscreenEnable() });
//document.addEventListener('mozfullscreenchange', function () { fullscreenEnable() });
//document.addEventListener('MSFullscreenChange', function () { fullscreenEnable() });
// 找到支持的方法, 使用需要全屏的 element 调用 
function launchFullScreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}
// 退出 fullscreen 
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozExitFullScreen) {
        document.mozExitFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}
//判断全屏状态
function fullscreenEnable() {
    var isFullscreen = document.fullscreenEnabled || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;
    //注意：要在用户授权全屏后才能准确获取当前的状态
    if (isFullscreen) {
        exitFullscreen();
        //console.log('全屏模式');
    } else {
        launchFullScreen(document.getElementById("sourceIfm"));
        //console.log('非全屏模式');
    }
}


/*动画对话框*/
var d;//弹窗对话框句柄,用于在函数外对对话框进行控制，如关闭对话框等等。
//类型          值
//动画          1
//教案          2
//习题课件      3
//音频          4
//PPT           5  
//word          6  
//excel         7  
//图片           8  
//试卷           9  

//解析域名
//用法：var domain=domainURI(document.location.href);
function domainURI(str) {
    var durl = /http:\/\/([^\/]+)\//i;
    domain = str.match(durl);
    return domain[1];
}

//删除一次弹出多个相同弹窗的问题
function delMoreDialog() {
    var list = art.dialog.list;    
    var n = 0;
    var index = 0;
    for (var i in list) {
        n++;
    };
    for (var i in list) {
        if (n > 1) {
            if (index < n - 1) {
                list[i].close();
            }
        }        
        index++;               
    }
}

//获取资源文件的域名
function getUrl(url) {
    var arrUrl = url.split("//");
    var start = arrUrl[1].indexOf("/");
    var relUrl = arrUrl[1].substring(0, start);//stop省略，截取从start开始到结尾的所有字符
    if (relUrl.indexOf("?") != -1) {
        relUrl = relUrl.split("?")[0];
    }
    relUrl = "http://" + relUrl;
    return relUrl;
}

function movWin(filePath, icoType, id) {
    //filePath = "http://192.168.3.89:8094/%E8%8B%B1%E8%AF%AD6%E7%A7%8D%E8%B5%84%E6%BA%90%E6%A1%86%E6%9E%B6/%E8%8B%B1%E8%AF%AD%E8%A7%92%E8%89%B2%E6%89%AE%E6%BC%94%E7%B1%BBH5%E8%B5%84%E6%BA%90%E6%A1%86%E6%9E%B6/Enjoy%20a%20story/Enjoy%20a%20story.html";//角色扮演类
    //filePath = "http://192.168.3.115:8922/js/Let's%20dub.html";//电影课角色扮演类
    //filePath = "http://192.168.3.115:8922/pd/index.html";////电影课片断类

    //filePath = 'http://192.168.3.116:3000/webview/read%20appraisal.html';   //todo
    //获取资源文件的域名
    var dologW, dologH; 
    dologW = 900; dologH = 506;
    //重置全文跟读
    pause();
    clearInterval(timeObjId1);
    clearTimeout(setT1);
    isAll = 0;
    //取消所有点读框选中
    $(".readbox").css("border", "0 solid red");
    var urlS = window.location.href;
    if (urlS.indexOf("PreLesson.aspx") != -1 || urlS.indexOf("PerLessonForJF.aspx") != -1 || urlS.indexOf("PerLessonForTS.aspx") != -1 || urlS.indexOf("PerLessonForTS2.aspx") != -1) {   //判断是否为备课
        isPreLesson = true;
    } else {
        isPreLesson = false;
    }  
    var fileSuffix = filePath.substr(filePath.lastIndexOf(".")).toLowerCase();//扩展名
    if (fileSuffix == ".html") { 
        var sourcedomain = getUrl(filePath);
        targetOrigin = sourcedomain; 
        curSourceUrl = "http://" + domainURI(filePath);//子域名
        getConfigJson(filePath);//向子域发送请求获取config.json配置文件信息,弹窗方式由子域调用
    }
    else if (fileSuffix == ".jpg" || fileSuffix == ".gif" || fileSuffix == ".png") {
        dologW = 800;
        dologH = 600;
        quickGetImgSize(filePath);        
    }
    else if (fileSuffix == ".mp3" || fileSuffix == ".wav") {
        showAudio(filePath);
    }
    else if (fileSuffix == ".mp4" || /*fileSuffix == ".wmv" ||*/ fileSuffix == ".3gp" || fileSuffix == ".rm" || fileSuffix == ".mvk" /*|| fileSuffix == ".swf" || fileSuffix == ".avi" || fileSuffix == ".rmvb"*/) {
        findDimensions();
        art.dialog.data('winH', winHeight);//将弹窗的高度传给子窗体，以用来最大化		
        art.dialog.data('winW', winWidth);//将弹窗的高度传给子窗体，以用来最大化
        if (isPreLesson) {
            strContent = '<video id="mp4Obj" src="' + filePath + '" autoplay="true" controls="controls" width="' + dologW + '" height="' + dologH + '" poster="../../App_Theme/images/dialog/poster.png">您的浏览器不支持 video 标签。</video>';
            art.dialog({
                id: "Act",
                width: dologW,
                height: dologH,
                skin: 'movWin',
                padding: 0,
                hasMaxBtn: false,
                isMaxWin: false,
                fixed: true,
                resize: false,
                padding: 0,
                content: strContent,
                lock: true,
                drag: false
            });            
        } else {
            var w = document.documentElement.clientWidth || document.body.clientWidth;//屏幕尺寸-宽
            var h = document.documentElement.clientHeight || document.body.clientHeight;//屏幕尺寸-高            
            var videoStr = '<video id="mp4Obj" src="' + filePath + '" autoplay="true" controls="controls" width="' + w + '" height="' + h + '" poster="../../App_Theme/images/dialog/poster.png">您的浏览器不支持 video 标签。</video>';  
            var html = '<div class="iframeWin"><div class="iframeClose"><a href="javascript:void(0)" onclick="closeIframeWin(this)">关闭</a></span></div>' + videoStr + '</div>';
            $(document.body).append(html);
            
            //strContent = '<video id="mp4Obj" src="' + filePath + '" autoplay="true" controls="controls" width="' + winWidth + '" height="' + winHeight + '" poster="../../App_Theme/images/dialog/poster.png">您的浏览器不支持 video 标签。</video>';
            //art.dialog({
            //    id:"Act",
            //    width: "auto",
            //    height: "auto",
            //    skin: 'movWin',
            //    padding: 0,
            //    hasMaxBtn: false,
            //    isMaxWin: true,
            //    fixed: true,
            //    resize: false,
            //    padding: 0,
            //    content: strContent,
            //    max: function () {
            //        var posW = $(".aui_outer").width();
            //        var posH = $(".aui_outer").height();
            //        videoFullScreen("mp4Obj", posW, posH);//自适应屏屏幕
            //    },
            //    lock: true,
            //    drag: false
            //});            
        };
    } else if (fileSuffix == ".wmv" && (browserRedirect() || typeof callHostFunction != "undefined")) {
        commonFuncJS.openAlert("不支持该文件预览，请前往电脑端查看");
    }else if (fileSuffix == ".ppt" || fileSuffix == ".pptx" || fileSuffix == ".zip" || fileSuffix == ".rar") {
        var urlS = window.location.href;
        if (urlS.indexOf("PreLesson.aspx") != -1 || urlS.indexOf("PerLessonFor") != -1) {   //判断是授课还是备课   //备课
            if (typeof callHostFunction != "undefined") {//电子白板打开
                var datep = new Date();
                var Year = datep.getFullYear();
                var Month = datep.getMonth()+1;
                var Date1 = datep.getDate();
                var time = Year + "-" + Month + "-" + Date1;  
                var str = id + fileSuffix;
                var UnitNamep = $("#unitFull").text();
                if (UnitNamep == "")
                    UnitNamep = "Unit"
                var obj = [];
                var pptFileName = pptTitle + "-" + UnitNamep + "-" + time;
                pptFileName = Common.ClearString(pptFileName);
                obj = { ID: id, fileUrl: filePath, FileName: pptFileName };
                var idstr = [];
                idstr.push(obj);
                var b = JSON.stringify(idstr);
                //弹出遮罩
                var strH = "";
                strH += '<div class="zz"><img scr="../../App_Theme/images/loading.gif"/></div>'
                $("body").append(strH);
                callHostFunction.downLoadFile(b);
                idstr = [];
            }
            else if (typeof WebViewJavascriptBridge != "undefined") {//安卓上框架内打开
                //调用安卓的后台代码
                var data = filePath;
                var data1 = data.split('\\');
                data = data1.join("?");
                window.WebViewJavascriptBridge.callHandler(
                    'downLoadFile'
                    , data
                    , function (responseData) {
                        var isSucced = responseData.scuss;
                        if (isSucced) {
                        }
                        else {
                    }
                });
            }
            else {//浏览器打开
                window.location.href = filePath;
            }
        }
        else {//授课    
            if (typeof callHostFunction != "undefined") {//电子白板打开
                console.log(JSON.stringify(officeFileInfo) + fileSuffix);
                $.each(officeFileInfo, function (index, item) {
                    if (item.ID == id) {
                        callHostFunction.openPPT(item.FileName + fileSuffix);
                    }                    
                });
            }
            else if (typeof WebViewJavascriptBridge != "undefined") {//安卓上框架内打开
                //调用安卓的后台代码
                var data = filePath;
                var data1 = data.split('\\');
                data = data1.join("?");
                window.WebViewJavascriptBridge.callHandler(
                    'downLoadFile'
                    , data
                    , function (responseData) {
                        var isSucced = responseData.scuss;
                        if (isSucced) {
                        }
                        else {
                    }
                });
            }
            else {//浏览器打开
                window.location.href = filePath;
            }
        }
    }
    else if (fileSuffix == ".xls" || fileSuffix == ".xlsx" || fileSuffix == ".doc" || fileSuffix == ".docx") {
        var urlS = window.location.href;
        if (typeof callHostFunction != "undefined" ) {//电子白板打开
            var datep = new Date();
            var Year = datep.getFullYear();
            var Month = datep.getMonth()+1;
            var Date1 = datep.getDate();
            var time = Year + "-" + Month + "-" + Date1;
            var str = id + fileSuffix;
            var UnitNamep = $("#unitFull").text();
            if (UnitNamep == "")
                UnitNamep = "Unit 1";
            var obj = [];
            var pptFileName = pptTitle + "-" + UnitNamep + "-" + time;
            pptFileName = Common.ClearString(pptFileName);
            obj = {
                ID: id, fileUrl: filePath, FileName: pptFileName
            };
            var idstr = [];
            idstr.push(obj);
            var b = JSON.stringify(idstr);
            //弹出遮罩
            var strH = "";
            strH += '<div class="zz"><img scr="../../App_Theme/images/loading.gif"/></div>'
            $("body").append(strH);
            callHostFunction.downLoadFile(b);
            idstr = [];
        }
        else if (typeof WebViewJavascriptBridge != "undefined") {//安卓上框架内打开
            //调用安卓的后台代码
            var data = filePath;
            var data1 = data.split('\\');
            data = data1.join("?");
            window.WebViewJavascriptBridge.callHandler(
                'downLoadFile'
            , data
            , function (responseData) {
                var isSucced = responseData.scuss;
                if (isSucced) {
                }
                else {
                }
            });
        }
        else {//浏览器打开
            window.location.href = filePath;
        }
    }
        //else {//授课    
        //    if (typeof callHostFunction != "undefined") {//电子白板打开
        //        console.log(JSON.stringify(officeFileInfo) +fileSuffix);
        //    $.each(officeFileInfo, function (index, item) {
        //        if (item.ID == id) {
        //            callHostFunction.openPPT(item.FileName +fileSuffix);
        //        }
        //});
        //}
        //else if (typeof WebViewJavascriptBridge != "undefined") {//安卓上框架内打开//调用安卓的后台代码
        //    var data = filePath;
        //        var data1 = data.split('\\');
        //    data = data1.join("?");
        //    window.WebViewJavascriptBridge.callHandler(
        //        'downLoadFile'
        //        , data
        //        , function (responseData) {
        //            var isSucced = responseData.scuss;
        //            if (isSucced) {
        //            }
        //            else {
        //        }
        //    });
        //        }
        //else {//浏览器打开
        //    window.location.href = filePath;
        //    }
        //    }
        //}
    else {
        window.location.href = filePath;
    }
};
//客户端下载完成后回调方法/////////////////////////////////////////////////////////////////////////////////////////////////////////////
function updateBtnState(para) {
    var urlS = window.location.href;//点击放映地址还是备课地址
    var param = para.split('[')[1].split(']')[0];
    var param1 = JSON.parse(param);
    if (urlS.indexOf("Teaching") == -1) {   //判断是授课还是备课   //备课
        //撤销遮罩
        $(".zz").remove();
        if (param1.Flag == 1) {
            callHostFunction.openPPT(param1.ID + param1.FileExtension);
        }
        else {
            //alert('打开失败，请联系管理员！');
        }
    }
    else {
        if (param1.FileExtension.toLowerCase().indexOf("ppt") == -1 && param1.FileExtension.toLowerCase().indexOf("zip") == -1 && param1.FileExtension.toLowerCase().indexOf("rar") == -1) {
            //撤销遮罩
            $(".zz").remove();
            if (param1.Flag == 1) {
                callHostFunction.openPPT(param1.ID + param1.FileExtension);
            }
            else {
                //alert('打开失败，请联系管理员！');
            }
        }
}
};
var title, minW, minH, radio, type,isSend;//当前弹出资源的配置数据
//资源文件回传配置信息并根据类型调用主框架的不同弹窗
function getConfigData(data) {
    //data = data.replace(/%20/g, " ");
    //console.log("解码前："+data);
    //data = unescape(data);
    if (typeof data === 'string') {
        data = decodeURIComponent(data);
        //console.log("解码后：" + data);

        var param = data.split(',');
        var nump = param.length;
        title = data.split('title:')[1].split(',minW:')[0];//课件标题
        minW = data.split('minW:')[1].split(',minH:')[0];//课件最小宽度
        minH = data.split(',minH:')[1].split(',radio:')[0];//课件最小高度
        radio = data.split(',radio:')[1].split(',type:')[0];//课件宽高比，如：16：9
        type = data.split(',type:')[1].split(',isSend:')[0];//课件图标类型  
        if (data.indexOf(",isSend:") != -1) {
            isSend = data.split(',isSend:')[1];
        }
    } else {
        title = data.title;//课件标题
        minW = data.minW;//课件最小宽度
        minH = data.minH;//课件最小高度
        radio = data.radio;//课件宽高比，如：16：9
        type = data.type;//课件图标类型  
        isSend = data.isSend;   
    }
    
    sessionStorage.setItem('resourceType', type);
    _resourceType = sessionStorage.getItem('resourceType');
    //console.log(title + ":" + minW + ":" + minH + ":" + radio + ":" + type + ":" + isSend);
    objectName = title;
    //根据类型参数调用不同的弹窗
    if (type == 1) {
        //角色扮演类  
        if (isPreLesson) {
            alertActiveSource(curHtmlPath);
        } else {
            alertActiveSourceFull(curHtmlPath);
        }
    }
    else if (type == 2) {
    }
    else if (type == 3) {//卡拉OK,歌曲歌谣类
        if (isPreLesson) {
            alertActiveSource(curHtmlPath);
        }
        else {
            alertActiveSourceFull(curHtmlPath);
        }
    } else if (type == 4) {
        if (isPreLesson) {
            arlDialogWin1(curHtmlPath);
        } else {
            arlDialogFullWin(curHtmlPath);
        }
    }
    else if (type == 5) {
        //互动课件（英）（固定尺寸大小H5资源）
        if (isPreLesson) {
            arlDialogWin(curHtmlPath);
        } else {
            arlDialogFullWin(curHtmlPath);
        }

    } else if (type == 6) {
        //互动课件（canvas能自适应的资源）
        if (isPreLesson) {
            arlDialogWin1(curHtmlPath);
        } else {
            arlDialogFullWin(curHtmlPath);
        }
    } 
    else if (type == 7) {        
        //自然拼读横向--互动课件（canvas资源）
        if (isPreLesson) {
            arlDialogWin1(curHtmlPath);
        } else {
            arlDialogFullWin(curHtmlPath);
        }
    }
    //else if (type == 8) {
    //    //自然拼读纵向--互动课件（canvas资源）
    //    if (isPreLesson) {
    //        arlDialogWin1(curHtmlPath);
    //    } else {
    //        arlDialogFullWin(curHtmlPath);
    //    }
        //}
    else if (type == 666) {
        //天骄特定测试资源，上课备课统一全屏
        arlDialogFullWin(curHtmlPath);
    }
    else if (type == 101 || type == 102 || type == 103 || type == 104 || type == 105 || type == 106 || type == 107 || type == 108) {
        //isSend = param[5].split(':')[1];//课件是否下发
        //新版newWin弹窗
        newDialogFullWin(curHtmlPath);
    } else if (type == 200) {
        newDialogFullWin(curHtmlPath);
    } else if(type == 110 || type == 111 || type == 112){
        newDialogFullWin(curHtmlPath);
    }else if (type == 113) {
        var tempData = null;
        if(typeof data === 'string'){
            tempData = JSON.stringify(JSON.parse(data).content.topicList);
        }else {
            tempData = JSON.stringify(data.content.topicList);
        }
        sessionStorage.setItem('coursewareData', tempData); //储存课件题干信息
        newDialogFullWin(curHtmlPath);
    }
}

//图片未加载前快速获取图片的尺寸
function quickGetImgSize(imgPath) {
    var maxWidth = 800;//图片容器最大宽度
    var maxHeight = 600;//图片容器最大高度
    // 记录当前时间戳
    var start_time = new Date().getTime(); 
    // 图片地址
    var img_url = imgPath + "?" + start_time;
    // 创建对象
    var img = new Image(); 
    // 改变图片的src
    img.src = img_url; 
    // 定时执行获取宽高
    var check = function () {
        // 只要任何一方大于0
        // 表示已经服务器已经返回宽高
        if (img.width > 0 || img.height > 0) {
            var diff = new Date().getTime() - start_time;
            var size = imgSize(img.width, img.height, maxWidth, maxHeight);
            //console.log('from:check :width:' + img.width + ',height:' + img.height + ', time:' + diff + 'ms');
            //console.log('from:Array :width:' + size[0] + ',height:' + size[1]);
            imageView(size[0], size[1], maxWidth, maxHeight, imgPath);
            clearInterval(set);
        }
    }; 
    var set = setInterval(check, 40);
}

//图片等比例预览
function imageView(imgWidth, imgHeight, boxWidth, boxHeight, filePath) {
    art.dialog({
        id: "Act",
        lock: true,
        drag: false,
        background: '#000', // 背景色
        opacity: 0.5,	// 透明度
        content: '<img src=' + filePath + ' alt="" style="width:' + imgWidth + 'px;height:' + imgHeight + 'px;box-shadow:0px 0px 5px 0px #666;background-color:#fff;"/>',
        skin: 'movWin',
        padding: 0,
        hasMaxBtn: false,
        isMaxWin: false,
        resize: false,
        width: boxWidth,
        height: boxHeight
    });    
}
//图片等比例自动缩放
function imgSize(originalW, originalH, maxW, maxH) {
    //以高度为参考进行缩放图片
    var finallyW, finallyH;
    var sizeArr = [];
    if (originalW > originalH) { //横向图片,以最大高度为基础
        if (maxW > originalW) {     //如果最大宽度小于maxW(800px),按原图大小显示;
            finallyW = originalW;
            finallyH = originalH;
        } else {
            finallyW = maxH * (originalW / originalH); //根据图片的宽高比计算出宽度  
            if (finallyW > maxW) {
                finallyW = maxW;//以最大宽度为准缩放
                finallyH = maxW * (originalH / originalW);//重新计算高度            
            }
            else {
                finallyH = maxH;
            }
        }
       
    }
    else {//纵向图片
        if (maxH > originalH) { //如果最大高度小于maxH(600px),按原图大小显示;
            finallyH = originalH;
            finallyW = originalW;
        } else {
            finallyH = maxH;
            finallyW = maxH * (originalW / originalH);
        }
        
    }
    sizeArr.push(finallyW);
    sizeArr.push(finallyH);
    return sizeArr;
}

//获取JSON文件中的JSON数组
function getJsonFile() {
    try {
        //ajaxSetup() 方法为将来的 AJAX 请求设置默认值。
        $.ajaxSetup({
            type: 'GET',
            dataType: 'jsonp',
            crossDomain: true,
            error: function (x, e) {
                $("#content").html("暂无具体内容！");
                return false;
            }
        });
        $.ajaxSettings.async = false; //同步请求
        $.getJSON(srcString, //路径
            function (data) {
                //成功获取后处理
                if (data != null) {
                    dataStr = data;
                    return dataStr;
                } else {
                    return false;
                }
            });
        $.ajaxSettings.async = true; //关闭同步请步
    } catch (ex) {
        $("#content").html("暂无具体内容！");
    }
}

//按固定比例修改资源的适应大小
function ChangeScale() {
    $(".movWin iframe").load(function () {
        var scaleS = 900 / 1280;
        $(this).attr("scrolling", "no");
        //通过transform来缩放页面
        $(this).contents().find("body").css({ "-webkit-transform": "scale(" + scaleS + ")", "-webkit-transform-origin": "0 0", "transform": "scale(" + scaleS + ")", "transform-origin": "0 0" });
    });
}

//视频动画自适应填充满屏，根据动画的宽高比和容器宽高度自动计算
function videoFullScreen(videoId, maxWidth, maxHeight) {
    var moveRadio = "16:9";
    var screenRadio = moveRadio.split(':')[0] / moveRadio.split(':')[1];//画面宽度比    
    if (maxWidth > maxHeight) {//横向    	
        var curMinWidth = maxHeight * screenRadio; //根据高度以宽高比来计算当前最小宽度   	
        //浏览器横向，都以高度为拉伸基础
        if (maxWidth >= curMinWidth) {//以高度为拉伸基础
            movHeight = maxHeight;
            movWidth = movHeight * screenRadio;
        }
        else {//以宽度为拉伸基础
            movWidth = maxWidth;
            movHeight = movWidth / screenRadio;
        }
    }
    else {
        //浏览器纵向或正方形，以宽度为拉伸基础      
        movWidth = maxWidth - 1;
        movHeight = movWidth / screenRadio;
    }
    $("#" + videoId).css({ "width": movWidth, "height": movHeight });//外壳宽度要同时调节   
    //调节垂直居中
    if (movHeight < maxHeight) {
        var vCenter = (maxHeight - movHeight) / 2;
        $("#" + videoId).css({ "top": vCenter });
    }
}

//判断页面是pc端打开
function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
    }
    return flag;
}

//通过ID获取资源的绝对地址
function GetPreviewUrl(id, FileType, url, callback) {
    var sendValues = { FileID: id, FileType: FileType, type: true };
    $.ajax({
        type: "POST",
        url: url,
        data: sendValues,
        dataType: "jsonp",
        async: false,
        success: function (response) {
            callback(response);
        },
        error: function (request, status, error) {
        }
    });
};

//如何用js判断文件是否存在  
function exists(filePath) {
    var result = -1;
    $.ajax({
        url: filePath,
        type: 'HEAD',
        async: false,
        complete: function (XMLHttpRequest, textStatus) {
            result = XMLHttpRequest.responseText.length;
        }
    });
    if (result != -1 && result != 0) {
        return 1;
    } else {
        return 0;
    }
};

////////////////////////////////////////////////////////////HTML资源的各类弹窗方法//////////////////////////////////////////////////////////////////
//角色扮演类H5资源弹窗           
//备课页
function alertActiveSource(sourcePath) { 
    findDimensions();
    var domain = domainURI(window.location.href) + "/PreLesson/Page";//本地的跨域解析脚本文件(crossOriginAccess.html)的目录地址  
    //参数domainName的地址指向本工程中跨域访问crossOriginAccess.html文件的访问路径，后面的两个参数为弹窗前整个屏幕的最大宽高度
    //debugger; 
    var url = sourcePath + "?domainName=" + domain + "&maxW=" + winWidth + "&maxH=" + winHeight + "&fullS=1";
    var dialogWidth, dialogHeight;
    if (browserRedirect()) {//移动端        
        dialogWidth = 917;
        dialogHeight = 567
    }
    else {//pc平台        
        dialogWidth = 917;
        if (isDefined) {//加壳
            dialogHeight = 628
        }
        else {
            dialogHeight = 571
        }        
    }
    d = art.dialog.open(url, {
        id: "Act",
        lock: true,
        drag: false,
        background: '#000', // 背景色
        opacity: 0.5,	// 透明度
        skin: 'movWin',
        resize: false,
        hasMaxBtn: false,
        isMaxWin: false,
        width: dialogWidth,
        close: function () {
            //监控关闭事件，检测是否正在录音
            if (isRecording) {               
                //openAlert('你正在录音，确定要退出？');
                //$(".alertModal").css({ "z-index": "2000" });
                exitRecord();
                isRecording = false;
            }               
        },        
        height: dialogHeight
    });    
}
//授课，放映页
function alertActiveSourceFull(sourcePath) {    
    findDimensions();
   // sourcePath = "http://192.168.3.108:8023/Learn%20the%20sounds.html";//静态测试链接,动画课件Learn the Sounds类    

    var domain = domainURI(window.location.href) + "/PreLesson/Page";//本地的跨域解析脚本文件(crossOriginAccess.html)的目录地址  
    //参数domainName的地址指向本工程中跨域访问crossOriginAccess.html文件的访问路径，后面的两个参数为弹窗前整个屏幕的最大宽高度
    //debugger;
    var url = sourcePath + "?domainName=" + domain + "&maxW=" + winWidth + "&maxH=" + winHeight;
    //console.log(url);
    var dialogWidth, dialogHeight;
    if (browserRedirect()) {//移动端   
        var raditio;//缩放比
        var w = document.documentElement.clientWidth || document.body.clientWidth;//屏幕尺寸-宽
        var h = document.documentElement.clientHeight || document.body.clientHeight;//屏幕尺寸-高    
        if (w == 1205 && h == 705) {//IMT的分辨率不是4：3比例，底部有模拟的工具栏占用屏幕高度，针对这种机型，将减去这个高度，才能满屏高显示，否则超出一屏的高度
            raditio = (w - 68) / minW;
        }
        else {
            raditio = w / minW;
        }     
        sourcePath = url + "&isfUll=" + raditio + "&winMaxH=" + h;
        //console.log("改动后的URL及参数：" + sourcePath);
        var html = '<div class="iframeWin"><div class="iframeClose"><a href="javascript:void(0)" onclick="closeIframeWin(this)">关闭</a></span></div><iframe name="OpenAct" src="' + sourcePath + '" class="iframewin"></iframe></div>';
        $(document.body).append(html);
    }
    else {//pc平台  
        $('body').css("overflow", "hidden");
        dialogWidth = 1017;
        if (isDefined) {//加壳
            dialogHeight = 628
        }
        else {
            dialogHeight = 632
        }
        d = art.dialog.open(url, {
            id: "Act",
            lock: true,
            drag: false,
            background: '#000', // 背景色
            opacity: 0.5,	// 透明度
            skin: 'movWin',
            resize: false,
            hasMaxBtn: false,
            isMaxWin: true,
            width: dialogWidth,
            height: dialogHeight,
            close: function () {
                $('body').css("overflow", "auto");
            }
        });
    }
}
//互动课件（固定尺寸大小H5资源）
function arlDialogWin(sourcePath) {   
    var domain = domainURI(window.location.href) + "/PreLesson/Page";//本地的跨域解析脚本文件(crossOriginAccess.html)的目录地址
    var url = sourcePath + "?isFull=1";   //带参isFull=1，缩放比例
    var dialogWidth, dialogHeight;
    if (browserRedirect()) {//移动端  
        //var dpi = window.devicePixelRatio;//获取屏幕分辨率
        //console.log("移动端分辨率sysWidth：" + sysWidth);
        //var width = sysWidth / dpi;//用系统返回宽度除以分辨率。
        //console.log("移动端分辨率：" + dpi + "  计算后的宽度为：" + width);
        dialogWidth = 917;
        dialogHeight = 502
    }
    else {//pc平台        
        dialogWidth = 917;
        if (isDefined) {//加壳
            dialogHeight = 502
        }
        else {
            dialogHeight = 506
        }
    }
    d = art.dialog.open(url, {
        id: "Act",
        lock: true,
        drag: false,
        background: '#000', // 背景色
        opacity: 0.5,	// 透明度
        skin: 'movWin',
        resize: false,
        hasMaxBtn: false,
        isMaxWin: false,
        width: dialogWidth,
        height: dialogHeight,
        init: function () { //artdialog加载后重新调整一下大小，防止资源无法获取正确的宽高
            $("iframe[name='OpenAct']").attr("style", "width: 0; height: 0; border: 0px none;");
            setTimeout(function () {
                $("iframe[name='OpenAct']").attr("style", "width: 100%; height: 100%; border: 0px none;");
            }, 50);
        }
    });
}
//互动课件  (canvas能自适应的资源)
function arlDialogWin1(sourcePath) {   
    //重置全文跟读
    pause();
    clearInterval(timeObjId1);
    clearTimeout(setT1);
    isAll = 0;
    //取消所有点读框选中
    $(".readbox").css("border", "0 solid red");
    if (typeof WebViewJavascriptBridge != "undefined" && $("#divExpandTypeForZRPD .cur").html() == "互动课件") {
        var data = 1;
        window.WebViewJavascriptBridge.callHandler(
            'setSoftMode'
            , data
            , function (responseData) {
                var isSucced = responseData.scuss;
            });
    }
    var domain = domainURI(window.location.href) + "/PreLesson/Page";//本地的跨域解析脚本文件(crossOriginAccess.html)的目录地址
    var url = sourcePath;
    var dialogWidth, dialogHeight;
    if (browserRedirect()) {//移动端        
        dialogWidth = 917;
        dialogHeight = 502
    }
    else {//pc平台        
        dialogWidth = 917;
        if (isDefined) {//加壳
            dialogHeight = 502
        }
        else {
            dialogHeight = 506
        }
    }
    setTimeout(function () {
    d = art.dialog.open(url, {
        id: "Act",
        lock: true,
        drag: false,
        background: '#000', // 背景色
        opacity: 0.5,	// 透明度
        skin: 'movWin',
        resize: false,
        hasMaxBtn: false,
        isMaxWin: false,
        width: dialogWidth,
        height: dialogHeight,
        init: function () { //artdialog加载后重新调整一下大小，防止资源无法获取正确的宽高
            $("iframe[name='OpenAct']").attr("style", "width: 0; height: 0; border: 0px none;");
            setTimeout(function () {
                $("iframe[name='OpenAct']").attr("style", "width: 100%; height: 100%; border: 0px none;");
            }, 50);
        }
    });
    }, 200);
    if (typeof WebViewJavascriptBridge != "undefined" && $("#divExpandTypeForZRPD .cur").html() == "互动课件") {
        closeAndrFunc();
    }
}
//调用安卓关闭软件加速
function closeAndrFunc() {
    $(".aui_close").unbind("click");
    $(".aui_close").click(function () {
        if (typeof WebViewJavascriptBridge != "undefined") {
            var data = 2;
            window.WebViewJavascriptBridge.callHandler(
                'setSoftMode'
                , data
                , function (responseData) {
                    var isSucced = responseData.scuss;
                });
        }
    })
}
function closeIframeWin(obj) {
    closeWinFun();

    var isiOS = (commonFuncJS.OS.isTablet && !commonFuncJS.OS.isAndroid) ? true : false;
    if (isiOS) {
        var data;
        window.WebViewJavascriptBridge.callHandler(
                'hideKeyboard'
                , data
                , function (responseData) {
                });
    }
    $(".iframeWin").remove();
}
//全屏显示
function arlDialogFullWin(sourcePath) {
    if (browserRedirect()) {//移动端
        openWinFun();
        //console.log("获取的参数：" + title + ":" + minW + ":" + minH + ":" + radio + ":" + type);
        var w = document.documentElement.clientWidth || document.body.clientWidth;//屏幕尺寸-宽
        var h = document.documentElement.clientHeight || document.body.clientHeight;//屏幕尺寸-高
        var raditio = w / minW;
        //alert("获取的最小宽度参数为：" + minW + "窗体宽度为：" + w + "缩放比为：" + raditio);
        sourcePath += "?isfUll=" + raditio+"&winMaxH="+h;
        var html = '<div class="iframeWin"><div class="iframeClose"><a href="javascript:void(0)" onclick="closeIframeWin(this)">关闭</a></span></div><iframe src="' + sourcePath + '" class="iframewin"></iframe></div>';
        $(document.body).append(html);

        $('.iframewin').css('height', h);

        //alert("iframe外部宽度：" + $(window).width()); //浏览器当前窗口可视区域宽度
    }
    else {
        var w = document.documentElement.clientWidth || document.body.clientWidth;//屏幕尺寸-宽
        var h = document.documentElement.clientHeight || document.body.clientHeight;//屏幕尺寸-高
        var raditio = w / minW;
        sourcePath += "?isfUll=" + raditio + "&winMaxH=" + h;
        artFull = art.dialog.open(sourcePath, {
            id: "Act",
            skin: 'movWin',
            hasMaxBtn: false,
            isMaxWin: true,
            width: "auto",
            height: "auto",
            fixed: true,
            resize: false,
            lock: true,
            drag: false,
            init: function () { //artdialog加载后重新调整一下大小，防止资源无法获取正确的宽高
                $("iframe[name='OpenAct']").attr("style", "width: 0; height: 0; border: 0px none;");
                setTimeout(function () {
                    $("iframe[name='OpenAct']").attr("style", "width: 100%; height: 100%; border: 0px none;");
                }, 50);
            }
        });
    }

}

//新版课件弹窗
function newDialogFullWin(sourcePath) {
    findDimensions();   //获取当前屏幕的宽高
    var domain = domainURI(window.location.href) + "/PreLesson/Page";//本地的跨域解析脚本文件(crossOriginAccess.html)的目录地址  
    //参数domainName的地址指向本工程中跨域访问crossOriginAccess.html文件的访问路径，后面的两个参数为弹窗前整个屏幕的最大宽高度
    var flag = typeof callHostFunction !== "undefined"
    var url = sourcePath + "?domainName=" + domain + "&maxW=" + winWidth + "&maxH=" + winHeight + '&hostName=' + location.host + '&isExeUserAgent=' + flag;
    var dialogWidth, dialogHeight;
    d = art.dialog.open(url, {
        id: "Act",
        skin: 'newWin',
        hasMaxBtn: false,
        isMaxWin: true,
        width: "auto",
        height: "auto",
        fixed: true,
        resize: false,
        lock: true,
        drag: false,
        close: function () {
            //监控关闭事件，检测是否正在录音
            if (isRecording) {
                exitRecord();
                isRecording = false;
            }
            /*******************************************/
            stopPlayRecord();   //关闭弹窗时停止回放
            //已下发，可查看提交情况
            if (sendStyle) {
            //显示提交情况和再次发送按钮
                $(".newWin .aui_topT a").hide();
                $(".newWin .aui_look").show();
                $(".newWin .aui_Resend").show();
            }
            $(".newWin .aui_topT").hide();//关闭newWin弹窗时，及时关闭样式，以免影响的其他类型弹窗
            $(".newWin .msgBox").remove();
            $(document).unbind("mousemove");
            clearTimeout(sTer);
        },
        init: function () {//artdialog加载后重新调整一下大小，防止资源无法获取正确的宽高
            $("iframe[name='OpenAct']").attr("style", "width: 0; height: 0; border: 0px none;");
            setTimeout(function () {
                $("iframe[name='OpenAct']").attr("style", "width: 100%; height: 100%; border: 0px none;");
            }, 50);

            $(".newWin .aui_topT h5.titleMsg").html(objectName);
            var urlS = window.location.href;
            //判断是否在壳里向并且是教师端上课页面
            flagT = sessionStorage.getItem("flagT");
            //flagT = "true"; //todo
            if (flagT == "true" && (urlS.indexOf("Teaching.aspx") != -1 || urlS.indexOf("TeachingTS.aspx") != -1)) {
                if (_resourceType == '113' || _resourceType == '110' || _resourceType == '112') {
                    $(".newWin .aui_topT a.aui_send").html("发送给学生");
                    $(".newWin .aui_topT a.aui_Resend").html("再次发送");
                    $(".newWin .aui_topT a.aui_look").html("提交情况");
                    $(".newWin .aui_topT a.aui_retuen").html("返回");
                }

                if (rmbFileID == curSourceGuiId && rmbPage == oldRmbPage) {
                    //如果是相同页面的相同资源，
                    $(".newWin .aui_topT a").hide();
                    if (sendStyle) {    //已经下发，创建学生信息结构并隐藏
                        if (_resourceType == '113') {
                            buildTemplate(MsgArr);
                        } else {
                            buildHtml(MsgArr);
                        }
                        if (_resourceType != '112') {   //下发无提交的资源
                            $(".newWin .aui_look").show();
                        }
                        $(".newWin .aui_Resend").show();
                        $(".newWin .msgBox").hide();
                    } else {
                        $(".newWin .aui_send").show();  //显示发送学生
                    }
                } else {  //不同资源或不同页面
                    $(".newWin .aui_topT a").hide();
                    $(".newWin .aui_send").show();  //显示发送学生
                }
                $(".newWin .aui_topT h5.titleMsg").html(objectName);
                $(".newWin .aui_topT").show();
            } else {
                $(".newWin .aui_topT").show();
                $(".newWin .aui_topT a").hide();
            }
            //isSend = "true";    //todo
            if (isSend == "false" || isSend == undefined || isSend === false) {   //无下发
                $(".newWin .aui_topT a").hide();    //隐藏所有按钮                
            }
            ActFn();    //三秒后隐藏

            //var _show_tool = document.querySelector('.newWin .show_tool');
            //var _aui_topT = document.querySelector('.newWin .aui_topT');

            //新增工具栏显隐方式
            //_show_tool.addEventListener('click', ChangeToolBar, false);

            //_aui_topT.addEventListener('mouseover', function () {
            //    clearTimeout(sTer);
            //    console.log('mouseover');
            //}, false);
            
            //_aui_topT.addEventListener('mouseout', function(){
            //    if (!$(".newWin .msgBox").is(':visible')) {
            //        console.log('mouseout');
            //        ActFn();
            //    }
            //}, false);
            //_aui_topT.addEventListener('touchstart', function () {
            //    clearTimeout(sTer);
            //    console.log('touchstart');
            //}, false);
            //_aui_topT.addEventListener('touchend', function(){
            //    if (!$(".newWin .msgBox").is(':visible')) {
            //        console.log('touchend');
            //        ActFn()
            //    }
            //}, false);
        }
    });
}

//function sss(){
//    console.log("触发了！");
//}

function ActFn() {
    sTer = setTimeout(function () {
        $(".newWin .aui_close").toggle();
        $(".newWin .aui_topT").toggle();
    }, sTime);
}

//下发课件给学生
var sendStyle = false;  //下发状态
var rmbFileID = ""; //当前记录的fileID
var rmbPage = "";   //当前记录的页码
var MsgArr = [];  //存放所有提交学生信息
var AllStuNum = 0;  //全班学生数量
var jsonB = []; //临时存放已提交学生信息
var clickFlog = false;  //定位页面是否进去学生查看
function SendMsg() {
    MsgArr = [];    //再次发送，存储数据置空
    sendStyle = true;
    rmbFileID = curSourceGuiId; //下发后赋值记录fileid
    rmbPage = oldRmbPage;
    $(".newWin .aui_topT a").hide();
    $(".newWin .aui_look").show();
    $(".newWin .aui_Resend").show();
    $(".newWin .msgBox").remove();  //再次推送，先清空学生结构
    //通知壳向学生端发送信息
    if (typeof callHostFunction != "undefined") {
        var dateId = new Date().getTime();
        //FileID - 文件ID;FileUrl-资源路径;Publish-唯一标识（时间戳）
        //curHtmlPath = curHtmlPath.replace("index", "studentIndex"); //studentIndex是教师端页面
        //curHtmlPath = "http://192.168.3.115:8922/js/studentIndex.html";
        //curHtmlPath = "http://192.168.3.36:8016/studentIndex.html";
        var nNum = curHtmlPath.lastIndexOf("/");    //取最后一个"/"的位置
        if (_resourceType != '113' && _resourceType != '112' && _resourceType != '110') {
            curHtmlPath = curHtmlPath.substring(0, nNum + 1) + "studentIndex.html"; //拼接下发地址
        }
        //curHtmlPath = 'http://192.168.3.116:3000/webview/read%20appraisal.html'   //todo
        //读取储存在对象中的数据
        if (curHtmlPath.indexOf("?") != -1) {
            var resData = { FileID: curSourceGuiId, FileUrl: curHtmlPath + "&student=true&FileID=" + curSourceGuiId, Publish: dateId };
        }
        else {
            var resData = { FileID: curSourceGuiId, FileUrl: curHtmlPath + "?student=true&FileID=" + curSourceGuiId, Publish: dateId };
        }
        callHostFunction.exchangeData(JSON.stringify(resData));
    };

    if (_resourceType == '110' || _resourceType == '112') {
        $(".newWin .aui_topT a").hide();
        $(".newWin .aui_Resend").show();
        return false;
    }
    if (_resourceType == '113') {  
        buildTemplate(MsgArr);
    } else {
        //创建学生信息结构并隐藏
        buildHtml(MsgArr);
    }
    $(".newWin .msgBox").hide();
    LookMsg();
}
//新版课件弹窗查看提交情况
function LookMsg() {
    clearTimeout(sTer);
    //查看详情时，应停止原本的播放事件
    var jsonS = "";
    //修改点击查看详情后的状态
    if (_resourceType != '113') {
        //sendString("endMov#" + jsonS);  //父窗体通知资源暂停
        sendString("initially#" + jsonS);  //父窗体通知资源初始化
        $(".newWin .aui_topT h5.titleMsg").html("Committed <b>" + MsgArr.length + "/" + AllStuNum + "</b>");
        $(".newWin .msgUl li a span img.img").width($(".newWin .msgUl li a").width());
    }
    $(".newWin .msgBox").show();
    $(".newWin .aui_topT a").hide();
    $(".newWin .aui_topT a.aui_retuen").show();
}

function buildTemplate(arr) {
    var _arr = arr;
    function getStudentsInfo(cb) {
        var url = Constant.webapi_Url + "GetStudents/" + getUrlParam("ClassID");
        //console.log(url);
        $.ajax({
            type: "GET",
            url: url,
            data: {},
            async: false,
            success: function (res) {
                cb(null, res);
            },
            error: function (err) {
                cb(err);
            }
        });
    }
    function insertScript(url, cb) {
        var script = document.createElement('script');
        script.setAttribute('src', url);
        script.setAttribute('type', 'text/javascript');
        script.onload = script.onreadystatechange = function() {
            if (!this.readyState || /loaded|complete/.test(this.readyState)) {
                if(typeof cb === 'function'){cb();}
            }
            script.onload = script.onreadystatechange = null;
        }

        var divDom =  document.createElement('div');
        divDom.setAttribute('class', 'msgBox');
        //divDom.setAttribute('style', 'z-index:1;width:100%;height:100%;background-color:#fff;position:fixed;top:0;left:0;');
        $(".newWin .aui_state_full").append(divDom);
        //document.body.appendChild(divDom);
        document.body.appendChild(script);
    }

    insertScript('../../App_Theme/dialog/template/lib/detach.min.js', function () {
        /*set up template*/
        Detach.init({
            name: 'item',
            container: document.querySelector('.msgBox'), // default document.body
            data: {},
            tpl: '../../App_Theme/dialog/template/tpl.html',
            controller: function (scope) { // default nop function
//                console.log('router controller exec!');
            },
            onReady: function () {
                Detach.router.push({ name: 'item' });
                Detach.sub('completeJS', function () {
                    Detach.pub('coursewareData', JSON.parse(sessionStorage.getItem('coursewareData'))); //读取config.json
                    getStudentsInfo(function (err, res) {
                        if (err) {
                            console.log('get studentsInfo failed')
                        } else {
                            Detach.pub('studentsInfo', res);
                        }
                    })
                    //待续
                    if (_arr.length > 0) {
                        _arr.forEach(function (item,index) {
                            Detach.pub('studentAnswer', item);
                        })
                    }
                })
            }
        });
    })

}

//组装提交详情的结构
function buildHtml(value) {
    var value = value;
    var data = "";
    AllStuNum = 0;
    jsonB = [];
    //调接口根据classid取所有学生信息
    //var url = "http://192.168.3.187:6012/api/GetStudents/1";
    var url = Constant.webapi_Url + "GetStudents/" + getUrlParam("ClassID");
    //console.log(url);
    $.ajax({
        type: "GET",
        url: url,
        data: data,
        async: false,
        success: function (response) {
            data = response;    // 获取全班学生信息
            
        },
            error: function () {
        }
    });
    var htmlStr = '';
    var stuName;
    var score = "";  //分数
    var imgUrl;     //头像地址
    htmlStr += '<div class="msgBox">';
    htmlStr += '    <ul class="msgUl">';
    //遍历学生数据
    $(data).each(function (index, item) {
        //学生头像地址 - Constant.webapi_Url.split("/api")[0] + data[0].Avatar
        if (item.Avatar.indexOf('default') != -1) {
            imgUrl = Constant.webapi_Url.split("/api")[0] + item.Avatar;
        } else {
            imgUrl = Constant.school_file_Url + 'KingsunFiles/AvatarFile/' + item.Avatar + '.jpg';
        }
        stuName = item.Name;
        htmlStr += '        <li class="gray" userid = "' + item.UserID + '">';
        htmlStr += '            <a href="javascript:void(0)">';
        htmlStr += '                <img src="' + imgUrl + '"/>';
        htmlStr += '                <b>' + stuName + '</b>';
        htmlStr += '                <span><img class="img" src="../../App_Theme/images/newWin/starImg.png" alt="分数评星"/></span>';
        htmlStr += '            </a>';
        htmlStr += '        </li>';
        AllStuNum++;
    })
    //htmlStr += '    <li><a href="javascript:void(0)" onclick="dianliangStu()">点亮</a></li>';
    htmlStr += '    </ul>';
    htmlStr += '</div>';
    $(".newWin .aui_state_full").append(htmlStr);

    //监控页面不同宽度时，保持等比显示
    $(window).resize(function () {
        if ($(".newWin .msgUl li a span img.img")) {
            $(".newWin .msgUl li a span img.img").width($(".newWin .msgUl li a").width());  //给图片a标签的宽度
        }
    })
    //退出提交情况页面，再次进去时先判断储存情况，再遍历生成结构
    if (value.length > 0) {
        //修改点击查看详情后的状态
        $(".newWin .aui_topT h5.titleMsg").html("Committed <b>" + value.length + "/" + $(data).length + "</b>");
        var _obj;
        for (var i = 0; i < value.length; i++) {
            //找到对应的学生id，添加样式，绑定点击事件
            //console.log("userID:" + value[i].userID);
            _obj = $(".newWin .msgUl li[userid=" + value[i].userID + "]");
            var averageS = (function () {//取平均分
                var scoreS = 0;
                for (var n = 0; n < value[i].data.length; n++) {
                    scoreS += parseInt(value[i].data[n].score);
                }
                scoreS = scoreS / n;
                return scoreS;
            })();
            //console.log("平均分:"+averageS);
            averageS = Math.round(averageS);
            var scoreColor = numberSwitchColor(averageS);   //分数等级显示的颜色
            var newHtml = '<img src = "../../App_Theme/images/ku.png" alt="哭脸" style="height:80%;"/>';
            if (type == 101) {    //电影课角色扮演   星星显示分数
                if (averageS == 0) {
                    _obj.find("span").css({ "width": "100%", "text-align": "center" }).html(newHtml);
                } else {
                _obj.find("span").css("width", "" +averageS + "%");
                }
            } else {    //其他用数字显示分数
                if (averageS == 0) {
                    _obj.find("span").css({ "width": "100%", "text-align": "center" }).html(newHtml);
                } else {
                    _obj.find("span").css({ "width": "100%", "text-align": "center", "color": "" + scoreColor + "" }).html("" + averageS + "");
                }
            }

            jsonB.push(value[i]);   //遍历MsgArr赋值追加到jsonB
            _obj.removeClass("gray").on("click", function () {
                var indexN = $(".newWin .msgUl li").index(this);
                $(".newWin .msgBox").hide();
                console.log(JSON.stringify(jsonB[indexN]));
                sendString("playRecording#" + JSON.stringify(jsonB[indexN])); //传参给子窗体资源，播放录音
                $(".newWin .aui_topT h5.titleMsg").html(_obj.find("b").html());
                $(".newWin .aui_topT a").hide();
                $(".newWin .aui_retuen").show();
                clickFlog = true;
                ActFn();   //三秒后隐藏
            })
            $(".newWin .msgUl li").eq(i).before(_obj.clone(true));
            _obj.remove();
        }
    }
}

//在提交页面 连续查看学生两次信息 资源页会覆盖上次记录？解
//新版课返回
function ReturnAct(obj) {
    /*******************************************/
    stopPlayRecord();   //在回放学生录音时，点击back 停止回放
    if (clickFlog) {
        var jsonS = "goBack"; //跳转初始页面
        sendString("initially#" + jsonS);  //父窗体通知资源初始化
        $(".newWin .msgBox").show();
        clearTimeout(sTer);
        $(".newWin .aui_topT a").hide();
        $(".newWin .aui_retuen").show();
        $(".newWin .aui_topT h5.titleMsg").html("Committed <b>" +MsgArr.length + "/" +AllStuNum + "</b>");//替换title
        clickFlog = false;
    }
    else {
        var jsonS = "";
        if (_resourceType != '113') {
            sendString("initially#" + jsonS);  //父窗体通知资源初始化
        } else {
            if ($('.msgBox .dialog').hasClass('active')) {
                $('.msgBox .dialog').removeClass('active');
                return;
            }
        }
        if ($(".newWin .msgBox").is(":visible")) {
            $(".newWin .msgBox").hide();
            $(".newWin .aui_topT a").hide();
            $(".newWin .aui_look").show();
            $(".newWin .aui_Resend").show();
            $(".newWin .aui_topT h5.titleMsg").html(objectName);//替换title
            ActFn();   //三秒后隐藏
        } else {    //角色扮演时返回
            $(".newWin .aui_topT a").hide();
            if (flagT == "true") {    //在大小同屏
                if (sendStyle) {    //已经下发
                    $(".newWin .aui_look").show();
                    $(".newWin .aui_Resend").show();
                } else {
                    $(".newWin .aui_send").show();
                }
            }
            if (isRecording) {
                exitRecord();   //中断录音
                isRecording = false;
            }
        }
    }
    //操作教师页面后，点击返回按钮的动作
    if (playStyle) {
        if (sendStyle) {
            $(".newWin .aui_topT a").hide();
            $(".newWin .aui_look").show();
            $(".newWin .aui_Resend").show();
        } else {
            $(".newWin .aui_topT a").hide();
            $(".newWin .aui_send").show();
        }
        var jsonS = "";
        if (resourceType != '113') {
            sendString("initially#" + jsonS);  //父窗体通知资源初始化
        }
        playStyle = false;
    }
}
var sTime = 3000;
var sTer;
//newWin弹窗工具栏的显隐
function ChangeToolBar(val) {
    var dxObj1 = $(".newWin .aui_close");
    var dxObj2 = $(".newWin .aui_topT");
    if (dxObj2.is(":hidden")) {
        dxObj1.toggle();
        dxObj2.toggle();
        sTer = setTimeout(function () {
            dxObj1.toggle();
            dxObj2.toggle();
        }, sTime);
    } else {
        clearTimeout(sTer);
        sTime = 3000;
        sTer = setTimeout(function () {
            dxObj1.toggle();
            dxObj2.toggle();
        }, sTime);
    }
}
var data01 = { "fileId": "768f8bd8-9d47-4e35-a572-5614cfe103cd", "userID": "f413b575-160a-4853-91e9-da74cf5af84b", "data": [{ "wordIndex": 1, "urlPath": "http://192.168.3.115:8922", "score": 50 }, { "wordIndex": 2, "urlPath": "http://192.168.3.115:8922", "score": 50 }] };
var data02 = { "fileId": "768f8bd8-9d47-4e35-a572-5614cfe103cd", "userID": "1e4b41a1-b4fb-4ff9-b256-5ea38a6278e0", "data": [{ "wordIndex": 1, "urlPath": "http://192.168.3.115:8922", "score": 10 }] };

data01 = JSON.stringify(data01);
data02 = JSON.stringify(data02);
//框架调用页面事件-点亮图标
function dianliangStu(json) {
    //console.log("json===========" + JSON.parse(json).data.studentId);
    //console.log("json==========="+json);  //todo
    var jsonS = JSON.parse(json);
    var _fileId;
    if (_resourceType == '113') {
        _fileId = jsonS.data.fileId;
        MsgArr.push(jsonS.data); //储存当前数据
    } else {
        _fileId = jsonS.fileId;
        MsgArr.push(jsonS); //储存当前数据
    }
    /*
    data = {"fileId": "dfda7d86-02e9-49ca-80d7-69f327f07a0f","userID": "f413b575-160a-4853-91e9-da74cf5af8b4","data": [{ "wordIndex": 1, "urlPath": "http://192.168.3.115:8922", "score": 50 },{ "wordIndex": 2, "urlPath": "http://192.168.3.115:8922", "score": 50 }]};
    data = {"fileId": "dfda7d86-02e9-49ca-80d7-69f327f07a0f","userID": "f413b575-160a-4853-91e9-da74cf5af84b","data": [{ "wordIndex": 1, "urlPath": "http://192.168.3.115:8922", "score": 100 },{ "wordIndex": 2, "urlPath": "http://192.168.3.115:8922", "score": 100 }]};
    */
    
    //当前资源
    //console.log(jsonS.fildId + "," + rmbFileID);
    /***********fileId****************/
    if (_fileId == rmbFileID) { //相同资源
        //找到对应的学生id，添加样式，绑定点击事件
        //console.log("userID:" + jsonS.userID);
        if (_resourceType == '113') {  //群文阅读
            Detach.pub('studentAnswer', JSON.parse(json).data);

        } else {    //电影课资源
            //console.log("jsonS.userID===========" + jsonS.userID);  //todo
            var _obj = $(".newWin .msgUl li[userid=" + jsonS.userID + "]");
            //修改点击查看详情后的状态
            //console.log(MsgArr.length + "," + $(".newWin .msgUl li").length);
            var msgBox = $(".newWin .msgBox");
            if (msgBox.is(':visible')) {   //进入提交情况页面后执行
                $(".newWin .aui_topT h5.titleMsg").html("Committed <b>" + MsgArr.length + "/" + $(".newWin .msgUl li").length + "</b>");
            }
            var averageS = (function () {   //取平均分
                var scoreS = 0;
                for (var n = 0; n < jsonS.data.length; n++) {
                    scoreS += parseInt(jsonS.data[n].score);
                }
                scoreS = scoreS / n;
                return scoreS;
            })();
            //console.log("平均分:"+averageS);
            averageS = Math.round(averageS);    //四舍五入
            var scoreColor = numberSwitchColor(averageS);   //分数等级显示的颜色
            var newHtml = '<img src = "../../App_Theme/images/ku.png" alt="哭脸" style="height:80%;"/>';
            if (type == 101) {    //电影课角色扮演   星星显示分数
                if (averageS == 0) {
                    _obj.find("span").css({ "width": "100%", "text-align": "center" }).html(newHtml);
                } else {
                    _obj.find("span").css("width", "" + averageS + "%");
                }

            } else {    //其他用数字显示分数
                if (averageS == 0) {
                    _obj.find("span").css({ "width": "100%", "text-align": "center" }).html(newHtml);
                } else {
                    _obj.find("span").css({ "width": "100%", "text-align": "center", "color": "" + scoreColor + "" }).html("" + averageS + "");
                }
            }

            //点击对应学生查看录音
            _obj.removeClass("gray").on("click", function () {
                $(".newWin .msgBox").hide();

                console.log(json);
                sendString("playRecording#" + json);    //传参给子窗体资源，播放录音
                $(".newWin .aui_topT h5.titleMsg").html(_obj.find("b").html());
                $(".newWin .aui_topT a").hide();
                $(".newWin .aui_retuen").show();
                clickFlog = true;
                ActFn();   //三秒后隐藏
            });
            $(".newWin .msgUl li").eq(MsgArr.length - 1).before(_obj.clone(true));
            _obj.remove();
        }
    } else {    //不同资源，保存数据置空
        MsgArr = [];
    }
}


//资源播放：IcoType,Guid,内置资源：传1,2,3，和类型
function SaveOperData(SourceType, SourceID) {
    userInfoCls = commonFuncJS.getDataF("UserInfo");//用户信息JSON
    //资源播放
    if (SourceID == "点读") {
        SaveOperDataALL(userInfoCls.Id, userInfoCls.Type, Constant.OperType.InlaySource_TouchTalk_TYPE, SourceID);
    }
    else if (SourceID == "报听写") {
        SaveOperDataALL(userInfoCls.Id, userInfoCls.Type, Constant.OperType.InlaySource_Dictate_TYPE, SourceID);
    }
    else if (SourceID == "全文跟读") {
        SaveOperDataALL(userInfoCls.Id, userInfoCls.Type, Constant.OperType.InlaySource_AllRead_TYPE, SourceID);
    }
    else {
        var obj = { SourceType: SourceType, SourceID: SourceID };
        var objJson = JSON.stringify(obj);
        SaveOperDataALL(userInfoCls.Id, userInfoCls.Type, Constant.OperType.SourcePlay_TYPE, objJson);
    }
};

function SaveOperDataALL(UserID, UserType, OperID, Content) {
        var obj = { UserID: UserID, UserType: UserType, OperID: OperID, Content: Content };
        return Common.Ajax("TeachImplement", "SaveOperData", obj).Data;
}


//数组去重复项
Array.prototype.unique = function () {
    var res = [this[0]];
    for (var i = 1; i < this.length; i++) {
        var repeat = false;
        for (var j = 0; j < res.length; j++) {
            if (this[i] == res[j]) {
                repeat = true;
                break;
            }
        }
        if (!repeat) {
            res.push(this[i]);
        }
    }
    return res;
}


//图片多图预览
; (function () {
    var oPic;
    var oList;
    var oPrev;
    var oNext;
    var oPrevTop;
    var oNextTop;
    var oPicLi;
    var oListLi;

    var oPicUl;
    var oListUl;

    var w1;
    var w2;

    var len1;	//大图数量
    var len2;	//小图数量
    var startX, startY;
    var moveEndX, moveEndY;
    var index = 0;
    var num;

    var _next;
    var _prev;
    function G(s) {
        return document.getElementById(s);
    }

    function getStyle(obj, attr) {
        if (obj.currentStyle) {
            return obj.currentStyle[attr];
        } else {
            return getComputedStyle(obj, false)[attr];
        }
    }

    function Animate(obj, json) {
        if (obj.timer) {
            clearInterval(obj.timer);
        }
        obj.timer = setInterval(function () {
            for (var attr in json) {
                var iCur = parseInt(getStyle(obj, attr));
                iCur = iCur ? iCur : 0;
                var iSpeed = (json[attr] - iCur) / 3;
                iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
                obj.style[attr] = iCur + iSpeed + 'px';
                if (iCur == json[attr]) {
                    clearInterval(obj.timer);
                }
            }
        }, 30);
    }

    function Change() {
        //滑到最左侧
        if (index <= 0 || len1 == 1) {
            index = 0;
            oPrev.style.display = "none";
            oPrevTop.style.display = "none";
        } else {
            oPrev.style.display = "block";
            oPrevTop.style.display = "block";
        }
        //滑到最右侧
        if (index >= len2 - 1) {
            index = len2 - 1;
            oNext.style.display = "none";
            oNextTop.style.display = "none";
        } else {
            oNext.style.display = "block";
            oNextTop.style.display = "block";
        }

        Animate(oPicUl, { left: -index * w1 });
        if (index < num2) {
            Animate(oListUl, { left: 0 });
        } else if (index + num2 <= len2) {
            Animate(oListUl, { left: -(index - num2 + 1) * w2 });
        } else {
            Animate(oListUl, { left: -(len2 - num) * w2 });
        }

        for (var i = 0; i < len2; i++) {
            oListLi[i].className = "";
            if (i == index) {
                oListLi[i].className = "on";
            }
        }

    }

    function Init() {
        //初始化隐藏左侧滑动按钮
        if (len2 > 1) {
            oNext.style.display = "block";
            oNextTop.style.display = "block";
        }
        oPrev.style.display = "none";
        oPrevTop.style.display = "none";
        oListUl.children[0].className = "on";
        var LiDom, ADom, ImgDom;
        //oPicUl.innerHTML = "";
        for (var i = 0; i < len2; i++) {
            //LiDom = document.createElement("li");
            //ADom = document.createElement("a");
            //ImgDom = document.createElement("img");
            //ADom.href = "javascript:void(0)";
            //ImgDom.src = "img/132.png";
            //ImgDom.title = "壁纸" + (i + 1) + "";
            //ADom.appendChild(ImgDom);
            //LiDom.appendChild(ADom);
            //oPicUl.appendChild(LiDom);
            oListLi[i].index = i;
            oListLi[i].onclick = function () {
                index = this.index;
                Change();
            }
        }
    }
    //判断pc
    function IsPC() {
        var userAgentInfo = navigator.userAgent;
        var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
        }
        return flag;
    }

    function _start(e) {
        e.preventDefault();//取消事件的默认动作
        e.target.style.cursor = "pointer";
        //console.log("star");
        if (IsPC()) {
            startX = e.pageX;
            startY = e.pageY;
        } else {
            startX = e.targetTouches[0].pageX;
            startY = e.targetTouches[0].pageY;
        }
        moveEndX = moveEndY = 0;
        //console.log(startX+","+startY);
    }
    function _move(e) {
        //console.log("move");
        if (IsPC()) {
            moveEndX = e.pageX;
            moveEndY = e.pageY;
        } else {
            moveEndX = e.targetTouches[0].pageX;
            moveEndY = e.targetTouches[0].pageY;
        }
        X = moveEndX - startX;
        Y = moveEndY - startY;
        //console.log(X+","+Y);
    }
    function _end(e) {
        //console.log("end");
        //判断移动端只有触摸没有滑动的情况
        if (moveEndX == 0 & moveEndY == 0) {
            return false;
        }
        if (Math.abs(X) > Math.abs(Y) && X > 0) {
            if (Math.abs(X) > 150) {
                //console.log("向右滑动！");

                _prev();
            }
            //console.log("left 2 right");
        }
        else if (Math.abs(X) > Math.abs(Y) && X < 0) {
            if (Math.abs(X) > 150) {
                //console.log("向左滑动！");
                _next();
            }
            //console.log("right 2 left");
        }
        else if (Math.abs(Y) > Math.abs(X) && Y > 0) {
            //console.log("top 2 bottom");
        }
        else if (Math.abs(Y) > Math.abs(X) && Y < 0) {
            //console.log("bottom 2 top");
        }
        else {
            //console.log("just touch");
        }
    }

    var cont = {
        //picLength 图片数量
        //numB 预览图一排的数量
        reSet: function (picLength, numB) {
            //len1 = oPicLi.length;	
            //len2 = oListLi.length;
            //index = 0;
            //num = 6;
            oPic = G("picBox");
            oList = G("listBox");
            oPrev = G("prev");
            oNext = G("next");
            oPrevTop = G("prevTop");
            oNextTop = G("nextTop");
            oPicLi = oPic.getElementsByTagName("li");
            oListLi = oList.getElementsByTagName("li");


            oPicUl = oPic.getElementsByTagName("ul")[0];
            oListUl = oList.getElementsByTagName("ul")[0];

            w1 = oPicLi[0].offsetWidth;
            w2 = oListLi[0].offsetWidth;


            len1 = len2 = picLength;
            num = numB;

            num2 = Math.ceil(num / 2);
            oPicUl.style.width = w1 * len1 + "px";	//设置大图总容器宽度
            oListUl.style.width = w2 * len2 + "px";	//设置预览图总容器宽度


            oPicUl.addEventListener('mousedown', _start, false);
            oPicUl.addEventListener('mousemove', _move, false);
            oPicUl.addEventListener('mouseup', _end, false);
            oPicUl.addEventListener('touchstart', _start, false);
            oPicUl.addEventListener('touchmove', _move, false);
            oPicUl.addEventListener('touchend', _end, false);

            _next = oNextTop.onclick = oNext.onclick = function () {
                index++;
                //index = index == len2 ? 0 : index;
                Change();
            }
            _prev = oPrevTop.onclick = oPrev.onclick = function () {
                index--;
                //index = index == -1 ? len2 -1 : index;
                Change();
            }

            Init();
            return this;
        }
    }
    this.Cont = cont;
})()

//获取教学地图中的图片数据
function GetMapData(fileID) {
    var imgJson = "";
    var fileIDJson = [];
    var fildId, selectN, comeFrom, fileIDJson;
    var obj = $(".sortTab li").find("a[sourcetype=\"28\"]");
    //组装当前地图中的图片数据
    imgJson += '[';
    obj.each(function (index, item) {   
        fileId = $(item).attr("hidsrc");    //根据文件id取数据
        fileIDJson.push(fileId);
    })
    fileIDJson = fileIDJson.unique();//去除重复项

    for (var i = 0; i < fileIDJson.length; i++) {
        //判断当前点击的是第几个
        if (fileIDJson[i] == fileID) {
            selectN = i + 1;
        }
        var object = $(".sortTab li a[hidsrc=" + fileIDJson[i] + "]").eq(0);
        comeFrom = object.attr("comeFrom");
        imgJson += '{"ImgId":' + (i + 1) + ',"FileID":"' + fileIDJson[i] + '","FileType":"","comeFrom":"' + comeFrom + '"},';
    }
    imgJson = imgJson.substring(0, imgJson.length - 1);
    imgJson += ']';

    var callbackData = [imgJson, selectN];  //返回一个图片列表数据 和当前项的序号
    return callbackData;
}


//多图预览调用方法
function ImgView(imgJson, selectN, filePath) { //imgJson-图片JSON数据，selectN-当前点击是第几个，filePath-当前点击图片的地址
    //重置全文跟读
    pause();
    clearInterval(timeObjId1);
    clearTimeout(setT1);
    isAll = 0;
    //取消所有点读框选中
    $(".readbox").css("border", "0 solid red");

    var imgData = JSON.parse(imgJson);
    var picUrl = [];
    var htmlS = "";
    var htmlStr = "";
        htmlStr += '<div class="imgOwl">';
        htmlStr += '    <span id="prev" class="btn prev"></span>';
        htmlStr += '    <span id="next" class="btn next"></span>';
        htmlStr += '    <span id="prevTop" class="btn"></span>';
        htmlStr += '    <span id="nextTop" class="btn"></span>';
        htmlStr += '    <div id="picBox" class="picBox">';
        htmlStr += '        <ul class="cf"></ul>';
        htmlStr += '</div>';
        htmlStr += '    <div id="listBox" class="listBox">';
        htmlStr += '        <ul class="cf">';
        $.each(imgData, function (index, item) {
            var imgS;
            //console.log(item.ImgId + ',' + item.FileID);
            //判断是用户上传资源还是教材资源
            if (item.comeFrom == "UserResource") {
                imgS = GetImgUrl(item);   //用户自己上传的图片资源-我的资源

                var result = commonFuncJS.GetResourceUrlByFileID(item.FileID);//此函数只针对用户上传和校本资源,此函数为实时获取，不存在延时
                if (!result) {//资源不存在时返回值为false,否则返回真实的文件路径 
                    //commonFuncJS.openAlert("此文件已被删除或不存在！"); 
                    var errFilePath = "../../App_Theme/images/dialog/fileErr.gif";
                    htmlS += '<li><a href="javascript:void(0)"><img src="' + errFilePath + '"/></a><span></span></li>';                    
                }
                else {
                    var replaceStr = "\\\\";
                    var replaceStr2 = "##";                    
                    result = result.replace(new RegExp(replaceStr, 'gm'), '#');
                    result = result.replace(new RegExp(replaceStr2, 'gm'), '/');
                result = result.substr(1, result.length - 2);
                    htmlS += '<li><a href="javascript:void(0)"><img src="' + result + '"/></a><span></span></li>';                   
                }
            htmlStr += '    <li><img src="' + imgS + '" hidSrc="' + item.FileID + '" comeFrom="' + item.comeFrom + '"/></li>';

            } else {
                htmlS += '<li><a href="javascript:void(0)"><img src="../../App_Theme/images/dialog/loading.gif"/></a><span></span></li>';                
                //GetImgPath(item.comeFrom, item.FileID, index);
                //获取非用户上传资源，此函数为ajax，存在延时问题                
                var url = Constant.file_Url + "Preview.ashx";
                var filePath = "";
                GetPreviewUrl(item.FileID, "Other", url, function (data) {
                    filePath = data.URL;
                    $("#picBox ul li a img").eq(index).attr("src", filePath);
                });
                imgS = Constant.file_Url + "GetFileImg.ashx?fileID=" + item.FileID + "&view=true";
            htmlStr += '    <li><img src="' + imgS + '" hidSrc="' + item.FileID + '" comeFrom="' + item.comeFrom + '"/></li>';
            }
            //GetImgPath(item.comeFrom, item.FileID, index);
            //if (isUserResource && !isFindImg) {//如果是校本资源或我的资源，并且已被删除了
            //    var errFilePath = "../../App_Theme/images/dialog/fileErr.gif";
            //    htmlS += '<li><a href="javascript:void(0)"><img src="' + errFilePath + '"/></a><span></span></li>';
            //}
            //else {                
                                      
            //}
            //htmlS += '<li><a href="javascript:void(0)"><img src="../../App_Theme/images/dialog/loading.gif"/></a><span></span></li>';
            //htmlStr += '    <li><i class="arr2"></i><img src="' + imgS + '" hidSrc="' + item.FileID + '" comeFrom="' + item.comeFrom + '"/></li>';
                     
    })
    htmlStr += '</ul></div></div>';
    d = art.dialog({
        id: "Act",
        width: 1000,
        height: 'auto',
        skin: 'mPic',
        padding: 0,
        hasMaxBtn: false,
        isMaxWin: false,
        fixed: true,
        resize: false,
        content: htmlStr,
        lock: true,
        drag: false
    });
    $("#picBox ul").eq(0).append(htmlS);
    var listNum = document.getElementById("listBox").getElementsByTagName("li").length;
    Cont.reSet(listNum, 7);
    $("#listBox ul li").eq(selectN - 1).click();  //根据传过来的参数显示高亮显示对应的图片
    $("#picBox ul li a img").each(function (index, item) {
        var _index = index;
        $(item).attr("src", picUrl[index]).load(function () {   //大图加载完成后再调整下面缩略图的位置
            var _this = $("#listBox ul li img").eq(_index);
            if (_this.height() != 0) {  //图片load事件会触发两次，判断是否真的获取到图片高度
                var marginTop = 0;
                marginTop = parseInt((_this.parent().height() - _this.height() - 5) / 2);
                _this.animate({ marginTop: marginTop + "px" }, 100);
                //console.log("marginTop:" + marginTop);
            }
            
        });
    })   
    
}
//var isFindImg = false;
//var isUserResource = false;
//取大图路径
//function GetImgPath(comeFrom, FileID, FileNum) {
//    var id = FileID;
//    var url = Constant.file_Url + "Preview.ashx";
//    var filePath = "";
//    ElementFileType = "Other";
//    if (comeFrom == "UserResource") {
//        var result = commonFuncJS.GetResourceUrlByFileID(id);//此函数只针对用户上传和校本资源
//        isUserResource = true;
//        if (!result) {//资源不存在时返回值为false,否则返回真实的文件路径  
//            //commonFuncJS.openAlert("此文件已被删除或不存在！"); 
//            var errFilePath = "../../App_Theme/images/dialog/fileErr.gif";
//            $("#picBox ul li a img").eq(FileNum).attr("src", errFilePath);
//            isFindImg = false;
//        }
//        else {
//            $("#picBox ul li a img").eq(FileNum).attr("src", result);
//            isFindImg = true;
//        }
//        //var url = Constant.webapi_Url + "ResourcePreview/" + id;
//        //$.getJSON(url, function (data) {
//        //    console.log("值为："+data);
//        //    filePath = data;
//        //    $("#picBox ul li a img").eq(FileNum).attr("src", filePath);
//        //});
//    } else {
//        isUserResource = false;
//        GetPreviewUrl(id, ElementFileType, url, function (data) {            
//            filePath = data.URL;
//            $("#picBox ul li a img").eq(FileNum).attr("src", filePath);            
//        });        
//    }
//};
//////////////////////////////////////////////////
///////////////获取图片路径///////////////////////
//////////////////////////////////////////////////
 
function GetImgUrl(resource) {
    var img = Constant.school_file_Url + "KingsunFiles/img/";
    if (resource.ResourceStyle == 100) {
        img += "miss.jpg";
    } else {
        if (resource.FileType.indexOf("mp3") != -1 || resource.FileType.indexOf("mav") != -1 || resource.FileType.indexOf("wma") != -1 || resource.FileType.indexOf("wav") != -1) {//音频
            img += "mp3.jpg";
        } else if (resource.FileType.indexOf("mp4") != -1 || resource.FileType.indexOf("wmv") != -1 || resource.FileType.indexOf("avi") != -1 || resource.FileType.indexOf("rm") != -1 || resource.FileType.indexOf("rmvb") != -1 || resource.FileType.indexOf("mkv") != -1 || resource.FileType.indexOf("3gp") != -1 || resource.FileType.indexOf("flv") != -1 || resource.FileType.indexOf("mov") != -1) {//视频
            img += "video.jpg";
        } else if (resource.FileType.indexOf("swf") != -1) {//flash
            img += "flash.jpg";
        } else if (resource.FileType.indexOf("ppt") != -1) {//ppt
            img += "ppt.jpg";
        } else if (resource.FileType.indexOf("doc") != -1) {//word
            img += "word.jpg";
        } else if (resource.FileType.indexOf("xls") != -1) {//Excel
            img += "excel.jpg";
        } else if (resource.FileType.indexOf("txt") != -1) {//文本
            img += "txt.jpg";
        } else if (resource.FileType.indexOf("zip") != -1 || resource.FileType.indexOf("rar") != -1) {//压缩包
            img += "zip.jpg";
        } else if (resource.FileType.indexOf("pdf") != -1) {
            img += "pdf.jpg";
        } else {
            img += resource.FileID + ".jpg";
        }
    }
    return img;
}
//不用分数段显示的颜色
function numberSwitchColor(number) {
    if (number >= 90) {
        color = "#7ace4c"
    } else if (number >= 60 && number < 90) {
        color = "#f9a158"
    } else if (number > 0 && number < 60) {
        color = "#ff6239"
    } else if (number == 0) {
        color = "#000000"
    } else {
        color = "No"
    }
    return color;
}

//判断运行环境为Android
function InAndroid() {
    var userAgentInfo = navigator.userAgent;
    var Agents = new Array("Android");
    var flag = false;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = true; break; }
    }
    return flag;
}
//在Android下打开资源弹窗执行方法
function openWinFun() {
    console.log("打开！");
    if (InAndroid()) {  //运行环境为安卓
        var data = 1;
        window.WebViewJavascriptBridge.callHandler(
            'isOpenSoftInput'
            , data
            , function (responseData) {

            })
    }
}
//在Android下关闭资源弹窗执行方法
function closeWinFun() {
    console.log("关闭！");
    if (InAndroid()) {
        var data = 2;
        window.WebViewJavascriptBridge.callHandler(
            'isOpenSoftInput'
            , data
            , function (responseData) {

            })
    }
    
}