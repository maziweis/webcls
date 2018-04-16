
var Resource=function	(){
	var Current = this;
	this.PageIndex = 1;
	this.PageSize = 9;

	this.tabName = "同步资源";
	this.UnitID="1";
	this.ResourceType=0;
	
	this.Init=function(){
		Current.InitResource();
		
		$("#selCatalog").bind("change",function(){     
			Current.UnitID=$(this).val();
			$("#typelist").find("a")[0].click();
		});  
	    ////////////////////////////////////////
	    ////////////同步资源类型筛选////////////
	    ////////////////////////////////////////
		$("#typelist").find("a").each(function(){
			$(this).bind("click",function(){
				Current.ResourceType=$(this).attr("hidSourceType");
				$("#typelist").find("a").removeClass("cur");
				$(this).addClass("cur");
				Current.InitResource();
			});
		});

	    ////////////////////////////////////////
	    ////////////同步资源类型筛选////////////
	    ////////////////////////////////////////
		$(".typelist2").find("a").each(function () {
		    $(this).bind("click", function () {
		        Current.ResourceType = $(this).attr("hidSourceType");
		        $(".typelist2").find("a").removeClass("active");
		        $(this).addClass("active");
		        Current.InitExpandResource();
		    });
		});
	}
    ///////////////////////////////////
    //////////加载拓展资源/////////////
    ///////////////////////////////////
	this.InitExpandResource = function () {
	    var html = "";
	    if (Current.ResourceType == 1) {//拓展习题
	        if (Current.UnitID == 1) {
	            html+=Current.GetUnit1Kejian();
	        } else if (Current.UnitID == 2) {
	            html += Current.GetUnit2Kejian();
	        }
	    } else if (Current.ResourceType == 2) {//自然拼图
	        html += Current.GetUnit1Tupian();
	    } else if (Current.ResourceType == 3) {//拓展动画
	        if (Current.UnitID == 1) {
	            html += Current.GetUnit1Donghua();
	        } else if (Current.UnitID == 2) {
	            html += Current.GetUnit2Donghua();
	        }
	    } else {//绘本阅读
	        html += Current.GetUnit1Jiaoan();
	    }

	    $("#divExpandResource").html(html);

	    $("#divExpandResource div").each(function (n, obj) {
	        if ((Current.PageIndex - 1) * Current.PageSize <= n && n < Current.PageIndex * Current.PageSize)
	            $(obj).show();
	        else
	            $(obj).hide();
	    });

	    //绑定拖动事件
	    $(".dragEnable").each(function (index, element) {
	        var curObj = $(this).get(0);
	        bindDragEvent(curObj);
	    });
	};
    ///////////////////////////////////
	//////////加载同步资源/////////////
    ///////////////////////////////////
	this.InitResource = function () {
	    var arrList = jQuery.parseJSON(dbJson);
		var html="";
		if(Current.UnitID==1){
		    if (Current.ResourceType == 1) {//习题课件
		        html += Current.GetUnit1Kejian();
			}else if(Current.ResourceType==2){//动画
			    html += Current.GetUnit1Donghua();
			} else if (Current.ResourceType == 3) {//PPT课件
			    html += Current.GetUnit1KeJianPPT();
			} else if (Current.ResourceType == 4) {//教案
			    html += Current.GetUnit1Jiaoan();
			} else if (Current.ResourceType == 5) {//音频
			    html += Current.GetUnit1MP3();
			}else if(Current.ResourceType==6){//试卷
			    html += Current.GetUnit1Shijuan();
			} else if (Current.ResourceType == 7) {//图片
			    html += Current.GetUnit1Tupian();
			}else{
			    html += Current.GetUnit1Kejian();//习题课件
			    html += Current.GetUnit1Donghua();//动画
			    html += Current.GetUnit1KeJianPPT();//PPT课件
			    html += Current.GetUnit1Jiaoan();//教案
			    html += Current.GetUnit1MP3();//音频
			    html += Current.GetUnit1Shijuan();//试卷
			    html += Current.GetUnit1Tupian();//图片
			}
		}else{
		    if (Current.ResourceType == 1) {//习题课件
			    html += Current.GetUnit2Kejian();
		    } else if (Current.ResourceType == 2) {//动画
			    html += Current.GetUnit2Donghua();
			} else if (Current.ResourceType == 3) {//PPT课件
			    html += Current.GetUnit2KeJianPPT();
			} else if (Current.ResourceType == 4) {//教案
			    html += Current.GetUnit2Jiaoan();
			} else if (Current.ResourceType == 5) {//音频
			    html += Current.GetUnit2MP3();
			} else if (Current.ResourceType == 6) {//试卷
			    html += Current.GetUnit2Shijuan();
			} else if (Current.ResourceType == 7) {//图片
			    html += Current.GetUnit2Tupian();
			}else{
			    html += Current.GetUnit2Kejian();//习题课件
			    html += Current.GetUnit2Donghua();//动画
			    html += Current.GetUnit2KeJianPPT();//PPT课件
			    html += Current.GetUnit2Jiaoan();//教案
			    html += Current.GetUnit2MP3();//音频
			    html += Current.GetUnit2Shijuan();//试卷
			    html += Current.GetUnit2Tupian();//图片
			}
		}
		$("#divSyncResource").html(html);

		$("#divSyncResource div").each(function(n,obj) {
		    if ((Current.PageIndex-1) * Current.PageSize<=n&&n <Current.PageIndex * Current.PageSize)
		        $(obj).show();
		    else
		        $(obj).hide();
		});
		//绑定拖动事件
		$(".dragEnable").each(function(index, element) {
			var curObj=$(this).get(0);
			bindDragEvent(curObj);
		});
	}
    ///////////////////////////////////////////
    ///////////第一单元习题课件////////////////
    ///////////////////////////////////////////
	this.GetUnit1Kejian = function () {
	    var html = "";
	    html += '<div class="dragEnable" typeIco="3" hidSrc="../../Resource/P_1/U_1/A/11AL101.html" hidId="p_1" title="拖动我到左边框中"><img src="../../Resource/P_1/U_1/JPG/11AL101.jpg" alt="" draggable="false"/><span>A-Let\'s try</span></div>';
	    html += '<div class="dragEnable" typeIco="3" hidSrc="../../Resource/P_1/U_1/A/11AS3.html" hidId="p_1" title="拖动我到左边框中"><img src="../../Resource/P_1/U_1/JPG/11AS3.jpg" alt="" draggable="false"/><span>A-Let\'s talk</span></div>';
	    html += '<div class="dragEnable" typeIco="3" hidSrc="../../Resource/P_1/U_1/A/11AS4.html" hidId="p_1" title="拖动我到左边框中"><img src="../../Resource/P_1/U_1/JPG/11AS4.jpg" alt="" draggable="false"/><span>A-Let\'s spell</span></div>';
	    html += '<div class="dragEnable" typeIco="3" hidSrc="../../Resource/P_1/U_1/B/11BL101.html" hidId="p_1" title="拖动我到左边框中"><img src="../../Resource/P_1/U_1/JPG/11BL101.jpg" alt="" draggable="false"/><span>B-Let\'s try</span></div>';
	    //html += '<div class="dragEnable" typeIco="3" hidSrc="../../Resource/P_1/U_1/B/11BL201.html" hidId="p_1" title="拖动我到左边框中"><img src="../../Resource/P_1/U_1/JPG/11BL201.jpg" alt="" draggable="false"/><span>B-Tick or cross (1)</span></div>';
	    html += '<div class="dragEnable" typeIco="3" hidSrc="../../Resource/P_1/U_1/B/11BL202.html" hidId="p_1" title="拖动我到左边框中"><img src="../../Resource/P_1/U_1/JPG/11BL202.jpg" alt="" draggable="false"/><span>B-Tick or cross (2)</span></div>';
	    html += '<div class="dragEnable" typeIco="3" hidSrc="../../Resource/P_1/U_1/B/11BL301.html" hidId="p_1" title="拖动我到左边框中"><img src="../../Resource/P_1/U_1/JPG/11BL301.jpg" alt="" draggable="false"/><span>B-Listen and tick</span></div>';
	    html += '<div class="dragEnable" typeIco="3" hidSrc="../../Resource/P_1/U_1/B/11BL401.html" hidId="p_1" title="拖动我到左边框中"><img src="../../Resource/P_1/U_1/JPG/11BL401.jpg" alt="" draggable="false"/><span>B-Let\'s wrap it up (1)</span></div>';
	    html += '<div class="dragEnable" typeIco="3" hidSrc="../../Resource/P_1/U_1/B/11BL402.html" hidId="p_1" title="拖动我到左边框中"><img src="../../Resource/P_1/U_1/JPG/11BL402.jpg" alt="" draggable="false"/><span>B-Let\'s wrap it up (2)</span></div>';
	    html += '<div class="dragEnable" typeIco="3" hidSrc="../../Resource/P_1/U_1/B/11BS3.html" hidId="p_1" title="拖动我到左边框中"><img src="../../Resource/P_1/U_1/JPG/11BS3.jpg" alt="" draggable="false"/><span>B-Let\'s talk</span></div>';
	    html += '<div class="dragEnable" typeIco="3" hidSrc="../../Resource/P_1/U_1/C/11CS4.html" hidId="p_1" title="拖动我到左边框中"><img src="../../Resource/P_1/U_1/JPG/11CS4.jpg" alt="" draggable="false"/><span>C-Story time</span></div>';
	    return html;
	};
    ///////////////////////////////////////
    ///////////第一单元动画////////////////
    ///////////////////////////////////////
	this.GetUnit1Donghua = function () {
	    var html = "";
	    html += '<div class="dragEnable" typeIco="1" hidSrc="../../Resource/P_1/U_1/A/p4Atalk.mp4" hidId="p_1" title="拖动我到左边框中"><img src="../../Resource/P_1/U_1/JPG/p4Atalk.jpg" alt="" draggable="false"/><span>视频</span></div>';
	    html += '<div class="dragEnable" typeIco="1" hidSrc="../../Resource/P_1/U_1/A/p6AchanD.mp4" hidId="p_1" title="拖动我到左边框中"><img src="../../Resource/P_1/U_1/JPG/P6Achant.jpg" alt="" draggable="false"/><span>视频</span></div>';
	    html += '<div class="dragEnable" typeIco="1" hidSrc="../../Resource/P_1/U_1/A/p6Achant.mp4" hidId="p_1" title="拖动我到左边框中"><img src="../../Resource/P_1/U_1/JPG/11AS4.jpg" alt="" draggable="false"/><span>视频</span></div>';
	    html += '<div class="dragEnable" typeIco="1" hidSrc="../../Resource/P_1/U_1/A/U1main.mp4" hidId="p_1" title="拖动我到左边框中"><img src="../../Resource/P_1/U_1/JPG/U1main.jpg" alt="" draggable="false"/><span>视频</span></div>';
	    html += '<div class="dragEnable" typeIco="1" hidSrc="../../Resource/P_1/U_1/A/U1sing.mp4" hidId="p_1" title="拖动我到左边框中"><img src="../../Resource/P_1/U_1/JPG/U1sing.jpg" alt="" draggable="false"/><span>视频</span></div>';
	    html += '<div class="dragEnable" typeIco="1" hidSrc="../../Resource/P_1/U_1/B/P7Btalk.mp4" hidId="p_1" title="拖动我到左边框中"><img src="../../Resource/P_1/U_1/JPG/P7Btalk.jpg" alt="" draggable="false"/><span>视频</span></div>';
	    html += '<div class="dragEnable" typeIco="1" hidSrc="../../Resource/P_1/U_1/C/U1Story.mp4" hidId="p_1" title="拖动我到左边框中"><img src="../../Resource/P_1/U_1/JPG/U1Story.jpg" alt="" draggable="false"/><span>视频</span></div>';
	    return html;
	};
    ///////////////////////////////////////
    ///////////第一单元PPT课件////////////////
    ///////////////////////////////////////
	this.GetUnit1KeJianPPT = function () {
	    var html = "";
	    html += '<div class="dragEnable" typeIco="5" hidSrc="../../FZresource/U1/第一课时_课件(1).ppt" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/pptImg.png" alt="" draggable="false"/><span>第一课时_课件(1)</span></div>';
	    html += '<div class="dragEnable" typeIco="5" hidSrc="../../FZresource/U1/第一课时_课件(2).ppt" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/pptImg.png" alt="" draggable="false"/><span>第一课时_课件(2)</span></div>';
	    html += '<div class="dragEnable" typeIco="5" hidSrc="../../FZresource/U1/第三课时_课件(1).ppt" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/pptImg.png" alt="" draggable="false"/><span>第三课时_课件(1)</span></div>';
	    html += '<div class="dragEnable" typeIco="5" hidSrc="../../FZresource/U1/第三课时_课件(2).ppt" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/pptImg.png" alt="" draggable="false"/><span>第三课时_课件(2)</span></div>';
	    return html;
	};
    ///////////////////////////////////////
    ///////////第一单元教案////////////////
    ///////////////////////////////////////
	this.GetUnit1Jiaoan = function () {
	    var html = "";
	    html += '<div class="dragEnable" typeIco="6" hidSrc="../../FZresource/U1/第一课时_教案.doc" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/wordImg.png" alt="" draggable="false"/><span>第一课时_教案</span></div>';
	    html += '<div class="dragEnable" typeIco="6" hidSrc="../../FZresource/U1/第二课时_教案.doc" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/wordImg.png" alt="" draggable="false"/><span>第二课时_教案</span></div>';
	    html += '<div class="dragEnable" typeIco="6" hidSrc="../../FZresource/U1/第三课时_教案.doc" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/wordImg.png" alt="" draggable="false"/><span>第三课时_教案</span></div>';
	    return html;
	};
    ///////////////////////////////////////
    ///////////第一单元MP3////////////////
    ///////////////////////////////////////
	this.GetUnit1MP3 = function () {
	    var html = "";
	    html += '<div class="dragEnable" typeIco="4" hidSrc="../../FZresource/U1/A-Let\'s talk(1).mp3" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/musicImg.png" alt="" draggable="false"/><span>A-Let\'s talk(1)</span></div>';
	    html += '<div class="dragEnable" typeIco="4" hidSrc="../../FZresource/U1/A-Let\'s talk(2).mp3" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/musicImg.png" alt="" draggable="false"/><span>A-Let\'s talk(1)</span></div>';
	    html += '<div class="dragEnable" typeIco="4" hidSrc="../../FZresource/U1/B-Let\'s talk(1).mp3" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/musicImg.png" alt="" draggable="false"/><span>B-Let\'s talk(1)</span></div>';
	    html += '<div class="dragEnable" typeIco="4" hidSrc="../../FZresource/U1/B-Let\'s talk(2).mp3" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/musicImg.png" alt="" draggable="false"/><span>B-Let\'s talk(2)</span></div>';
	    html += '<div class="dragEnable" typeIco="4" hidSrc="../../FZresource/U1/B-Read and write.mp3" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/musicImg.png" alt="" draggable="false"/><span>B-Read and write</span></div>';
	    html += '<div class="dragEnable" typeIco="4" hidSrc="../../FZresource/U1/clean my room.mp3" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/musicImg.png" alt="" draggable="false"/><span>clean my room</span></div>';
	    html += '<div class="dragEnable" typeIco="4" hidSrc="../../FZresource/U1/C-Let\'s sing.mp3" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/musicImg.png" alt="" draggable="false"/><span>C-Let\'s sing</span></div>';
	    html += '<div class="dragEnable" typeIco="4" hidSrc="../../FZresource/U1/C-Story time (1).mp3" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/musicImg.png" alt="" draggable="false"/><span>C-Story time (1)</span></div>';
	    html += '<div class="dragEnable" typeIco="4" hidSrc="../../FZresource/U1/C-Story time (2).mp3" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/musicImg.png" alt="" draggable="false"/><span>C-Story time (2)</span></div>';
	    html += '<div class="dragEnable" typeIco="4" hidSrc="../../FZresource/U1/do morning exercises.mp3" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/musicImg.png" alt="" draggable="false"/><span>do morning exercises</span></div>';
	    html += '<div class="dragEnable" typeIco="4" hidSrc="../../FZresource/U1/eat breakfast.mp3" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/musicImg.png" alt="" draggable="false"/><span>eat breakfast</span></div>';
	    html += '<div class="dragEnable" typeIco="4" hidSrc="../../FZresource/U1/eat dinner.mp3" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/musicImg.png" alt="" draggable="false"/><span>eat dinner</span></div>';
	    html += '<div class="dragEnable" typeIco="4" hidSrc="../../FZresource/U1/go for a walk.mp3" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/musicImg.png" alt="" draggable="false"/><span>go for a walk</span></div>';
	    html += '<div class="dragEnable" typeIco="4" hidSrc="../../FZresource/U1/go shopping.mp3" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/musicImg.png" alt="" draggable="false"/><span>go shopping</span></div>';
	    html += '<div class="dragEnable" typeIco="4" hidSrc="../../FZresource/U1/have ... class.mp3" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/musicImg.png" alt="" draggable="false"/><span>have ... class</span></div>';
	    html += '<div class="dragEnable" typeIco="4" hidSrc="../../FZresource/U1/Main scene(1).mp3" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/musicImg.png" alt="" draggable="false"/><span>Main scene(1)</span></div>';
	    html += '<div class="dragEnable" typeIco="4" hidSrc="../../FZresource/U1/Main scene(2).mp3" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/musicImg.png" alt="" draggable="false"/><span>Main scene(2)</span></div>';
	    html += '<div class="dragEnable" typeIco="4" hidSrc="../../FZresource/U1/play sports.mp3" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/musicImg.png" alt="" draggable="false"/><span>play sports</span></div>';
	    html += '<div class="dragEnable" typeIco="4" hidSrc="../../FZresource/U1/take a dancing class.mp3" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/musicImg.png" alt="" draggable="false"/><span>take a dancing class</span></div>';
	    return html;
	};
    ///////////////////////////////////////
    ///////////第一单元试卷////////////////
    ///////////////////////////////////////
	this.GetUnit1Shijuan = function () {
	    var html = "";
	    html += '<div class="dragEnable" typeIco="6" hidSrc="../../FZresource/U1/第一单元测试题.doc" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/wordImg.png" alt="" draggable="false"/><span>第一单元测试题</span></div>';
	    html += '<div class="dragEnable" typeIco="4" hidSrc="../../FZresource/U1/第一单元测试题.mp3" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/musicImg.png" alt="" draggable="false"/><span>第一单元测试题</span></div>';
	    return html;
	};
    ///////////////////////////////////////
    ///////////第一单元图片////////////////
    ///////////////////////////////////////
	this.GetUnit1Tupian = function () {
	    var html = "";
	    html += '<div class="dragEnable" typeIco="8" hidSrc="../../FZresource/U1/A-Ask and write.png" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/U1/A-Ask and write.png" alt="" draggable="false"/><span>A-Ask and write</span></div>';
	    html += '<div class="dragEnable" typeIco="8" hidSrc="../../FZresource/U1/A-Bingo!.png" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/U1/A-Bingo!.png" alt="" draggable="false"/><span>A-Bingo!</span></div>';

	    html += '<div class="dragEnable" typeIco="8" hidSrc="../../FZresource/U1/A-Let\'s learn.png" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/U1/A-Let\'s learn.png" alt="" draggable="false"/><span>A-Let\'s learn</span></div>';
	    html += '<div class="dragEnable" typeIco="8" hidSrc="../../FZresource/U1/A-Let\'s talk.png" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/U1/A-Let\'s talk.png" alt="" draggable="false"/><span>A-Let\'s talk</span></div>';
	    html += '<div class="dragEnable" typeIco="8" hidSrc="../../FZresource/U1/A-Let\'s try.png" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/U1/A-Let\'s try.png" alt="" draggable="false"/><span>A-Let\'s try</span></div>';
	    html += '<div class="dragEnable" typeIco="8" hidSrc="../../FZresource/U1/A-Read listen and chant.png" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/U1/A-Read listen and chant.png" alt="" draggable="false"/><span>A-Read listen and chant</span></div>';
	    html += '<div class="dragEnable" typeIco="8" hidSrc="../../FZresource/U1/A-Role-play.png" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/U1/A-Role-play.png" alt="" draggable="false"/><span>A-Role-play</span></div>';
	    html += '<div class="dragEnable" typeIco="8" hidSrc="../../FZresource/U1/B-Ask the question and then pass it on.png" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/U1/B-Ask the question and then pass it on.png" alt="" draggable="false"/><span>B-Ask the question and then pass it on</span></div>';

	    html += '<div class="dragEnable" typeIco="8" hidSrc="../../FZresource/U1/B-Do a survey.png" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/U1/B-Do a survey.png" alt="" draggable="false"/><span>B-Do a survey</span></div>';
	    html += '<div class="dragEnable" typeIco="8" hidSrc="../../FZresource/U1/B-Let\'s learn.png" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/U1/B-Let\'s learn.png" alt="" draggable="false"/><span>B-Let\'s learn</span></div>';
	    return html;
	};



    ///////////////////////////////////////////
    ///////////第二单元习题课件////////////////
    ///////////////////////////////////////////
	this.GetUnit2Kejian = function () {
	    var html = "";
	    html += '<div class="dragEnable" typeIco="3" hidSrc="../../Resource/P_1/U_2/A/12AL101.html" hidId="p_1" title="拖动我到左边框中"><img src="../../Resource/P_1/U_2/JPG/12AL101.jpg" alt="" draggable="false"/><span>A-Listen and choose</span></div>';
	    html += '<div class="dragEnable" typeIco="3" hidSrc="../../Resource/P_1/U_2/A/12AL201.html" hidId="p_1" title="拖动我到左边框中"><img src="../../Resource/P_1/U_2/JPG/12AL201.jpg" alt="" draggable="false"/><span>A-Read and match</span></div>';
	    html += '<div class="dragEnable" typeIco="3" hidSrc="../../Resource/P_1/U_2/A/12AL301.html" hidId="p_1" title="拖动我到左边框中"><img src="../../Resource/P_1/U_2/JPG/12AL301.jpg" alt="" draggable="false"/><span>A-Read and group (1)</span></div>';
	    html += '<div class="dragEnable" typeIco="3" hidSrc="../../Resource/P_1/U_2/A/12AL302.html" hidId="p_1" title="拖动我到左边框中"><img src="../../Resource/P_1/U_2/JPG/12AL302.jpg" alt="" draggable="false"/><span>A-Read and group (2)</span></div>';
	    html += '<div class="dragEnable" typeIco="3" hidSrc="../../Resource/P_1/U_2/A/12AS3.html" hidId="p_1" title="拖动我到左边框中"><img src="../../Resource/P_1/U_2/JPG/12AS3.jpg" alt="" draggable="false"/><span>A-Let\'s talk</span></div>';
	    html += '<div class="dragEnable" typeIco="3" hidSrc="../../Resource/P_1/U_2/A/12AS4.html" hidId="p_1" title="拖动我到左边框中"><img src="../../Resource/P_1/U_2/JPG/12AS4.jpg" alt="" draggable="false"/><span>A-Let\' spell</span></div>';
	    html += '<div class="dragEnable" typeIco="3" hidSrc="../../Resource/P_1/U_2/B/12BL101.html" hidId="p_1" title="拖动我到左边框中"><img src="../../Resource/P_1/U_2/JPG/12BL101.jpg" alt="" draggable="false"/><span>B-Listen and tick</span></div>';
	    //html += '<div class="dragEnable" typeIco="3" hidSrc="../../Resource/P_1/U_2/B/12BL201.html" hidId="p_1" title="拖动我到左边框中"><img src="../../Resource/P_1/U_2/JPG/12BL201.jpg" alt="" draggable="false"/><span>B-Read and tick (1)</span></div>';
	    html += '<div class="dragEnable" typeIco="3" hidSrc="../../Resource/P_1/U_2/B/12BL202.html" hidId="p_1" title="拖动我到左边框中"><img src="../../Resource/P_1/U_2/JPG/12BL202.jpg" alt="" draggable="false"/><span>B-Read and tick (2)</span></div>';
	    html += '<div class="dragEnable" typeIco="3" hidSrc="../../Resource/P_1/U_2/B/12BL301.html" hidId="p_1" title="拖动我到左边框中"><img src="../../Resource/P_1/U_2/JPG/12BL301.jpg" alt="" draggable="false"/><span>B-Listen and choose</span></div>';
	    html += '<div class="dragEnable" typeIco="3" hidSrc="../../Resource/P_1/U_2/B/12BL401.html" hidId="p_1" title="拖动我到左边框中"><img src="../../Resource/P_1/U_2/JPG/12BL401.jpg" alt="" draggable="false"/><span>B-Let\' wrap it up</span></div>';
	    html += '<div class="dragEnable" typeIco="3" hidSrc="../../Resource/P_1/U_2/B/12BS3.html" hidId="p_1" title="拖动我到左边框中"><img src="../../Resource/P_1/U_2/JPG/12BS3.jpg" alt="" draggable="false"/><span>B-Let\'s talk</span></div>';
	    html += '<div class="dragEnable" typeIco="3" hidSrc="../../Resource/P_1/U_2/C/12CS3.html" hidId="p_1" title="拖动我到左边框中"><img src="../../Resource/P_1/U_2/JPG/12CS3.jpg" alt="" draggable="false"/><span>C-Story time</span></div>';
	    return html;
	};
    ///////////////////////////////////////
    ///////////第二单元动画////////////////
    ///////////////////////////////////////
	this.GetUnit2Donghua = function () {
	    var html = "";
	    html += '<div class="dragEnable" typeIco="1" hidSrc="../../Resource/P_1/U_2/A/P14Atalk.mp4" hidId="p_1" title="拖动我到左边框中"><img src="../../Resource/P_1/U_2/JPG/P14Atalk.jpg" alt="" draggable="false"/><span>视频</span></div>';
	    html += '<div class="dragEnable" typeIco="1" hidSrc="../../Resource/P_1/U_2/A/P16AchaD.mp4" hidId="p_1" title="拖动我到左边框中"><img src="../../Resource/P_1/U_2/JPG/P16Achant.jpg" alt="" draggable="false"/><span>视频</span></div>';
	    html += '<div class="dragEnable" typeIco="1" hidSrc="../../Resource/P_1/U_2/A/P16Achan.mp4" hidId="p_1" title="拖动我到左边框中"><img src="../../Resource/P_1/U_2/JPG/12AS4.jpg" alt="" draggable="false"/><span>视频</span></div>';
	    html += '<div class="dragEnable" typeIco="1" hidSrc="../../Resource/P_1/U_2/A/U2main.mp4" hidId="p_1" title="拖动我到左边框中"><img src="../../Resource/P_1/U_2/JPG/U2main.jpg" alt="" draggable="false"/><span>视频</span></div>';
	    html += '<div class="dragEnable" typeIco="1" hidSrc="../../Resource/P_1/U_2/A/U2sing.mp4" hidId="p_1" title="拖动我到左边框中"><img src="../../Resource/P_1/U_2/JPG/U2sing.jpg" alt="" draggable="false"/><span>视频</span></div>';
	    html += '<div class="dragEnable" typeIco="1" hidSrc="../../Resource/P_1/U_2/B/P17Btalk.mp4" hidId="p_1" title="拖动我到左边框中"><img src="../../Resource/P_1/U_2/JPG/P17talk.jpg" alt="" draggable="false"/><span>视频</span></div>';
	    html += '<div class="dragEnable" typeIco="1" hidSrc="../../Resource/P_1/U_2/C/U2Story.mp4" hidId="p_1" title="拖动我到左边框中"><img src="../../Resource/P_1/U_2/JPG/U2Story.jpg" alt="" draggable="false"/><span>视频</span></div>';
	    return html;
	}
    ///////////////////////////////////////
    ///////////第二单元课件////////////////
    ///////////////////////////////////////
	this.GetUnit2KeJianPPT = function () {
	    var html = "";
	    html += '<div class="dragEnable" typeIco="5" hidSrc="../../FZresource/U_2/第一课时_课件(1).ppt" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/pptImg.png" alt="" draggable="false"/><span>第一课时_课件(1)</span></div>';
	    html += '<div class="dragEnable" typeIco="5" hidSrc="../../FZresource/U_2/第一课时_课件(2).ppt" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/pptImg.png" alt="" draggable="false"/><span>第一课时_课件(2)</span></div>';
	    html += '<div class="dragEnable" typeIco="5" hidSrc="../../FZresource/U_2/第一课时_课件(1).ppt" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/pptImg.png" alt="" draggable="false"/><span>第一课时_课件(1)</span></div>';
	    html += '<div class="dragEnable" typeIco="5" hidSrc="../../FZresource/U_2/第三课时_课件(2).ppt" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/pptImg.png" alt="" draggable="false"/><span>第三课时_课件(2)</span></div>';
	    return html;
	};
    ///////////////////////////////////////
    ///////////第二单元教案////////////////
    ///////////////////////////////////////
	this.GetUnit2Jiaoan = function () {
	    var html = "";
	    html += '<div class="dragEnable" typeIco="6" hidSrc="../../FZresource/U1/第一课时_教案.doc" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/wordImg.png" alt="" draggable="false"/><span>第一课时_教案</span></div>';
	    html += '<div class="dragEnable" typeIco="6" hidSrc="../../FZresource/U1/第二课时_教案.doc" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/wordImg.png" alt="" draggable="false"/><span>第二课时_教案</span></div>';
	    html += '<div class="dragEnable" typeIco="6" hidSrc="../../FZresource/U1/第三课时_教案.doc" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/wordImg.png" alt="" draggable="false"/><span>第三课时_教案</span></div>';
	    return html;
	};
    ///////////////////////////////////////
    ///////////第二单元MP3////////////////
    ///////////////////////////////////////
	this.GetUnit2MP3 = function () {
	    var html = "";
	    html += '<div class="dragEnable" typeIco="4" hidSrc="../../FZresource/U2/B-Let\'s talk.mp3" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/musicImg.png" alt="" draggable="false"/><span>B-Let\'s talk</span></div>';
	    html += '<div class="dragEnable" typeIco="4" hidSrc="../../FZresource/U2/go on a picnic.mp3" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/musicImg.png" alt="" draggable="false"/><span>go on a picnic</span></div>';
	    html += '<div class="dragEnable" typeIco="4" hidSrc="../../FZresource/U2/Main scene.mp3" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/musicImg.png" alt="" draggable="false"/><span>Main scene</span></div>';
	    html += '<div class="dragEnable" typeIco="4" hidSrc="../../FZresource/U2/spring.mp3" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/musicImg.png" alt="" draggable="false"/><span>spring</span></div>';
	    html += '<div class="dragEnable" typeIco="4" hidSrc="../../FZresource/U2/summer.mp3" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/musicImg.png" alt="" draggable="false"/><span>summer</span></div>';
	    html += '<div class="dragEnable" typeIco="4" hidSrc="../../FZresource/U2/winter.mp3" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/musicImg.png" alt="" draggable="false"/><span>winter</span></div>';
	    return html;
	};
    ///////////////////////////////////////
    ///////////第二单元试卷////////////////
    ///////////////////////////////////////
	this.GetUnit2Shijuan = function () {
	    var html = "";
	    html += '<div class="dragEnable" typeIco="6" hidSrc="../../FZresource/U2/第二单元测试题.doc" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/wordImg.png" alt="" draggable="false"/><span>第二单元测试题</span></div>';
	    html += '<div class="dragEnable" typeIco="4" hidSrc="../../FZresource/U2/第二单元测试题.mp3" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/musicImg.png" alt="" draggable="false"/><span>第二单元测试题</span></div>';
	    return html;
	};
    ///////////////////////////////////////
    ///////////第二单元图片////////////////
    ///////////////////////////////////////
	this.GetUnit2Tupian = function () {
	    var html = "";
	    html += '<div class="dragEnable" typeIco="8" hidSrc="../../FZresource/U2/A-Read and match.png" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/U2/A-Read and match.png" alt="" draggable="false"/><span>A-Read and match</span></div>';
	    html += '<div class="dragEnable" typeIco="8" hidSrc="../../FZresource/U2/B-Ask and answer 2.png" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/U2/B-Ask and answer 2.png" alt="" draggable="false"/><span>B-Ask and answer 2</span></div>';
	    html += '<div class="dragEnable" typeIco="8" hidSrc="../../FZresource/U2/B-Read and write.png" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/U2/B-Read and write.png" alt="" draggable="false"/><span>B-Read and write</span></div>';
	    html += '<div class="dragEnable" typeIco="8" hidSrc="../../FZresource/U2/spring.png" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/U2/spring.png" alt="" draggable="false"/><span>spring</span></div>';
	    html += '<div class="dragEnable" typeIco="8" hidSrc="../../FZresource/U2/umbrella.png" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/U2/umbrella.png" alt="" draggable="false"/><span>umbrella</span></div>';
	    html += '<div class="dragEnable" typeIco="8" hidSrc="../../FZresource/U2/winter.png" hidId="p_1" title="拖动我到左边框中"><img src="../../FZresource/U2/winter.png" alt="" draggable="false"/><span>winter</span></div>';
	    return html;
	};

	this.OpenFileCheck=function() {
	    var inputObj = document.createElement('input')
	    inputObj.setAttribute('id', '_ef');
	    inputObj.setAttribute('type', 'file');
	    inputObj.setAttribute("style", 'visibility:hidden');
	    document.body.appendChild(inputObj);
	    inputObj.click();
	    inputObj.value;
	}

}

var resource;
$(function () {
    resource = new Resource();
    resource.Init();
})

//选项卡自定义点击事件
function tabClick(clickItem) {
    resource.tabName = clickItem.innerHTML;
    if (resource.tabName == "同步资源") {
        var a = $("#typelist").find("a")[0];
        $(a).click();
    } else if (resource.tabName == "拓展资源") {
        var a = $(".typelist2").find("a")[0];
        $(a).click();
    } else if (resource.tabName == "我的资源") {

    }
    
}