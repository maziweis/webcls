var UserID = "";//用户Guid
var SubjectID = "";//科目ID
var AspxName = "SelectBook";
var PageInitList = [];//用户的操作数据
var PageInitList1 = [];//用户的操作数据备份
var CreateTime = "";//当前时间
var UserAccount = "";//用户账号
var UserInfoJson = "";//用户信息Json
var UserInfo = "";//用户信息
var SelectBookType = "";//选择的教材大类(同步，教辅，特色)
var SelectTSType = "";//选择特色教材类型(拼读，漫画。。)
var SelectTSStage = 0;//选择特色教材年段
var Token = "";//优教学Token
var AddEleBookInit = function () {
    var Current = this;
    this.BookTypeList = null;//教材类型列表    
    this.SubjectList = null;//科目列表
    this.GradeList = null;//年级列表
    this.EditionList = null;//版本列表
    PageInitList = null;//用户操作记录
    this.UserStandBook = null;//用户的教材
    this.UserInfoList = null;   //年级班级名称列表
    this.userClass = null;
    this.SelectGradeID = "";//选择的年级ID
    this.SelectSubjectID = "";//选择的科目ID
    this.SelectEditionID = "";//选择的版本ID
    //记录是否从智慧校园进入
    this.Type = null;
    this.T = "";

    this.Init = function () {
        var IP = $("#requestip").html();
        Current.Type = Common.QueryString.GetValue('type');
        Current.T = Common.QueryString.GetValue('t');
        Current.UserInfoList = commonFuncJS.CheckLogin(IP);
        Current.userClass = Current.UserInfoList.userClass;
        UserID = Current.UserInfoList.Id;
        Token = Current.UserInfoList.Token;
        Common.CodeAjax("do.jsonp", "SUB", function (data) {
            Current.SubjectList = data["SUB"];
            ///////////获取用户的操作数据/////////////
            PageInitList = teachLessonManage.SelectInitData(UserID, AspxName);
            PageInitList1 = PageInitList;
            ////////////获取用户的教材数据/////////////
            Current.UserStandBook = teachLessonManage.GetUserStandBook(UserID);
            ////////////初始化班级//////////////
            Current.InitClassList();
            //////////加载科目下拉框/////////////////
            if (Current.UserStandBook == null) {
                $(".searchList.beikeList").hide();
                $(".teachList").hide();
                $(".comingSoon").show();
            } else {
                $(".searchList.beikeList").show();
                $(".comingSoon").hide();
                //加载教材大类切换
                Current.InitStandBookTypeList();
            };
            //Current.InitSubjectList();
        });
    };
    /////////////////////////////////////////
    //////////加载教材大类切换///////////////
    /////////////////////////////////////////
    this.InitStandBookTypeList = function () {
        Common.CodeAjax("do.jsonp", "JCLX", function (data) {
            Current.BookTypeList = data["JCLX"];
            var html = '<li id="0" class="allType"><i></i><label>全部教材</label></li>';
            $.each(Current.BookTypeList, function (n, type) {
                html += '<li id="' + type.id + '"';
                if (type.id == 1) {
                    html += ' class="tongbu">';
                }
                else if (type.id == 2) {
                    html += ' class="fudao">';
                }
                else if (type.id == 3) {
                    html += ' class="tese">';
                }
                html += '<i></i><label>' + type.title + '</label></li>';
            });
            $(".bookParentType").html(html);
            //////////////////绑定切换事件///////////////////
            $(".bookParentType li").on("click", function () {
                //$(".bottomType li[class='tongbu']").on("click", function () {
                $(this).parents(".bookParentType").find("li").removeClass("on");
                $(this).addClass("on");
                SelectBookType = $(this).attr("id");
                //Current.InitSubjectList();//加载版本列表 
                Current.InitStandBookList();//加载教材列表
            });
            if (PageInitList != null && PageInitList.length != 0) {
                var id = PageInitList[0].BookType;
                if (id > 3) {
                    id = 3;
                };
                if (id == null) {
                    id = 0;
                }
                $(".bookParentType li")[id].click();
            }
            else {
                $(".bookParentType li")[0].click();
            }
        });
    };
    
    /////////////////////////////////////////
    //////////加载教材列表///////////////////
    /////////////////////////////////////////
    this.InitStandBookList = function () {
        //////////////////////获取MOD教材数据/////////////
        Common.GetSBListByStages(0, Current.SelectGradeID, Current.SelectSubjectID, 0, Current.SelectEditionID, function (data) {
            //var html = '<li class="addBook"><a id="btnAddBook" href="javascript:void(0)"><i></i><br />添加教材</a></li>';
            var html = '';
            var standbooklist = data.Data;
            var bookTypeName = "";
            standbooklist.sort(commonFuncJS.CreateDescCompact("Booklet"));
            if (Current.UserStandBook != null) {
                $.each(standbooklist, function (b, book) {
                    $.each(Current.UserStandBook, function (u, ubook) {
                        if (book.ID == ubook.BookID) {
                            var img = Constant.resource_Url;
                            if (typeof (book.BookCover) != "undefined") {
                                img += book.BookCover;
                            }
                            else {
                                img += "TextBookHandler.ashx?OP=getImg&BookID=" + book.ID;
                            };
                            var dsd = book.BooKName.indexOf("年级");
                            if (dsd == -1) {
                                dsd = book.BooKName.length + 1;
                            }
                            var index = 0;
                            var subject = $.grep(Current.SubjectList, function (value) {
                                return book.BooKName.indexOf(value.CodeName) != -1;
                            });
                            if (subject != null)
                                index = book.BooKName.indexOf(subject[0].CodeName) + subject[0].CodeName.length;
                            else
                                index= - 1;                            
                            var name1 = "", name2 = "";
                            name1 = book.BooKName;
                            if (book.BooKName.indexOf("攀登") != -1) {
                                name1 = "攀登英语阅读系列";
                                name2 = book.AgeRange + "岁";
                            } else if (book.BooKName.indexOf("拼读") != -1) {
                                name1 = "自然拼读";
                                name2 = book.AgeRange + "岁";
                            } else if (book.BooKName.indexOf("电影") != -1) {
                                name1 = book.BooKName;                               
                                name2 = commonFuncJS.IntToCn(book.Grade) + "年级";
                                if (book.Grade == 0) {
                                    name2 = "";
                                }
                            } else {
                                name1 = book.BooKName.substring(0, index);
                                name2 = book.BooKName.substring(index, book.BooKName.length);
                            }
                            var datajg = "\" EditionID='" + ubook.EditionID + "' SubjectID='" + ubook.SubjectID + "' GradeID='" + ubook.GradeID + "' BookType='" + ubook.BookType + "' BookID=" + book.ID + '><a><img src=' + img + ' /><h4>' + name1 + '</h4><p>' + name2 + '</p><span><i></i>';
                            //特色教材
                            if (SelectBookType == 0) {
                                switch (ubook.BookType) {
                                    case 1:
                                        html += "<li class=\"tongbuList";
                                        bookTypeName = "同步教材";
                                        break;
                                    case 2:
                                        html += "<li class=\"fudaoList";
                                        bookTypeName = "教材辅导";
                                        break;
                                    default:
                                        html += "<li class=\"teseList";
                                        bookTypeName = "特色教材";
                                        break;
                                }
                                html += datajg + bookTypeName + '</span></a></li>';
                            }
                                //同步
                            else if (ubook.BookType == SelectBookType && SelectBookType == 1) {
                                html += "<li class=\"tongbuList";
                                bookTypeName = "同步教材";
                                html += datajg + bookTypeName + '</span></a></li>';
                            }
                                //教辅
                            else if (ubook.BookType == SelectBookType && SelectBookType == 2) {
                                html += "<li class=\"fudaoList";
                                bookTypeName = "教材辅导";
                                html += datajg + bookTypeName + '</span></a></li>';
                            }
                                //特色教材
                            else if (ubook.BookType >= SelectBookType && SelectBookType == 3) {
                                html += "<li class=\"teseList";
                                bookTypeName = "特色教材";
                                html += datajg + bookTypeName + '</span></a></li>';
                            }                           
                        }
                    });
                });
                //if (html != '<li class="addBook"><a id="btnAddBook" href="javascript:void(0)"><i></i><br />添加教材</a></li>') {
                //    $(".searchList.beikeList").show();
                //    //$(".comingSoon").hide();
                //    $("#divStandBookToSelect").html(html);
                //} else {
                if (PageInitList1.BookType == SelectBookType) {
                    $(".bottomType").find("li").removeClass("on");
                    $(".bottomType li[id=0]").addClass("on");
                    SelectBookType = 0;
                    Current.InitStandBookList();
                }
                $("#divStandBookToSelect").html(html);
                //$(".searchList.beikeList").hide();
                //$(".comingSoon").show();
                //}
                ////////////////添加教材跳转按钮//////////////////
                $("#btnAddBook").unbind("click");
                $("#btnAddBook").click(function () {
                    var book_type = 0;
                    if (SelectBookType == 0)
                        book_type = 1;
                    else
                        book_type = SelectBookType;
                    if (Current.Type != null)
                        location.href = "../../PreLesson/Page/AddStandBook.aspx?page=SelectBook&BookType=" + book_type + "&type=" + Current.Type + "&t=" + Current.T;
                    else
                        location.href = "../../PreLesson/Page/AddStandBook.aspx?page=SelectBook&BookType=" + book_type;
                });
                PageInitList = null;
                selBook();
            }
            autoMarginList();
        })
    };
    /////////////////////////////////////////
    //////////加载班级列表///////////////////
    /////////////////////////////////////////
    this.InitClassList = function () {
        var html = "";
        if (Current.userClass.length != 0) {
            Current.userClass.sort(commonFuncJS.CreateDescCompact("GradeID"));
            $.each(Current.userClass, function (c, clas) {
                html += "<li classid=" + clas.ClassID + " gradeid=" + clas.GradeID + ">"+clas.ClassName + "</li>";
            });
        }
        $("#divClassToSelect").html(html);
        changeClass();
        if (PageInitList != null && PageInitList.length != 0) {
            $("#divClassToSelect li").removeClass("on");
            $("#divClassToSelect li[classid=" + PageInitList[0].ClassID + "]").addClass("on");
        }
        else {
            $("#divClassToSelect li").removeClass("on");
            $("#divClassToSelect li:first").addClass("on");
        }
        $(".fixedLeft .h3 span").html($("#divClassToSelect li.on").html());
    };
};

