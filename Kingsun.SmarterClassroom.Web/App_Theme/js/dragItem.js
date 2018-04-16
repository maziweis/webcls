// JavaScript Document
var oNewDiv, sourceUrl, isMove, icoType,comeFrom, curTimes, cloneObjWidth = 0, cloneObjHeight = 0;//方框或图标大小
var selectPageNum = 4;//当前选中的页码,初始值
var isTouch = false;//拖动对象的任一顶点是否触碰到触碰槽
var allInline = false;//拖动对象的所有顶点全部在触碰槽内范围
var flatform = false;//获取当前平台属性，true为移动平台，false为PC,默认PC
var imgObject = [];//所有生成图标的ID数组
var imgObjectX = [];//所有生成图标的中心点X轴数组
var imgObjectY = [];//所有生成图标的中心点Y轴数组
var oldX = "";
var oldY = "";
var crossObj;
var loginName = "";//当前登录用户名
var isChinese = false;//是否是语文科目
var ItemFileType = "";//判断资源是不是PPT
var curDragTitle = "";//当前拖动对象的标题名称
//给加载资源绑定拖动事件
function bindItemsDrag() {
    //$.cachedScript('../../App_Theme/js/dragElement.js');//缓存加载js文件
    $(".dragEnable").each(function (index, element) {
        var curObj = $(this).get(0);
        setDrag(curObj);
    });

    //拖动原始对象的鼠标移入事件
    $(".dragEnable").hover(function () {
        $(this).css({ "border": "1px red solid" });
    }, function () {
        $(this).css({ "border": "1px #E6E6E6 solid" });
    });
    getObject();
}
//初始化已存在的资源
function getObject() {
    $(".newObj").each(function () {
        var pos = $(this).position();
        var id = $(this).attr("id");
        imgObject.push(id);
        imgObjectX.push(pos.left + $(this).width() / 2);
        imgObjectY.push(pos.top + $(this).height() / 2);
    });
}
//绑定事件
function setDrag(obj) {
    var isMob = isMobilePlatform();//判断是否是移动设备 
    if (typeof window.addEventListener != "undefined") {
        if (isMob) {            
            //移动端            
            obj.addEventListener("touchstart", startDown, false);
        }
        else {//PC端              
            obj.addEventListener("touchstart", startDown, false);
            obj.addEventListener("mousedown", startDown, false);
        }
    } else {
        obj.attachEvent("onmousedown", startDown);
    }
}
//获取当前登录用户信息
function getLoginName() {
    var userList = commonFuncJS.getDataF("UserInfo");
    var userName = userList.Name;
    var userID = userList.Id;
    var kemuId = Common.QueryString.GetValue("SubjectID");
    if (kemuId == 1) {//1为语文
        isChinese = true;
    }
    loginName = userList.Account;
}
getLoginName();//获取登录用户名

