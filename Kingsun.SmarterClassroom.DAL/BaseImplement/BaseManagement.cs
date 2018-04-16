using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;
using Kingsun.DB;
using Kingsun.SmarterClassroom.Com;
using Kingsun.SmarterClassroom.Mod;

namespace Kingsun.SmarterClassroom.DAL
{
    public class BaseManagement
    {
        protected string _operatorError = string.Empty;
        /// <summary>
        /// 查询所有
        /// </summary>
        /// <returns></returns>
        public IList<T> SelectAll<T>() where T : Kingsun.DB.Action, new()
        {
            IDBManage dbManage = DBFactory.CreateDBManage(AppSetting.ConnectionString);
            IList<T> list = dbManage.Search<T>("1=1");
            _operatorError = dbManage.ErrorMsg == null ? "" : dbManage.ErrorMsg;
            return list;
        }
        /// <summary>
        /// 按条件查询
        /// </summary>
        /// <returns></returns>
        public IList<T> Search<T>(string where, string orderby = "") where T : Kingsun.DB.Action, new()
        {
            IDBManage dbManage = DBFactory.CreateDBManage(AppSetting.ConnectionString);
            if (string.IsNullOrEmpty(orderby))
            {
                IList<T> list = dbManage.Search<T>(where);
                _operatorError = dbManage.ErrorMsg == null ? "" : dbManage.ErrorMsg;
                return list;
            }
            else
            {
                IList<T> list = dbManage.Search<T>(where, orderby);
                _operatorError = dbManage.ErrorMsg == null ? "" : dbManage.ErrorMsg;
                return list;
            }
        }

        public IList<T> Search<T>(string tableName, string where, string orderby = "") where T : Kingsun.DB.Action, new()
        {
            IDBManage dbManage = DBFactory.CreateDBManage(AppSetting.ConnectionString);
            if (string.IsNullOrEmpty(orderby))
            {
                IList<T> list = dbManage.Search<T>(tableName, where, orderby);
                _operatorError = dbManage.ErrorMsg == null ? "" : dbManage.ErrorMsg;
                return list;
            }
            else
            {
                IList<T> list = dbManage.Search<T>(tableName, where, orderby);
                _operatorError = dbManage.ErrorMsg == null ? "" : dbManage.ErrorMsg;
                return list;
            }
        }
        /// <summary>
        /// 查询
        /// </summary>
        /// <param name="course"></param>
        /// <returns></returns>
        public T Select<T>(Guid id) where T : Kingsun.DB.Action, new()
        {
            IDBManage dbManage = DBFactory.CreateDBManage(AppSetting.ConnectionString);
            T t = dbManage.Select<T>(id);
            _operatorError = dbManage.ErrorMsg == null ? "" : dbManage.ErrorMsg;
            return t;
        }
        /// <summary>
        /// 查询
        /// </summary>
        /// <param name="course"></param>
        /// <returns></returns>
        public T Select<T>(object id) where T : Kingsun.DB.Action, new()
        {
            IDBManage dbManage = DBFactory.CreateDBManage(AppSetting.ConnectionString);
            T t = dbManage.Select<T>(id);
            _operatorError = dbManage.ErrorMsg == null ? "" : dbManage.ErrorMsg;
            return t;
        }
        public T Select<T>(string tableName, object id) where T : Kingsun.DB.Action, new()
        {
            IDBManage dbManage = DBFactory.CreateDBManage(AppSetting.ConnectionString);
            T t = dbManage.Select<T>(tableName, id);
            _operatorError = dbManage.ErrorMsg == null ? "" : dbManage.ErrorMsg;
            return t;
        }
        /// <summary>
        /// 搜索
        /// </summary>
        /// <param name="course"></param>
        /// <returns></returns>
        public T SelectByCondition<T>(string where) where T : Kingsun.DB.Action, new()
        {
            IDBManage dbManage = DBFactory.CreateDBManage(AppSetting.ConnectionString);
            T t = dbManage.SelectByCondition<T>(where);
            _operatorError = dbManage.ErrorMsg == null ? "" : dbManage.ErrorMsg;
            return t;
        }
        /// <summary>
        /// 插入
        /// </summary>
        /// <param name="course"></param>
        /// <returns></returns>
        public bool Insert<T>(T info) where T : Kingsun.DB.Action, new()
        {
            IDBManage dbManage = DBFactory.CreateDBManage(AppSetting.ConnectionString);
            bool result = dbManage.Insert<T>(info);
            if (!result)
            {
                _operatorError = dbManage.ErrorMsg == null ? "" : dbManage.ErrorMsg;
            }
            return result;
        }

