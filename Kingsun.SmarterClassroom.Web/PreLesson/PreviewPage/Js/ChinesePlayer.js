
/// <reference path="jquery-1.4.1.js" />
/// <reference path="jplayer/jquery.jplayer.min.js" />
$.fn.ChinesePlayer = function (Settings) {
    var defaults = {
        swfPath: null,
        title: "",
        mp3: "",
        module: 0,  //模式：0-正常（大喇叭），1-录音，2-小喇叭
        OnlyOne: false,
        AutoNext: false,
        EndFun: null,
        ArrayIndex: null,   //20150915钟伟鹏添加：当有多个跟读课文的大题时，存储该大题的索引
        UserID: "",         //20150930钟伟鹏添加；原因：云知声添加了新接口，设置用户ID，需要提供此参数
        ksRecord: null, //云知声录音控件
        content: "", //音频对应的内容
        StartRecord: null,  //开始录音时的事件
        StartProgress: null,    //开始进度条
        UpdateProgress: null,   //实时更新进度条
        EndProgress: null,  //结束进度条
        IsClickMicro: true  //麦克风是否可点击
    };
    defaults = $.extend(defaults, Settings);

    var playInterval, recordTimeout, progressInterval;
    var progressValue = 0;
    var Current = this;
    Current.ArrayIndex = defaults.ArrayIndex;
    Current.PlayerObj = null;
    Current.Module = defaults.module;
    Current.Mp3List = defaults.mp3;
    Current.ContentList = defaults.content;
    Current.DuringList = [];//每个音频持续时长
    Current.CurrentMp3 = 0;
    Current.Defaults = defaults;
    Current.UserID = defaults.UserID;
    Current.KsRecord = defaults.ksRecord;
    Current.StartRecord = defaults.StartRecord;
    Current.StartProgress = defaults.StartProgress;
    Current.UpdateProgress = defaults.UpdateProgress;
    Current.EndProgress = defaults.EndProgress;
    Current.IsClickMicro = defaults.IsClickMicro;
    this.InitPlayer = function () {
        $(this).after('<div class="mp3player"></div>');
        $(this).appendTo($(this).next());
        this.PlayerObj = $(this).jPlayer({
            ready: function () {
                $(this).jPlayer("setMedia", {
                    mp3: Current.Mp3List
                });
            },
            ended: Current.End,
            supplied: "mp3",
            wmode: "window",
            swfPath: defaults.swfPath
        });
        if (Current.Module == 0) {//正常模式
            $(this).after('<div class="mp3Cont big"><em class="state"></em><em class="num good"></em><a class="play"></a><a class="pause" style="display:none;"></a></div>');
        } else if (Current.Module == 1) {//录音模式
            $(this).after('<div class="mp3Cont big"><em class="state"></em><em class="num good"></em><a class="micro"></a><a class="play" style="display:none;"><a class="pause" style="display:none;"></a></div>');
        }
        $(this).next("div").find(".micro").click(function () {//开始跟读流程
            if (Current.IsClickMicro && Current.KsRecord.HasMicro) {
                if (Current.StartRecord) {
                    Current.Defaults.StartRecord(Current.CurrentMp3);
                }
                $(this).parent().find(".pause").css("display", "block").addClass("on");
                $(this).css("display", "none");                
                Current.Record();
            }
        });
        $(this).next("div").find(".play").click(function () {//点击“播放中”按钮，回到初始状态
            if (defaults.OnlyOne) {
                $(".pause").click();
            }
            Current.PlayerObj.jPlayer("play");
            $(this).parent().find(".pause").css({ "display": "inline-block", "*display": "inline", "_display": "inline" });
            $(this).css("display", "none");
        });
        $(this).next("div").find(".pause").click(function () {//暂停（获取跟读音频）
            if (Current.Module == 1) {
                $(this).parent().find(".micro").css("display", "block");
                $(this).css("display", "none");
                Current.KsRecord.RecordOff();
                Current.EndProgress();
            } else {
                Current.PlayerObj.jPlayer("stop");
                $(this).parent().find(".play").css({ "display": "inline-block", "*display": "inline", "_display": "inline" });
                $(this).css("display", "none");
            }
        });
    };
    //播放
    this.Play = function () {
        $(Current).next("div").find(".play").click();
        //Current.PlayerObj.jPlayer("play")
    };
    //暂停
    this.Pause = function () {
        $(Current).next("div").find(".pause").click();
    };
    //停止
    this.Stop = function () {
        if (Current.Module == 1) {
            $(Current).parent().find(".micro").css("display", "block");
            $(Current).parent().find(".play").css("display", "none");
            $(Current).parent().find(".pause").css("display", "none");
            Current.KsRecord.RecordOff(Current.ContentList);
        } else {
            Current.PlayerObj.jPlayer("stop");
            $(Current).parent().find(".play").css({ "display": "inline-block", "*display": "inline", "_display": "inline" });
            $(Current).parent().find(".pause").css("display", "none");
        }
    };
    //录音中
    this.Record = function () {
        //查看是否在播放原音
        if ($("#aPlay").hasClass("on"))
        {
            $("#ywplayer").jPlayer("stop");
            $("#aPlay").removeClass("on");
        }
        Current.StartProgress();
        Current.KsRecord.RecordOn(Current.ContentList);//开始录音

    };
    this.End = function () {
        if (Current.Module == 1) {
            Current.Record();
        } else {
            Current.Stop();
        }
    };
    this.InitPlayer();
    return Current;
}

$(function () {
    $(".Mp3Player").ChinesePlayer();
});