var AspxName = "LessonView";
var UserID = "";
var SubjectID = "";
var SesPageInit = [];//从SelectBook页面传过来的UserID,EditionID,SubjectID,GradeID,ClassID,BookID
var SelTeachingData = []; //查询页面初始化操作数据
var SelBookPageData = [];//备课保存水滴信息
var PageInitID = "";
var StartPage = [];//查询开始页(包含本页)
var PageList = [];//查询页的数组(包含)
var FirstUnitPID = "";//电子书第一单元ID
var FirstPageNum = "";//电子书首页
var AllSourceData = [];//默认+备课的水滴信息
var BookJson = "";//电子书页Json
var userInfoCls = "";//用户信息对象
var BookID = "";
///////////当前编辑的//////////////////
this.StageID = "";//学段ID
this.EditionID = "";//版本ID
this.BookReel = "";
this.GradeID = "";//年级ID
this.BookType = "";//教材类型
this.UnitID = "";//单元ID
var TeachingInit = function () {
    //Current.BookType = Common.QueryString.GetValue("BookType");
    //Current.BookReel = Common.QueryString.GetValue("BookReel");
    //Current.StageID = Common.QueryString.GetValue("StageID");
    //Current.GradeID = Common.QueryString.GetValue("GradeID");
    //Current.EditionID = Common.QueryString.GetValue("EditonID");
    //var p = getUrlParam('p');
    var UserInfo = getDataF("UserInfo");//用户信息JSON
    if (UserInfo == null) {
        window.location.href = "../../Login.aspx";
    }
    userInfoCls = UserInfo;
    var Current = this;
    this.ResourceList = "";
    this.CatalogList = "";
    this.DbJsonjs = "";
    this.JsonJS = "";
    this.PageNum = "";
    this.BookID = "";
    curUnitName = commonFuncJS.getDataF("curUnitName");
    this.Init = function () {
        BookID = getUrlParam("BookID");
        Current.BookID = BookID;
        Current.PageNum = parseInt(getUrlParam("page"));
        Current.SubjectID = parseInt(getUrlParam("SubjectID"));
        UserID = getUrlParam("UserID");
        BookJson = GetTextbookById();
        Current.JsonJS = BookJson;
        Current.UnitID = getUrlParam("CataID");
        Current.InitCatalog();
        ChangeTeachMap(Current.UnitID);
    };
    this.BindResourceClick = function () {
        $(".doubleInbox .imgIco3_Task").click(function () {
            var questionID = $(this).attr("hidsrc");
            var question = null;
            var BookInfoArr = commonFuncJS.getDataF("BookInfoArr");
            var html = 'AccessType=1&QuestionID=' + questionID + '&Round=1&BookID=' + BookID + '&SubjectID=' + Current.SubjectID;
            html += '&EditonID=' + BookInfoArr.EditionID + '&GradeID=' + BookInfoArr.GradeID + '&StageID=' + BookInfoArr.StageID + "&BookReel=" + BookInfoArr.BookReel + "&BookType=" + BookInfoArr.BookType;
            if (Current.SubjectID == 3) {
                arlDialogFullWin("../PreviewPage/English/QuestionModels.aspx?" + html);
            }
        });
    };
    this.InitCatalog = function () {
        //////////获取目录列表//////////
        Common.GetCatalogByBookId(Current.BookID, function (data) {
            var cataList = data; var t, e, uid;
            var boktp = Common.QueryString.GetValue('BookType');
            if ((cataList[0].title.toLowerCase().indexOf("unit") == -1 && Current.SubjectID == 3 || (Current.SubjectID != 3 && typeof (cataList[0].children) != undefined && typeof (cataList[0].children) != "undefined")) && Current.BookID != 580 && boktp != 5) {
                $.each(cataList, function (n, model) {
                    if (typeof (model.children) != "undefined") {
                        $.each(model.children, function (c, cata) {
                            t = cata.StartPage;
                            e = cata.EndPage;
                            uid = cata.id;
                            unitObject.push(t + "-" + e + "-" + uid + "-" + cata.title);
                        });
                    }
                });
            }
            else {
                $.each(cataList, function (u, unit) {
                    t = unit.StartPage;
                    e = unit.EndPage;
                    uid = unit.id;
                    unitObject.push(t + "-" + e + "-" + uid + "-" + unit.title);
                });
            }
        });
    };
};

var teachingInit;
$(function () {
    teachingInit = new TeachingInit();
    teachingInit.Init();
});

