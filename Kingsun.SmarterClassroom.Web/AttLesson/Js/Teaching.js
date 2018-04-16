// JavaScript Document
// 内容页
var ratio = 1;//缩放比例
var pageIndex = 1;
var data;
var mySwiper;
var timeObjId = 1;
var itemIndex = 1;//当题小题序号，从1开始，以供前后翻页调用
var itemsNum = 0;//大题下小题的数量
var curSourcePath = "";//当前弹窗中的资源路径
var curPlat;//当前平台
var curShowStart = 2;//当前显示的第一页
var curShowEnd = 3;//当前显示的第二页
var loadStart = 2;//翻屏时预加载的开始页
var loadEnd = 3;//翻屏时预加载的结束页
var firstPage;//书本的第一页
var endPage;//书本的最后一页
var loadPageArray = [];//要加载的页码数组
var swiperIndex = 0;//swiper默认显示的序号
var curScrollIndex = 0;//当前一屏的序号，从0开始，用来判断滑动方向
var CheckPage = false;//如果是上课页面就为true，放映为false
var temp;
var initHeight = 1046;
var fullFlag="false";    //授课全屏模式
//var rootPath = "http://192.168.3.93:8001/Course/TextBook/Ekook1/";
//var rootPath = "../../Resource/";
var rootPath = "";
var unitObject = [];//单元起始页码数组
var allPages = 0;//所有书页
var white = "../../App_Theme/images/White.png";
var curSourceGuiId;
var isChinese = false;
var isPC = IsPC();
var isFirstLoad = true;//判断是否第一次进入，防止onTransitionEnd调用两次
var curUnit = "";//当前单元ID
var curUnitName = "";//当前单元名字
var officeFileInfo = [];//授课初始化下载的office系列文件ID和保存名字信息
var IfChangeMap = true;//用来判断在点击教学地图资源造成的翻页时，不改变教学地图，默认是改变
$(function () {
    EscFun();
    var urlS = window.location.href;
    if (urlS.indexOf("AttLesson/Page/Teaching")!=-1) {
        CheckPage = true;
    }
    getLoginName();//获取登录用户名
    screenSize();//获取缩放比例及尺寸
    var strArr = BookJson.split("/");
    strArr.splice(strArr.length - 1, 1);
    rootPath = strArr.join("/") + "/";
    //initTree();//初始化树节点
    //SetFull();
    if (typeof callHostFunction != "undefined" && CheckPage) {//电子白板打开
        callHostFunction.callBackFullScreen1();
    };
    fullFlag = "true";
    $(".headTitle").hide();
    $(".fullDiv").addClass("on");
    //getCookiePageNum();   
    initLoadData();
    changePage();
    
    //向前翻屏事件
    $('.arrow-left').on('click', function (e) {
        if (clicktag == 0) {
            clicktag = 1;            
            //var fdsgf = getCurPageArray();
            //actTz(fdsgf.split("-")[0]-2);
            e.preventDefault();        
            mySwiper.slidePrev();
            setTimeout(function () {
                clicktag = 0;
            }, 500);
        }
    })
    //向后翻屏事件
    $('.arrow-right').on('click', function (e) {
        if (clicktag == 0) {
            clicktag = 1;
            e.preventDefault();
            mySwiper.slideNext();
            setTimeout(function () {
                clicktag = 0;
            }, 500);
        }
    });

    //监控键盘左右方向键
    BindKeyDown();
    //底部隐藏工具栏
    //$('body').bind('click', function (event) {
    //    // IE支持 event.srcElement ， FF支持 event.target    
    //    var evt = event.srcElement ? event.srcElement : event.target;
    //    if (evt.id == 'btnTools' || evt.id == 'btnTool') {
    //        $('#btnTools').show();
    //    } else {
    //        $('#btnTools').hide(); // 如不是则隐藏元素
    //        $('#btnTool').show();
    //    }
    //});

    TeachingMapBind();
});

function ClickPageBack() {
    $(".arrow-right.unClick").on("click", function () {
        if ($(this).hasClass("unClick")) {
            commonFuncJS.tipAlert("已经是最后一页了~");
        }
    })
    $(".arrow-left.unClick").on("click", function () {
        if ($(this).hasClass("unClick")) {
            commonFuncJS.tipAlert("这是第一页哦~");
        }
    })
}

//监控键盘左右方向键
function BindKeyDown(){
    $(document).on("keydown",function (e) {
        var keyCode = e.keyCode;
        switch (keyCode) {
            case 37: {
                if ($(".aui_outer").parent().is(":visible") || $(".mask").is(":visible")){
                    return false;
                }
                e.preventDefault();
                $('.arrow-left').click();
                break;
            }
            case 39: {
                if ($(".aui_outer").parent().is(":visible") || $(".mask").is(":visible")) {
                    return false;
                }
                e.preventDefault();
                $('.arrow-right').click();
                break;
            }
        }
    });
}
//解绑键盘左右方向键
function UnBindKeyDown() {
    $(document).off("keydown");
}

