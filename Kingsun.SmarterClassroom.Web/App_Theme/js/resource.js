var Resource=function	(){
	var Current = this;
	
	this.UnitID="1";
	this.ResourceType=1;
	
	this.Init=function(){
		//////////加载年级/////////////
		//Current.InitGrade();
		Current.Initresource();
		
		$("#selCatalog").bind("change",function(){     
			Current.UnitID=$(this).val();
			$("#typelist").find("a")[0].click();
			Current.Initresource();
		});  
		
		$("#typelist").find("a").each(function(){
			$(this).bind("click",function(){
				Current.ResourceType=$(this).attr("hidSourceType");
				$("#typelist").find("a").removeClass("cur");
				$(this).addClass("cur");
				Current.Initresource();
			});
		});
	}
	// ///////////////////////////////
	// //////////加载年级/////////////
	// ///////////////////////////////
	// this.InitGrade=function(){
		// var grade=[];
		// grade.push({"ID":2,"CodeName":"一年级"});
		// $("#selectGrade").removeAttr("disabled").KingsunSelect({
			// data: grade,
            // //firstOption: '<option value="0" label="省">省</option>',
            // onchange: function (index, itemData) {
				// //////////加载科目/////////////
                // Current.InitSubject();
            // }
        // });
        // $("#selectGrade").data("select").selectValue(2);
	// }
	
	// ///////////////////////////////
	// //////////加载科目/////////////
	// ///////////////////////////////
	// this.InitSubject=function(){
		// var subject=[];
		// subject.push({"ID":3,"CodeName":"英语"});
		// $("#selectSubject").removeAttr("disabled").KingsunSelect({
			// data: subject,
            // //firstOption: '<option value="0" label="省">省</option>',
            // onchange: function (index, itemData) {
				// //////////加载版本/////////////
                // Current.InitEdition();
            // }
        // });
        // $("#selectSubject").data("select").selectValue(3);
	// }
	
	// ///////////////////////////////
	// //////////加载版本/////////////
	// ///////////////////////////////
	// this.InitEdition=function(){
		// var edition=[];
		// edition.push({"ID":1,"CodeName":"人教PEP版"});
		// $("#selectEdition").removeAttr("disabled").KingsunSelect({
			// data: edition,
            // //firstOption: '<option value="0" label="省">省</option>',
            // onchange: function (index, itemData) {
				// //////////加载教材/////////////
                // Current.InitBook();
            // }
        // });
        // $("#selectEdition").data("select").selectValue(1);
	// }
	
	// ///////////////////////////////
	// //////////加载教材/////////////
	// ///////////////////////////////
	// this.InitBook=function(){
		// var book=[];
		// book.push({"ID":1,"CodeName":"英语一年级"});
		// $("#selectBook").removeAttr("disabled").KingsunSelect({
			// data: book,
            // //firstOption: '<option value="0" label="省">省</option>',
            // onchange: function (index, itemData) {
				// //////////加载目录/////////////
                // Current.InitUnit();
            // }
        // });
        // $("#selectBook").data("select").selectValue(1);
	// }
	
	// ///////////////////////////////
	// //////////加载目录/////////////
	// ///////////////////////////////
	// this.InitUnit=function(){
		// var unit=[];
		// unit.push({"ID":1,"CodeName":"Unit1"});
		// unit.push({"ID":2,"CodeName":"Unit2"});
		// $("#selCatalog").removeAttr("disabled").KingsunSelect({
			// data: unit,
            // //firstOption: '<option value="0" label="省">省</option>',
            // onchange: function (index, itemData) {
				// Current.UnitID=itemData.ID;
				// //////////加载资源/////////////
                // Current.Initresource();
            // }
        // });
        // $("#selCatalog").data("select").selectValue(1);
	// }
	///////////////////////////////
	//////////加载资源/////////////
	///////////////////////////////
	this.Initresource=function	(){
		var html="";
		if(Current.UnitID==1){
			if(Current.ResourceType==1){
				html+='<div class="dragEnable" typeIco="1" hidSrc="source/P_1/U_1/A/11AR1.html" hidId="p_1" title="拖动我到左边框中"><img src="images/book01.jpg" alt=""/><span>《school》课件(1)</span></div>';
				html+='<div class="dragEnable" typeIco="1" hidSrc="source/P_1/U_1/A/11AS1.html" hidId="p_1" title="拖动我到左边框中"><img src="images/book01.jpg" alt=""/><span>《school》课件(1)</span></div>';
				html+='<div class="dragEnable" typeIco="1" hidSrc="source/P_1/U_1/A/11AS2.html" hidId="p_1" title="拖动我到左边框中"><img src="images/book01.jpg" alt=""/><span>《school》课件(1)</span></div>';
				html+='<div class="dragEnable" typeIco="1" hidSrc="source/P_1/U_1/B/11BC1.html" hidId="p_1" title="拖动我到左边框中"><img src="images/book01.jpg" alt=""/><span>《school》课件(1)</span></div>';
				html+='<div class="dragEnable" typeIco="1" hidSrc="source/P_1/U_1/B/11BL101.html" hidId="p_1" title="拖动我到左边框中"><img src="images/book01.jpg" alt=""/><span>《school》课件(1)</span></div>';
			}else if(Current.ResourceType==2){
				html+='<div class="dragEnable" typeIco="1" hidSrc="source/P_1/U_1/B/11BL102.html" hidId="p_1" title="拖动我到左边框中"><img src="images/book01.jpg" alt=""/><span>《school》课件(1)</span></div>';
				html+='<div class="dragEnable" typeIco="1" hidSrc="source/P_1/U_1/B/11BL103.html" hidId="p_1" title="拖动我到左边框中"><img src="images/book01.jpg" alt=""/><span>《school》课件(1)</span></div>';
			}else if(Current.ResourceType==3){
				html+='<div class="dragEnable" typeIco="1" hidSrc="source/P_1/U_1/B/11BL104.html" hidId="p_1" title="拖动我到左边框中"><img src="images/book01.jpg" alt=""/><span>《school》课件(1)</span></div>';
				html+='<div class="dragEnable" typeIco="1" hidSrc="source/P_1/U_1/B/11BL105.html" hidId="p_1" title="拖动我到左边框中"><img src="images/book01.jpg" alt=""/><span>《school》课件(1)</span></div>';
			}else if(Current.ResourceType==4){
				html+='<div class="dragEnable" typeIco="1" hidSrc="source/P_1/U_1/B/11BL106.html" hidId="p_1" title="拖动我到左边框中"><img src="images/book01.jpg" alt=""/><span>《school》课件(1)</span></div>';
				html+='<div class="dragEnable" typeIco="1" hidSrc="source/P_1/U_1/B/11BL107.html" hidId="p_1" title="拖动我到左边框中"><img src="images/book01.jpg" alt=""/><span>《school》课件(1)</span></div>';
			}else if(Current.ResourceType==5){
				html+='<div class="dragEnable" typeIco="1" hidSrc="source/P_1/U_1/B/11BL108.html" hidId="p_1" title="拖动我到左边框中"><img src="images/book01.jpg" alt=""/><span>《school》课件(1)</span></div>';
				html+='<div class="dragEnable" typeIco="1" hidSrc="source/P_1/U_1/B/11BL201.html" hidId="p_1" title="拖动我到左边框中"><img src="images/book01.jpg" alt=""/><span>《school》课件(1)</span></div>';
			}else if(Current.ResourceType==6){
				html+='<div class="dragEnable" typeIco="1" hidSrc="source/P_1/U_1/B/11BL202.html" hidId="p_1" title="拖动我到左边框中"><img src="images/book01.jpg" alt=""/><span>《school》课件(1)</span></div>';
				html+='<div class="dragEnable" typeIco="1" hidSrc="source/P_1/U_1/B/11BL203.html" hidId="p_1" title="拖动我到左边框中"><img src="images/book01.jpg" alt=""/><span>《school》课件(1)</span></div>';
			}else if(Current.ResourceType==7){
				html+='<div class="dragEnable" typeIco="1" hidSrc="source/P_1/U_1/B/11BL204.html" hidId="p_1" title="拖动我到左边框中"><img src="images/book01.jpg" alt=""/><span>《school》课件(1)</span></div>';
			}else if(Current.ResourceType==8){
				html+='<div class="dragEnable" typeIco="1" hidSrc="source/P_1/U_1/B/11BL301.html" hidId="p_1" title="拖动我到左边框中"><img src="images/book01.jpg" alt=""/><span>《school》课件(1)</span></div>';
			}else if(Current.ResourceType==9){
				html+='<div class="dragEnable" typeIco="1" hidSrc="source/P_1/U_1/B/11BL302.html" hidId="p_1" title="拖动我到左边框中"><img src="images/book01.jpg" alt=""/><span>《school》课件(1)</span></div>';
			}
		}else{
			if(Current.ResourceType==1){
				html+='<div class="dragEnable" typeIco="1" hidSrc="source/P_1/U_2/B/12BL101.html" hidId="p_1" title="拖动我到左边框中"><img src="images/book01.jpg" alt=""/><span>《school》课件(1)</span></div>';
				html+='<div class="dragEnable" typeIco="1" hidSrc="source/P_1/U_2/B/12BL102.html" hidId="p_1" title="拖动我到左边框中"><img src="images/book01.jpg" alt=""/><span>《school》课件(1)</span></div>';
				html+='<div class="dragEnable" typeIco="1" hidSrc="source/P_1/U_2/B/12BL103.html" hidId="p_1" title="拖动我到左边框中"><img src="images/book01.jpg" alt=""/><span>《school》课件(1)</span></div>';
			}else if(Current.ResourceType==2){
				html+='<div class="dragEnable" typeIco="1" hidSrc="source/P_1/U_2/B/12BL201.html" hidId="p_1" title="拖动我到左边框中"><img src="images/book01.jpg" alt=""/><span>《school》课件(1)</span></div>';
			}else if(Current.ResourceType==3){
				html+='<div class="dragEnable" typeIco="1" hidSrc="source/P_1/U_2/B/12BL202.html" hidId="p_1" title="拖动我到左边框中"><img src="images/book01.jpg" alt=""/><span>《school》课件(1)</span></div>';
			}else if(Current.ResourceType==4){
				html+='<div class="dragEnable" typeIco="1" hidSrc="source/P_1/U_2/B/12BL301.html" hidId="p_1" title="拖动我到左边框中"><img src="images/book01.jpg" alt=""/><span>《school》课件(1)</span></div>';
				html+='<div class="dragEnable" typeIco="1" hidSrc="source/P_1/U_2/B/12BL302.html" hidId="p_1" title="拖动我到左边框中"><img src="images/book01.jpg" alt=""/><span>《school》课件(1)</span></div>';
			}else if(Current.ResourceType==5){
				
			}else if(Current.ResourceType==6){
				
			}else if(Current.ResourceType==7){
				
			}else if(Current.ResourceType==8){
				
			}else if(Current.ResourceType==9){
				
			}
		}
		$("#toolbar").html(html);
		//绑定拖动事件
		$(".dragEnable").each(function(index, element) {
			var curObj=$(this).get(0);
			bindDragEvent(curObj);
		});
	}
}

var resource;
$(function () {
    resource = new Resource();
    resource.Init();
})