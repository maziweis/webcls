using System;
using System.Collections.Generic;
using System.Text;
using System.IO;
using System.Web;
using System.Collections;

namespace Kingsun.SmarterClassroom.Com
{
    public class Site
    {
        /// <summary>
        /// 附件上传类型
        /// </summary>
        private string _attachextension;
        public string attachextension
        {
            get { return _attachextension; }
            set { _attachextension = value; }
        }
        /// <summary>
        /// 上传路径
        /// </summary>
        private string _savepath;
        public string savepath
        {
            get { return _savepath; }
            set { _savepath = value; }
        }
        /// <summary>
        /// 附件保存方式
        /// </summary>
        private int _attachsave;
        public int attachsave
        {
            get { return _attachsave; }
            set { _attachsave = value; }
        }
    }

    public class UpLoad
    {
        private Site siteConfig;

        public UpLoad()
        {
            siteConfig = new Site();
            siteConfig.attachextension = "gif,jpg,png,bmp,rar,zip,doc,xls,txt,pdf,bok";
            siteConfig.savepath = "../upload/";
            siteConfig.attachsave = 2;
        }
        /// <summary>
        /// 裁剪图片并保存
        /// </summary>
        public bool cropSaveAs(string fileName, string newFileName, int maxWidth, int maxHeight, int cropWidth, int cropHeight, int X, int Y)
        {
            string fileExt = Utils.GetFileExt(fileName); //文件扩展名，不含“.”
            if (!IsImage(fileExt))
            {
                return false;
            }
            string newFileDir = Utils.GetMapPath(newFileName.Substring(0, newFileName.LastIndexOf(@"/") + 1));
            //检查是否有该路径，没有则创建
            if (!Directory.Exists(newFileDir))
            {
                Directory.CreateDirectory(newFileDir);
            }
            try
            {
                string fileFullPath = Utils.GetMapPath(fileName);
                string toFileFullPath = Utils.GetMapPath(newFileName);
                return Thumbnail.MakeThumbnailImage(fileFullPath, toFileFullPath, 180, 180, cropWidth, cropHeight, X, Y);
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// 文件上传方法A
        /// </summary>
        /// <param name="postedFile">文件流</param>
        /// <param name="isThumbnail">是否生成缩略图</param>
        /// <returns>服务器文件路径</returns>
        public string fileSaveAs(HttpPostedFile postedFile, bool isThumbnail)
        {
            return fileSaveAs(postedFile, isThumbnail, false, false);
        }

        /// <summary>
        /// 文件上传方法B
        /// </summary>
        /// <param name="postedFile">文件流</param>
        /// <param name="isThumbnail">是否生成缩略图</param>
        /// <param name="isImage">是否必须上传图片</param>
        /// <returns>服务器文件路径</returns>
        public string fileSaveAs(HttpPostedFile postedFile, bool isThumbnail, bool _isImage)
        {
            return fileSaveAs(postedFile, isThumbnail, _isImage, false);
        }

        /// <summary>
        /// 文件上传方法C
        /// </summary>
        /// <param name="postedFile">文件流</param>
        /// <param name="isThumbnail">是否生成缩略图</param>
        /// <param name="isWater">是否打水印</param>
        /// <param name="isReOriginal">是否返回文件原名称</param>
        /// <returns>服务器文件路径</returns>
        public string fileSaveAs(HttpPostedFile postedFile, bool isThumbnail, bool _isImage, bool _isReOriginal)
        {
            try
            {
                string fileExt = Utils.GetFileExt(postedFile.FileName); //文件扩展名，不含“.”
                string originalFileName = postedFile.FileName.Substring(postedFile.FileName.LastIndexOf(@"\") + 1); //取得文件原名
               // string fileName = Utils.GetRamCode() + "." + fileExt; //随机文件名
                string fileName = postedFile.FileName;
                string dirPath = GetUpLoadPath(); //上传目录相对路径

                //检查文件扩展名是否合法
                if (!CheckFileExt(fileExt))
                {
                    return "{msg: 0, msgbox: \"不允许上传" + fileExt + "类型的文件！\"}";
                }
                //检查是否必须上传图片
                if (_isImage && !IsImage(fileExt))
                {
                    return "{msg: 0, msgbox: \"对不起，仅允许上传图片文件！\"}";
                }

                //获得要保存的文件路径
                string serverFileName = dirPath + fileName;
                string serverThumbnailFileName = dirPath + "small_" + fileName;
                string returnFileName = serverFileName;
                //物理完整路径                    
                string toFileFullPath = Utils.GetMapPath(dirPath);
                //检查有该路径是否就创建
                if (!Directory.Exists(toFileFullPath))
                {
                    Directory.CreateDirectory(toFileFullPath);
                }
                //保存文件
                postedFile.SaveAs(toFileFullPath + fileName);
               
                //如果需要返回原文件名
                if (_isReOriginal)
                {
                    int file_size = postedFile.ContentLength;
                    string fsize = Utils.GetFileSizeStr(file_size);

                    return "{msg: 1, msgbox: \"" + serverFileName + "\", mstitle: \"" + originalFileName + "\", msfilesize: \"" + fsize + "\"}";
                }
                return "{msg: 1, msgbox: \"" + returnFileName + "\"}";
            }
            catch
            {
                return "{msg: 0, msgbox: \"上传过程中发生意外错误！\"}";
            }
        }
        
        #region 私有方法

        /// <summary>
        /// 返回上传目录相对路径
        /// </summary>
        /// <param name="fileName">上传文件名</param>
        private string GetUpLoadPath()
        {
            string path = siteConfig.savepath; //站点目录+上传目录
            switch (siteConfig.attachsave)
            {
                case 1: //按年月日每天一个文件夹
                    path += DateTime.Now.ToString("yyyyMMdd");
                    break;
                default: //按年月/日存入不同的文件夹
                    path += DateTime.Now.ToString("yyyyMM") + "/" + DateTime.Now.ToString("dd");
                    break;
            }
            return path + "/";
        }

        
        /// <summary>
        /// 是否为图片文件
        /// </summary>
        /// <param name="_fileExt">文件扩展名，不含“.”</param>
        private bool IsImage(string _fileExt)
        {
            ArrayList al = new ArrayList();
            al.Add("bmp");
            al.Add("jpeg");
            al.Add("jpg");
            al.Add("gif");
            al.Add("png");
            if (al.Contains(_fileExt.ToLower()))
            {
                return true;
            }
            return false;
        }

        /// <summary>
        /// 检查是否为合法的上传文件
        /// </summary>
        private bool CheckFileExt(string _fileExt)
        {
            //检查危险文件
            string[] excExt = { "asp", "aspx", "php", "jsp", "htm", "html" };
            for (int i = 0; i < excExt.Length; i++)
            {
                if (excExt[i].ToLower() == _fileExt.ToLower())
                {
                    return false;
                }
            }
            //检查合法文件
            string[] allowExt = this.siteConfig.attachextension.Split(',');
            for (int i = 0; i < allowExt.Length; i++)
            {
                if (allowExt[i].ToLower() == _fileExt.ToLower())
                {
                    return true;
                }
            }
            return false;
        }

        

        #endregion
    }
}
