var PreviewInit = function () {
    var Current = this;

    this.UserID = "";

    this.BookTypeList = null;//教材类型列表
    this.StageList = null;//学段列表
    this.SubjectList = null;//科目列表
    this.GradeList = null;//年级列表
    this.EditionList = null;//版本列表


    this.UserStandBook = null;//用户的教材

    this.SelectBookType = "";//选择的教材大类

    this.SelectStageID = "";//选择的学段ID
    this.SelectGradeID = "";//选择的年级ID
    this.SelectSubjectID = "";//选择的科目ID
    this.SelectEditionID = "";//选择的版本ID
    this.SelectTSType = "";//选择特色教材类型
    this.SelectTSStage = "";//选择特色教材年段

    this.UserFinallyOperationRecord = null;

    this.User = null;

    //记录是否从智慧校园进入
    this.Type = null;
    this.T = "";

    this.Init = function () {
        var IP = $("#requestip").html();
        Current.User = commonFuncJS.CheckLogin(IP);
        if (Current.User == null) {
            return false;
        }
        Current.UserID = Current.User.Id;

        Current.Type = getUrlParam('type');
        Current.T = getUrlParam('t');

        $("#btnDeleteData").unbind("click");
        $("#btnDeleteData").click(function () {
            var obj = { UserID: Current.UserID };
            var result = Common.Ajax("BasicDataImplement", "DeleteUserPreLessonData", obj).Data;
            if (result)
                alert("清除垃圾数据成功");
        });
        
        ////////////////返回跳转按钮//////////////////
        $("#btnBlack").click(function () {           
            location.href = "../../../AttLesson/Page/SelectBook.aspx";
        });
        Common.CodeAjax("do.jsonp", "SUB", function (data) {
            Current.SubjectList = data["SUB"];

            ////////////获取用户的教材数据/////////////
            Current.UserStandBook = preLessonManagement.GetUserStandBook(Current.UserID);
            Current.UserFinallyOperationRecord = commonFuncJS.GetUserFinallyOperationRecord(Current.UserID);
            if (Current.UserStandBook == null || Current.UserStandBook.length == 0) {
                $(".searchList.beikeList").hide();
                $(".comingSoon").show();
                Current.SelectBookType = 0;
                //var html = '<li class="addBook"><a id="btnAddBook" href="javascript:void(0)"><i></i><br />添加教材</a></li>';
                //$("#divStandBookToSelect").html(html);
            } else {
                $(".searchList.beikeList").show();
                $(".comingSoon").hide();
            }
            ////////////加载教材大类切换/////////////
            Current.InitStandBookTypeList();
        });
    };

    //根据窗口宽度计算li的右边距
    this.autoMarginList = function () {
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
    ///////////////////////////////////////////
    //////////加载教材大类切换/////////////////
    //////////////////////////////////////////
    this.InitStandBookTypeList = function () {
        Common.CodeAjax("do.jsonp", "JCLX", function (data) {
            Current.BookTypeList = data["JCLX"];
            var html = '<li id="0" class="allType"><i></i><label>全部教材</label></li>';
            $.each(Current.BookTypeList, function (n, type) {
                html += '<li id="' + type.id + '"';
                if (type.id == 1)
                    html += ' class="tongbu">';
                else if (type.id == 2)
                    html += ' class="fudao">';
                else if (type.id == 3)
                    html += ' class="tese">';
                html += '<i></i><label>' + type.title + '</label></li>';
            });
            $(".bottomType ul").html(html);
            ///////////////绑定点击切换事件/////////////////////
            $(".bottomType li").on("click", function () {
                $(this).parents(".bottomType").find("li").removeClass("on");
                $(this).addClass("on");
                $(".headTitle label").text($(this).text());
                Current.SelectBookType = $(this).attr("id");
                if (Current.UserFinallyOperationRecord!=null)
                    commonFuncJS.SavsUserFinallyOperationRecord(Current.UserID, Current.SelectBookType, Current.SelectTSStage, Current.SelectGradeID, Current.SelectSubjectID, Current.SelectEditionID, Current.UserFinallyOperationRecord.BookID, Current.UserFinallyOperationRecord.UnitID, Current.UserFinallyOperationRecord.PageNum);
                Current.InitStandBookList();
                //Current.InitSubjectList();//加载版本列表
            });
            if (Current.UserFinallyOperationRecord != null) {
                if (Current.UserFinallyOperationRecord.BookType == null) {
                    $(".bottomType li")[0].click();
                }
                else {
                    var num = 0;
                    if (Current.UserFinallyOperationRecord.BookType >= 3)
                        num = 3;
                    else
                        num = Current.UserFinallyOperationRecord.BookType;
                    $(".bottomType li")[num].click();
                }
            } else {
                $(".bottomType li")[0].click();
            }
        });
    };

    /////////////////////////////////////////
    //////////加载年级下拉框/////////////////
    /////////////////////////////////////////
    this.InitGradeList = function () {
        $("#selectGrade").parents().show();
        Common.CodeAjax("do.jsonp", "GRADE", function (data) {
            Current.GradeList = data["GRADE"];
            var html = ""; var obj = [];
            $.each(Current.GradeList, function (g, grade) {
                if (Current.UserStandBook == null) {
                    obj.push(grade);
                } else {
                    $.each(Current.UserStandBook, function (b, book) {
                        if (book.GradeID == grade.ID && book.EditionID == Current.SelectEditionID && book.SubjectID == Current.SelectSubjectID && book.BookType == Current.SelectBookType) {
                            obj.push(grade);
                            return false;
                        }
                    });
                }
            });
            $.each(obj, function (g, grade) {
                html += '<option value="' + grade.ID + '">' + grade.CodeName + '</option>';
            });
            $("#selectGrade").html(html);
            if (html == "") {
                $('#selectGrade').val(0).change();
                return false;
            }
            ////////绑定年级选中事件////////
            $("#selectGrade").unbind("change");
            $("#selectGrade").change(function () {
                Current.SelectGradeID = $(this).children('option:selected').val();
                ///////////////记录用户操作/////////////////////////
                if (Current.UserFinallyOperationRecord != null)
                    commonFuncJS.SavsUserFinallyOperationRecord(Current.UserID, Current.SelectBookType, Current.SelectStageID, Current.SelectGradeID, Current.SelectSubjectID, Current.SelectEditionID, Current.UserFinallyOperationRecord.BookID, Current.UserFinallyOperationRecord.UnitID, Current.UserFinallyOperationRecord.PageNum);
                else
                    commonFuncJS.SavsUserFinallyOperationRecord(Current.UserID, Current.SelectBookType, Current.SelectStageID, Current.SelectGradeID, Current.SelectSubjectID, Current.SelectEditionID, 0, 0, 0);
                //////////加载教材下拉框/////////////////
                Current.InitStandBookList();
            });
            if (Current.UserFinallyOperationRecord != null) {
                var float = false;
                $.each(obj, function (g, gra) {
                    if (gra.ID == Current.UserFinallyOperationRecord.GradeID)
                        float = true;
                });
                if (float)
                    $('#selectGrade').val(Current.UserFinallyOperationRecord.GradeID).change();
                else
                    $("#selectGrade").val(obj[0].ID).change();
            } else {
                $('#selectGrade').val(obj[0].ID).change();
            }
        });
    };
    /////////////////////////////////////////
    //////////加载科目下拉框/////////////////
    /////////////////////////////////////////
    this.InitSubjectList = function () {
        if (Current.UserStandBook == null)
            return false;
        Common.CodeAjax("do.jsonp", "SUB", function (data) {
            Current.SubjectList = data["SUB"];
            var html = ""; var obj = [];
            $.each(Current.SubjectList, function (g, subject) {
                $.each(Current.UserStandBook, function (b, book) {
                    if (book.SubjectID == subject.ID && ((book.BookType >= Current.SelectBookType && Current.SelectBookType == 3) || (book.BookType == Current.SelectBookType && Current.SelectBookType < 3))) {
                        obj.push(subject);
                        return false;
                    }
                });
            });
            $.each(obj, function (s, subject) {
                html += '<option value="' + subject.ID + '">' + subject.CodeName + '</option>';
            });

            ////////绑定科目选中事件////////
            $("#selectSubject").unbind("change");
            $("#selectSubject").change(function () {
                Current.SelectSubjectID = $(this).children('option:selected').val();
                if (Current.SelectBookType == 3)
                    Current.InitStandBookType();
                else
                    Current.InitEditionList();
            });
            $("#selectSubject").html(html);
            if (html == "") {
                $(".searchList.beikeList").hide();
                $(".comingSoon").show();
                if (Current.SelectBookType == 3) {
                    ////////////隐藏版本和年级////////////////
                    $("#selectEdition").parents().hide();
                    $("#selectGrade").parents().hide();
                    ////////////显示类型和学段////////////////
                    $("#selectBookType").parents().show();
                    $("#selectStage").parents().show();

                    $('#selectSubject').val(0).change();
                    return false;
                } else {
                    ////////////显示版本和年级////////////////
                    $("#selectEdition").parents().show();
                    $("#selectGrade").parents().show();
                    ////////////隐藏类型和学段////////////////
                    $("#selectBookType").parents().hide();
                    $("#selectStage").parents().hide();

                    $('#selectSubject').val(0).change();
                    return false;
                }
            } else {
                $(".comingSoon").hide();
            }
            if (Current.UserFinallyOperationRecord != null) {
                var float = false;
                $.each(obj, function (n, m) {
                    if (m.ID == Current.UserFinallyOperationRecord.SubjectID)
                        float = true
                });
                if (float)
                    $('#selectSubject').val(Current.UserFinallyOperationRecord.SubjectID).change();
                else
                    $('#selectSubject').val(obj[0].ID).change();
            } else {
                $('#selectSubject').val(obj[0].ID).change();
            }
        });
    };
    /////////////////////////////////////////
    //////////加载版本下拉框/////////////////
    /////////////////////////////////////////
    this.InitEditionList = function () {
        $("#selectBookType").parents().hide();
        $("#selectStage").parents().hide();
        Current.SelectTSStage = "";
        $("#selectEdition").parents().show();
        Common.CodeAjax("do.jsonp", "ED", function (data) {
            var html = ""; var obj = [];
            Current.EditionList = data["ED"];
            $.each(Current.EditionList, function (g, edition) {
                if (Current.UserStandBook == null) {
                    obj.push(edition);
                } else {
                    $.each(Current.UserStandBook, function (b, book) {
                        if (book.EditionID == edition.ID && book.SubjectID == Current.SelectSubjectID && book.BookType == Current.SelectBookType) {
                            obj.push(edition);
                            return false;
                        }
                    });
                }
            });
            $.each(obj, function (e, edition) {
                html += '<option value="' + edition.ID + '">' + edition.CodeName + '</option>';
            });
            ////////绑定年级选中事件////////
            $("#selectEdition").unbind("change");
            $("#selectEdition").change(function () {
                Current.SelectEditionID = $(this).children('option:selected').val();
                ////////////加载年级列表/////////////////
                Current.InitGradeList();
            });
            $("#selectEdition").html(html);
            if (html == "") {
                $('#selectEdition').val(0).change();
                return false;
            }

            if (Current.UserFinallyOperationRecord != null) {
                var float = false;
                $.each(obj, function (n, ed) {
                    if (ed.ID == Current.UserFinallyOperationRecord.EditionID)
                        float = true;
                });
                if (float)
                    $('#selectEdition').val(Current.UserFinallyOperationRecord.EditionID).change();
                else
                    $('#selectEdition').val(obj[0].ID).change();
            } else {
                $('#selectEdition').val(obj[0].ID).change();
            }
        });
    };
    /////////////////////////////////////////
    //////////加载教材类型下拉框/////////////
    /////////////////////////////////////////
    this.InitStandBookType = function () {
        $("#selectEdition").parents().hide();
        $("#selectGrade").parents().hide();
        Current.SelectEditionID = 0;
        Current.SelectGradeID = 0;
        $("#selectBookType").parents().show();
        var list = [];
        $.each(Current.BookTypeList[2].children, function (n, type) {
            if (Current.UserStandBook == null) {
                list.push(type);
            } else {
                $.each(Current.UserStandBook, function (b, book) {
                    if (book.SubjectID == Current.SelectSubjectID && Current.SelectBookType == Current.BookTypeList[2].id && book.BookType == type.id) {
                        list.push(type);
                        return false;
                    }
                });
            }
        });
        var html = "";
        $.each(list, function (t, type) {
            html += '<option value="' + type.id + '">' + type.title + '</option>';
        });
        $("#selectBookType").html(html);
        ////////绑定类型选中事件////////
        $("#selectBookType").unbind("change");
        $("#selectBookType").change(function () {
            Current.SelectTSType = $(this).children('option:selected').val();
            ////////////加载年段列表/////////////////
            Current.InitStageList();
        });
        if (html == "") {
            $('#selectBookType').val(0).change();
            return false;
        }
        if (Current.UserFinallyOperationRecord != null) {
            var float = false;
            $.each(list, function (n, type) {
                if (type.id == Current.UserFinallyOperationRecord.BookType)
                    float = true;
            });
            if (float)
                $('#selectBookType').val(Current.UserFinallyOperationRecord.BookType).change();
            else
                $('#selectBookType').val(list[0].id).change();
        } else {
            $('#selectBookType').val(list[0].id).change();
        }
    };
    /////////////////////////////////////////
    ////////////加载年段列表/////////////////
    /////////////////////////////////////////
    this.InitStageList = function () {
        $("#selectStage").parents().show();
        Common.CodeAjax("do.jsonp", "SSTAGE", function (data) {
            Current.StageList = data["SSTAGE"];
            var list = [];
            $.each(Current.StageList, function (s, stage) {
                if (Current.UserStandBook == null) {
                    list.push(stage);
                } else {
                    $.each(Current.UserStandBook, function (b, book) {
                        if (book.SubjectID == Current.SelectSubjectID && book.BookType == Current.SelectTSType && book.Stage == stage.ID) {
                            list.push(stage);
                            return false;
                        }
                    });
                }
            });
            var html = "";
            $.each(list, function (n, stage) {
                html += '<option value="' + stage.ID + '">' + stage.CodeName + '</option>';
            });
            $("#selectStage").html(html);
            ////////绑定类型选中事件////////
            $("#selectStage").unbind("change");
            $("#selectStage").change(function () {
                Current.SelectTSStage = $(this).children('option:selected').val();
                /////////////加载特色教材列表/////////////////
                Current.InitStandBookList();
                ///////////////记录用户操作/////////////////////////
                //if (Current.UserFinallyOperationRecord != null)
                commonFuncJS.SavsUserFinallyOperationRecord(Current.UserID, Current.SelectTSType, Current.SelectTSStage, Current.SelectGradeID, Current.SelectSubjectID, Current.SelectEditionID, Current.UserFinallyOperationRecord.BookID, Current.UserFinallyOperationRecord.UnitID, Current.UserFinallyOperationRecord.PageNum);
            });
            if (html == "") {
                $('#selectStage').val(0).change();
                return false;
            }
            if (Current.UserFinallyOperationRecord != null) {
                var float = false;
                $.each(list, function (n, sta) {
                    if (sta.ID == Current.UserFinallyOperationRecord.Stage)
                        float = true;
                });
                if (float)
                    $('#selectStage').val(Current.UserFinallyOperationRecord.Stage).change();
                else
                    $('#selectStage').val(list[0].ID).change();
            } else {
                $('#selectStage').val(list[0].ID).change();
            }
        });
    };
    /////////////////////////////////////////////
    //////////加载特色教材列表///////////////////
    /////////////////////////////////////////////
    this.InitTSStandBook = function () {

    };
    /////////////////////////////////////////
    //////////加载教材列表///////////////////
    /////////////////////////////////////////
    this.DeleteBookArr = [];//删除的教材
    this.InitStandBookList = function () {
        //////////////////////获取MOD教材数据/////////////
        Common.GetSBListByStages(0, Current.SelectGradeID, Current.SelectSubjectID, 0, Current.SelectEditionID, function (data) {
            var html = '<li class="addBook"><a id="btnAddBook" href="javascript:void(0)"><i></i><br />添加教材</a></li>';
            var standbooklist = data.Data;
            //standbooklist.sort(commonFuncJS.CreateDescCompactMost("Subject","Edition", "Grade", "Booklet"));
            if (Current.UserStandBook != null) {
                Current.UserStandBook.sort(commonFuncJS.CreateDescCompactMost("SubjectID", "EditionID", "GradeID"));
                $.each(Current.UserStandBook, function (u, value) {
                    var book = null;
                    var model = $.grep(standbooklist, function (model) {
                        if (value.BookID == model.ID) {
                            book = model;
                            if (Current.SelectBookType == 0)
                                return value;
                            else if (book.BookType == Current.SelectBookType || (Current.SelectBookType == 3 && book.BookType >= 3))
                                return value;
                        }
                    });
                    if (model != null && model.length != 0) {
                        var str = '';
                        /////////////通过教材类型指定跳转备课页面///////////////////
                        if (book.BookType == 1)
                            str += '<li id="' + book.ID + '" class="tongbuList"><a href="PreLesson.aspx';
                        else if (book.BookType == 2)
                            str += '<li id="' + book.ID + '"  class="fudaoList"><a href="PerLessonForJF.aspx';
                        else if ((book.BookType > 2 && book.BookType < 6) || book.BookType==8)
                            str += '<li id="' + book.ID + '"  class="teseList"><a href="PerLessonForTS.aspx';
                        else if (book.BookType==6)
                            str += '<li id="' + book.ID + '"  class="teseList"><a href="PerLessonForTS2.aspx';
                        /////////////页面传递参数///////////////////
                        str += '?BookID=' + book.ID + '&SubjectID=' + book.Subject + '&EditonID=' + book.Edition + '&GradeID=' + book.Grade + '&StageID=' + book.Stage + "&BookReel=" + book.Booklet + "&BookType=" + book.BookType;
                        /////////////判断是否从智慧校园进入///////////////////
                        if (Current.Type != null)
                            str += '&type=' + Current.Type + '&t=' + Current.T + '">';
                        else
                            str += '">';

                        html += str;
                        var img = Constant.resource_Url;
                        if (typeof (model.BookCover) != "undefined")
                            img += model.BookCover
                        else
                            img += "TextBookHandler.ashx?OP=getImg&BookID=" + book.ID
                        var index =0;
                        if (commonFuncJS.CheckName(book.BooKName) != -1)
                            index = commonFuncJS.CheckName(book.BooKName);
                        var name1 = "", name2 = "";
                        name1 = book.BooKName;
                        if (book.BooKName.indexOf("攀登") != -1) {
                            if (book.AgeRange != null)
                                name2 = book.AgeRange + "岁";
                        } else if (book.BooKName.indexOf("拼读") != -1) {
                            if (book.AgeRange != null)
                                name2 = book.AgeRange + "岁";
                        } else if (book.BooKName.indexOf("电影") != -1) {
                            if (book.Grade!=0)
                                name2 = commonFuncJS.IntToCn(book.Grade) + "年级";
                        } else {
                            if (book.Subject == 15) {
                                name1 = book.BooKName.substring(0, index + 5);
                                name2 = book.BooKName.substring(index + 5, book.BooKName.length);
                            }else {
                                name1 = book.BooKName.substring(0, index + 2);
                                name2 = book.BooKName.substring(index + 2, book.BooKName.length);
                            }
                        }
                        html += '<img src="' + img + '" alt="' + book.BooKName + '" /><h4>' + name1 + '</h4><p>' + name2 + '</p>';
                        if (book.BookType == 1)
                            html += '<span><i></i>同步教材</span>';
                        else if (book.BookType == 2)
                            html += '<span><i></i>教材辅导</span>';
                        else if (book.BookType > 2)
                            html += '<span><i></i>特色教材</span>';
                        html += '</li>';
                    }
                });
            }
            if (html != "") {
                $(".searchList.beikeList").show();
                $(".comingSoon").hide();
                $("#divStandBookToSelect").html(html);
                Current.autoMarginList();
                ////////////////添加教材跳转按钮//////////////////
                $("#btnAddBook").unbind("click");
                $("#btnAddBook").click(function () {
                    var book_type = 0;
                    if (Current.SelectBookType == 0)
                        book_type = 1;
                    else
                        book_type = Current.SelectBookType;
                    if (true) {

                    }
                    if (Current.Type != null)
                        location.href = "AddStandBook.aspx?BookType=" + book_type + "&type=" + Current.Type + "&t=" + Current.T;
                    else
                        location.href = "AddStandBook.aspx?BookType=" + book_type;
                });
                $("#divStandBookToSelect li").each(function(l,li) {
                    $(li).click(function() {
                        var bookID = $(this).attr("id");
                        commonFuncJS.UpdateStanBookUsingTime(Current.UserID,bookID);
                    });
                });
            } else {
                $(".searchList.beikeList").hide();
                $(".comingSoon").show();
            }
        });

    };


    this.DeleteUserPre = function () {
        preLessonManagement.DeleteUserPreLesson(Current.UserID);
        alert("已清除备课数据");
    };
};

var previewInit;
$(function () {
    previewInit = new PreviewInit();
    previewInit.Init();
})
$(window).resize(function () {
    previewInit.autoMarginList();
})