var TimeFn = null;	//单/双击延时器
var lastClickTime = 0;
var clickTimer;
var timeOutEvent = 0;
var delBtnIsShow = false;//删除按钮是否显示
$.fn.isChildAndSelfOf = function (b) {
    return (this.closest(b).length > 0);
};

$(function () { 
    autoWidth();//备课面板宽度自适应
    autoSize();//监控浏览器的拉伸
    $(".pageList .pageDiv ul li a").on("click", function () {
        $(".pageList ul li").removeClass("on");
        $(this).parent().addClass("on");
    });
    $(".pageList h3#unitName").on("click", function () {
        slideAnimate("open");
        if ($(".jxDiv").is("hidden")) {
            $(".jxDiv").hide(500);
        }        
        //$(this).next().slideToggle();
        //$(".jxDiv").slideToggle();
    })
    $(".typelist a").on("click", function () {
        $(this).parent().find("a").removeClass("cur");
        $(this).addClass("cur");
    })    
    $(".navTop .toggle").on("click", function () {
        var siblingsDom = $(this).siblings();
        var arrDom = [];
        $(siblingsDom).each(function (index, item) {    //遍历出当前的所有同级元素
            if ($(item).is(":visible")) {   //判断条件为显示的元素
                arrDom.push(item);
            }
        });
        if ($(this).parent().hasClass("up")) {
            $(this).parent().removeClass("up").addClass("down");
            $(arrDom[arrDom.length - 1]).css("height", "0");    //隐藏最后一个
        }
        else if ($(this).parent().hasClass("down")) {
            $(this).parent().removeClass("down").addClass("up");
            $(arrDom[arrDom.length - 1]).css("height", "auto"); //显示最后一个
        }
        autoWidth();
    })   
    //绑定body的点击事件
    $("body").on("click", function (event) {
        bindBodyClick(event);
    });
    //移动端显示录制按钮
    var Ispc = IsPC();
    if (Ispc) {
        $(".headTitle .record").css("display", "none");
        $(".headTitle .play").css("right", "10%");
        $(".headTitle .save").css("right", "5%");
    }
    else {
        $(".headTitle .record").css("right", "15%");
        $(".headTitle .play").css("right", "10%");
        $(".headTitle .save").css("right", "5%");
    }

    //loadMap();//教学地图初始化
    //教学地图点击切换
    $("#jxMap").on("click", function () {
        $(this).next().slideToggle("fast", function () {
            if (!$(this).is(':hidden')) {//展开
                $(".sortTab").each(function (index) {
                    if (index != $(".sortTab").length-1) {
                        $(this).find("ul").addClass("close");
                        $(this).find("h4").removeClass("open");
                    }                    
                })
                scrollDivPos();//滚动到底
                //保存统计日志到数据库
                commonFuncJS.SaveOperationRecord(preLessonPageInit.UserID, preLessonPageInit.UserType, Constant.OperType.ClickTeachMap_TYPE, "网站地图模块：用户点击打开了教学地图");
            }
            else {
                
            }
        });
        $(".pageDiv").slideToggle();
        $("#divPagebox").css("height", $(window).height() - $(".headTitle").height() - 78 * 2);
    });    
})
//body的click事件绑定
function bindBodyClick(event) {
    var e = event || window.event || e;
    var obj = $(e.srcElement || e.target);
    if ($(obj).isChildAndSelfOf("#unitName") || $(obj).attr("class") == "catalogOl") {

    }
    else {
        slideAnimate("close");        
        //$('.pageList h3#unitName').show(500);
    }    
}

function slideAnimate(option) {
    //选择教材目录开关
    var slideW = $(".catalogOl").width();
    if (option == "close") {
        $(".catalogOl").stop().animate({ left: -slideW }, 200);
    }
    else if (option == "open") {
        $(".catalogOl").stop().animate({ left: 0, scrollTop: $(".catalogOl .on").offset().top }, 200);
    }
}

