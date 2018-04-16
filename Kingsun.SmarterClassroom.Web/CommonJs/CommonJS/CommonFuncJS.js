var CommonFuncJS = CommonFuncJS || {};
CommonFuncJS.Template = CommonFuncJS.Template || {};
CommonFuncJS.Template.Management = CommonFuncJS.Template.Management || {};
CommonFuncJS.Template.Management = function () {

    this.UpdateStanBookUsingTime = function (userID,bookID) {
        var obj = { UserID: userID, BookID: bookID };
        return Common.Ajax("TeachImplement", "UpdateStanBookUsingTime", obj).Data;
    };
    ///////////////////////////////////////////
    /////////////获取系统当前时间//////////////
    ///////////////////////////////////////////
    this.GetServiceDateTime = function () {
        var obj = {};
        return Common.Ajax("BasicDataImplement", "GetServiceDateTime", obj).Data;
    };
    ///////////////////////////////////////////
    /////////////获取资源地址//////////////////
    ///////////////////////////////////////////
    this.GetResourceUrlByFileID = function (fileID) {
        var obj = { FileID: fileID };
        return Common.Ajax("TeachImplement", "GetResourceUrlByFileID", obj).Data;
    };
    ///////////////////////////////////////////
    /////////////记录操作日志//////////////////
    ///////////////////////////////////////////
    this.SaveOperationRecord = function (userID, userType, operID, content) {
        var obj = { UserID: userID, UserType: userType, OperID: operID, Content: content };
        return Common.Ajax("TeachImplement", "SaveOperationRecord", obj).Data;
    };
    ///////////////////////////////////////////
    /////////////记录用户最后的操作////////////
    ///////////////////////////////////////////
    this.SavsUserFinallyOperationRecord = function (userID, bookType, stageID, gradeID, subID, ediID, bookID, cataID, pageIndex) {
        var obj = { UserID: userID, BookType: bookType, Stage: stageID, SubjectID: subID, EditionID: ediID, GradeID: gradeID, BookID: bookID, UnitID: cataID, PageNum: pageIndex };
        return Common.Ajax("TeachImplement", "SavsUserFinallyOperationRecord", obj).Data;
    };
    ///////////////////////////////////////////
    /////////////获取用户最后的操作////////////
    ///////////////////////////////////////////
    this.GetUserFinallyOperationRecord = function (userID) {
        var obj = { UserID: userID };
        return Common.Ajax("TeachImplement", "GetUserFinallyOperationRecord", obj).Data;
    };
    ///////////////////////////////////////////
    /////////////去除数组中的重复数据//////////
    ///////////////////////////////////////////
    this.RemoveRepeat = function (arr) {
        var res = [];
        var json = {};
        for (var i = 0; i < arr.length; i++) {
            if (!json[arr[i]]) {
                res.push(arr[i]);
                json[arr[i]] = 1;
            }
        }
        return res;
    };
    ////////////////////////////////////////
    //////////////数组排序//////////////////
    ////////////////////////////////////////
    this.CreateCompact = function (order) {
        return function (obj1, obj2) {
            var value1 = obj1[order];
            var value2 = obj2[order];
            if (value1 < value2) {
                return -1;
            } else if (value1 > value2) {
                return 1;
            } else {
                return 0;
            }
        };
    };
    ////////////////////////////////////////
    //////////////数组排序//////////////////
    ////////////////////////////////////////
    this.CreateAscCompact = function (order) {
        return function (obj1, obj2) {
            if (order == "") {
                var value1 = Common.FormatTime(obj1[order], "yyyy-MM-dd hh:mm:ss");
                var value2 = Common.FormatTime(obj2[order], "yyyy-MM-dd hh:mm:ss");
            } else {
                var value1 = obj1[order];
                var value2 = obj2[order];
            }
            if (value1 > value2) {
                return -1;
            } else if (value1 < value2) {
                return 1;
            } else {
                return 0;
            }
        };
    };
    ////////////////////////////////////////
    //////////////数组排序//////////////////
    ////////////////////////////////////////
    this.CreateDescCompact = function (order) {
        return function (obj1, obj2) {
            if (order == "") {
                var value1 = Common.FormatTime(obj1[order], "yyyy-MM-dd hh:mm:ss");
                var value2 = Common.FormatTime(obj2[order], "yyyy-MM-dd hh:mm:ss");
            } else {
                var value1 = obj1[order];
                var value2 = obj2[order];
            }
            if (value1 > value2) {
                return 1;
            } else if (value1 < value2) {
                return -1;
            } else {
                return 0;
            }
        };
    };
    ////////////////////////////////////////
    //////////////排序//////////////////
    ////////////////////////////////////////
    this.CreateDescCompactMost = function (order1, order2, order3) {
        return function (obj1, obj2) {
            ///////////order1////////////
            var order1_value1 = obj1[order1];
            var order1_value2 = obj2[order1];
            ///////////order2////////////
            var order2_value1 = obj1[order2];
            var order2_value2 = obj2[order2];
            ///////////order3////////////
            var order3_value1 = obj1[order3];
            var order3_value2 = obj2[order3];

            if (order1_value1 > order1_value2) {
                return 1;
            } else if (order1_value1 < order1_value2) {
                return -1;
            } else {
                if (order2_value1 > order2_value2) {
                    return 1;
                } else if (order2_value1 < order2_value2) {
                    return -1;
                } else {
                    if (order3_value1 > order3_value2) {
                        return 1;
                    } else if (order3_value1 < order3_value2) {
                        return -1;
                    } else {
                        return 0;
                    }
                }
            }
        };
    };

    ///////////////////////////////////////////////////////////////////
    /////////////////////动态添加Js文件引用 同步   BEGIN////////////////
    ///////////////////////////////////////////////////////////////////
    this.GetHttpRequest = function () {
        if (window.XMLHttpRequest) // Gecko  
            return new XMLHttpRequest();
        else if (window.ActiveXObject) // IE  
            return new ActiveXObject("MsXml2.XmlHttp");
    };


    this.AjaxPageJs = function (sId, url) {
        var oXmlHttp = commonFuncJS.GetHttpRequest();
        oXmlHttp.onreadystatechange = function () {
            if (oXmlHttp.readyState == 4) {
                if (oXmlHttp.status == 200 || oXmlHttp.status == 304) {
                    commonFuncJS.IncludeJS(sId, url, oXmlHttp.responseText);
                } else {
                    alert('XML request error: ' + oXmlHttp.statusText + ' (' + oXmlHttp.status + ')');
                }
            }
        }
        oXmlHttp.open('GET', url, false);//同步操作  
        oXmlHttp.send(null);
    };
    this.IncludeJS = function (sId, fileUrl, source) {
        if ((source != null) && (!document.getElementById(sId))) {
            var oHead = document.getElementsByTagName('HEAD').item(0);
            var oScript = document.createElement("script");
            oScript.type = "text/javascript";
            oScript.id = sId;
            oScript.text = source;
            oHead.appendChild(oScript);
        }
    };
    ///////////////////////////////////////////////////////////////////
    /////////////////////动态添加Js文件引用 同步   END////////////////
    ///////////////////////////////////////////////////////////////////
    //用sessionStorage取数据
    this.getDataF = function (key) {
        // 取值时：把获取到的Json字符串转换回对象 
        var data = sessionStorage.getItem(key);
        //console.log(sessionStorage.getItem(key));
        var dataObj = JSON.parse(data);
        //console.log(dataObj.name); //输出
        return dataObj;
    };
    //用sessionStorage储存数据
    this.setDataF = function (key, value) {
        // 存储值：将对象转换为Json字符串 
        sessionStorage.setItem(key, JSON.stringify(value));
    }
    ///检查登录，返回用户信息
    this.CheckLogin = function (IP) {
        //临时使用
        //var userinfom = '{"Id":"49a92e48-1f39-4382-9273-0a0d521162c6","Type":12,"Account":"mzw","Name":"马梓崴","AvatarUrl":null,"Subject":3,"IsFirstLogin":false,"userClass":[{"GradeId":3,"GradeName":"三年级","ClassId":11,"ClassName":"一班","StuNum":2}]}';
        var userinfom = '{"Success":true,"Code":0,"Message":null,"Data":{"SchoolID":2,"UserID":9,"UserType":12,"UserName":"lm2962","TrueName":"孙飞飞2","Phone":"13300010002","AvatarUrl":null,"Token":"zbYkIJJEXWS7qmlZiKzWKDOOLN725Hu17XN4NBt89/w=","WebUrl":"http://192.168.3.190:8026","Stage":null,"ClassID":null,"GradeID":0,"Classes":[{"SubjectID":"1","SubjectName":null,"ClassID":42,"ClassName":"六年级3班","GradeID":7,"GradeName":null},{"SubjectID":"2","SubjectName":null,"ClassID":42,"ClassName":"六年级3班","GradeID":7,"GradeName":null},{"SubjectID":"3","SubjectName":null,"ClassID":42,"ClassName":"六年级3班","GradeID":7,"GradeName":null},{"SubjectID":"3","SubjectName":null,"ClassID":44,"ClassName":"七年级1班","GradeID":8,"GradeName":null},{"SubjectID":"3","SubjectName":null,"ClassID":49,"ClassName":"三年级2班","GradeID":4,"GradeName":null}]}}';
        var dfss = JSON.parse(userinfom).Data
        //将优教学数据转化为智慧教室数据格式
        var ds = '{"Id":' + dfss.UserID + ',' + '"Type":12' + ',' + '"Account":"' + dfss.UserName + '",' + '"Token":"' + dfss.Token + '",' + '"Name":"' + dfss.TrueName + '",' + '"AvatarUrl":"' + dfss.AvatarUrl + '",' + '"Subject":0' + ',' + '"userClass":' + JSON.stringify(dfss.Classes) + '}';
        commonFuncJS.setDataF("UserInfo", JSON.parse(ds));
        return JSON.parse(ds);
        //var userInfo = commonFuncJS.getDataF('UserInfo');
        //if (userInfo == null) {
        //    window.location.href = "Login.aspx";
        //}
        //var type = getUrlParam('type');
        //var type1 = commonFuncJS.getDataF('type');
        ////从Url参数中查
        //if (type == '1') {
        //    $(".ifhide").hide();
        //    var t = getUrlParam('t');
        //    UserAccount = JSON.parse(teachLessonManage.GetUserInfoByGuid(t, IP));//获取用户账号
        //    if (UserAccount != null) {
        //        commonFuncJS.setDataF("type", type);
        //        ///////////获取用户的基本数据/////////////
        //        var UserInfoList = teachLessonManage.GetUserInfoList(UserAccount); //参数为：UserAccount,返回string
        //        //addEleBookInit.userClass = addEleBookInit.UserInfoList.userClass;
        //        //UserID = addEleBookInit.UserInfoList.Id;
        //        commonFuncJS.setDataF("UserInfo", JSON.parse(UserInfoList));
        //        return JSON.parse(UserInfoList);
        //    }
        //    else {
        //        var href = $("#myconn").html();
        //        window.location.href = href;
        //    }
        //}
        //    //从Json中取
        //else {
        //    if (type1 == 1) {
        //        $(".ifhide").hide();
        //    }
        //    UserInfoJson = commonFuncJS.getDataF("UserInfo");
        //    if (UserInfoJson == null) {
        //        window.location.href = "../../login.aspx";
        //    }
        //    return UserInfoJson;
        //}
    };
    ///////////////////////////////////////////////////////
    //////////通过年龄获取对应的特色教材年级///////////////
    ///////////////////////////////////////////////////////
    this.GetTSGradeByAge = function (gradeID) {
        if (gradeID == "1")
            return "0-3";
        else if (gradeID == "2")
            return "6-7";
        else if (gradeID == "3")
            return "7-8";
        else if (gradeID == "4")
            return "8-9";
        else if (gradeID == "5")
            return "9-10";
        else if (gradeID == "6")
            return "10-11";
        else if (gradeID == "7")
            return "11-12";
        else if (gradeID == "14" || gradeID == "15" || gradeID == "16")
            return "3-6";
    };
    //////////////////////////////////////////////////
    //////////////检测浏览器是否安装flash/////////////
    //////////////////////////////////////////////////
    this.FlashChecker = function () {
        var hasFlash = 0;         //是否安装了flash  0：未安装 1：已安装
        var flashVersion = 0; //flash版本  
        var isIE = /*@cc_on!@*/0;      //是否IE浏览器  
        if (isIE) {
            var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
            if (swf) {
                hasFlash = 1;
                VSwf = swf.GetVariable("$version");
                flashVersion = parseInt(VSwf.split(" ")[1].split(",")[0]);
            }
        } else {
            if (navigator.plugins && navigator.plugins.length > 0) {
                var swf = navigator.plugins["Shockwave Flash"];
                if (swf) {
                    hasFlash = 1;
                    var words = swf.description.split(" ");
                    for (var i = 0; i < words.length; ++i) {
                        if (isNaN(parseInt(words[i]))) continue;
                        flashVersion = parseInt(words[i]);
                    }
                }
            }
        }
        return { f: hasFlash, v: flashVersion };
    };
    this.OS = function () {
        var ua = navigator.userAgent;
        isWindowsPhone = /(?:Windows Phone)/.test(ua),
        isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
        isAndroid = /(?:Android)/.test(ua),
        isFireFox = /(?:Firefox)/.test(ua),
        isChrome = /(?:Chrome|CriOS)/.test(ua),
        isiPad = /(?:iPad)/.test(ua),
        //isiPad = (ua.indexOf("iPad")>0)?true:false,
        isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
        isPhone = /(?:iPhone)/.test(ua) && !isTablet,
        isPc = !isPhone && !isAndroid && !isSymbian;
        return {
            isTablet: isTablet,
            isPhone: isPhone,
            isAndroid: isAndroid,
            isiPad:isiPad,
            isPc: isPc
        };
    }();
    //生成GUID
    this.GetGuid = function () {
        var result, i, j;
        result = '';
        for (j = 0; j < 32; j++) {
            if (j == 8 || j == 12 || j == 16 || j == 20)
                result = result + '-';
            i = Math.floor(Math.random() * 16).toString(16).toUpperCase();
            result = result + i;
        }
        return result;
    };
    //格式化时间
    this.getNowFormatDate = function () {
        var date = new Date();
        var seperator1 = "/";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = month + seperator1 + strDate + seperator1 + date.getFullYear()
                + " " + date.getHours() + seperator2 + date.getMinutes()
                + seperator2 + date.getSeconds();
        return currentdate;
    };

    //新手指引弹窗
    this.openGuidelines = function () {
        var isiOS = (!this.OS.isAndroid && this.OS.isTablet) ? true : false;
        var isTablet= this.OS.isTablet ? true : false;
        var imgRate = 1102 / 652;//图片比例w/s
        var aliveRate;//缩放比
        if (isiOS) {
            var pageNum = 9;//iOS新手指引页数
            var strHtml = '<div class="guidelines ipad">';
        }
        else {
            var pageNum = 14;//Android新手指引页数\
            var strHtml = '<div class="guidelines">';
        }
        strHtml += '<div class="swiper-container"><div class="swiper-wrapper">';
        for (var i = 0; i < pageNum; i++) {
            strHtml += "<div class=\"swiper-slide\">";
            if (isiOS) {  //ipad
                if (i == 4)
                    strHtml += '<div class="guideStep" data-step="' + (i + 1) + '" style="background-image:url(../../PersonCenter/guidelines/iOS/' + (i + 1) + '.png)"> <a class="endGuide" onclick="commonFuncJS.closeGuidelines()"></a><a class="goOn"></a></div>';
                else if (i == 8)
                    strHtml += '<div class="guideStep" data-step="' + (i + 1) + '" style="background-image:url(../../PersonCenter/guidelines/iOS/' + (i + 1) + '.png)"><a class="endGuide" onclick="commonFuncJS.closeGuidelines()" href="../Index.aspx"></a></div>';
                else
                    strHtml += '<div class="guideStep" data-step="' + (i + 1) + '" style="background-image:url(../../PersonCenter/guidelines/iOS/' + (i + 1) + '.png)"><a class="goOn"></a></div>';
            }
            else {
                if (i == 6 || i == 10)
                    strHtml += '<div class="guideStep" data-step="' + (i + 1) + '" style="background-image:url(../../PersonCenter/guidelines/' + (i + 1) + '.png)"> <a class="endGuide" onclick="commonFuncJS.closeGuidelines()"></a><a class="goOn"></a></div>';
                else if (i == 13)
                    strHtml += '<div class="guideStep" data-step="' + (i + 1) + '" style="background-image:url(../../PersonCenter/guidelines/' + (i + 1) + '.png)"><a class="endGuide" onclick="commonFuncJS.closeGuidelines()" href="../Index.aspx"></a></div>';
                else if (i == 3 || i == 7)
                    strHtml += '<div class="guideStep" data-step="' + (i + 1) + '" style="background-image:url(../../PersonCenter/guidelines/' + (i + 1) + '.png)"></div>';
                else
                    strHtml += '<div class="guideStep" data-step="' + (i + 1) + '" style="background-image:url(../../PersonCenter/guidelines/' + (i + 1) + '.png)"><a class="goOn"></a></div>';
            }
            strHtml += '</div>';
        }
        strHtml += '</div></div><a class="close" onclick="commonFuncJS.closeGuidelines()"></a>';
        strHtml += '<div class="circleDiv"><ul>';
        for (var i = 0; i < pageNum; i++) {
            if (i == 0) strHtml += '<li class="on"></li>';
            else strHtml += '<li></li>';
        }
        strHtml += '</ul></div></div>';
        $("body").append(strHtml);

        var GW = parseFloat($(".guideStep").height()) * imgRate;
        if (GW >= parseFloat($(window).width())) {
            GH = (parseFloat($(window).width()) * 0.9) / imgRate;
            $(".guideStep").css({ "width": "90%", "height": GH });
            aliveRate = GH/ 652;
        }
        else {
            $(".guideStep").css("width", GW);
            aliveRate = GW / 1102;
        }
        $(".guidelines .circleDiv").css("bottom", ($(window).height() - $(".guideStep").height()) / 4);
        //重新计算点击热区大小和位置
        var areaClick = function (index) {
            var curPageObj = $(".guidelines .swiper-slide").eq(index);
            $(".guidelines .swiper-slide").eq(index).find("a").attr("style","");//始终以样式表的初始值进行计算
            if (curPageObj.find(".endGuide").length != 0 && curPageObj.find(".goOn").length != 0) {
                var btn1 = curPageObj.find(".endGuide");
                var btn2 = curPageObj.find(".goOn");
                btn1.css({ "left": parseFloat(btn1.css("left").split("px")[0]) * aliveRate, "top": parseFloat(btn1.css("top").split("px")[0]) * aliveRate, "width": parseFloat(btn1.css("width").split("px")[0]) * aliveRate, "height": parseFloat(btn1.css("height").split("px")[0]) * aliveRate })
                btn2.css({ "left": parseFloat(btn2.css("left").split("px")[0]) * aliveRate, "top": parseFloat(btn2.css("top").split("px")[0]) * aliveRate, "width": parseFloat(btn2.css("width").split("px")[0]) * aliveRate, "height": parseFloat(btn2.css("height").split("px")[0]) * aliveRate })
            }
            else if (curPageObj.find(".goOn").length != 0) {
                var btn2 = curPageObj.find(".goOn");
                btn2.css({ "left": parseFloat(btn2.css("left").split("px")[0]) * aliveRate, "top": parseFloat(btn2.css("top").split("px")[0]) * aliveRate, "width": parseFloat(btn2.css("width").split("px")[0]) * aliveRate, "height": parseFloat(btn2.css("height").split("px")[0]) * aliveRate })
            }
            else if (curPageObj.find(".endGuide").length != 0) {
                var btn1 = curPageObj.find(".endGuide");
                btn1.css({ "left": parseFloat(btn1.css("left").split("px")[0]) * aliveRate, "top": parseFloat(btn1.css("top").split("px")[0]) * aliveRate, "width": parseFloat(btn1.css("width").split("px")[0]) * aliveRate, "height": parseFloat(btn1.css("height").split("px")[0]) * aliveRate })
            }
        }
        var guideSwiper = new Swiper('.swiper-container', {
            initialSlide: 0,
            loop: false,
            grabCursor: true,
            observer: true, //修改swiper自己或子元素时，自动初始化swiper 
            observeParents: true, //修改swiper的父元素时，自动初始化swiper  onTransitionEnd  onSlideChangeEnd 
            onTransitionEnd: function (swiper) {
                $(".guidelines .circleDiv ul li").removeClass("on");
                $(".guidelines .circleDiv ul li").eq(guideSwiper.activeIndex).addClass("on");
                areaClick(guideSwiper.activeIndex);
            }
        });
        areaClick(guideSwiper.activeIndex);
        if (!isiOS) {
            $(".guidelines .swiper-slide:nth-child(4) .guideStep,.guidelines .swiper-slide:nth-child(8) .guideStep").on("click", function () {
                guideSwiper.slideNext();
            })
        }
        if (isTablet) {
            $(".guideStep .goOn").on("touchend", function () {
                guideSwiper.slideNext();
            })
        }
        else {
            $(".guideStep .goOn").on("click", function () {
                guideSwiper.slideNext();
            })
        }
    }
    this.closeGuidelines = function () {
        $("body").find(".guidelines").remove();
    }

    //简易提示框
    this.openAlert = function (tip,callback) {
        var htmlStr = '<div class="alertWrap"><div class="alertModal" style="z-index:9999;"><div class="alertBody">';
        htmlStr += '<p>' + tip + '</p>';
        htmlStr += '<div class="alertFooter"><a class="save">确定</a></div>';
        htmlStr += '</div></div>';
        htmlStr += '<div class="backdrop"></div></div>';
        $("body").append(htmlStr);
        $(".alertModal .save").on("click", function (e) {
            if (typeof (callback) == "function") {
                callback();
            }
            $(this).parents(".alertModal").next().remove();
            $(this).parents(".alertModal").remove();
            $(".alertWrap").remove();
        })
    };

    //闪窗
    this.tipAlert = function (tip) {
        $("body").find(".transparentShadow").remove();
        var shtml = '<div class="transparentShadow"> <span class="disSelectedShadow">'+tip+'</span></div>';
        $("body").append(shtml);
        setTimeout(function () {
            $("body").find(".transparentShadow").fadeOut(500, function () {
                $("body").find(".transparentShadow").remove();
            });
        }, 800);
    };

    //询问弹框
    this.openConfirm = function (tip, callback, cancel) {
        var htmlStr = '<div class="alertModal"><div class="alertBody">';
        htmlStr += '<p>' + tip + '</p>';
        htmlStr += '<div class="alertFooter"><a class="cancel">取消</a><a class="save">确定</a></div>';
        htmlStr += '</div></div>';
        htmlStr += '<div class="backdrop"></div>';
        $("body").append(htmlStr);
        $('.alertModal .save').on("click", function () {
            if (typeof (callback) == "function") {
                callback();
            }
            $(this).parents(".alertModal").next().remove();
            $(this).parents(".alertModal").remove();
        });
        $(".alertModal .cancel").on("click", function (e) {
            if (typeof (cancel) == "function") {
                cancel();
            }
            $(this).parents(".alertModal").next().remove();
            $(this).parents(".alertModal").remove();
        })
    };
    /////////////////////////////////////////////////////////
    ///////////检测特殊字符//////////////////////////////////
    ///////////true:检测通过 false:包含特殊字符//////////////
    /////////////////////////////////////////////////////////
    this.RegeMatch = function (content) {
        var patrn = /[~!@#$%^&*+<>?:"{},\/;'[\]]/im;
        if (content != "" && content != null) {
            if (patrn.test(content)) {
                return false;
            } else {
                return true;
            }
        }
    };
    this.IntToCn = function (num) {
        switch (num) {
            case 2:
                return "一";
            case 3:
                return "二";
            case 4:
                return "三";
            case 5:
                return "四";
            case 6:
                return "五";
            case 7:
                return "六";
            case 8:
                return "七";
            case 9:
                return "八";
            case 10:
                return "九";
            default:

        }
    };


    this.CheckName = function (bookName) {
        var page = null;
        if (typeof (previewInit) != "undefined")
            page = previewInit;
        else if (typeof (addStandBookInit) != "undefined")
            page = addStandBookInit;
        else if (typeof (preLessonPageInit) != "undefined")
            page=preLessonPageInit;

        var subject = $.grep(page.SubjectList, function (value) {
            return bookName.indexOf(value.CodeName)!=-1;
        });
        if (subject!=null)
            return bookName.indexOf(subject[0].CodeName);
        else
            return -1;
    };
}

var commonFuncJS = new CommonFuncJS.Template.Management();