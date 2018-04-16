var PreLessonManagement = PreLessonManagement || {};
PreLessonManagement = this;
PreLessonManagement.Template = PreLessonManagement.Template || {};
PreLessonManagement.Template.Manage = PreLessonManagement.Template.Manage || {};
PreLessonManagement.Template.Manage = function () {
    this.GetBookListForTop = function (userID) {
        var obj = { UserID: userID };
        return Common.Ajax("BasicDataImplement", "GetBookListForTop", obj).Data;
    };
    this.GetBookList = function () {
        var obj = {};
        return Common.Ajax("BasicDataImplement", "GetBookList", obj).Data;
    };
    //////////////////////////////////////////////////
    ////////////////////获取科目数据//////////////////
    //////////////////////////////////////////////////
    this.GetSubjectList = function () {
        var obj = {};
        return Common.Ajax("BasicDataImplement", "GetSubjectList", obj).Data;
    };
    //////////////////////////////////////////////////
    ////////////////////获取年级数据//////////////////
    //////////////////////////////////////////////////
    this.GetGradeList = function () {
        var obj = {};
        return Common.Ajax("BasicDataImplement", "GetGradeList", obj).Data;
    };
    //////////////////////////////////////////////////
    ////////////////////获取版本数据//////////////////
    //////////////////////////////////////////////////
    this.GetEditionList = function () {
        var obj = {};
        return Common.Ajax("BasicDataImplement", "GetEditionList", obj).Data;
    };
    //////////////////////////////////////////////////
    ////////////////////获取教材数据//////////////////
    //////////////////////////////////////////////////
    this.GetStandBookList = function () {
        var obj = {};
        return Common.Ajax("BasicDataImplement", "GetStandBookList", obj).Data;
    };
    //////////////////////////////////////////////////
    ///////////////通过条件获取教材数据///////////////
    //////////////////////////////////////////////////
    this.GetStandBookListByWhere = function (stage, grade, subject, edition, booklet) {
        var obj = { Stage: stage, Grade: grade, Subject: subject, Edition: edition, Booklet: booklet };
        return Common.Ajax("BasicDataImplement", "GetStandBookListByWhere", obj).Data;
    };
    //////////////////////////////////////////////////
    ///////////通过目录ID获取HTML页码数据/////////////
    //////////////////////////////////////////////////
    this.GetPageListByCatalogID = function (cataID) {
        var obj = { id: cataID };
        return Common.Ajax("BasicDataImplement", "GetPageListByCatalogID", obj).Data;
    };
    //////////////////////////////////////////////////
    ///////////通过教材ID获取页面json数据/////////////
    //////////////////////////////////////////////////
    this.GetPageJsByBookID = function (bookID) {
        var obj = { ID: bookID };
        return Common.Ajax("BasicDataImplement", "GetPageJsByBookID", obj).Data;
    };
    ////////////////////////////////////////////////////////
    ////////////////////获取用户的教材数据//////////////////
    ////////////////////////////////////////////////////////
    this.GetUserStandBook = function (userID) {
        var obj = { UserID: userID };
        return Common.Ajax("BasicDataImplement", "GetUserStandBook", obj).Data;
    };

    ////////////////////////////////////////////////////////
    ////////////////////添加用户的教材数据//////////////////
    ////////////////////////////////////////////////////////
    this.AddUserStandBook = function (userID, booklist) {
        var obj = { UserID: userID, StandBookList: booklist };
        return Common.Ajax("TeachImplement", "AddUserStandBook", obj).Data;
    };
    ////////////////////////////////////////////////////////
    ////////////////////保存用户的备课数据//////////////////
    ////////////////////////////////////////////////////////
    this.SaveUserPresson = function (userID, userType, bookID, subID, ediID, graID, cataID, pageIndex, preLessonContent) {
        var page_arr = pageIndex.split(","); var json_arr = preLessonContent.split("#");
        var list = [];
        for (var i = 0; i < page_arr.length; i++) {
            list.push(
            { UserID: userID, Type: userType, BookID: bookID, SubjectID: subID, EditionID: ediID, GradeID: graID, UnitID: cataID, Page: page_arr[i], PreLessonContent: json_arr[i] }
            );
        }
        return Common.Ajax("TeachImplement", "SaveUserPresson", list).Data;
    };
    ////////////////////////////////////////////////////////
    ////////////////////获取用户的备课数据//////////////////
    ////////////////////////////////////////////////////////
    this.GetUserPressonJsonByWhere = function (userID, bookID, pageIndex) {
        var obj = { UserID: userID, BookID: bookID, Page: pageIndex };
        return Common.Ajax("TeachImplement", "GetUserPressonJsonByWhere", obj).Data;
    };
    ////////////////////////////////////////////////////////
    ////////////////////获取用户的资源数据//////////////////
    ////////////////////////////////////////////////////////
    this.GetUserResource = function (userID, cataID) {
        var obj = { UserID: userID, UnitID: cataID };
        return Common.Ajax("TeachImplement", "GetUserResource", obj).Data;
    };
    ////////////////////////////////////////////////////////
    ////////////////////检索资源////////////////////////////
    ////////////////////////////////////////////////////////
    this.GetUserResourceByKey = function (userID, subID, key) {
        var obj = { UserID: userID, SubjectID: subID, ResourceName: key };
        return Common.Ajax("TeachImplement", "GetUserResourceByKey", obj).Data;
    };
    ////////////////////////////////////////////////////////
    ////////////////////保存用户上传资源/////////////////////
    ////////////////////////////////////////////////////////
    this.SaveUserUploadResource = function (userID, userName, fileID, fileName, fileExtension, fileSize, filePath, fileType, subjectID, editionID, gradeID, cataID, resourceStyle) {
        var obj = [];
        obj.push({
            UserID: userID, UserName: userName, FileID: fileID, FileName: fileName,
            FileExtension: fileExtension, FileSize: fileSize, FilePath: filePath,
            FileType: fileType, SubjectID: subjectID, EditionID: editionID, GradeID: gradeID,
            Catalog: cataID, ResourceStyle: resourceStyle
        });

        return Common.Ajax("TeachImplement", "SaveUserUploadResource", obj).Data;
    };
    ////////////////////////////////////////////////////////
    ////////////////////删除用户上传资源/////////////////////
    ////////////////////////////////////////////////////////
    this.DelUserResource = function (resIDs, userID) {
        var obj = { ResourceID: resIDs, UserID: userID };
        return Common.Ajax("BasicDataImplement", "DelUserResource", obj).Data;
    };
    ////////////////////////////////////////////////////////
    ////////////////////检查备课中的资源/////////////////////
    ////////////////////////////////////////////////////////
    this.CheckPreLessonResource = function (userID, resIDs) {
        var obj = { UserID: userID, ResourceID: resIDs };
        return Common.Ajax("TeachImplement", "CheckPreLessonResource", obj).Data;
    };
    ////////////////////////////////////////////////////////
    ////////////////////获取校本资源////////////////////////
    ////////////////////////////////////////////////////////
    this.GetSchoolResourceList = function (subjectID, unitID, pageIndex, pageSize, resourceStyle) {
        var obj = { PageIndex: pageIndex, Catalogs: unitID, PageSize: pageSize, SubjectID: subjectID, ResourceStyle: resourceStyle };
        return Common.Ajax("TeachImplement", "GetSchoolResourceList", obj).Data;
    };
    ////////////////////////////////////////////////////////
    ////////////////////获取教学地图数据/////////////////////
    ////////////////////////////////////////////////////////
    this.GetStandBookMap = function (userID, bookID, unitID) {
        var obj = { UserID: userID, BookID: bookID, UnitID: unitID };
        return Common.Ajax("TeachImplement", "GetUserTeachMapJsonByWhere", obj).Data;
    };
    ////////////////////////////////////////////////////////
    ////////////////////保存教学地图数据/////////////////////
    ////////////////////////////////////////////////////////
    this.SaveUserTeachMap = function (userID, userType, bookID, unitID, mapContent) {
        var obj = { UserID: userID, Type: userType, bookId: bookID, unitId: unitID, MapContent: mapContent };
        return Common.Ajax("TeachImplement", "SaveUserTeachMap", obj).Data;
    };
    ////////////////////////////////////////////////////////
    ////////////////////用户分享资源////////////////////////
    ////////////////////////////////////////////////////////
    this.ShareUserResource = function (userID, resourceIDs) {
        var obj = { UserID: userID, ResourceIDs: resourceIDs };
        return Common.Ajax("TeachImplement", "ShareUserResource", obj).Data;
    };

    ////////////////////////////////////////////////////////
    ////////////////////删除用户的备课资源//////////////////
    ////////////////////////////////////////////////////////
    this.DeletePreLessonResource = function (userID, resourceFile) {
        var obj = { UserID: userID, sourceUrl: resourceFile };
        return Common.Ajax("TeachImplement", "DeletePreLessonResource", obj).Data;
    };
    ////////////////////////////////////////////////////////
    ////////////////////删除用户的备课资源//////////////////
    ////////////////////////////////////////////////////////
    this.DeleteUserPreLesson = function (userID) {
        var obj = { UserID: userID};
        return Common.Ajax("TeachImplement", "DeletePreLesson", obj).Data;
    };
}

