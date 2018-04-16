///作者：韦帅
///完成时间：2017.03.13
///多文件异步上传带进度条
//1.初始化上传按钮->选择文件按钮
//2.选择文件,显示上传进度列表,回调onchange事件,调用上传函数
//3.接收返回数据,处理结果
(function ($) {

    function bytesToSize(bytes) {
        if (bytes === 0) return '0 B';
        var k = 1024,
            sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    };

    function changeCursor(obj) {
        obj.style.cursor = 'pointer'
    };

    function deleteSelfAndFile(obj) {
        var that = $(obj);
        var parentLi = that.parent("li");
        that.remove();
        parentLi.remove();
    };

    function CreateXMLHttpRequest(target) {
        var xhr = new XMLHttpRequest();
        return xhr;
    };
    /////////////////////////////////////////////////////
    /////////////////初始化文件选择按钮//////////////////
    /////////////////////////////////////////////////////
    function InitFileDiv(target, options) {
        var _that = $(target);
        var uploadButton = $("<input type='button' class='AjaxUpload_Button' value='Select File'/>");
        if (options.Text) {
            uploadButton.val(options.Text);
        }
        ////////////文件选择按钮事件///////////////
        uploadButton.click(function () {
            SelectFiles(target);
        });
        ////////////文件选择按钮样式///////////////
        uploadButton.addClass(options.BtnCss);
        if (options.Available) {
            uploadButton.prop("disabled", false);
        } else {
            uploadButton.prop("disabled", true);
        }
        _that.html(uploadButton);
        return _that;
    };
    ///////////////////////////////////////////////////
    ///////////////监听上传,改变上传进度///////////////
    ///////////////////////////////////////////////////
    function ChangeProcess(filename, evt, target) {
        var options = $.data(target, "AjaxUpload").Options;
        var loaded = evt.loaded;     //已经上传大小情况 
        var tot = evt.total;      //附件总大小 
        var per = Math.floor(100 * loaded / tot);  //已经上传的百分比 
        var that = $("#tabUpload").find("[name='" + filename + "']");
        var td = that.find("div.backColor")[0];
        $(td).find('span').css("width", per + "%");
        var span =that.find("div.pre")[0];
        $(span).html(per + "%");
    }
    ///////////////////////////////////////////////////
    /////////////////////////选择文件/////////////////
    ///////////////////////////////////////////////////
    function SelectFiles(target) {
        var that = $(target);
        var fileInputs = that.find(":file");
        fileInputs.remove();
        var options = $.data(target, "AjaxUpload").Options;
        var deleteButtonUrl = options.DeleteButtonUrl;
        var ele = $("<input type='file' accept='" + options.FileType+ "'/>");
        ele.prop("multiple", options.multiple !== false);
        ele.hide();
        ele.change(function (e) {
            var exist = false;
            var size_exist = false;
            var type_exist = false;
            var name_exist = false;

            var image_exist = false;

            var files = e.target.files;

            var selectEorr = true;
            if (options.uploadfilelist.length != 0) {
                $.each(files, function(n,model) {
                    $.each(options.uploadfilelist, function (f, file) {
                        if (file.filename == model.name) {
                            selectEorr = false;
                            return false;
                        }
                    });
                });
            }
            if (!selectEorr) {
                commonFuncJS.openAlert("选择了重复资源,请重新选择资源文件上传!");
                return false;
            }
            //debugger
            var filenames = [];
            if (preLessonPageInit.FileList.length != 0) {
                filenames = GetalreadyExistFileNames(target);
            }
            var type = [];
            if (options.FileType!="") {
                type = options.FileType.split(",");
            }
            for (var i = 0; i < files.length; i++) {
                ///////////////检测文件重名////////////////
                var file = files[i];
                ///////////////检测文件大小////////////////
                var size = bytesToSize(file.size).split(' ')[0];

                if (file.type.indexOf("image")!=-1) {
                    if (10< (file.size / 1024 / 1024)) {
                        image_exist = true;
                        break;
                    }
                }
                if ($.inArray(file.name, filenames) > -1) {
                    exist = true;
                    break;
                }
                ///////////////检测文件名是否包含特殊字符////////////////
                name_exist = commonFuncJS.RegeMatch(file.name);
                if (!name_exist)
                    break;
                
                if (options.MaxSize < (file.size / 1024 / 1024)) {
                    size_exist = true;
                    break;
                }
                if (typeof (file.name)!="undefined") {
                    ///////////////检测文件类型限制////////////////
                    var arr = file.name.split(".");
                    if ($.inArray("." + arr[arr.length - 1].toString().toLowerCase(), type) < 0) {
                        type_exist = true;
                        break;
                    }
                }
                
            }
            if (image_exist) {
                commonFuncJS.openAlert("您上传的图片大小超过10M!");
                return false;
            }
            if (!name_exist) {
                commonFuncJS.openAlert("您上传的文件包含以下字符:~ ' ! @ # $ % ^ & * : \ / ? \" < > |,请修改!");
                return false;
            }
            if (options.IsCheckType&&type_exist) {
                //openAlert("当前系统支持上传" + options.FileType+"格式类型的文件!");
                commonFuncJS.openAlert("当前选择的文件包含了限制上传类型,请重新选择文件!");
                return false;
            }
            if (size_exist) {
                commonFuncJS.openAlert("文件大小超过" + options.MaxSize + "M");
                return false;
            }
            if (!exist) {
                $("#divUserComingSoon").hide();
                $("#divUserResource").show();
                /////////////////////文件显示列表+上传进度//////////////////////////////
                var html = "";
                for (var i = 0, n = files.length; i < n; i++) {
                    var guid = "";
                    options.uploadfilelist.push({ "filename": files[i].name });
                    html += '<tr id="' + guid + '" class="fileuploadlist newfilelist" name="' + files[i].name + '">';//tr标签
                    html += '<td class="title before">' + files[i].name + '</td>';//文件名称
                    html += '<td style="width: 80px;"><span style="width: 80px;">' + bytesToSize(files[i].size) + '</span></td>';
                    html+='<td class="colorBlue" style="width: 300px;"><div class="backColor"><span class="upon" style="width: 0%;"></span></div><div class="pre" style="display: inline-block"><span>0%</span><a class="startUp"></a><a class="delete"></a></div></td>';                        
                    html += '</tr>';
                }
                $("#tabUpload").show();
                $("#tabUpload").html(html);
                options.onChange.call(this, e);
            } else {
                commonFuncJS.openAlert("文件名重复");
                ele.remove();
                return false;
            }
        });
        $(target).append(ele);
        ele.click();
    }
    ////////////////////////////////////////////////////////////////
    ///////////////////////获取已经存在的文件名列表/////////////////
    ////////////////////////////////////////////////////////////////
    function GetalreadyExistFileNames(target) {
        var that = $(target);
        var fileInputs = that.find(":file");
        var options = $.data(target, "AjaxUpload").Options;

        var fileExists = options.uploadfilelist;
        var fileNames = [];
        
        /// 还存在的文件列表
        //$.each(fileExists, function (f, file) {
        //    var filename = file.filename;
        //    if ($.inArray(filename, fileNames) == -1) {
        //        fileNames.push(filename);
        //    }
        //});
        $.each(preLessonPageInit.FileList, function (f, obj) {
            var file= JSON.parse(obj).Data;
            var filename = file.FileName + "." + file.FileExtension;
            if ($.inArray(filename, fileNames) == -1) {
                fileNames.push(filename);
            }
        });
        return fileNames;
    }

    /// 上传文件
    function UploadFiles(target) {
        var that = $(target);
        $(".AjaxUpload_Button").attr({ "disabled": "disabled" });
        $(".tab .options .upload").attr("style", "background-color:#e0e4ed");

        var fileInputs = that.find(":file");
        var options = $.data(target, "AjaxUpload").Options;
        var deleteButtonUrl = options.DeleteButtonUrl;
        var onUploaded = options.onUploaded;
        var onInit = options.onInit;
        if (fileInputs.length > 0) {
            var total = 0;
            var uploaded = 0;
            var reponses = [];
            var fileExists = options.uploadfilelist;
            var fileNames = [];
            /// 还存在的文件列表
            $.each(fileExists, function (f, file) {
                var filename = file.filename;
                if ($.inArray(filename, fileNames) == -1) {
                    fileNames.push(filename);
                }
            });
            for (var i = 0; i < fileInputs.length; i++) {
                var fileinput = fileInputs[i];
                var files = fileinput.files;
                var num = 0;

                if (files.length > 0) {
                    onInit.call(null, data);
                    for (var j = 0, n = files.length; j < n; j++) {
                        if ($.inArray(files[j].name, fileNames) > -1) {
                            total++;
                            var filename = files[j].name;
                            var paramData = options.formData;

                            var data = new FormData();
                            data.append("uploadedfile[" + j + "]", files[j]);
                            if (paramData != null) {
                                for (var k in paramData) {
                                    data.append(k, paramData[k]);
                                }
                            }
                            var xhr = CreateXMLHttpRequest(target);
                            //////////////////监听上传进度////////////////////////
                            xhr.upload.addEventListener("progress",
                                function (data) {
                                    return function (e) {
                                        ChangeProcess(data, e, target);
                                    }
                                }(filename), false);
                            //////////////////上传结束////////////////////////
                            xhr.upload.addEventListener("loadend", function () {
                                uploaded++;
                            }, false);
                            //////////////////上传中////////////////////////
                            xhr.upload.addEventListener("load", function () {

                            }, false);
                            xhr.onreadystatechange = function () {
                                if (this.readyState == 4) {// 4 = "loaded"
                                    if (this.status == 200) {// 200 = OK                                   
                                        reponses.push(this.responseText);
                                        if (uploaded == $.data(target, "AjaxUpload").TotalFiles && uploaded == reponses.length) {
                                            setTimeout(function() {
                                                fileInputs.remove();
                                                $(".AjaxUpload_Button").removeAttr("disabled");
                                                $(".tab .options .upload").attr("style", "background-color:#f9a158");
                                                onUploaded.call(data, reponses,target);
                                            },100);
                                        }
                                    }
                                    else {
                                        debugger;
                                        alert("上传接口错误!");
                                    }
                                }
                            };

                            xhr.open("POST", options.url, true);
                            xhr.send(data);
                        }
                    }
                    var state = $.data(target, "AjaxUpload");
                    state.TotalFiles = total;
                    $.data(this, "AjaxUpload", state);
                }
            }
        } else {
            onUploaded.call(null, data);
        }
        return that;
    }

    $.fn.AjaxUpload = function (options, param) {
        var that = this;
        if (typeof options == "string") {
            var method = $.fn.AjaxUpload.Methods[options];
            if (method) {
                return method(this, param);
            }
        }
        options = options || {};

        return this.each(function () {
            var that = this;
            var state = $.data(this, "AjaxUpload");
            if (state) {
                $.extend(state.Options, options);
            } else {
                var _options = $.extend({}, $.fn.AjaxUpload.Default, options);
                InitFileDiv(this, _options);
                state = $.data(this, "AjaxUpload", {
                    Options: _options,
                    TotalFiles: 0
                });
            }
        })
    }
    $.fn.AjaxUpload.Default = {
        url: '/Ashx/UploadFilesHandler.ashx?r=' + Math.random(),
        formData: {},//要传递的参数
        Text: "选择文件",
        BtnCss: "",
        ContinueAddText: "继续添加",
        multiple: true,//是否支持多文件上传
        MaxSize:500,//最大上传文件大小  单位M
        Available: true,
        IsCheckType:true,//是否进行文件类型限制
        FileType:"",//支持的文件类型
        DeleteButtonUrl: '',
        uploadfilelist: [],
        onInit: function () {

        },
        onChange: function () {

        },
        onUploaded: function () {

        }// 文件上传完毕后的回调函数
    };
    $.fn.AjaxUpload.Methods = {
        options: function (jq) {
            return $.data(jq[0], "AjaxUpload").Options;
        },
        upload: function (jq) {
            return UploadFiles(jq[0]);
        }
    };

})(jQuery)



