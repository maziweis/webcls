using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.Models
{
    public class UploadFiles
    {
        public string UserID { get; set; }
        public string SubjectID { get; set; }
        public string BookID { get; set; }
        public string UnitID { get; set; }
    }
}