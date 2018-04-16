using Kingsun.SmarterClassroom.BLL;
using Kingsun.SmarterClassroom.Com;
using Kingsun.SmarterClassroom.Mod;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.SessionState;

namespace SmarterClassroomWeb.Handler
{
    /// <summary>
    /// Handler 的摘要说明
    /// </summary>
    public class Handler : IHttpHandler, IRequiresSessionState
    {

        public void ProcessRequest(HttpContext context)
        {
            try
            {
                string formData = context.Request.Form["Form"];
                if (string.IsNullOrEmpty(formData))
                {
                    SyncResponse response = new SyncResponse();
                    response.Success = false;
                    response.ErrorMsg = "没有找到相应的数据包!";
                    response.RequestID = "";
                    response.Data = null;
                    context.Response.Write(JsonHelper.EncodeJson(response));
                    context.Response.End();
                    return;
                }
                SyncForm form = JsonHelper.DecodeJson<SyncForm>(formData);
                if (form == null)
                {
                    SyncResponse response = new SyncResponse();
                    response.Success = false;
                    response.ErrorMsg = "没有找到相应的数据包!";
                    response.RequestID = "";
                    response.Data = null;
                    context.Response.Write(JsonHelper.EncodeJson(response));
                    context.Response.End();
                    return;
                }
                string serviceID = form.SKEY;
                if (string.IsNullOrEmpty(serviceID))
                {
                    SyncResponse response = new SyncResponse();
                    response.Success = false;
                    response.ErrorMsg = "没有指定处理方法!";
                    response.RequestID = form.RID;
                    response.Data = null;
                    context.Response.Write(JsonHelper.EncodeJson(response));
                    context.Response.End();
                    return;
                }
                else
                {
                    Type objType = Type.GetType("Kingsun.SmarterClassroom.BLL." + serviceID.Trim() + ",Kingsun.SmarterClassroom.BLL");
                    if (objType != null)
                    {
                        string package = form.Pack;
                        string returnStr = null;

                        if (String.IsNullOrEmpty(package))
                        {
                            //返回错误信息
                            returnStr = SyncResponse.GetErrorResponseString("无法找到参数包");
                        }
                        else
                        {
                            SyncRequest request = SyncRequest.DecodeRequest(package);
                            if (request == null)
                            {
                                returnStr = SyncResponse.GetErrorResponseString("参数包解析失败");
                            }
                            else
                            {
                                BaseImplement obj = Activator.CreateInstance(objType) as BaseImplement;
                                SyncResponse response;
                                if (obj != null)
                                {
                                    try
                                    {

                                        if ((request.Data != null) && (request.Data != String.Empty))
                                        {
                                            //验证传递参数是否存在SQL攻击嫌疑
                                            //true - 有注入, false - 没有注入
                                            bool result = Utils.filterSql(request.Data);
                                            if (result)
                                            {
                                                response = SyncResponse.GetErrorResponse("有SQL攻击嫌疑，请停止操作。");
                                            }
                                            else
                                            {
                                                response = obj.ProcessRequest(request);
                                            }
                                            //response = obj.ProcessRequest(request);
                                        }
                                        else
                                        {
                                            response = SyncResponse.GetErrorResponse("无法获取参数，请联系管理员。");
                                        }

                                    }
                                    catch (Exception ex)
                                    {
                                        response = SyncResponse.GetErrorResponse("服务接口内部错误，请联系管理员。" + ex.Message, request);
                                    }
                                }
                                else
                                {
                                    response = SyncResponse.GetErrorResponse("无法实例化服务接口！", request);
                                }
                                returnStr = JsonHelper.EncodeJson(response);
                            }
                        }
                        context.Response.Write(returnStr);
                    }
                    else
                    {
                        SyncResponse response = new SyncResponse();
                        response.Success = false;
                        response.ErrorMsg = "无法确定处理程序!";
                        response.RequestID = form.RID;
                        response.Data = null;
                        context.Response.Write(JsonHelper.EncodeJson(response));
                        context.Response.End();
                    }
                }
            }
            catch
            {
                SyncResponse response = new SyncResponse();
                response.Success = false;
                response.ErrorMsg = "后台处理异常。";
                response.RequestID = "";
                response.Data = null;
                context.Response.Write(JsonHelper.EncodeJson(response));
                context.Response.End();
            }
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}