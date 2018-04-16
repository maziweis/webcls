using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kingsun.SmarterClassroom.Mod
{
    public class UploadFile
    {
        public String FileID { get; set; }
        public String UserID { get; set; }
        public String UserName { get; set; }
        public String FileName { get; set; }
        public String FileDescription { get; set; }
        public String FileExtension { get; set; }
        public String FileSize { get; set; }
        public String FilePath { get; set; }
        public String FileType { get; set; }

        public int SubjectID { get; set; }
        public int EditionID { get; set; }
        public int GradeID { get; set; }
        public int Catalog { get; set; }
        public int BookReelID { get; set; }
        public int ResourceStyle { get; set; }
    }
}
