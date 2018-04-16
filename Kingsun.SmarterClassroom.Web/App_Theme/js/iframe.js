// JavaScript Document
// 内容页
var ratio=0;//缩放比例
var pageIndex=1;
var data;
var mySwiper;
var timeObjId =1;
var itemIndex=1;//当题小题序号，从1开始，以供前后翻页调用
var itemsNum=0;//大题下小题的数量
var curSourcePath="";//当前弹窗中的资源路径
var curPlat;//当前平台
$(function(){	
	getCookiePageNum();	
	resizeImg();	
	//initData();
	//readXmlContent("1");	
	$('.arrow-left').on('click', function(e){
		e.preventDefault()
		mySwiper.swipePrev()
	})
	$('.arrow-right').on('click', function(e){
		e.preventDefault()
		mySwiper.swipeNext()
	});			
});
//从cookie中获取当前页码数，如果没有找到，默认显示第一页
function getCookiePageNum(){
  	var pageId=getCookie('pageId');
	if(pageId==""){
		pageIndex=1;		
	}
	else{
		pageIndex=pageId;
	}
	//alert("cookie:"+pageIndex);
}

function resizeImg(){	
	var w=$(".inbox").width();
	var h=$(".inbox").height();	
	//计算缩放比例
	findDimensions();//获取屏幕宽高度
	/*压缩比率*/
	ratio=winWidth/498;  
	//alert("缩放比率为："+ratio);
	//ratio = 1;	
}

$(window).resize(function(){
    resizeImg();
});

function initLoadData(){
	curPlat=checkPlat();
	if(curPlat>0){//移动端
		initJsonData();
	}
	else{
		initDoubleJsonData();
	}
}

//解析双份数据，针对PC端
function initDoubleJsonData(){	
	var jsonObj = JSON.parse(dbJson);
	var allPages=0;	
	var curPageId=0;	
	data=jsonObj;
	ratio=1;	
	//输出
    var doubleWrapObj;
	$.each(jsonObj.pageSource,function(index,items){ 
		var curRows=index+1;
		if(curRows%2==0){//为偶数时
			var pageNum=items.pageId;
			var pageImgSrc=items.pageImg;
			var buttons=items.buttons;	
			var singleObj=document.createElement("div");
				singleObj.className="doubleInbox";
			singleObj.style="margin-left:20px;";							
			var str="";	
			str=readJsonContent(pageNum,buttons);		
			$(singleObj).append(str);
			$(doubleWrapObj).append($(singleObj));				
			$(singleObj).css({"background-image":"url(\""+pageImgSrc+"\")"});			
			allPages++;
			$(".device").css({"width":"1016px"});
			$(".swiper-container").css({"width":"1016px"});			
		}
		else{//为奇数时
			var pageNum=items.pageId;
			var pageImgSrc=items.pageImg;
			var buttons=items.buttons;		
			var parentObj=document.createElement("div");
				parentObj.className="swiper-slide";					
			doubleWrapObj=document.createElement("div");
				doubleWrapObj.className="content-slide";
			var singleObj=document.createElement("div");
				singleObj.className="doubleInbox";			
			$(doubleWrapObj).append(singleObj);				
			var str="";	
			str=readJsonContent(pageNum,buttons);		
			$(singleObj).append(str);
			$(parentObj).append($(doubleWrapObj));				
			$(singleObj).css({"background-image":"url(\""+pageImgSrc+"\")"});				
			$('.swiper-wrapper').append($(parentObj));
			allPages++;
		}
	})
	
	//设置滚动插件参数
	getCookiePageNum();	
	//双页模式，划屏的序号需要计算
	//初始显示的页码序号，从0开始 求商-1
	var iniPageIndex=parseInt(pageIndex/2)-1;	
	if(iniPageIndex>allPages){
		//alert("数据未完成");
		iniPageIndex=0;//没找到页码，让它默认显示第一页开始
	}	
	//动态加载数据时不能在初始化的时候放在html文件中，而应该放在接口取值后找到swiper-wrapper类后马上初始化！不然滚动无效
	//http://www.cnblogs.com/xiongmaolala/p/4692099.html
	mySwiper = new Swiper('.swiper-container',{
		initialSlide :iniPageIndex,//初始索引页码，从0开始
		//pagination: '.pagination',
		loop:true,
		//slidesPerView:1,
		grabCursor: true,
		//paginationClickable: true,
		observer: true,//修改swiper自己或子元素时，自动初始化swiper
		observeParents: true//修改swiper的父元素时，自动初始化swiper
	});		
}

