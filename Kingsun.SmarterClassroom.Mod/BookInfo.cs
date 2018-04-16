using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kingsun.SmarterClassroom.Mod
{
    public class BookInfo
    {
        public string ClassName { get; set; }  //班级名称
        public int BookID { get; set; }//书籍ID
        public string BookCover { get; set; }//封面地址
        public int? BookLet { get; set; }//册别
        public string BookName { get; set; } //书籍名称
        public int? GradeID { get; set; }//年级ID
       public int? SubjectID { get; set; }//学科ID
        public int? EditionID { get; set; }//版本ID
        public int[] Pages { get; set; }//页码数组  
        public int? Stage { get; set; }
        public int StartPage { get; set; }     
        public int EndPage { get; set; }
        public long? UserID { get; set; }
    }
}
