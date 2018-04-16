using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kingsun.SmarterClassroom.Mod
{
    public class Catalog
    {
        public int id { get; set; }
        public string title { get; set; }

        public List<Catalog> children = new List<Catalog>();
    }
}