//采用json数据读取配置文件，以便本机可以浏览
function initJsonData(){	
	var jsonObj = JSON.parse(dbJson);
	var allPages=0;	
	var curPageId=0;	
	data=jsonObj;
	ratio=1;	
	//输出
	$.each(jsonObj.pageSource,function(index,items){ 
	  	var pageNum=items.pageId;
		var pageImgSrc=items.pageImg;
		var buttons=items.buttons;		
		var parentObj=document.createElement("div");
			parentObj.className="swiper-slide";					
		var solidBox=document.createElement("div");
			solidBox.className="content-slide inbox";			
		var str="";	
		str=readJsonContent(pageNum,buttons);		
		$(solidBox).append(str);
		$(parentObj).append($(solidBox));				
		$(solidBox).css({"background-image":"url(\""+pageImgSrc+"\")"});	
					
		$('.swiper-wrapper').append($(parentObj));
		allPages++;
	});	
	
	//设置滚动插件参数
	getCookiePageNum();	
	var iniPageIndex=pageIndex-2;//初始显示的页码序号，从0开始
	if(iniPageIndex>allPages){
		iniPageIndex=0;//没找到页码，让它默认显示第一页开始
	}	
	//动态加载数据时不能在初始化的时候放在html文件中，而应该放在接口取值后找到swiper-wrapper类后马上初始化！不然滚动无效
	//http://www.cnblogs.com/xiongmaolala/p/4692099.html
	mySwiper = new Swiper('.swiper-container',{
		initialSlide :iniPageIndex,//初始索引页码，从0开始
		//pagination: '.pagination',
		loop:true,
		//slidesPerView:1,
		grabCursor: true,
		//paginationClickable: true,
		observer: true,//修改swiper自己或子元素时，自动初始化swiper
		observeParents: true//修改swiper的父元素时，自动初始化swiper
	});
	autoHeight();
}
//自动调节移动端显示高度
function autoHeight(){
	findDimensions();//获取屏幕宽高度
	/*压缩比率*/
	var curRatio=winWidth/498;
	//图片缩放高度值,去掉小数，向上取舍，小数都进一位
	var imgH=Math.ceil(700*winWidth/498);	
	//alert(winWidth+":"+winHeight+"压缩比为："+winWidth/498);
	$(".swiper-container").height(imgH);
	$(".swiper-wrapper").height(imgH);
	$(".swiper-slide").height(imgH);
	$(".inbox").height(imgH);
}

