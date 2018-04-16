/// <reference path="../../Upload/Listen and say/Listen and say.html" />
/// <reference path="../../Upload/Listen and say/Listen and say.html" />
/// <reference path="../../Upload/Listen and say/Listen and say.html" />
var isClikeTouched = false;
var operation = { addCount: 0, delCount: 0, moveCount: 0, addStepCount: 0, delStepCount: 0, modifyStepCount: 0, sortObCount: 0 };
//用户操作记录对象，包含添加数量、删除数量、移动数量，教学地图的添加步骤、删除步骤、修改步骤名、拖动顺序
var imgObject = [];//所有生成图标的ID数组
var imgObjectX = [];//所有生成图标的中心点X轴数组
var imgObjectY = [];//所有生成图标的中心点Y轴数组
var crossObj;
var isInlineImg = false;//是否在垃圾箱的范围内
var isDelClick = false;
var curSourceGuiId = "";//当前要打开的资源ID
var ElementFileType = "";//判断资源是不是PPT

// 在限定范围内拖动类,兼容移动端
(function ($) {
    var old = $.fn.drag;
    function Drag(element, options) {
        this.ver = '1.0';
        this.$element = $(element);
        this.options = $.extend({}, $.fn.drag.defaults, options);
        this.init();
    }
    Drag.prototype = {
        constructor: Drag,
        init: function () {
            var options = this.options;
            var icoType;
            initObject();
            this.$element.on('touchstart.drag.founder mousedown.drag.founder', function (e) {
                var ev = e.type == 'touchstart' ? e.originalEvent.touches[0] : e,
                    startPos = $(this).position(),
                    disX = ev.pageX - startPos.left,
                    disY = ev.pageY - startPos.top,
                    that = this;
                //记录初始位置,以便复位使用  
                $(this).data('startPos', startPos);
                crossObj = new cross($("#dragPalcer").get(0));//拖动十字
                crossObj.init();
                var isMove = false;

                if (options.before && $.isFunction(options.before)) {
                    options.before.call(that, ev);
                }
                $(document).on('touchmove.drag.founder mousemove.drag.founder', function (e) {
                    var ev = e.type == 'touchmove' ? e.originalEvent.touches[0] : e,
                        $this = $(that),
                        //$parent = $this.offsetParent(),
                        $parent = $this.parent(),
                        //$parent=$parent.is(':root')?$(window):$parent,  
                        pPos = $parent.offset(),
                        pPos = pPos ? pPos : { left: 0, top: 0 },
                        //left = ev.pageX - disX - pPos.left,  
                        //top = ev.pageY - disY - pPos.top, 
                        left = ev.pageX - disX,
                        top = ev.pageY - disY,
                        r = $parent.width() - $this.outerWidth(true),
                        d = $parent.height() - $this.outerHeight(true);
                    //下面两行限定拖动的范围为电子书底图容器内
                    left = left < 0 ? 0 : left > r ? r : left;
                    top = top < 0 ? 0 : top > d ? d : top;

                    $(that).css({
                        left: left + 'px',
                        top: top + 'px'
                    });
                    if (options.process && $.isFunction(options.process)) {
                        options.process.call(that, ev);
                    }
                    //e.preventDefault(); 
                    isInlineImg = inOrOutWraper($this);//判断是否拖在垃圾箱范围内                   
                    crossObj.move(left + $this.width() / 2, top + $this.height() / 2);
                    //是否移动过
                    if (left == startPos.left && top == startPos.top) {
                        isMove = false;
                    }
                    else {
                        $(".trash").show();//鼠标移动时显示垃圾箱图标
                        isMove = true;
                    }
                    //拖动时高亮显示点读框
                    $("a.readbox").css({ "border": "1px red solid" });
                });

                //左侧水滴按钮绑定事件
                //鼠标松开事件               
                $(document).on('touchend.drag.founder mouseup.drag.founder', function (e) {
                    var ev = e.type == 'touchend' ? e.originalEvent.changedTouches[0] : e;
                    if (options.end && $.isFunction(options.end)) {
                        options.end.call(that, ev);
                    }
                    $(document).off('.drag.founder');
                    if (isMove) {//移动到指定位置                       
                        $(".light").remove();
                        //将生成的图标中心点X轴/Y轴值存入全局数组
                        var thisId = $(this.$element).attr("id");
                        //因为改变了位置，所以重新调用一次，将数组内容重置
                        imgObject.length = 0;
                        imgObjectX.length = 0;
                        imgObjectY.length = 0;
                        initObject();
                        crossObj.delete();
                        if (isInlineImg) {
                            //如果拖动到垃圾箱图标位置内，则执行删除操作
                            delIco(that);//隐藏图标
                        }
                        else {
                            $(".trash").hide();//鼠标按下时显示垃圾箱图标
                        }

                        //移动过就更新操作对象的数量
                        var newCount = parseInt(operation.moveCount) + 1;
                        operation.moveCount = newCount;
                        sessionS.set("operation", JSON.stringify(operation));
                        $(that).unbind("click");
                        //结束拖动时隐藏点读框高亮样式
                        $("a.readbox").css({ "border": "0px red solid" });
                        //console.log(ev);
                        e.preventDefault(); //禁止默认事件
                        return;
                    }
                    else {
                        icoType = $(that).attr("sourcetype");
                        var isMobile = isMobilePlatform();
                        $("a.readbox").css({ "border": "0px red solid" });
                        if (isMobile) {//移动平台
                            if (!isClikeTouched) {//第一次移动端事件触发
                                $(".light").remove();
                                //未移动过，就可能是想打开文件预览 
                                filePreview(that, icoType);
                                isClikeTouched = true;
                            }
                            else if (isClikeTouched && e.type == "mouseup") {//第二次PC端事件触发
                                isClikeTouched = false;
                                return;
                            }
                        }
                        else {//pc
                            $(".light").remove();
                            //未移动过，就可能是想打开文件预览 
                            filePreview(that, icoType);
                        }
                    }
                    crossObj.delete();
                });
                //e.preventDefault(); 
                isMove = false;

            });
        }
    };

    //jQ插件模式  
    $.fn.drag = function (options) {
        return this.each(function () {
            var $this = $(this),
                instance = $this.data('drag');
            if (!instance) {
                instance = new Drag(this, options);
                $this.data('drag', instance);
            } else {
                instance.init();
            }
            if (typeof options === 'string') {
                //instance.options[options].call(this);  
            }
        });
    };

    $.fn.drag.defaults = {
        before: $.noop,
        process: $.noop,
        end: $.noop
    };

    $.fn.drag.noConflict = function () {
        $.fn.drag = old;
        return this;
    };
})(jQuery);

