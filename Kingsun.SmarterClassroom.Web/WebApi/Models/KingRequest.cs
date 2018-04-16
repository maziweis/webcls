using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.Models
{
    public class KingRequest
    {
        private const string _EncryptKey = "kingsun.campus";
        /// <summary>
        /// 请求ID
        /// </summary>
        public string ID
        {
            get;
            set;
        }
        /// <summary>
        /// 请求方法
        /// </summary>
        public string Function
        {
            get;
            set;
        }
        /// <summary>
        /// 业务数据
        /// </summary>
        public string Data
        {
            get;
            set;
        }
    }
}