//开始事件
function startDown(e) {
    //var oEvent = e.type == 'touchstart' ? e.originalEvent.touches[0] : e;//ipad不支持originalEvent
    var oEvent = e.type == 'touchstart' ? e.targetTouches[0] : e;
    var disX, disY;
    var eventObject = e.srcElement || e.target; // 获取触发事件的源对象
    var curObject;
    if (eventObject.tagName == "IMG" || eventObject.tagName == "SPAN" || eventObject.tagName == "B" || eventObject.tagName == "EM") {
        curObject = $(eventObject).parents(".dragEnable");//点击的DIV对象
    } else {
        curObject = $(eventObject);//点击的DIV对象
    };
    icoType = curObject.attr("typeIco");
    sourceUrl = curObject.attr("hidSrc");
    curDragTitle = $(curObject).find("span").text();
    comeFrom = $(curObject).attr("comefrom");
    var toolbar = document.getElementById("toolbar");
    if (loginName == "admin" && isChinese && (icoType == 27 || icoType == 6)) {//当前为语文科目，且为管理员
        if (icoType == 27) {//管理员用于添加语文的拖动热区
            cloneObjWidth = 32;
            cloneObjHeight = 36;
        }
        else {
            cloneObjWidth = 20;
            cloneObjHeight = 20;
        }
    }
    else {//图标大小
        cloneObjWidth = 40;
        cloneObjHeight = 58;
    }
    //鼠标点击处与拖动对象左顶点坐标的偏移量，也就是生成的拖动对象的左顶点坐标值
    disX = oEvent.clientX - cloneObjWidth / 2;
    disY = oEvent.clientY - cloneObjHeight / 2;

    //创建一个拖动对象
    oNewDiv = document.createElement('div');
    if (loginName == "admin" && isChinese && (icoType == 27 || icoType == 6)) {
        oNewDiv.className = 'box readbox' + icoType;
    }
    else {
        oNewDiv.className = 'box imgIco' + icoType;
    }
    oNewDiv.title = curObject.find("span").text();
    oNewDiv.style.width = cloneObjWidth + 'px';
    oNewDiv.style.height = cloneObjHeight + 'px';
    oNewDiv.style.left = disX + 'px';
    oNewDiv.style.top = disY + 'px';
    oNewDiv.style.display = 'none';
    document.body.appendChild(oNewDiv);
    oldX = oNewDiv.style.left;//记录当前X
    oldY = oNewDiv.style.top;//记录当前Y    
    crossObj = new cross("#835FCB", $("#dragPalcer").get(0));//拖动十字
    crossObj.init();
    isMove = false;
    var myDate = new Date();
    curTimes = myDate.getSeconds() * 1000 + myDate.getMilliseconds();//获取当前共计多少毫秒，秒数(0-59)+当前毫秒数(0-999)
    //alert("按下");
    //绑定拖动和松开事件
    if (typeof window.addEventListener != "undefined") {//如果支持addEventListener，FF和Chrome
        var isMob = isMobilePlatform();//判断是否是移动设备  
        if (isMob) {
            //移动端            
            document.addEventListener("touchmove", moveEvent, false);
            document.addEventListener("touchend", endEvent, false);
        }
        else {//PC端和电子白板 
            document.addEventListener("touchmove", moveEvent, false);
            document.addEventListener("touchend", endEvent, false);
            document.addEventListener("mousemove", moveEvent, false);
            document.addEventListener("mouseup", endEvent, false);
        }

    } else {//如果不支持addEventListener，则用attachEvent，IE        
        document.attachEvent("onmousemove", moveEvent);
        document.attachEvent("onmouseup", endEvent);
    }

}
//移动事件
function moveEvent(e) {
    //var oEvent = e.type == 'touchmove' ? e.originalEvent.touches[0] : e;//ipad不支持originalEvent
    var oEvent = e.type == 'touchmove' ? e.targetTouches[0] : e;
    e.preventDefault(); //禁止默认事件
    /*拖动限定范围*/
    var maxWidth = document.documentElement.clientWidth;
    var maxHeight = document.documentElement.clientHeight;
    var lX = oEvent.clientX - cloneObjWidth / 2;
    var lT = oEvent.clientY - cloneObjHeight / 2;
    var rX = oEvent.clientX + cloneObjWidth / 2;
    var rT = oEvent.clientY + cloneObjHeight / 2;
    oNewDiv.style.left = lX + 'px';
    oNewDiv.style.top = lT + 'px';
    if (lX < 0) {/*左边*/
        oNewDiv.style.left = "0px";
    }
    if (lT < 0) {/*上边*/
        oNewDiv.style.top = "0px";
    }
    if (rX >= maxWidth) {/*右边*/
        if (icoType == 0) { oNewDiv.style.left = maxWidth - cloneObjWidth - 2 + "px"; }
        else { oNewDiv.style.left = maxWidth - cloneObjWidth + "px"; }
    }
    if (rT >= maxHeight) {/*底边*/
        if (icoType == 0) { oNewDiv.style.top = maxHeight - cloneObjHeight - 2 + "px"; }
        else { oNewDiv.style.top = maxHeight - cloneObjHeight + "px"; }
    }
    touchBorder(oEvent.clientX, oEvent.clientY, lX, lT, oNewDiv);/*触碰判断*/
    //console.log(lX + ":" + lT);
    //判断是否移动过位置
    var curX = oNewDiv.style.left;
    var curY = oNewDiv.style.top;
    if (oldX === curX || oldY === curY) {
        isMove = false;
    }
    else {
        isMove = true;
        oNewDiv.style.display = 'block';
    }
}
//结束事件
function endEvent(e) {
    //var ev = e.type == 'touchend' ? e.originalEvent.changedTouches[0] : e;//ipad不支持originalEvent
    var ev = e.type == 'touchend' ? e.targetTouches[0] : e;
    var doubleSurport = false;//是否同时支持touched和mouseup(电子白板)
    //if (e.type == 'touchend' && e.originalEvent.changedTouches[0] == 'mouseup') {//ipad不支持originalEvent    

    //点击事件判断,按下和松开的毫秒时间差为0并且未发生移动，可以视为点击事件
    var curDate = new Date();
    var nowTimes = curDate.getSeconds() * 1000 + curDate.getMilliseconds();//获取当前共计多少毫秒，秒数(0-59)+当前毫秒数(0-999)	   
    var timeCount = nowTimes - curTimes;
    if (timeCount == 0 || !isMove) {
        $(oNewDiv).remove();
        //右侧图标点击预览事件  
        var eventObject = e.srcElement || e.target; // 获取触发事件的源对象
        var curObject;
        if (eventObject.tagName == "IMG" || eventObject.tagName == "SPAN" || eventObject.tagName == "B" || eventObject.tagName == "EM") {
            curObject = $(eventObject).parents(".dragEnable");//点击的DIV对象
        } else {
            curObject = $(eventObject);//点击的DIV对象
        };
        var id = $(curObject).attr("hidSrc");
        var url = Constant.file_Url + "Preview.ashx";
        oldRmbPage = "01";  //默认点击右侧资源，记录页码为01
        var filePath = "";
        curSourceGuiId = id;//写入全局变量，以后续使用
        pptTitle = $(curObject).find("span").text();
        if (icoType == 10) {
            pptTitle = $(curObject).find("span").text();
            ItemFileType = "PPT";
        }
        else
            ItemFileType = "Other";
        GetPreviewUrl(id, ItemFileType, url, function (data) {
            filePath = data.URL;
            if (clicktag == 0) {    //防止快速重复点击
                clicktag = 1;
                SaveOperData(icoType, id);  //记录点击
                if (filePath == "" || filePath==null) {
                    var url = Constant.webapi_Url + "ResourcePreview/" + id;
                    $.getJSON(url, function (data) {
                        if (data.indexOf(id) != -1) {
                            filePath = data;
                            movWin(filePath, icoType, id);//调用弹窗
                        } else {
                            console.log("没有获取到相应的资源路径！");
                        }
                    });
                }
                else {
                    if ($(curObject).attr("typeico") == 6 + "_1" || $(curObject).attr("typeico") == 27 + "_1") {
                        //判断自然拼读资源
                        arlDialogWin1(filePath);
                    } else {
                        movWin(filePath, icoType, id);//调用弹窗
                    }
                }
                setTimeout(function () {
                    clicktag = 0;
                }, 500);    //延迟500ms
            }
        });
        unBindDrag(e);
    }
    else {
        //结束拖动时隐藏点读框高亮样式
        $("a.readbox").css({ "border": "0px red solid" });
        $("#dragPalcer").css("opacity", "1");
        
        //如果触碰到，则...
        if (isTouch) {
            oNewDiv.style.display = 'block';
            var dragPos = $(oNewDiv).position();
            var curPosLeft = dragPos.left;
            var curPosTop = dragPos.top; 
            var dragplace = document.getElementById('dragPalcer');            
            var pos = $(".main").position();
            var paddLeft = parseInt($(".main").css("padding-left"));
            var marginLeft = parseInt($(dragplace).css("margin-left"));
            var paddRight = parseInt($(".main").css("padding-right"));            
            var minX = pos.left + marginLeft + paddLeft + 5;//容器区域左侧最小横坐标值
            var minY = pos.top + 30;//容器区域顶端最小横坐标值            
            //var maxX = minX + dragplace.offsetWidth + 10;//容器区域右侧最大纵坐标值，包含一个拖动对象的宽度
            var maxX = minX + $(dragplace).width();//容器区域右侧最大纵坐标值，包含一个拖动对象的宽度
            //var maxY = minY + dragplace.offsetHeight;//容器区域底端最大纵坐标值，包含一个拖动对象的高度 
            var maxY = minY + $(dragplace).height();//容器区域底端最大纵坐标值，包含一个拖动对象的高度 
            //if (curPosLeft <= minX || curPosLeft >= maxX || curPosTop >= maxX || curPosTop + cloneObjHeight <= minY) {//拖动对象超出到左侧容器范围之外  
            if (!allInline){
                isTouch = false;
                $(oNewDiv).remove();
                crossObj.delete();
            }
            else {//在范围内，则创建 
                creatButton(e);//创建一个新的按钮   
                allInline = false;
            }
        }        
        else {//否则，删除   
            allInline = false;
            $(oNewDiv).remove();
            crossObj.delete();
        }        
        unBindDrag(e); 
    }    
}


