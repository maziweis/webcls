using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Kingsun.SmarterClassroom.BLL
{
    public abstract class BaseImplement
    {
        public abstract Kingsun.SmarterClassroom.Mod.SyncResponse ProcessRequest(Kingsun.SmarterClassroom.Mod.SyncRequest request);
    }
}