//备课面板宽度根据屏幕适应
function autoWidth() {
    var urlS = window.location.href;
    //var imgRate = 1.4;//教材内页图片比例，高/宽
    var imgRate = 1046 / 747;//教材内页图片比例，高/宽
    if (urlS.indexOf("PerLessonForTS2.aspx") != -1) {   //特色-攀登-备课
        imgRate = 770 / 960;    //特色攀登内页图片比例，高/宽
    }
    var allH = $(window).height();
    var headH = $(".headTitle").height();
    var boxSize = 20 * 2;//内外边距
    var finalH = allH - headH - boxSize - 20;
    var minH = parseFloat($(".leftColumn").css("min-height"));
    if (finalH < minH) {
        finalH = minH;
    }
    var finalW = finalH / imgRate;
    var navTopH1 = $("#tab1 .navTop").height() || $("#tab8 .navTop").height() || $("#tab5 .navTop").height() || $("#tab6 .navTop").height();
    var navTopH2 = $("#tab2 .navTop").height();
    var navTopH3 = $("#tab3 .navTop").height();
    var tabH = $("#tablist").height();
    var searchH = $(".searchBox").height() + 20;
    var saveBtnH = $(".pagecontrols").height() + parseFloat($(".pagecontrols").css("padding-top")) * 2;
    if (saveBtnH == undefined || isNaN(saveBtnH)) {
        saveBtnH = 0;
    }
    //$(".pageDiv").css({ "height": allH - headH - 78 });
    $(".jxScroll").css({ "height": allH - headH - 78 * 2 - $(".btnAdd").height() - 55-40 });   //教学地图模块
    $(".leftColumn").css({ "height": finalH, "width": finalW });
    $("#dragPalcer").css("height", finalH);
    $(".rightColumn").css({ "margin-left": finalW + boxSize, "height": finalH + 20 });
    $("#tab1 .navTop.up +.toolbar,#tab8 .navTop.up +.toolbar,#tab5 .navTop.up +.toolbar,#tab6 .navTop.up +.toolbar,#tab1 .comingSoon,#tab8 .comingSoon,#tab5 .comingSoon,#tab6 .comingSoon,#mytab .emptyRec").css({ "height": finalH - navTopH1 - tabH });
    $("#tab1 .navTop.down +.toolbar,#tab8 .navTop.down +.toolbar,#tab5 .navTop.down +.toolbar,#tab6 .navTop.down +.toolbar,#tab1 .comingSoon,#tab8 .comingSoon,#tab5 .comingSoon,#mytab .emptyRec").css({ "height": finalH - navTopH1 - tabH });
    $("#tab2 .navTop.up +.toolbar,#tab2 .navTop.down +.toolbar,#tab2 .comingSoon").css({ "height": finalH - navTopH2 - tabH - 40});
    $("#tab2 .navTop.pindu.up +.toolbar,#tab2 .comingSoon").css({ "height": finalH - navTopH2 - tabH });
    $("#tab2 .navTop.pindu.down +.toolbar,#tab2 .comingSoon").css({ "height": finalH - navTopH2 - tabH });
    $("#tab3 .toolbar,#tab3 .emptyRec").css({ "height": finalH - navTopH3 - tabH - saveBtnH, "margin-bottom": saveBtnH });
    $("#tab4 .searchResult,#tab4 .emptySearch").css({ "height": finalH - 10 - searchH - tabH });
    $(".pageList").css("height", allH - headH);
    //ratio为课本图片的缩放比，当前的宽度除以原始图片的宽度，此为全局变量，供电子书页面调用
    ratio = finalW / 747;//非常重要，影响所有点读框的位置   
    if (urlS.indexOf("PerLessonForTS2.aspx") != -1) {   //特色-攀登-备课
        ratio = finalH / 770;//非常重要，影响所有点读框的位置   
    }
    $(".pagecontrols").css("width", $(".rightColumn").width());

    $("#divPagebox").css("height", allH - headH - 78 * 2);
}
function uploadW() {
    //我的资源资源列表宽度
    $("#tab3 .uploadBar ol .title").css("width", $("#tab3 .uploadBar ol li").width() - $("#tab3 .uploadBar ol li .intDiv").width() - $("#tab3 .uploadBar ol li .colorBlue").width() - 40);
    $("#mytab .uploadBar ol .title").css("width", $("#mytab .uploadBar ol li").width() - $("#mytab .uploadBar ol li .intDiv").width() - $("#mytab .uploadBar ol li .colorBlue").width() - 40);
    $("#tab3 .toolbar .dragEnable").css("width", $("#tab3 .toolbar li").width() - $("#tab3 .toolbar li label").width() - $("#tab3 .toolbar li .shareToSchool ").width() - 80);
    $("#mytab .dragEnable").css("width", $("#mytab .toolbar li").width() - $("#mytab .toolbar li label").width() - $("#mytab .toolbar li .shareToSchool ").width() - 60);
    $(".JFCont .dragEnable span").css("width", $(".JFCont .dragEnable").width() - $(".JFCont .dragEnable a").width() - 90);
    autoWidth();
}
$(window).resize(function () {
    autoWidth();
    uploadW();
});


