// 通用函数
/*--获取网页传递的参数：
 如获取Default.aspx?ID=123这个URL中ID的值时，调用方法：request("ID")
 --*/
function request(paras)
{
    var url = location.href;
    var paraString = url.substring(url.indexOf("?")+1,url.length).split("&");
    var paraObj = {}
    for (i=0; j=paraString[i]; i++){
        paraObj[j.substring(0,j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=")+1,j.length);
    }
    var returnValue = paraObj[paras.toLowerCase()];
    if(typeof(returnValue)=="undefined"){
        return "";
    }else{
        return returnValue;
    }
}

/*******************************************/
/*if (getCookie('bookName') != '' && getCookie('bookPath') != '') {
    bookName=getCookie('bookName');
	curSourcePath="SZ_"+getCookie('bookPath')+"/";
	//alert(curSourcePath);	
}*/

/*addCookie方法和getCookie方法调用方法*/
//写Cookie
function addCookie(objName, objValue, objHours) {
    var str = objName + "=" + escape(objValue);
    if (objHours > 0) {//为0时不设定过期时间，浏览器关闭时cookie自动消失
        var date = new Date();
        var ms = objHours * 3600 * 1000;
        date.setTime(date.getTime() + ms);
        str += "; expires=" + date.toGMTString();
    }
    str += "; path=/";
    document.cookie = str;
}

//读Cookie
function getCookie(objName) {//获取指定名称的cookie的值
    var arrStr = document.cookie.split("; ");
    //var arrStr = window.sessionStorage.split("; ");
    for (var i = 0; i < arrStr.length; i++) {
        var temp = arrStr[i].split("=");
        if (temp[0] == objName) return unescape(temp[1]);
    }
    return "";
}
//删除Cookie
function delCookie(name) { 
    var date = new Date();
    date.setTime(date.getTime() - 10000);//为了删除指定名称的cookie，可以将其过期时间设定为一个过去的时间 
    document.cookie = name + "=a; expires=" + date.toGMTString() + "; path=/";//不加path删除不了    
}

//删除所有备课页面的Cookie
function delAllCookie() {    
    var cval = getCookie("itemArr");    
    var temp = cval.split(',');
    var updateArr = "";//cookie中的页码集合字符串，以逗号分隔    
    for (var i = 0; i < temp.length; i++) {
        delCookie(temp[i]);
    }
    delCookie("itemArr");
}

function findDimensions() //函数：获取尺寸 
{
    //获取窗口宽度 
    if (window.innerWidth)
        winWidth = window.innerWidth;
    else if ((document.body) && (document.body.clientWidth))
        winWidth = document.body.clientWidth;
    //获取窗口高度 
    if (window.innerHeight)
        winHeight = window.innerHeight;
    else if ((document.body) && (document.body.clientHeight))
        winHeight = document.body.clientHeight;
    //通过深入Document内部对body进行检测，获取窗口大小 
    if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
        winHeight = document.documentElement.clientHeight;
        winWidth = document.documentElement.clientWidth;
    }
}

//生成N位随机数，参数为生成的位数
function MathRand(n) {
    var Num = "";
    for (var i = 0; i < n; i++) {
        Num += Math.floor(Math.random() * 10);
    }
    return Num;
}

//操作本地存储数据
var sessionS = {
    set: function (key, keyVelue) {
        window.localStorage.setItem(key, keyVelue);   //本地存数据localStorage;
    },
    get: function (key) {
        var jsonVelue = window.localStorage.getItem(key);
        return jsonVelue;
    },
    del: function (key) {
        window.localStorage.removeItem(key);
    },
    delAll: function () {
        window.localStorage.clear();
    }
}

//新增或替换一条session信息（和旧的key值匹配，如果不存在，则创建）
//insertMapCookie("p_1", "{json内容}", "itemArr")
function insertMapCookie(pageId, pageJson,oldKeyArr) {
    var oldArrIds = sessionS.get(oldKeyArr);
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
            sessionS.set(oldKeyArr, updateArr);//更新
        }
    } else {
        updateArr = pageId;
        sessionS.set(oldKeyArr, updateArr);     //session添加页码集合
    }
    sessionS.set(pageId, pageJson); //添加单页json信息到session中
}