function initTree() {    
    $(".pageList h3.currentName").on("click", function () {
        slideAnimate("open");
    });
    $(".pageList .catalogOl li").each(function (index,item) {        
        var t = $(this).attr("pagestart");
        var e = $(this).attr("pageend");
        unitObject.push(t + "-" + e);
        if (index == 0) {
            if (item.className == "module") {
                $(this).next().addClass("highlight");
            }
            else {
                $(this).addClass("highlight");
            }
        }
    });
    if (teachingInit.UnitID != -1 && teachingInit.UnitID != "" && teachingInit.UnitID!=null) {
        $(".pageList .catalogOl li").removeClass("highlight");
        $(".pageList .catalogOl li[id=" + teachingInit.UnitID + "]").addClass("highlight");
    }
    var unitname = $(".highlight").text(); var txtname = "";
    if ($(".highlight").hasClass("module")) {
        $(".pageList .catalogOl li").removeClass("highlight");
        $(".pageList .catalogOl li[id=" + teachingInit.UnitID + "]").next().addClass("highlight");
        var unitname = $(".highlight").text();
    }
    if (unitname.indexOf("Module") != -1 || unitname.indexOf("Unit") != -1 || unitname.indexOf("Recycle") != -1) {
        var strArr = unitname.split(" ");
        txtname = strArr[0] + " " + strArr[1];
    } else {
        txtname = unitname;
    }
    $("#unitFull").text(unitname);
    //单元节点点击选择
    $(".catalogOl li").on("click", function () {
        var li = $(this);        
        if (li.attr("class") == "module" && $(li.next()).attr("class") != "module" && li.next().length != 0) {
            $(li.next()).click();
            return false;
        }
        var unitname = $(this).text(); var txtname = "";
        if (unitname.indexOf("Module") != -1 || unitname.indexOf("Unit") != -1 || unitname.indexOf("Recycle") != -1) {
            var strArr = unitname.split(" ");
            txtname = strArr[0] + " " + strArr[1];
        } else {
            txtname = unitname;
        }
        var id = $(this).attr("id");
        $("#unitFull").text(unitname);
        //$(".pageList h3.currentName").text(txtname);

        var startPage = $(this).attr("pagestart");
        //var endPage = $(this).attr("PageEnd");
        var UnitID = $(this).attr('id');
        ChangeTeachMap(UnitID);
        curShowStart = startPage;
        curShowEnd = parseInt(startPage) + 1;
        swiperIndex = parseInt((startPage - firstPage) / 2);
        actTz(startPage);
        //loadSlider(swiperIndex);//动态加载swiper
        getCurPageArray();
        temp = [loadPageArray[0], loadPageArray[1]];
        preloadPage(temp);
        $(".pageList .catalogOl li").each(function () {
            $(this).removeClass("highlight");
        })
        $(this).addClass("highlight");
        slideAnimate("close");
        var fdg = Resources;
        curUnitName = Common.ClearString(unitname);//\ / : * ？ " < > |
        Update(UnitID, startPage, unitname);//操作计录
    });
    $("body").on("click", function (event) {
        var e = event || window.event || e; // 兼容IE7
        var obj = $(e.srcElement || e.target);
        if ($(obj).attr("class") == "currentName" || $(obj).attr("class") == "catalogOl") {
        }
        else {
            slideAnimate("close");
            $('.pageList h3.currentName').show(500);
        }
    });
}


//选择教材目录开关
function slideAnimate(option) {    
    var slideW = $(".catalogOl").width();
    //console.log(slideW);
    if (option == "close") {
        $(".catalogOl").parent().width(0);
        
        $(".catalogOl").stop().animate({ left: -slideW }, 200);
    }
    else if (option == "open") {
        $(".catalogOl").parent().width($(".catalogOl").width());
        $(".catalogOl").stop().animate({ left: 0, scrollTop: $(".catalogOl .highlight").offset().top }, 200);
    }
}

//解决缩放页面resize触发两次
var nStr = 0;
$(window).resize(function () {
    //移动端无需resize，避免弹出虚拟键盘时触发，给页面渲染提速
    if (browserRedirect()) {
        return;
    }
    screenSize();//获取缩放比例及尺寸
    autoSize();
    fullScreenF();
});