//监控浏览器的拉伸,每次计算后保留到小数点后3位
function autoSize() {
    var fH = $("#dragPalcer").height(); //第一次加载时的初始高度
    $(window).resize(function () {
        var intH = $("#dragPalcer").height();   //缩放浏览器过后的高度
        var newObj = $(".newObj");
        var newObj_1 = $(".newObj_1");
        var readbox = $(".readbox");
        var scoleN = intH / fH;
        fH = intH;  //缩放后的高度，是下次缩放前的初始高度。
        if (newObj.length > 0) {
            newObj.each(function (index,items) {
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
    })
}

//上传文件
function uploadfile(valudata) {
    $("#divUserResource ul").hide();
    $("#btnDelUserResource").unbind("click");
    var input = $("#divUserNav").find("input[name='allcheckbox']");
    $(input).attr("disabled", "disabled");
    var data = [];
    data.push(valudata);
    preLessonPageInit.InitEditionUploadFile(data, "android");
}

/********************************************************教学地图相关***************************************************************/
////////////////获取教学地图列表数据///////////////////////
function loadMap() {
    var cookieJson = isHasSession("mapArr");   //检测session中是否有当前页的按钮信息
    if (cookieJson != null && cookieJson !== undefined && cookieJson!="") {
        var mapJSON = sessionS.get("mapArr");
        setupMapList(mapJSON);
    }else{
        var mapJSON = preLessonManagement.GetStandBookMap(preLessonPageInit.UserID, preLessonPageInit.BookID, preLessonPageInit.CataID);
        if (mapJSON == null || mapJSON == "") {//数据为空创建一个地图节点
            nullList();
        }
        else {
            mapJSON.replace('"[', '[');
            mapJSON.replace('["', ']');
            setupMapList(mapJSON);
        }
    }
    
}

////////////////更新session保存教学地图列表数据///////////////////////
function savemap(num) {
    var data = getData(".jxScroll .sortTab");
    if (data == "") {   //第一次加载时为空 不做处理
        return false;
    }
    if (num == "1") {
        unitID = preLessonPageInit.CataID;
    } else {
        unitID = preLessonPageInit.LastOperateUnitID;
    }
        
    //console.log(unitID, data);
    //sessionS.set("mapArr", data);   
    var result = preLessonManagement.SaveUserTeachMap(preLessonPageInit.UserID, preLessonPageInit.UserType, preLessonPageInit.BookID,unitID, data);
    sessionS.del("mapArr"); //教学地图数据保存数据库后才删除
    sessionS.del("operation");
    return result;
}

//获取所有节点数据并组装成json字符串
//参数为一个选择符或一个DOM对象（.sortTab容器对象）
function getData(selecter) {
    var arr = [];
    var str = "";
    if ($(selecter).length == 0) {  //第一次加载时为空 返回空值
        return str;
    }
    str += '[';
    $(selecter).each(function () {
        var _this = this;
        var ulObj = $(_this).find("ul");
        var stepName = $(_this).find("b").text();
        str += '{"stepName":"' + stepName + '",';        
        if ($(ulObj).find("a").length == 0) {
            str += '"liList":[#';
        }
        else {
            str += '"liList":[';
            $(ulObj).find("a").each(function () {
                str += '{"id":"' + $(this).attr("hidId") + '",';
                str += '"pageNum":' + $(this).attr("hidpage") + ',';
                str += '"sourceSrc":"' + $(this).attr("hidsrc") + '",';
                str += '"sourcetype":"' + $(this).attr("sourcetype") + '",';
                str += '"comeFrom":"' + $(this).attr("comeFrom") + '",';
                str += '"randId":"' + $(this).attr("randId") + '",';
                str += '"sourceName":"' + $(this).text() + '"},';
            });
        }        
        str = str.substring(0, str.length - 1);
        str += ']},';
    });
    str = str.substring(0, str.length - 1) + "]";    
    return str;    
}
//组装地图列表
function setupMapList(listJson) {
    var jsonObj = JSON.parse(listJson);
    var str="", curCalss="";
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
            var randId = item.randId;
            str += '<li><a href="#none" randId="' + randId + '" hidpage="' + pageNum + '" hidId="' + id + '" hidsrc="' + sourceSrc + '" sourcetype="' + sourcetype + '" comeFrom="' + comeFrom + '">' + sourceName + '</a></li>';
        })
        str += '</ul>';
        str += '</div>';
    });
    $(".jxScroll").html(str);
    bindOpenEvent();//绑定链接事件

    //绑定拖动排序事件
    $(".sortTab").each(function () {
    //$(".sortTab ul").each(function () {
        var obj = $(this).get(0);
        bindDragSort(obj);//绑定拖动排序功能
        //bindDragSort2($(obj).prev().get(0));
    });
    //给教学步骤绑定单双击、触摸滑动事件
    BindFn('.sortTab h4');    
}

//数据为空，创建第一个地图节点
function nullList() {
    //模拟数据加载
    var str = "";
    var curIndex = 1;
    str += '<div class="sortTab">';        
    str += '	<h4 class="open cur nullNode"><span class="ico"></span><b>第' + ArabiaToChinese(curIndex) + '步：课堂导入</b><em class="setEm" onclick="delSetp(this)"></em></h4>';
    str += '	<ul id="sortlist1"></ul>';
    str += '</div>';   
    $(".jxScroll").html(str);
    //绑定拖动排序事件
    //$(".sortTab ul").each(function () {
    $(".sortTab").each(function () {
        var obj = $(this).get(0);
        bindDragSort(obj);//绑定拖动排序功能
    });
    //给教学步骤绑定单双击、触摸滑动事件
    BindFn('.sortTab h4');
}

//绑定点击打开事件
function bindOpenEvent() {
    $(".sortTab ul li a").unbind("click");  //先解绑，防止重复绑定    
    $(".sortTab ul li a").bind("click", function () {
        var mask = $(document).mask();
        window.setTimeout(function () {
            $(document).unmask();//1秒消失
        }, 1000);
        var curPage = $("#dragPalcer").attr("hidpage");//当前页码
        var clickPage = $(this).attr("hidpage");//点击资源所属页码
        oldRmbPage = clickPage;
        $(".sortTab ul li").removeClass("sortable-drag");
        $(".sortTab ul li a").removeClass("cur");
        $(".sortTab h4.cur").removeClass("cur");
        $(this).addClass("cur");
        var hObj = $(this).parents("ul").eq(0).prev();
        hObj.addClass("cur");
        if (curPage !== clickPage) {//只有非当前页码时才跳页
            //跳转到指定页面
            var urlS = window.location.href;
            if (urlS.indexOf("PerLessonForTS2.aspx") != -1) {   //攀登备课
                $("#pageBox li a").each(function () {
                    var curPage = $(this).attr("hidpage");
                    if (curPage == clickPage) {
                        $(this).click();
                    }
                })
            } else {
                $("#divPagebox li a").each(function () {
                    var curPage = $(this).attr("hidpage");
                    if (curPage == clickPage) {
                        var clickAlink = $(this).get(0);
                        changePage(clickAlink);
                    }
                })
            }
        }
        //调用弹窗预览资源
        filePreview($(this).get(0), $(this).attr("sourcetype")); 
    })
}


//回调方法，删除节点时回调
function delNode(delObj) {
    //参数delObj为当前要删除的节点对象				
    if (window.confirm('你确定要删除此条记录吗？')) {
        var liNode = delObj.parentElement;
        var parentN = liNode.parentElement;
        parentN.removeChild(liNode);//删除当前节点
        alert("删除成功");
        return false;
    } else {
        alert("你取消了删除操作");
    }
}

