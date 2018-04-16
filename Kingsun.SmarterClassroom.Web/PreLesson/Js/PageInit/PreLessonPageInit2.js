/// <reference path="G:\工作目录\智慧课堂(V1.0)\V1.1\A_项目组工作区\1_软件工程\1_5程序开发\1_5_1源代码\SmarterClassroomWeb\SmarterClassroomWeb\Kingsun.SmarterClassroom.Web\AttLesson/Js/db.js" />
/// <reference path="G:\工作目录\智慧课堂(V1.0)\V1.1\A_项目组工作区\1_软件工程\1_5程序开发\1_5_1源代码\SmarterClassroomWeb\SmarterClassroomWeb\Kingsun.SmarterClassroom.Web\AttLesson/Js/db.js" />
var imgWidth = 1920;
var imgHeight = 770;
var aspectRatio = 0;//拉伸比率
var imgRatio = 0;
var imgself = 0;
var marginW, marginH;//背景图片与容器的间距
var isSameBook = true
$(function () {
    var fH = $("#dragPalcer").height(); //第一次加载时的初始高度
    
    document.oncontextmenu = function () { return false; };//屏蔽网页右键菜单    
    
    $(".pageListTs h3").eq(0).bind("click", function () { hideSidebar() });
    $(".pageListTs h3").eq(1).bind("click", function () {
        $(this).prev().slideToggle();
    })
    $("#minbox").bind("click", function () { showSidebar() });
    initTab();
    //绑定拖动事件
    $(".dragEnable").each(function (index, element) {
        var curObj = $(this).get(0);
        bindItemsDrag(curObj);
    });
    //$(".pageUl li a").eq(0).addClass("cur");
    //autoSize();
    $(window).resize(function () {
        autoSize();
        var intH = $("#dragPalcer").height();   //缩放浏览器过后的高度
        var newObj = $(".newObj");
        var newObj_1 = $(".newObj_1");
        var readbox = $(".readbox");
        var scoleN = intH / fH;
        fH = intH;  //缩放后的高度，是下次缩放前的初始高度。
        if (newObj.length > 0) {
            newObj.each(function (index, items) {
                var restWidth = $(items).width() * scoleN;
                var restHeight = $(items).height() * scoleN;
                var restTop = $(items).position().top * scoleN;
                var restLeft = $(items).position().left * scoleN;
                var restStyle = "width:" + restWidth.toFixed(3) + "px;height:" + restHeight.toFixed(3) + "px;top:" + restTop.toFixed(3) + "px;left:" + restLeft.toFixed(3) + "px;border-color:transparent;";
                $(items).attr("style", restStyle);
            })
        }
        if (newObj_1.length > 0) {
            newObj_1.each(function (index, items) {
                var restWidth = $(items).width() * scoleN;
                var restHeight = $(items).height() * scoleN;
                var restTop = $(items).position().top * scoleN;
                var restLeft = $(items).position().left * scoleN;
                var restStyle = "width:" + restWidth.toFixed(3) + "px;height:" + restHeight.toFixed(3) + "px;top:" + restTop.toFixed(3) + "px;left:" + restLeft.toFixed(3) + "px;border-color:transparent;";
                $(items).attr("style", restStyle);
            })
        }
        if (readbox.length > 0) {
            readbox.each(function (index, items) {
                var restWidth = $(items).width() * scoleN;
                var restHeight = $(items).height() * scoleN;
                var restTop = $(items).position().top * scoleN;
                var restLeft = $(items).position().left * scoleN;
                var restStyle = "width:" + restWidth.toFixed(3) + "px;height:" + restHeight.toFixed(3) + "px;top:" + restTop.toFixed(3) + "px;left:" + restLeft.toFixed(3) + "px;border-color:transparent;";
                $(items).attr("style", restStyle);
            })
        }
    });
})
//保存所有页面参数
function save() {
    saveJson("1");    
    clearOperation();//清空操作数
    $("#pageBox li").each(function (l, li) {
        var pagenum = $(li).attr("id");
        var returnVal = isHasSession(pagenum);
        if (returnVal !== "" || returnVal !== null || returnVal !== undefined) {
            //////////删除session////////////
            sessionS.del(pagenum);
        }
    });
    //保存后清空Session中记录的数据
    sessionS.del("itemArr");
    //sessionS.del("mapArr");  //此时暂不删除教学地图信息
    preLessonPageInit.IsSame = true;
    commonFuncJS.SaveOperationRecord(preLessonPageInit.UserID, preLessonPageInit.UserType, Constant.OperType.SavePreLesson_TYPE, "保存备课");
    commonFuncJS.openAlert('已保存备课信息！');
}

