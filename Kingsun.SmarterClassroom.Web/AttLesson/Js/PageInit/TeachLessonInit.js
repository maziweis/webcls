var UserID = "";
var SubjectID = "";
var AspxName = "SelectBook";
var PageInitList = [];
var CreateTime = "";
var AddEleBookInit = function () {
    var Current = this;
    this.UserID = getDataF("UserAccount");
    this.UserInfoList = null;   //年级班级名称列表
    this.BookInfoList = null;//电子书列表
    this.Subject = "";//从UserInfo中查出的学科ID
    this.Grade = "";//年级ID
    this.PageInitList = null;
   
    this.Init = function () {
        //////////获取年级班级数据/////////
        Current.UserInfoList = teachLessonManage.GetUserInfoList(Current.UserID);
        UserID = Current.UserInfoList.Id;
        Current.Subject = Current.UserInfoList.Subject;
        SubjectID = Current.Subject;      
        Current.PageInitList = teachLessonManage.SelectInitData(UserID, SubjectID, AspxName);
        PageInitList = Current.PageInitList;
        //var userClass = [];
        //$.each(Current.UserInfoList.UserClass, function (i, info) {
        //    userClass.push(info);
        //});
        //Current.Grade = Current.UserInfoList.UserClass.Grade;       
       
        //Current.BookInfoList = teachLessonManage.GetBookInfoList(Current.Subject,Current.Grade);
        
        //////////加载年级班级名称/////////////////
        Current.InitUserInfoList();
        selBook();
        function selBook()
        {
            $(".searchList li a").click(function () {
            $(".searchList li").removeClass("select");
            $(this).parent().addClass("select");
        })
        }
       
        $(".selectTable label.classLabel").click(function () {
            var GradeClass = $(this).attr("value");
            var GradeID = GradeClass.charAt(0);
            Current.InitBookList(GradeID);
            $(".selectTable .classLabel").removeClass("selected");
            $(this).addClass("selected");
            selBook();
           
        })
         
    }

    this.InitUserInfoList = function () {
        var html = "<tr><td width=\"5%\">&nbsp;</td><td width=\"100\">上课班级</td><td>";
        var obj = [];//UserInfoList数据
        $.each(Current.UserInfoList.userClass, function (g, classN) {
            obj.push(classN);
        });
        $.each(obj, function (c, Grade) {

            if (c == 0) {
                html += '<label class="classLabel selected" value="' + Grade.GradeId + Grade.ClassId+ '">' + Grade.GradeName + Grade.ClassName + '</label>';
            }
            else {
                html += '<label class="classLabel" value="' + Grade.GradeId + Grade.ClassId + '">' + Grade.GradeName + Grade.ClassName + '</label>';
            }

        });
        html += "</td><td width=\"5%\">&nbsp;</td></tr>";
        $(".selectTable").html(html);

        var gradeId = obj[0].GradeId;
        if (Current.PageInitList != null) {
            var GradeID = Current.PageInitList[0].GradeID;
            var ClassID = Current.PageInitList[0].ClassID;
            var GradeClass = GradeID.toString() + ClassID;
            $(".selectTable .classLabel").removeClass("selected");
            $(".selectTable .classLabel[value=" + GradeClass + "]").addClass("selected");
            gradeId = GradeID;
        };
        
        Current.InitBookList(gradeId);
        if (Current.PageInitList != null) {
            var BookID = Current.PageInitList[0].BookID;
            $(".searchList li").removeClass("select");
            $(".searchList li[BookID=" + BookID + "]").addClass("select");
        };
    };
    this.InitBookList = function (gradeId) {
        var bookimg = [];//BookList数据
       
        var htmlb = "";
        htmlb += "<ul>";
        Current.BookInfoList = teachLessonManage.GetBookInfoList(Current.Subject, gradeId);
        $.each(Current.BookInfoList, function (g, classN) {
            bookimg.push(classN);
        });
        $.each(bookimg, function (b, book) {
            if (b == 0) {
                htmlb += "<li class=\"booklist select sel" + book.Grade + "\"BookID=" + book.Id + "><a href=\"javascript:void(0)\"><img src=" + book.BookCover + " alt=" + book.BookName + "/><p>" + book.BookName + "</p></a></li>";

            }
            else {
                htmlb += "<li class=\"booklist select sel" + book.Grade + "\"BookID=" + book.Id + "><a href=\"javascript:void(0)\"><img src=" + book.BookCover + " alt=" + book.BookName + "/><p>" + book.BookName + "</p></a></li>";
            }
        });
        htmlb += "</ul><div class=\"clear\"></div>";
        $(".searchList").html(htmlb);
        
    };
}

var addEleBookInit;
$(function () {
    addEleBookInit = new AddEleBookInit();
    addEleBookInit.Init();
});
//用sessionStorage储存数据
function setDataF(key, value) {
    // 存储值：将对象转换为Json字符串 
    sessionStorage.setItem(key, JSON.stringify(value));
}
//用sessionStorage取数据
function getDataF(key) {
    // 取值时：把获取到的Json字符串转换回对象 
    var data = sessionStorage.getItem(key);
    //console.log(sessionStorage.getItem(key));
    var dataObj = JSON.parse(data);
    //console.log(dataObj.name); //输出
    return dataObj;
};

//点击开始上课按钮
function GetContent() {
    CreateTime = getNowFormatDate();
    var bookId = $(".select").attr("BookID");
    var GradeClass = $(".selected").attr("value");
    var GradeID = GradeClass.charAt(0);
    var ClassID = GradeClass.substr(1, GradeClass.length - 1);
    if (PageInitList != null) {
        teachLessonManage.UpdateInitData(UserID, SubjectID, GradeID, ClassID, bookId, AspxName, CreateTime);//更新用户操作数据
    }
    else {
        SaveInitData(UserID, SubjectID, GradeID, ClassID, bookId);//第一次使用时保存用户操作数据
    }
    var PageInit = { UserID: UserID, SubjectID: SubjectID, GradeID: GradeID, ClassID: ClassID, BookID: bookId };
    setDataF("PageInit", PageInit);
    var href = "../Page/Teaching.aspx?BookID=" + bookId;
    window.location.href = href;
}
//保存用户操作数据
function SaveInitData(UserID, SubjectID, GradeID, ClassID, BookID) {   
    var PageInitID = GetGuid();
    teachLessonManage.SaveInitData(PageInitID,UserID, SubjectID, GradeID, ClassID, BookID, AspxName, CreateTime);
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
    var currentdate = month + seperator1 + strDate +seperator1+ date.getFullYear()
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    return currentdate;
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
}