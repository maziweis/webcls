using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kingsun.SmarterClassroom.Mod
{
    public class UserInfo
    {
        public string UserAccount { get; set; }//用户账号
        public string UserPassword { get; set; }//用户密码
        public string UserName { get; set; }//用户姓名
        public long? UserID { get; set; }//用户ID        
        public int? SubjectID { get; set; }//学科ID
        public int? Type { get; set; }//用户类型
        public UserClass[] UserClass { get; set; }
        public string IP { get; set; }
    }
    public class UserClass
    {
        public int? GradeID { get; set; }//年级ID
        public string GradeName { get; set; }//年级名称
        public int? ClassID { get; set; }//班级ID
        public string ClassName { get; set; }//班级名称
    }
}
