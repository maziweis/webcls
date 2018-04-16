using Kingsun.DB;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kingsun.SmarterClassroom.Mod
{
    [TableAttribute("clr_pageInit")]
    public class PageInit : Kingsun.DB.Action
    {
        /// <summary>
        /// 用户GuidID
        /// </summary>
        [FieldAttribute("PageInitID", null, EnumFieldUsage.PrimaryKey, DbType.String)]
        public string PageInitID { get; set; }  //页面初始化操作ID
        /// <summary>
        /// 用户GuidID
        /// </summary>
        [FieldAttribute("UserID", null, EnumFieldUsage.CommonField, DbType.Int32)]
        public long? UserID { get; set; }  //用户ID
        /// <summary>
        /// 教材类型
        /// </summary>
        [FieldAttribute("BookType", null, EnumFieldUsage.CommonField, DbType.Int32)]
        public int? BookType { get; set; }  //教材类型
        /// <summary>
        /// 学段
        /// </summary>
        [FieldAttribute("Stage", null, EnumFieldUsage.CommonField, DbType.Int32)]
        public int? Stage { get; set; }//学段
        /// <summary>
        /// 学科ID
        /// </summary>
        [FieldAttribute("SubjectID", null, EnumFieldUsage.CommonField, DbType.Int32)]
        public int? SubjectID { get; set; }//学科ID
        /// <summary>
        /// 版本ID
        /// </summary>
        [FieldAttribute("EditionID", null, EnumFieldUsage.CommonField, DbType.Int32)]
        public int? EditionID { get; set; }//版本ID
        /// <summary>
        /// 年级ID
        /// </summary>
        [FieldAttribute("GradeID", null, EnumFieldUsage.CommonField, DbType.Int32)]
        public int? GradeID { get; set; }//年级ID
        /// <summary>
        /// 班级ID
        /// </summary>
        [FieldAttribute("ClassID", null, EnumFieldUsage.CommonField, DbType.Int32)]
        public int? ClassID { get; set; }//班级ID
        /// <summary>
        /// 书籍ID
        /// </summary>
        [FieldAttribute("BookID", null, EnumFieldUsage.CommonField, DbType.Int32)]
        public int? BookID { get; set; }//书籍ID
        /// <summary>
        /// 单元ID
        /// </summary>
        [FieldAttribute("UnitID", null, EnumFieldUsage.CommonField, DbType.Int32)]
        public int? UnitID { get; set; }//单元ID
        /// <summary>
        /// 页码
        /// </summary>
        [FieldAttribute("PageNum", null, EnumFieldUsage.CommonField, DbType.Int32)]
        public int? PageNum { get; set; }//页码
        /// <summary>
        /// 页面名称
        /// </summary>
        [FieldAttribute("AspxName", null, EnumFieldUsage.CommonField, DbType.String)]
        public string AspxName { get; set; }//网页名称
        /// <summary>
        /// 创建时间
        /// </summary>
        [FieldAttribute("CreateTime", null, EnumFieldUsage.CommonField, DbType.DateTime)]
        public DateTime CreateTime { get; set; }//创建时间
    }
}
