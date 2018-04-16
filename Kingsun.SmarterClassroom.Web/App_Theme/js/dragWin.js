		/*---------------------------------------------------------- +
		  拖动工具箱插件，原生封装，不依赖jquery库
		 +---------------------------------------------------------- */
(function (window, undefined) {
		var dragMinWidth = 500;//最小宽度,拖动宽度小于这个尺寸不可再调节大小了
		var dragMinHeight = 200;//最小高度,拖动高度小于这个尺寸不可再调节大小了
		var alignLeft=false;//是否居左对齐
		var alignTop=true;//是否居顶对齐
		var dragInitLeft = 20;//距左侧间距，如果alignLeft=true时有效
		var dragInitRight = 0;//距右侧间距，如果alignLeft=false时有效
		var dragInitTop = 0;//距顶部间距，如果alignTop=true时有效
		var dragInitBot = 0;//距底部间距，如果alignTop=false时有效
		var initLeft=0;//初始横坐标位置
		var initTop=0;//初始纵坐标位置
		var dragObjWidth=0;//初始横坐标位置
		var dragObjHeight=0;//初始纵坐标位置
		var disX = dixY = 0;
		var flag = false;//鼠标是否按下的标记		
		/*-------------------------------------------------------------------- +
		  拖拽函数，参数oDrag为要拖动的对象，handle为拖动句柄对象
		 +-------------------------------------------------------------------- */
		function drag(oDrag, handle)
		{			
			var oMin = get.byClass("min", oDrag)[0];
			var oMax = get.byClass("max", oDrag)[0];
			var oRevert = get.byClass("revert", oDrag)[0];
			var oClose = get.byClass("close", oDrag)[0];
			var eventDownName,eventMoveName,eventUpName;
			//判断是否支持移动端事件
			var hasTouch=function(){
        var touchObj={};
        touchObj.isSupportTouch = "ontouchend" in document ? true : false;        
        return touchObj.isSupportTouch;
      }	      
			//初始化浮动窗的坐标位置
			initPositon(oDrag);
			dragObjWidth=oDrag.offsetWidth;
			dragObjHeight=oDrag.offsetHeight;
			handle = handle || oDrag;
			handle.style.cursor = "move";
			//touchstart||mousedown
			if(hasTouch()){//移动端				
				eventDownName="touchstart";
				eventMoveName="touchmove";
				eventUpName="touchend";
			}
			else{//pc端
				eventDownName="mousedown";
				eventMoveName="mousemove";
				eventUpName="mouseup";
			}
			/*-------------------------------------------------------------------- +
			  设置初始位置并记录
			 +-------------------------------------------------------------------- */
			function initPositon(oDrag){
				if(alignLeft){
					oDrag.style.left = dragInitLeft + "px";//初始左坐标
					initLeft=dragInitLeft;
				}
				else{
					var curLeft=document.documentElement.clientWidth -dragInitRight- oDrag.offsetWidth;
					oDrag.style.left = curLeft+ "px";//初始顶坐标
					initLeft=curLeft;
				}
				if(alignTop){
					oDrag.style.top = dragInitTop + "px";//初始顶坐标
					initTop=dragInitTop;
				}
				else{
					var curTop=document.documentElement.clientHeight -dragInitBot- oDrag.offsetHeight;
					oDrag.style.top = curTop+ "px";//初始顶坐标
					initTop=curTop;
				}				
			}
			Event.addHandler(handle, eventDownName, function(event){	
				down(event);
			});		
			//鼠标按下事件
			down =function(event){
				flag = true;
				//var event = event || window.event;
				if(event.touches){ event = event.touches[0];}
				else {event = event || window.event;}
				disX = event.clientX - oDrag.offsetLeft;
				disY = event.clientY - oDrag.offsetTop;	
				//touchmove||mousemove				
				Event.addHandler(document, eventMoveName, function(event){	
					move(event,oDrag)
				});
				//touchmove||mouseup
				Event.addHandler(document, eventUpName, function(event){	
					up(event)
				});
				this.setCapture && this.setCapture();
				return false			
			}
			//鼠标移动事件
			move=function(event,oDrag){
				if(flag){
					//var event = event || window.event;
					if(event.touches){ event = event.touches[0];}
					else {event = event || window.event;}
					var iL = event.clientX - disX;
					var iT = event.clientY - disY;
					var maxL = document.documentElement.clientWidth - oDrag.offsetWidth;
					var maxT = document.documentElement.clientHeight - oDrag.offsetHeight;				
					iL <= 0 && (iL = 0);
					iT <= 0 && (iT = 0);
					iL >= maxL && (iL = maxL);
					iT >= maxT && (iT = maxT);				
					oDrag.style.left = iL + "px";
					oDrag.style.top = iT + "px";		
					//initLeft=iL;
					//initTop=iT;
					return false
				}
			}			
			//鼠标松开事件
			up=function(event){
				flag = false;      
				document.onmousemove = null;
				document.onmouseup = null;
				this.releaseCapture && this.releaseCapture();			
			}
			
			//最大化按钮
			oMax.onclick = function ()
			{
				oDrag.style.top = oDrag.style.left = 0;
				oDrag.style.width = document.documentElement.clientWidth - 2 + "px";
				oDrag.style.height = document.documentElement.clientHeight - 2 + "px";
				//console.log(oDrag.style.height);
				this.style.display = "none";
				oRevert.style.display = "block";
			};
			//还原按钮
			oRevert.onclick = function ()
			{		
				oDrag.style.width = dragMinWidth + "px";
				oDrag.style.height = dragMinHeight + "px";
				//oDrag.style.left = (document.documentElement.clientWidth - oDrag.offsetWidth) / 2 + "px";
				//oDrag.style.top = (document.documentElement.clientHeight - oDrag.offsetHeight) / 2 + "px";
				oDrag.style.width = dragObjWidth + "px";
				oDrag.style.height = dragObjHeight + "px";		
				oDrag.style.left = initLeft + "px";
				oDrag.style.top = initTop + "px";		
				this.style.display = "none";
				oMax.style.display = "block";
				//console.log(oDrag.style.height);
				fullClientHeight();
			};
			//最小化按钮
			oMin.onclick = oClose.onclick = function ()
			{
				oDrag.style.display = "none";
				var oA = document.createElement("a");
				oA.className = "open";
				oA.href = "javascript:;";
				oA.title = "还原";
				//oA.style="left:"+initLeft+"px;top:"+initTop+"px;";//位置
				document.body.appendChild(oA);		
				//oA.style.left = initLeft + "px";
				//oA.style.top = initTop + "px";		
				oA.onclick = function ()
				{
					oDrag.style.display = "block";
					document.body.removeChild(this);
					this.onclick = null;
				};
			};
			//阻止冒泡
			oMin.onmousedown = oMax.onmousedown = oClose.onmousedown = function (event)
			{
				this.onfocus = function () {this.blur()};
				(event || window.event).cancelBubble = true	
			};
		}		
		
		/*---------------------------------------------- +
		  调节窗体大小函数：八方向拖动改变大小函数
		 +---------------------------------------------- */
		function dragResize(oParent, handle, isLeft, isTop, lockX, lockY)
		{
		    //console.log(123);
			handle.onmousedown = function (event)
			{
				var event = event || window.event;
				if(event.touches){ event = event.touches[0];}
				else {event = event || window.event;}
				var disX = event.clientX - handle.offsetLeft;
				var disY = event.clientY - handle.offsetTop;	
				var iParentTop = oParent.offsetTop;
				var iParentLeft = oParent.offsetLeft;
				var iParentWidth = oParent.offsetWidth;
				var iParentHeight = oParent.offsetHeight;
				
				document.onmousemove = function (event)
				{
					var event = event || window.event;
					if(event.touches){ event = event.touches[0];}
				  else {event = event || window.event;}
					var iL = event.clientX - disX;
					var iT = event.clientY - disY;
					var maxW = document.documentElement.clientWidth - oParent.offsetLeft - 2;
					var maxH = document.documentElement.clientHeight - oParent.offsetTop - 2;			
					var iW = isLeft ? iParentWidth - iL : handle.offsetWidth + iL;
					var iH = isTop ? iParentHeight - iT : handle.offsetHeight + iT;
					
					isLeft && (oParent.style.left = iParentLeft + iL + "px");
					isTop && (oParent.style.top = iParentTop + iT + "px");
					
					iW < dragMinWidth && (iW = dragMinWidth);
					iW > maxW && (iW = maxW);
					lockX || (oParent.style.width = iW + "px");
					
					iH < dragMinHeight && (iH = dragMinHeight);
					iH > maxH && (iH = maxH);
					lockY || (oParent.style.height = iH + "px");
					
					if((isLeft && iW == dragMinWidth) || (isTop && iH == dragMinHeight)) document.onmousemove = null;
					
					//console.log(oParent.offsetHeight);
					return false;	
				};
				document.onmouseup = function ()
				{					
					document.onmousemove = null;
					document.onmouseup = null;
					dragObjWidth=oParent.offsetWidth;
					dragObjHeight = oParent.offsetHeight;
				};
				return false;
			}
		};		
		
		function init (objId)
		{			
			var curObj=document.getElementById(objId);
			initBind(curObj);//绑定事件
		}	
		window.onload = function ()
		{
			init ("dragToolBar");		
			fullClientHeight();
		}			
		/*---------------------------------------------------------------- +
		  创建对话框的结构体，生成八方向拖动DOM结构
		 +---------------------------------------------------------------- */		
		function initDom(objId,title){
			var curObj=document.getElementById(objId);
			var oldHtml=curObj.innerHTML;
			var dom="";
			dom+='<div class="title">';
			dom+=' <h2>'+title+'</h2>';
			dom+='  <div>';
			dom+='   <a class="min" href="javascript:;" title="最小化"></a>';
			dom+='   <a class="max" href="javascript:;" title="最大化"></a>';
			dom+='   <a class="revert" href="javascript:;" title="还原"></a>';
			dom+='   <a class="close" href="javascript:;" title="关闭"></a>';
			dom+='  </div>';
			dom+=' </div>';
			dom+=' <div class="resizeL"></div>';
			dom+=' <div class="resizeT"></div>';
			dom+=' <div class="resizeR"></div>';
			dom+=' <div class="resizeB"></div>';
			dom+=' <div class="resizeLT"></div>';
			dom+=' <div class="resizeTR"></div>';
			dom+=' <div class="resizeBR"></div>';
			dom+=' <div class="resizeLB"></div>';
			dom+=' <div class="toolsContent">'+oldHtml+'</div>';	
			curObj.innerHTML=dom;	
		}
		initDom("dragToolBar","资源工具栏");	
		/*---------------------------------------------- +
		  绑定拖动事件
		 +---------------------------------------------- */
		function initBind(oDrag){		
			var oTitle = get.byClass("title", oDrag)[0];
			var oL = get.byClass("resizeL", oDrag)[0];
			var oT = get.byClass("resizeT", oDrag)[0];
			var oR = get.byClass("resizeR", oDrag)[0];
			var oB = get.byClass("resizeB", oDrag)[0];
			var oLT = get.byClass("resizeLT", oDrag)[0];
			var oTR = get.byClass("resizeTR", oDrag)[0];
			var oBR = get.byClass("resizeBR", oDrag)[0];
			var oLB = get.byClass("resizeLB", oDrag)[0];	
			drag(oDrag, oTitle);//绑定拖动事件
			//四角拖动事件
			dragResize(oDrag, oLT, true, true, false, false);
			dragResize(oDrag, oTR, false, true, false, false);
			dragResize(oDrag, oBR, false, false, false, false);
			dragResize(oDrag, oLB, true, false, false, false);
			//四边拖动事件
			dragResize(oDrag, oL, true, false, false, true);
			dragResize(oDrag, oT, false, true, true, false);
			dragResize(oDrag, oR, false, false, false, true);
			dragResize(oDrag, oB, false, false, true, false);	
			//窗体居中显示
			//oDrag.style.left = (document.documentElement.clientWidth - oDrag.offsetWidth) / 2 + "px";
			//oDrag.style.top = (document.documentElement.clientHeight - oDrag.offsetHeight) / 2 + "px";			
		}
		
		/*监听窗体尺寸变化*/
		window.onresize = function ()
		{	
		    fullClientHeight();
		}
		/*自动填充满屏高度*/
		function fullClientHeight(){
			var oDrag=document.getElementById("dragToolBar");	
			oDrag.style.height = document.documentElement.clientHeight - dragInitTop - dragInitBot - 65 + "px";
			//console.log(document.documentElement.clientHeight + "," + dragInitTop+","+dragInitBot);
			if (!alignLeft) {//如果是居右侧对齐的，则
				oDrag.style.left = document.documentElement.clientWidth - oDrag.offsetWidth -dragInitRight+ "px";
			}
		}
		
})(window);	