//用sessionStorage取数据
function getDataF(key) {
    // 取值时：把获取到的Json字符串转换回对象 
    var data = sessionStorage.getItem(key);
    //console.log(sessionStorage.getItem(key));
    var dataObj = JSON.parse(data);
    //console.log(dataObj.name); //输出
    return dataObj;
};
//格式化时间
function getNowFormatDate() {
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
//生成Guid
function GetGuid() {
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
//点击单元或左右翻页时或左右滑动时调用操作记录更新函数
//function Update(UnitID, PageStart) {
//    var CreateTime = getNowFormatDate();
//    teachLessonManage.UpdateTeachingData(UserID, SesPageInit.EditionID, SesPageInit.SubjectID, SesPageInit.GradeID, SesPageInit.ClassID, BookID, UnitID, PageStart, AspxName, CreateTime);
//};

//查询备课水滴
function SelWaterData(StartPage) {
    var pageArr = [];//备课表中缺少的水滴的页码
    var PreContent = "";//水滴中的Json
    var Btns = [];//水滴中所有按钮信息
    var water = [];
    var start = StartPage.length;//2
    var cookies = [];
    var cookieJson1 = isHasSession(StartPage[0]);
    var cookieJson2 = isHasSession(StartPage[1]);
    if (cookieJson1 != null) {
        cookies.push(cookieJson1);
    }
    else {
        var dbWat = preLessonManagement.GetUserPressonJsonByWhere(UserID, BookID, StartPage[0]);
        if (dbWat != null && dbWat != "") {
            var dbWatD = dbWat;
            if (JSON.parse(dbWatD).pageNum == undefined) {
                cookies.push(JSON.parse(dbWatD)[0]);
            } else {
                cookies.push(dbWatD);
            }
        }
    }
    if (cookieJson2 != null) {
        cookies.push(cookieJson2);
    }
    else {
        var dbWat = preLessonManagement.GetUserPressonJsonByWhere(UserID, BookID, StartPage[1]);
        if (dbWat != null && dbWat != "") {
            var dbWatD = dbWat;
            if (JSON.parse(dbWatD).pageNum == undefined) {
                cookies.push(JSON.parse(dbWatD)[0]);
            } else {
                cookies.push(dbWatD);
            }
        }
    }
    $.each(cookies, function (i, item) {
        if (item != "") {
            water.push(item);
        }
    });
    if (water.length != 0) {
        $.each(water, function (wd, wadata) {
            PreContent = wadata;
            var btnsObj = "";
            btnsObj = JSON.parse(PreContent);
            Btns = btnsObj.btns;
            var idUrl = [];
            $.each(Btns, function (b, btns) {
                if (btns.icoType == "10") {//判断类型是不是PPT
                    var sourceUrl = btns.sourceUrl;
                    var ID = sourceUrl;
                    var url = Constant.file_Url + "Preview.ashx";
                    var datep = new Date();
                    var Year = datep.getFullYear();
                    var Month = datep.getMonth()+1;
                    var Date1 = datep.getDate();
                    var time = Year + "-" + Month + "-" + Date1;
                    var pptFileName = btns.title + "-" + curUnitName + "-" + time;
                    pptFileName = Common.ClearString(pptFileName);
                    GetPreviewUrl(ID, "PPT", url, function (data) {
                        var filePath = data.URL;
                        if (data.URL == "") {
                            var url1 = Constant.webapi_Url + "ResourcePreview/" + ID;
                            $.getJSON(url1, function (data) {
                                filePath = data;
                                var f = filePath.split(".");
                                var fsd = f[f.length - 1];
                                var str = ID + '.' + fsd;
                                var obj = [];
                                obj = { ID: ID, fileUrl: filePath, FileName: pptFileName, isLessonView: "LessonView" };
                                var idstr = [];                                
                                idstr.push(obj);
                                if (idstr != []) {
                                    var b = JSON.stringify(idstr);
                                    if (typeof callHostFunction != "undefined") {
                                        callHostFunction.downLoadFile(b);
                                        officeFileInfo.push(obj);
                                        idstr = [];
                                    }
                                }
                            });
                        }
                        else {
                            var f = filePath.split(".");
                            var fsd = f[f.length - 1];
                            var str = ID + '.' + fsd;
                            var obj = [];
                            obj = { ID: ID, fileUrl: filePath, FileName: pptFileName, isLessonView: "LessonView"
                        };
                            officeFileInfo.push(obj);
                            var idstr = [];
                            idstr.push(obj);
                            if (idstr != []) {
                                var b = JSON.stringify(idstr);
                                if (typeof callHostFunction != "undefined") {
                                    officeFileInfo.push(obj);
                                    callHostFunction.downLoadFile(b);
                                    idstr = [];
                                }
                            }
                        }
                    });
                }
            });
        });
    }
    return water;
};
//下一页中是否有COOKIE,有则返回json数据
function isHasCookieVw(PageId) {
    var curJsonInfo = getCookie(PageId);
    return curJsonInfo;
}
//下一页中是否有Session,有则返回json数据
function isHasSession(nextPageId) {
    var curJsonInfo = sessionS.get(nextPageId);
    return curJsonInfo;
}

//获取电子书页配置JS
function GetTextbookById() {
    //BookJson = teachLessonManage.GetTextbookById(SesPageInit.BookID);
    BookJson = Constant.resource_Url + "TextBookHandler.ashx?OP=getDBjs&BookID=" + BookID;
    //BookJson = preLessonManagement.GetPageJsByBookID(BookID);
    return BookJson;
};

//返回Url中参数值
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
};



//function OpenPPT(ID) {
//    callHostFunction.openPPT(ID);
//};