//获取当前页面所有水晶按钮的坐标参数
function saveJson(num) {
    var jsonInfo = getCurPageJson(); //获取当前页中的所有备课按钮json信息
    saveToCookie(selectPageNum, jsonInfo);//切换前先保存当前页面 

    var pagelist = ""; var returnVallist = "";
    $("#pageBox li a").each(function (l, li) {
        var pagenum = $(li).attr("hidpage");
        var returnVal = isHasSession(pagenum);
        if (returnVal != null) {
            if (pagelist != "") {
                pagelist += ",";
            }
            pagelist += pagenum;

            returnVallist += returnVal;
            if (l < $("#pageBox .pageUl li").length - 1)
                returnVallist += "#";
            //////////删除session////////////
            sessionS.del(pagenum);
        }
        //if (returnVal!="") {
        /////////////保存到数据库////////////////
        //preLessonPageInit.SavaPressonJson(pagenum, returnVal);
        //}
    });
    ///////////保存到数据库////////////////
    preLessonPageInit.SavaPressonJson(pagelist, returnVallist);
    saveMap(num); //备课教学地图的保存
}

////////////////更新session保存教学地图列表数据///////////////////////
function saveMap(num) {
    var data = getData(".jxScroll .sortTab");
    if (data == "") {   //第一次加载时为空 不做处理
        return false;
    }
    if (num == "1") {
        unitID = preLessonPageInit.CataID;
    }
    
    console.log(unitID, data);
    //sessionS.set("mapArr", data);   
    var result = preLessonManagement.SaveUserTeachMap(preLessonPageInit.UserID, preLessonPageInit.UserType, preLessonPageInit.BookID, unitID, data);
    sessionS.delAll();
    //sessionS.del("mapArr"); //教学地图数据保存数据库后才删除
    //sessionS.del("operation");
    return result;
}

//保存当前页的单页COOKIE
function saveToCookie(pageId, pageJson) {
    var oldArrIds = sessionS.get("itemArr");
    var idArr = [];//session中的页码集合
    var updateArr = "";//session中的页码集合字符串，以逗号分隔
    if (oldArrIds !== "" && oldArrIds !== null && oldArrIds !== undefined) {
        var temp = oldArrIds.split(',');
        for (var i = 0; i < temp.length; i++) {
            idArr.push(temp[i]);
        }
        ///查找是否已存在相同的页码ID
        var isFind = false;
        for (var n = 0; n < idArr.length; n++) {
            if (pageId == idArr[n]) {
                isFind = true;
            }
        }
        if (!isFind) {//未找到重复项，直接添加
            updateArr = oldArrIds + "," + pageId;
            sessionS.set("itemArr", updateArr);//更新
        }
    } else {
        updateArr = pageId;
        sessionS.set("itemArr", updateArr);     //session添加页码集合
    }
    sessionS.set(pageId, pageJson); //添加单页json信息到session中
}