        public bool Insert<T>(string tableName, T info) where T : Kingsun.DB.Action, new()
        {
            IDBManage dbManage = DBFactory.CreateDBManage(AppSetting.ConnectionString);
            bool result = dbManage.Insert<T>(tableName, info);
            if (!result)
            {
                _operatorError = dbManage.ErrorMsg == null ? "" : dbManage.ErrorMsg;
            }
            return result;
        }
        /// <summary>
        /// 修改
        /// </summary>
        /// <param name="course"></param>
        /// <returns></returns>
        public bool Update<T>(T info) where T : Kingsun.DB.Action, new()
        {
            IDBManage dbManage = DBFactory.CreateDBManage(AppSetting.ConnectionString);
            bool result = dbManage.Update<T>(info);
            if (!result)
            {
                _operatorError = dbManage.ErrorMsg;
            }
            return result;
        }
        public bool Update<T>(string tableName, T info) where T : Kingsun.DB.Action, new()
        {
            IDBManage dbManage = DBFactory.CreateDBManage(AppSetting.ConnectionString);
            bool result = dbManage.Update<T>(tableName, info);
            if (!result)
            {
                _operatorError = dbManage.ErrorMsg;
            }
            return result;
        }
        /// <summary>
        /// 删除
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public bool Delete<T>(Guid id) where T : Kingsun.DB.Action, new()
        {
            IDBManage dbManage = DBFactory.CreateDBManage(AppSetting.ConnectionString);
            bool result = dbManage.Delete<T>(id);
            if (!result)
            {
                _operatorError = dbManage.ErrorMsg;
            }
            return result;
        }
        /// <summary>
        /// 按条件删除
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public bool DeleteByCondition<T>(string where) where T : Kingsun.DB.Action, new()
        {
            IDBManage dbManage = DBFactory.CreateDBManage(AppSetting.ConnectionString);
            bool result = dbManage.DeleteByCondition<T>(where);
            if (!result)
            {
                _operatorError = dbManage.ErrorMsg;
            }
            return result;
        }
        /// <summary>
        /// 删除
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public bool Delete<T>(object id) where T : Kingsun.DB.Action, new()
        {
            IDBManage dbManage = DBFactory.CreateDBManage(AppSetting.ConnectionString);
            bool result = dbManage.Delete<T>(id);
            if (!result)
            {
                _operatorError = dbManage.ErrorMsg;
            }
            return result;
        }

        /// <summary>
        /// 多项删除
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="IDs"></param>
        /// <returns></returns>
        public bool Delete<T>(List<object> IDs) where T : Kingsun.DB.Action, new()
        {
            IDBManage dbManage = DBFactory.CreateDBManage(AppSetting.ConnectionString);
            bool result = dbManage.Delete<T>(IDs);
            if (!result)
            {
                _operatorError = dbManage.ErrorMsg;
            }
            return result;
        }

        /// <summary>
        /// 执行SQL语句
        /// </summary>
        /// <param name="sqlstr"></param>
        /// <returns></returns>
        public System.Data.DataSet ExecuteSql(string sqlstr)
        {
            IDBManage dbManage = DBFactory.CreateDBManage(AppSetting.ConnectionString);
            System.Data.DataSet ds = dbManage.ExecuteQuery(sqlstr);
            if (ds == null)
            {
                _operatorError = dbManage.ErrorMsg;
            }
            return ds;
        }

