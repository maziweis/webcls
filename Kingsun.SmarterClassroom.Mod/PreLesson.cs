using Kingsun.DB;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kingsun.SmarterClassroom.Mod
{
    

    public class PreLesson1
    {
        /// <summary>
        /// 备课ID
        /// </summary>
        public string PreLessonID { get; set; }
        /// <summary>
        /// 备课名称
        /// </summary>
        public string PreLessonName { get; set; }
        /// <summary>
        /// 教材ID
        /// </summary>
        public int BookID { get; set; }
        /// <summary>
        /// 科目ID
        /// </summary>
        public int SubjectID { get; set; }
        /// <summary>
        /// 版本ID
        /// </summary>
        public int EditionID { get; set; }
        /// <summary>
        /// 年级ID
        /// </summary>
        public int GradeID { get; set; }
        /// <summary>
        /// 目录ID
        /// </summary>
        public int UnitID { get; set; }
        /// <summary>
        /// 页码ID
        /// </summary>
        public int Page { get; set; }
        /// <summary>
        /// 用户ID
        /// </summary>
        public String UserID { get; set; }
        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime? CreateDate { get; set; }
        /// <summary>
        /// 状态
        /// </summary>
        public int? Status { get; set; }
        /// <summary>
        /// 备课的Json数据
        /// </summary>
        public String PreLessonContent { get; set; }
    }

    public class PreLessonContent
    {
        public int pageNum { get; set; }
        public string imgSrc { get; set; }
        public List<PreLessonBtn> btns { get; set; }
    }
    public class PreLessonBtn
    {
        public string id { get; set; }
        public string icoType { get; set; }
        public bool isread { get; set; }
        public string sourceUrl { get; set; }
        public string X { get; set; }
        public string Y { get; set; }
        public string title { get; set; }

    }
}