//下一页中是否有COOKIE,有则返回json数据
function isHasCookie(nextPageId) {
    var curJsonInfo = getCookie(nextPageId);
    return curJsonInfo;
}
function isHasSession(nextPageId) {
    var curJsonInfo = sessionS.get(nextPageId);
    return curJsonInfo;
}
//获取当前页中的所有备课按钮json信息
function getCurPageJson() {
    var returnVal,
        imgSrc = "images/0" + selectPageNum + ".jpg",
        str = '{"pageNum":' + selectPageNum + ',';
    str += '"imgSrc":"' + imgSrc + '",';
    str += '"btns":[';
    $("#dragPalcer .newObj").each(function (index, element) {
        var classname = $(this).attr("class");
        var sourceUrl = $(this).attr("hidsrc");
        var randId = $(this).attr("randId");
        if (sourceUrl != "" && classname.indexOf("dbset") == -1) {
            var type = $(this).attr("sourcetype");
            var id = $(this).attr("id");
            var pos = $(this).position();
            var titleName = $(this).attr("title");
            var comeFrom = $(this).attr("comeFrom");
            //判断是否语文点读框类型
            var isread = false;
            if (classname.indexOf("isRead") != -1) {
                isread = true;
            }
            //当前的坐标可能是放大或缩小的坐标值，所以保存时要除以缩放比。
            str += '{"id":"' + id + '","icoType":"' + type + '","randId":"' + randId + '","isread":' + isread + ',"sourceUrl":"' + sourceUrl + '","X":' + pos.left / ratio + ',"Y":' + pos.top / ratio + ',"title":"' + titleName + '","comeFrom":"' + comeFrom + '"},';
        }
        hb = false;
    });
    if ($("#dragPalcer .newObj").length == 0) {
        str = "";
        return "";
    }
    returnVal = str.substring(0, str.length - 1);
    returnVal += ']}';
    return returnVal;
}


//加载选项卡
function initTab() {
    var tab = new opCard();
    tab.bind = ["tablist", "li", "tabbox", "div"];
    tab.style = ["a1_0", "active", "hover"];
    tab.index = 0;
    tab.overStyle = true;
    tab.nesting = [false, true, "", ""]
    tab.creat();
    tab = null;
}

