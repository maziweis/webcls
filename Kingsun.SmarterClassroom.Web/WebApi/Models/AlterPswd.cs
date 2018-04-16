using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.Models
{
    public class AlterPswd
    {
        public string ID { get; set; }
        public string NewPasswd { get; set; }
        public string OldPasswd { get; set; }
    }
}