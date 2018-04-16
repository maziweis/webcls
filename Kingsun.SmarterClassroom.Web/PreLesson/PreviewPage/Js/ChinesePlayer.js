
/// <reference path="jquery-1.4.1.js" />
/// <reference path="jplayer/jquery.jplayer.min.js" />
$.fn.ChinesePlayer = function (Settings) {
    var defaults = {
        swfPath: null,
        title: "",
        mp3: "",
        module: 0,  //ģʽ��0-�����������ȣ���1-¼����2-С����
        OnlyOne: false,
        AutoNext: false,
        EndFun: null,
        ArrayIndex: null,   //20150915��ΰ����ӣ����ж���������ĵĴ���ʱ���洢�ô��������
        UserID: "",         //20150930��ΰ����ӣ�ԭ����֪��������½ӿڣ������û�ID����Ҫ�ṩ�˲���
        ksRecord: null, //��֪��¼���ؼ�
        content: "", //��Ƶ��Ӧ������
        StartRecord: null,  //��ʼ¼��ʱ���¼�
        StartProgress: null,    //��ʼ������
        UpdateProgress: null,   //ʵʱ���½�����
        EndProgress: null,  //����������
        IsClickMicro: true  //��˷��Ƿ�ɵ��
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
    Current.DuringList = [];//ÿ����Ƶ����ʱ��
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
        if (Current.Module == 0) {//����ģʽ
            $(this).after('<div class="mp3Cont big"><em class="state"></em><em class="num good"></em><a class="play"></a><a class="pause" style="display:none;"></a></div>');
        } else if (Current.Module == 1) {//¼��ģʽ
            $(this).after('<div class="mp3Cont big"><em class="state"></em><em class="num good"></em><a class="micro"></a><a class="play" style="display:none;"><a class="pause" style="display:none;"></a></div>');
        }
        $(this).next("div").find(".micro").click(function () {//��ʼ��������
            if (Current.IsClickMicro && Current.KsRecord.HasMicro) {
                if (Current.StartRecord) {
                    Current.Defaults.StartRecord(Current.CurrentMp3);
                }
                $(this).parent().find(".pause").css("display", "block").addClass("on");
                $(this).css("display", "none");                
                Current.Record();
            }
        });
        $(this).next("div").find(".play").click(function () {//����������С���ť���ص���ʼ״̬
            if (defaults.OnlyOne) {
                $(".pause").click();
            }
            Current.PlayerObj.jPlayer("play");
            $(this).parent().find(".pause").css({ "display": "inline-block", "*display": "inline", "_display": "inline" });
            $(this).css("display", "none");
        });
        $(this).next("div").find(".pause").click(function () {//��ͣ����ȡ������Ƶ��
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
    //����
    this.Play = function () {
        $(Current).next("div").find(".play").click();
        //Current.PlayerObj.jPlayer("play")
    };
    //��ͣ
    this.Pause = function () {
        $(Current).next("div").find(".pause").click();
    };
    //ֹͣ
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
    //¼����
    this.Record = function () {
        //�鿴�Ƿ��ڲ���ԭ��
        if ($("#aPlay").hasClass("on"))
        {
            $("#ywplayer").jPlayer("stop");
            $("#aPlay").removeClass("on");
        }
        Current.StartProgress();
        Current.KsRecord.RecordOn(Current.ContentList);//��ʼ¼��

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