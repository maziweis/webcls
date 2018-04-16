var rootSourcePath = "";
var selectPageNum = 0;
var BookPageJs = "";
$(function () {
    loadBackImg();//加载背景图片
    getPageInfo();//加载数据
})
//加载背景图片
function loadBackImg() {
    //var strArr = BookPageJs.split("/");
    var bookID = Common.QueryString.GetValue("BookID");
    var strArr = preLessonManagement.GetPageJsByBookID(bookID).split("/");
    strArr.splice(strArr.length - 1, 1);
    rootSourcePath = strArr.join("/") + "/";

    var curPage = request("PageIndex");
    selectPageNum = curPage
    //http://192.168.3.93:8001/Course/TextBook/SZ4B/pagebg/page006.jpg
    //http://192.168.3.93:8001/Course/TextBook/SZ4B/pagebg/page006.jpg
    if (curPage < 10) { curPage = "page" + PrefixInteger(curPage, 3); }
    else { curPage = "page" + PrefixInteger(curPage, 3); }
    var imgSrc = "url(" + rootSourcePath + "pagebg/" + curPage + ".jpg)";
    alert(imgSrc);
    $("#dragPalcer").css({ "background-image": imgSrc });
}
//按照指定长度为数字前面补零输出
function PrefixInteger(num, length) {
    return (Array(length).join('0') + num).slice(-length);
}
function closeArt() {
    var api = art.dialog.open.api;
    api && api.close();
}

//从数据库中获取当前页面信息
function getPageInfo() {
    var pageIndex = selectPageNum;
    /////////////查询当前页面的数据////////////////
    var userID = Common.QueryString.GetValue("UserID");
    var bookID = Common.QueryString.GetValue("BookID");
    var cataID = Common.QueryString.GetValue("CataID");
    var pageIndex = Common.QueryString.GetValue("PageIndex");


    var obj = preLessonManagement.GetUserPressonJsonByWhere(userID, bookID, cataID, pageIndex);
    var jsonContent = "";
    if (obj.length < 1) {
        alert("查无数据");
        return;
    }
    for (var i = 0; i < obj.length; i++) {
        var pageId = obj[i].Page;
        if (pageId == pageIndex) {
            jsonContent = obj[i].PreLessonContent;
        }
    }
    //alert("当前页码内容为：" + jsonContent);
    var jsonObj = JSON.parse(jsonContent);
    var pageNum = jsonObj.pageNum;
    $.each(jsonObj.btns, function (index, items) {
        var dragItem = this;
        if (pageNum == pageIndex) {
            var id = dragItem.id;
            //坐标位置
            var posX = parseFloat(dragItem.X);
            var posY = parseFloat(dragItem.Y);
            var objType = parseInt(dragItem.icoType);
            var linkUrl = dragItem.sourceUrl;
            var temp = '<div class="newObj imgIco' + objType + '" hidsrc="' + linkUrl + '" sourcetype="' + objType + '" id="' + id + '" style="left:' + posX + 'px;top:' + posY + 'px;"></div>';
            $("#dragPalcer").append(temp);
        }
    });
    $(".newObj").each(function (index) {
        var curObj = $(this).get(0);
        bindEvents(curObj)
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