        /// <summary>
        /// 执行SQL语句
        /// </summary>
        /// <param name="sqlstr"></param>
        /// <returns></returns>
        public bool ExecuteNonQuery(string sqlstr)
        {
            IDBManage dbManage = DBFactory.CreateDBManage(AppSetting.ConnectionString);

            return dbManage.ExecuteNonQuery(sqlstr);
        }
        /// <summary>
        /// 执行SQL语句事务提交
        /// </summary>
        /// <param name="sqlstr"></param>
        /// <returns></returns>
        public bool ExecuteNonQuery1(string sqlstr)
        {
            bool flag;
            IDBManage dbManage = DBFactory.CreateDBManage(AppSetting.ConnectionString);
            dbManage.BeginTransaction();
            flag = dbManage.ExecuteNonQuery(sqlstr);
            if(flag){
                dbManage.Commit();               
            }else{
                dbManage.Rollback();            
            }
            return flag;
        }
        /// <summary>
        /// 执行SQL语句
        /// </summary>
        /// <param name="sqlstr"></param>
        /// <param name="list"></param>
        /// <returns></returns>
        public System.Data.DataSet ExecuteSql(string sqlstr, List<System.Data.Common.DbParameter> list)
        {
            IDBManage dbManage = DBFactory.CreateDBManage(AppSetting.ConnectionString);
            System.Data.DataSet ds = dbManage.ExecuteQuery(sqlstr, list);
            if (ds == null)
            {
                _operatorError = dbManage.ErrorMsg;
            }
            return ds;
        }

        /// <summary>
        /// 将table数据转换为list
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="dt"></param>
        /// <returns></returns>
        public List<T> FillData<T>(System.Data.DataTable dt) where T : Kingsun.DB.Action, new()
        {
            IDBManage dbManage = DBFactory.CreateDBManage(AppSetting.ConnectionString);
            return dbManage.FillData<T>(dt);
        }

