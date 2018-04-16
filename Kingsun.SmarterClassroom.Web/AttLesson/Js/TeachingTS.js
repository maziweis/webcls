var fullFlag = "false";    //授课全屏模式
var pagejson = [];
var pageNum = 0;
var curpage = 0;
var cradio = 0;
var carouselObj;
var rootPath = "";
var pageStart = "";
var pageEnd = "";
var initHeight = 770;
var isChinese = false;
var unitObject = [];//单元起始页码数组
var curUnitName = "";//当前单元名字
var CheckPage = false;//如果是上课页面就为true，放映为false
$(function () {
    //SetFull();
    var urlS = window.location.href;
    if (urlS.indexOf("AttLesson/Page/TeachingTS") != -1) {
        CheckPage = true;
    }
    if (typeof callHostFunction != "undefined" && CheckPage) {//电子白板打开
        callHostFunction.callBackFullScreen1();
    };
    fullFlag = "true";
    $(".headTitle").hide();
    $(".fullDiv").addClass("on");
    var strArr = BookJson.split("/");
    strArr.splice(strArr.length - 1, 1);
    rootPath = strArr.join("/") + "/";

    ///////////////////////加载攀登英语////////////////////////
    $.getScript(teachingInit.JsonJS, function (data) {
        var jsonObj = JSON.parse(dbJson);
        var htmlStr = "";
        var styleStr = "";
        var dfpageStart = 0;
        $(jsonObj.pageSource).each(function (index, items) {
            if (index == 0) {
                pageStart = items.pageId;
            }
            if (items.pageImg.indexOf("page") != -1 && dfpageStart==0) {
                dfpageStart = items.pageId;
            }
            if (index == jsonObj.pageSource.length - 1) {
                pageEnd = items.pageId;
            }
            pageNum++;
            pagejson.push(items);

        });
        var stpage = dfpageStart;
        if (teachingInit.PageNum != -100) {
            stpage = teachingInit.PageNum;
        };
        if (stpage % 2 != 0) {
            stpage -= 1;
        };
        curpage = stpage;
        //初始化加载第一页
        setItem(stpage);
        //初始化监控键盘左右方向键
        carouselObj.keyDown();
        //初始化绑定鼠标滑动和手指触摸事件
        var objS = document.getElementById("owl-item");
        objS.addEventListener('mousedown', _s, false);
        objS.addEventListener('mousemove', _m, false);
        objS.addEventListener('mouseup', _e, false);
        objS.addEventListener('touchstart', _s, false);
        objS.addEventListener('touchmove', _m, false);
        objS.addEventListener('touchend', _e, false);
        setReadBox();
    });
    initClick();
    TeachingMapBind();
});