//实时监控浏览器尺寸，并自动调节dom节点的大小
function autoSize() {
    var allHeight = $(window).height();
    var allWidth = $(window).width();
    var contentHeight, contentWidth;
    var imgNowW;
    contentHeight = allHeight - $(".headTitle").height() - parseInt($("#mainTS").css("padding-top")) - parseInt($("#mainTS").css("padding-bottom"));//内容区高度=浏览器高度-顶部栏高度-内容区内边距
    contentWidth = allWidth - parseInt($("#mainTS").css("padding-right"));
    var recHeight = contentHeight - $(".rightColumn2 .title").height() - $(".rightColumn2 #tablist").height() - $(".rightColumn2 .navTop").height() - 20;
    $("#mainTS").height(contentHeight);
    $(".leftColumn2").height(contentHeight - parseInt($(".leftColumn2").css("padding-top")) - parseInt($(".leftColumn2").css("padding-bottom")));
    $(".rightColumn2").height(allHeight - 65);
    $(".rightColumn2 .toolbar").height(recHeight);
    $(".testImg").width($(".leftColumn2").width());
    var botHeight = allHeight - 60;
    $(".pageListTs").height(botHeight);
    $("#pageBox").height(botHeight - (68 + 10) * 2);
    $("#divUserResource").height(contentHeight - $("#tablist").height() - $(".navTop").height() - $(".title").height() - 2);
    //aspectRatio = $("#mainTS").width() / imgWidth;
    aspectRatio = ($("#dragPalcer").height()) / imgHeight;
    imgself = 960 / 770;
    imgNowW = $("#dragPalcer").height() * imgself;
    marginW = ($("#dragPalcer").width() - imgNowW) / 2;
    marginH = 0;
    if (marginW <= 0) {
        marginW = 0;
        marginH = ($("#dragPalcer").height() - 770) / 2;
        aspectRatio = ($("#dragPalcer").width()) / 960;
    }
    if (imgNowW >= 960) {
        imgNowW = 960;
    };
    $("#dragPalcer").width(imgNowW);
    var leftX = parseInt($("#dragPalcer").css("margin-left"));
    $(".trash").css({ "width": $("#dragPalcer").width(), "left": leftX, "top": 0, "border": "1px red solid;" })
    //alert(aspectRatio + " 实际宽度：" + $(".main2").width() + " 图片宽度：" + imgWidth);
    //$(".readbox").each(function (index, items) {
    //    $(items).css({ "width": $(items).width() * aspectRatio + 'px', "height": $(items).height() * aspectRatio + 'px', "top": $(items).position().top * aspectRatio + 'px', "left": $(items).position().left * aspectRatio + 'px' });
    //})
}
//切换左侧页码菜单
function hideSidebar() {
    $("#minbox").show();
    $(".pageListTs").hide();
}
function showSidebar() {
    $("#minbox").hide();
    $(".pageListTs").show();
}
//切换页码并加载声音（如果有）
//imgType参数为图片类型，如为0=封面，1=扉页，2=内容页，3=封底
function switchPage(imgSrc, Obj) {
    pause();    //切换页面时先暂停音频播放
    //autoSize();
    var soundStr = "", styleStr = "";
    
    selectPageNum = parseInt($("#pageBox ul li a.cur").attr("hidpage"));//当前选中页码

    if (isSameBook) {
        var jsonInfo = getCurPageJson();
        saveToCookie(selectPageNum, jsonInfo);//切换前先保存当前页面
        //切换前先保存当前的地图数据到Session
        var data = getData(".jxScroll .sortTab");
        sessionS.set("mapArr", data);
    } else {
        getCurPageInfo(selectPageNum);//加载水晶按钮信息
    }
    isSameBook = true;  //切换了页面，表示进入当前书本，再切换页码时判断
    $(".pageUl a.cur").removeClass("cur");
    $(Obj).addClass("cur");
    //$(".testImg").attr("src", imgSrc);
    var imgBoxHeight = imgHeight * aspectRatio;
    if (imgBoxHeight >= 770) {
        imgBoxHeight = 770;
    }
    $("#dragPalcer").attr("style", 'background: url(' + imgSrc + ') no-repeat left top;height:' + imgBoxHeight + 'px;width:' + imgBoxHeight * imgself + 'px;background-size: contain;');
    //加载当前页声音文件
    var curPageId = $(Obj).attr("hidpage");
    $("#dragPalcer").attr("hidpage", curPageId);
    var data = JSON.parse(dbJson);
    $(data.pageSource).each(function (index, items) {
        var pageId = items.pageId;
        var btns = items.buttons;
        if (pageId == curPageId) {
            //加载声音图片
            if (btns) {
                var btn = btns.button
                $(btn).each(function (index, items) {
                    var leftW = btn[index].x * aspectRatio + 160/*240*/;
                    var topH = btn[index].y * aspectRatio;
                    styleStr = 'style = "width:' + btn[index].width * aspectRatio + 'px;height:' + btn[index].height * aspectRatio + 'px;top:' + topH + 'px;left:' + leftW + 'px"'
                    soundStr += '<a class="readbox" ' + styleStr + ' filetype="' + btn[index].eventtype + '" hidpage="' + data.pageSource.pageId + '" soundstr="../../App_Theme/images/tsImg/' + btn[index].soundsrc + '" href="javascript:void(0)" onclick="readAudio(\'../../App_Theme/images/tsImg/' + btn[index].soundsrc + '\',this);"></a>';
                })
            }
        }
    })
    $("#dragPalcer").html("");
    selectPageNum = curPageId;
    var cookieJson = isHasSession(selectPageNum);   //检测session中是否有当前页的按钮信息
    if (/*cookieJson !== "" && */cookieJson !== null && cookieJson !== undefined) {//如果当前页存在于session中，则加载            
        loadItemsByCookie(selectPageNum);//session中的按钮信息        
    }
    else {//否则从数据库加载按钮信息
        //查询当前备课信息，有则添加水滴按钮
        getCurPageInfo(selectPageNum);
    }
    
    $("#soundDom").html(soundStr);
    autoSize();
    //hideSidebar();
    commonFuncJS.SavsUserFinallyOperationRecord(
        preLessonPageInit.UserID,
        preLessonPageInit.BookType,
        preLessonPageInit.StageID,
        preLessonPageInit.GradeID,
        preLessonPageInit.SubjectID,
        preLessonPageInit.EditionID,
        preLessonPageInit.SelectBookID,
        preLessonPageInit.CataID,
        selectPageNum);
}

