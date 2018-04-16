using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kingsun.SmarterClassroom.Mod
{
    public class UserOperData
    {      
        public string UserID { get; set; }//用户ID        
        public int UserType { get; set; }//用户类型
        public int OperID { get; set; }//操作类型       
        public string Content { get; set; }//操作内容

    }
}
