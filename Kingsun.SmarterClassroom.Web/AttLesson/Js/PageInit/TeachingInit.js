var AspxName = "Teaching";
var UserID = "";
var SubjectID = "";
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
var InitPage = "";//用户操作记录初始化电子书页
var TeachingInit = function () {
    var UserInfo = commonFuncJS.getDataF("UserInfo");//用户信息JSON
    if (UserInfo == null || UserInfo.length == 0) {
        window.location.href = "../../Login.aspx";
    }
    userInfoCls = UserInfo;
    var Current = this;
    this.BookID = "";
    this.EditionID = "";
    this.SubjectID = "";
    this.GradeID = "";
    this.ClassID = "";
    this.InitCatalog = null;//目录列表    
    Current.BookID = Common.QueryString.GetValue('BookID');//获取BookID
    Current.EditionID = Common.QueryString.GetValue('EditionID');//获取EditionID
    Current.SubjectID = Common.QueryString.GetValue('SubjectID');//获取SubjectID
    Current.GradeID = Common.QueryString.GetValue('GradeID');//获取GradeID
    Current.ClassID = Common.QueryString.GetValue('ClassID');//获取ClassID
    UserID = Common.QueryString.GetValue('UserID');
    //Current.BookID = 168;//////////////正式版删除
    this.CatalogList = "";
    this.DbJsonjs = "";
    this.JsonJS = "";
    this.PageNum = "";
    this.UnitID = "";
    this.CurTeachMap = "";
    this.Init = function () {
        //查询页面初始化操作数据
        SelTeachingData = teachLessonManage.SelectTeachingData(UserID, Current.BookID, Current.ClassID, AspxName);
        if (SelTeachingData != null && SelTeachingData.length!=0) {
            Current.PageNum = SelTeachingData[0].PageNum;
            Current.UnitID = SelTeachingData[0].UnitID;
        }
        else {
            Current.PageNum = -100;
            Current.UnitID = -1;
        };
        Current.InitCatalog();
        $(".goback").click(function () {
            var pageT = Common.QueryString.GetValue('page');
            if (pageT.indexOf("IndexPage") == -1) {
                window.location.href = "SelectBook.aspx";
            }
            else {
                window.location.href = "../../Index.aspx";
            }
        });
        BookJson = GetTextbookById();
        Current.JsonJS = BookJson;
    };
    
    this.InitTeachMap = function () {
        //Current.CurTeachMap = teachLessonManage.GetCurTeachMap('b9010443-6ac9-465a-98b8-1970169855c9', 266, 282796);
        //授课页面初始化获取教学地图数据
        Current.CurTeachMap = teachLessonManage.GetCurTeachMap(UserID, Current.BookID, Current.UnitID);
        setupMapList(Current.CurTeachMap);
    }
    this.InitCatalog = function () {
        //////////获取目录列表//////////
        Common.GetCatalogByBookId(Current.BookID, function (data) {            
            var cataList = data;
            var ifInitFirst = false;
            var InitFirst = $("#InitFirstCata").html().split(",");
            if ($.inArray(Current.BookID, InitFirst) == -1) {
                ifInitFirst = true;
            }
            if (Current.UnitID == -1 || Current.UnitID == null) {
                var BookType = Common.QueryString.GetValue("BookType");
                if ((cataList[0].children != undefined && cataList[0].children.length != 0 && cataList[0].children[0].title.toLowerCase().indexOf("unit") != -1) || cataList[0].children != undefined && cataList[0].children.length != 0 && Current.SubjectID != 3 && BookType != 5 && ifInitFirst)
                    Current.UnitID = cataList[0].children[0].id;
                else
                    Current.UnitID = cataList[0].id;
            }
            Current.InitTeachMap();
            ///////////////加载目录列表////////////////////           
            var html = "";
            var boktp = Common.QueryString.GetValue('BookType');
            if ((cataList[0].title.toLowerCase().indexOf("unit") == -1 && Current.SubjectID == 3 || (Current.SubjectID != 3 && typeof (cataList[0].children) != undefined && typeof (cataList[0].children) != "undefined")) && ifInitFirst && boktp != 5) {///////////检查是否为Modul
                $.each(cataList, function (n, model) {
                    html += '<li id="' + model.id + '" class="module" pagestart="' + model.StartPage + '" pageend="' + model.EndPage + '">' + model.title + '</li>';
                    if (typeof (model.children) != "undefined") {
                        $.each(model.children, function (c, cata) {
                            if (n == 0) {
                                FirstUnitPID = Current.UnitID;
                                FirstPageNum = Current.PageNum;
                            }
                            html += '<li id="' + cata.id + '" class="unitclass" pagestart="' + cata.StartPage + '" pageend="' + cata.EndPage + '">' + cata.title + '</li>';
                        });
                    }
                });
            }
            //else if (cataList.length == 1 && cataList[0].title.indexOf("Chapter")!=-1) {///////////检查是否为Part
            //    $.each(cataList, function (u, unit) {
            //        if (u == 0) {
            //            FirstUnitPID = Current.UnitID;
            //            FirstPageNum = Current.PageNum;
            //        }
            //        html += '<li id="' + unit.id + '" class="module" pagestart="' + unit.StartPage + '" pageend="' + unit.EndPage + '">' + unit.title + '</li>';
            //    });
            //    var pagelist = [];
            //    for (var i = parseInt(cataList[0].StartPage) ; i <= cataList[0].EndPage; i++) {
            //        pagelist.push(i);
            //    }
            //    $.each(pagelist, function (p, page) {
            //        if (p == 0)
            //            html += '<li id="' + page + '" class="on"><a href="javascript:void(0)" hidPage="' + page + '" onClick="changePage(this)">第' + page + '页</a></li>';
            //        else
            //            html += '<li id="' + page + '" ><a href="javascript:void(0)" hidPage="' + page + '" onClick="changePage(this)">第' + page + '页</a></li>';
            //    });
            //}
            else {
                $.each(cataList, function (u, unit) {
                    if (u == 0) {
                        FirstUnitPID = Current.UnitID;
                        FirstPageNum = Current.PageNum;
                    }
                    html += '<li id="' + unit.id + '" class="unitclass" pagestart="' + unit.StartPage + '" pageend="' + unit.EndPage + '">' + unit.title + '</li>';
                });
            }
            $("#unitList").html(html);
            //////////////绑定目录选中事件//////////////////////
            initTree();
            //用户第一次使用默认保存一次数据(当前第一单元第一页)
            if (SelTeachingData == null || SelTeachingData.length == 0) {
                var unitname = $(".highlight").text();
                var CreateTime = commonFuncJS.getNowFormatDate();
                PageInitID = commonFuncJS.GetGuid();
                teachLessonManage.SaveTeachingData(PageInitID, UserID, Current.EditionID, Current.SubjectID, Current.GradeID, Current.ClassID, Current.BookID, FirstUnitPID, FirstPageNum, AspxName, CreateTime, unitname);
            }
            else
            curUnitName = SelTeachingData[0].UnitName;
        });
    };
    this.BindResourceClick = function () {
        $(".doubleInbox .imgIco3_Task").click(function () {
            var questionID = $(this).attr("hidsrc");
            var question = null;
            var BookInfoArr = commonFuncJS.getDataF("BookInfoArr");
            var html = 'AccessType=1&QuestionID=' + questionID + '&Round=1&BookID=' + Current.BookID + '&SubjectID=' + Current.SubjectID;
            html += '&EditonID=' + BookInfoArr.EditionID + '&GradeID=' + BookInfoArr.GradeID + '&StageID=' + BookInfoArr.StageID + "&BookReel=" + BookInfoArr.BookReel + "&BookType=" + BookInfoArr.BookType;
            if (Current.SubjectID == 3) {
                arlDialogFullWin("../../PreLesson/PreviewPage/English/QuestionModels.aspx?" + html);
            }
        });
    };
};