function InitPage() {
    selectPageNum = preLessonPageInit.UserFinallyOperationRecord.PageNum
    $.getScript(preLessonPageInit.BookPageJs, function () {
        //$.getScript("../../AttLesson/Js/db.js", function () {
        var htmlStr = "", soundStr = "", pageTitleStr = "", curPageId = 0, classStr = "", styleStr = "", isFirst = false;
        var data = JSON.parse(dbJson);
        $(data.pageSource).each(function (index, items) {
            classStr = "";
            var pageId = items.pageId;
            var bgImg = items.pageImg;
            var imgPath = '../../App_Theme/images/tsImg/' + bgImg;
            var btns = items.buttons;

            if (imgPath && imgPath.indexOf("page") > 0) {
                if (!isFirst) {
                    if (preLessonPageInit.UserFinallyOperationRecord != null) {
                        if (preLessonPageInit.UserFinallyOperationRecord.BookID == preLessonPageInit.BookID && preLessonPageInit.UserFinallyOperationRecord.UnitID == preLessonPageInit.CataID) {
                            if (preLessonPageInit.UserFinallyOperationRecord.PageNum == pageId) {
                                isFirst = true;
                            }
                        }
                        else {
                            isFirst = false;
                            isSameBook = false; //不是同一本书
                        }
                    }
                    if (isFirst) {//第一条信息
                        classStr = 'class="cur"';
                        //加载背景图片，只加载一页图片
                        var imgBoxHeight = imgHeight * aspectRatio;
                        if (imgBoxHeight >= 770) {
                            imgBoxHeight = 770;
                        }
                        $("#dragPalcer").attr("style", 'background: url(' + imgPath + ') no-repeat left top;height:' + imgBoxHeight + 'px;width:' + imgBoxHeight * imgself + 'px;background-size: contain;');
                        $("#dragPalcer").attr("hidpage", preLessonPageInit.UserFinallyOperationRecord.PageNum);
                        //只加载当前页的点读框
                        if (btns) {
                            var btn = btns.button
                            $(btn).each(function (index, items) {
                                //var marginL = -(btn[index].width) / 2 * aspectRatio;
                                //styleStr = 'style = "width:' + btn[index].width * aspectRatio + 'px;height:' + btn[index].height * aspectRatio + 'px;top:' + btn[index].y * aspectRatio + 'px;left:50%;margin-left:' + marginL + 'px"';

                                var leftW = btn[index].x * aspectRatio + 160/*240*/;
                                var topH = btn[index].y * aspectRatio;
                                styleStr = 'style = "width:' + btn[index].width * aspectRatio + 'px;height:' + btn[index].height * aspectRatio + 'px;top:' + topH + 'px;left:' + leftW + 'px"'
                                soundStr += '<a class="readbox" ' + styleStr + ' filetype="' + btn[index].eventtype + '" hidpage="' + data.pageSource.pageId + '" soundstr="../../App_Theme/images/tsImg/' + btn[index].soundsrc + '" href="javascript:void(0)" onclick="readAudio(\'../../App_Theme/images/tsImg/' + btn[index].soundsrc + '\',this);"></a>';
                            })
                        }
                        //查询当前备课信息，有则添加水滴按钮
                        var cookieJson = isHasSession(selectPageNum);   //检测session中是否有当前页的按钮信息
                        if (/*cookieJson !== "" && */cookieJson !== null && cookieJson !== undefined) {//如果当前页存在于session中，则加载session中的按钮信息             
                            loadItemsByCookie(selectPageNum);
                        }
                        else {//否则从数据库加载按钮信息
                            getCurPageInfo(pageId);//加载水晶按钮信息              
                        }
                    }
                    else {
                        classStr = '';
                    }
                }
                pageTitleStr += '<li><a href="javascript:void(0)" hidpage="' + pageId + '" ' + classStr + ' title="第' + pageId + '页" onclick="switchPage(\'' + imgPath + '\',this)">第' + pageId + '页</a></li>';
                curPageId++;
            }
        })
        $("#soundDom").html(soundStr);
        $(".pageUl").html(pageTitleStr);
        var leftX = parseInt($("#dragPalcer").css("margin-left"));
        $(".trash").css({ "width": $("#dragPalcer").width(), "left": leftX, "top": 0, "border": "1px red solid;" })
        if (!isSameBook) {
            $("#pageBox ul li a").eq(0).addClass("cur");
            $("#pageBox ul li a.cur").click();
        }
})
    //组装教学地图
    loadMap();

    commonFuncJS.SavsUserFinallyOperationRecord(
        preLessonPageInit.UserID,
        preLessonPageInit.BookType,
        preLessonPageInit.StageID,
        preLessonPageInit.GradeID,
        preLessonPageInit.SubjectID,
        preLessonPageInit.EditionID,
        preLessonPageInit.SelectBookID,
        preLessonPageInit.CataID,
        selectPageNum);
}