//删除步骤的方法
function delSetp(delObj) {
    //参数delObj为当前要删除的节点对象	
    commonFuncJS.openConfirm('你确定要删除此条记录吗？', function () {
        var liNode = delObj.parentElement;
        var parentN = liNode.parentElement;
        var pageArr = [];
        var uniqueArr = [];
        var randIdArr = [];
        var str = "", jsonObj;
        $(parentN).each(function () {
            var _this = this;
            var ulObj = $(_this).find("ul");
            if ($(ulObj).find("a").length > 0) {
                str += "[";
            }
            else {//没有子项时，添加一个占位字符，方便组字符串
                str += "[#";
            }
            $(ulObj).find("a").each(function () {
                var page = $(this).attr("hidpage");
                var sourceId = $(this).attr("hidsrc");
                var randId = $(this).attr("randId");
                pageArr.push(page); //删除资源所在的页码
                randIdArr.push(randId);
                str += '{"page":' + page + ',"randId":"' + randId + '","sourceId":"' + sourceId + '"},';
            });
            str = str.substring(0, str.length - 1);
            str += "]";
        }); 
        //删除节点前将高亮样式重新定义在上一个步骤节点中。        
        parentN.remove();//删除地图节点及子节点 
        var lastNode = $(".sortTab h4").last();
        $(".sortTab h4").removeClass("cur");
        if ($(lastNode).hasClass("open")) {
            $(lastNode).addClass("cur");            
        }
        else {
            $(lastNode).addClass("cur endNode");            
        } 
        $(lastNode).next().removeClass("nochild");
        //更新删除步骤后的教学地图session
        var data = getData(".jxScroll .sortTab");
        sessionS.set("mapArr", data);//更新session
        //删除步骤时，先保存本页的按钮数据，防止用户刷新导致水滴不见，地图步骤还在
        var jsonInfo = getCurPageJson(); //获取当前页中的所有备课按钮json信息
        saveToCookie($("#dragPalcer").attr("hidpage"), jsonInfo);//切换前先保存当前页面

        uniqueArr = pageArr.unique();//去除重复项
        updateSession(uniqueArr, str);//更新session

        //删除步骤时，itemArr应添加对应的页码信息
        //var pageArrOld = [];
        //var pageArrNew = [];
        //pageArrOld = sessionS.get("itemArr").split(",");    
        //pageArrNew = uniqueArr.join(',');
        //var temArr = $.merge(pageArrOld, pageArrNew);
        //temArr = temArr.unique();
        //sessionS.set("itemArr", temArr.join(','));
        //保存统计日志到数据库
        commonFuncJS.SaveOperationRecord(preLessonPageInit.UserID, preLessonPageInit.UserType, Constant.OperType.DelMapStep_TYPE, "网站地图模块：用户删除了网站地图中的步骤");
        //savemap(); //删除步骤暂不保存到数据库
        //commonFuncJS.openAlert('删除成功！');

        //删除教学步骤成功后更新操作对象的数量
        var newCount = parseInt(operation.delStepCount) + 1;
        operation.delStepCount = newCount;
        sessionS.set("operation", JSON.stringify(operation));
        return false;
    }, function () {
        $('.sortTab h4 em').css({ "-webkit-transform": "translateX(0)", "transform": "translateX(0)" });
        $('.setEm').hide();
        //commonFuncJS.openAlert('你取消了删除操作！');
    });
}
//更新非session中的内容
function updateSession(uniqueArr, delSourceArr) {
    //按页码删除资源数据    
    jsonObj = JSON.parse(delSourceArr);  //要删除资源的集合
    for (var i = 0; i < uniqueArr.length; i++) {     //循环删除资源的所在页码
        var delSourceIdStr = "";
        var curPage = $("#dragPalcer").attr("hidpage");//当前页码
        var pageId = uniqueArr[i];
        var curSourceArr = [];
        var unqieIdArr = [];
        $.each(jsonObj, function (index, item) {    //遍历删除资源的集合
            var pageNum = item.page;
            var sourceId = item.sourceId;
            var unId = item.randId;
            if (pageId == pageNum) {
                curSourceArr.push(sourceId);    //删除项的文件id集合
                unqieIdArr.push(unId);          //删除项的唯一表示randId集合
                //删除当前DOM中的水滴按钮结构
                $("#dragPalcer div").each(function () {
                    var srcId = $(this).attr("randId");
                    if (unId == srcId) {
                        $(this).remove();
                    }
                })
            }
        }); 

        //更新删除项所在页面的最新session信息
        var cookieJson = isHasSession(pageId);   //检测session中是否有当前页的按钮信息
        var pageJson = "";
        if (cookieJson !== "" && cookieJson !== null && cookieJson !== undefined) {//如果当前页水滴信息存在于session中,则删除对应的资源项
            pageJson = sessionS.get(pageId);
        } else {//否则从数据库加载按钮信息
            pageJson = preLessonPageInit.GetUserPressonJsonByWhere(pageId);           
        }
        //console.log("已有的数据：" + pageJson);

        //组装更新后的页面水滴信息        
        if (pageJson !== "" && pageJson !== null) {
            var pageMsg = JSON.parse(pageJson);
            var btnS = JSON.parse(pageJson);            
            var pageStr = "";
            var btnArr = [];
            var cout = 0;            
            pageStr += '{"pageNum":' + pageMsg.pageNum + ',"imgSrc":"' + pageMsg.imgSrc + '","btns":[';
            var tempBtns = [];
            tempBtns = btnS.btns;
            var tempContent = "";
            $.each(btnS.btns, function (index, item) {
                var _this = item;
                var unId = _this.randId;
                var isFind = false;
                for (var i = 0; i < unqieIdArr.length; i++) {                    
                    if (unqieIdArr[i] == unId) {
                        isFind = true;                       
                    }
                }
                if (!isFind) {
                    tempContent += '{"id":"' + item.id + '","icoType":"' + item.icoType + '","randId":"' + item.randId + '","isread":' + item.isread + ',"sourceUrl":"' + item.sourceUrl + '","X":' + item.X + ',"Y":' + item.Y + ',"title":"' + item.title + '","comeFrom":"' + item.comeFrom + '"},';
                }
            });             
            pageStr += tempContent.substring(0, tempContent.length - 1);
            pageStr += ']}';
            if (tempContent == "") {
                pageStr = "";
            }           
            //console.log(pageStr);
            sessionS.set(pageId, pageStr);
            delSourceIdStr = curSourceArr.join(',');//当前页码的资源ID集合，以逗号分隔开 
        }
        //更新session
        //var isDelSucced = preLessonManagement.DeletePreLessonResource(preLessonPageInit.UserID, preLessonPageInit.BookID, pageId, delSourceIdStr);//删除一页的内容
    }
    
}