var teachingInit;
$(function () {
    teachingInit = new TeachingInit();
    teachingInit.Init();
});



//点击单元或左右翻页时或左右滑动时调用操作记录更新函数
function Update(UnitID, PageStart, UnitName) {
    var CreateTime = commonFuncJS.getNowFormatDate();
    teachLessonManage.UpdateTeachingData(UserID, teachingInit.EditionID, teachingInit.SubjectID, teachingInit.GradeID, teachingInit.ClassID, teachingInit.BookID, UnitID, PageStart, AspxName, CreateTime, UnitName);
}
var Resources;

//查询备课水滴
function SelWaterData(StartPage) {
    var reNum = 0;
    Resources = [];
    var pageArr = [];//备课表中缺少的水滴的页码
    var WaterData = [];//所有水滴数据
    var PreContent = "";//水滴中的Json
    var Btns = [];//水滴中所有按钮信息
    var start = StartPage.length;//2
    //备课表中水滴数据
    SelBookPageData = teachLessonManage.SelBookPageData(UserID, teachingInit.BookID, StartPage);
    if (SelBookPageData == null || SelBookPageData == "") {
        $.each(StartPage, function (p, page) {
            pageArr.push(page);
        });
        //从智慧教室查询备课表中缺少的默认水滴
        WaterData = JSON.parse(teachLessonManage.GetTextBookResource(teachingInit.BookID, pageArr));
    }
    else if (SelBookPageData.length == StartPage.length) {

    }
    else {
        var pageArr1 = [];//备课表中有水滴的页码
        //将备课表中有的页码放到数组
        $.each(SelBookPageData, function (p, page) {
            pageArr1.push(page.Page);
        })
        $.each(StartPage, function (p, page) {
            if (pageArr1.indexOf(page) == -1) {
                pageArr.push(page);
            }
        });
        //从智慧教室查询备课表中缺少的默认水滴
        WaterData = JSON.parse(teachLessonManage.GetTextBookResource(teachingInit.BookID, pageArr));
    }
    if (SelBookPageData != null && SelBookPageData.length != 0 && SelBookPageData != "") {
        $.each(SelBookPageData, function (w, water) {
            WaterData.push(water.PreLessonContent);
        });
    };
    var WaterData1 = [];
    if (WaterData != null) {
        $.each(WaterData, function (wd, wadata) {
            if (wadata != "" && wadata != "null" && wadata != null) {
                WaterData1.push(wadata);
            }
        });
    }
    else { return ""; }
    if (WaterData1.length == 0) { return ""; }
    if (curUnitName == "" ) {
        if(SelTeachingData.length != 0)
            curUnitName = SelTeachingData[0].UnitName;
        else {
            if (Common.QueryString.GetValue("SubjectID")==3)
                curUnitName = "Unit 1";
            else
                curUnitName = "第一单元";
    }
    }
   
    $.each(WaterData1, function (wd, wadata) {
        PreContent = wadata;
        var btnsObj = "";
        btnsObj = JSON.parse(PreContent);
        Btns = btnsObj.btns;

        $.each(Btns, function (b, btns) {
            var exercises = [];
            var i = 0;
            if (btns.icoType == "27_1") {
                reNum++;
                var sourceUrl = btns.sourceUrl;
                var ID = sourceUrl;
                var url = Constant.file_Url + "Preview.ashx";
                GetPreviewUrl(ID, "Other", url, function (data) {
                    var img = Constant.file_Url + "GetFileImg.ashx?fileID=" + ID + "&view=true";
                    var filePath = data.URL;
                    var obj = [];
                    obj = { ID: ID, fileUrl: filePath, img: img };
                    Resources.push(obj);
                    if (reNum == Resources.length) {
                        reNum = 0;
                        Resources = JSON.stringify(Resources);
                        var ifExist = teachLessonManage.SelExercises(UserID);
                        if (ifExist != null && ifExist.length != 0) {
                            teachLessonManage.UpdateExercises(UserID, Resources);
                        }
                        else {
                            teachLessonManage.InsertExercises(UserID, Resources);
                        }
                    }
                });
            }
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
                            pptFileName = Common.ClearString(pptFileName);
                            obj = { ID: ID, fileUrl: filePath, FileName: pptFileName };
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
                        pptFileName = Common.ClearString(pptFileName);
                        obj = { ID: ID, fileUrl: filePath, FileName: pptFileName };
                        var idstr = [];
                        idstr.push(obj);
                        if (idstr != []) {
                            var b = JSON.stringify(idstr);
                            if (typeof callHostFunction != "undefined") {
                                var ifdown = callHostFunction.downLoadFile(b);
                                officeFileInfo.push(obj);
                                idstr = [];
                            }
                        }
                    }
                });
            }
        });
    });
    var re = Resources;
    return WaterData1;
};


//获取电子书页配置JS
function GetTextbookById() {
    BookJson = Constant.resource_Url + "TextBookHandler.ashx?OP=getDBjs&BookID=" + teachingInit.BookID;
    return BookJson;
};

