using Kingsun.DB;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kingsun.SmarterClassroom.Mod
{
    [TableAttribute("clr_resource")]
    public class Resource: Kingsun.DB.Action
    {
        /// <summary>
        /// 资源ID
        /// </summary>
        [FieldAttribute("ResourceID", null, EnumFieldUsage.PrimaryKey, DbType.String)]
        public string ResourceID { get; set; }

        /// <summary>
        /// 资源名称
        /// </summary>
        [FieldAttribute("ResourceName", null, EnumFieldUsage.CommonField, DbType.String)]
        public string ResourceName { get; set; }
        /// <summary>
        /// 资源说明
        /// </summary>
        [FieldAttribute("Description", null, EnumFieldUsage.CommonField, DbType.String)]
        public string Description { get; set; }

        /// <summary>
        /// 资源类型
        /// </summary>
        [FieldAttribute("ResourceType", null, EnumFieldUsage.CommonField, DbType.Int32)]
        public int ResourceType { get; set; }
        /// <summary>
        /// 资源类型
        /// </summary>
        [FieldAttribute("ResourceStyle", null, EnumFieldUsage.CommonField, DbType.Int32)]
        public int ResourceStyle { get; set; }
        /// <summary>
        /// 资源地址
        /// </summary>
        [FieldAttribute("ResourceUrl", null, EnumFieldUsage.CommonField, DbType.String)]
        public string ResourceUrl { get; set; }
        /// <summary>
        /// 资源大小
        /// </summary>
        [FieldAttribute("ResourceSize", null, EnumFieldUsage.CommonField, DbType.Int32)]
        public int ResourceSize { get; set; }
        /// <summary>
        /// 用户ID
        /// </summary>
        [FieldAttribute("UserID", null, EnumFieldUsage.CommonField, DbType.String)]
        public String UserID { get; set; }
        /// <summary>
        /// 创建时间
        /// </summary>
        [FieldAttribute("CreateDate", null, EnumFieldUsage.CommonField, DbType.DateTime)]
        public DateTime? CreateDate { get; set; }
        /// <summary>
        /// 科目ID
        /// </summary>
        [FieldAttribute("SubjectID", null, EnumFieldUsage.CommonField, DbType.Int32)]
        public int SubjectID { get; set; }
        /// <summary>
        /// 版本ID
        /// </summary>
        [FieldAttribute("EditionID", null, EnumFieldUsage.CommonField, DbType.Int32)]
        public int EditionID { get; set; }
        /// <summary>
        /// 年级ID
        /// </summary>
        [FieldAttribute("GradeID", null, EnumFieldUsage.CommonField, DbType.Int32)]
        public int GradeID { get; set; }
        /// <summary>
        /// 目录ID
        /// </summary>
        [FieldAttribute("UnitID", null, EnumFieldUsage.CommonField, DbType.Int32)]
        public int UnitID { get; set; }
        /// <summary>
        /// 文件类型
        /// </summary>
        [FieldAttribute("FileType", null, EnumFieldUsage.CommonField, DbType.String)]
        public String FileType { get; set; }
    }

    public class ShareResource
    {
        public string ResourceIDs { get; set; }
        public string UserID { get; set; }
    }
    public class UserResource
    {
        public string ResourceID { get; set; }
        public string ResourceName { get; set; }
        public string FileID { get; set; }
        public string UserID { get; set; }
        public string Description { get; set; }
        public string SubjectID { get; set; }
        public string EditionID { get; set; }
        public string GradeID { get; set; }
        public string BookReelID { get; set; }
        public string SchoolStage { get; set; }
        public string Catalog { get; set; }
        public string Catalogs { get; set; }
        public string FileType { get; set; }
        public string BreviaryImgUrl { get; set; }
        public string KeyWords { get; set; }
        public string ResourceStyle { get; set; }
        public string ResourceType { get; set; }
        public string ResourceSize { get; set; }
        public int ShareStauts { get; set; }
        public string ResourceCreaterID { get; set; }
        public string ResourceCreaterName { get; set; }
        public string ResourceCreaterDate { get; set; }
        
    }
}