var preLessonManagement = new PreLessonManagement.Template.Manage();



/////////////////////////////////////////////////////////////////////////////
///////////////////备课页面公共js函数类///////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
var PreLessonCommonFunc = PreLessonCommonFunc || {};
PreLessonCommonFunc.Template = PreLessonCommonFunc.Template || {};
PreLessonCommonFunc.Template.Management = PreLessonCommonFunc.Template.Management || {};
PreLessonCommonFunc.Template.Management = function () {
    //////////////////////////////////////////////////////
    ///////////////绑定页签切换///////////////////////////
    //////////////////////////////////////////////////////
    this.BindTabCheck = function () {
        $("#tablist li").on("click", function () {
            $("#tablist li").removeClass("active");
            $(this).addClass("active");
            preLessonPageInit.ChangeDiv(this);
            $("#divSaveUplaod").css({ "height": "0", "padding": "0" });
            $("#tbSetResourceInfo tbody").html("");
            preLessonPageInit.TabType = $(this).html();
            preLessonPageInit.ResourceType = 0;
            preLessonPageInit.InitResource();
            autoWidth();
        });
    };
    //////////////////////////////////////////////////////
    ///////////////返回按钮绑定///////////////////////////
    //////////////////////////////////////////////////////
    this.BindBlackClick = function () {
        $("#btnBlack").click(function () {
            if (isOrNotOperation() || sessionS.get("operation")) {
                //////////检查是否有页面cookies/////////////
                commonFuncJS.openConfirm('是否保存已修改信息？', function () {
                    saveJson("1");
                    if (preLessonPageInit.Type != null)
                        location.href = "UserStandBook.aspx?type=" + preLessonPageInit.Type + "&t=" + preLessonPageInit.T;
                    else
                        location.href = "UserStandBook.aspx";
                    clearOperation();//清空操作数
                    $("#divPagebox li").each(function (l, li) {
                        var pagenum = $(li).attr("id");
                        var returnVal = isHasSession(pagenum);
                        if (returnVal != null)
                            sessionS.del(pagenum);
                    });
                    sessionS.del("itemArr");
                    sessionS.del("mapArr");
                }, function () {
                    clearOperation();//清空操作数
                    //$("#divPagebox li").each(function (l, li) {
                    //    var pagenum = $(li).attr("id");
                    //    var returnVal = isHasSession(pagenum);
                    //    if (returnVal != null)
                    //        sessionS.del(pagenum);
                    //});
                    //sessionS.del("itemArr");
                    //sessionS.del("mapArr");
                    sessionS.delAll();  //清空所有的localStorage
                    preLessonPageInit.IsSame = false;
                    if (preLessonPageInit.Type != null)
                        location.href = "UserStandBook.aspx?type=" + preLessonPageInit.Type + "&t=" + preLessonPageInit.T;
                    else
                        location.href = "UserStandBook.aspx";
                });
            } else {
                //$("#divPagebox li").each(function (l, li) {
                //    var pagenum = $(li).attr("id");
                //    var returnVal = isHasSession(pagenum);
                //    if (returnVal != null)
                //        sessionS.del(pagenum);
                //});
                //sessionS.del("itemArr");
                //sessionS.del("mapArr");
                sessionS.delAll();  //清空所有的localStorage
                if (preLessonPageInit.Type != null)
                    location.href = "UserStandBook.aspx?type=" + preLessonPageInit.Type + "&t=" + preLessonPageInit.T;
                else
                    location.href = "UserStandBook.aspx";
            }
            //sessionS.del("operation");  //返回不管是否 都删除放映页过来的操作数("operation");
        });
    };

    //////////通过当前页面加载资源HTML//////////
    this.GetResourceHtmlByPageIndex = function (resourcelist, subjectID, editionID, comeFrom) {
        var html = "";
        $.each(resourcelist, function (r, resource) {
            if (resource.FileType.toLowerCase().indexOf("swf") == -1) {
                var fileID = resource.FileID.replace("{", "").replace("}", "");
                if (typeof (resource.ComeFrom) != "undefined")
                    var img = Constant.file_Url + "GetFileImg.ashx?fileID=" + fileID + "&view=true";
                else
                    var img = preLessonCom.GetImgUrl(resource);
                var typeID = "";
                if (resource.ResourceType == 1 || resource.ResourceType == 7 || resource.ResourceType == 0 || resource.ResourceType == null) {
                    typeID = resource.ResourceStyle
                } else {
                    typeID = resource.ResourceType
                }
                var resourceID = "";
                if (typeof (resource.ID) != "undefined")
                    resourceID = resource.ID;
                else
                    resourceID = resource.ResourceID;
                if (resource.Edition == 67)
                    html += '<div id="' + resourceID + '" ComeFrom="' + comeFrom + '" class="dragEnable" typeIco="' + typeID + '_1" ';
                else
                    html += '<div id="' + resourceID + '" ComeFrom="' + comeFrom + '" class="dragEnable" typeIco="' + typeID + '" ';
                html += 'hidSrc="' + fileID + '" hidId="p_1" title="拖动我到左边框中">';
                var name = "";
                if (typeof (resource.Title) == "undefined")
                    name = resource.ResourceName;
                else
                    name = resource.Title;
                html += '<img src="' + img + '"/><span>' + name + '</span></div>';
            }
        });
        return html;
    };
    //////////////////////////////////////////////////
    ///////////////资源检索加载HTML///////////////////
    //////////////////////////////////////////////////
    this.GetSearchResourceHtmlByPageIndex = function (resourcelist) {
        var html = "";
        $.each(resourcelist, function (r, resource) {
            if (r < preLessonPageInit.PageIndex * preLessonPageInit.PageSize && r >= preLessonPageInit.PageSize * (preLessonPageInit.PageIndex - 1)) {
                if (resource.FileType.toLowerCase().indexOf("swf") == -1) {
                    var fileID = resource.FileID.replace("{", "").replace("}", "");
                    if (typeof (resource.ComeFrom) != "undefined")
                        var img = Constant.file_Url + "GetFileImg.ashx?fileID=" + fileID + "&view=true";
                    else
                        var img = preLessonCom.GetImgUrl(resource);
                    var typeID = "";
                    if (resource.ResourceType == 1 || resource.ResourceType == 7 || resource.ResourceType == 0 || resource.ResourceType == null) {
                        typeID = resource.ResourceStyle
                    } else {
                        typeID = resource.ResourceType
                    }
                    var resourceID = "";
                    if (typeof (resource.ID) != "undefined")
                        resourceID = resource.ID;
                    else
                        resourceID = resource.ResourceID;
                    if (resource.Edition == 67)
                        html += '<div id="' + resourceID + '" class="dragEnable" typeIco="' + typeID + '_1" ';
                    else
                        html += '<div id="' + resourceID + '" class="dragEnable" typeIco="' + typeID + '" ';
                    if (typeof (resource.ComeFrom) != "undefined")
                        html += 'hidSrc="' + fileID + '" ComeFrom="ModResource" hidId="p_1" title="拖动我到左边框中">';
                    else
                        html += 'hidSrc="' + fileID + '" ComeFrom="UserResource" hidId="p_1" title="拖动我到左边框中">';
                    var name = "";
                    if (typeof (resource.Title) == "undefined")
                        name = resource.ResourceName;
                    else
                        name = resource.Title;
                    html += '<img src="' + img + '"/><span>' + name + '</span></div>';
                }
            }
        });
        if (resourcelist.length > preLessonPageInit.PageIndex * preLessonPageInit.PageSize) {
            preLessonCom.BindSrollClick();
        } else {
            $("#divSearchResource").unbind("scroll");
        }
        return html;
    };
    //////////////////////////////////////////////////
    ///////////////资源检索绑定滚动条事件/////////////
    //////////////////////////////////////////////////
    this.BindSrollClick = function () {
        $("#divSearchResource").unbind("scroll");
        $("#divSearchResource").scroll(function () {
            var range = 10; //距下边界长度/单位px  
            var totalheight = 0;
            var srollPos = $("#divSearchResource").scrollTop();
            var srollHeigt = $("#divSearchResource")[0].scrollHeight;
            var conentHeight = parseFloat($("#divSearchResource").height());
            if ((conentHeight + srollPos) >= srollHeigt) {
                preLessonCom.InitMostSearchResource();
            }
        });
    };
    //////////////////////////////////////////////////
    ///////////////资源检索加载更多///////////////////
    //////////////////////////////////////////////////
    this.InitMostSearchResource = function () {
        preLessonPageInit.PageIndex++;
        html = preLessonCom.GetSearchResourceHtmlByPageIndex(preLessonPageInit.ResourceList);//通过当前页面加载资源HTML
        $("#divSearchResource").append(html);
        ////////////绑定H5拖动//////////////
        bindItemsDrag();
    };
    //////////////////////////////////////////////////
    ///////////////获取图片路径///////////////////////
    //////////////////////////////////////////////////
    this.GetImgUrl = function (resource) {
        var img = Constant.school_file_Url + "KingsunFiles/img/";
        if (resource.ResourceStyle == 100) {
            img += "miss.jpg";
        } else {
            if (resource.FileType.indexOf("mp3") != -1 || resource.FileType.indexOf("mav") != -1 || resource.FileType.indexOf("wma") != -1 || resource.FileType.indexOf("wav") != -1) {//音频
                img += "mp3.jpg";
            } else if (resource.FileType.indexOf("mp4") != -1 || resource.FileType.indexOf("wmv") != -1 || resource.FileType.indexOf("avi") != -1 || resource.FileType.indexOf("rm") != -1 || resource.FileType.indexOf("rmvb") != -1 || resource.FileType.indexOf("mkv") != -1 || resource.FileType.indexOf("3gp") != -1 || resource.FileType.indexOf("flv") != -1 || resource.FileType.indexOf("mov") != -1) {//视频
                img += "video.jpg";
            } else if (resource.FileType.indexOf("swf") != -1) {//flash
                img += "flash.jpg";
            } else if (resource.FileType.indexOf("ppt") != -1) {//ppt
                img += "ppt.jpg";
            } else if (resource.FileType.indexOf("doc") != -1) {//word
                img += "word.jpg";
            } else if (resource.FileType.indexOf("xls") != -1) {//Excel
                img += "excel.jpg";
            } else if (resource.FileType.indexOf("txt") != -1) {//文本
                img += "txt.jpg";
            } else if (resource.FileType.indexOf("zip") != -1 || resource.FileType.indexOf("rar") != -1) {//压缩包
                img += "zip.jpg";
            } else if (resource.FileType.indexOf("pdf") != -1) {
                img += "pdf.jpg";
            } else {
                img += resource.FileID + ".jpg";
            }
        }
        return img;
    }
    /////////////////通过接口获取资源数据////
    this.GetResourceByMOD = function (subjectID, unitIDStr, resourceClass, keys, callback) {
        if (resourceClass == "资源检索") {
            $(".insetLoading").show();
            var obj = { KeyWord: keys, Subject: subjectID };
            Common.ResourceAjax("QueryResourceByKeyWord.sun", obj, function (data) {
                $(".insetLoading").hide();
                if (data) {
                    return callback(data.Data);
                }
            });
        } else {
            if (resourceClass != "")
                var obj = { CatalogIds: unitIDStr, ResourceClass: resourceClass };
            else
                var obj = { CatalogIds: unitIDStr };
            Common.ResourceAjax("GetResourceByCatalogIds.sun", obj, function (data) {
                if (data) {
                    return callback(data.Data);
                }
            });
        }

    };
    ///////////获取教材下拉框的html///////////////
    this.GetSelectBookHtml = function (standbooklist, booktype) {
        var html = "";
        $.each(standbooklist, function (b, book) {
            if (book.BookType == booktype) {
                var index = commonFuncJS.CheckName(book.BooKName);
                var name = "";
                if (book.Subject == 15)
                    name = book.BooKName.substring(index + 5, book.BooKName.length);
                else
                    name = book.BooKName.substring(index + 2, book.BooKName.length);
                html += '<option value="' + book.ID + '">' + name + '</option>';
            }
        });
        return html;
    };
    ///////////获取教材///////////////
    this.GetStandBook = function (stage, grade, subject, bookreel, edition, standbook, callback) {
        if (standbook == null || standbook.length == 0) {
            Common.GetSBListByStages(stage, grade, subject, bookreel, edition, function (data) {
                standbook = data.Data.sort(commonFuncJS.CreateCompact("Grade"));
                callback(standbook);
            });
        } else {
            callback(standbook);
        }
    };
    //////////////////////////////////////////////////
    ///////////////加载资源类型下拉框////////////////
    //////////////////////////////////////////////////
    this.InitUploadResourceType = function (fileID, typelist) {
        var typeStr = "";
        if (typelist != null) {
            $.each(typelist, function (n, type) {
                if (n == 10 || n == 9 || n == 4 || n == 5 || n == 28 || n == 100) {
                    if (n == 0)
                        typeStr += '<option value="' + n + '" selected="selected">' + type + '</option>';
                    else
                        typeStr += '<option value="' + n + '">' + type + '</option>';
                }
            });
        } else {
            typeStr += '<option value="1" selected="selected">互动课堂</option>';
            typeStr += '<option value="2">图片</option>';
            typeStr += '<option value="3">音频</option>';
        }
        $("#select" + fileID).html(typeStr);
    };
    ////////////////////////////////////////////////
    //////////////通过后缀名获取文件类型ID//////////
    ////////////////////////////////////////////////
    this.GetFileTypeByExtension = function (extension) {
        var id = 0; var value = extension.toLowerCase();
        if (value.indexOf("ppt".toLowerCase()) != -1 || value.indexOf("pptx".toLowerCase()) != -1)//课件
            id = 10;
        else if (value.indexOf("doc".toLowerCase()) != -1 || value.indexOf("docx".toLowerCase()) != -1 || value.indexOf("pdf".toLowerCase()) != -1) //试卷
            id = 9;
        else if (value.indexOf("mp4".toLowerCase()) != -1 || value.indexOf("rm".toLowerCase()) != -1 || value.indexOf("rmvb".toLowerCase()) != -1 || value.indexOf("wmv".toLowerCase()) != -1 || value.indexOf("avi".toLowerCase()) != -1 || value.indexOf("3gp".toLowerCase()) != -1 || value.indexOf("mkv".toLowerCase()) != -1) //视频
            id = 4;
        else if (value.indexOf("mp3".toLowerCase()) != -1 || value.indexOf("mav".toLowerCase()) != -1 || value.indexOf("wma".toLowerCase()) != -1) //音频
            id = 5;
        else if (value.indexOf("jpg".toLowerCase()) != -1 || value.indexOf("png".toLowerCase()) != -1 || value.indexOf("gif".toLowerCase()) != -1 || value.indexOf("bmp".toLowerCase()) != -1 || value.indexOf("jpeg".toLowerCase()) != -1)//图片
            id = 28;
        else
            id = 100;//其他
        return id;
    };
    ////////////////////////////////////////////////////
    /////////////转换文件大小///////////////////////////
    ////////////////////////////////////////////////////
    this.BytesToSize = function (bytes) {
        if (bytes === 0) return '0 B';
        var k = 1024,
            sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    };
    ////////////////////////////////////////////////////
    /////////////设置自定义上传文件类型/////////////////
    ////////////////////////////////////////////////////
    this.SaveUploadFileType = function () {
        var file_type = "";
        file_type += '.txt,.htm,.html,.rtf,.pdf,.text,.log,';//文本
        file_type += '.doc,.docx,.docm,.dotx,.dotm,';//Word
        file_type += '.xls,.xlsx,.xlsm,.xltx,.xltm,.xlsb,.xlam,';//Excel
        file_type += '.dps,.dpt,.pot,.pps,.ppt,.pptx,.pptm,.ppsx,.ppsm,.potx,.potm,.ppam,';//powerpoint
        file_type += '.jpg,.gif,.tif,.png,.bmp,';//图像
        file_type += '.mp4,.mov,.wmv,.rm,.avi,.mpg,.dat,.vob,';//视频
        file_type += '.wav,.mp3,.wma,.mid,.aif,.vqf,.aac,.ac3,.m4a,.amr,';//音频
        file_type += '.zip,.rar';//压缩包
        file_type += '';
        return file_type;
    };
    //////////////////////////////////////////////
    //////////通过教材ID获取目录//////////////////
    //////////////////////////////////////////////
    this.GetCatalogListByBookID = function (bookID, catalist, callback) {
        if (catalist != null && catalist.length != 0) {
            callback(catalist);
        } else {
            Common.GetCatalogByBookId(bookID, function (data) {
                callback(data);
            });
        }
    };
    //////////////////////////////////////////////
    //////////加载备课页面左侧目录////////////////
    //////////////////////////////////////////////
    this.InitLeftCatalog = function () {
        ///////////////加载目录列表////////////////////            
        var html = "";
        if (preLessonPageInit.BookType != 5) {
            var InitFirst = $("#InitFirstCata").html().split(",");
            if ($.inArray(preLessonPageInit.BookID,InitFirst)==-1) {
                if (preLessonPageInit.CataList[0].title.toLowerCase().indexOf("unit") == -1 || (preLessonPageInit.SubjectID != 3 && typeof (preLessonPageInit.CataList[0].children) != "undefined")) {///////////检查是否为Modul
                    $.each(preLessonPageInit.CataList, function (n, model) {
                        html += '<li id="' + model.id + '" class="module" startpage="' + model.StartPage + '" endpage="' + model.EndPage + '">' + model.title + '</li>';
                        if (typeof (model.children) != "undefined") {
                            $.each(model.children, function (c, cata) {
                                html += '<li id="' + cata.id + '" class="unitclass" startpage="' + cata.StartPage + '" endpage="' + cata.EndPage + '">' + cata.title + '</li>';
                            });
                        }
                    });
                } else {
                    html += preLessonCom.InitFirstCatalog();
                }
            } else {
                html += preLessonCom.InitFirstCatalog();
            }
        } else {
            html += preLessonCom.InitFirstCatalog();
        }
        
        $("#unitList").html(html);
        //////////////绑定目录选中事件//////////////////////
        preLessonPageInit.BindCataClick();
        if (preLessonPageInit.UserFinallyOperationRecord == null) {
            $($(".catalogOl li")[0]).click();
        } else {
            if (preLessonPageInit.UserFinallyOperationRecord.BookID == 0 || (preLessonPageInit.UserFinallyOperationRecord.BookID != preLessonPageInit.SelectBookID && preLessonPageInit.UserFinallyOperationRecord.BookID != preLessonPageInit.BookID)) {
                $($(".catalogOl li")[0]).click();
            } else {
                var catalog = null;
                $(".catalogOl li").each(function (c, cata) {
                    if ($(cata).attr("id") == preLessonPageInit.UserFinallyOperationRecord.UnitID)
                        catalog = cata;
                });
                if (catalog!=null)
                    $(catalog).click();
                else
                    $($(".catalogOl li")[0]).click();
            }
        }
    };
    this.InitFirstCatalog = function () {
        var html = "";
        $.each(preLessonPageInit.CataList, function (n, model) {
            html += '<li id="' + model.id + '" class="module" startpage="' + model.StartPage + '" endpage="' + model.EndPage + '">' + model.title + '</li>';
        });
        return html;
    };

    //////////////////////////////////////////////
    //////////加载教材电子页面////////////////////
    //////////////////////////////////////////////
    this.InitCataPage = function (startpage, endpage) {
        var pagelist = [];
        for (var i = parseInt(startpage) ; i <= endpage; i++) {
            pagelist.push(i);
        }
        var html = "";
        $.each(pagelist, function (p, page) {
            if (p == 0)
                html += '<li id="' + page + '" class="on"><a href="javascript:void(0)" hidPage="' + page + '" onClick="changePage(this)">第' + page + '页</a></li>';
            else
                html += '<li id="' + page + '" ><a href="javascript:void(0)" hidPage="' + page + '" onClick="changePage(this)">第' + page + '页</a></li>';
        });
        $("#divPagebox").html(html);
        $("#divPagebox li a").each(function (n, a) {
            $(a).click(function () {
                var id = $(a).parent().attr("id");
                var cataid = $("#unitList li.on").attr("id");
                ///////////////记录用户操作///////1:为同步教材//////////////////
                var stage = 0;
                if (preLessonPageInit.StageID != "undefined")
                    preLessonPageInit.StageID = stage;
                commonFuncJS.SavsUserFinallyOperationRecord(preLessonPageInit.UserID, preLessonPageInit.BookType, stage, preLessonPageInit.GradeID, preLessonPageInit.SubjectID, preLessonPageInit.EditionID, preLessonPageInit.BookID, cataid, id);
            });
        });
        setTimeout(function () {
            var obj = null;
            if (preLessonPageInit.UserFinallyOperationRecord != null) {
                if (preLessonPageInit.UserFinallyOperationRecord.BookID == 0 || preLessonPageInit.UserFinallyOperationRecord.BookID != preLessonPageInit.SelectBookID) {
                    obj = $("#divPagebox li a").eq(0).get(0);
                } else if (preLessonPageInit.UserFinallyOperationRecord.PageNum != 0) {
                    $("#divPagebox li").each(function (l, li) {
                        if ($(li).attr("id") == preLessonPageInit.UserFinallyOperationRecord.PageNum) {
                            obj = $("#divPagebox li a").eq(l).get(0);
                        }
                    });
                    if (obj == null)
                        obj = $("#divPagebox li a").eq(0).get(0);
                }
            } else {
                obj = $("#divPagebox li a").eq(0).get(0);
            }
            $(obj).click();
        }, 1);
    };
    //////////////////////////////////////////////
    //用户资源/////////////////////////////////////
    //////////////////////////////////////////////
    //////////加载用户资源////////////////////////
    this.InitUserResourceByCata = function () {
        var all_input = $("#divUserNav").find("input[name='allcheckbox']");
        $(all_input).prop("checked", false);
        preLessonPageInit.FileList = [];
        var resourcelist = preLessonManagement.GetUserResource(preLessonPageInit.UserID, preLessonPageInit.SelectUnitID);
        var html = "";
        if (resourcelist != null && resourcelist.length != 0) {
            $.each(resourcelist, function (n, resource) {
                resource.ResourceCreaterDate = resource.ResourceCreaterDate.replace("T", " ");
                resource.ResourceCreaterDate = resource.ResourceCreaterDate.split(".")[0];
            });
            resourcelist.sort(commonFuncJS.CreateAscCompact("ResourceCreaterDate"));
            $("#divUserResource").show();
            $("#divUserComingSoon").hide();
            $.each(resourcelist, function (r, resource) {
                if (resource.Catalog == preLessonPageInit.SelectUnitID) {
                    ///////////////获取文件缩略图///////////////////
                    var img = preLessonCom.GetImgUrl(resource);
                    html += '<li id="' + resource.ResourceID + '">';
                    html += '<label><input type="checkbox" onclick="preLessonCom.OneCheckBoxClick()" /><span></span></label>';
                    html += '<div ComeFrom="UserResource" class="dragEnable" typeIco="' + resource.ResourceStyle + '" hidSrc="' + resource.FileID + '" hidId="p_5" title="拖动我到左边框中">';
                    html += '<em class="imgBox"><img src="' + img + '" alt="" /></em><span><em>' + resource.ResourceName + '</em></span><b>' + resource.ResourceCreaterDate + '</b></div>';//Common.FormatTime(resource.ResourceCreaterDate, "yyyy-MM-dd hh:mm")
                    if (resource.ShareStauts == 0) {
                        html += '<a class="shareToSchool no" title="分享至校本资源">分享</a>';
                    } else if (resource.ShareStauts == 1) {
                        html += '<a class="shareToSchool inReview" title="审核中">审核中</a>';
                    } else if (resource.ShareStauts == 2) {
                        html += '<a class="shareToSchool shared" title="已分享">已分享</a>';
                    } else if (resource.ShareStauts == 3) {
                        html += '<a class="shareToSchool failShare" title="未通过">未通过</a>';
                    }
                    html += '</li>';
                }
            });
            if (html != "") {
                $("#divUserResource ul").show();
                $("#divUserResource ul").html(html);
                $("#divUserNav label input").attr("disabled", false);
                ////////绑定拖动/////////
                bindItemsDrag();
                ////////////绑定全选事件///////////
                preLessonCom.BindCheckBoxClick();
                ////////////绑定删除事件///////////
                preLessonPageInit.DeleteUserResource();
                ////////////改变标题宽度///////////
                uploadW();
                preLessonCom.BindResourceCheck();
                /////////////绑定分享按钮//////////////////
                preLessonCom.BindShareUserResource();
            } else {
                $("#divUserResource ul").html("");
                $("#divUserResource").hide();
                $("#divUserComingSoon").show();
                $("#divUserNav label input").attr("disabled", true);
            }
        } else {
            $("#divUserResource").hide();
            $("#divUserComingSoon").show();
            $("#divUserNav label input").attr("disabled", true);
        }
    };
    /////////////绑定分享按钮//////////////////
    this.BindShareUserResource = function () {
        var shareBtn = $("#divUserResource ul li a.shareToSchool.no");
        $.each(shareBtn, function (m, btn) {
            $(btn).unbind("click");
            $(btn).click(function () {
                commonFuncJS.openConfirm("您确定要分享到校本资源库？",
                    function () {
                        var resourceID = $($(btn).parent()).attr("id");
                        commonFuncJS.SaveOperationRecord(preLessonPageInit.UserID, preLessonPageInit.UserType, Constant.OperType.ShareResource_TYPE, "分享资源:" + resourceID);
                        var result = preLessonManagement.ShareUserResource(preLessonPageInit.UserID, resourceID);
                        if (result == 1) {
                            $(btn).attr("class", "shareToSchool inReview");
                            $(btn).attr("title", "审核中");
                            $(btn).html("审核中");
                        } else if (result == 2) {
                            $(btn).attr("class", "shareToSchool shared");
                            $(btn).attr("title", "已分享");
                            $(btn).html("已分享");
                        } else {
                            commonFuncJS.openConfirm("分享失败");
                        }
                        if (result != 0)
                            $(btn).unbind("click");
                    }, function () {

                    });
            });
        });
    };

    ////////////////////////////////////////////
    //校本资源//////////////////////////////////
    ////////////////////////////////////////////
    ////////////通过目录加载校本资源////////////
    this.InitSchoolResourceByCata = function () {
        preLessonPageInit.PageIndex++;
        var result = JSON.parse(preLessonManagement.GetSchoolResourceList(preLessonPageInit.SubjectID, preLessonPageInit.UnitStr, preLessonPageInit.PageIndex, preLessonPageInit.PageSize, preLessonPageInit.ResourceType));
        if (result != null && result.PageCount >= preLessonPageInit.PageIndex) {
            $("#divSchoolResource").show();
            $("#divSchoolComingSoon").hide();
            preLessonPageInit.ResourceList = result.Data;
            var html = preLessonCom.GetResourceHtmlByPageIndex(preLessonPageInit.ResourceList, preLessonPageInit.SubjectID, preLessonPageInit.EditionID,"UserResource");//通过当前页面加载资源HTML
            $("#divSchoolResource").append(html);
            ////////绑定拖动/////////
            bindItemsDrag();
            preLessonCom.BindSchoolSrollClick(result.PageCount);
        } else if (result == null || result.TotalCount == 0) {
            $("#divSchoolResource").hide();
            $("#divSchoolComingSoon").show();
        }
        autoWidth();
    };
    //////////////绑定滚动条事件////////////////
    this.BindSchoolSrollClick = function (totalpage) {
        if (totalpage <= preLessonPageInit.PageIndex) {
            $("#divSchoolResource").unbind("scroll");
        } else {
            $("#divSchoolResource").unbind("scroll");
            $("#divSchoolResource").scroll(function () {
                var range = 10; //距下边界长度/单位px  
                var totalheight = 0;
                var srollPos = $("#divSchoolResource").scrollTop();
                var srollHeigt = $("#divSchoolResource")[0].scrollHeight;
                var conentHeight = parseFloat($("#divSchoolResource").height());
                if ((conentHeight + srollPos) >= srollHeigt) {
                    preLessonCom.InitSchoolResourceByCata();
                }
            });
        }
    };
    /////////////加载资源类型///////////////////
    this.InitSchoolResourceType = function () {
        $.get(Constant.webapi_Url + "GetResourceType", function (tytplist) {
            var html = '<a href="javascript:void(0)" hidsourcetype="0" class="cur">全部</a>';
            $.each(tytplist, function (t, type) {
                html += '<a href="javascript:void(0)" hidsourcetype="' + t + '">' + type + '</a>';
            });
            $("#divSchoolTypeList").html(html);
            $("#divSchoolTypeList a").each(function (l, a) {
                $(a).unbind("click");
                $(a).click(function () {
                    $("#divSchoolResource").html("");
                    $(a).parent().find("a").removeClass("cur");
                    $(a).addClass("cur");
                    preLessonPageInit.ResourceType = $(this).attr("hidsourcetype");
                    preLessonPageInit.PageIndex = 0;
                    preLessonCom.InitSchoolResourceByCata();
                });
            });
            $($("#divSchoolTypeList a")[0]).click();
        });
    }


    //////////////////////////////////////////
    /////////////绑定全选事件/////////////////
    //////////////////////////////////////////
    this.BindCheckBoxClick = function () {
        var input = $("#divUserNav").find("input[name='allcheckbox']");
        $(input).unbind("click");
        $(input).click(function () {
            var list = $("#divUserResource ul li label input");
            if (this.checked)
                list.prop("checked", true);
            else
                list.prop("checked", false);
        });
    };
    this.OneCheckBoxClick = function () {
        var all_length = $("#divUserResource ul li label input").length;
        var check_length = $("#divUserResource ul li label input:checked").length;
        var all_input = $("#divUserNav").find("input[name='allcheckbox']");
        if (all_length > check_length)
            $(all_input).prop("checked", false);
        else
            $(all_input).prop("checked", true);
    };
    //////////////////////////////////////////
    /////////////绑定资源选中事件/////////////
    //////////////////////////////////////////
    this.BindResourceCheck = function () {
        var list = $("#divUserResource ul li label input");
        $.each(list, function (c, check) {
            $(check).unbind("click");
            $(check).click(function () {
                if (!this.checked) {
                    var arr = $("#divUserResource ul li label input[type='checkbox']:checked");
                    if (arr.length == 0) {
                        $("#divUserNav label input").prop("checked", false);
                    }
                }
            });
        });
    };


    ////////////////////////////////////////
    ///////////加载资源检索/////////////////
    ////////////////////////////////////////
    this.InitSearchResource = function () {
        var value = $("#txtSearchValue").val();
        commonFuncJS.SaveOperationRecord(preLessonPageInit.UserID, preLessonPageInit.UserType, Constant.OperType.SourceSearch_TYPE, "搜索关键字:" + value);
        var user_resourcelist = preLessonManagement.GetUserResourceByKey(preLessonPageInit.UserID, preLessonPageInit.SubjectID ,value);
        preLessonPageInit.ResourceList = user_resourcelist;
        preLessonCom.GetResourceByMOD(preLessonPageInit.SubjectID, preLessonPageInit.UnitStr, "资源检索", value, function (data) {
            if (data != null) {
                var temp = [];
                $.each(data, function (r, resource) {
                    if (resource.FileType.toLowerCase().indexOf("swf") == -1)
                        temp.push(resource);
                });
                if (preLessonPageInit.ResourceList != null)
                    Array.prototype.push.apply(preLessonPageInit.ResourceList, temp);
                else
                    preLessonPageInit.ResourceList = temp;
            }
            if (preLessonPageInit.ResourceList != null && preLessonPageInit.ResourceList.length != 0) {
                $("#divSearchResult").hide();
                $("#divSearchResource").show();
                preLessonPageInit.PageIndex = 1;
                html = preLessonCom.GetSearchResourceHtmlByPageIndex(preLessonPageInit.ResourceList);//通过当前页面加载资源HTML
                $("#divSearchResource").html(html);
                ////////////绑定H5拖动//////////////
                bindItemsDrag();
            } else {
                //openAlert('暂无资源!');
                $("#divSearchResource").html("");
                $("#divSearchResource").hide();
                $("#divSearchResult").show();
            }
        });
    };

    //////////////////////////////////////////////////////////////////////
    ///////////删除页面上的水滴  联级删除教学地图上的资源/////////////////
    //////////////////////////////////////////////////////////////////////
    this.DeletePreLessonAndMapForResource = function (fileIDs) {
        $("#dragPalcer div").each(function (d, div) {
            var fileID = $(div).attr("hidsrc");
            if (fileID != "undefined") {
                if (fileIDs.indexOf(fileID) != -1) {
                    $(div).remove();
                    //级联删除网站地图中相应的节点
                    //var sourceId = $(div).attr("randId");
                    $(".sortTab li a").each(function () {
                        var curSrcId = $(this).attr("hidsrc");
                        if (fileIDs.indexOf(curSrcId) !=-1 ) {
                            var liObj = $(this).parent();
                            $(liObj).remove();
                            //删除成功后更新操作对象的数量
                            var newCount = parseInt(operation.delCount) + 1;
                            operation.delCount = newCount;
                            sessionS.set("operation", JSON.stringify(operation));
                        }
                    });
                }
            }
        });
    };
    //////////////////////////////////////////////////////////////////////
    ///////////删除页面上的备课水滴缓存 教学地图缓存//////////////////////
    //////////////////////////////////////////////////////////////////////
    this.DeletePreLessonAndMapSessionForResource = function (fileIDs, pageTemp) {
        ///////////////删除备课水滴缓存///////////////////
        $.each(pageTemp, function (p, pageIndex) {
            var json = sessionS.get(pageIndex);
            if (json != "") {
                var btns = [];
                var pageItemsJson = JSON.parse(json);
                btns = pageItemsJson.btns;

                $.each(fileIDs, function (f, fileID) {
                    for (var i = btns.length - 1; i >= 0; i--) {
                        if (btns[i].sourceUrl == fileID)
                            btns.splice(i, 1);
                    }
                });
                pageItemsJson.btns = btns;
                json = $.toJSON(pageItemsJson);
                sessionS.set(pageIndex, json);
            }
        });

        ///////////////删除教学地图缓存缓存///////////////////
        var json = sessionS.get("mapArr");
        var mapJson = JSON.parse(json);
        if (json != "" && json != null) {
            $.each(mapJson, function (s, step) {
                $.each(fileIDs, function (f, fileID) {
                    for (var i = step.liList.length - 1; i >= 0; i--) {
                        if (step.liList[i].sourceSrc == fileID)
                            step.liList.splice(i, 1);
                    }
                });
            });
            var json = $.toJSON(mapJson);
            sessionS.set("mapArr", json);
        }
    };
};
var preLessonCom = new PreLessonCommonFunc.Template.Management();