//保存到数据库中，和保存按钮的类似，只是去掉每次的弹出对话框
function saveToDb() {
    saveJson();
    clearOperation();//清空操作数
    $("#divPagebox li").each(function (l, li) {
        var pagenum = $(li).attr("id");
        var returnVal = isHasSession(pagenum);
        if (returnVal !== "" || returnVal !== null || returnVal !== undefined) {
            //////////删除session////////////
            sessionS.del(pagenum);
        }
    });
    sessionS.del("itemArr");
    sessionS.del("mapArr");
    preLessonPageInit.IsSame = true;    
}

//回调方法，删除节点时回调
function delNode(delObj) {
    //参数delObj为当前要删除的节点对象				
    if (window.confirm('你确定要删除此条记录吗？')) {
        var liNode = delObj.parentElement;
        var parentN = liNode.parentElement;
        parentN.removeChild(liNode);//删除当前节点
        alert("删除成功");
        return false;
    } else {
        alert("你取消了删除操作");
    }
}

//拖动结束回调事件，用来处理一些样式
function sortEnd() {
    //最后一个节点处理
    var endNode = $(".jxScroll h4").last().get(0);
    var endUl = $(".jxScroll ul").last().get(0);
    if ($(endUl).hasClass("close")) {        
        $('.sortTab h4').removeClass("endNode");
    }
    if ($(endUl).children().length > 0) {
        if ($(endUl).hasClass("nochild")) {
            $(endUl).removeClass("nochild")
        }
    }
    //小图标智能删除
    $(".jxScroll ul").each(function (index) {
        var hObj = $(this).prev().get(0);
        var icoObj = $(this).prev().find("span");
        $(hObj).css({ "background-color": "#fff" });
        if ($(this).children().length > 0) {//有子节点 
            if (!$(icoObj).hasClass("ico")) {
                $(icoObj).addClass("ico");
                if (!$(icoObj).hasClass("showIco")) {
                    $(icoObj).addClass("showIco");
                }
            }
            else {
                $(icoObj).addClass("showIco");
            }
            if (index == $(".jxScroll ul").length - 1) {
                $(hObj).removeClass("endNode");
            }
        } else {//空节点
            var hObj = $(this).prev().get(0);                       
            $(icoObj).removeClass("showIco");            
            if (index == $(".sortTab ul").length - 1) {
                $(hObj).addClass("endNode");
            }
            else {
                $(this).addClass("nochild");
            }
        }
    });
    //拖动资源排列顺序后更新操作对象的数量
    var newCount = parseInt(operation.sortObCount) + 1;
    operation.sortObCount = newCount;
    sessionS.set("operation", JSON.stringify(operation));
    //savemap();//排序拖动后 暂不保存数据库
}

/*添加步骤节点*/
function addItem() {
    var cout = $(".jxScroll ul").length + 1;
    var index = ArabiaToChinese(cout)
    var html = '<div class="sortTab"><h4 class="open endNode cur"><span class="ico"></span><b>第' + index + '步：新加步骤</b><em class="setEm" onclick="delSetp(this)"></em></h4><ul id="sortlist' + cout + '"></ul></div>';
    $(".sortTab h4.cur").removeClass("cur");
    if (cout - 1 == 25) {
        alert("教学步骤数已达上限！");
        $(".sortTab h4").last().addClass("cur");
        return;
    }
    $('.sortTab h4').removeClass("endNode");
    $('.sortTab h4').removeClass("nullNode");
    var lastNode = $('.sortTab').last();
    $('.jxScroll').append(html);
    //修改上一个空节点样式
    var beforeNode = $(lastNode).find("ul");
    beforeNode.addClass("nochild");
    $(beforeNode).children("li").removeClass("lastclose");        
    $(".sortTab").each(function () {
        var obj = $(this).get(0);
        bindDragSort(obj);//绑定拖动排序功能
    });
    //添加教学步骤成功后更新操作对象的数量
    var newCount = parseInt(operation.addStepCount) + 1;
    operation.addStepCount = newCount;
    sessionS.set("operation", JSON.stringify(operation));

    //保存统计日志到数据库
    commonFuncJS.SaveOperationRecord(preLessonPageInit.UserID, preLessonPageInit.UserType, Constant.OperType.AddTeachStep_TYPE, "网站地图模块：用户添加了教学地图中的步骤");
    //savemap();//插入步骤后暂不保存数据库
    $(".sortTab ul li a.cur").removeClass("cur");
    BindFn($('.jxScroll h4').last());    
    bindDragSort($(html).get(0));
    scrollDivPos();//滚动到底
}
//控制div中滚动条自动滚动
function scrollDivPos(){
    var container = $('.jxScroll').get(0);//父容器    
    container.scrollTop = container.scrollHeight;
}