        public System.Data.DataSet ExecuteProcedure(string ProcName, List<System.Data.Common.DbParameter> list)
        {
            IDBManage dbManage = DBFactory.CreateDBManage(AppSetting.ConnectionString);
            System.Data.DataSet ds = dbManage.ExecuteProcedure(ProcName, list);
            if (ds == null)
            {
                _operatorError = dbManage.ErrorMsg;
            }
            return ds;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="tabelName"></param>
        /// <param name="where"></param>
        /// <param name="orderString"></param>
        /// <param name="orderType"></param>
        /// <returns></returns>
        public object QueryPaginationList<T>(string tabelName, string where, string orderString, int pageIndex, int pageSize = 20, int orderType = 1) where T : Kingsun.DB.Action, new()
        {
            try
            {
                PageParameter param = new PageParameter();
                param.OrderColumns = orderString;
                param.TbNames = tabelName;
                param.IsOrderByASC = orderType;
                param.Columns = "*";
                param.PageIndex = pageIndex;
                param.PageSize = pageSize;
                //param.Where
                param.Where = string.IsNullOrEmpty(where) ? "1=1" : where;
                List<System.Data.Common.DbParameter> list = new List<System.Data.Common.DbParameter>();
                list = param.getParameterList();
                System.Data.DataSet ds = ExecuteProcedure("proc_pageView", list);
                if (ds != null && ds.Tables.Count == 2)
                {
                    object returnData = new
                    {
                        Total = ds.Tables[1].Rows[0][0],
                        List = FillData<T>(ds.Tables[0])
                    };
                    return returnData;
                }
                else
                {
                    return new
                    {
                        Total = 0,
                        List = new List<T>()
                    };
                }
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// 评论取数据的存储过程
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="tabelName"></param>
        /// <param name="where"></param>
        /// <param name="orderString"></param>
        /// <param name="orderType"></param>
        /// <returns></returns>
        public object QueryPaginationList<T>(string tabelName,string columns, string where, string orderString, int pageIndex, int pageSize = 20, int orderType = 1) where T : Kingsun.DB.Action, new()
        {
            try
            {
                PageParameter param = new PageParameter();
                param.OrderColumns = orderString;
                param.TbNames = tabelName;
                param.IsOrderByASC = orderType;
                param.Columns = "*";
                param.Columns = string.IsNullOrEmpty(columns) ? "*" : columns;
                param.PageIndex = pageIndex;
                param.PageSize = pageSize;
                //param.Where
                param.Where = string.IsNullOrEmpty(where) ? "" : where;

                List<System.Data.Common.DbParameter> list = new List<System.Data.Common.DbParameter>();
                list = param.getParameterList();
                System.Data.DataSet ds = ExecuteProcedure("proc_commentPageView", list);
                if (ds != null && ds.Tables.Count == 2)
                {
                    object returnData = new
                    {
                        Total = ds.Tables[1].Rows[0][0],
                        List = FillData<T>(ds.Tables[0])
                    };
                    return returnData;
                }
                else
                {
                    return new
                    {
                        Total = 0,
                        List = new List<T>()
                    };
                }
            }
            catch
            {
                throw;
            }
        }

        /// <summary>
        /// 资源取数据的存储过程
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="tabelName"></param>
        /// <param name="where"></param>
        /// <param name="orderString"></param>
        /// <param name="orderType"></param>
        /// <returns></returns>
        public object QueryPaginationListResource<T>(string tabelName, string columns, string where, string orderString, int pageIndex, int pageSize = 20, int orderType = 1) where T : Kingsun.DB.Action, new()
        {
            try
            {
                List<System.Data.Common.DbParameter> list = new List<System.Data.Common.DbParameter>();
                System.Data.SqlClient.SqlParameter[] param = new System.Data.SqlClient.SqlParameter[9];
                param[0] = new System.Data.SqlClient.SqlParameter("@Columns", System.Data.SqlDbType.NVarChar, 500);
                param[1] = new System.Data.SqlClient.SqlParameter("@ModData", System.Data.SqlDbType.Text);
                param[2] = new System.Data.SqlClient.SqlParameter("@WhereCondition", System.Data.SqlDbType.NVarChar, 1500);
                param[3] = new System.Data.SqlClient.SqlParameter("@OrderColumns", System.Data.SqlDbType.NVarChar, 350);
                param[4] = new System.Data.SqlClient.SqlParameter("@IsOrderByASC", System.Data.SqlDbType.Int);
                param[5] = new System.Data.SqlClient.SqlParameter("@CurrentPageIndex", System.Data.SqlDbType.Int);
                param[6] = new System.Data.SqlClient.SqlParameter("@PageSize", System.Data.SqlDbType.Int);
                param[7] = new System.Data.SqlClient.SqlParameter("@TotalPages", System.Data.SqlDbType.Int);
                param[8] = new System.Data.SqlClient.SqlParameter("@TotalRecords", System.Data.SqlDbType.Int);
                param[0].Value = string.IsNullOrEmpty(columns) ? "*" : columns;
                param[1].Value = tabelName;
                param[2].Value = string.IsNullOrEmpty(where) ? "" : where;
                param[3].Value = orderString;
                param[4].Value = orderType;
                param[5].Value = pageIndex;
                param[6].Value = pageSize;
                param[7].Direction = System.Data.ParameterDirection.Output;
                param[8].Direction = System.Data.ParameterDirection.Output;
                list.AddRange(param);

                System.Data.DataSet ds = ExecuteProcedure("proc_ResourcePageView", list);
                if (ds != null && ds.Tables.Count == 2)
                {
                    object returnData = new
                    {
                        Total = ds.Tables[1].Rows[0][0],
                        List = FillData<T>(ds.Tables[0])
                    };
                    return returnData;
                }
                else
                {
                    return new
                    {
                        Total = 0,
                        List = new List<T>()
                    };
                }
            }
            catch
            {
                throw;
            }
        }

        /// <summary>
        /// 资源取数据的存储过程 用于导出excel
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="tabelName"></param>
        /// <param name="where"></param>
        /// <param name="orderString"></param>
        /// <param name="orderType"></param>
        /// <returns></returns>
        public object QueryResourceAll<T>(string tabelName, string columns,string orderString, int orderType = 1) where T : Kingsun.DB.Action, new()
        {
            try
            { 
                List<System.Data.Common.DbParameter> list = new List<System.Data.Common.DbParameter>();
                System.Data.SqlClient.SqlParameter[] param = new System.Data.SqlClient.SqlParameter[4];
                param[0] = new System.Data.SqlClient.SqlParameter("@Columns", System.Data.SqlDbType.NVarChar, 500);
                param[1] = new System.Data.SqlClient.SqlParameter("@ModData", System.Data.SqlDbType.Text);
                param[2] = new System.Data.SqlClient.SqlParameter("@OrderColumns", System.Data.SqlDbType.NVarChar, 350);
                param[3] = new System.Data.SqlClient.SqlParameter("@IsOrderByASC", System.Data.SqlDbType.Int); 
                param[0].Value = string.IsNullOrEmpty(columns) ? "*" : columns;
                param[1].Value = tabelName; 
                param[2].Value = orderString;
                param[3].Value = orderType;  
                list.AddRange(param);

                System.Data.DataSet ds = ExecuteProcedure("proc_ResourceAllView", list);
                if (ds != null && ds.Tables.Count == 1)
                {
                    object returnData = new
                    { 
                        List = FillData<T>(ds.Tables[0])
                    };
                    return returnData;
                }
                else
                {
                    return new
                    { 
                        List = new List<T>()
                    };
                }
            }
            catch
            {
                throw;
            }
        }

        /// <summary>
        /// 得到实体List
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="tabelName"></param>
        /// <param name="where"></param>
        /// <param name="orderString"></param>
        /// <param name="orderType"></param>
        /// <returns></returns>
        public tb_UserMessageAll<T> QueryPageList<T>(string tabelName, string where, string orderString, int pageIndex, int pageSize = 20, int orderType = 1) where T : Kingsun.DB.Action, new()
        {
            try
            {
                PageParameter param = new PageParameter();
                param.OrderColumns = orderString;
                param.TbNames = tabelName;
                param.IsOrderByASC = orderType;
                param.Columns = "*";
                param.PageIndex = pageIndex;
                param.PageSize = pageSize;
                //param.Where
                param.Where = string.IsNullOrEmpty(where) ? "1=1" : where;
                List<System.Data.Common.DbParameter> list = new List<System.Data.Common.DbParameter>();
                list = param.getParameterList();
                System.Data.DataSet ds = ExecuteProcedure("proc_pageView", list);
                if (ds != null && ds.Tables.Count == 2)
                {
                    //object returnData = new
                    //{
                    //    Total = ds.Tables[1].Rows[0][0],
                    //    List = FillData<T>(ds.Tables[0])
                    //};
                    tb_UserMessageAll<T> tb = new tb_UserMessageAll<T>();
                    tb.Total = ds.Tables[1].Rows[0][0].ToString();
                    tb.ListT = FillData<T>(ds.Tables[0]);
                    return tb;
                }
                else
                {
                    tb_UserMessageAll<T> tb = new tb_UserMessageAll<T>();
                    return tb;
                }
            }
            catch
            {
                throw;
            }
        }
        public partial class tb_UserMessageAll<T> : Kingsun.DB.Action
        {
            public string Total { get; set; }
            public List<T> ListT{ get; set; }
        }
        /// <summary>
        /// 获取老师班级导学列表
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="UserID"></param>
        /// <param name="ClassID"></param>
        /// <returns></returns>
        public IList<T> QueryGuidingList<T>(string UserID, string ClassID) where T : Kingsun.DB.Action, new()
        {
            try
            {
                List<System.Data.Common.DbParameter> list = new List<System.Data.Common.DbParameter>();
                System.Data.SqlClient.SqlParameter[] param = new System.Data.SqlClient.SqlParameter[2];
                param[0] = new System.Data.SqlClient.SqlParameter("@UserID", UserID);
                param[1] = new System.Data.SqlClient.SqlParameter("@ClassID", ClassID);            
                list.AddRange(param);
                System.Data.DataSet ds = ExecuteProcedure("Pro_UserClassGuid", list);
                if (ds == null)
                {
                    return null;
                }
                IList<T> GuidList = FillData<T>(ds.Tables[0]);

                return GuidList;
            }
            catch
            {
                throw;
            }
        }
        ///// <summary>
        ///// 分页获取方案dataset
        ///// </summary>
        ///// <typeparam name="T"></typeparam>
        ///// <param name="tabelName"></param>
        ///// <param name="where"></param>
        ///// <param name="orderString"></param>
        ///// <param name="orderType"></param>
        ///// <returns></returns>
        //public System.Data.DataSet QuerySchemeList(string tabelName, string columns, string where, string orderString, int pageIndex, int pageSize = 8, int orderType = 1)
        //{
        //    try
        //    {
        //        PageParameter param = new PageParameter();
        //        param.OrderColumns = orderString;
        //        param.TbNames = tabelName;
        //        param.IsOrderByASC = orderType;
        //        //param.Columns = "*";
        //        param.Columns = string.IsNullOrEmpty(columns) ? "*" : columns;
        //        param.PageIndex = pageIndex;
        //        param.PageSize = pageSize;
        //        //param.Where
        //        param.Where = string.IsNullOrEmpty(where) ? "" : where;

        //        List<System.Data.Common.DbParameter> list = new List<System.Data.Common.DbParameter>();
        //        list = param.getParameterList();
        //        System.Data.DataSet ds = ExecuteProcedure("proc_SchemePageView", list);
        //        return ds;
        //    }
        //    catch
        //    {
        //        throw;
        //    }
        //}
    }
}
