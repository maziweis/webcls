using Kingsun.DB;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kingsun.SmarterClassroom.Mod
{
    [TableAttribute("clr_exercises")]
    public class Exercises : Kingsun.DB.Action
    {
        [FieldAttribute("ID", null, EnumFieldUsage.PrimaryKey, DbType.String)]
        public int? ID { get; set; }
        [FieldAttribute("UserID", null, EnumFieldUsage.PrimaryKey, DbType.String)]
        public string UserID { get; set; }
        [FieldAttribute("Resources", null, EnumFieldUsage.PrimaryKey, DbType.String)]
        public string Resources { get; set; }
    }
}
