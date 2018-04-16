using Kingsun.DB;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kingsun.SmarterClassroom.Mod
{
    //[TableAttribute("clr_electronic_book")]
    //public class UserStandBook : Kingsun.DB.Action
    //{
    //    /// <summary>
    //    /// ID
    //    /// </summary>
    //    [FieldAttribute("ID", null, EnumFieldUsage.PrimaryKey, DbType.Int32)]
    //    public int ID { get; set; }

    //    /// <summary>
    //    /// 教材ID
    //    /// </summary>
    //    [FieldAttribute("BookID", null, EnumFieldUsage.CommonField, DbType.Int32)]
    //    public int BookID { get; set; }

    //    /// <summary>
    //    /// 科目ID
    //    /// </summary>
    //    [FieldAttribute("SubjectID", null, EnumFieldUsage.CommonField, DbType.Int32)]
    //    public int SubjectID { get; set; }
    //    /// <summary>
    //    /// 版本ID
    //    /// </summary>
    //    [FieldAttribute("EditionID", null, EnumFieldUsage.CommonField, DbType.Int32)]
    //    public int EditionID { get; set; }
    //    /// <summary>
    //    /// 年级ID
    //    /// </summary>
    //    [FieldAttribute("GradeID", null, EnumFieldUsage.CommonField, DbType.Int32)]
    //    public int GradeID { get; set; }
    //    /// <summary>
    //    /// 年级ID
    //    /// </summary>
    //    [FieldAttribute("Stage", null, EnumFieldUsage.CommonField, DbType.Int32)]
    //    public int Stage { get; set; }
    //    /// <summary>
    //    /// 教材类型
    //    /// </summary>
    //    [FieldAttribute("BookType", null, EnumFieldUsage.CommonField, DbType.Int32)]
    //    public int BookType { get; set; }
    //    /// <summary>
    //    /// 用户ID
    //    /// </summary>
    //    [FieldAttribute("UserID", null, EnumFieldUsage.CommonField, DbType.String)]
    //    public String UserID { get; set; }
    //    /// <summary>
    //    /// 创建时间
    //    /// </summary>
    //    [FieldAttribute("CreateDate", null, EnumFieldUsage.CommonField, DbType.DateTime)]
    //    public DateTime? CreateDate { get; set; }
    //}

    public class UserStandBook
    {
        /// <summary>
        /// ID
        /// </summary>
        public int ID { get; set; }

        /// <summary>
        /// 教材ID
        /// </summary>
        public int? BookID { get; set; }

        /// <summary>
        /// 科目ID
        /// </summary>
        public int? SubjectID { get; set; }
        /// <summary>
        /// 版本ID
        /// </summary>
        public int? EditionID { get; set; }
        /// <summary>
        /// 年级ID
        /// </summary>
        public int? GradeID { get; set; }
        /// <summary>
        /// 年级ID
        /// </summary>
        public int? Stage { get; set; }
        /// <summary>
        /// 教材类型
        /// </summary>
        public int? BookType { get; set; }
        /// <summary>
        /// 用户ID
        /// </summary>
        public long? UserID { get; set; }
        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime? CreateDate { get; set; }
    }

    public class UserStandBookModul
    {
        public long? UserID { get; set; }
        public List<StandBook> StandBookList { get; set; }
    }
}
