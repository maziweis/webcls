using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApi.BasicService;
using WebApi.Models;

namespace WebApi.Controllers
{
    public class StudentsController : ApiController
    {
        public IEnumerable<Student> Get(int id)
        {
            BasicServiceClient basicServiceClient = new BasicServiceClient();
            Dictionary<string, string> student = basicServiceClient.GetStudentByClassId(id);
            return student.Select(s=>new Student { Account=s.Key, Name=s.Value }).ToList();
        }
    }
}