//判断拖动对象是否在垃圾箱图标的范围内
function inOrOutWraper(dragObj) {
    var isInline = false;
    var $trashObj = $("#trashImg");
    var pos = $(dragObj).offset();
    var img = $trashObj.offset();
    if (pos.top >= 0 && pos.top <= img.top + $trashObj.height() - 3 && pos.left >= img.left - $trashObj.width() + 22 && pos.left <= img.left + $trashObj.width()) {
        $trashObj.get(0).style = "opacity:0.3;border:1px #000 dashed;background:#666;";
        isInline = true;
    }
    else {
        $trashObj.get(0).style = "opacity:0.8;border:0px;background:#none;";
        isInline = false;
    }
    return isInline;
}

function delIco(obj) {
    commonFuncJS.openConfirm('您想删除这个图标？', function () {
        $(obj).remove();
        //同时删除地图中的项
        var sourceId = $(obj).attr("randId");
        $(".sortTab li a").each(function () {
            var curSrcId = $(this).attr("randId");
            if (sourceId == curSrcId) {
                var liObj = $(this).parent();
                $(liObj).remove();
            }
        });
        //savemap();

        $(".trash").hide();//隐藏垃圾箱图标
        //删除成功后更新操作对象的数量
        var newCount = parseInt(operation.delCount) + 1;
        operation.delCount = newCount;
        sessionS.set("operation", JSON.stringify(operation));
    }, function () {
        //取消事件,将图标还原到拖动前的位置
        if (isInlineImg) {
            var pos = $(obj).data('startPos');
            var left = pos.left;
            var top = pos.top;
            $(obj).css({ "left": left, "top": top });
        }
        $(".trash").hide();//隐藏垃圾箱图标
    });
}

