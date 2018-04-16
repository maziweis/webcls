/*
   自定义样式的音频播放器
*/

initHTML();
var curAudio;
//初始化声音控件结构
function initHTML() {
    var maskHTML = '<div class="mask" style="width: 100%; height: 100%;display: none;"></div>';
    $("body").append(maskHTML);
    var maskW = $(".mask").width();
    var maskH = $(".mask").height();
    var audioX = maskW / 2 - 300;
    var audioY = maskH / 2 - 80;
    var str = '<div id="soundBox2" style="display: none;position:absolute;left:' + audioX + 'px;top:' + audioY + 'px; z-index:1992;">';
    str += '<div class="audioplayer audioplayer-stopped" style="">';
    str += '<div class="audioplayer-audioClose" title="关闭" onclick="closeSoundWin()"></div>';
    str += '<audio id="audioObject" preload="auto" controls="controls" src="#" style="width: 0px; height: 0px; visibility: hidden;"></audio>';
    str += '<div class="audioplayer-playpause" title="播放" onclick="playOrPause()"><a href="#">播放</a></div>';
    str += '<div class="audioplayer-btnstop" title="停止" onclick="stoped()"><a href="#">停止</a></div>';
    str += '<div class="timesBox">';
    str += '  <div class="audioplayer-time audioplayer-time-current">00:00</div>';
    str += '  <div class="space">/</div>';
    if (isIOS()) {
        //ios第一次加载时需要手工点击播放按钮才能预加载，这儿用一个假时长代替，点击播放后就能得到正常时长了。        
        str += '  <div class="audioplayer-time audioplayer-time-duration">01:05</div>';
    }
    else {
        str += '  <div class="audioplayer-time audioplayer-time-duration">00:00</div>';
    }    
    str += '</div>';
    str += '<div class="audioplayer-bar">';
    str += '  <div class="audioplayer-bar-loaded"></div>';
    str += '  <div class="audioplayer-bar-played"></div>';
    str += '</div>';
    str += '<div id="playerMsg"></div>';
    str += '</div>';
    str += '</div>';
    $("body").append(str);
    curAudio = $("#audioObject").get(0);
}
//绑定声音进度拖动事件
function bindBarDrag() {
    var isTouch = 'ontouchstart' in window,
		eStart = isTouch ? 'touchstart' : 'mousedown',
		eMove = isTouch ? 'touchmove' : 'mousemove',
		eEnd = isTouch ? 'touchend' : 'mouseup',
		eCancel = isTouch ? 'touchcancel' : 'mouseup',
        theBar = $('.audioplayer-bar'),
        adjustCurrentTime = function (e) {
            theRealEvent = isTouch ? e.originalEvent.touches[0] : e;
            curAudio.currentTime = Math.round((curAudio.duration * (theRealEvent.pageX - theBar.offset().left)) / theBar.width());
        };

    theBar.on(eStart, function (e) {
        adjustCurrentTime(e);
        theBar.on(eMove, function (e) { adjustCurrentTime(e); });
    }).on(eCancel, function () {
        theBar.unbind(eMove);
    });

}
//关闭弹窗
function closeSoundWin() {
    curAudio.pause();
    curAudio.currentTime = 0;
    //audio.Stop();
    $(".mask").hide();
    $("#soundBox2").hide();
    $(".audioplayer").removeClass("audioplayer-playing").addClass("audioplayer-stopped");
    $("#playerMsg").html("").hide();
}
//关闭声音
function stoped() {
    curAudio.pause();
    $(".audioplayer").removeClass("audioplayer-playing").addClass("audioplayer-stopped");
    curAudio.currentTime = 0;
}
//播放和暂停
function playOrPause() {
    if (curAudio.paused) {
        $(".audioplayer").removeClass("audioplayer-stopped").addClass("audioplayer-playing");
        curAudio.play();
        //playerMsg("开始播放！")
    } else {
        $(".audioplayer").removeClass("audioplayer-playing").addClass("audioplayer-stopped");
        curAudio.pause();
        //playerMsg("暂停播放！")
    }
}

//切换声音文件
function switchSoundSrc(source) { 
    $(curAudio).attr("src", source);
    curAudio.load
    //获取时长,兼容IOS    
    curAudio.addEventListener("loadedmetadata",function () {
        $(".audioplayer-time-duration").html(secondsToTime(parseInt(curAudio.duration) + 1));//总时长和当前时长总是差1，在这儿加1
    });

    bindBarDrag();
    //监听时间变化
    curAudio.addEventListener('timeupdate', function () {
        $(".audioplayer-bar").show();
        var curTime = curAudio.currentTime;       
        $(".audioplayer-time-current").html(secondsToTime(Math.ceil(curAudio.currentTime)));
        $(".audioplayer-bar-played").width((curAudio.currentTime / curAudio.duration) * 100 + '%');
    });
    //监听播放结束
    curAudio.addEventListener('ended', function () {
        $(".audioplayer").removeClass("audioplayer-playing").addClass("audioplayer-stopped");
        //playerMsg("播放完毕...");
        $("#playerMsg").html("");
    });
    $(".mask").show();
    $("#soundBox2").show();
}

function isIOS() {
    var u = navigator.userAgent, app = navigator.appVersion;
    //var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端  
    return isiOS;
}

//格式化时间为time
function secondsToTime(secs) {    
    if (!isNaN(secs)) {        
        var hoursDiv = secs / 3600, hours = Math.floor(hoursDiv), minutesDiv = secs % 3600 / 60, minutes = Math.floor(minutesDiv), seconds = Math.ceil(secs % 3600 % 60);
        if (seconds > 59) { seconds = 0; minutes = Math.ceil(minutesDiv); }
        if (minutes > 59) { minutes = 0; hours = Math.ceil(hoursDiv); }
        return (hours == 0 ? '' : hours > 0 && hours.toString().length < 2 ? '0' + hours + ':' : hours + ':') + (minutes.toString().length < 2 ? '0' + minutes : minutes) + ':' + (seconds.toString().length < 2 ? '0' + seconds : seconds);
    }
    else {//非数字时...
        console.log("未获取到总时长！请再试一次");
        playerMsg("未获取到文件总时长，请关闭后再试一次！")
        return "00:00";
    }
}
//状态信息
function playerMsg(msg) {
    $("#playerMsg").show();
    $("#playerMsg").html(msg);
}