//读取JsonL配置文件并创建页面的内容，加载数据内容
function readJsonContent(pageIndex,buttonObj){
	var shtml = ''; 
	curPlat=checkPlat();
	if(curPlat>0){//移动端
		//计算缩放比例
		findDimensions();//获取屏幕宽高度
		/*压缩比率*/
		ratio=winWidth/498; 
	}
	else{
		ratio=1;
	}
	for(var i=0;i<buttonObj.button.length;i++){
		var thisButton= buttonObj.button[i];
		var id=thisButton.id;			
		var posX=parseFloat(thisButton.x)*ratio; 
		var posY=parseFloat(thisButton.y)*ratio; 
		var posW=parseFloat(thisButton.width)*ratio; 
		var posH=parseFloat(thisButton.height)*ratio; 						
		var soursePath=thisButton.soundsrc; 
		var objType=parseInt(thisButton.eventtype);//触发对象的类型，1为动画，2为课件，3为课件，4为课件，5为课件，6为点读（声音文件）
		var linkUrl=thisButton.linkUrl;					
		var posCSS="style=\"left:"+posX+"px;top:"+posY+"px;width:"+posW+"px;height:"+posH+"px;\"";
		var subItemsNum=parseInt(thisButton.itemNum);
		var subjectIndex=parseInt(thisButton.subjectNum);//大题题号		
		if(objType==1){//动画按钮
			shtml += "<a class=\"imgbtn1\" "+posCSS+" href=\"javascript:movWin('"+linkUrl+"');\"></a>"; 
		}
		if(objType==2){//课件按钮
			shtml += "<a class=\"imgbtn2\" "+posCSS+" href=\"javascript:exampleWin('"+linkUrl+"',"+subItemsNum+","+subjectIndex+");\"></a>"; 
		}
		if(objType==3){//练习按钮
			shtml += "<a class=\"imgbtn3\" "+posCSS+" href=\"javascript:exampleWin('"+linkUrl+"',"+subItemsNum+","+subjectIndex+");\"></a>"; 
		}
		if(objType==4){//跟读按钮
			shtml += "<a class=\"imgbtn4\" "+posCSS+" href=\"javascript:readWin('"+linkUrl+"',"+subItemsNum+","+subjectIndex+");\"></a>"; 
		}
		if(objType==5){//歌谣按钮
			shtml += "<a class=\"imgbtn5\" "+posCSS+" href=\"javascript:readWin('"+linkUrl+"',"+subItemsNum+","+subjectIndex+");\"></a>"; 
		}
		else if(objType==6){//点读
			if(soursePath!=""){				
				shtml += "<a class=\"btn\" "+posCSS+" href=\"javascript:void(0)\" onclick=\"playAudio('"+soursePath+"',this);\"></a>"; 				
			}							
		}	
	}
	return shtml;						
}


/*习题对话框*/
function exampleWin(filePath,subNum,subjectNum){
	var showCss="";
	var pageStr="";
	if(subNum>0){
		//pageStr='<div class="pagebox"><b id="curPage">1</b>-<i id="pageNum">'+subNum+'</i></div>';
		pageStr='<div class="pagebox"><b id="">'+subjectNum+'</b>-<i id="curPage">1</i></div>';		
	}
	else{//为空不显示左右按钮
		showCss=' style="display:none;"';
	}	
	itemsNum=subNum;//总数量
	itemIndex=1;
	curSourcePath=filePath;	
	var d = dialog({
		title: ' ',		
		width:980,
		skin: 'exampleWin',		
		height:1310,
		content: '<div class="ebg1"><div class="ebg2"><div class="ifrm1"><iframe src="'+filePath+'" id="sourceIfm" class="exaIframe" frameborder="0"></iframe></div></div></div><div class="botToolsbar"><div class="in_tools"><a href="javascript:void(0)" class="b_prev" onclick="goPrev(this)"'+showCss+'></a>'+pageStr+'<a href="javascript:void(0)" class="b_next" onclick="gonext(this)"'+showCss+'></a></div></div>'
	});
	d.showModal();
}
/*大题下有多个子项时，向前翻页事件*/
function goPrev(obj){
	if(itemIndex<=1){
		alert("前面已经没有了");
	}
	else{
		itemIndex--;
		var n=curSourcePath.lastIndexOf('.');
		var front;		 
		if(itemIndex>9){
			front=curSourcePath.substr(0,n-2);
		}
		else{
			front=curSourcePath.substr(0,n-1);
		}
		var suffix=curSourcePath.substr(n,curSourcePath.length);		
		$("#curPage").html(itemIndex);
		var path=front+itemIndex+suffix;
		//$(obj).parent().prev().find("iframe").attr("src",path);
		$("#sourceIfm").attr("src",path);
		if(itemIndex==1){
			$(obj).hide();			
		}
		else{
			$(obj).show();			
		}
		$(".b_next").show();
	}
}
/*大题下有多个子项时，向后翻页事件*/
function gonext(obj){
	if(itemIndex==itemsNum){
		alert("后面已经没有了");
	}
	else{
		itemIndex++;
		var n=curSourcePath.lastIndexOf('.');
		var front;		 
		if(itemIndex>9){
			front=curSourcePath.substr(0,n-2);
		}
		else{
			front=curSourcePath.substr(0,n-1);
		}
		var suffix=curSourcePath.substr(n,curSourcePath.length);
		
		//alert(itemIndex);
		$("#curPage").html(itemIndex);
		var path=front+itemIndex+suffix;		
		//$(obj).parent().prev().find("iframe").attr("src",path);
		$("#sourceIfm").attr("src",path);
		if(itemIndex==itemsNum){
			$(obj).hide();
		}
		else{
			$(obj).show();
		}
		$(".b_prev").show();
	}
}