//根据页码从COOKIE中加载水晶按钮
function loadItemsByCookie(pageIndex) {
    var oldArrIds = sessionS.get("itemArr");
    if (!oldArrIds) { return false; }
    var temp = oldArrIds.split(",");
    var tempH = "";
    for (var i = 0; i < temp.length; i++) {
        //console.log("当前页码：" + temp[i] +":"+ pageIndex)
        if (temp[i] == pageIndex) {
            var pageItemsjson = sessionS.get(pageIndex);
            //console.log("值为："+pageItemsjson)
            if (pageItemsjson == "") { return; } //判断session中当前页的按钮信息为空
            var jsonObj = JSON.parse(pageItemsjson);
            var pageNum = jsonObj.pageNum;
            $.each(jsonObj.btns, function (index, items) {
                var dragItem = this;
                if (pageNum == pageIndex) {
                    var id = dragItem.id;
                    //坐标位置
                    var posX = Math.ceil(parseFloat(dragItem.X) * ratio);
                    var posY = Math.ceil(parseFloat(dragItem.Y) * ratio);
                    //var objType = parseInt(dragItem.icoType); //英语自然拼读有6_1和27_1 不能强制转换成数字
                    var objType;
                    if (dragItem.icoType == "6_1" || dragItem.icoType == "27_1") {
                        objType = dragItem.icoType;
                    } else {
                        objType = parseInt(dragItem.icoType);
                    }
                    var linkUrl = dragItem.sourceUrl;
                    var isRead = dragItem.isread;
                    var comeFrom = dragItem.comeFrom;
                    var randId = dragItem.randId;
                    //var temp = '<div class="newObj imgIco' + objType + '" hidsrc="' + linkUrl + '" sourcetype="' + objType + '" id="' + id + '" style="left:' + posX + 'px;top:' + posY + 'px;" title="' + dragItem.title + '"></div>';

                    if (isChinese && isRead && (objType == 27 || objType == 6)) {//语文点读热区
                        var readW, readH, noBorder;
                        if (objType == 27) { readW = 38; readH = 43; }
                        if (objType == 6) { readW = 20; readH = 20; }
                        readW = Math.ceil(readW * ratio);
                        readH = Math.ceil(readH * ratio);
                        if (loginName != "admin") { noBorder = "border-color:transparent;"; posX = posX - 2; posY = posY - 2; }//非管理员边框透明
                        tempH = '<div class="newObj isRead readbox' + objType + '" hidsrc="' + linkUrl + '" randId="' + randId + '" sourcetype="' + objType + '" id="' + id + '" style="width:' + readW + 'px;height:' + readH + 'px;left:' + posX + 'px;top:' + posY + 'px;cursor:pointer;' + noBorder + '" title="' + dragItem.title + '" comeFrom="' + comeFrom + '"></div>';
                    }
                    else {
                        tempH = '<div class="newObj imgIco' + objType + '" hidsrc="' + linkUrl + '" randId="' + randId + '" sourcetype="' + objType + '" id="' + id + '" style="left:' + posX + 'px;top:' + posY + 'px;" title="' + dragItem.title + '" comeFrom="' + comeFrom + '"></div>';
                    }

                    $("#dragPalcer").append(tempH);
                    var curObj = $(tempH).get(0);                    //$(curObj).drag();                    
                    if (isChinese && isRead && (objType == 27 || objType == 6)) {
                        //语文点读热区不绑定拖动功能
                        if (loginName == "admin") {
                            bindEvents(curObj);//管理员身份可以拖动及删除
                        }
                        else {
                            clickHotArea(curObj, objType);//绑定预览功能
                        }
                    }
                    else {
                        $(curObj).drag();
                    }
                    //bindDragEvent(curObj);
                }
            });
        }
    }
    $(".newObj").each(function (index) {
        var curObj = $(this).get(0);
        var objType = $(curObj).attr("sourcetype");
        var isReadBox = false;
        if ($(this).attr("class").indexOf("isRead") != -1) {
            isReadBox = true;
        }
        if (isChinese && isReadBox && (objType == 27 || objType == 6)) {
            //语文点读热区不绑定拖动功能
            if (loginName == "admin") {
                bindEvents(curObj);//管理员身份可以拖动及删除
            }
            else {
                clickHotArea(curObj, objType);//绑定预览功能
            }
        }
        else {
            bindEvents(curObj)
        }
    })
}

