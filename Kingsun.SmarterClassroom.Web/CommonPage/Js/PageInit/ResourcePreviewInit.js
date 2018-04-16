
var ResourcePreviewInit = function () {
    var Current = this;
    this.PreviewUrl = Constant.file_Url + "Preview.ashx";

    this.Init = function () {
        var resourceID = Common.QueryString.GetValue("ID");// "2aedaf98-cc72-4d3a-adaf-83717fa1297f";// 
        if (resourceID == undefined)
            return;
        var obj = { ID: resourceID };
        Current.GetResourceByID(obj, function (res) {
            if (res!=null) {
                var resource = res[0];
                Current.GetPreviewUrl(resource.FileID, Current.PreviewUrl, function (data) {
                    if (data.CanPreview) {
                        // $("#Title").html(res.ResourceName);
                        //alert(data.URL);
                        $("#previewPage").attr("src", data.URL);
                    }
                    else {
                        art.dialog.tips("预览失败。");
                    }
                });
            } else {
                art.dialog.tips("资源丢失!");
            }
        });
    };
    /// 通过资源ID获取资源库资源数据
    this.GetResourceByID = function (obj, callback) {
        Common.ResourceAjax("GetResourceByID.sun", obj, function (data) {
            if (data) {
                return callback(data.Data);
            }
        });
    };
    this.GetPreviewUrl = function (id, url, callback) {
        var sendValues = { FileID: id};
        $.ajax({
            type: "POST",
            url: url,
            data: sendValues,
            dataType: "jsonp",
            async: true,
            success: function (response) {
                callback(response);
            },
            error: function (request, status, error) {
            }
        });
    };
};
var resourcePreviewInit = null;
$(function() {
    resourcePreviewInit = new ResourcePreviewInit();
    resourcePreviewInit.Init();
});