/*动画对话框*/
/*var d;//弹窗对话框句柄,用于在函数外对对话框进行控制，如关闭对话框等等。
function movWin(filePath){
	d = dialog({
		//title: ' ',		
		width:900,
		skin: 'movWin',	
		padding:20,	
		height:"auto",
		content: '<div class="b_Close"><a href="javascript:void(0)" onclick="winClose()">X</a></div><div class="frameBox"><iframe src="'+filePath+'" id="sourceIfm" class="movIframe" frameborder="0"></iframe></div>'
	});	
	d.showModal();	
}*/
/*采用新开窗体方式打开动画*/
function movWin(filePath){
	//静态网页不可以使用参数方式，只能用COOKIE记录页码
	addCookie('movieSrc', filePath, 0);
	addCookie('backHref', window.location.href, 0);
	window.location.href="video.html";	
	//window.location.href=filePath;
}
function winClose(){
	d.remove().close();	
}
/*跟读对话框*/
function readWin(filePath,subNum,subjectNum){
	var showCss="";
	var pageStr="";
	if(subNum>0){
		//pageStr='<div class="pagebox"><b id="curPage">1</b>-<i id="pageNum">'+subNum+'</i></div>';
		pageStr='<div class="pagebox"><b id="">'+subjectNum+'</b>-<i id="curPage">1</i></div>';	
	}	
	else{//为空不显示左右按钮
		showCss=' style="display:none;"';
	}
	itemsNum=subNum;//总数量
	itemIndex=1;
	curSourcePath=filePath;
	d = dialog({
		//title: ' ',		
		width:980,
		skin: 'readWin',		
		height:1310,
		content: '<div class="b_left"><div class="b_right"><div class="b_Close2"><a href="javascript:void(0)" onclick="winClose()">X</a></div><div class="frameBox2"><iframe src="'+filePath+'" id="sourceIfm" class="readIframe" frameborder="0"></iframe></div><div class="botToolsbar"><div class="in_tools"><a href="javascript:void(0)" class="b_prev" onclick="goPrev(this)"'+showCss+'></a>'+pageStr+'<a href="javascript:void(0)" class="b_next" onclick="gonext(this)"'+showCss+'></a></div></div></div></div>'
	});	
	d.showModal();	
}

//动画调用窗体最大化函数
function maxWin(){	
	var w=$(window).width()+20;
	var h=$(window).height()+136;
	$(".topTools").hide();	
	d.width(w).height(h).show();	
	$(".frameBox").width(w);
	$(".frameBox").height(h);
	$(".movIframe").width(w);
	$(".movIframe").height(h);
}

//动画调用窗体最小化函数
function minWin(){
	var w=1300;
	var h=750
	$(".topTools").hide();	
	d.width(w).height(h).show();	
	$(".frameBox").width(1280);
	$(".frameBox").height(760);
	$(".movIframe").width(1280);
	$(".movIframe").height(760);
}

//全文朗读
function allRead(obj){			
	if($(obj).attr("src") == "Theme/images/soundplay.png"){
		$(obj).attr("src", "Theme/images/soundplay_r.png");
		$(".soundImg").attr("title","停止朗读");
		playAudioForFullMode('1');
		currentPlayNum = 1;
		startFullPlayMode();		
		addCookie("isAll", 1, 0);//将全文朗读开关写入到COOKIE中						
	}
	else{		
		$(obj).attr("src", "Theme/images/soundplay.png");		
		pause();
		$(".soundImg").attr("title","全文朗读");		
		addCookie("isAll", 0, 0);//将全文朗读开关写入到COOKIE中	
	}
}

