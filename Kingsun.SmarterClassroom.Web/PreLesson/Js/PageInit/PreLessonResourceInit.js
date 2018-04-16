var preOldUnitID;
var PreLessonPageInit = function () {
    var Current = this;

    this.UserID = "";
    this.UserType = "";
    this.UserName = "";
    this.TrueName = "";

    this.TabType = "";//当前选项卡
    this.BookID = "";
    ///////////当前编辑的//////////////////
    this.StageID = "";//学段ID
    this.SubjectID = "";//科目ID
    this.EditionID = "";//版本ID
    this.GradeID = "";//年级ID
    this.CataID = "";//目录ID
    this.ResourceTypeList = [];//资源类型列表

    this.BookType = "";//教材类型
    ///////////资源筛选//////////////////
    this.StandBookList = [];//所有教材
    this.SelectBookID = "";//选择的教材ID
    this.SelectCataID = "";//选择的目录ID
    this.SelectUnitID = "";

    this.PageIndex = 0;
    this.PageSize = 60;

    this.ResourceType = 0;//资源类型

    this.BookPageJs = "";
    this.ResourceList = [];//资源列表

    this.SubjectList = null;


    this.CataList = null;//目录列表
    //记录是否从智慧校园进入
    this.Type = null;
    this.T = "";

    this.UserFinallyOperationRecord = null;
    this.Init = function () {
        var IP = $("#requestip").html();
        Current.UserInfoList = commonFuncJS.CheckLogin(IP);

        Current.Type = getUrlParam('type');
        Current.T = getUrlParam('t');

        Current.StageID = Common.QueryString.GetValue("StageID");
        Current.GradeID = Common.QueryString.GetValue("GradeID");
        Current.SubjectID = Common.QueryString.GetValue("SubjectID");
        Current.EditionID = Common.QueryString.GetValue("EditonID");
        Current.BookType = Common.QueryString.GetValue("BookType");

        var user = Current.UserInfoList;
        if (user == null) {
            return false;
        }
        Current.UserID = user.Id;
        Current.UserType = user.Type;
        Current.UserName = user.UserName;
        Current.TrueName = user.TrueName;

        Current.BookID = Common.QueryString.GetValue("BookID");
        Current.UserFinallyOperationRecord = commonFuncJS.GetUserFinallyOperationRecord(Current.UserID);
        Current.SelectBookID = Current.BookID;
        if (Current.UserFinallyOperationRecord == null || Current.UserFinallyOperationRecord == "") {
            preOldUnitID = -1;
        } else {
            preOldUnitID = Current.UserFinallyOperationRecord.UnitID;
        }
        /////////////获取教材的H5页面db.js//////////
        Current.BookPageJs = Constant.resource_Url + "TextBookHandler.ashx?OP=getDBjs&BookID=" + Current.BookID; // preLessonManagement.GetPageJsByBookID(Current.BookID);// 
        Common.CodeAjax("do.jsonp", "SUB", function (data) {
            Current.SubjectList = data["SUB"];

            /////////////加载教材目录//////////
            Current.InitCatalog();
            Current.TabType = "教材资源";
            commonFuncJS.SaveOperationRecord(Current.UserID, Current.UserType, Constant.OperType.PrelessonM_TYPE, "用户进入备课模块");
            ///////////////绑定页签切换///////////////////////////
            preLessonCom.BindTabCheck();
        });
        

        if (commonFuncJS.OS.isAndroid) {
            $("#btnUpLoadFile").html('<input type="button" class="AjaxUpload_Button upload" value="上传文件">');
            $("#btnUpLoadFile").unbind("click");
            $("#btnUpLoadFile").click(function () {
                var data = Constant.webapi_Url + "Upload?type=1";
                window.WebViewJavascriptBridge.callHandler(
                    'upLoadFile',
                    data,
                    function (responseData) {
                        Current.InitEditionUploadFile(responseData);
                        return false;
                    }
                );
            });
        } else {
            ///////////上传文件按钮//////////////
            Current.UpLoadFileFunc();
        }
        $("#btnRecord").unbind("click");
        $("#btnRecord").click(function () {
            var data = Constant.webapi_Url + "Upload?type=2";
            window.WebViewJavascriptBridge.callHandler(
                'upLoadFile',
                data,
                function (responseData) {
                    Current.InitEditionUploadFile(responseData);
                    return false;
                }
            );
        });
        //点击放映
        $("#btnPlay").bind("click", function () {
            Current.preview();
        });

        ////////////////绑定返回按钮////////////////////
        preLessonCom.BindBlackClick();
    };

    this.ChangeDiv = function (obj) {
        var n = $(obj).attr("class").substring(4, 6);
        var N = '.cont' + n;
        $(".tab").hide();
        if (N) {
            $(N).show();
        }
    };
    ///////////////////////////////////////
    /////////////加载教材目录 左侧/////////
    ///////////////////////////////////////
    this.InitCatalog = function () {
        preLessonCom.GetCatalogListByBookID(Current.BookID, Current.CataList, function (data) {
            Current.CataList = data;
            preLessonCom.InitLeftCatalog();
        });
    };
    this.LastOperateUnitID = "";//最后一次操作的单元id，用以保存教学地图
    ////////////////////////////////////////////////////
    //////////////绑定目录选中事件//////////////////////
    ////////////////////////////////////////////////////
    this.IsSame = false;
    this.BindCataClick = function () {
        $("#unitList li").on("click", function () {
            if (Current.SelectBookID != Current.BookID)
                Current.CataList = null;
            Current.SelectUnitID = "";
            Current.SelectBookID = Current.BookID;
            var li = $(this);
            if (li.attr("class") == "module" && $(li.next()).attr("class") != "module" && li.next().length != 0 && $(li.next()).attr("class").indexOf("module") == -1) {
                $(li.next()).click();
                return false;
            } else {
                Current.LastOperateUnitID = Current.CataID;
                Current.CataID = li.attr("id");
                Current.SelectUnitID = Current.CataID;
            }
            li.addClass('on').siblings().removeClass('on');
            if (Current.CataID == li.attr("id") || Current.CataID == "")
                Current.IsSame = true;

            //console.log(Current.LastOperateUnitID);
            if (Current.UserFinallyOperationRecord != null) {
                if (Current.CataID != preOldUnitID) {
                        console.log(Current.CataID + "," + Current.UserFinallyOperationRecord.UnitID);
                        if (isOrNotOperation()) {  //判断是否操作过教学地图 电子书页
                            //////////检查是否有页面cookies/////////////
                            commonFuncJS.openConfirm('是否保存已修改信息？', function () {
                                saveJson();
                                clearOperation();//清空操作数
                                Current.DeleteSession(li);
                            }, function () {
                                clearOperation();//清空操作数
                                sessionS.delAll();  //删除所有session信息
                                //Current.IsSame = false;
                                Current.DeleteSession(li);
                            });
                        } else {
                            if (!sessionS.get("operation")) {
                                sessionS.delAll();  //删除所有session信息
                            }
                            else {
                                //////////检查是否有页面cookies/////////////
                                commonFuncJS.openConfirm('是否保存已修改信息？', function () {
                                    saveJson();
                                    sessionS.delAll();  //删除所有session信息
                                    Current.DeleteSession(li);
                                }, function () {
                                    sessionS.delAll();  //删除所有session信息
                                    //Current.IsSame = false;
                                    Current.DeleteSession(li);
                                });
                            }
                            Current.DeleteSession(li);
                        }
                        ////pad端 点击放映放回备课，获取操作值
                        //var operationS = sessionS.get("operation");
                        //if (operationS) {
                        //    operation = JSON.parse(operationS);
                        //    sessionS.del("operation");
                        //}
                        //sessionS.del("itemArr"); //删除页码集合的session信息
                        //sessionS.del("mapArr"); //删除教学地图的session信息                    
                } else {
                    //pad端 点击放映放回备课，获取操作值
                    var operationS = sessionS.get("operation");
                    if (operationS) {
                        operation = JSON.parse(operationS);
                        //sessionS.del("operation");
                    }
                    Current.DeleteSession(li);
                    preOldUnitID = Current.CataID;
                        
                    }
            } else {
                Current.DeleteSession(li);
            }
            
        });

    };
    this.DeleteSession = function (nowli) {
        //$("#divPagebox li").each(function (l, li) {
        //    var pagenum = $(li).attr("id");
        //    var returnVal = isHasSession(pagenum);
        //    if (returnVal != null) {
        //        sessionS.del(pagenum);
        //    }
        //});
        Current.ChangeInit(nowli);
    }

    this.ChangeInit = function (li) {     
        var unitname = li.text(); var txtname = "";
        if (unitname.toLowerCase().indexOf("unit") != -1 || unitname.toLowerCase().indexOf("recycle") != -1) {
            var strArr = unitname.split(" ");
            if (typeof (strArr[1]) != "undefined")
                txtname = strArr[0] + " " + strArr[1];
            else
                txtname = strArr[0];
        } else {
            txtname = unitname;
        }
        Current.SelectCataID = Current.CataID;
        $("#unitFull").text(unitname);
        $(".pageList h3#unitName label").text(txtname);
        slideAnimate("close");
        var startpage = $(li).attr("startpage");
        var endpage = $(li).attr("endpage");
        //////////////加载目录页面/////////////////////
        preLessonCom.InitCataPage(startpage, endpage);
        /////////加载资源///////////
        Current.InitResource();
    };
    ////////////////////////////////////
    /////////加载资源搜索选项///////////
    ////////////////////////////////////
    this.InitResource = function () {
        if (Current.TabType == "教材资源") {
            commonFuncJS.SaveOperationRecord(Current.UserID, Current.UserType, Constant.OperType.SynSource_TYPE, "用户进入备课:教材资源模块");
            Current.InitSyncResource();//教材资源
        } else if (Current.TabType == "特色资源") {
            commonFuncJS.SaveOperationRecord(Current.UserID, Current.UserType, Constant.OperType.ExpSource_TYPE, "用户进入备课:特色资源模块");
            //////////加载特色资源下的资源类型/////////////////
            Current.InitExpandResourceType();
        } else if (Current.TabType == "校本资源") {
            commonFuncJS.SaveOperationRecord(Current.UserID, Current.UserType, Constant.OperType.SchoolSource_TYPE, "用户进入备课:校本资源模块");
            Current.InitSchoolResource();
        } else if (Current.TabType == "我的资源") {
            commonFuncJS.SaveOperationRecord(Current.UserID, Current.UserType, Constant.OperType.UserSource_TYPE, "用户进入备课:我的资源模块");
            $("#divUserResource").scrollTop(0);
            Current.InitUserResource();//我的资源
        } else if (Current.TabType == "资源检索") {
            $("#txtSearchValue").val("");
            $("#divSearchResource").html('<div class="insetLoading" style="display: none"><i></i></div>');
            $("#benSearch").unbind("click");
            $("#benSearch").click(function () {
                $("#divSearchResource").html('<div class="insetLoading" style="display: none"><i></i></div>');
                Current.PageIndex = 0;
                preLessonCom.InitSearchResource();
            });
        }
    };
    ////////////////////////////////////////
    ///////////加载校本资源/////////////////
    ////////////////////////////////////////
    this.InitSchoolResource = function () {
        var html = preLessonCom.GetSelectBookHtml(Current.StandBookList, Current.BookType);
        $("#selectSchoolBook").html(html);
        ////////绑定教材选中事件////////
        $("#selectSchoolBook").unbind("change");
        $("#selectSchoolBook").change(function () {
            if (Current.SelectBookID != $(this).children('option:selected').val()) {
                Current.SelectCataID = "";
                Current.CataList = null;
            }
            Current.SelectBookID = $(this).children('option:selected').val();
            //////////加载校本资源下的教材目录/////////////////
            Current.InitSchoolResourceCata();
        });
        $('#selectSchoolBook').val(Current.SelectBookID).change();
    };
    ///////////////////////////////////////////////////
    ///////////加载校本资源下的教材目录////////////////
    ///////////////////////////////////////////////////
    this.InitSchoolResourceCata = function () {
        preLessonCom.GetCatalogListByBookID(Current.SelectBookID, Current.CataList, function (data) {
            Current.CataList = data;
            ///////////////加载目录列表////////////////////
            var html = "";
            $.each(Current.CataList, function (u, unit) {
                var name = unit.title;
                html += '<option value="' + unit.id + '">' + name + '</option>';
            });
            $("#selectSchoolCatalog").html(html);
            ////////绑定目录选中事件////////
            $("#selectSchoolCatalog").unbind("change");
            $("#selectSchoolCatalog").change(function () {
                Current.PageIndex = 0;
                var InitFirst = $("#InitFirstCata").html().split(",");
                /////////////加载两级目录/////////////////
                if ((Current.CataList[0].title.toLowerCase().indexOf("unit") == -1 || (Current.SubjectID != 3 && typeof (Current.CataList[0].children) != "undefined")) && $.inArray(preLessonPageInit.BookID, InitFirst) == -1) {
                    Current.SelectCataID = $(this).children('option:selected').val();
                    $("#selectSchoolUnit").show();
                    $.each(Current.CataList, function (n, cata) {
                        if (cata.id == Current.SelectCataID) {
                            if (typeof (cata.children) != "undefined") {
                                Current.InitSchoolResourceUnit(cata.children);
                                return false;
                            } else {
                                Current.PageIndex = 0;
                                $("#divSchoolResource").html("");
                                $("#selectSchoolUnit").hide();
                                Current.SelectUnitID = "";
                                ////////////获取单元及其子级目录ID////////////////
                                Current.GetUnitIDStrFunc(Current.CataList);
                                //////////通过目录加载教材资源/////////////////
                                preLessonCom.InitSchoolResourceType();
                            }
                        }
                    });
                } else {
                    Current.PageIndex = 0;
                    $("#divSchoolResource").html("");
                    $("#selectSchoolUnit").hide();
                    Current.SelectUnitID = "";
                    Current.SelectCataID = $(this).children('option:selected').val();
                    ////////////获取单元及其子级目录ID////////////////
                    Current.GetUnitIDStrFunc(Current.CataList);
                    //////////通过目录加载教材资源/////////////////
                    preLessonCom.InitSchoolResourceType();
                }
            });
            var now_cata = null;
            $.each(Current.CataList, function (n, cata) {
                if (typeof (cata.children) != "undefined") {
                    $.each(cata.children, function (u, unit) {
                        if (unit.id == Current.SelectCataID) {
                            now_cata = cata;
                            return false;
                        }
                    });
                } else {
                    if (cata.id == Current.SelectCataID) {
                        now_cata = cata;
                        return false;
                    }
                }
                if (now_cata != null)
                    return false;
            });
            if (now_cata == null) {
                if (Current.SelectCataID != "") {
                    $('#selectSchoolCatalog').val(Current.SelectCataID).change();
                } else {
                    $('#selectSchoolCatalog').val(Current.CataList[0].id).change();
                }
            }
            else {
                Current.SelectUnitID = Current.SelectCataID;
                $('#selectSchoolCatalog').val(now_cata.id).change();
            }
        });
    };
    //////////////////////////////////////////////////
    ////////////加载校本资源二级目录选择框////////////
    /////////////////////////////////////////////////
    this.InitSchoolResourceUnit = function (unitlist) {
        var html = "";
        $.each(unitlist, function (u, unit) {
            var name = unit.title;
            html += '<option value="' + unit.id + '">' + name + '</option>';
        });
        $("#selectSchoolUnit").html(html);
        ////////绑定目录选中事件////////
        $("#selectSchoolUnit").unbind("change");
        $("#selectSchoolUnit").change(function () {
            $("#divSchoolResource").html("");
            Current.PageIndex = 0;
            Current.SelectUnitID = $(this).children('option:selected').val();
            ////////////获取单元及其子级目录ID////////////////
            Current.GetUnitIDStrFunc(unitlist);
            //////////通过目录加载教材资源/////////////////
            preLessonCom.InitSchoolResourceType();
        });
        if (Current.SelectUnitID == "") {
            Current.SelectUnitID = unitlist[0].id;
        } else {
            var now_unit = null;
            $.each(unitlist, function (u, unit) {
                if (unit.id == Current.SelectUnitID) {
                    now_unit = unit;
                    return false;
                }
            });
            if (now_unit != null)
                Current.SelectUnitID = now_unit.id;
            else
                Current.SelectUnitID = unitlist[0].id;
        }
        $('#selectSchoolUnit').val(Current.SelectUnitID).change();
    };

    ////////////////////////////////////////
    ///////////加载我的资源/////////////////
    ////////////////////////////////////////
    this.InitUserResource = function () {
        $("#tabUpload").html("");
        $("#tbSetResourceInfo").html("");
        $("#tbSetResourceInfo").hide();
        var html = preLessonCom.GetSelectBookHtml(Current.StandBookList, Current.BookType);
        $("#selectUserBook").html(html);
        ////////绑定教材选中事件////////
        $("#selectUserBook").unbind("change");
        $("#selectUserBook").change(function () {
            if (Current.SelectBookID != $(this).children('option:selected').val()) {
                Current.SelectCataID = "";
                Current.CataList = null;
            }
            Current.SelectBookID = $(this).children('option:selected').val();
            //////////加载我的资源下的教材目录/////////////////
            Current.InitUserResourceCata();
        });
        $('#selectUserBook').val(Current.SelectBookID).change();
    };
    ///////////////////////////////////////////////////
    //////////加载我的资源下的教材目录/////////////////
    ///////////////////////////////////////////////////
    this.InitUserResourceCata = function () {
        preLessonCom.GetCatalogListByBookID(Current.SelectBookID, Current.CataList, function (data) {
            Current.CataList = data;
            var html = "";
            $.each(Current.CataList, function (u, unit) {
                var name = unit.title;
                html += '<option value="' + unit.id + '">' + name + '</option>';
            });
            $("#selectUserCatalog").html(html);
            ////////绑定目录选中事件////////
            $("#selectUserCatalog").unbind("change");
            $("#selectUserCatalog").change(function () {
                Current.PageIndex = 0;
                Current.SelectCataID = $(this).children('option:selected').val();
                var InitFirst = $("#InitFirstCata").html().split(",");
                /////////////加载两级目录/////////////////
                if ((Current.CataList[0].title.toLowerCase().indexOf("unit") == -1 || (Current.SubjectID != 3 && typeof (Current.CataList[0].children) != "undefined")) && $.inArray(preLessonPageInit.BookID, InitFirst) == -1) {
                    $("#selectUserUnit").show();
                    $.each(Current.CataList, function (n, cata) {
                        if (cata.id == Current.SelectCataID) {
                            if (typeof (cata.children) != "undefined") {
                                Current.InitUserResourceUnit(cata.children);
                                return false;
                            } else {
                                $("#selectUserUnit").hide();
                                ////////////获取单元及其子级目录ID////////////////
                                Current.GetUnitIDStrFunc(Current.CataList);
                                //////////通过目录加载教材资源/////////////////
                                preLessonCom.InitUserResourceByCata();
                            }
                        }
                    });
                } else {
                    $("#selectUserUnit").hide();
                    Current.SelectUnitID = Current.SelectCataID;
                    ////////////获取单元及其子级目录ID////////////////
                    Current.GetUnitIDStrFunc(Current.CataList);
                    //////////通过目录加载教材资源/////////////////
                    preLessonCom.InitUserResourceByCata();
                }
            });
            var now_cata = null;
            $.each(Current.CataList, function (n, cata) {
                if (typeof (cata.children) != "undefined") {
                    $.each(cata.children, function (u, unit) {
                        if (unit.id == Current.SelectCataID) {
                            now_cata = cata;
                            return false;
                        }
                    });
                } else {
                    if (cata.id == Current.SelectCataID) {
                        now_cata = cata;
                        return false;
                    }
                }
                if (now_cata != null)
                    return false;
            });
            if (now_cata == null) {
                if (Current.SelectCataID != "") {
                    $('#selectUserCatalog').val(Current.SelectCataID).change();
                } else {
                    $('#selectUserCatalog').val(Current.CataList[0].id).change();
                }
            }
            else {
                Current.SelectUnitID = Current.SelectCataID;
                $('#selectUserCatalog').val(now_cata.id).change();
            }
        });
    };
    this.InitUserResourceUnit = function (unitlist) {
        var html = "";
        $.each(unitlist, function (u, unit) {
            var name = unit.title;
            html += '<option value="' + unit.id + '">' + name + '</option>';
        });
        $("#selectUserUnit").html(html);
        ////////绑定目录选中事件////////
        $("#selectUserUnit").unbind("change");
        $("#selectUserUnit").change(function () {
            Current.PageIndex = 0;
            Current.SelectUnitID = $(this).children('option:selected').val();
            ////////////获取单元及其子级目录ID////////////////
            Current.GetUnitIDStrFunc(unitlist);
            //////////通过目录加载教材资源/////////////////
            preLessonCom.InitUserResourceByCata();
        });
        if (Current.SelectUnitID == "") {
            Current.SelectUnitID = unitlist[0].id;
        } else {
            var now_unit = null;
            $.each(unitlist, function (u, unit) {
                if (unit.id == Current.SelectUnitID) {
                    now_unit = unit;
                    return false;
                }
            });
            if (now_unit != null)
                Current.SelectUnitID = now_unit.id;
            else
                Current.SelectUnitID = unitlist[0].id;
        }
        $('#selectUserUnit').val(Current.SelectUnitID).change();
    };

    //////////////////////////////////////////
    /////////////绑定删除事件/////////////////
    //////////////////////////////////////////
    this.DeleteUserResource = function () {
        $("#btnDelUserResource").unbind("click");
        $("#btnDelUserResource").click(function () {
            var list = $("#divUserResource ul li label input[type='checkbox']:checked");
            if (list.length != 0) {
                var fileIDs = ""; var rIds = "";
                $.each(list, function (r, res) {
                    var li = $(res).parent().parent();
                    fileIDs += $(li).find("div").attr("hidsrc");
                    rIds += $(res).parent().parent().attr("id");
                    if (r < list.length - 1) {
                        fileIDs += ",";
                        rIds += ",";
                    }
                });
                ///////////////////////////////////////////////////////////////////////////////////
                //////////////////检测1 备课和教学地图是否已添加资源 后台数据/////////////////////////
                ///////////////////////////////////////////////////////////////////////////////////
                var checkResult = preLessonManagement.CheckPreLessonResource(Current.UserID, fileIDs);

                ////////////////////////////////////////////////////////////////////////////////////////////
                ////////检测2 备课是否已添加资源 缓存备课数据  当前页备课数据  当前教学地图数据/////////////
                ////////////////////////////////////////////////////////////////////////////////////////////
                var checkPreLessonForSessionResult = false;
                var resArr = rIds.split(",");//删除的资源ID列表
                var fileArr = fileIDs.split(","); //删除的文件ID列表

                /////////////缓存的备课水滴页码/////////////
                var oldArrIds = sessionS.get("itemArr");
                var temp = null;
                ///////////////获取当前页面备课水滴///////////////
                var preJson = getCurPageJson();
                ///////////////获取教学地图//////////////////
                var mapJson = getData(".jxScroll .sortTab");

                $.each(fileArr, function (m, fileID) {
                    if (oldArrIds!=null) {
                        temp = oldArrIds.split(",");
                        $.each(temp, function (n, pageIndex) {
                            ///////////////检测备课水滴缓存///////////////
                            var pageItemsjson = sessionS.get(pageIndex);
                            if (pageItemsjson.indexOf(fileID) != -1)
                                checkPreLessonForSessionResult = true;
                        });
                    }
                    if (preJson.indexOf(fileID) != -1)
                        checkPreLessonForSessionResult = true;
                    if (mapJson.indexOf(fileID) != -1)
                        checkPreLessonForSessionResult = true;
                });
                

                ///////////////////判断是否存在已添加资源///////////////////////////
                if (checkResult || checkPreLessonForSessionResult) {
                    commonFuncJS.openConfirm('资源已添加到电子书，删除后将被清空，是否确定删除？', function () {
                        commonFuncJS.SaveOperationRecord(Current.UserID, Current.UserType, Constant.OperType.DeleteResource_TYPE, "用户删除资源:" + fileIDs);
                        /////////////////删除备课资源水滴/////////////////
                        //preLessonManagement.DeletePreLessonResource(Current.UserID, fileIDs);
                        //////////////////删除页面备课水滴 联级删除教学地图上的水滴///////////////////
                        //preLessonCom.DeletePreLessonAndMapForResource(fileIDs);
                        //////////////////删除页面上的水滴缓存///////////////////////////
                        //if (temp != null)
                        //    preLessonCom.DeletePreLessonAndMapSessionForResource(fileArr, temp);
                        //////////////////保存教学地图///////////////////////////
                        //savemap();

                        /////////////////删除资源/////////////////////
                        var result = preLessonManagement.DelUserResource(rIds, Current.UserID);
                        $("#divUserResource ul").html("");
                        //////////通过目录加载我的资源/////////////////
                        preLessonCom.InitUserResourceByCata();
                        $("#divUserNav label input").prop("checked", false);
                        Current.CheckUserResource();

                        ///////////////重新加载电子教材水滴////////////////
                    }, function () { });
                } else {
                    commonFuncJS.openConfirm('你确定要删资源吗？', function () {
                        commonFuncJS.SaveOperationRecord(Current.UserID, Current.UserType, Constant.OperType.DeleteResource_TYPE, "用户删除资源:" + rIds);
                        /////////////////删除资源/////////////////////
                        var result = preLessonManagement.DelUserResource(rIds, Current.UserID);
                        $("#divUserResource ul").html("");
                        //////////通过目录加载我的资源/////////////////
                        preLessonCom.InitUserResourceByCata();
                        $("#divUserNav label input").prop("checked", false);
                        Current.CheckUserResource();
                    }, function () { });
                }
            } else {
                commonFuncJS.openAlert('请选择资源进行操作!');
            }
        });
    };
    /////////////////////////////////////////////
    ///////////检测用户资源是否为空//////////////
    /////////////////////////////////////////////
    this.CheckUserResource = function () {
        var list = $("#divUserResource ul li");
        if (list.length != 0) {
            $("#divUserNav label input").prop("disabled", false);
        } else {
            $("#divUserNav label input").prop("disabled", true);
            $("#btnDelUserResource").unbind("click");
        }
    };
    ////////////////////////////////////////
    //////////初始化资源类型显隐/////////////
    ////////////////////////////////////////
    this.InitExpandResourceType = function () {
        var html = '';
        $("#divExpandZRPDBook").hide();
        $("#divExpandResource").hide();
        $("#divExpandComingSoon").hide();
        if (Current.SubjectID == 1) {
            //$("#divExpandZRPDBook").hide();
            //$("#divExpandTypeList").hide();
            html += '<a href="javascript:void(0)" hidsourcetype="101" class="huiben">快乐阅读</a>';
            html += '<a href="javascript:void(0)" hidsourcetype="100" class="pindu cur">群文阅读</a>';
            ///////////加载语文快乐阅读///////////
           // Current.InitHappyRead();
            //return false;
        } else if (Current.SubjectID == 3) {
            html += '<a href="javascript:void(0)" hidsourcetype="67" class="pindu cur">自然拼读</a>';
            html += '<a href="javascript:void(0)" hidsourcetype="2" class="huiben">绘本阅读</a>';
        } else {
            $("#divExpandZRPDBook").hide();
            $("#divExpandResource").hide();
            $("#divExpandBook").hide();
            $("#divExpandComingSoon").show();
            return false;
        }
        $("#divExpandBook").hide();
        $("#divExpandTypeList").html(html);
        /////////绑定特色资源类型切换事件////////
        Current.BindExpandResourceCheckClick();
        $($("#divExpandTypeList a:visible")[0]).click();
    };
    ////////////////////////////////////////////////
    /////////////绑定特色资源类型切换事件////////////
    ////////////////////////////////////////////////
    this.BindExpandResourceCheckClick = function () {
        $("#divExpandTypeList a").each(function (n, a) {
            $(a).unbind("click");
            $(a).click(function () {
                $(a).parent().find("a").removeClass("cur");
                var id = $(a).attr("hidsourcetype");
                $(a).addClass("cur");
                $("#divExpandResource").html("");
                $("#divExpandTypeForZRPD").html("");
                /////////自然拼读 加载目录 加载资源类型//////////
                if (id == 67) {
                    commonFuncJS.SaveOperationRecord(Current.UserID, Current.UserType, Constant.OperType.NatureSpell_TYPE, "用户进入备课:特色资源-自然拼读模块");
                    ///////////加载自然拼读教材 目录///////////
                    Current.InitExpandForZRPDBook(id);

                    $("#divExpandZRPDBook").show();
                    $("#divExpandTypeForZRPD").show();
                    $("#divExpandResource").show();
                    $("#divExpandComingSoon").hide();
                    $("#divExpandBook").hide();
                }
                else if (id == 100) {                    
                        commonFuncJS.SaveOperationRecord(Current.UserID, Current.UserType, Constant.OperType.NatureSpell_TYPE, "用户进入备课:特色资源群文阅读模块");
                        ///////////加载群文阅读教材 目录///////////
                        Current.InitExpandForQWYDBook(id);

                        $("#divExpandZRPDBook").show();
                        $("#divExpandTypeForZRPD").show();
                        $("#divExpandResource").show();
                        $("#divExpandComingSoon").hide();
                        $("#divExpandBook").hide();
                } else if (id == 101) {
                    $("#divExpandZRPDBook").show();
                    $("#divExpandTypeForZRPD").show();
                    $("#divExpandResource").show();
                    $("#divExpandComingSoon").hide();
                    $("#divExpandBook").hide();
                    ///////////加载语文快乐阅读///////////
                     Current.InitHappyRead();
                }
                else {
                    $("#divExpandZRPDBook").hide();
                    $("#divExpandTypeForZRPD").hide();
                    $("#divExpandResource").hide();
                    $("#divExpandComingSoon").show();
                }
            });
        });
    };
    //////////////////////////////////////////////////
    //////////////加载语文快乐阅读////////////////////
    //////////////////////////////////////////////////
    this.InitHappyRead = function () {
        var html = preLessonCom.GetSelectBookHtml(Current.StandBookList, Current.BookType);
        $("#selectExpandBook").html(html);
        ////////绑定教材选中事件////////
        $("#selectExpandBook").unbind("change");
        $("#selectExpandBook").change(function () {
            Current.SelectBookID = $(this).children('option:selected').val();
            Current.SelectUnitID = $(".unitclass.on").attr("id");
            //Current.SelectCataID = $(".unitclass.on").attr("id");
            var li = $("#unitList #" + Current.SelectUnitID + "").prevAll(".module");
            if (li.length != 0)
                Current.SelectCataID = $(li[0]).attr("id");
            if (Current.SelectBookID != Current.BookID) {
                Current.SelectCataID = "";
                Current.SelectUnitID = "";
            }            
            //////////加载我的资源下的教材目录/////////////////
            Current.InitHappyReadResourceCata();
        });
        Current.SelectBookID = Current.BookID;
        $('#selectExpandBook').val(Current.SelectBookID).change();
    };
    ///////////////////////////////////////////
    ///////////加载语文快乐阅读 目录///////////
    ///////////////////////////////////////////
    this.InitHappyReadResourceCata = function () {
        Common.GetCatalogByBookId(Current.SelectBookID, function (data) {
            var cataList = data;
            var html = "";
            $.each(cataList, function (u, unit) {
                var name = unit.title;
                html += '<option value="' + unit.id + '">' + name + '</option>';
            });
            $("#selectExpandCatalog").html(html);
            ////////绑定目录选中事件////////
            $("#selectExpandCatalog").unbind("change");
            $("#selectExpandCatalog").change(function () {
                Current.PageIndex = 0;
                Current.SelectCataID = $(this).children('option:selected').val();
                //Current.SelectCataID = $(".unitclass.on").attr("id");
                //var li = $("#unitList #" + Current.SelectCataID + "").prevAll(".module");
                //if (li.length != 0)
                //Current.SelectCataID = $(li[0]).attr("id");
                /////////////加载两级目录/////////////////
                if (cataList[0].title.toLowerCase().indexOf("modul") != -1 || (Current.SubjectID != 3 && typeof (cataList[0].children) != "undefined")) {
                    $("#selectExpandUnit").show();
                    var isThisBook = 0;
                    //Current.InitHappyReadResourceUnit(cataList[0].children);
                    $.each(cataList, function (n, cata) {
                        if (cata.id == Current.SelectCataID) {
                            isThisBook = 1;
                            if (typeof (cata.children) != "undefined") {
                                Current.InitHappyReadResourceUnit(cata.children);
                                return false;
                            } else {
                                $("#selectExpandUnit").hide();
                                ////////////获取单元及其子级目录ID////////////////
                                Current.GetUnitIDStrFunc(cataList);
                                //////////通过目录加载快乐阅读/////////////////
                                Current.InitHappyReadResourceByCata();
                            }
                        }
                    });
                    if (isThisBook == 0) {
                        Current.InitHappyReadResourceUnit(cataList[0].children);
                    }
                }
                else {
                    $("#selectExpandUnit").hide();
                    ////////////获取单元及其子级目录ID////////////////
                    Current.GetUnitIDStrFunc(cataList);
                    //////////通过目录加载快乐阅读/////////////////
                    Current.InitHappyReadResourceByCata();
                }
            });
            if (Current.SelectCataID == "" || typeof (Current.SelectCataID) == "undefined"){
                //var now_cata = null;
                //$.each(cataList, function (n, cata) {
                //    if (typeof (cata.children) != "undefined") {
                //        $.each(cata.children, function (u, unit) {
                //            if (unit.id == Current.SelectCataID) {
                //                now_cata = cata;
                //                return false;
                //            }
                //        });
                //    } else {
                //        if (cata.id == Current.SelectCataID) {
                //            now_cata = cata;
                //            return false;
                //        }
                //    }
                //    if (now_cata != null)
                //        return false;
                //});
                //if (now_cata!=null)
                //    $('#selectExpandCatalog').val(now_cata.id).change();
                //else
                    $('#selectExpandCatalog').val(cataList[0].id).change();
            }
            else {
                //Current.SelectCataID = $(".unitclass.on").attr("id");
                //Current.SelectUnitID = Current.SelectCataID;
                //var li = $("#unitList #" + Current.SelectCataID + "").prevAll(".module");
                //if (li.length!=0)
                //   $('#selectExpandCatalog').val($(li[0]).attr("id")).change();
                //else
                    $('#selectExpandCatalog').val(Current.SelectCataID).change();
            }
        });
    };
    this.InitHappyReadResourceUnit = function (unitlist) {
        var html = "";
        $.each(unitlist, function (u, unit) {
            var name = unit.title;
            html += '<option value="' + unit.id + '">' + name + '</option>';
        });
        $("#selectExpandUnit").html(html);
        ////////绑定目录选中事件////////
        $("#selectExpandUnit").unbind("change");
        $("#selectExpandUnit").change(function () {
            Current.PageIndex = 0;
            Current.SelectUnitID = $(this).children('option:selected').val();
            ////////////获取单元及其子级目录ID////////////////
            Current.GetUnitIDStrFunc(unitlist);
            //////////通过目录加载快乐阅读/////////////////
            Current.InitHappyReadResourceByCata();
        });
        if (Current.SelectUnitID == "") {
            Current.SelectUnitID = unitlist[0].id;
        } else {
            var now_unit = null;
            $.each(unitlist, function (u, unit) {
                if (unit.id == Current.SelectUnitID) {
                    now_unit = unit;
                    return false;
                }
            });
            if (now_unit != null)
                Current.SelectUnitID = now_unit.id;
            else
                Current.SelectUnitID = unitlist[0].id;
        }
        $('#selectExpandUnit').val(Current.SelectUnitID).change();
    };
    ////////////////////////////////////////////////////////
    ///////////////////加载快乐阅读资源/////////////////////
    ////////////////////////////////////////////////////////
    this.InitHappyReadResourceByCata = function () {
        preLessonCom.GetResourceByMOD(Current.SubjectID, Current.UnitStr, 2, "", function (data) {
            if (data != null) {
                var resourcelist = data;
                $("#divExpandComingSoon").hide();
                $("#divExpandTypeList").show();
                Common.CodeAjax("do.jsonp", "RSORT", function (typedata) {
                    Current.ResourceTypeList = typedata["RSORT"];
                    var html = '';
                    $.each(Current.ResourceTypeList, function (t, type) {
                        html += '<a href="javascript:void(0)" hidSourceType="' + type.id + '" style="display:none">' + type.title + '</a>';
                        if (typeof (type.children) != "undefined") {
                            html += Current.GetResourceTypeChild(type.children);
                        }
                    });
                    $("#divExpandTypeForZRPD").html(html);
                    $("#divExpandTypeForZRPD a").each(function (l, a) {
                        if (l == 0) return true;
                        var id = $(a).attr("hidSourceType");
                        var bool = false;
                        $.each(resourcelist, function (r, res) {
                            if (res.ResourceType == 1 || res.ResourceType == 7 || res.ResourceType == 0) {
                                if (res.ResourceStyle == id)
                                    bool = true;
                            } else {
                                if (res.ResourceType == id)
                                    bool = true;
                            }
                            if (bool) {
                                $("#divExpandTypeForZRPD").show();
                                $(a).show();
                                return false;
                            }
                        });
                    });
                    ////////////////绑定资源类型点击事件///////////////////////////
                    Current.BindZRPDResourceTypeClick(resourcelist);
                    $($("#divExpandTypeForZRPD a:visible")[0]).click();
                });
            } else {
                $("#divExpandTypeForZRPD").hide();
                $("#divExpandResource").html("");
                $("#divExpandResource").hide();
                $("#divExpandComingSoon").show();
            }
        });
    };
    //////////////////////////////////////////////////
    ///////////加载快乐阅读资源类型点击事件///////////
    //////////////////////////////////////////////////
    this.BindHappyReadResourceTypeClick = function (resourcelist) {
        $("#divExpandTypeList a").each(function (n, a) {
            $(a).unbind("click");
            $(a).click(function () {
                $(a).parent().find("a").removeClass("cur");
                $(a).addClass("cur");
                Current.ResourceType = $(a).attr("hidSourceType");
                Current.ResourceList = resourcelist;
                var list = Current.GetResourceByType();//通过资源类型筛选资源
                html = preLessonCom.GetResourceHtmlByPageIndex(list, Current.SubjectID, Current.EditionID, "ModResource");//通过当前页面加载资源HTML
                $("#divExpandResource").show();
                $("#divExpandResource").html(html);
                //////////////绑定H5拖动//////////////
                bindItemsDrag();
            });
        });
    };
    ///////////////////////////////////////////
    ///////////加载自然拼读教材 目录///////////
    ///////////////////////////////////////////
    this.InitExpandForZRPDBook = function (id) {
        preLessonCom.GetStandBook(0, 0, Current.SubjectID, 0, id, null, function (data) {
            var zrpd_book = data;
            var html = "";
            $.each(zrpd_book, function (b, book) {
                html += '<option value="' + book.ID + '">' + book.BooKName + '</option>';
            });
            $("#selectExpandBook").html(html);
            ////////绑定教材选中事件////////
            $("#selectExpandBook").unbind("change");
            $("#selectExpandBook").change(function () {
                var bookID = $(this).children('option:selected').val();
                Current.InitExpandResourceCata(bookID);
            });
            var age = commonFuncJS.GetTSGradeByAge(Current.GradeID);
            var age_book = null;
            $.each(zrpd_book, function (b, book) {
                if (book.AgeRange == age)
                    age_book = book;
            });
            if (age_book != null)
                $('#selectExpandBook').val(age_book.ID).change();
            else
                $('#selectExpandBook').val(zrpd_book[0].ID).change();
        });
    };
    ///////////////////////////////////////////
    ///////////加载群文阅读教材 目录///////////
    ///////////////////////////////////////////
    this.InitExpandForQWYDBook = function (id) {
        preLessonCom.GetStandBook(0, 0, Current.SubjectID, 0, 0, null, function (data) {
            var qwyd_book = data.sort(commonFuncJS.CreateAscCompact("ID"));
            var html = "";
            $.each(qwyd_book, function (b, book) {
                if (book.BookType==8)
                html += '<option value="' + book.ID + '">' + book.BooKName + '</option>';
            });
            $("#selectExpandBook").html(html);
            ////////绑定教材选中事件////////
            $("#selectExpandBook").unbind("change");
            $("#selectExpandBook").change(function () {
                var bookID = $(this).children('option:selected').val();
                Current.InitExpandResourceCata(bookID);
            });
            //var age = commonFuncJS.GetTSGradeByAge(Current.GradeID);
            //var age_book = null;
            //$.each(qwyd_book, function (b, book) {
            //    if (book.AgeRange == age)
            //        age_book = book;
            //});
            //if (age_book != null)
            //    $('#selectExpandBook').val(age_book.ID).change();
            //else
                $('#selectExpandBook:first-child').change();
        });
    };
    ///////////////////////////////////////////////////
    //////////加载特色资源下的教材目录/////////////////
    ///////////////////////////////////////////////////
    this.InitExpandResourceCata = function (bookID) {
        Common.GetCatalogByBookId(bookID, function (data) {
            var cataList = data;
            ///////////////加载目录列表////////////////////
            var html = "";
            $.each(cataList, function (u, unit) {
                var name = unit.title;
                html += '<option value="' + unit.id + '">' + name + '</option>';
            });
            $("#selectExpandCatalog").html(html);

            ////////绑定目录选中事件////////
            $("#selectExpandCatalog").unbind("change");
            $("#selectExpandCatalog").change(function () {
                var cataID = $(this).children('option:selected').val();
                $.each(cataList, function (u, unit) {
                    if (unit.id == cataID) {
                        if (unit.children != undefined) {
                            Current.InitExpandResourceUnit(unit.children);
                        }
                        else {
                            $("#selectExpandUnit").hide();
                            Current.InitZRPDResourceType(cataID);
                        }
                        return false;
                    }
                });
            });
            $('#selectExpandCatalog').val(cataList[0].id).change();
        });
    };
    ///////////////////////////////////////////////////
    //////////加载特色资源下的教材目录/////////////////
    ///////////////////////////////////////////////////
    this.InitExpandResourceUnit = function (unitlist) {
        ///////////////加载目录列表////////////////////
        var html = "";
        $.each(unitlist, function (u, unit) {
            var name = unit.title;
            html += '<option value="' + unit.id + '">' + name + '</option>';
        });
        $("#selectExpandUnit").html(html);

        ////////绑定目录选中事件////////
        $("#selectExpandUnit").unbind("change");
        $("#selectExpandUnit").change(function () {
            var unitID = $(this).children('option:selected').val();
            Current.InitZRPDResourceType(unitID);
        });
        $('#selectExpandUnit').val(unitlist[0].id).change();
    };
    ///////////////////////////////////////////
    //////////加载自然拼读资源/////////////////
    ///////////////////////////////////////////
    this.InitZRPDResourceType = function (unitID) {
        Common.CodeAjax("do.jsonp", "RSORT", function (typedata) {
            Current.ResourceTypeList = typedata["RSORT"];
            ///////////////通过目录ID获取资源///////////////////////
            preLessonCom.GetResourceByMOD(Current.SubjectID, unitID, 2, "", function (data) {
                if (data != null) {
                    var resourcelist = data;
                    resourcelist.sort(commonFuncJS.CreateAscCompact("Sort"));
                    ///////////////加载资源类型///////////////////////
                    var html = '';
                    $.each(Current.ResourceTypeList, function (t, type) {
                        html += '<a href="javascript:void(0)" hidSourceType="' + type.id + '" style="display:none">' + type.title + '</a>';
                        if (typeof (type.children) != "undefined") {
                            html += Current.GetResourceTypeChild(type.children);
                        }
                    });
                    if (resourcelist != null) {
                        $("#divExpandTypeForZRPD").show();
                        $("#divExpandResource").show();
                        $("#divExpandComingSoon").hide();

                        $("#divExpandTypeForZRPD").html(html);
                        $("#divExpandTypeForZRPD a").each(function (l, a) {
                            if (l == 0) return true;
                            var id = $(a).attr("hidSourceType");
                            var bool = false;
                            $.each(resourcelist, function (r, res) {
                                if (res.FileType.toLowerCase().indexOf("swf") == -1) {
                                    if (res.ResourceType == 1 || res.ResourceType == 7 || res.ResourceType == 0) {
                                        if (res.ResourceStyle == id)
                                            bool = true;
                                    } else {
                                        if (res.ResourceType == id)
                                            bool = true;
                                    }
                                    if (bool) {
                                        $(a).show();
                                        return false;
                                    }
                                }
                            });
                        });
                        ////////////////绑定资源类型点击事件///////////////////////////
                        Current.BindZRPDResourceTypeClick(resourcelist);
                        $($("#divExpandTypeForZRPD a:visible")[0]).click();
                    } else {
                        $("#divExpandTypeForZRPD").hide();
                        $("#divExpandResource").hide();
                        $("#divExpandComingSoon").show();
                    }
                } else {
                    $("#divExpandTypeForZRPD").hide();
                    $("#divExpandResource").hide();
                    $("#divExpandComingSoon").show();

                }
            });
        });
    };
    //////////////////////////////////////////////////////
    ////////////////绑定资源类型点击事件//////////////////
    //////////////////////////////////////////////////////
    this.BindZRPDResourceTypeClick = function (resourcelist) {
        $("#divExpandTypeForZRPD a").each(function (n, a) {
            $(a).unbind("click");
            $(a).click(function () {
                $(a).parent().find("a").removeClass("cur");
                $(a).addClass("cur");
                Current.ResourceType = $(a).attr("hidSourceType");
                Current.ResourceList = resourcelist;
                var list = Current.GetResourceByType();//通过资源类型筛选资源
                html = preLessonCom.GetResourceHtmlByPageIndex(list, Current.SubjectID, Current.EditionID, "ModResource");//通过当前页面加载资源HTML
                $("#divExpandResource").html(html);
                if (html != "" && html.length != 0) {
                    $("#divExpandResource").show();
                }
                //////////////绑定H5拖动//////////////
                bindItemsDrag();
            });
        });
    };
    ////////////////////////////////////////
    ///////////加载教材资源/////////////////
    ////////////////////////////////////////
    this.InitSyncResource = function () {
        preLessonCom.GetStandBook(0, Current.GradeID, Current.SubjectID, 0, Current.EditionID, Current.StandBookList, function (data) {
            Current.StandBookList = data;
            var html = preLessonCom.GetSelectBookHtml(Current.StandBookList, Current.BookType);
            $("#selectSyncBook").html(html);
            ////////绑定教材选中事件////////
            $("#selectSyncBook").unbind("change");
            $("#selectSyncBook").change(function () {
                if (Current.SelectBookID != $(this).children('option:selected').val()) {
                    Current.SelectCataID = "";
                    Current.CataList = null;
                }
                Current.SelectBookID = $(this).children('option:selected').val();
                //////////加载教材资源下的教材目录/////////////////
                Current.InitSyncResourceCata();
            });
            if (Current.SelectBookID == "") {
                Current.SelectBookID = Current.StandBookList[0].ID;
            }
            $('#selectSyncBook').val(Current.SelectBookID).change();
        });
    };
    ///////////////////////////////////////////////////
    //////////加载教材资源下的教材目录/////////////////
    ///////////////////////////////////////////////////
    this.InitSyncResourceCata = function () {
        if (Current.CataList != null) {
            Current.InitSyncResourceCata2();
        } else {
            Common.GetCatalogByBookId(Current.SelectBookID, function (data) {
                Current.CataList = data;
                ///////////////加载目录列表////////////////////
                Current.InitSyncResourceCata2();
            });
        }
    };
    this.InitSyncResourceCata2 = function () {
        var html = "";
        $.each(Current.CataList, function (u, unit) {
            var name = unit.title;
            html += '<option value="' + unit.id + '">' + name + '</option>';
        });
        $("#selectSyncCatalog").html(html);
        ////////绑定目录选中事件////////
        $("#selectSyncCatalog").unbind("change");
        $("#selectSyncCatalog").change(function () {
            Current.PageIndex = 0;
            var InitFirst = $("#InitFirstCata").html().split(",");
            /////////////加载两级目录/////////////////
            if ((Current.CataList[0].title.toLowerCase().indexOf("unit") == -1 || (Current.SubjectID != 3 && typeof (Current.CataList[0].children) != "undefined")) && $.inArray(preLessonPageInit.BookID, InitFirst) == -1) {
                Current.SelectCataID = $(this).children('option:selected').val();
                $("#selectSyncUnit").show();
                $.each(Current.CataList, function (n, cata) {
                    if (cata.id == Current.SelectCataID) {
                        if (typeof (cata.children) != "undefined") {
                            Current.InitSyncResourceUnit(cata.children);
                            return false;
                        } else {
                            $("#selectSyncUnit").hide();
                            Current.SelectUnitID = "";
                            ////////////获取单元及其子级目录ID////////////////
                            Current.GetUnitIDStrFunc(Current.CataList);
                            //////////通过目录加载教材资源/////////////////
                            Current.InitSyncResourceByCata();
                        }
                    }
                });
            } else {
                $("#selectSyncUnit").hide();
                Current.SelectUnitID = "";
                Current.SelectCataID = $(this).children('option:selected').val();
                ////////////获取单元及其子级目录ID////////////////
                Current.GetUnitIDStrFunc(Current.CataList);
                //////////通过目录加载教材资源/////////////////
                Current.InitSyncResourceByCata();
            }
        });
        var now_cata = null;
        $.each(Current.CataList, function (n, cata) {
            if (typeof (cata.children) != "undefined") {
                $.each(cata.children, function (u, unit) {
                    if (unit.id == Current.SelectCataID) {
                        now_cata = cata;
                        return false;
                    }
                });
            } else {
                if (cata.id == Current.SelectCataID) {
                    now_cata = cata;
                    return false;
                }
            }
            if (now_cata != null)
                return false;
        });
        if (now_cata == null) {
            if (Current.SelectCataID != "") {
                $('#selectSyncCatalog').val(Current.SelectCataID).change();
            } else {
                $('#selectSyncCatalog').val(Current.CataList[0].id).change();
            }
        }
        else {
            Current.SelectUnitID = Current.SelectCataID;
            $('#selectSyncCatalog').val(now_cata.id).change();
        }
    };


    this.InitSyncResourceUnit = function (unitlist) {
        var html = "";
        $.each(unitlist, function (u, unit) {
            var name = unit.title;
            html += '<option value="' + unit.id + '">' + name + '</option>';
        });
        $("#selectSyncUnit").html(html);
        ////////绑定目录选中事件////////
        $("#selectSyncUnit").unbind("change");
        $("#selectSyncUnit").change(function () {
            Current.PageIndex = 0;
            Current.SelectUnitID = $(this).children('option:selected').val();
            ////////////获取单元及其子级目录ID////////////////
            Current.GetUnitIDStrFunc(unitlist);
            //////////通过目录加载教材资源/////////////////
            Current.InitSyncResourceByCata();
        });
        if (Current.SelectUnitID == "") {
            Current.SelectUnitID = unitlist[0].id;
        } else {
            var now_unit = null;
            $.each(unitlist, function (u, unit) {
                if (unit.id == Current.SelectUnitID) {
                    now_unit = unit;
                    return false;
                }
            });
            if (now_unit != null)
                Current.SelectUnitID = now_unit.id;
            else
                Current.SelectUnitID = unitlist[0].id;
        }
        $('#selectSyncUnit').val(Current.SelectUnitID).change();
    };
    //////////////////////////////////////////////////
    ////////////获取单元及其子级目录ID////////////////
    //////////////////////////////////////////////////
    this.UnitStr = "";
    this.GetUnitIDStrFunc = function (cataList) {
        Current.UnitStr = "";
        $.each(cataList, function (c, cata) {
            if ((cata.id == Current.SelectUnitID && Current.SelectUnitID != "") || (cata.id == Current.SelectCataID)) {
                if (typeof (cata.children) != "undefined" && cata.children.length != 0) {
                    Current.UnitStr = Current.SelectCataID;
                    //////////////递归获取单元完整ID///////////////////
                    if (Current.UnitStr.indexOf(cata.id) == -1)
                        Current.UnitStr = Current.UnitStr + "," + cata.id;
                    Current.GetUnitIDStr(cata.children);
                } else {
                    Current.UnitStr = Current.SelectCataID;
                    if (Current.UnitStr.indexOf(cata.id) == -1)
                        Current.UnitStr = Current.UnitStr + "," + cata.id;
                }
                return false;
            }
        });
    };

    this.GetUnitIDStr = function (children) {
        var str = "";
        $.each(children, function (c, child) {
            if (str == "")
                str += child.id;
            else
                str += "," + child.id;
            if (typeof (child.children) != "undefined") {
                if (child.children.length != 0) {
                    //Current.UnitStr += "," + child.id;
                    //////////////递归获取单元完整ID///////////////////
                    Current.GetUnitIDStr(child.children);
                }
            }
        });
        if (Current.UnitStr != "")
            Current.UnitStr += ",";
        Current.UnitStr += str;
    };

    ///////////////////////////////////////////////
    //////////通过目录加载教材资源/////////////////
    ///////////////////////////////////////////////
    this.InitSyncResourceByCata = function () {
        preLessonCom.GetResourceByMOD(Current.SubjectID, Current.UnitStr, "", "", function (data) {
            if (data == null) {
                $("#divSyncResource").hide();
                $("#divSyncTypeList").hide();
                $("#divSyncComingSoon").show();
                $("#lbSyncToggle").hide();
                return false;
            }
            $("#divSyncTypeList").show();
            $("#divSyncComingSoon").hide();
            $("#lbSyncToggle").show();
            $("#divSyncResource").show();
            var html = "";
            Current.ResourceList = data;
            /////////////初始化资源类型显隐////////////////
            Current.InitSyncResourceType();
        });
    };
    ////////////////////////////////////////////////
    /////////////初始化资源类型显隐////////////////
    ////////////////////////////////////////////////
    this.InitSyncResourceType = function () {
        Common.CodeAjax("do.jsonp", "RSORT", function (data) {
            Current.ResourceTypeList = data["RSORT"];
            var html = '<a href="javascript:void(0)" hidSourceType="0" class="cur">全部</a>';
            $.each(Current.ResourceTypeList, function (t, type) {
                html += '<a href="javascript:void(0)" hidSourceType="' + type.id + '" style="display:none">' + type.title + '</a>';
                if (typeof (type.children) != "undefined") {
                    html += Current.GetResourceTypeChild(type.children);
                }
            });
            $("#divSyncTypeList").html(html);
            $("#divSyncTypeList a").each(function (l, a) {
                if (l == 0) return true;
                var id = $(a).attr("hidSourceType");
                var bool = false;
                $.each(Current.ResourceList, function (r, res) {
                    if (res.FileType.toLowerCase().indexOf("swf") == -1) {
                        if (res.ResourceType == 1 || res.ResourceType == 7 || res.ResourceType == 0 || res.ResourceType == 11) {//
                            if (res.ResourceStyle == id)
                                bool = true;
                        } else {
                            if (res.ResourceType == id)
                                bool = true;
                        }
                        if (bool) {
                            $(a).show();
                            return false;
                        }
                    }
                });
            });
            html = preLessonCom.GetResourceHtmlByPageIndex(Current.ResourceList, Current.SubjectID, Current.EditionID, "ModResource");//通过当前页面加载资源HTML
            $("#divSyncResource").html(html);
            $("#divSyncResource").scrollTop(0);
            autoWidth();
            ////////////绑定H5拖动//////////////
            bindItemsDrag();
            /////////绑定教材资源类型切换事件////////
            Current.BindSyncResourceCheckClick();
        });
    };
    this.GetResourceTypeChild = function (list) {
        var h = '';
        $.each(list, function (l, type) {
            h += '<a href="javascript:void(0)" hidSourceType="' + type.id + '" style="display:none">' + type.title + '</a>';
            if (typeof (type.children) != "undefined") {
                h += Current.GetResourceTypeChild(type.children);
            }
        });
        return h;
    };
    /////////////////////////////////////////
    /////////绑定教材资源类型切换事件////////
    /////////////////////////////////////////
    this.BindSyncResourceCheckClick = function () {
        $("#divSyncTypeList a").each(function (n, a) {
            $(a).unbind("click");
            $(a).click(function () {
                $(a).parent().find("a").removeClass("cur");
                $(a).addClass("cur");
                Current.PageIndex = 0;
                Current.ResourceType = $(a).attr("hidSourceType");

                var resourcelist = Current.GetResourceByType();//通过资源类型筛选资源
                html = preLessonCom.GetResourceHtmlByPageIndex(resourcelist, Current.SubjectID, Current.EditionID, "ModResource");//通过当前页面加载资源HTML
                $("#divSyncResource").html(html);
                $("#divSyncResource").scrollTop(0);
                ////////////绑定H5拖动//////////////
                bindItemsDrag();
            });
        });
    };
    ////////////////////////////////////////////
    //////////通过资源类型筛选资源//////////////
    ////////////////////////////////////////////
    this.GetResourceByType = function () {
        var reslist = [];
        if (Current.ResourceList.length != 0 && Current.ResourceType != 0) {
            $.each(Current.ResourceList, function (r, res) {
                if (res.FileType.toLowerCase().indexOf("swf") == -1) {
                    if (res.ResourceType == 1 || res.ResourceType == 7 || res.ResourceType == 0 || res.ResourceType == 11) {
                        if (res.ResourceStyle == Current.ResourceType)
                            reslist.push(res);
                    } else {
                        if (res.ResourceType == Current.ResourceType)
                            reslist.push(res);
                    }
                }
            });
        } else {
            reslist = Current.ResourceList;
        }
        return reslist;
    };
    ////////////////////////////////////////
    ///////////保存备课的Json数据///////////
    ////////////////////////////////////////
    this.SavaPressonJson = function (pageIndex, jsonStr) {
        var bookID = Common.QueryString.GetValue("BookID");
        var preLessonContent = jsonStr;
        var page_arr = pageIndex.split(",");
        var json_arr = jsonStr.split("#");
        return preLessonManagement.SaveUserPresson(Current.UserID, Current.UserType, bookID, Current.SubjectID, Current.EditionID, Current.GradeID, Current.CataID, pageIndex, preLessonContent);
    };
    ////////////////////////////////////////
    ///////////获取备课的Json数据///////////
    ////////////////////////////////////////
    this.GetUserPressonJsonByWhere = function (pageIndex) {
        var bookID = Common.QueryString.GetValue("BookID");
        return preLessonManagement.GetUserPressonJsonByWhere(Current.UserID, bookID, pageIndex);
    };

    ////////////////////////////////////////
    /////////////////放映///////////////
    ////////////////////////////////////////
    this.preview = function () {
        if (operation.addCount != 0 || operation.delCount != 0 || operation.moveCount != 0 || operation.addStepCount != 0 || operation.delStepCount != 0 || operation.modifyStepCount != 0 || operation.sortObCount != 0) {
            sessionS.set("operation", JSON.stringify(operation)); 

            var jsonInfo = getCurPageJson();
            //savemap();//保存地图
            saveToCookie(selectPageNum, jsonInfo);//切换前先保存当前页面 
            //点击放映页，跳转前先保存教学地图信息;
            var data = getData(".jxScroll .sortTab");
            sessionS.set("mapArr", data);
        }
        commonFuncJS.setDataF("curUnitName", $("#unitFull").text());
        //if (selectPageNum > 0) {//如果selectPageNum==0，代表首次进入,不存在COOKIE
           
        //}
        var bookID = Common.QueryString.GetValue("BookID");
        var pageIndex = $("#divPagebox").find("li.on").attr("id");
        var BookType = Common.QueryString.GetValue("BookType");
        var href = 'LessonView.html?UserID=' + Current.UserID + "&BookID=" + bookID + "&BookType=" + BookType + "&CataID=" + Current.CataID + "&page=" + pageIndex + "&SubjectID=" + getUrlParam("SubjectID");
        var curUrl = window.location.href;
        SaveOperDataALL(Current.UserID, Current.UserType, Constant.OperType.Fangying_TYPE, "进入放映模块");
        commonFuncJS.setDataF("curUrl", curUrl);
        window.open(href);
    };
    ////////////////////////////////////
    ///////////上传文件/////////////////
    ////////////////////////////////////
    this.UpLoadFileFunc = function () {
        var file_type = preLessonCom.SaveUploadFileType();
        //实时加载上传插件
        $.getScript("../../App_Theme/js/KJajaxUpload.js", function () {
            $("#btnUpLoadFile").AjaxUpload({
                url: Constant.webapi_Url + "Upload",//../../Handler/FileUploadHandler.ashx
                Text: "上传文件",
                DeleteButtonUrl: '',
                IsCheckType: true,
                FileType: file_type,
                BtnCss: "upload",
                onInit: function (target, data) {
                    $("#divUserResource ul").hide();
                    $("#btnDelUserResource").unbind("click");
                    var input = $("#divUserNav").find("input[name='allcheckbox']");
                    $(input).attr("disabled", "disabled");
                },
                onUploaded: function (data, target, reponses) {
                    alert("文件上传完毕!");
                    $("#divUserResource").show();
                    $("#divUserComingSoon").hide();

                    $("#tabUpload").show();
                    $("#tabUpload").html("");

                    Current.FileList = data;
                    $("#tbSetResourceInfo").show();
                    Current.InitEditionUploadFile(data, "pc", target);
                },
                onChange: function (data) {
                    $("#btnUpLoadFile").AjaxUpload("upload");
                },
            });
        });
    };
    ////////////////////////////////////////////////////
    ///////////////////加载上传文件编辑/////////////////
    ////////////////////////////////////////////////////
    this.InitEditionUploadFile = function (data, type, target) {
        $.get(Constant.webapi_Url + "GetResourceType", function (tytplist) {
            var resourcetypelist = tytplist;
            var RecordType = "";
            $.each(data, function (f, obj) {
                var html = "";
                if (type == "android") {
                    obj = obj.replace(/\\/g, '\\\\');
                    Current.FileList.push(obj);
                }
                var file = JSON.parse(obj).Data;

                html += '<li id="' + file.ID + '" class="fileuploadlist newfilelist">';
                html += '<div class="tdDiv title">' + file.FileName + '</div>';
                html += '<div class="tdDiv intDiv" style="width: 160px;"><span>' + file.FileExtension + '</span><span style="width: 80px;">' + preLessonCom.BytesToSize(file.FileSize) + '</span><span class="success"></span></div>';
                html += '<div class="tdDiv colorBlue" style="width: 100px;"><select id="select' + file.ID + '"></select></div>';
                html += '</li>';
                $("#tbSetResourceInfo").append(html);
                $("#divUserComingSoon").hide();
                $("#divUserResource").show();
                $("#tbSetResourceInfo").show();
                ///////////////加载资源类型下拉框////////////////
                preLessonCom.InitUploadResourceType(file.ID, resourcetypelist);
                ///////////////默认选中资源类型下拉框////////////////
                Current.SetResourceSelectCheck(file);
                if (typeof (file.type) != "undefined") {
                    if (file.type == 2) {
                        RecordType = "weike";
                        $($("#tablist li")[2]).click();
                    }
                }
            });
            commonFuncJS.SaveOperationRecord(Current.UserID, Current.UserType, Constant.OperType.SourceUpload_TYPE, "用户上传资源:" + Current.ResourceIDs);
            Current.ResourceIDs = "";
            if (RecordType == "weike") {
                commonFuncJS.SaveOperationRecord(Current.UserID, Current.UserType, Constant.OperType.RecordClass_TYPE, "用户录制微课");
                $("#divSaveUplaod").css({ "height": "0", "padding": "0" });
            } else {
                $("#divSaveUplaod").css({ "height": "auto", "padding": "10px 0" });
            }
            uploadW();
            if (type == "android") {
                Current.FileList = [];
            }
            $("#btnSaveUplaod").unbind("click");
            $("#btnSaveUplaod").click(function () {
                if (type == "pc") {
                    var options = $.data(target, "AjaxUpload").Options;
                    options.uploadfilelist =[];
                }
                commonFuncJS.openAlert("保存成功!");
                $("#divUserResource ul").show();
                Current.DeleteUserResource();
                var input = $("#divUserNav").find("input[name='allcheckbox']");
                $(input).removeAttr("disabled");
                Current.FileList = [];
                $("#tbSetResourceInfo").hide();
                $("#tbSetResourceInfo tbody").html("");
                $("#tbSetResourceInfo").html("");
                $("#divSaveUplaod").css({ "height": "0", "padding": "0" });
                //////////通过目录加载我的资源/////////////////
                preLessonCom.InitUserResourceByCata();
            });
        });
    };

    //////////////////////////////////////////////////
    ///////////////默认选中资源类型下拉框/////////////
    //////////////////////////////////////////////////
    this.SetResourceSelectCheck = function (file) {
        $("#select" + file.ID).unbind("change");
        $("#select" + file.ID).change(function () {
            Current.SaveUploadResource(file.ID);
        });
        //////////////通过后缀名获取文件类型ID//////////
        var typeID = preLessonCom.GetFileTypeByExtension(file.FileExtension);
        $("#select" + file.ID).val(typeID).change();
    };
    //////////////////////////////////////////////////
    ///////////保存用户上传的文件信息/////////////////
    //////////////////////////////////////////////////
    this.FileList = []; this.ResourceIDs = "";
    this.SaveUploadResource = function (fileID) {
        var resourceStyle = $("#select" + fileID + " option:selected").val();
        var float = "";
        $.each(Current.FileList, function (f, obj) {
            var file = JSON.parse(obj).Data;
            if (file.ID == fileID) {
                float = preLessonManagement.SaveUserUploadResource(
                    Current.UserID,
                    Current.TrueName,
                    fileID,
                    file.FileName,
                    file.FileExtension,
                    file.FileSize,
                    file.FilePath,
                    file.FileType,
                    Current.SubjectID,
                    Current.EditionID,
                    Current.GradeID,
                    Current.SelectUnitID,
                    resourceStyle
                    );
                return float;
            }
        });
        if (Current.ResourceIDs != "")
            Current.ResourceIDs += ",";
        Current.ResourceIDs += float;
    };
};

var preLessonPageInit = null;
$(function () {
    preLessonPageInit = new PreLessonPageInit();
    preLessonPageInit.Init();
});