/*
 * 功能：生成一个GUID码，其中GUID以14个以下的日期时间及18个以上的16进制随机数组成，GUID存在一定的重复概率，
 * 但重复概率极低，理论上重复概率为每10ms有1/(16^18)，即16的18次方分之1，重复概率低至可忽略不计
 * 免责声明：此代码为作者学习专用，如在使用者在使用过程中因代码问题造成的损失，与作者没有任何关系
 * 日期：2014年9月4日
 * 作者：wyc
 */
function GUID() {
    this.date = new Date();

    /* 判断是否初始化过，如果初始化过以下代码，则以下代码将不再执行，实际中只执行一次 */
    if (typeof this.newGUID != 'function') {

        /* 生成GUID码 */
        GUID.prototype.New = function () {
            this.date = new Date();
            var guidStr = '';
            sexadecimalDate = this.hexadecimal(this.getGUIDDate(), 16);
            sexadecimalTime = this.hexadecimal(this.getGUIDTime(), 16);
            for (var i = 0; i < 9; i++) {
                guidStr += Math.floor(Math.random() * 16).toString(16);
            }
            guidStr += sexadecimalDate;
            guidStr += sexadecimalTime;
            while (guidStr.length < 32) {
                guidStr += Math.floor(Math.random() * 16).toString(16);
            }
            return guidStr;
            //return this.formatGUID(guidStr);
        }

        /*
         * 功能：获取当前日期的GUID格式，即8位数的日期：19700101
         * 返回值：返回GUID日期格式的字条串
         */
        GUID.prototype.getGUIDDate = function () {
            return this.date.getFullYear() + this.addZero(this.date.getMonth() + 1) + this.addZero(this.date.getDay());
        }

        /*
         * 功能：获取当前时间的GUID格式，即8位数的时间，包括毫秒，毫秒为2位数：12300933
         * 返回值：返回GUID日期格式的字条串
         */
        GUID.prototype.getGUIDTime = function () {
            return this.addZero(this.date.getHours()) + this.addZero(this.date.getMinutes()) + this.addZero(this.date.getSeconds()) + this.addZero(parseInt(this.date.getMilliseconds() / 10));
        }

        /*
        * 功能: 为一位数的正整数前面添加0，如果是可以转成非NaN数字的字符串也可以实现
         * 参数: 参数表示准备再前面添加0的数字或可以转换成数字的字符串
         * 返回值: 如果符合条件，返回添加0后的字条串类型，否则返回自身的字符串
         */
        GUID.prototype.addZero = function (num) {
            if (Number(num).toString() != 'NaN' && num >= 0 && num < 10) {
                return '0' + Math.floor(num);
            } else {
                return num.toString();
            }
        }

        /* 
         * 功能：将y进制的数值，转换为x进制的数值
         * 参数：第1个参数表示欲转换的数值；第2个参数表示欲转换的进制；第3个参数可选，表示当前的进制数，如不写则为10
         * 返回值：返回转换后的字符串
         */
        GUID.prototype.hexadecimal = function (num, x, y) {
            if (y != undefined) {
                return parseInt(num.toString(), y).toString(x);
            } else {
                return parseInt(num.toString()).toString(x);
            }
        }

        /*
         * 功能：格式化32位的字符串为GUID模式的字符串
         * 参数：第1个参数表示32位的字符串
         * 返回值：标准GUID格式的字符串
         */
        GUID.prototype.formatGUID = function (guidStr) {
            var str1 = guidStr.slice(0, 8) + '-',
              str2 = guidStr.slice(8, 12) + '-',
              str3 = guidStr.slice(12, 16) + '-',
              str4 = guidStr.slice(16, 20) + '-',
              str5 = guidStr.slice(20);
            return str1 + str2 + str3 + str4 + str5;
        }
    }
}