/*------------------------------------------------------------------------------- +
  通用函数（相当于jquery中的$()函数）：获取id, class, tagName
 +------------------------------------------------------------------------------- */
var get = {
	byId: function(id) {
		return typeof id === "string" ? document.getElementById(id) : id
	},
	byClass: function(sClass, oParent) {
		var aClass = [];
		var reClass = new RegExp("(^| )" + sClass + "( |$)");
		var aElem = this.byTagName("*", oParent);
		for (var i = 0; i < aElem.length; i++) reClass.test(aElem[i].className) && aClass.push(aElem[i]);
		return aClass
	},
	byTagName: function(elem, obj) {
		return (obj || document).getElementsByTagName(elem)
	}
};
/*------------------------------------------------------------------------------- +
  封装兼容性添加、删除事件的函数 addEventListener与removeEventListener
  添加事件：Event.addHandler(aBtn[0], "click", fnHandler);
  解除事件：Event.removeHandler(aBtn[0], "click", fnHandler);
 +------------------------------------------------------------------------------- */
var Event = {
    addHandler: function (oElement, sEvent, fnHandler) {
        oElement.addEventListener ? oElement.addEventListener(sEvent, fnHandler, false) : oElement.attachEvent("on" + sEvent, fnHandler)    
    },
    removeHandler: function (oElement, sEvent, fnHandler) {
        oElement.removeEventListener ? oElement.removeEventListener(sEvent, fnHandler, false) : oElement.detachEvent("on" + sEvent, fnHandler)
    }
}