//清理不在左侧区域内的浮动图标
function clearDragImg() {
    var dragplace = document.getElementById('dragPalcer');
    //定义坐标原点，背景图片的左上角在整个页面中的绝对位置
    var pos = $(".main").position();
    var minX = pos.left + 20; //main本身的margin+leftColumn的padding：10+10
    var minY = pos.top + 30;    
    var maxX = minX + dragplace.offsetWidth;
    var maxY = minY + dragplace.offsetHeight;    
    $(".newObj").each(function (index) {
        var curDragObj = $(this);
        var dragPos = $(this).position()
        var posX = dragPos.left;
        var posY = dragPos.top;
        var rightTopX = posX + 40;
        var rightTopY = posY + 58;
        if ((posX < maxX && posX > minX && posY < maxY && posY > minY) && (rightTopX < maxX && rightTopX > minX && posY < maxY && posY > minY) && (rightTopX < maxX && rightTopX > minX && rightTopY < maxY && rightTopY > minY) && (posX < maxX && posX > minX && rightTopY < maxY && rightTopY > minY)) {
            $(this).remove();
            console.log("清理成功！")
        }
    });
    clearInterval(timeClear);
}

function unBindDrag(e) {
    e.stopPropagation();//阻止冒泡
    if (typeof window.removeEventListener != "undefined") {
        var isMob = isMobilePlatform();//判断是否是移动设备  
        if (isMob) {
            //移动端            
            document.removeEventListener("touchmove", moveEvent, false);
            document.removeEventListener("touchend", endEvent, false);
        }
        else {//PC端
            document.removeEventListener("touchmove", moveEvent, false);
            document.removeEventListener("touchend", endEvent, false);
            document.removeEventListener("mousemove", moveEvent, false);
            document.removeEventListener("mouseup", endEvent, false);
        }
    } else {
        document.detachEvent("onmousemove", moveEvent);
        document.detachEvent("onmouseup", endEvent);
    }
}

