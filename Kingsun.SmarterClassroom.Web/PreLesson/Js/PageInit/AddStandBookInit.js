
var AddStandBookInit = function () {
    var Current = this;

    this.UserID = "";

    this.SubjectList = null;//科目列表
    this.GradeList = null;//年级列表
    this.EditionList = null;//版本列表

    this.SelectBookType = "";//教材类型
    this.SelectSubjectID = "";//选择的科目ID
    this.SelectEditionID = "";//选择的版本ID

    this.StandBookList = null;//获取的教材数据

    this.UserStandBook = null;//用户的教材

    this.UserFinallyOperationRecord = null;

    this.User = null;
    //记录是否从智慧校园进入
    this.Type = null;
    this.T = "";
    this.Init = function () {
        var IP = $("#requestip").html();
        Current.User = commonFuncJS.CheckLogin(IP);
        Current.UserID = Current.User.Id;
        Current.Type = getUrlParam('type');

        $("#btnBlack").click(function () {            
            if (Current.Type != null && Current.Type != "undefined")
                if (getUrlParam('page') == 'SelectBook') {
                    location.href = '../../AttLesson/Page/SelectBook.aspx?type=' + Current.Type + "&t=" + Current.T;
                }
                else if (getUrlParam('page') == 'Index') {
                    location.href = '../../Index.aspx?type=' + Current.Type + "&t=" + Current.T;
                }
                else
                    location.href = "UserStandBook.aspx?type=" + Current.Type + "&t=" + Current.T;
            else {               
                    if (getUrlParam('page') == 'SelectBook') {
                        location.href = '../../AttLesson/Page/SelectBook.aspx';
                    }
                    else if (getUrlParam('page') == 'Index') {
                        location.href = '../../Index.aspx';
                    }
                    else {
                        location.href = "UserStandBook.aspx";
                    }
            }
        });
        Current.SelectBookType = Common.QueryString.GetValue("BookType");
        ////////////获取用户的教材数据/////////////
        Current.UserStandBook = preLessonManagement.GetUserStandBook(Current.UserID);
        Current.TotalBookNum = Current.UserStandBook.length;
        Current.UserFinallyOperationRecord = commonFuncJS.GetUserFinallyOperationRecord(Current.UserID);
        //////////////////////获取MOD教材数据/////////////
        Common.GetSBListByStages(0, 0, 0, 0, 0, function (data) {
            Current.StandBookList = data.Data;
            $(".topType li").unbind("click");
            $(".topType li").click(function () {
                //if ($(this).attr("id") != 1)
                //    return false;
                $(this).parents(".topType").find("li").removeClass("on");
                $(this).addClass("on");
                Current.SelectBookType = $(this).attr("id");
                //////////加载科目下拉框/////////////////
                Current.InitSubjectList();
                /////////加载用户已经拥有的教材/////////////
                Current.InitUserBook();
                /////////////保存事件//////////////////
                $("#btnSave").unbind("click");
                $("#btnSave").click(function () {
                    var booklist = [];
                    $("#liUserBook li").each(function (l, li) {
                        $.each(Current.StandBookList, function (b, book) {
                            if ($(li).attr("id") == book.ID) {
                                booklist.push(book);
                                return false;
                            }
                        });
                    });
                    var result = preLessonManagement.AddUserStandBook(Current.UserID, booklist);
                    if (result) {
                        commonFuncJS.openAlert("保存成功!", function () {
                            if (booklist.length != 0) {
                                ///////////////记录用户操作/////////////////////////
                                commonFuncJS.SavsUserFinallyOperationRecord(Current.UserID, Current.SelectBookType, 0, booklist[booklist.length - 1].Grade, Current.SelectSubjectID, Current.SelectEditionID, 0, 0, 0);
                            }
                            if (Current.Type != null && Current.Type != "undefined")
                                if (getUrlParam('page') == 'SelectBook') {
                                    location.href = '../../AttLesson/Page/SelectBook.aspx?type=' + Current.Type + "&t=" + Current.T;
                                }
                                else if (getUrlParam('page') == 'Index') {
                                    location.href = '../../Index.aspx?type=' + Current.Type + "&t=" + Current.T;
                                }
                                else {
                                    location.href = "UserStandBook.aspx?type=" + Current.Type + "&t=" + Current.T;
                                }
                            else {
                                if (getUrlParam('page') == 'SelectBook') {
                                    location.href = '../../AttLesson/Page/SelectBook.aspx';
                                }
                                else if (getUrlParam('page') == 'Index') {
                                    location.href = '../../Index.aspx';
                                }
                                else {
                                    location.href = "UserStandBook.aspx";
                                }
                            }
                        });
                    } else {
                        commonFuncJS.openAlert("保存失败!", function () {

                        });
                    }
                });

            });
            if (Current.SelectBookType == "")
                $(".topType li")[0].click();
            else
                $(".topType li")[Current.SelectBookType - 1].click();
        });
    };
    ////////////////////////////////////////////
    /////////加载用户已经拥有的教材/////////////
    ////////////////////////////////////////////
    this.InitUserBook = function () {
        if ($("#liUserBook").children().length != 0) {
            return;
        }
        if (Current.UserStandBook != null && Current.UserStandBook.length != 0) {
            $("#divUserSelect").show();
            $(".noneAddList").hide();
            var html = "";
            $.each(Current.UserStandBook, function (b, ubook) {
                $.each(Current.StandBookList, function (n, book) {
                    if (book.ID == ubook.BookID) {
                        if (book.BookType == 1)
                            html += '<li id="' + book.ID + '" class="tongbu"><i></i><h4>' + book.BooKName + '</h4><p>' + book.BooKName + '</p><a class="delete"></a></li>';
                        else if (book.BookType == 2)
                            html += '<li id="' + book.ID + '" class="fudao"><i></i><h4>' + book.BooKName + '</h4><p>' + book.BooKName + '</p><a class="delete"></a></li>';
                        else if (book.BookType > 2)
                            html += '<li id="' + book.ID + '" class="tese"><i></i><h4>' + book.BooKName + '</h4><p>' + book.BooKName + '</p><a class="delete"></a></li>';
                        return false;
                    }
                });
            });
            $("#lblBookNum").html("(" + Current.UserStandBook.length + ")");
            $("#liUserBook").html(html);
            Current.SetBtnAddState();
            //////////////绑定已选择的教材删除操作////////////////////
            Current.BindDeleteBook();
        } else {
            $(".noneAddList").show();
        }
    };
    ///////////////////////////////////////////////////
    //////////////绑定已选择的教材删除操作/////////////
    ///////////////////////////////////////////////////
    this.BindDeleteBook = function () {
        $("#liUserBook li").each(function (l, li) {
            var del = $(li).find("a");
            $(del).unbind("click");
            $(del).click(function () {
                $(li).remove();
                $("#divStandBookList li").each(function (a, bli) {
                    if ($(bli).attr("id") == $(li).attr("id")) {
                        $(bli).removeAttr("class");
                        return false;
                    }
                });
                Current.TotalBookNum--;
                Current.BindNotCheckClick();
                $.each(Current.UserStandBook, function (u, ubook) {
                    if (ubook.BookID == $(li).attr("id")) {
                        Current.AddState = true;
                        Current.UserStandBook.splice(u, 1);
                        return false;
                    }
                });

                ///////////////删除资源/////////////////
                $.each(Current.AddBookList, function (i, id) {
                    if (id == $(li).attr("id")) {
                        Current.AddBookList.splice(i, 1);
                        return false;
                    }
                });
                if ($("#liUserBook li").length == 0) {
                    $(".noneAddList").show();
                }
                Current.SetBtnAddState();
                ///////////////绑定选中选择的教材事件///////////////////
                Current.BindSelectBookClick();
            });
        });

        $("#divStandBookList li.selected").each(function (l, li) {
            $(li).unbind("click");
            $(li).click(function () {
                Current.TotalBookNum--;
                $.each(Current.AddBookList, function (b, bookID) {
                    if (bookID == $(li).attr("id"))
                        Current.AddBookList.splice(b,1);
                });
                Current.SetBtnAddState();
                $(li).removeAttr("class");
                Current.BindSelectBookClick();
                $("#liUserBook li").each(function (m, bli) {
                    if ($(li).attr("id") == $(bli).attr("id")) {
                        $(bli).remove();
                        return false;
                    }
                });
            });
        });
    };
    /////////////////////////////////////////
    //////////加载科目下拉框/////////////////
    /////////////////////////////////////////
    this.InitSubjectList = function () {
        Common.CodeAjax("do.jsonp", "SUB", function (data) {
            Current.SubjectList = data["SUB"];
            var html = ""; var obj = [];
            $.each(Current.SubjectList, function (s, subject) {
                $.each(Current.StandBookList, function (b, book) {
                    if (book.Subject == subject.ID && ((book.BookType == Current.SelectBookType && Current.SelectBookType <= 2) || (book.BookType >= Current.SelectBookType && Current.SelectBookType > 2))) {
                        obj.push(subject);
                        return false;
                    }
                });
            });
            $.each(obj, function (e, subject) {
                html += '<option value="' + subject.ID + '">' + subject.CodeName + '</option>';
            });
            $("#selectSubject").html(html);
            ////////绑定年级选中事件////////
            $("#selectSubject").unbind("change");
            $("#selectSubject").change(function () {
                Current.SelectSubjectID = $(this).children('option:selected').val();
                ////////////加载版本列表/////////////////
                Current.InitEditionList();
            });
            if (Current.UserFinallyOperationRecord != null) {
                var float = false;
                $.each(obj, function (n, sub) {
                    if (sub.ID == Current.UserFinallyOperationRecord.SubjectID)
                        float = true;
                });
                if (float)
                    $('#selectSubject').val(Current.UserFinallyOperationRecord.SubjectID).change();
                else
                    $("#selectSubject").val(obj[0].ID).change();
            } else {
                $('#selectSubject').val(obj[0].ID).change();
            }
        });
    };

    /////////////////////////////////////////
    //////////加载版本下拉框/////////////////
    /////////////////////////////////////////
    this.InitEditionList = function () {
        Common.CodeAjax("do.jsonp", "ED", function (data) {
            Current.EditionList = data["ED"];
            var html = ""; var obj = [];
            $.each(Current.EditionList, function (g, edition) {
                $.each(Current.StandBookList, function (b, book) {
                    if (book.Edition == edition.ID && book.Subject == Current.SelectSubjectID && ((book.BookType == Current.SelectBookType && Current.SelectBookType <= 2) || (book.BookType >= Current.SelectBookType && Current.SelectBookType > 2))) {
                        obj.push(edition);
                        return false;
                    }
                });
            });
            $.each(obj, function (e, edition) {
                html += '<option value="' + edition.ID + '">' + edition.CodeName + '</option>';
            });
            $("#selectEdition").html(html);
            ////////绑定年级选中事件////////
            $("#selectEdition").unbind("change");
            $("#selectEdition").change(function () {
                Current.SelectEditionID = $(this).children('option:selected').val();
                ///////////////记录用户操作/////////////////////////
                commonFuncJS.SavsUserFinallyOperationRecord(Current.UserID, Current.SelectBookType, 0, 0, Current.SelectSubjectID, Current.SelectEditionID, 0, 0, 0);
                ////////////加载教材列表/////////////////
                Current.InitStandBookList();
            });
            if (Current.UserFinallyOperationRecord != null) {
                var float = false;
                $.each(obj, function (n, ed) {
                    if (ed.ID == Current.UserFinallyOperationRecord.EditionID)
                        float = true;
                });
                if (float)
                    $('#selectEdition').val(Current.UserFinallyOperationRecord.EditionID).change();
                else
                    $("#selectEdition").val(obj[0].ID).change();
            } else {
                $('#selectEdition').val(obj[0].ID).change();
            }
        });
    };
    ////////////////////////////////////////
    ///////////加载教材列表/////////////////
    ////////////////////////////////////////
    this.InitStandBookList = function () {
        var list = [];
        $.each(Current.StandBookList, function (b, book) {
            if (book.Subject == Current.SelectSubjectID && book.Edition == Current.SelectEditionID && ((book.BookType == Current.SelectBookType && Current.SelectBookType <= 2) || (book.BookType >= Current.SelectBookType && Current.SelectBookType > 2))) {
                list.push(book);
            }
        });
        list.sort(commonFuncJS.CreateCompact("Grade"));
        var html = "";
        $.each(list, function (b, book) {
            var isuser = 0;
            if (Current.UserStandBook != null) {
                $.each(Current.UserStandBook, function (u, ubook) {
                    if (book.ID == ubook.BookID) {
                        isuser = 1;
                        return false;
                    }
                });
            }
            if (isuser == 0) {
                $("#liUserBook li").each(function (l, li) {
                    var bookID = $(li).attr("id");
                    if (book.ID == bookID) {
                        isuser = 2;
                        return false;
                    }
                });
            }
            var index = 0;
            if (commonFuncJS.CheckName(book.BooKName)!= -1)
                index = commonFuncJS.CheckName(book.BooKName);
            var name = book.BooKName.substring(index + 2, book.BooKName.length);
            var name1 = "", name2 = "";
            if (book.BooKName.indexOf("攀登") != -1) {
                name1 = "攀登英语阅读系列";
                if (book.AgeRange != null)
                    name2 = book.AgeRange + "岁";
            } else if (book.BooKName.indexOf("拼读") != -1) {
                name1 = "自然拼读";
                if (book.AgeRange !=null)
                    name2 = book.AgeRange + "岁";
            } else if (book.BooKName.indexOf("电影") != -1) {
                name1 = "电影听说分级教程";
                if (book.Grade!=0)
                    name2 = commonFuncJS.IntToCn(book.Grade) + "年级";
            } else {
                if (book.Subject == 15) {
                    name1 = book.BooKName.substring(0, index + 5);
                    name2 = book.BooKName.substring(index + 5, book.BooKName.length);
                } else {
                    name1 = book.BooKName.substring(0, index + 2);
                    name2 = book.BooKName.substring(index + 2, book.BooKName.length);
                }
            }
            if (isuser == 1)
                html += '<li id="' + book.ID + '" class="disSelected">';
            else if (isuser == 2)
                html += '<li id="' + book.ID + '" class="selected">';
            else
                html += '<li id="' + book.ID + '">';
            var img = Constant.resource_Url;
            if (typeof (book.BookCover) != "undefined")
                img += book.BookCover
            else
                img += "TextBookHandler.ashx?OP=getImg&BookID=" + book.ID
            html += '<a><img src="' + img + '" alt="' + name + '"><h4>' + name1 + '</h4><p>' + name2 + '</p></a><i></i></li>';
        });
        $("#divStandBookList").html(html);
        //之前已选中的资源禁止再次选择
        Current.BindNotCheckClick();
        ///////////////绑定选中选择的教材事件///////////////////
        Current.BindSelectBookClick();
    };
    this.BindNotCheckClick = function () {
        $(".addLeft .beikeList li a,.addLeft .beikeList li i").unbind("click");
        $(".addLeft .beikeList li.disSelected a,.addLeft .beikeList li.disSelected i").on("click", function () {
            commonFuncJS.tipAlert("该教材已添加");
        })
    };
    this.AddBookList = []; this.AddState = false;
    /////////////////////////////////////////////////////////
    ///////////////绑定选中选择的教材事件///////////////////
    /////////////////////////////////////////////////////////
    this.BindSelectBookClick = function () {
        $("#divStandBookList li").not("[class=disSelected]").not("[class=selected]").each(function (l, li) {
            $(li).unbind("click");
            $(li).click(function () {
                var bookID = $(li).attr("id");
                $(li).attr("class", "selected");
                var html = "";
                $.each(Current.StandBookList, function (b, book) {
                    if (book.ID == bookID) {
                        if (book.BookType == 1)
                            html += '<li id="' + book.ID + '" class="tongbu"><i></i><h4>' + book.BooKName + '</h4><p>' + book.BooKName + '</p><a class="delete"></a></li>';
                        else if (book.BookType == 2)
                            html += '<li id="' + book.ID + '" class="fudao"><i></i><h4>' + book.BooKName + '</h4><p>' + book.BooKName + '</p><a class="delete"></a></li>';
                        else if (book.BookType > 2)
                            html += '<li id="' + book.ID + '" class="tese"><i></i><h4>' + book.BooKName + '</h4><p>' + book.BooKName + '</p><a class="delete"></a></li>';

                        return false;
                    }
                });
                $(".noneAddList").hide();
                $(li).unbind("click");
                Current.AddBookList.push(bookID);
                Current.TotalBookNum++;
                Current.SetBtnAddState();
                $("#divUserSelect").show();
                $("#liUserBook").append(html);
                //////////////让滚动条定位到最底部/////////////////////////
                $("#divUserSelect").scrollTop($("#divUserSelect")[0].scrollHeight);
                //////////////绑定已选择的教材删除操作////////////////////
                Current.BindDeleteBook();
            });
        });
    };

    this.TotalBookNum = 0;
    this.SetBtnAddState = function () {
        $("#lblBookNum").html("(" + Current.TotalBookNum + ")");
        $("#btnSave").html("保存(" + Current.AddBookList.length + ")");
        if (Current.AddBookList.length != 0 || Current.AddState == true) {
            $("#btnSave").removeAttr("disabled");
        } else {
            $("#btnSave").attr("disabled", "disabled");
        }
    };
};

var addStandBookInit;
$(function () {
    addStandBookInit = new AddStandBookInit();
    addStandBookInit.Init();
});