function screenSize() {
    //初始化判断是否全屏
    if (fullFlag == "true") {
        $(".headTitle").hide();
        $(".fullDiv").addClass("on");
    } else {
        $(".headTitle").show();
        $(".fullDiv").removeClass("on");
    }
    $(".device").css({"margin":"0 auto","top":"10px"});
    var imgRate = 1046 / 747;//教材内页图片比例，高/宽
    allH = $(window).height();
    headH = $(".headTitle").height();
    var boxSizeTop = parseInt($(".device").css("top").split('px')[0]) + parseInt($(".device").css("padding-top").split('px')[0]);//上边距
    var boxSizeBottom = parseInt($(".device").css("top").split('px')[0]) + parseInt($(".device").css("padding-bottom").split('px')[0]);//下边距
    var paddingSize = parseInt($(".device").css("padding-bottom").split('px')[0]) + parseInt($(".device").css("padding-top").split('px')[0]);

    //var boxWidth = Math.ceil(finalW * 2 + 20);//上舍入
    finalH = allH - boxSizeTop - boxSizeBottom;
    //finalH = allH - headH - boxSizeTop - boxSizeBottom - 40;
    //finalW = finalH / 1.4;
    finalW = parseInt(finalH / imgRate);
    //boxWidth = finalW * 2 + 22;
    boxWidth = finalW * 2;
    //如果最终计算出来的宽度超过或等于屏幕宽度，则以宽度进行适配
    if (boxWidth + paddingSize >= $(window).width()) {
        boxWidth = parseInt($(window).width() - paddingSize - 10);
        finalW = parseInt(boxWidth / 2);
        finalH = parseInt(finalW * imgRate);
        $(".device").css({ "margin": "0 auto", "top": ($(window).height() - finalH - paddingSize) / 2 });
    }
    bili = finalH / initHeight;//当前放大或缩小的图片高度除以原始图片的高度为缩放比，原始图片的大小为694*973
}

//上课书页高度根据屏幕适应
function autoSize() {    
    $(".pageList").css({ "height": allH });
    $(".device").css({ "height": finalH, "width": boxWidth });
    $(".swiper-container").css({ "height": finalH, "width": boxWidth });
    $(".swiper-slide").css({ "height": finalH, "width": boxWidth });
    $(".doubleInbox").css({ "height": finalH, "width": finalW });
    initHeight = finalH;
    if (mySwiper) {
        mySwiper.onResize();   //当你改变swiper 的尺寸而没有改变窗口大小时调用这个方法。
    }
}