//重名提示
function sameSourceTips() {
    var isSucced = false;
    var parentObj = document.getElementById("dragPalcer");
    $(parentObj).find(".newObj ").each(function () {
        var sId = $(this).attr("hidsrc");
        if (sourceUrl == sId) {
            isSucced = true;
        }
    });
    return isSucced;
}

//拖动结束后生成新的按钮对象并绑定拖动事件
function creatButton(e) {
    if (sameSourceTips()) {//重名文件检查
        $(oNewDiv).remove();
        commonFuncJS.openAlert('本页已添加该资源！');        
    }
    else {        
        var parentObj = document.getElementById("dragPalcer");
        var pos = $(".main").position();        
        //拖动对象的左顶点坐标值
        var disX = oNewDiv.offsetLeft;
        var disY = oNewDiv.offsetTop;
        var limitLeft = pos.left + parseInt($("#dragPalcer").css("margin-left"));
        var limitRight = pos.left + parseInt($("#dragPalcer").css("margin-left")) + $("#dragPalcer").width();

        var url = window.location.href;
        if (url.indexOf("PerLessonForTS2") > 0) {//针对攀登教材
            var tempMaxY = $(".main").get(0).offsetWidth - $("#dragToolBar").get(0).offsetWidth;
            if (limitRight > tempMaxY) {//有重叠区域        
                limitRight = tempMaxY;
            }
        }
        if ($(".leftColumn").css("padding-top") == undefined) {
            var limitTop = pos.top + parseInt($(".leftColumn2").css("padding-top"));
        } else {
            var limitTop = pos.top + parseInt($(".leftColumn").css("padding-top"));
        }
        var minBotY = disY + oNewDiv.offsetHeight;
        console.log("disX:" + limitLeft + "limitLeft:" + limitLeft + " limitRight:" + limitRight + "minBotY:" + minBotY + " limitTop:" + limitTop);

        if (disX > limitLeft && disX < limitRight && minBotY > limitTop) {//如果水滴拖动过快时判断是否在容器区  
            var dragDiv = document.createElement('div');
            var thisId = "p_" + getRandomNum(2);//生成随机两位数ID,加前缀“p_”  
            //var thisId =enableDragObject.getAttribute("hidId");//将拖动对象的隐藏ID赋给新建对象    
            if (loginName == "admin" && isChinese && (icoType == 27 || icoType == 6)) {
                //管理员并且是语文热区类型
                dragDiv.className = 'newObj isRead readbox' + icoType;
            }
            else {
                dragDiv.className = 'newObj imgIco' + icoType;
            }
            dragDiv.setAttribute("hidSrc", sourceUrl);
            dragDiv.setAttribute("sourceType", icoType);        
            dragDiv.setAttribute("title", curDragTitle);
            dragDiv.setAttribute("comeFrom", comeFrom);
            var timestamp = (new Date()).valueOf();//当前时间戮，这是唯一区分同名文件
            dragDiv.setAttribute("randId", timestamp);    
            dragDiv.id = thisId;
            var padLeft;    //攀登备课结构不同，以示区别
            if ($(".leftColumn2").css("padding-left") == undefined) {
                padLeft = 0;
            } else {
                padLeft = parseInt($(".leftColumn2").css("padding-left"));
            }            
            if (loginName == "admin" && isChinese && (icoType == 27 || icoType == 6)) {
                if (icoType == 27) {
                    dragDiv.style.width = "32px";
                    dragDiv.style.height = "36px";

                }
                else {
                    dragDiv.style.width = "20px";
                    dragDiv.style.height = "20px";
                }               
                dragDiv.style.left = disX - pos.left - padLeft - parseInt($("#dragPalcer").css("margin-left")) - oNewDiv.clientWidth / 2-4 + "px";
                dragDiv.style.top = disY - pos.top - 30 + "px";
            }
            else {
                dragDiv.style.left = disX - pos.left - padLeft - parseInt($("#dragPalcer").css("margin-left"))-20 + "px";
                dragDiv.style.top = disY - pos.top - oNewDiv.clientHeight / 2 + "px";
            }
            
            parentObj.appendChild(dragDiv);
            //图标绑定拖动事件
            $(dragDiv).drag();
            $(".light").remove();
            insertData(thisId, curDragTitle, icoType, sourceUrl, 'newObj', comeFrom, timestamp);//站点地图中插入数据
            console.log("当前状态：" + allInline);
            //savemap();//保存网站地图内容

            //将生成的图标中心点X轴/Y轴值存入全局数组
            imgObject.push(thisId);
            imgObjectX.push(crossObj.x);
            imgObjectY.push(crossObj.y);
            crossObj.delete();
            isTouch = false;
            allInline = false;
            $(oNewDiv).remove();
            //添加成功后更新操作对象的数量
            var newdCount = parseInt(operation.addCount) + 1;
            operation.addCount = newdCount;
            sessionS.set("operation", JSON.stringify(operation));
        }
        else {            
            $(oNewDiv).remove();
            allInline = false;
        }
    }
}