var startX;
var startY;
function _s(e) {
    //e.preventDefault();//取消事件的默认动作
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
function _m(e) {
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
function _e(e) {
    //console.log("end");
    //判断移动端只有触摸没有滑动的情况
    if (moveEndX == 0 & moveEndY == 0) {
        return false;
    }
    if (Math.abs(X) > Math.abs(Y) && X > 0) {
        if (Math.abs(X) > 150) {
            //console.log("向右滑动！");
            prevpg();
        }
        //console.log("left 2 right");
    }
    else if (Math.abs(X) > Math.abs(Y) && X < 0) {
        if (Math.abs(X) > 150) {
            //console.log("向左滑动！");
            nextpg();
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

function ClickPageBack() {
    $(".activeD .next.unClick").on("click", function () {
        if ($(this).hasClass("unClick")) {
            commonFuncJS.tipAlert("已经是最后一页了~");
        }
    })
    $(".activeD .prev.unClick").on("click", function () {
        if ($(this).hasClass("unClick")) {
            commonFuncJS.tipAlert("这是第一页哦~");
        }
    })
}

//授课教学地图的初始方法
function TeachingMapBind() {
    allH = $(window).height();
    //设置教学地图资源列表的高度
    $(".jxScroll").height(allH - 78);
    //收缩教学地图
    $(".mapTab").on("click", function () {
        //$(this).next().slideToggle();
        var nav = $(this).parent();
        if (nav.hasClass("h")) {
            nav.removeClass("h");
            nav.animate({ "left": "-176px" }, 300);
        } else {
            nav.addClass("h");
            nav.animate({ "left": "0" }, 300);        }
    });

    //教学步骤下的资源点击
    $(".sortTab ul li a").on("click", function () {
        $(".sortTab ul li a").removeClass("cur");
        $(".sortTab h4").removeClass("cur");
        $(this).addClass("cur");
        $(this).parent().parent().prev().addClass("cur");
        //资源预览调用方法

    });
}


function initClick() {
    $(".pageList h3.currentName").on("click", function () {
        slideAnimate("open");
    });
    $(".catalogOl li").on("click", function () {
        var li = $(this);
        var UnitID = $(li).attr("id");
        ChangeTeachMap(UnitID);
        slideAnimate("close");
    });
    $("body").on("click", function (event) {
        var e = event || window.event || e; // 兼容IE7
        var obj = $(e.srcElement || e.target);
        if ($(obj).attr("class") == "currentName" || $(obj).attr("class") == "catalogOl") {
        }
        else {
            slideAnimate("close");
        }
    });
}
//选择教材目录开关
function slideAnimate(option) {
    var slideW = $(".catalogOl").width();
    if (option == "close") {
        $(".catalogOl").stop().animate({ left: -slideW }, 200);
    }
    else if (option == "open") {
        $(".catalogOl").stop().animate({ left: 0 }, 200);
    }
}
function switchPaget(pageID, obj) {
    $(".catalogOl li").removeClass("on");
    if (obj.title.indexOf("第") != -1) {
        $(obj).addClass("on");
    }
    else {
        $($(obj).next()).addClass("on");
    };
    if (pageID % 2 != 0) {
        pageID -= 1;
    }
    if (pageID == curpage) {
        return false;
    }
    setItem(pageID);
    setReadBox();
}
function setItem(ID) {
    var searchPageArray = [ID, ID + 1];
    if (AspxName != "LessonView")
        Update(teachingInit.UnitID, ID);//操作计录
    curpage = ID;
    var htmlStr = "";
    var styleStr = "";
    $.each(pagejson, function (index, items) {
        if ((ID == items.pageId || ID + 1 == items.pageId) && ID > pageStart && ID < pageEnd) {
            htmlStr += '<div class="page" hidpage="' + items.pageId + '" style="background-image:url(' + rootPath + '' + DBJsonPath + '/' + items.pageImg + ');display:none;">';
            var btns = items.buttons;
            if (btns) {
                var btn = btns.button
                $(btn).each(function (index, item) {
                    styleStr = 'style = "width:' + btn[index].width + 'px;height:' + btn[index].height + 'px;top:' + btn[index].y + 'px;left:' + btn[index].x + 'px;"'
                    htmlStr += '<a class="readbox" ' + styleStr + ' filetype="' + btn[index].eventtype + '" hidpage="' + items.pageId + '" soundstr="' + rootPath + '' + DBJsonPath + '/' + btn[index].soundsrc + '" href="javascript:void(0)" onclick="playAudio(\'' + rootPath + '' + DBJsonPath + '/' + btn[index].soundsrc + '\',this);"></a>';
                });
            };
            htmlStr += '</div>';
            $(".activeD .prev,.activeD .next").removeClass("unClick");
        };
        if (ID <= pageStart && index == 0) {
            htmlStr += '<div class="page" hidpage="' + items.pageId + '" style="background-image:url(' + rootPath + '' + DBJsonPath + '/' + items.pageImg + ');display:none;left:50%;margin-left:-25%;">';
            var btns = items.buttons;
            if (btns) {
                var btn = btns.button
                $(btn).each(function (index, item) {
                    styleStr = 'style = "width:' + btn[index].width + 'px;height:' + btn[index].height + 'px;top:' + btn[index].y + 'px;left:' + btn[index].x + 'px;"'
                    htmlStr += '<a class="readbox" ' + styleStr + ' filetype="' + btn[index].eventtype + '" hidpage="' + items.pageId + '" soundstr="' + rootPath + '' + DBJsonPath + '/' + btn[index].soundsrc + '" href="javascript:void(0)" onclick="playAudio(\'' + rootPath + '' + DBJsonPath + '/' + btn[index].soundsrc + '\',this);"></a>';
                });
            };
            htmlStr += '</div>';
            $(".activeD .prev").addClass("unClick");
            ClickPageBack();
        }
        if (ID >= pageEnd && index == pagejson.length - 1) {
            htmlStr += '<div class="page" hidpage="' + items.pageId + '" style="background-image:url(' + rootPath + '' + DBJsonPath + '/' + items.pageImg + ');display:none;left:50%;margin-left:-25%;">';
            var btns = items.buttons;
            if (btns) {
                var btn = btns.button
                $(btn).each(function (index, item) {
                    styleStr = 'style = "width:' + btn[index].width + 'px;height:' + btn[index].height + 'px;top:' + btn[index].y + 'px;left:' + btn[index].x + 'px;"'
                    htmlStr += '<a class="readbox" ' + styleStr + ' filetype="' + btn[index].eventtype + '" hidpage="' + items.pageId + '" soundstr="' + rootPath + '' + DBJsonPath + '/' + btn[index].soundsrc + '" href="javascript:void(0)" onclick="playAudio(\'' + rootPath + '' + DBJsonPath + '/' + btn[index].soundsrc + '\',this);"></a>';
                });
            };
            htmlStr += '</div>';
            $(".activeD .next").addClass("unClick");
            ClickPageBack();
        }
    });
    $(".item .page").remove();
    $(".item").append(htmlStr);
    $(".page").fadeIn(100);
    //调用方法
    carouselObj = new CarouselObj("owl-cont");
    screenSize();
    preloadPage(searchPageArray);

}
//$(window).resize(function () {
//    screenSize();//获取缩放比例及尺寸
//    autoSize();
//    fullScreenF();
//});

function screenSize() {
    //初始化判断是否全屏
    if (fullFlag == "true") {
        $(".headTitle").hide();
        $(".fullDiv").addClass("on");
    } else {
        $(".headTitle").show();
        $(".fullDiv").removeClass("on");
    }

    var imgRate = 770 / 960;//教材内页图片比例，高/宽
    headH = $(".headTitle").height();

    finalH = $(".item").height();
    finalW = parseInt(finalH / imgRate);
    boxWidth = finalW * 2;
    bili = finalH / initHeight;//当前放大或缩小的图片高度除以原始图片的高度为缩放比，原始图片的大小为694*973   
}
//上课书页高度根据屏幕适应
//function autoSize() {
//    $(".pageList").css({ "height": allH });
//    $(".device").css({ "height": finalH, "width": boxWidth });
//    $(".swiper-container").css({ "height": finalH, "width": boxWidth });
//    $(".swiper-slide").css({ "height": finalH, "width": boxWidth });
//    $(".doubleInbox").css({ "height": finalH, "width": finalW });
//    initHeight = finalH;
//    mySwiper.onResize();   //当你改变swiper 的尺寸而没有改变窗口大小时调用这个方法。
//}
//授课页面/反映页面全屏缩放
//function fullScreenF() {
//    //重置点读框的大小和位置
//    $(".readbox").each(function (index, items) {
//        var restWidth = $(items).width() * bili;
//        var restHeight = $(items).height() * bili;
//        var restTop = $(items).position().top * bili;
//        var restLeft = $(items).position().left * bili;
//        var restStyle = "width:" + restWidth + "px;height:" + restHeight + "px;top:" + restTop + "px;left:" + restLeft + "px;";
//        $(items).attr("style", restStyle);
//    });
//    //重置拖拽保存的按钮
//    $(".newObj").each(function (index, items) {
//        var restWidth = $(items).width() * bili;
//        var restHeight = $(items).height() * bili;
//        var restTop = $(items).position().top * bili;
//        var restLeft = $(items).position().left * bili;
//        if (loginName != "admin") {//非管理员边框透明
//            noBorder = "border-color:transparent;";
//            var restStyle = "width:" + restWidth + "px;height:" + restHeight + "px;top:" + restTop + "px;left:" + restLeft + "px;" + noBorder;
//        } else {
//            var restStyle = "width:" + restWidth + "px;height:" + restHeight + "px;top:" + restTop + "px;left:" + restLeft + "px;";
//        }
//        $(items).attr("style", restStyle);
//    });
//    //重置内置DB中的按钮
//    $(".newObj_1").each(function (index, items) {
//        var restWidth = $(items).width() * bili;
//        var restHeight = $(items).height() * bili;
//        var restTop = $(items).position().top * bili;
//        var restLeft = $(items).position().left * bili;
//        var restStyle = "width:" + restWidth + "px;height:" + restHeight + "px;top:" + restTop + "px;left:" + restLeft + "px;";
//        $(items).attr("style", restStyle);
//    })
//}

//点读
function setReadBox() {
    $(".readbox").each(function (index, items) {
        $(items).css({ "width": $(items).width() / cradio + 'px', "height": $(items).height() / cradio + 'px', "top": $(items).position().top / cradio + 'px', "left": $(items).position().left / cradio + 'px' });
    });
}
//查询指定页码的信息
function preloadPage(searchPageArray) {
    var object = SelWaterData(searchPageArray);
    if (typeof object == "undefined" || object == null || object.length == 0) {
        return;
    }
    for (var i = 0; i < object.length; i++) {
        if (object[i] == "" || typeof object[i] == "undefined") {
            return true;
        };
        var jsonObj = JSON.parse(object[i]);
        var pageId = jsonObj.pageNum;
        var btn = jsonObj.btns;
        var temp1 = "";
        for (var n = 0; n < btn.length; n++) {
            var dragItem = btn[n];
            ratio = finalH / 770;  //查询指定页的数据是从数据库中取出来的，所以比例要用初始化的
            var left = btn[n].X * ratio;
            var top = btn[n].Y * ratio;
            var title = btn[n].title;
            /*获取按钮的大小*/
            //var objWidth = 48, objHeight = 70;
            //var posW = objWidth * ratio;
            //var posH = objHeight * ratio;
            var isRead = dragItem.isread;
            if (isChinese && isRead && (btn[n].icoType == 27 || btn[n].icoType == 6)) {
                //管理员并且是语文热区类型
                var readW, readH;
                if (btn[n].icoType == 27) { readW = 38; readH = 43; }
                if (btn[n].icoType == 6) { readW = 20; readH = 20; }
                readW = Math.ceil(readW * ratio);
                readH = Math.ceil(readH * ratio);
                if (loginName != "admin") { noBorder = "border-color:transparent;"; left = left - 1; top = top - 1; }//非管理员边框透明
                temp1 += '<div class="newObj isRead readbox' + btn[n].icoType + '" hidsrc="' + btn[n].sourceUrl + '" sourcetype="' + btn[n].icoType + '" id="' + btn[n].id + '" style="left:' + left + 'px;top:' + top + 'px;width:' + readW + 'px;height:' + readH + 'px;' + noBorder + ';" title="' + title + '"></div>';
            }
            else {
                temp1 += '<div class="newObj imgIco' + btn[n].icoType + '" hidsrc="' + btn[n].sourceUrl + '" sourcetype="' + btn[n].icoType + '" id="' + btn[n].id + '" style="left:' + left + 'px;top:' + top + 'px;" title="' + title + '"></div>';
            }

            //temp1 += '<div class="newObj imgIco' + btn[n].icoType + '" hidsrc="' + btn[n].sourceUrl + '" sourcetype="' + btn[n].icoType + '" id="' + btn[n].id + '" style="left:' + left + 'px;top:' + top + 'px;"></div>';
        }
        //找到匹配页码前插入按钮
        var curWraper;
        $(".item .page").each(function () {
            var curPage = $(this).attr("hidpage");
            if (curPage == pageId) {
                $(this).find("div.newObj").remove();//先清空以前的按钮再加入
                $(this).append(temp1);
                curWraper = $(this);
            }
        })
    }

    //新创建按钮动态绑定事件
    $("div.newObj").bind("click", function () {
        icoClick($(this).get(0));
    })
}
//创建对象 
var CarouselObj = function (ID) {
    var _this = this;
    this.n = 0;
    this.bili = 1920 / 770;	//背景图比例
    this.H = $(window).height();
    this.W = $(window).width();
    //console.log(this.H + ',' + this.W);

    //if (this.H > 800) {
    //    this.h = this.H;
    //    this.topS = (this.H - this.h - getScrollbarWidth()) / 2
    //} else {
    //    this.h = this.H;
    //    this.topS = 0;
    //}
    //this.w = this.h * this.bili;
    this.w = this.W;
    this.h = this.w / this.bili;
    this.topS = (this.H - this.h - getScrollbarWidth()) / 2
    this.radio = 770 / this.h;
    cradio = this.radio;
    this.outer = document.getElementById(ID);
    this.inner = $(this.outer).find(".item");
    this.num = pageNum;
    //this.num = $(this.outer).find(".item").length;
    //初始化
    this.initial(this.inner);
    //结构垂直居中
    this.positionXY(this.outer);
    //监控页面滑动
    this.scrollFun($("#owl-cont"));
    //上下切换
    //this.prev($('.prev'));
    //this.next($('.next'));
    //监控页面缩放
    this.resize($(window));
    //监控键盘左右方向键
    //this.keyDown();
}
//初始化
CarouselObj.prototype.initial = function (obj) {
    var _this = this;
    obj.width(this.w);
    obj.height(this.h);
    obj.parent().width(this.w * obj.length);
    obj.parent().parent().height(this.h);
    obj.parent().height(this.h);
}
//结构垂直居中
CarouselObj.prototype.positionXY = function (obj) {
    $(obj).css({ "position": "relative", "top": this.topS });
}
//监控页面缩放
CarouselObj.prototype.resize = function (obj) {
    _this = this;
    obj.resize(function () {
        var _height = $('#owl-cont').height();  //缩放前的高度
        _this.H = $(window).height();
        _this.W = $(window).width();
        //if (_this.H > 800) {
        //    _this.h = _this.H;
        //    _this.topS = (_this.H - _this.h - getScrollbarWidth()) / 2
        //} else {
        //    _this.h = _this.H;
        //    _this.topS = 0;
        //}
        //_this.w = _this.h * _this.bili;
        _this.w = _this.W;
        _this.h = _this.w / _this.bili;
        _this.topS = (_this.H - _this.h - getScrollbarWidth()) / 2
        _this.initial(_this.inner);
        //页面缩放时，动态修改点读框的属性
        $('#owl-cont').css({ "position": "relative", "top": _this.topS });
        var radio = _height / _this.h;
        $(".readbox").each(function (index, items) {
            var newW = $(items).width() / radio;
            var newH = $(items).height() / radio;
            var newTop = $(items).position().top / radio;
            var newLeft = $(items).position().left / radio;
            $(items).css({ "width": newW + 'px', "height": newH + 'px', "top": newTop + 'px', "left": newLeft + 'px' });
        });

        $(".newObj").each(function (index, items) {
            var newW = $(items).width() / radio;
            var newH = $(items).height() / radio;
            var newTop = $(items).position().top / radio;
            var newLeft = $(items).position().left / radio;
            $(items).css({ "width": newW + 'px', "height": newH + 'px', "top": newTop + 'px', "left": newLeft + 'px' });
        });

        $(".newObj_1").each(function (index, items) {
            var newW = $(items).width() / radio;
            var newH = $(items).height() / radio;
            var newTop = $(items).position().top / radio;
            var newLeft = $(items).position().left / radio;
            $(items).css({ "width": newW + 'px', "height": newH + 'px', "top": newTop + 'px', "left": newLeft + 'px' });
        });
    });
}
//监控页面滑动
CarouselObj.prototype.scrollFun = function (obj) {
    _this = this;
    obj.scroll(function () {	//监控滚动
        _this.n = parseInt(obj.scrollLeft() / _this.w);	//向上取整
    })
}
//上下切换
CarouselObj.prototype.prev = function (obj) {
    _this = this;
    obj.css('top', (this.H - obj.height()) / 2);
    if (curpage == 0) {
        $(".activeD .prev").addClass("unClick");
        ClickPageBack();
    }
}
function prevpg() {
    //切换页码时，重置页面上的跟读全文
    clearInterval(timeObjId1);
    clearTimeout(setT1);
    pause();    //每次滑动页面，关闭之前页面上的所有点读;
    if (!($(".activeD .prev").hasClass("unClick"))) {
        curpage -= 2;
        if (curpage >= pageStart - 1) {
            $(".item").animate({
                left: _this.w
            }, 200, function () {
                $(this).find("page").remove();
                $(".item").css("left", 0);
                setItem(curpage);
                $(".activeD .next").removeClass("unClick");
                $(".catalogOl li").removeClass("on");
                $($(".catalogOl li[hidpage=" + curpage + "]")).addClass("on");
                setReadBox();
            });
            if (curpage <= pageStart) {
                $(".activeD .prev").addClass("unClick");
                $(".activeD .prev.unClick").off("click");
                ClickPageBack();
            }

        }
    }
};

CarouselObj.prototype.next = function (obj) {
    _this = this;
    obj.css('top', (this.H - obj.height()) / 2);
}
function nextpg() {
    //切换页码时，重置页面上的跟读全文
    clearInterval(timeObjId1);
    clearTimeout(setT1);
    pause();    //每次滑动页面，关闭之前页面上的所有点读;
    if (!($(".activeD .next").hasClass("unClick"))) {
        curpage += 2;
        if (curpage == pageEnd) {
            $(".activeD .next").addClass("unClick");
            $(".activeD .next.unClick").off("click");
            ClickPageBack();
        }
        if (curpage <= pageEnd) {
            $(".item").animate({
                left: -(_this.w)
            }, 200, function () {
                $(this).find("page").remove();
                $(".item").css("left", 0);
                setItem(curpage);
                $(".activeD .prev").removeClass("unClick");
                $(".catalogOl li").removeClass("on");
                $(".catalogOl li[hidpage=" + curpage + "]").addClass("on");
                setReadBox();
            });

        }
    }
}
//监控键盘左右方向键
CarouselObj.prototype.keyDown = function () {
    $(document).keydown(function (e) {        
        var keyCode = e.keyCode;
        switch (keyCode) {
            case 37: {	//左键
                if ($(".aui_outer").parent().is(":visible") || $(".mask").is(":visible")) {
                    return false;
                }
                e.preventDefault();
                if (curpage > pageStart) {                    
                    prevpg();
                }
                else
                    return false;
                //$('.prev').click();
                break;
            }
            case 39: {	//右键
                if ($(".aui_outer").parent().is(":visible") || $(".mask").is(":visible")) {
                    return false;
                }
                e.preventDefault();
                if (curpage < pageEnd - 1)
                    nextpg()
                else
                    return false;
                //$('.next').click();
                break;
            }
        }
    })
}
//跳转页面
CarouselObj.prototype.goTo = function (num) {
    $("#owl-cont").stop().animate({ scrollLeft: Math.ceil(_this.w * (num - 1)) }, 500);
}
//获取滚动条的宽度
function getScrollbarWidth() {
    var oP = document.createElement('p'),
        styles = {
            width: '100px',
            height: '100px',
            overflowY: 'scroll'
        }, i, scrollbarWidth;
    for (i in styles) oP.style[i] = styles[i];
    document.body.appendChild(oP);
    scrollbarWidth = oP.offsetWidth - oP.clientWidth;
    oP.remove();
    return scrollbarWidth;
}


//进入全屏与退出全屏的方法
function SetFull(obj) {
    if (typeof callHostFunction != "undefined") {//电子白板打开
        callHostFunction.callBackFullScreen();
    };

    if (fullFlag == "true") {
        fullFlag = "false";
        $(".headTitle").show();
        $(".fullDiv").removeClass("on");
    } else {
        fullFlag = "true";
        $(".headTitle").hide();
        $(".fullDiv").addClass("on");
    }
}

//图标点击弹窗事件
function icoClick(obj) {
    var id = $(obj).attr("hidSrc");
    var hidpage = $(obj).attr("hidpage");
    if (hidpage != undefined) {
        hidpage = parseInt(hidpage);

        if (hidpage % 2 != 0) {
            hidpage -= 1;
        }
    }
    if (hidpage != undefined && hidpage != curpage) {
        curpage = hidpage;
        setItem(hidpage);
    }
    var icoType = $(obj).attr("sourcetype");
    var url = Constant.file_Url + "Preview.ashx";
    var FileType = "Other";
    curSourceGuiId = id;
    if (icoType == 10)
        FileType = "PPT";
    GetPreviewUrl(id, FileType, url, function (data) {
        if (clicktag == 0) {    //防止快速重复点击
            clicktag = 1;
            SaveOperData(icoType, id);  //记录点击
            var filePath = data.URL;
            if (filePath == "") {
                var url = Constant.webapi_Url + "ResourcePreview/" + id;
                $.getJSON(url, function (data) {
                    if (data.indexOf(id) != -1) {
                        filePath = data;
                        curSourceGuiId = id;//写入全局变量，以后续使用
                        if ($(obj).attr("sourcetype") == "28") {
                            //去教学地图的结构上取数据
                            var imgJson = GetMapData(curSourceGuiId);
                            ImgView(imgJson[0], imgJson[1], filePath);    //调用多图弹框 
                        } else {
                            movWin(filePath, icoType, id);//调用弹窗
                        }
                    } else {
                        commonFuncJS.openAlert("此文件已被删除或不存在！");
                        //console.log("没有获取到相应的资源路径！");
                    }
                });
            }
            else {
                if ($(obj).attr("sourcetype") == 6 + "_1" || $(obj).attr("sourcetype") == 27 + "_1") {
                    //判断自然拼读资源
                    arlDialogFullWin(filePath);
                } else if ($(obj).attr("sourcetype") == "28") {
                    //去教学地图的结构上取数据
                    var imgJson = GetMapData(curSourceGuiId);
                    ImgView(imgJson[0], imgJson[1], filePath);    //调用多图弹框
                }
                else {
                    movWin(filePath, icoType, id);//调用弹窗
                }
            }
        }
        setTimeout(function () {
            clicktag = 0;
        }, 500);    //延迟500ms
    });
    //SaveOperData(icoType, id);
    //全屏预览
    findDimensions();//获取浏览器实际宽高度    
    $(".view .aui_content").css({ "width": winWidth, "height": winHeight, "left": 0, "top": 0 })
};

//组装地图列表
function setupMapList(listJson) {
    if (listJson == "") {
        //模拟数据加载
        var str = "";
        var curIndex = 1;
        str += '<div class="sortTab">';
        str += '	<h4 class="open cur nullNode"><span class="ico"></span><b>第' + ArabiaToChinese(curIndex) + '步：课堂导入</b><em class="setEm"></em></h4>';
        str += '	<ul id="sortlist1"></ul>';
        str += '</div>';
        $(".jxScroll").html(str);
        return;
    }
    var jsonObj = JSON.parse(listJson);
    var str = "", curCalss;
    $.each(jsonObj, function (index, items) {
        var name = this.stepName;
        var list = this.liList;
        var curIndex = index + 1;
        str += '<div class="sortTab">';
        if (index == jsonObj.length - 1) {//最后一项高亮
            if (index = jsonObj.length - 1) {//最后步骤项没有子节点时
                if (list.length == 0) {
                    curCalss = "cur endNode";
                }
                else {
                    curCalss = "cur";
                }
            }
            else {
                curCalss = "cur";
            }
        }
        if (jsonObj.length == 1 && list.length == 0) {
            str += '<h4 class="open ' + curCalss + '"><span class="ico"></span><b>第' + ArabiaToChinese(curIndex) + '步：课堂导入</b><em class="setEm" onclick="delSetp(this)"></em></h4>';
        }
        else {
            if (list.length == 0) {
                str += '<h4 class="open ' + curCalss + '"><span class=""></span><b>' + name + '</b><em class="setEm" onclick="delSetp(this)"></em></h4>';
            }
            else {
                str += '<h4 class="open ' + curCalss + '"><span class="ico showIco"></span><b>' + name + '</b><em class="setEm" onclick="delSetp(this)"></em></h4>';
            }
        }
        if (list.length == 0 && index != jsonObj.length - 1) {
            str += '<ul class="nochild" id="sortlist' + curIndex + '">';
        }
        else {
            if (index == jsonObj.length - 1) {
                str += '<ul id="sortlist' + curIndex + '">';
            }
            else {//默认是关闭的，显示一个线条
                str += '<ul class="nochild" id="sortlist' + curIndex + '">';
            }
        }        
        $.each(list, function (index, item) {
            var id = item.id;
            var pageNum = item.pageNum;
            var sourceSrc = item.sourceSrc;
            var sourcetype = item.sourcetype;
            var sourceName = item.sourceName;
            var comeFrom = item.comeFrom;
            str += '<li><a href="#none" hidpage="' + pageNum + '" hidId="' + id + '" hidsrc="' + sourceSrc + '" sourcetype="' + sourcetype + '" comeFrom="' + comeFrom + '">' + sourceName + '</a></li>';
        })
        str += '</ul>';
        str += '</div>';
    });
    $(".jxScroll").html(str);
    bindOpenEvent();//绑定链接事件    
}

//绑定点击打开事件
function bindOpenEvent() {
    $(".sortTab ul li a").bind("click", function () {
        $(".sortTab ul li").removeClass("sortable-drag");
        $(".sortTab ul li a").removeClass("cur");
        $(".sortTab h4.cur").removeClass("cur");
        $(this).addClass("cur");
        var hObj = $(this).parents("ul").eq(0).prev();
        hObj.addClass("cur");
        //调用弹窗事件
        icoClick($(this).get(0));
    })
    $(".sortTab h4").bind("click", function () {
        unfold(this); //展开折叠节点
    });
}
//展开折叠步骤节点  
function unfold(obj) {
    var ulObj = $(obj).next();
    var isLastUl = false;//是否是最后一个UL节点
    if ($('.sortTab ul').last().attr("id") === ulObj.attr("id")) {
        isLastUl = true;
    } else {
        isLastUl = false;
    }
    if (ulObj.children("li").length == 0) { return; }
    if (ulObj.hasClass("close")) {//展开
        $(ulObj).removeClass("close").removeClass("nochild");;
        if (isLastUl) {
            $(ulObj).children("li").eq(0).removeClass("lastclose");
        }
        else {
            //$(ulObj).removeClass("nochild");
        }
        $(obj).addClass("open");
        if ($(obj).hasClass("endNode")) {//最后一个步骤节点
            $(obj).removeClass("endNode");
        }

    }
    else {//折叠
        $(ulObj).addClass("close");
        if (isLastUl) {
            $(ulObj).children("li").eq(0).addClass("lastclose");
        }
        else {
            $(ulObj).addClass("nochild");
        }
        $(obj).removeClass("open");
        var index = $('.sortTab ul').index($(ulObj));
        var count = $('.sortTab ul').length;
        if (index == count - 1) {
            $(obj).addClass("endNode");
        }

    }
}
//阿拉伯数字转换为简写汉字
function ArabiaToChinese(Num) {
    for (i = Num.length - 1; i >= 0; i--) {
        Num = Num.replace(",", "")//替换Num中的“,”
        Num = Num.replace(" ", "")//替换Num中的空格
    }
    if (isNaN(Num)) { //验证输入的字符是否为数字
        //alert("请检查小写金额是否正确");
        return;
    }
    //字符处理完毕后开始转换，采用前后两部分分别转换
    part = String(Num).split(".");
    newchar = "";
    //小数点前进行转化
    for (i = part[0].length - 1; i >= 0; i--) {
        if (part[0].length > 10) {
            //alert("位数过大，无法计算");
            return "";
        }//若数量超过拾亿单位，提示
        tmpnewchar = ""
        perchar = part[0].charAt(i);
        switch (perchar) {
            case "0": tmpnewchar = "零" + tmpnewchar; break;
            case "1": tmpnewchar = "一" + tmpnewchar; break;
            case "2": tmpnewchar = "二" + tmpnewchar; break;
            case "3": tmpnewchar = "三" + tmpnewchar; break;
            case "4": tmpnewchar = "四" + tmpnewchar; break;
            case "5": tmpnewchar = "五" + tmpnewchar; break;
            case "6": tmpnewchar = "六" + tmpnewchar; break;
            case "7": tmpnewchar = "七" + tmpnewchar; break;
            case "8": tmpnewchar = "八" + tmpnewchar; break;
            case "9": tmpnewchar = "九" + tmpnewchar; break;
        }
        switch (part[0].length - i - 1) {
            case 0: tmpnewchar = tmpnewchar; break;
            case 1: if (perchar != 0) tmpnewchar = tmpnewchar + "十"; break;
            case 2: if (perchar != 0) tmpnewchar = tmpnewchar + "百"; break;
            case 3: if (perchar != 0) tmpnewchar = tmpnewchar + "千"; break;
            case 4: tmpnewchar = tmpnewchar + "万"; break;
            case 5: if (perchar != 0) tmpnewchar = tmpnewchar + "十"; break;
            case 6: if (perchar != 0) tmpnewchar = tmpnewchar + "百"; break;
            case 7: if (perchar != 0) tmpnewchar = tmpnewchar + "千"; break;
            case 8: tmpnewchar = tmpnewchar + "亿"; break;
            case 9: tmpnewchar = tmpnewchar + "十"; break;
        }
        newchar = tmpnewchar + newchar;
    }
    //替换所有无用汉字，直到没有此类无用的数字为止
    while (newchar.search("零零") != -1 || newchar.search("零亿") != -1 || newchar.search("亿万") != -1 || newchar.search("零万") != -1) {
        newchar = newchar.replace("零亿", "亿");
        newchar = newchar.replace("亿万", "亿");
        newchar = newchar.replace("零万", "万");
        newchar = newchar.replace("零零", "零");
    }
    //替换以“一十”开头的，为“十”
    if (newchar.indexOf("一十") == 0) {
        newchar = newchar.substr(1);
    }
    //替换以“零”结尾的，为“”
    if (newchar.lastIndexOf("零") == newchar.length - 1) {
        newchar = newchar.substr(0, newchar.length - 1);
    }
    return newchar;
};
function ChangeTeachMap(UnitID) {
    var CurTeachMap;
    if (AspxName == "LessonView") {
        CurTeachMap = sessionS.get("mapArr");
        if (CurTeachMap == "" || CurTeachMap == null)
        CurTeachMap = teachLessonManage.GetCurTeachMap(UserID, teachingInit.BookID, UnitID);
    }else
    //var CurTeachMap = teachLessonManage.GetCurTeachMap('b9010443-6ac9-465a-98b8-1970169855c9', 266, 282796);
    CurTeachMap = teachLessonManage.GetCurTeachMap(UserID, teachingInit.BookID, UnitID);
    setupMapList(CurTeachMap);
};