var addEleBookInit;
$(function () {
    addEleBookInit = new AddEleBookInit();
    addEleBookInit.Init();
});

//用sessionStorage储存数据
function setDataF(key, value) {
    // 存储值：将对象转换为Json字符串 
    sessionStorage.setItem(key, JSON.stringify(value));
};
//用sessionStorage取数据
function getDataF(key) {
    // 取值时：把获取到的Json字符串转换回对象 
    var data = sessionStorage.getItem(key);
    //console.log(sessionStorage.getItem(key));
    var dataObj = JSON.parse(data);
    //console.log(dataObj.name); //输出
    return dataObj;
};
//获取cookie
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}
//点击开始上课按钮
function GetContent() {
    CreateTime = getNowFormatDate();
    var EditionID = $("#divStandBookToSelect .select").attr("EditionID");
    var SubjectID = $("#divStandBookToSelect .select").attr("SubjectID");
    var GradeID = $("#divStandBookToSelect .select").attr("GradeID");
    var BookID = $("#divStandBookToSelect .select").attr("BookID");
    var ClassID = $("#divClassToSelect .on").attr("classid");
    var ClassName = $("#divClassToSelect .on").html();
    var BookType = $(".bookParentType .on").attr("id");
    var PDBookType = $("#divStandBookToSelect .select").attr("booktype");
    var Stage = SelectTSStage;
    if (PageInitList1 != null && PageInitList1.length != 0) {
        teachLessonManage.UpdateInitData(UserID, EditionID, SubjectID, GradeID, BookType, Stage, ClassID, BookID, AspxName, CreateTime);//更新用户操作数据
    }
    else {
        var PageInitID = GetGuid();
        teachLessonManage.SaveInitData(PageInitID, UserID, EditionID, SubjectID, GradeID, BookType, Stage, ClassID, BookID, AspxName, CreateTime);//第一次使用时保存用户操作数据
    };
    var PageInit = { UserID: UserID, EditionID: EditionID, SubjectID: SubjectID, GradeID: GradeID, BookType: BookType, Stage: Stage, ClassID: ClassID, BookID: BookID };//将基本信息放入Session
    setDataF("PageInit", PageInit);
    var userInfoCls = getDataF('UserInfo');
    var BookName = $("#divStandBookToSelect .select p").html();
    var obj = { ClassID: ClassID, BookName: BookName };
    var objJson = JSON.stringify(obj);
    //记录用户上课操作
    teachLessonManage.SaveOperData(userInfoCls.Id, userInfoCls.Type, Constant.OperType.StartTeach_TYPE, objJson);
    var pagetype = '';   
    if (PDBookType == 6) {
        pagetype = 'AttLesson/Page/TeachingTS.aspx?';
    }
    else
        pagetype = 'page/index.html?';
    var param = "BookID=" + BookID + "&UserID=" + UserID + "&EditionID=" + EditionID + "&SubjectID=" + SubjectID + "&GradeID=" + GradeID + "&ClassID=" + ClassID + "&BookType=" + BookType;
    commonFuncJS.UpdateStanBookUsingTime(UserID, BookID);
    //调用安卓上课函数
    var isEk = $(".disableEk").html();
    if (typeof WebViewJavascriptBridge != "undefined") {
        if (typeof isEk == "undefined") {
            var webUrlS = Constant.webapi_Url;
            var accountS = Token;
            var passwordS = "Token";
            var apiName = 'Students/';
            var gradeName = ClassID == -1 ? "公共年级" : ClassName.substring(0, 3);
            var clsName = ClassID == -1 ? "公共班级" : ClassName.substring(3);
            param = pagetype + param + "&DXTP=true";
            var data = { account: accountS, password: passwordS, webUrl: webUrlS, apiName: apiName, classID: ClassID, param: param, ClassName: ClassName, gradeName: gradeName, clsName: clsName };
            commonFuncJS.setDataF("DXTP", "true");
            window.WebViewJavascriptBridge.callHandler(
                'startAPP'
                , data
                , function (responseData) {
                    var isSucced = responseData.scuss;
                    if (isSucced) {
                        //alert(isSucced);

                    }
                    else {
                    }
                }
            );
        }
        else {
            if (PDBookType == 6) {
                window.location.href = "../Page/TeachingTS.aspx?" + param;
            }
            else {
                window.location.href = "../../../page/index.html?" + param;
            }
        }
    }
    else {
        if (PDBookType == 6) {
            window.location.href = "../Page/TeachingTS.aspx?" + param;
        }
        else {
            window.location.href = "../../../page/index.html?" + param;
        }
    }
}

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

//根据窗口宽度计算li的右边距
function autoMarginList() {
    var winW = $(window).width();
    var contentW = $(".content").width();
    var liW = $(".content li").width();
    if (winW > 1024) {
        var marginR = (winW * 0.98 - liW * 4 - winW * 0.02 - 18) / 3;
        $(".content li").css("margin-right", marginR);
    }
    else {
        var marginR = (winW * 0.98 - liW * 3 - winW * 0.02 - 18) / 2;
        $(".content li").css("margin-right", marginR);
    }

}

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

function selBook() {
    $("#divStandBookToSelect li").click(function () {
        if (!$(this).hasClass("addBook")) {
            $("#divStandBookToSelect li").removeClass("select");
            $(this).addClass("select");
            GetContent();
        }
    })
}
//班级选中事件
function changeClass() {
    //$(".fixedLeft ul li").on("click", function () {
    //    $(this).parent().find("li").removeClass("on");
    //    $(this).addClass("on");
    //})
    $(".fixedLeft .top ul li").on("click", function () {
        var txt = $(this).text();
        $(this).parents(".h3").find("span").text(txt);
        $(this).parents(".h3").find("li").removeClass("on");
        $(this).addClass("on");
    })
}

$(window).resize(function () {
    autoMarginList();
})