//授课页面/反映页面全屏缩放
function fullScreenF() {
    //重置点读框的大小和位置
    $(".readbox").each(function (index, items) {
        var restWidth = $(items).width() * bili;
        var restHeight = $(items).height() * bili;
        var restTop = $(items).position().top * bili;
        var restLeft = $(items).position().left * bili;
        var restStyle = "width:" + restWidth + "px;height:" + restHeight + "px;top:" + restTop + "px;left:" + restLeft + "px;";
        $(items).attr("style", restStyle);
    });
    //重置拖拽保存的按钮
    $(".newObj").each(function (index, items) {
        var restWidth = $(items).width() * bili;
        var restHeight = $(items).height() * bili;
        var restTop = $(items).position().top * bili;
        var restLeft = $(items).position().left * bili;
        if (loginName != "admin") {//非管理员边框透明
            noBorder = "border-color:transparent;";
            var restStyle = "width:" + restWidth + "px;height:" + restHeight + "px;top:" + restTop + "px;left:" + restLeft + "px;" + noBorder;
        } else {
            var restStyle = "width:" + restWidth + "px;height:" + restHeight + "px;top:" + restTop + "px;left:" + restLeft + "px;";
        }
        $(items).attr("style", restStyle);
    });
    //重置内置DB中的按钮
    $(".newObj_1").each(function (index, items) {
        var restWidth = $(items).width() * bili;
        var restHeight = $(items).height() * bili;
        var restTop = $(items).position().top * bili;
        var restLeft = $(items).position().left * bili;
        var restStyle = "width:" + restWidth + "px;height:" + restHeight + "px;top:" + restTop + "px;left:" + restLeft + "px;";
        $(items).attr("style", restStyle);
    })
}
//进入全屏与退出全屏的方法
function SetFull() {
    //window.location.href = "http://192.168.3.115:8012/newTest.html";
    if (typeof callHostFunction != "undefined" && CheckPage) {//电子白板打开
        callHostFunction.callBackFullScreen();
    };
    //screenSize();//获取缩放比例及尺寸
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

function initLoadData() {
        initDoubleJsonData(); 
}

//解析双份数据，针对PC端
function initDoubleJsonData() {
    $.getScript(teachingInit.JsonJS, function () {
        var jsonObj = JSON.parse(dbJson);
        var curPageId = 0;
        var fyPageId = "";
        data = jsonObj;
        //ratio=1;	
        //输出
        var doubleWrapObj;
        var defaultpage = 0;
        $.each(jsonObj.pageSource, function (index, items) {
            if (index == 0) {
                fyPageId = items.pageId;
                firstPage = items.pageId;
            }
            if (items.pageImg.indexOf("page") != -1 && defaultpage==0) {
                defaultpage = items.pageId;
            }
            if (index == jsonObj.pageSource.length - 1) {
                endPage = items.pageId;
            }
            pageNum = items.pageId;
            var pageImgSrc = items.pageImg;
            buttons = items.buttons;            
            var curRows = index + 1;
            if (curRows % 2 == 0) {//为偶数时
                var str = "";
                var singleObj = document.createElement("div");
                singleObj.className = "doubleInbox";
                singleObj.setAttribute("hidPage", pageNum);
                //singleObj.style = "margin-left:20px;";
                //singleObj.style = "float:left;";
                str = readJsonContent(pageNum, buttons);
                $(singleObj).append(str);
                $(doubleWrapObj).append($(singleObj));
                $(singleObj).css({ "background-image": "url(\"" + rootPath + DBJsonPath + "/" + pageImgSrc + "\")","right":"0px"});
                if (pageImgSrc == "") {
                    $(singleObj).css({ "background-image": "url(" + white + ")" });
                }
                allPages++;                             
            }
            else {//为奇数时 
                var str = "";
                var parentObj = document.createElement("div");
                parentObj.className = "swiper-slide";
                doubleWrapObj = document.createElement("div");
                doubleWrapObj.className = "content-slide";
                var singleObj = document.createElement("div");
                singleObj.className = "doubleInbox sss";
                singleObj.setAttribute("hidPage", pageNum);
                $(doubleWrapObj).append(singleObj);
                //singleObj.style = "float:left;";
                str = readJsonContent(pageNum, buttons);
                $(singleObj).append(str);
                $(parentObj).append($(doubleWrapObj));
                $(singleObj).css({ "background-image": "url(\"" + rootPath + DBJsonPath + "/" + pageImgSrc + "\")","left":"0px"});
                if (pageImgSrc == "") {
                    $(singleObj).css({ "background-image": "url("+white+")" });
                }
                $('.swiper-wrapper').append($(parentObj));
                allPages++;
            }    

        });        
        var pageIndex = teachingInit.PageNum;
        curUnit = teachingInit.UnitID;
        var iniPageIndex = parseInt((pageIndex - fyPageId) / 2);
        if (iniPageIndex > allPages || pageIndex==-100) {
            pageIndex = defaultpage;
            iniPageIndex = parseInt((pageIndex - fyPageId) / 2);//没找到页码，让它默认显示第一页开始
        }
        curScrollIndex = pageIndex;
        loadSlider(iniPageIndex);//动态加载swiper
        isFirstLoad = false;
        getCurPageArray();        
        preloadPage(loadPageArray);
        autoSize();
    })  
}

//获取当前的页码
function getCurPageArray() {    
    var pages = [];
    $(".swiper-slide-active div.doubleInbox").each(function () {
        var curPage = $(this).attr("hidpage");
        pages.push(parseInt(curPage));
    })
    loadPageArray = pages;
    return pages.join('-');    
}


//图标点击弹窗事件
function icoClick(obj) {
    var id = $(obj).attr("hidSrc");
    pptTitle = $(obj).attr("title");
    var hidpage = $(obj).attr("hidpage");
    if (hidpage != undefined) { //点击教学地图
        IfChangeMap = false;
        actTz(hidpage);
    } else {    //点击电子书页
        hidpage = $(obj).parent().attr("hidpage");
    }
    oldRmbPage = hidpage;

    //处理双页不同单元的情况
    if (CheckPage) {//授课页
        for (var i = 0; i < unitObject.length; i++) {
            var that = unitObject[i];
            var s = parseInt(that.split('-')[0]);
            var e = parseInt(that.split('-')[1]);
            if (e >= hidpage && hidpage >= s) {
                var curLi = $(".pageList .catalogOl li")[i];
                selectLi = curLi;
                if (curLi.className.toLowerCase() != "module") {
                    //如果切换了单元
                    if (curLi.id != curUnit) {
                        curUnit = curLi.id;
                        ChangeTeachMap(curLi.id);
                        changText(curLi);
                    }
                }
            }
        }
    } else {//放映页
        for (var i = 0; i < unitObject.length; i++) {
            var that = unitObject[i];
            var s = parseInt(that.split('-')[0]);
            var e = parseInt(that.split('-')[1]);
            if (e >= hidpage && hidpage >= s) {
                if (parseInt(that.split('-')[2]) != curUnit) {
                    curUnit = parseInt(that.split('-')[2]);
                    ChangeTeachMap(curUnit);
                }
            }
        }
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
                        if ($(obj).attr("sourcetype") == "28" && data == "0") {//资源不存在时返回值为false,否则返回真实的文件路径 
                            //commonFuncJS.openAlert("此文件已被删除或不存在！"); 
                            var errFilePath = "../../App_Theme/images/dialog/fileErr.gif";
                            var imgJson = GetMapData(curSourceGuiId);
                            ImgView(imgJson[0], imgJson[1], errFilePath);    //调用多图弹框 
                        }
                        else {
                            commonFuncJS.openAlert("此文件已被删除或不存在！");
                        }                        
                        
                        //commonFuncJS.openAlert("此文件已被删除或不存在！");
                        //console.log("没有获取到相应的资源路径！");
                    }
                });
            }
            else {
                if ($(obj).attr("sourcetype") == 6 + "_1") {
                    //判断自然拼读资源横向
                    movWin(filePath, icoType, id);//调用弹窗
                    //arlDialogFullWin(filePath);
                }
                else if ($(obj).attr("sourcetype") == 27 + "_1") {
                    //判断自然拼读资源纵向                    
                    arlDialogFullWin(filePath);
                }
                else if ($(obj).attr("sourcetype") == "28") {
                    //去教学地图的结构上取数据
                    var imgJson = GetMapData(curSourceGuiId);
                    ImgView(imgJson[0], imgJson[1], filePath);    //调用多图弹框
                }
                else{
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

//动画调用窗体最大化函数
function maxWin() {
    var w = $(window).width() + 20;
    var h = $(window).height() + 136;
    $(".topTools").hide();
    d.width(w).height(h).show();
    $(".frameBox").width(w);
    $(".frameBox").height(h);
    $(".movIframe").width(w);
    $(".movIframe").height(h);
}

//动画调用窗体最小化函数
function minWin() {
    var w = 1300;
    var h = 750
    $(".topTools").hide();
    d.width(w).height(h).show();
    $(".frameBox").width(1280);
    $(".frameBox").height(760);
    $(".movIframe").width(1280);
    $(".movIframe").height(760);
}

//function winClose() {
//    d.close();
//}

//动态加载swiper函数///////////////////////////////////////////////
//动态加载数据时不能在初始化的时候放在html文件中，
//而应该放在接口取值后找到swiper-wrapper类后马上初始化！不然滚动无效
function loadSlider(iniPageIndex) {
    if (iniPageIndex == 0) {
        $(".arrow-left").addClass("unClick");
        ClickPageBack();
    }
    if (iniPageIndex == parseInt((allPages - 1) / 2)) {
        $(".arrow-right").addClass("unClick");
        ClickPageBack();
    }
    mySwiper = new Swiper('.swiper-container', {
        initialSlide: iniPageIndex,//初始索引页码，从0开始
        //prevButton: '.arrow-left',
        //nextButton: '.arrow-right',
        grabCursor: true,//设置为true时，鼠标覆盖Swiper时指针会变成手掌形状，拖动时指针会变成抓手形状。（根据浏览器形状有所不同）
        observer: true,//修改swiper自己或子元素时，自动初始化swiper 
        observeParents: true,//修改swiper的父元素时，自动初始化swiper  onTransitionEnd  onSlideChangeEnd      
        onTransitionEnd: function (swiper) {
            if (!isFirstLoad) {
                //切换页码时，重置页面上的跟读全文
                clearInterval(timeObjId1);
                clearTimeout(setT1);
                //切换结束时
                var curIndex = swiper.activeIndex;
                var isRight = false;
                if (curIndex > curScrollIndex) {
                    //alert("向右翻页");
                    isRight = true;
                }
                else {
                    //alert("向左翻页");
                    isRight = false;
                }
                if (curIndex == 0) {
                    $(".arrow-left").addClass("unClick");
                    ClickPageBack();
                }
                else
                    $(".arrow-left").removeClass("unClick");
                if (curIndex == parseInt((allPages - 1) / 2)) {
                    $(".arrow-right").addClass("unClick");
                    ClickPageBack();
                }
                else
                    $(".arrow-right").removeClass("unClick");
                pause();    //每次滑动页面，关闭之前页面上的所有点读;
                $(".readbox").css("border", "0px red solid");   //去掉热区框;
                isAll = 0;  //改变全文跟读的状态;
                curScrollIndex = curIndex
                getCurPageArray();
                var selectLi = $(".highlight");
                if (CheckPage) {//如果是授课进这里
                    curUnitName = $(".highlight").text();
                    curUnitName = Common.ClearString(curUnitName);
                    //当前选中的单元节点高亮
                    for (var i = 0; i < unitObject.length; i++) {
                        var that = unitObject[i];
                        var s = parseInt(that.split('-')[0]);
                        var e = parseInt(that.split('-')[1]);
                        if (i == 0 && loadPageArray[0] <= s)
                        {
                            var curLi = $(".pageList .catalogOl li")[0];
                            if (curLi.className.indexOf("module") != -1) {
                                continue;
                            }
                            selectLi = curLi;
                            if (IfChangeMap) {
                                curUnit = curLi.id;
                                ChangeTeachMap(curLi.id);
                                changText(curLi);
                            }
                            else {
                                IfChangeMap = true;                                
                            }
                            break;
                        }
                        if (loadPageArray[0] >= s && loadPageArray[0] <= e) {
                            var curLi = $(".pageList .catalogOl li")[i];
                            if (curLi.nextElementSibling != null) {
                                if (curLi.className.indexOf("module") != -1 && curLi.nextElementSibling.className.indexOf("module") == -1) {
                                    continue;
                                }
                            }
                            selectLi = curLi;
                            if (IfChangeMap) {
                                //如果切换了单元
                                if (curLi.id != curUnit) {
                                    curUnit = curLi.id;
                                    ChangeTeachMap(curLi.id);
                                    changText(curLi);
                                }
                            } else {
                                IfChangeMap = true;
                            }
                            break;
                        }
                    }
                }
                else {//放映走这里
                    for (var i = 0; i < unitObject.length; i++) {
                        var that = unitObject[i];
                        var s = parseInt(that.split('-')[0]);
                        var e = parseInt(that.split('-')[1]);
                        if (loadPageArray[0] >= s && loadPageArray[0] <= e) {
                            curUnitName = that.split('-')[3];
                            curUnitName = Common.ClearString(curUnitName);
                            if (parseInt(that.split('-')[2]) != curUnit) {                               
                                curUnit = parseInt(that.split('-')[2]);
                                ChangeTeachMap(curUnit);
                            }
                        }
                    }
                }
                //每次翻屏加载两页的水滴按钮信息
                if (isRight) {
                    if (parseInt(loadPageArray[1]) <= endPage) {
                        preloadPage(loadPageArray);

                        //autoSize()

                    }
                    else {
                        loadPageArray[1] = endPage + 1;
                        preloadPage(loadPageArray);
                        //到最后了，无需预加载  
                    }
                }
                else {
                    if (parseInt(loadPageArray[0]) >= firstPage) {
                        preloadPage(loadPageArray);
                        //autoSize()
                    }
                    else {
                        //到最前了，无需预加载 
                    }
                }
                if (CheckPage) {
                    var UnitID = $(selectLi).attr("id");
                    Update(UnitID, loadPageArray[0], $(".highlight").text());//操作计录
                }
            }
        }
    });       
};
//高亮及修改当前选中单元标题名
function changText(obj) {   
    var unitname = $(obj).text();
    var txtname = "";    
    $(".pageList .catalogOl li").each(function () {
        $(this).removeClass("highlight");
    })
    $(obj).addClass("highlight");
    //修改显示标题
    if (unitname.indexOf("Module") != -1 || unitname.indexOf("Unit") != -1 || unitname.indexOf("Recycle") != -1) {
        var strArr = unitname.split(" ");
        txtname = strArr[0] + " " + strArr[1];
    } else {
        txtname = unitname;
    }
    $("#unitFull").text(unitname);
    //$(".pageList h3.currentName").text(txtname);
}
//查询指定页码的信息
function preloadPage(searchPageArray) {
    var object = SelWaterData(searchPageArray);
    if (typeof object == "undefined" || object == null || object.length == 0) {
        $.each(searchPageArray,function(i,index){
            var pageId = index; var curWraper;
            $(".doubleInbox").each(function () {
                var curPage = $(this).attr("hidpage");
                if (curPage == pageId) {
                    $(this).find("div.newObj").remove();//先清空以前的按钮再加入
                    $(this).append("");
                    curWraper = $(this);
                }
            })
        })
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
            ratio = finalH / 1046;  //查询指定页的数据是从数据库中取出来的，所以比例要用初始化的
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
                if (loginName != "admin") {
                    noBorder = "border-color:transparent;"; left = left - 1; top = top - 1;
                }//非管理员边框透明
                else {
                    noBorder = "border-color:red;";
                }
                temp1 += '<div class="newObj isRead readbox' + btn[n].icoType + '" hidsrc="' + btn[n].sourceUrl + '" sourcetype="' + btn[n].icoType + '" id="' + btn[n].id + '" style="left:' + left + 'px;top:' + top + 'px;width:' + readW + 'px;height:' + readH + 'px;' + noBorder + ';" title="' + title + '"></div>';
            }
            else {
                temp1 += '<div class="newObj imgIco' + btn[n].icoType + '" hidsrc="' + btn[n].sourceUrl + '" sourcetype="' + btn[n].icoType + '" id="' + btn[n].id + '" style="left:' + left + 'px;top:' + top + 'px;" title="' + title + '"></div>';
            }

            //temp1 += '<div class="newObj imgIco' + btn[n].icoType + '" hidsrc="' + btn[n].sourceUrl + '" sourcetype="' + btn[n].icoType + '" id="' + btn[n].id + '" style="left:' + left + 'px;top:' + top + 'px;"></div>';
        }
        //找到匹配页码前插入按钮
        var curWraper;
        $(".doubleInbox").each(function () {
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
    teachingInit.BindResourceClick();
}
//按照指定长度为数字前面补零输出
function PrefixInteger(num, length) {
    return (Array(length).join('0') + num).slice(-length);
}

//自动调节移动端显示高度
function autoHeight() {
    findDimensions();//获取屏幕宽高度
    /*压缩比率*/
    var curRatio = 493 / 703;
    //图片缩放高度值,去掉小数，向上取舍，小数都进一位
    var imgH = Math.ceil(700 * winWidth / 498);
    $(".swiper-container").height(imgH);
    $(".swiper-wrapper").height(imgH);
    $(".swiper-slide").height(imgH);
    $(".inbox").height(imgH);
}
//动态绑定拖动事件
function bindEvents(obj) {
    $(obj).drag({
        before: function (e) {
            //$(this).text('拖动前' + e.pageX);
        },
        process: function (e) {
            //document.title = '拖动中' + e.pageY;
        },
        end: function (e) {
            //$(this).text('拖动完' + e.pageX);
        }
    });
}
//读取JsonL配置文件并创建页面的内容，加载数据内容(db.js中的点读结构)
function readJsonContent(pageIndex, buttonObj) {
    if (typeof buttonObj=="undefined"||buttonObj == "") {
        return "";
    }
    var shtml = '';    
    ratio = bili;
    for (var i = 0; i < buttonObj.button.length; i++) {
        var thisButton = buttonObj.button[i];
        var id = thisButton.id;
        var posX = parseFloat(thisButton.x) * ratio;
        var posY = parseFloat(thisButton.y) * ratio;
        var posW = parseFloat(thisButton.width) * ratio;
        var posH = parseFloat(thisButton.height) * ratio;
        var soursePath = thisButton.soundsrc;
        var objType = parseInt(thisButton.eventtype);//触发对象的类型，1为动画，2为课件，3为课件，4为课件，5为课件，6为点读（声音文件）
        var linkUrl = thisButton.linkUrl;
        var posCSS = "style=\"left:" + posX + "px;top:" + posY + "px;width:" + posW + "px;height:" + posH + "px;\"";
        var posCSS1 = "style=\"left:" + posX + "px;top:" + posY + "px;\"";
        var subItemsNum = parseInt(thisButton.itemNum);
        var subjectIndex = parseInt(thisButton.subjectNum);//大题题号		
        if (objType == 5 || objType == 6 || objType == 7) {
            if (soursePath == "") {
                //debugger;
            }
            shtml += "<a class=\"readbox\" " + posCSS + " fileType=\"" + objType + '" hidpage="' + pageIndex + "\" soundStr=\"" + rootPath + DBJsonPath + "/" + soursePath + "\" href=\"javascript:void(0)\" onclick=\"playAudio('" + rootPath + DBJsonPath + "/" + soursePath + "',this);\"></a>";
        } else if (objType == 3) {      //全文跟读
            shtml += "<div class=\"newObj_1 imgIco" + objType + "\" " + posCSS1 + " hidsrc=\"" + linkUrl + "\" sourcetype=\"" + objType + "\" onclick=\"allRead(this);\"></div>";

        } else if (objType == 8) {      //报听写按钮
            shtml += "<div class=\"newObj_1 imgIco" + objType + "\" hidsrc=\"" + linkUrl + "\" sourcetype=\"" + objType + "\" id=\"" + id + "\" style=\"left:" + posX + "px;top:" + posY + "px;\"  onclick=\"wordRead(this)\"></div>"
        }
       
    }
    return shtml;
}

//翻页继续朗读
function nextAllRead() {
    playAudioForFullMode('1');
    currentPlayNum = 1;
    startFullPlayMode();
}

//检测系统
function checkPlat() {
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
        return 0;
    }
    else {
        //window.location.href="mobile/index.html";
        if (navigator.userAgent.indexOf("Mac") < 0) {
            return 1;
        }
        else {
            return 2;
        }

    }
}
function changePage() {
    $(".actDiv #double").on("click", function (e) {
        e.preventDefault();
        mySwiper.swipeNext();
       
    });
    $(".actDiv #single").on("click", function (e) {
        e.preventDefault();
        mySwiper.swipePrev();
        
    });
}
//跳转书页
function actTz(pageIndex) {
    getCurPageArray();
    while (pageIndex > loadPageArray[1]) {        
        mySwiper.slideNext();
        getCurPageArray();
    }
    while (pageIndex < loadPageArray[0]) {        
        mySwiper.slidePrev();
        getCurPageArray();
    }
    //var i = Request('viewNum');
    
    //if (num) {
    //    pageIndex = num;
    //} else {
   
    //}
    //if (pageIndex == "" && pageIndex !=0 || pageIndex == null) {
    //    return false;
    //}
    //var iniPageIndex = parseInt(pageIndex - firstPage) / 2;
    //if (iniPageIndex > allPages) {
    //    iniPageIndex = 0;//没找到页码，让它默认显示第一页开始
    //}
    //temp = [pageIndex, pageIndex + 1];
    //loadSlider(iniPageIndex);//动态加载swiper
    //preloadPage(temp);
    //autoSize();
}

//获取当前登录用户信息
function getLoginName() {
    var userList = commonFuncJS.getDataF("UserInfo");
    var userName = userList.Name;
    var userID = userList.Id;
    var kemuId = Common.QueryString.GetValue("SubjectID");//截取url中的值
    if (kemuId == 1) {//1为语文
        isChinese = true;
    }
    loginName = userList.Account;
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
            nav.animate({"left": "-176px"}, 300);
        } else {
            nav.addClass("h");
            nav.animate({ "left": "0" }, 300);
        }
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

//var updateSlide = function (i) {
//    var sw_width = $(".doubleInbox").width();
//    // $(".swiper-container,.device").css({'width':sw_width*i+(i-1)*20+'px'});
//    $(".swiper-container,.device").css({ 'width': sw_width * i + 'px' });
//    mySwiper.params.slidesPerView = i;
//    mySwiper.params.slidesPerGroup = i;
//    var n = mySwiper.activeIndex;
//    mySwiper.slideTo(n, 0, false);
//    var swurl = UrlUpdateParams(window.location.href, "viewNum", i);
//    window.history.pushState({}, 0, swurl);
//    if (i = 1) {
//        var newSlide = mySwiper.slides[0]; //第二个
//        newSlide.clone().append();
//        mySwiper.removeLastSlide()
//    }
//}

//组装地图列表
function setupMapList(listJson) {
    if (listJson == "" || listJson == null) {
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
    var str = "", curCalss="";
    $.each(jsonObj, function (index, items) {
        var name = this.stepName;
        var list = this.liList;
        var curIndex = index + 1;
        str += '<div class="sortTab">';
        if (index == jsonObj.length - 1) {//最后一项高亮
            curCalss = "cur";
        }
        if (jsonObj.length == 1 && list.length == 0) {
            str += '<h4 class="open nullNode"><b>第' + ArabiaToChinese(curIndex) + '步：课堂导入</b><em class="setEm"></em></h4>';
            str += '<ul id="sortlist' + curIndex + '">';
        }
        else {
            if (list.length > 0) {
                str += '<h4 class="open"><span class="ico showIco"></span><b>' + name + '</b><em class="setEm"></em></h4>';
                str += '<ul id="sortlist' + curIndex + '">';
            }
            else {
                str += '<h4 class="open"><span class="ico"></span><b>' + name + '</b><em class="setEm"></em></h4>';
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
    //资源预览
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
    //收缩教学步骤
    $(".sortTab h4").css("cursor", "pointer");
    $(".sortTab h4").on("click", function () {
        if ($(this).next().children("li").length > 0) {//有子节点才可折叠        
            //高亮
            $(".sortTab h4").removeClass("cur");
            $(".sortTab ul li a").removeClass("cur");
            $(this).addClass("cur");

            $(this).next().slideToggle(function () {
                if (!$(".sortTab h4").last().hasClass("open")) {
                    $(".sortTab h4").last().addClass("endNode");
                }
            });
            if ($(this).hasClass("open")) {
                $(this).removeClass("open");
            } else {
                $(this).addClass("open");
            }
            if ($(".sortTab h4").last().hasClass("open")) {
                $(".sortTab h4").last().removeClass("endNode");
            }
        }
    });
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
}

function ChangeTeachMap(UnitID) {
    var CurTeachMap = "";
    //如果是放映
    if (!CheckPage) {
        if (UnitID == teachingInit.UnitID)
        CurTeachMap = sessionS.get("mapArr");
        if (CurTeachMap == "" || CurTeachMap==null)
        CurTeachMap = teachLessonManage.GetCurTeachMap(UserID, teachingInit.BookID, UnitID);
    }
    else {
        //var CurTeachMap = teachLessonManage.GetCurTeachMap('b9010443-6ac9-465a-98b8-1970169855c9', 266, 282796);
         CurTeachMap = teachLessonManage.GetCurTeachMap(UserID, teachingInit.BookID, UnitID);
    }
    setupMapList(CurTeachMap);
}