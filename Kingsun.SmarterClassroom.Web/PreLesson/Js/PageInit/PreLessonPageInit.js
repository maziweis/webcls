// JavaScript Document
var isSaved = false;//是否保存了数据
var timeObjId = 1;
var firstPageId = 0;
var rootSourcePath = "";
var selectPageNum = 0;//当前选中页码
$(function () {
    document.oncontextmenu = function () { return false; };//屏蔽网页右键菜单
    EscFun();

    //delSessionArr();    //删除浏览器中页面水滴的session
})

//保存所有页面参数
function save() {    
    saveJson("1");    
    clearOperation();//清空操作数
    $("#divPagebox li").each(function (l, li) {
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
    $("#divPagebox li").each(function (l, li) {
        var pagenum = $(li).attr("id");
        var returnVal = isHasSession(pagenum);
        if (returnVal != null) {
            if (pagelist != "") {
                pagelist += ",";
            }
            pagelist += pagenum;

            returnVallist += returnVal;
            if (l<$("#divPagebox li").length-1)
                returnVallist +="#";
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
    savemap(num); //备课教学地图的保存
}

//获取当前页中的所有备课按钮json信息
function getCurPageJson() {
    var returnVal,
        imgSrc = "images/0" + selectPageNum + ".jpg",
        str = '{"pageNum":' + selectPageNum + ',';
        str += '"imgSrc":"' + imgSrc + '",';
        str += '"btns":[';
    $("#dragPalcer .newObj").each(function (index, element) {
        var classname=$(this).attr("class");
        var sourceUrl = $(this).attr("hidsrc");
        var randId = $(this).attr("randId");
        if (sourceUrl != "" && classname.indexOf("dbset")==-1) {
            var type = $(this).attr("sourcetype");
            var id = $(this).attr("id");
            var pos = $(this).position();
            var titleName = $(this).attr("title");
            var comeFrom = $(this).attr("comeFrom");
            //判断是否语文点读框类型
            var isread = false;
            if (classname.indexOf("isRead") !=-1) {
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


var startpage;  //当前单元的起始页
var endpage;    //当前单元的结束页
//切换页码
function changePage(obj) {
    isAll = 0;
    pause(); //切换页面时，停止当前页上的点读。
    startpage = $("#unitList li.on").attr("startpage"); //当前单元的起始页
    endpage = $("#unitList li.on").attr("endpage"); //当前单元的结束页
    var oldPageID = selectPageNum;//上一页码
    var cookieDb = sessionS.get("itemArr");
    if (selectPageNum > 0) {//如果selectPageNum==0，代表首次进入,不存在COOKIE
        var jsonInfo = getCurPageJson();
        //if (jsonInfo !== "" && jsonInfo !== null && jsonInfo !== undefined) {
            if (preLessonPageInit.IsSame) {
                if (selectPageNum >= startpage && selectPageNum <= endpage) {   //判断切换页时，当前页是否切换后的单元                    
                    saveToCookie(selectPageNum, jsonInfo);//切换前先保存当前页面
                    //切换前先保存当前的地图数据到Session
                    var data = getData(".jxScroll .sortTab");
                    sessionS.set("mapArr", data);                   
                    //insertMapCookie("p_" + selectPageNum, data, "mapArr");//切换前先保存当前地图的数据到Session
                } else {
                    delSessionArr();
                    sessionS.del("itemArr");
                    sessionS.del("mapArr");
                    //sessionS.delAll();
                }
            }
        //}               
    }   
    selectPageNum = parseInt($(obj).attr("hidpage"));//当前选中页码     
    //高亮显示当前节点
    $("#divPagebox a").each(function (index, element) {
        $($(this).parent()).removeClass("on");
    });
    $($(obj).parent()).addClass("on");

    $("#dragPalcer").html("");
    $("#dragPalcer").attr("hidpage", selectPageNum);
    $.getScript(preLessonPageInit.BookPageJs, function () {
        rootSourcePath = Constant.resource_Url + DBJsonPath + "/";
        loadPage(selectPageNum);//加载db中的电子书页
        var cookieJson = isHasSession(selectPageNum);   //检测session中是否有当前页的按钮信息
        if (/*cookieJson !== "" && */cookieJson !== null && cookieJson !== undefined) {//如果当前页存在于session中，则加载session中的按钮信息
            //console.log("当前页码的COOKIE存在！页码：" + selectPageNum);              
            loadItemsByCookie(selectPageNum);//            
        }
        else {//否则从数据库加载按钮信息           
            //console.log("当前页码的COOKIE不存在！页码：" + selectPageNum);
            getPageInfo();//加载水晶按钮信息              
        }
    });
    if (preLessonPageInit.CataID == preOldUnitID) {
        var data = getData(".jxScroll .sortTab");
        if (data != "") {
            sessionS.set("mapArr", data);
        }
    }
    loadMap();//加载网站地图内容   
    preOldUnitID = preLessonPageInit.CataID;
    //sessionS.del("mapArr", data);
}
//刷新时，删除浏览器中页面水滴的cookie
function delCookieArr() {
    var aCookie = document.cookie.split(";");
    var re = [];
    for (var i = 0; i < aCookie.length; i++) {
        var aCrumb = aCookie[i].split("=");
        if (!isNaN(aCrumb[0])) {
            //console.log(aCrumb[0] + ":我是数字！\n");
            delCookie(aCrumb[0]);
        }
    }
}
//刷新时，删除浏览器中页面水滴的session
function delSessionArr() {
    //////////检测浏览器是否支持本地存储//////////
    var storage = window.localStorage;
    //if (storage) {
    //    console.log('This browser supports sessionStorage!');
    //} else {
    //    console.log('This browser dose not supports sessionStorage!');
    //};
    for (var i = 0; i < storage.length; i++) {
        if (!isNaN(storage.key(i))) {   //判断key值是否是数字
             
            sessionS.del(storage.key(i));
        }
    }
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


//从数据库中获取当前页面信息备课信息
function getPageInfo() {
    var pageIndex = selectPageNum;
    /////////////查询当前页面的数据////////////////
    var jsonContent = preLessonPageInit.GetUserPressonJsonByWhere(pageIndex);
    if (jsonContent == null || jsonContent=="") {
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
//语文热区绑定点击功能
function clickHotArea(that, icoType) {
    $(that).bind("click", function () {
        filePreview(that, icoType);
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
//根据页码从COOKIE中加载水晶按钮
function loadItemsByCookie(pageIndex) {
    var oldArrIds = sessionS.get("itemArr");    
    if (!oldArrIds) {  return false;}
    var temp = oldArrIds.split(",");
    var tempH = "";
    for (var i = 0; i < temp.length; i++) {
        //console.log("当前页码：" + temp[i] +":"+ pageIndex)
        if (temp[i] == pageIndex) {
            var pageItemsjson = sessionS.get(pageIndex);
            //console.log("值为："+pageItemsjson)
            if (pageItemsjson == "") { return;} //判断session中当前页的按钮信息为空
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
                    if (dragItem.icoType == "6_1" || dragItem.icoType == "27_1"){
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

//按照指定长度为数字前面补零输出
function PrefixInteger(num, length) {
    return (Array(length).join('0') + num).slice(-length);
}
//根据页码加载点读框
function loadPage(pageIndex) {
    //ratio = 493 / 703;
    //ratio = 612 / 858;   
    var jsonObj = JSON.parse(dbJson);
    var allPages = 0;
    var curPageId = 0;
    data = jsonObj;
    //输出
    var doubleWrapObj;
    $("a.readbox").remove();
    //预加载的一个示例按钮
    var temp = '<div class="newObj imgIco5" hidsrc="../../FZresource/U1/第一课时_课件(1).ppt" sourcetype="5" id="demo" style="left: 398px; top: 27px;" onclick="OpenFile();"></div>';
    //if (pageIndex == 1) {
    //    var temp = '<div class="newObj imgIco5" hidsrc="../../FZresource/U1/第一课时_课件(1).ppt" sourcetype="5" id="demo" style="left: 398px; top: 27px;" onclick="OpenFile();"></div>';
    //    $("#dragPalcer").append(temp);
    //}
    $.each(jsonObj.pageSource, function (index, items) {
        var pageNum = items.pageId;
        if (pageNum == pageIndex) {
            var pageImgSrc = items.pageImg;
            var buttonObj = items.buttons;
            var shtml = "";
            //加载背景图片
            var imgSrc = "url(" + rootSourcePath + pageImgSrc + ")";
            $("#dragPalcer").css({ "background-image": imgSrc });
            //console.log("按钮数量为："+buttonObj.button.length);
            if (buttonObj == null) {
                return;
            }
            //修复点读数据中button的值无中括号时，取不到数组长度
            var jsonLength = 0;
            if (buttonObj.button.length == null) {
                buttonObj.button = [buttonObj.button];
                jsonLength = buttonObj.button.length;
                
            } else {
                jsonLength = buttonObj.button.length;
            }
            
            //加载配置文件中的按钮信息
            for (var i = 0; i < jsonLength; i++) {
                var thisButton = buttonObj.button[i];
                var id = thisButton.id;
                //坐标位置
                var posX = Math.ceil(parseFloat(thisButton.x) * ratio)-2;   //由于制作db时，点读框是带2px的边框线，备课页面是没有边框线的，所以需要减去边框线的宽度以保证坐标点正确。
                var posY = Math.ceil(parseFloat(thisButton.y) * ratio)-2;
                var posW = Math.ceil(parseFloat(thisButton.width) * ratio);
                var posH = Math.ceil(parseFloat(thisButton.height) * ratio);
                var soursePath = thisButton.soundsrc;
                var objType = parseInt(thisButton.eventtype);//触发对象的类型，1为动画，2为课件，3为课件，4为课件，5为课件，6为点读（声音文件）
                var linkUrl = thisButton.linkUrl;
                var posCSS = "style=\"left:" + posX + "px;top:" + posY + "px;width:" + posW + "px;height:" + posH + "px;\"";
                var posCSS1 = "style=\"left:" + posX + "px;top:" + posY + "px;\"";
                var titleName = thisButton.title;
                var randId = thisButton.randId;
                if (titleName == undefined) { titleName = "" };

                if (objType == 5 || objType == 6 || objType == 7) {//点读
                    if (soursePath != "") {
                        shtml += "<a class=\"readbox\" " + posCSS + " fileType=\"" + objType + "\" hidpage=\"" + pageIndex + "\" soundStr=\"" + rootSourcePath + soursePath + "\" href=\"javascript:void(0)\" onclick=\"playAudio('" + rootSourcePath + soursePath + "',this);\"></a>";
                    } else {
                        shtml += "<div class=\"newObj dbset imgIco" + objType + "\" hidsrc=\"" + linkUrl + "\" sourcetype=\"" + objType + "\" id=\"" + id + "\" style=\"left:" + posX + "px;top:" + posY + "px;\" onclick=\"OpenFile('" + linkUrl + "')\" title='"+titleName+"'></div>"
                    }
                } else if (objType == 3) {      //全文跟读
                    shtml += "<div class=\"newObj_1 imgIco" + objType + "\" " + posCSS1 + " hidsrc=\"" + linkUrl + "\" randId=\"" + randId + "\" sourcetype=\"" + objType + "\" onclick=\"allRead(this);\" title='" + titleName + "'></div>";

                }
                else if (objType == 4) {
                    if (soursePath != "") {
                        shtml += "<div class=\"newObj dbset imgIco" + objType + "\" " + posCSS1 + " hidsrc=\"" + linkUrl + "\" randId=\"" + randId + "\" sourcetype=\"" + objType + "\" onclick=\"showAudio(" + linkUrl + ");\" title='" + titleName + "'></div>"
                    } else {
                        shtml += "<div class=\"newObj dbset imgIco" + objType + "\" " + posCSS1 + " hidsrc=\"" + linkUrl + "\" randId=\"" + randId + "\" sourcetype=\"" + objType + "\" onclick=\"movWin('" + rootSourcePath + linkUrl + "'," + objType + ");\" title='" + titleName + "'></div>"
                    }
                }
                else if (objType == 8) {    //报听写按钮
                    shtml += "<div class=\"newObj_1 imgIco" + objType + "\" hidsrc=\"" + linkUrl + "\" randId=\"" + randId + "\" sourcetype=\"" + objType + "\" id=\"" + id + "\" style=\"left:" + posX + "px;top:" + posY + "px;\"  onclick=\"wordRead(this)\" title='" + titleName + "'></div>"
                    //wordFileSrc=\"" + wordFileSrc + "\"
                }
                else if (objType == 10) {     //语文类的h5资源课件--点击泡泡框弹出h5资源这类
                    shtml += "<a class=\"readbox\" " + posCSS + " fileType=\"" + objType + "\" soundStr=\"" + rootSourcePath + soursePath + "\" href=\"javascript:void(0)\" onclick=\"movWin('" + rootSourcePath + linkUrl + "'," + objType + ");\" title='" + titleName + "'></a>";
                }                
                else {
                    shtml += "<div class=\"newObj dbset imgIco" + objType + "\" hidsrc=\"" + linkUrl + "\" randId=\"" + randId + "\" sourcetype=\"" + objType + "\" id=\"" + id + "\" style=\"left:" + posX + "px;top:" + posY + "px;\" onclick=\"movWin('" + rootSourcePath + linkUrl + "'," + objType + ")\" title='" + titleName + "'></div>"
                }

            }
            //    if (objType == 5 || objType == 6) {//点读
            //        if (soursePath != "") {
            //            shtml += "<a class=\"readbox\" " + posCSS + " href=\"javascript:void(0)\" onclick=\"playAudio('" + rootSourcePath + soursePath + "',this);\"></a>";
            //        }
            //    }
            //}
            $("#dragPalcer").append(shtml);

        }
    });    
    //loadItemsByCookie(pageIndex);    
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

//预加载的一个示例按钮事件
function OpenFile(ID) {
    //var filepath = "第三课时_课件(1).ppt";
    //console.log(filepath);
    //callHostFunction.openPPT(ID);

    //window.cpp.OpenFile(filepath);//调用C++的后台代码
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
//网页关闭监听事件
//window.onbeforeunload = function () {
//    //alert("你关闭了网页");
//   // sessionS.delAll();
//};