//翻页继续朗读
function nextAllRead(){	
	playAudioForFullMode('1');
	currentPlayNum = 1;
	startFullPlayMode();	
}

//声音暂停
function pause() {	
    var audio = document.getElementById("audio");
    audio.pause();   
}

//播放声音
function play(name){	
	playAudio(name);	
}

var curPlayObj;
//播放---单句的模式。
function playAudio(soundPath,obj){	
	pause();//暂停以前的声音
	$(".btn").css({"border":"0 none"});	
	curPlayObj=obj;
	//高亮当前句
	clearInterval(timeObjId);
	//isAll="0";
	//addCookie("isAll", 0, 0);//将全文朗读开关写入到COOKIE中		
    $(".audioDiv #mp3").attr("src", "./" + soundPath);
    var audio = document.getElementById("audio");
	$(obj).css({"border":"2px red solid","border-radius":"10px"});
    audio.load();	
    audio.play();
	timeObjId = setInterval("checkSingleSndIsEnd()",500);
	
}
//检查声音是否播完
function checkSingleSndIsEnd()
{
	var audio = document.getElementById("audio");
	if(audio.ended)
	{
		$(curPlayObj).css({"border":"0 none"});
		//---全部恢复黑色		
		/*$(".dbBox>a").each(function (){			
			$(this).removeClass("light");
		})		*/
		audio.pause();		
		clearInterval(timeObjId);			
	}
}

function startFullPlayMode()
{
	//alert(currentPlayNum);	
   timeObjId = setInterval("PerSecondListen()",500);  
	/*每1秒执行，并命名计时器名称为A*/
}

//---全文播放时，侦测单个声音是否播放完成。
function PerSecondListen()
{
     //alert("每1秒执行，并命名计时器名称为A");
    var audio = document.getElementById("audio");   
	if(audio.ended)
	{
		//---全部恢复黑色。
		$(".dbBox>a").each(function (){
			//$(this).css({"border":"none"});
			$(this).removeClass("light");			
		})
		audio.pause();
		currentPlayNum++;
		if(currentPlayNum>curPageItems)
		{//当前页声音播放完毕...
            clearInterval(timeObjId);		
			$(".arrow-right").click();//朗读完后自动跳转到下一页
		}
		else
		{
			playAudioForFullMode(String(currentPlayNum));
		}
	}

}
//播放
function playAudioForFullMode(name){
	//高亮当前句
	var n= parseInt(name);
	var curFilePath="";	
	if(n>0){		
		$(".dbBox>a").each(function (){			
			var curIndex=$(".dbBox>a").index($(this));		
			if(n==curIndex+1){				
			    $(this).addClass("light");	
				curFilePath=$(this).text();				
			}
			else{
				$(this).removeClass("light");				
			}
		})
	}
	$(".audioDiv #mp3").attr("src", "./" + curFilePath);	
    var audio = document.getElementById("audio");	
    audio.load();	
    audio.play();	
}

//检测系统
function checkPlat(){
    //console.log("checkPlatform");
    var system =
    {   
        win : false,   
        mac : false,   
        xll : false   
    };   
    //检测平台    
    var p = navigator.platform;   
    system.win = p.indexOf("Win") == 0;   
    system.mac = p.indexOf("Mac") == 0;   
    system.x11 = (p == "X11") || (p.indexOf("Linux") == 0); 
    //跳转语句    
    if(system.win||system.mac||system.xll)
    { 
        //console.log("PC端");
		//window.location.href="pc/index.html";
        return 0;
    }
    else
    {
		//alert("进入移动端")
		//window.location.href="mobile/index.html";
        if(navigator.userAgent.indexOf("Mac")<0)
        {
            //console.log("安卓端");
            return 1;
        }
        else
        {
            //console.log("苹果端");
            return 2;
        }
        
    }
}