function initObject() {
    $(".newObj").each(function () {
        var pos = $(this).position();
        var id = $(this).attr("id");
        imgObject.push(id);
        imgObjectX.push(pos.left + $(this).width() / 2);
        imgObjectY.push(pos.top + $(this).height() / 2);
    })
}
//文件预览--针对左侧资源的预览
function filePreview(obj, icoType) {
    var id = $(obj).attr("hidSrc");
    oldRmbPage = $(obj).parent().attr('hidpage');
    var url = Constant.file_Url + "Preview.ashx";
    var filePath = "";
    curSourceGuiId = id;
    if (icoType == 10) {
        if ($(obj).attr("title") == undefined) {
            pptTitle = $(obj).html();
        } else {
            pptTitle = $(obj).attr("title");
        }
        ElementFileType = "PPT";
    }
    else if (icoType == "3_Task")  //教辅资源页面跳转预览
    {
        preLessonPageInit.BindResourceClick2(id, icoType);
        return false;
    }
    else {
        if ($(obj).attr("title") == undefined) {
            pptTitle = $(obj).html();
        } else {
            pptTitle = $(obj).attr("title");
        }
        ElementFileType = "Other";
    }
    GetPreviewUrl(id, ElementFileType, url, function (data) {
        filePath = data.URL;
        if (clicktag == 0) {    //防止快速重复点击
            clicktag = 1;
            SaveOperData(icoType, id);  //记录点击
            if (filePath == "" || filePath==null) {
                var url = Constant.webapi_Url + "ResourcePreview/" + id;
                $.getJSON(url, function (data) {
                    filePath = data;
                    curSourceGuiId = id;//写入全局变量，以后续使用
                    if ($(obj).attr("sourcetype") == "28") {
                        //去教学地图的结构上取数据
                        var imgJson = GetMapData(curSourceGuiId);
                        ImgView(imgJson[0], imgJson[1], filePath);    //调用多图弹框 
                    } else {
                        if (filePath == "0") {
                            commonFuncJS.openAlert("此文件已被删除或不存在！");
                        }
                        else {
                            movWin(filePath, icoType, id);//调用弹窗
                        }
                    }
                });
            }
            else {
                if ($(obj).attr("sourcetype") == 6 + "_1" || $(obj).attr("sourcetype") == 27 + "_1") {
                    //判断自然拼读资源
                    arlDialogWin1(filePath);
                }                
                else if ($(obj).attr("sourcetype") == "28") {
                    //去教学地图的结构上取数据
                    var imgJson = GetMapData(curSourceGuiId);
                    ImgView(imgJson[0], imgJson[1], filePath);    //调用多图弹框
                } else {
                    if (filePath == "0") {
                        commonFuncJS.openAlert("此文件已被删除或不存在！");
                    }
                    else {
                        movWin(filePath, icoType, id);//调用弹窗
                    }
                }
            }
            setTimeout(function () {
                clicktag = 0;
            }, 500);    //延迟500ms
        }
    });
}


function winClose() {
    var list = art.dialog.list;
    for (var i in list) {
        list[i].close();
    };
    //d.close();
}
//十字线
var cross = function (crossWraper) {
    var ox, oy;
    this.x = 0;
    this.y = 0;
    this.init = function () {
        if ($("#xObj").length > 0) {
            $("#xObj").remove();
        }
        if ($("#yObj").length > 0) {
            $("#yObj").remove();
        }
        ox = document.createElement('div');
        oy = document.createElement('div');
        ox.id = "xObj";
        $(crossWraper).append(ox);
        oy.id = "yObj";
        $(crossWraper).append(oy);
    }
    this.move = function (x, y) {
        var Sensitivity = 0;//灵敏度多少PX
        oy.style.left = x + 'px';
        ox.style.top = y + 'px';
        this.x = x;
        this.y = y;
        for (var i = 0; i < imgObjectX.length; i++) {
            var id = imgObject[i];
            var isCreat = false;
            //X轴触碰感知
            if (x >= imgObjectX[i] - Sensitivity && x <= imgObjectX[i] + Sensitivity) {
                //alert("触碰到一个X");
                $("#" + id).html('');
                $("#" + id).append("<div class='light'></div>");
                this.x = imgObjectX[i];
            }
            else {
                //Y轴触碰感知
                if (y >= imgObjectY[i] - Sensitivity && y <= imgObjectY[i] + Sensitivity) {
                    //alert("触碰到一个Y");                     
                    $("#" + id).html('');
                    $("#" + id).append("<div class='light'></div>");
                    this.y = imgObjectY[i];
                }
                else {
                    $("#" + id).html('');
                }
            }
        }
    }
    this.delete = function () {
        $(ox).remove();
        $(oy).remove();
    }
}