//判断用户是否作过备课操作，添加、删除或移动过图标，教学地图添加步骤、删除步骤、修改步骤名和拖动资源排序都算是作为操作
function isOrNotOperation() {
    var isSucced = false;
    var addNum = operation.addCount;
    var delNum = operation.delCount;
    var moveNum = operation.moveCount;
    var addStepNum = operation.addStepCount;
    var delStepNum = operation.delStepCount;
    var modifyStepNum = operation.modifyStepCount;
    var sortObjNum = operation.sortObCount;
    if (addNum > 0 || delNum > 0 || moveNum > 0 || addStepNum > 0 || delStepNum > 0 || modifyStepNum > 0 || sortObjNum > 0) {
        isSucced = true;
    }
    return isSucced;
}
//清空操作对象
function clearOperation() {
    operation.addCount = 0;
    operation.delCount = 0;
    operation.moveCount = 0;
    operation.addStepCount = 0;
    operation.delStepCount = 0;
    operation.modifyStepCount = 0;
    operation.sortObCount = 0;
}
//按照指定长度为数字前面补零输出
function PrefixInteger(num, length) {
    return (Array(length).join('0') + num).slice(-length);
}

//加载声音文件
function loadSoundSrc(soundPath, obj) {
    $(".audioDiv #mp3").attr("src", soundPath);
    var audio = document.getElementById("audio");
    audio.load();
}

//点读
function readAudio(soundsrc, obj) {
    //SaveOperData($(obj).attr("filetype"), "点读");    //记录点击；
    //soundPause();//暂停以前的声音 
    $("a.readbox").css({ "border": "0px red solid" });
    var audio = document.getElementById("audio");
    audio.src = soundsrc;
    audio.play();
    //高亮当前句
    $(obj).css({ "border": "2px red solid", "border-radius": "10px" });
    timeObjId1 = setInterval("isSoundEnd()", 100);
}
//声音暂停
function soundPause() {
    var audio = document.getElementById("audio");
    if (audio) {
        audio.pause();
    }
}