//在当前步骤下插入一条数据
function insertData(dataid, titlestr, icoType, sourceUrl, className ,comeFrom,randId) {
    var curLight = $(".sortTab h4.cur").get(0);
    var curWrap = $(curLight).next().get(0);
    var lastNode = $(".sortTab h4").last().get(0);//最后一个节点
    var dragId = dataid;//此ID要获取得来，这儿只是静态示例  
    var str = '<li><a href="#none" randId="' + randId + '" hidpage="' + $("#dragPalcer").attr("hidpage") + '" hidId="' + dragId + '" hidsrc="' + sourceUrl + '" sourcetype="' + icoType + '"comefrom ="' + comeFrom + '" class="cur">' + titlestr + '</a></li>';
    $(".sortTab ul li a.cur").removeClass("cur");
    $(curWrap).append(str);
    $(curWrap).removeClass("nochild").removeClass("close");

    $(curLight).removeClass("nullNode");
    if (curLight == lastNode) {//如果是最后一节点
        $(curLight).removeClass("endNode");
    }
    
    //节点图标及高亮样式
    if ($(curLight).find("span.ico").length == 0) {
        var text = $(curLight).text();
        $(curLight).removeClass("endNode ");
        $(curLight).html('<span class="ico showIco"></span><b>' + text + '</b><em class="setEm" onclick="delSetp(this)"></em>');
    }
    $(curLight).find("span.ico").addClass("showIco");
    //展开当前节点
    if (!curWrap.hidden) {
        $(curWrap).show();
        $(curWrap).prev().addClass("open");
    }
    bindOpenEvent();//重新绑定链接事件    
    //saveToDb();//保存到数据库中
    
    var container = $('.jxScroll').get(0);//父容器  
    var pos = $("li").index($(str));
    var scrollTop = container.scrollHeight;
    container.scrollTop = scrollTop;
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


/********************************************************教学地图步骤编辑模式相关***************************************************************/
//给dom绑定固定事件 click，touch
var startX, startY;
function BindFn(obj) {
    if (IsPC()) {
        var flagF = false;
        $(obj).on({
            click: function(e) {
                e.stopPropagation();
                $(this).css("cursor","pointer");
                OneOrDbClick(this);
            },
            mousedown: function (e) {
                flagF = true;
                e.stopPropagation();
                $(this).css("cursor","-webkit-grab");
                TouchStartF(this, e);                
            },
            mouseup: function (e) {
                if (flagF) {    //防止直接触发mouseup事件，导致拖拽功能失效
                    e.stopPropagation();
                    TouchMoveF(this, e);                    
                }          
            }
        })
    }else{
        $(obj).on({
            touchstart: function(e) {
                TouchStartF(this,e);
            },
            touchmove: function(e) {
                var e = event;
                clearTimeout(timeOutEvent);
                timeOutEvent = 0;
            },
            touchend: function(e) {
                TouchMoveF(this,e);
                TouchEndF(this);
            }
        })
    }
	
}
//给dom解绑固定事件click，touch
function UnBindFn(obj){
    $(obj).off('click touchstart touchmove touchend mousedown mouseup');
}
//touchstart调用方法
function TouchStartF(obj,event){
    var _this = obj;
    var e = event;
    if(IsPC()){
        startX = e.pageX;
        startY = e.pageY;
    } else {        
        timeOutEvent = setTimeout(function () {
            ShowElement($(_this).find('b').get(0));  
            timeOutEvent = 0;
        }, 500);
        
        startX = e.originalEvent.changedTouches[0].pageX;
        startY = e.originalEvent.changedTouches[0].pageY;
    }
    e.preventDefault();    
}
//touchmove调用方法
function TouchMoveF(obj,event){
    var e = event;
    var _this = obj;
    var firstObj = $(".jxScroll em").eq(0);
    if (firstObj.get(0) == $(obj).children("em").eq(0).get(0)) { return;}
    if(IsPC()){
        moveEndX = e.pageX;
        moveEndY = e.pageY;
    }else{
        moveEndX = e.originalEvent.changedTouches[0].pageX;
        moveEndY = e.originalEvent.changedTouches[0].pageY;
    }
    //防止在PC上鼠标直接在h4上触发mouseup事件
    if (startX === undefined || startY === undefined) {
        return false;
    }
    X = moveEndX - startX;
    Y = moveEndY - startY;
      
    if ( Math.abs(X) > Math.abs(Y) && X > 0 ) {
        if(Math.abs(X)>20){
            //console.log("向右滑动！");
        }
        //console.log("left 2 right");
    }
    else if ( Math.abs(X) > Math.abs(Y) && X < 0 ) {
        if(Math.abs(X)>20){
            //console.log("向左滑动！");
            $(_this).find('em').show();
            $(_this).find("em").css({ "-webkit-transform": "translateX(-60px)", "transform": "translateX(-60px)" });
            delBtnIsShow = true;
            //解绑单击触摸事件
            UnBindFn('.sortTab h4');
            
            //设置初始值，解决pc端的click与mousedown冲突
            if(IsPC()){var setNumb = 0;}else{var setNumb = 1;}
            $('body').on('click',function(e){
                if(setNumb==0){	//设置开关
                    setNumb = 1;
                    return false;
                }
                e.stopPropagation();
                var _con = $('.setEm');   // 设置目标区域               
                if(!_con.is(e.target)){//隐藏删除按钮                    
                    $('.sortTab h4 em').css({ "-webkit-transform": "translateX(0)", "transform": "translateX(0)" });
                    $('.setEm').hide();                    
                }
                //else {//点击删除按钮                   
                //    //delSetp(e.target);                   
                //}
                //重绑点击触摸事件
                BindFn('.sortTab h4');
                //最终解绑
                $('body').off('click');
                //重新绑定原来的事件
                $("body").on("click", function (e) {
                    bindBodyClick(e);
                });
            });
        }
        //console.log("right 2 left");
    }
    else if (Math.abs(Y) > Math.abs(X) && Y > 0) {
        //向下滚
        var scrollSpace = $(".jxScroll").scrollTop()-Math.abs(Y);
        //console.log("下拉" + scrollSpace);
        $(".jxScroll").scrollTop(scrollSpace);
    }
    else if (Math.abs(Y) > Math.abs(X) && Y < 0) {
        //向上滚
        var scrollSpace = $(".jxScroll").scrollTop()+Math.abs(Y);
        //console.log("上拉" + scrollSpace);
        $(".jxScroll").scrollTop(scrollSpace);
    }
    else{
        //console.log("just touch");
    }
}
//tocuhend调用方法
function TouchEndF(obj){
    clearTimeout(timeOutEvent);
    if (timeOutEvent != 0) {
        unfold(obj); //展开折叠节点       
        //if($(obj).hasClass("open")){
        //    $(obj).removeClass("open");
        //}else{
        //    $(obj).addClass("open");
        //}
        //$(obj).next().slideToggle(function(){});
        //高亮样式
        $(".sortTab h4.cur").removeClass("cur");	
        $(".sortTab ul li a.cur").removeClass("cur");	
        $(obj).addClass("cur");
        //console.log("你这是点击，不是长按");
    }
    return false;
}
//模拟单双击事件
function OneOrDbClick(obj){
    var nowTime = new Date().getTime();
    var _this = obj;
    //console.log(nowTime+'-'+lastClickTime+'='+ (nowTime - lastClickTime));
    if(nowTime - lastClickTime < 200) {
        /*双击*/
        lastClickTime = 0;
        clickTimer && clearTimeout(clickTimer);
        ShowElement($(_this).find('b').get(0));
        //console.log("双击！");
    } else {
        /*单击*/
        lastClickTime = nowTime;
        clickTimer = setTimeout(function(){
            //console.log("单击！");
            unfold(obj); //展开折叠节点           
        }, 200);
    }
    //高亮样式
    $(".sortTab h4.cur").removeClass("cur");
    $(".sortTab ul li a.cur").removeClass("cur");
    $(obj).addClass("cur");
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
//关闭编辑弹窗模式
function closeMaskWin() {
    $(document).unmask();
    curEditInput.innerHTML = $("#inputValue").val();
}

//取消编辑
function cnacleMaskWin() {
    $(document).unmask();
    curEditInput.innerHTML = oldText;
}

//双击编辑可修改状态
var curEditInput,oldText;
function ShowElement(element) {
    var oldhtml = element.innerHTML;
    if (oldhtml == '<input type="text">') {	//反正编辑状态时，再次点击，此时h4中有input标签
        return false;
    }    
    if (IsPC()) {
        var newobj = document.createElement('input');
        newobj.type = 'text';
        newobj.value = oldhtml;
        newobj.id = "inputValue";
        enableEditInput(newobj, element, oldhtml);     
    }
    else {
        var input = '<div class="editBox"><div class="rename">重命名</div><input id="inputValue" type="text" class="inputStyle" value="' + oldhtml + '"><div class="alertmsg">最多只能输入10汉字，20个英文字</div><input type="button" class="cancleStyle" value="取消" onclick="cnacleMaskWin()"/><input type="button" class="submitStyle" value="确定" onclick="closeMaskWin()"/></div>';
        curEditInput = element;
        oldText = oldhtml;
        $(document).mask(input, "", "#000", "0.4");
        enableEditInput($("#inputValue").get(0), element, oldhtml);
    } 
}

//根据传的字符串获取其字数，一个中文为两个字符，英文为一个字符
function inputNum(strTemp) {    
    var sum = 0;
    chineseSum = 0;
    englishSum = 0;
    for (var i = 0; i < strTemp.length; i++) {
        if ((strTemp.charCodeAt(i) >= 0) && (strTemp.charCodeAt(i) <= 255)) {//英文
            sum = sum + 1;
            englishSum++;
        } else {//中文
            sum = sum + 2;
            chineseSum++;
        }        
    }    
    return sum;
}
//文本框,绑定了焦点获得和失去事件
function enableEditInput(obj,textObj,oldhtml) {
    var newobj = obj;
    //为新增元素添加监控事件
    //newobj.oninput = function () {
    //    var _this = this;
    //    setTimeout(function () {
    //        _this.value = _this.value.substring(0, 20);
    //    }, 1000);  //延迟执行剪切，防止输入过慢时被中断输入法
    //};
    //键盘弹起事件，此方法对中英文混合输入会有误差，以最后输入的一个字符来判断当前是何语种
    newobj.onkeyup = function () {
        var _this = this;
        var oldText = _this.value;
        var curNum = inputNum(oldText);//当前的字数
        if (chineseSum * 2 + englishSum * 1 <=20) {
            _this.value = oldText;
            console.log(parseInt(chineseSum) + parseInt(englishSum));
            $(".alertmsg").removeClass("msglight");
        } else {
            $(".alertmsg").addClass("msglight");
            _this.value = oldText.substring(0, parseInt(chineseSum) + parseInt(englishSum)-1);
            console.log("超出了！");            
        }
        //if (oldText.charCodeAt(oldText.length - 1) > 255) {
        //    //中文输入,根据最后输入的一个字符来判断当前是中文还是英文
        //    if (curNum > 10) {
        //        _this.value = oldText.substring(0, 10);
        //    }
        //}
        //else {//英文输入
        //    if (curNum > 20) {
        //        _this.value = oldText.substring(0, 20);
        //    }
        //}        
    }

    //为新增元素添加光标离开事件
    newobj.onblur = function () {
        if (this.value !== "") {    //不为空
            this.value == oldhtml ? oldhtml : this.value;	//当触发时判断新增元素值是否为空，为空则不修改，并返回原有值 
        } else {
            this.value = oldhtml;
        }
        //任用户输入多少字符，最后只截取前面十个
        textObj.innerHTML = this.value.substring(0, 20);
        //如果修改成功改变操作数
        if (newobj.value != oldhtml) {
            //修改教学步骤名成功后更新操作对象的数量
            var newCount = parseInt(operation.modifyStepCount) + 1;
            operation.modifyStepCount = newCount;
            sessionS.set("operation", JSON.stringify(operation));
            //savemap();//如果修改了值, 暂不保存数据库
        }
        //重绑点击触摸事件
        BindFn('.sortTab h4');
    }
    //限定只能输入10个汉字    
    //newobj.onkeyup = function () {
    //    setShowLength(10, this);              
    //} 
    textObj.innerHTML = '';
    if (IsPC()) {        
        textObj.appendChild(newobj);
        //textObj.innerHTML = newobj.value;
    }
    else {
        textObj.innerHTML = newobj.value;
    }
    //设置选择文本的内容或设置光标位置（两个参数：start,end；start为开始位置，end为结束位置；如果开始位置和结束位置相同则就是光标位置）
    //newobj.setSelectionRange(0, oldhtml.length);    
    newobj.focus();
    //解绑单击触摸事件        
    UnBindFn('.sortTab h4');   
}

//限定字数输入
function setShowLength(maxlength,obj) {
    var rem = maxlength - obj.value.length;
    if (rem <= 0) {
        obj.value = obj.value.substring(0, maxlength);              
        return false;
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

//jquery简易遮照插件，调用方式如下：
//<a href="#" onclick="$('#test').mask('DIV层遮罩')">div遮罩</a> 
//<a href="#" onclick="$('#test').unmask()">关闭div遮罩</a> 
//<a href="#" onclick="$(document).mask('全屏遮罩').click(function(){$(document).unmask()})">全部遮罩</a> 
(function () {
    $.extend($.fn, {
        mask: function (msg, maskDivClass) {
            var bColor = arguments[2];//背景颜色
            var bOpcity = arguments[3];//背景透明值
            this.unmask();
            // 参数 
            var op = {
                opacity: 0.2,
                z: 1200,
                bgcolor: '#fff'
            };
            var original = $(document.body);
            var position = { top: 0, left: 0 };
            if (this[0] && this[0] !== window.document) {
                original = this;
                position = original.position();
            }
            // 创建一个 Mask 层，追加到对象中 
            var maskDiv = $('<div class="maskdivgen"> </div>');
            maskDiv.appendTo(original);
            var maskWidth = original.outerWidth();
            if (!maskWidth) {
                maskWidth = original.width()
            }
            var maskHeight = original.outerHeight();
            if (!maskHeight) {
                maskHeight = original.height();
            }
            if (bColor) { op.bgcolor = bColor; }
            if (bOpcity) { op.opacity = bOpcity; }
            maskDiv.css({
                position: 'absolute',
                top: position.top,
                left: position.left,
                'z-index': op.z,
                width: maskWidth,
                height: maskHeight,
                'background-color': op.bgcolor,
                opacity: op.opacity
            });
            if (maskDivClass) {
                maskDiv.addClass(maskDivClass);
            }
            if (msg) {
                var msgDiv = $('<div class="maskContent" style="position:absolute;z-index:' + (op.z+1) + '">' + msg + '</div>');
                //msgDiv.appendTo(maskDiv);//会继承父级的半透明效果
                msgDiv.appendTo(original);//不成为子级对象，不会继承父级的半透明效果
                var widthspace = (maskDiv.width() - msgDiv[0].scrollWidth);
                var heightspace = (maskDiv.height() - msgDiv.children()[0].offsetHeight);
                msgDiv.css({//绝对居中定位                    
                    top: (heightspace / 2),
                    left: (widthspace / 2)
                });
            }
            $(this).show();//立即显示
            //maskDiv.fadeIn('fast', function () {                
            //    // 淡入淡出效果 
            //    $(this).fadeTo('slow', op.opacity);                
            //})
            return maskDiv;
        },
        unmask: function () {
            var original = $(document.body);
            if (this[0] && this[0] !== window.document) {
                original = $(this[0]);
            }
            original.find("> div.maskdivgen").fadeOut('fast', 0, function () {
                $(this).remove();
            });
            original.find("> div.maskContent").fadeOut('fast', 0, function () {
                $(this).remove();
            });
        }
    });
})();
