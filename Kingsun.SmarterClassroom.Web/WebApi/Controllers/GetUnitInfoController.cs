using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Kingsun.SmarterClassroom.DAL;
using WebApi.Models;

namespace WebApi.Controllers
{
    public class GetUnitInfoController : ApiController
    {        
        public IEnumerable<PageInit> GET(string UserID,string BookID) {
            BaseManagement management = new BaseManagement();
            string where = "UserID='" + UserID + "' and BookID=" + BookID + " and AspxName='Teaching'";
            IList<PageInit> page = management.Search<PageInit>(where);
            return page;        
        }
    }
}
