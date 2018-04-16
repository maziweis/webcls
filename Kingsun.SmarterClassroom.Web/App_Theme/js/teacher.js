// JavaScript Document
var paras=request("page");
var dbJson=[
    {
		pageImgSrc:"images/04.jpg",
		pageSource:[
		{"icoType":1,"sourceUrl":"source/P_1/U_1/A/11AS1.html","X":408,"Y":109},
		{"icoType":4,"sourceUrl":"source/P_1/U_1/D/11DL101.html","X":29,"Y":240},
		{"icoType":5,"sourceUrl":"source/P_1/U_5/C/15CL101.html","X":27,"Y":406},
		{"icoType":5,"sourceUrl":"source/P_1/U_5/C/15CL101.html","X":31,"Y":109},
		{"icoType":1,"sourceUrl":"source/P_1/U_1/A/11AS1.html","X":437,"Y":388},
		{"icoType":4,"sourceUrl":"source/P_1/U_1/D/11DL101.html","X":456,"Y":509}]
	},
	{
		pageImgSrc:"images/05.jpg",
		pageSource:[
		{"icoType":1,"sourceUrl":"source/P_1/U_1/A/11AS1.html","X":408,"Y":109},
		{"icoType":4,"sourceUrl":"source/P_1/U_1/D/11DL101.html","X":29,"Y":240},
		{"icoType":5,"sourceUrl":"source/P_1/U_5/C/15CL101.html","X":27,"Y":406},
		{"icoType":5,"sourceUrl":"source/P_1/U_5/C/15CL101.html","X":31,"Y":109},
		{"icoType":1,"sourceUrl":"source/P_1/U_1/A/11AS1.html","X":437,"Y":388},
		{"icoType":4,"sourceUrl":"source/P_1/U_1/D/11DL101.html","X":456,"Y":509}]
	},
	];
JsonData();

//解析双份数据，从Cookie中获取备课数据
function JsonData(){	
	var oldArrIds=getCookie("itemArr");		
	var temp=oldArrIds.split(',');
	var a=[];
	for(var i=0;i<temp.length;i++){
		var itemId=temp[i];
		var curDb=getCookie(itemId);
		//alert("当前数据为："+curDb);		
	}
	//var jsonObj = JSON.parse(dbJson);
	var str="";
	//alert(dbJson[0].pageSource);
	$.each(dbJson[0].pageSource,function(n,curItem){
		var pageSrc=curItem.pageImgSrc;
		//alert(pageSrc);
		$.each(curItem.pageSource,function(index,items){ 
			str+='<div class="newObj imgIco'+items.icoType+'" hidsrc="'+items.sourceUrl+'" sourcetype="'+items.icoType+'" id="p4989" style="left: '+items.X+'px; top: '+items.Y+'px;"></div>';
		});
		$(".pagesingle").html(str);
	});	
}