//检查声音是否播完
function isSoundEnd() {
    var audio = document.getElementById("audio");
    if (audio.ended) {
        //清楚定时器 延时器
        clearInterval(timeObjId);
        $("a.readbox").css({ "border": "0px red solid"});
        audio.pause();        
    }
}

//从数据库中获取当前页面信息备课信息
function getCurPageInfo(pageNum) {
    var pageIndex = selectPageNum;
    /////////////查询当前页面的数据////////////////
    var jsonContent = preLessonPageInit.GetUserPressonJsonByWhere(pageIndex);
    if (jsonContent == null || jsonContent == "") {
        //alert("没有查到数据！");
        return;
    }
    jsonContent = JSON.parse(jsonContent);
    //alert("当前页码内容为：" + jsonContent);
    var jsonObj = null;
    if (typeof (jsonContent.pageNum) != "undefined") {
        jsonObj = jsonContent;
    }
    else {
        if (jsonContent == "") { return true; } //空数据时跳出不做操作
        jsonObj = JSON.parse(jsonContent);
    };
    var pageNum = jsonObj.pageNum;
    $.each(jsonObj.btns, function (index, items) {
        var dragItem = this;
        if (pageNum == pageIndex) {
            var id = dragItem.id;
            //坐标位置
            var posX = Math.ceil(parseFloat(dragItem.X) * ratio);
            var posY = Math.ceil(parseFloat(dragItem.Y) * ratio);
            var objType = dragItem.icoType;
            var linkUrl = dragItem.sourceUrl;
            var titleName = dragItem.title;
            var comeFrom = dragItem.comeFrom;
            var randId = dragItem.randId;
            var temp = "";
            if (titleName == undefined) { titleName = "" };
            var isRead = dragItem.isread;
            if (isChinese && isRead && (objType == 27 || objType == 6)) {//语文点读热区
                var readW, readH;
                var noBorder = "";
                if (objType == 27) { readW = 38; readH = 43; }
                if (objType == 6) { readW = 20; readH = 20; }
                readW = Math.ceil(readW * ratio);
                readH = Math.ceil(readH * ratio);
                if (loginName != "admin") {//非管理员边框透明并微调位置
                    noBorder = "border-color:transparent;";
                    posX = posX - 2;
                    posY = posY - 2;
                }
                temp = '<div class="newObj isRead readbox' + objType + '" hidsrc="' + linkUrl + '" randId="' + randId + '" sourcetype="' + objType + '" id="' + id + '" style="width:' + readW + 'px;height:' + readH + 'px;left:' + posX + 'px;top:' + posY + 'px;cursor:pointer;' + noBorder + '" title="' + titleName + '" comeFrom="' + comeFrom + '"></div>';
            }
            else {
                temp = '<div class="newObj imgIco' + objType + '" hidsrc="' + linkUrl + '" randId="' + randId + '" sourcetype="' + objType + '" id="' + id + '" style="left:' + posX + 'px;top:' + posY + 'px;" title="' + titleName + '" comeFrom="' + comeFrom + '"></div>';
            }
            $("#dragPalcer").append(temp);
        }
    });
    $(".newObj").each(function (index) {
        var curObj = $(this).get(0);
        var objType = $(curObj).attr("sourcetype");
        var isReadBox = false;
        if ($(this).attr("class").indexOf("isRead") != -1) {
            isReadBox = true;
        }
        if (isChinese && isReadBox && (objType == 27 || objType == 6)) {
            //语文点读热区不绑定拖动功能
            if (loginName == "admin") {
                bindEvents(curObj);//管理员身份可以拖动及删除
            }
            else {
                clickHotArea(curObj, objType);//绑定预览功能
            }
        }
        else {
            bindEvents(curObj)
        }
    })
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