var AspxName = "Index";
var PageInitList = "";//获取用户的操作数据
var UserID = "";
var IndexInit = function () {
    var Current = this;
    this.UserID = "";
    this.User = null;
    this.Type = null;
    this.T = "";
    this.userClass = null;
    this.PageInitList = [];//用户的操作数据
    this.Init = function () {
        var IP = $("#requestip").html();
        Current.UserInfoList = commonFuncJS.CheckLogin(IP);
        var IsFirstLogin = commonFuncJS.getDataF('IsFirstLogin');
        if (IsFirstLogin == null) {//如果是从登陆进到这个页面
            if (Current.UserInfoList.IsFirstLogin) {
                commonFuncJS.setDataF("IsFirstLogin", 0);
                if (Current.UserInfoList.Type !== 26) {
                    commonFuncJS.openGuidelines();
                }
                $.ajax({
                    type: "post",
                    url: Constant.webapi_Url + "ChangeIsLogin/" + Current.UserInfoList.Id,
                    async: true,
                    success: function (response) {

                    },
                    error: function (request, status, error) {

                    }
                });
            }
        }
        Current.userClass = Current.UserInfoList.userClass; 
        Current.User = commonFuncJS.CheckLogin(IP);
        if (Current.User == null) {
            return false;
        }        
        Current.UserID = Current.User.Id;
        UserID = Current.User.Id;
        Current.Type = getUrlParam('type');
        Current.T = getUrlParam('t');
        $.ajax({
            type: "GET",
            url: Constant.webapi_Url + "GetAvatarByIdTch/" + UserID,
            dataType: "json",
            async: true,
            success: function (response) {
                if (response != null)
                    $(".userName img").attr("src", response + "?random=" + Math.random());
            },
            error: function (request, status, error) {
                //alert("请求失败！提示：" + status + error);
            }
        });
        ///////////获取用户的操作数据/////////////
        PageInitList = teachLessonManage.SelectInitData(Current.UserID, AspxName);
        Current.InitUserUsingBook();
        Current.InitClassList();
    };
    this.InitUserUsingBook = function () {
        var booklist = preLessonManagement.GetBookListForTop(Current.UserID);
        var html = "";
        //////////////////////获取MOD教材数据/////////////
        Common.GetSBListByStages(0,0,0, 0, 0, function (data) {
            var html = "";
            var standbooklist = data.Data;
            if (booklist!=null&&booklist.length != 0) {
                $(".bookList").show();
                $(".moreTeachingRec").show();
                $(".comingSoon").hide();
                $.each(booklist, function (b, book) {
                    var model = $.grep(standbooklist, function (value) {
                        if (value.ID == book.BookID) {
                            return value;
                        }
                    });
                    if (model.length!=0) {
                        var img = Constant.resource_Url;
                        if (typeof (model[0].BookCover) != "undefined")
                            img += model[0].BookCover
                        else
                            img += "TextBookHandler.ashx?OP=getImg&BookID=" + model[0].ID
                        html += '<li' + " EditionID=" + model[0].Edition + " SubjectID=" + model[0].Subject + " GradeID=" + model[0].Grade + " BookType=" + model[0].BookType + " BookID=" + model[0].ID + " Stage=" + model[0].Stage + '><em></em><img src="' + img + '" /><i></i>';

                        var index = -1;
                        index = model[0].BooKName.toString().indexOf("英语");
                        if (index == -1)
                            index =model[0].BooKName.toString().indexOf("语文");
                        if (index == -1)
                            index =model[0].BooKName.toString().indexOf("数学");
                        var name1 = model[0].BooKName.substring(0, index + 2);
                        var name2 = model[0].BooKName.substring(index + 2, model[0].BooKName.length);
                        html += '<p><label>' + name1+name2+'</label></p></li>';
                    }
                });
                if (booklist.length < 3)
                    html += '<li class="addBook"><em></em><a><i></i></a><i id="btnAddBook2"></i><p id="btnAddBook">添加教材</p></li>';
                $(".bookList ul").html(html);
                selBook();
                $("#btnAddBook").unbind("click");
                $("#btnAddBook").click(function() {
                    location.href = "PreLesson/Page/AddStandBook.aspx?page=Index&BookType=1";
                });
                $("#btnAddBook2").unbind("click");
                $("#btnAddBook2").click(function () {
                    location.href = "PreLesson/Page/AddStandBook.aspx?page=Index&BookType=1";
                });
            } else {
                $(".bookList").hide();
                $(".moreTeachingRec").hide();
                $(".comingSoon").show();
            }            
        });
    };
    /////////////////////////////////////////
    //////////加载班级列表///////////////////
    /////////////////////////////////////////
    this.InitClassList = function () {
        if (Current.UserInfoList.Type == 12) {
            var html = "<li classid='-1' gradeid=-1>公共班级</li>";
            if (Current.userClass.length != 0) {
                $.each(Current.userClass, function (c, clas) {
                    html += "<li classid=" + clas.ClassId + " gradeid=" + clas.GradeId + ">" + clas.GradeName + clas.ClassName + "</li>";
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
                $("#divClassToSelect li[classid=-1]").addClass("on");
            }
            $(".teachingFor label").html($("#divClassToSelect li.on").html());
        }
        else if (Current.UserInfoList.Type == 26) {
            var html1 = "<li class='on' classid='" + Current.UserInfoList.userClass[0].ClassId + "' gradeid=" + Current.UserInfoList.userClass[0].GradeId + ">" + Current.UserInfoList.userClass[0].GradeName + Current.UserInfoList.userClass[0].ClassName + "</li>";
            $("#divClassToSelect").html(html1);
            $(".teachingFor label").html(Current.UserInfoList.userClass[0].GradeName + Current.UserInfoList.userClass[0].ClassName);
        }
    };
};

var indexInit = null;
$(function () {
    indexInit = new IndexInit();
    indexInit.Init();
})

//班级选中事件
function changeClass() {
    $(".teachingFor ul li").on("click", function () {
        $(this).parent().find("li").removeClass("on");
        $(this).addClass("on");
        $(".teachingFor label").html($("#divClassToSelect li.on").html());
    })
};
//点击开始上课按钮
function GetContent() {    
    CreateTime = commonFuncJS.getNowFormatDate();
    var EditionID = $("#divStandBookToSelect .select").attr("EditionID");
    var SubjectID = $("#divStandBookToSelect .select").attr("SubjectID");
    var GradeID = $("#divStandBookToSelect .select").attr("GradeID");
    var BookID = $("#divStandBookToSelect .select").attr("BookID");
    var ClassID = $("#divClassToSelect .on").attr("classid");
    var ClassName = $("#divClassToSelect .on").html();
    var BookType = $("#divStandBookToSelect .select").attr("BookType");
    var Stage = $("#divStandBookToSelect .select").attr("Stage");;
    if (PageInitList != null && PageInitList.length != 0) {
        teachLessonManage.UpdateInitData(UserID, EditionID, SubjectID, GradeID, BookType, Stage, ClassID, BookID, AspxName, CreateTime);//更新用户操作数据
    }
    else {
        var PageInitID = commonFuncJS.GetGuid();
        teachLessonManage.SaveInitData(PageInitID, UserID, EditionID, SubjectID, GradeID, BookType, Stage, ClassID, BookID, AspxName, CreateTime);//第一次使用时保存用户操作数据
    };
    var PageInit = { UserID: UserID, EditionID: EditionID, SubjectID: SubjectID, GradeID: GradeID, BookType: BookType, Stage: Stage, ClassID: ClassID, BookID: BookID };//将基本信息放入Session
    commonFuncJS.setDataF("PageInit", PageInit);
    var userInfoCls = commonFuncJS.getDataF('UserInfo');
    var BookName = $("#divStandBookToSelect .select p label").html();
    var obj = { ClassID: ClassID, BookName: BookName };
    var objJson = JSON.stringify(obj);
    //记录用户上课操作
    teachLessonManage.SaveOperData(userInfoCls.Id, userInfoCls.Type, Constant.OperType.StartTeach_TYPE, objJson);
    var pagetype = '';
    if (BookType ==6) {
        pagetype = 'AttLesson/Page/TeachingTS.aspx?';
    }
    else
        pagetype = 'AttLesson/Page/Teaching.aspx?';
    var param ="BookID=" + BookID + "&UserID=" + UserID + "&EditionID=" + EditionID + "&SubjectID=" + SubjectID + "&GradeID=" + GradeID + "&ClassID=" + ClassID + "&BookType=" + BookType+"&page=IndexPage";
    commonFuncJS.UpdateStanBookUsingTime(UserID, BookID);
    //调用安卓上课函数
    var isEk = $(".disableEk").html();
    if (typeof WebViewJavascriptBridge != "undefined") {
        if (typeof isEk == "undefined") {  
            var webUrlS = Constant.webapi_Url;
            var accountS = getCookie("clsaccount");
            var passwordS = getCookie("clspassword");
            var apiName = 'Students/';
            var gradeName = ClassID == -1 ? "公共年级" : ClassName.substring(0, 3);
            var clsName = ClassID == -1 ? "公共班级" : ClassName.substring(3);
            param = pagetype + param + "&DXTP=true";
            var data = { account: accountS, password: passwordS, webUrl: webUrlS, apiName: apiName, classID: ClassID, param: param, ClassName: ClassName, gradeName: gradeName, clsName: clsName };
            window.WebViewJavascriptBridge.callHandler(
                'startAPP'
                , data
                , function (responseData) {
                }
            );
        }
        else {
            if (BookType == 6) {
                window.location.href = "AttLesson/Page/TeachingTS.aspx?" + param;
            }
            else {
                window.location.href = "AttLesson/Page/Teaching.aspx?" + param;
            }
        }
    }
    else {
        if (BookType == 6) {
            window.location.href = "AttLesson/Page/TeachingTS.aspx?" + param;
        }
        else {
            window.location.href = "AttLesson/Page/Teaching.aspx?" + param;
        }
    };
};
//书籍点击事件
function selBook() {
    $(".bookList #divStandBookToSelect li").click(function () {
        if (!$(this).hasClass("addBook")) {
            $(".bookList #divStandBookToSelect li").removeClass("select");
            $(this).addClass("select");
            GetContent();
        }
    })
};
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}