//javascript 生成 n位 随机数 
//调用：var thisNum =  getRandomNum (9);
function getRandomNum() {
    var retValue = "";
    var num = /^\d+$/.test(arguments[0]) ? arguments[0] : 0;
    //第一个参数是数字 
    for (var i = 0; i < num; i++) {
        retValue += '' + i == 0 ? parseInt(9 * Math.random()) + 1 : parseInt(10 * Math.random());//开始数字不为0 
    }
    return retValue;
}

//拖动对象的触碰感知函数，返回全局变量并改变样式
//参数：posX拖动对象左顶点X坐标值
//     posY拖动对象左顶点X坐标值
//     dragObj拖动对象,dom对象
function touchBorder(x, y, posX, posY, dragObj) {
    var dragplace = document.getElementById('dragPalcer');
    //定义坐标原点，背景图片的左上角在整个页面中的绝对位置
    var pos = $(".main").position();
    var paddLeft = parseInt($(".main").css("padding-left"));
    var marginLeft = parseInt($(dragplace).css("margin-left"));
    var paddRight = parseInt($(".main").css("padding-right"));
    //console.log(paddRight);
    var minX = pos.left + paddLeft + marginLeft+5;
    var minY = pos.top + 30;
    //console.log(minX + "," + minY);   //坐标原点
    var maxX = minX + dragplace.offsetWidth + 10;
    var maxY = minY + dragplace.offsetHeight;
    var rightTopX = posX + 40;
    var rightTopY = posY + 58;
    var isLT = false, isRT = false, isLB = false, isRB = false, llInline = false;
    var url = window.location.href;
    if (url.indexOf("PerLessonForTS2") > 0) {//针对攀登教材
        var tempMaxY = $(".main").get(0).offsetWidth - $("#dragToolBar").get(0).offsetWidth;
        if (maxX > tempMaxY) {//有重叠区域        
            maxX = tempMaxY;
        }
    } 
    
    //console.log("最小宽和最大宽：" + minX + ":" + maxX + "最小高和最大高：" + minY + ":" + maxY + " 触碰点坐标:" + posX + ":" + posY);
    //左上顶点感知
    if (posX < maxX && posX > minX && posY < maxY && posY > minY) {
        isLT = true;
        allInline = false;
        //console.log("左顶点触碰：");
    }
    //右上顶点感知
    if (rightTopX < maxX && rightTopX > minX && posY < maxY && posY > minY) {
        isRT = true;
        allInline = false;
        //console.log("右顶点触碰：");
    }
    //右下顶点感知
    if (rightTopX < maxX && rightTopX > minX && rightTopY < maxY && rightTopY > minY) {
        isLB = true;
        allInline = false;
        //console.log("右底点触碰：");
    }
    //左下顶点感知
    if (posX < maxX && posX > minX && rightTopY < maxY && rightTopY > minY) {
        isRB = true;
        allInline = false;
        //console.log("左底点触碰：");
    }
    //拖动对象的任一顶点触碰感知
    if (isLT || isRT || isLB || isRB) {
        isTouch = true;
        allInline = false;
    }
    //拖动对象四个顶点全在范围内	
    if (isLT && isRT && isLB && isRB) {
        allInline = true;
        $("#dragPalcer").css("opacity", "0.4");
        //$("#dragPalcer").css({ "border": "1px red solid" });        
    } else {
        $("#dragPalcer").css("opacity", "1");
        //$("#dragPalcer").css({ "border": "0px red solid" });
    }
    //触碰改变样式	
    if (allInline) {        
        //转换成容器内坐标值
        var o = $("#dragPalcer").position();
        var a = o.left;
        var b = o.top;
        crossObj.move(x - a, y - b);
        //拖动时高亮显示点读框
        $("a.readbox").css({ "border": "1px red solid" });
        allInline = true;
    }
    else {
        allInline = false;
        $("a.readbox").css({ "border": "0px red solid" });
    }
}

//检查是否是移动平台
function isMobilePlatform() {
    var isTrue = false;
    //判断是否移动端设备的JS代码，超短，百度都用它
    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|ios)/i)) {
        isTrue = true;
        //console.log("移动平台");
    }
    else {
        isTrue = false;
        //console.log("PC");
    }
    return isTrue;
}