//自定义实时缓存加载js文件函数，此为getScript方法的一个拓展，可以缓存js文件，加载一次后就不需要再加载了。
//定义一个全局script的标记数组，用来标记是否某个script已经下载到本地 
//调用方式：
//$.cachedScript('t1.js').done(function () {
//    todo:立即执行的函数
//})
var scriptsArray = new Array();
$.cachedScript = function (url, options) {
    //循环script标记数组 
    for (var s in scriptsArray) {
        //console.log(scriptsArray[s]); 
        //如果某个数组已经下载到了本地 
        if (scriptsArray[s] == url) {
            return { //则返回一个对象字面量，其中的done之所以叫做done是为了与下面$.ajax中的done相对应 
                done: function (method) {
                    if (typeof method == 'function') { //如果传入参数为一个方法 
                        method();
                    }
                }
            };
        }
    }
    //这里是jquery官方提供类似getScript实现的方法，也就是说getScript其实也就是对ajax方法的一个拓展 
    options = $.extend(options || {}, {
        dataType: "script",
        url: url,
        cache: true //其实现在这缓存加与不加没多大区别 
    });
    scriptsArray.push(url); //将url地址放入script标记数组中 
    return $.ajax(options);
};

/*
	选项卡封装
*/
opCard = function () {
    this.bind = new Array();
    this.index = 0;		//默认显示哪个选项卡，从0开始

    this.style = new Array();		//["","",""]
    this.overStyle = false;		//选项是否有over, out变换样式事件，样式为this.style[2]
    this.overChange = false;		//内容是否用over, out直接激活
    this.menu = false;				//菜单类型
    this.nesting = [false, false, "", ""];		//是否嵌套，后面2个参数是指定menu,info的子集深度所用id

    this.auto = [false, 1000];		//自动滚动[true,2000]
    this.timerID = null;			//自动播放的
    this.menutimerID = null;		//菜单延时的

    this.creat = function (func) {
        var _arrMenu = document.getElementById(this.bind[0]).getElementsByTagName(this.bind[1]);
        var _arrInfo = document.getElementById(this.bind[2]).getElementsByTagName(this.bind[3]);
        var my = this, i;
        var argLen = arguments.length;
        var arrM = new Array();

        if (this.nesting[0] || this.nesting[1])	// 有选项卡嵌套
        {	// 过滤出需要的数据
            var arrMenu = this.nesting[0] ? getChilds(_arrMenu, this.bind[0], 2) : _arrMenu;
            var arrInfo = this.nesting[1] ? getChilds(_arrInfo, this.bind[2], 3) : _arrInfo;
        }
        else {
            var arrMenu = _arrMenu;
            var arrInfo = _arrInfo;
        }

        var l = arrMenu.length;
        if (l != arrInfo.length) { alert("菜单和内容必须拥有相同的数量\n如果需要，你可以放一个空的在那占位。") }

        // 修正
        if (this.menu) { this.auto = false; this.overChange = true; } //如果是菜单，则没有自动运行，有over, out直接激活

        // 循环添加各个事件等
        for (i = 0; i < l; i++) {
            arrMenu[i].cName = arrMenu[i].className;
            arrMenu[i].className = (i != this.index || this.menu) ? getClass(arrMenu[i], this.style[0]) : getClass(arrMenu[i], this.style[1]);		//加载样式，菜单的话统一样式

            if (arrMenu[i].getAttribute("skip")) // 需要跳过的容器
            {
                if (this.overStyle || this.overChange)	// 有over, out 改变样式 或者 激活
                {
                    arrMenu[i].onmouseover = function () { changeTitle(this, 2); autoStop(this, 0); }
                    arrMenu[i].onmouseout = function () { changeTitle(this, 0); autoStop(this, 1); }
                }
                arrMenu[i].onclick = function () { if (argLen == 1) { func() } }
                arrInfo[i].style.display = "none";
                continue;
            }

            if (i != this.index || this.menu) { arrInfo[i].style.display = "none" };	//隐藏初始化，菜单的话全部隐藏
            arrMenu[i].index = i;	//记录自己激活值[序号]
            arrInfo[i].index = i;


            if (this.overChange)	//有鼠标over, out事件
            {
                arrMenu[i].onmouseover = function () { changeOption(this); my.menu ? changeMenu(1) : autoStop(this, 0); }
                arrMenu[i].onmouseout = function () { changeOption(this); my.menu ? changeMenu(0) : autoStop(this, 1); }
            }
            else	//onclick触发
            {
                arrMenu[i].onclick = function () { changeOption(this); autoStop(this, 0); if (argLen == 1) { func() } }
                if (this.overStyle)	// 有over, out 改变样式
                {
                    arrMenu[i].onmouseover = function () { changeTitle(this, 2); autoStop(this, 0); }
                    arrMenu[i].onmouseout = function () { changeTitle(this, 0); autoStop(this, 1); }
                }
                else	// 没有over, out 改变样式
                {
                    if (this.auto[0])	// 有自动运行
                    {
                        arrMenu[i].onmouseover = function () { autoStop(this, 0); }
                        arrMenu[i].onmouseout = function () { autoStop(this, 1); }
                    }
                }
            }

            if (this.auto[0] || this.menu)	//arrinfo 控制自动播放
            {
                arrInfo[i].onmouseover = function () { my.menu ? changeMenu(1) : autoStop(this, 0); }
                arrInfo[i].onmouseout = function () { my.menu ? changeMenu(0) : autoStop(this, 1); }
            }
        }	//for结束

        if (this.auto[0]) {
            this.timerID = setTimeout(autoMove, this.auto[1])
        }

        // 自动播放
        function autoMove() {
            var n;
            n = my.index + 1;
            if (n == l) { n = 0 };
            while (arrMenu[n].getAttribute("skip"))		// 需要跳过的容器
            {
                n += 1;
                if (n == l) { n = 0 };
            }
            changeOption(arrMenu[n]);
            my.timerID = setTimeout(autoMove, my.auto[1]);
        }

        // onmouseover时，自动播放停止。num：0为over，1为out。 obj暂时无用。 -_-!!
        function autoStop(obj, num) {
            if (!my.auto[0]) { return; }
            //if(obj.index==my.index)
            num == 0 ? clearTimeout(my.timerID) : my.timerID = setTimeout(autoMove, my.auto[1]);
        }

        // 改变选项卡
        function changeOption(obj) {
            //arrMenu[my.index].className = getClass(arrMenu[my.index], my.style[0]);	
            //修改旧样式 		    
            for (var i = 0; i < arrMenu.length; i++) {
                //alert(arrMenu.length);
                var curClass = arrMenu[i].cName;
                if (curClass.indexOf("active") > 0) {
                    arrMenu[i].className = curClass.replace(new RegExp("active", 'gm'), '');
                }
                else {
                    arrMenu[i].className = curClass;
                }
            }
            arrInfo[my.index].style.display = "none";	//隐藏旧内容			
            obj.className = getClass(obj, my.style[1]);		//修改为新样式
            arrInfo[obj.index].style.display = "";	//显示新内容			
            my.index = obj.index;	//更新当前选择的index

            var url = window.location.href;
            if (url.indexOf("PerLessonForTS2") < 0) {
                tabClick(obj);//自定义点击事件
            }
        }

        /*		
			只有onclick时，overStyle的onmouseover,onmouseout事件。用来预激活
			obj：目标对象。	num：1为over，0为out
		*/
        function changeTitle(obj, num) {
            if (!my.overStyle) { return; };
            //if(obj.index!=my.index){obj.className = getClass(obj,my.style[num])}
        }

        /*		
			菜单类型时用
			obj：目标对象。	num：1为over，0为out
		*/
        function changeMenu(num) {
            if (!my.menu) { return; }
            num == 0 ? my.menutimerID = setTimeout(menuClose, 1000) : clearTimeout(my.menutimerID)
        }

        //关闭菜单
        function menuClose() {
            arrInfo[my.index].style.display = "none";
            arrMenu[my.index].className = getClass(arrMenu[my.index], my.style[0]);
        }

        // 得到className（防止将原有样式覆盖）
        function getClass(o, s) {
            if (o.cName == "") { return s }
            else { return o.cName + " " + s }
        }

        //嵌套情况下得到真正的子集
        function getChilds(arrObj, id, num) {
            var depth = 0;
            var firstObj = my.nesting[num] == "" ? arrObj[0] : document.getElementById(my.nesting[num]);		//得到第一个子集
            do	//计算深度
            {
                if (firstObj.parentNode.getAttribute("id") == id) { break } else { depth += 1 }
                firstObj = firstObj.parentNode;
            }
            while (firstObj.tagName.toLowerCase() != "body")	// body强制退出。

            var t;
            var arr = new Array();
            for (i = 0; i < arrObj.length; i++)	//过滤出需要的数据
            {
                t = arrObj[i], d = 0;
                do {
                    if (t.parentNode.getAttribute("id") == id && d == depth) {
                        arr.push(arrObj[i]); break;		//得到数据
                    }
                    else {
                        if (d == depth) { break }; d += 1;
                    }
                    t = t.parentNode;
                }
                while (t.tagName.toLowerCase() != "body")	// body强制退出
            }
            return arr;
        }
    }
}

