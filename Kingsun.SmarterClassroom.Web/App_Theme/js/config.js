// 全局变量，通用配置信息，通用函数
/******************************************************
全局变量，整站通用变量
******************************************************/
/*var copyName="深圳版";//当前的课本册名
var bookName="三年级下册";//当前的课本册名
var sourcePath="source/";//资源总目录
var curSourcePath="SZ_3B/";//当前课本资源所在的文件夹名称*/
var winWidth = 0; 
var winHeight = 0; 

/******************************************************
全局通用函数--以下函数不依赖jquery库，属原生js函数
******************************************************/
/*if (getCookie('bookName') != '' && getCookie('bookPath') != '') {
    bookName=getCookie('bookName');
	curSourcePath="SZ_"+getCookie('bookPath')+"/";
	//alert(curSourcePath);	
}*/
/*addCookie方法和getCookie方法调用方法
------------------------------------------------*/
/*var pageurl = window.location.search;
if (pageurl == '?m2w') {
    addCookie('m2wcookie', '1', 0);
}
if (getCookie('m2wcookie') != '1' && browserRedirect()) {
    //location.href = 'http://m.dtcms.net';防止跳转到官网上去
}*/


/*通用工具类方法
------------------------------------------------*/
//检测是否移动设备来访
function browserRedirect() {
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        return true;
    } else {
        return false;
    }
}

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
    for (var i = 0; i < arrStr.length; i++) {
        var temp = arrStr[i].split("=");
        if (temp[0] == objName) return unescape(temp[1]);
    }
    return "";
}

//去掉数组中的重复项
Array.prototype.unique = function() {
    var res = [], hash = {};
    for(var i=0, elem; (elem = this[i]) != null; i++)  {
        if (!hash[elem])
        {
            res.push(elem);
            hash[elem] = true;
        }
    }
    return res;
}

//JavaScript实现按照指定长度为数字前面补零输出
function PrefixInteger(num, length) {
	return (Array(length).join('0') + num).slice(-length);
}

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
	if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) 
	{ 
		winHeight = document.documentElement.clientHeight; 
		winWidth = document.documentElement.clientWidth; 
	} 
}
//最小化窗体
function minWin(){
	if(window.cpp){
		window.cpp.minWin();
	}
	else{
		alert("你想最小化窗体");
	}
}
//关闭窗体
function closeWin(){
	if(window.cpp){
		window.cpp.colseWin();
	}
	else{
		alert("你想关闭窗体");
	}
}