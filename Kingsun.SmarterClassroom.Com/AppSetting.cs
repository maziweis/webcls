using System.Configuration;


public class AppSetting
{
    private static string _connectionString = string.Empty;
    /// <summary>
    /// 获取连接字符串
    /// </summary>
    public static string ConnectionString
    {
        get
        {
            if (string.IsNullOrEmpty(_connectionString))
            {
                _connectionString = System.Configuration.ConfigurationManager.ConnectionStrings["KingsunConnectionStr"].ConnectionString;
            }
            return _connectionString;
        }
    }

    public static string GetValue(string key)
    {
        string result = "";
        if (string.IsNullOrEmpty(key))
        {
            return result;
        }
        result = ConfigurationManager.AppSettings[key];
        return result;
    }


    private static string _appID;

    public static string AppID
    {
        get
        {
            if (string.IsNullOrEmpty(_appID))
            {
                _appID = ConfigurationManager.AppSettings["AppID"];
            }
            return _appID;
        }
    }

    private static string _uumsRootUrl;

    public static string UumsRootUrl
    {
        get
        {
            if (string.IsNullOrEmpty(_uumsRootUrl))
            {
                _uumsRootUrl = ConfigurationManager.AppSettings["uumsRoot"];
            }
            return _uumsRootUrl;
        }
    }

    private static string _cookieID;

    public static string CookieID
    {
        get
        {
            if (string.IsNullOrEmpty(_cookieID))
            {
                _cookieID = ConfigurationManager.AppSettings["cookieName"];
            }
            return _cookieID;
        }
    }

    private static string _fileServerUrl;

    public static string FileServerUrl
    {
        get
        {
            if (string.IsNullOrEmpty(_fileServerUrl))
            {
                _fileServerUrl = ConfigurationManager.AppSettings["FileServerUrl"] + "GetFiles.ashx";
            }
            return _fileServerUrl;
        }
    }

    private static string _previewUrl;

    public static string PreviewUrl
    {
        get
        {
            if (string.IsNullOrEmpty(_previewUrl))
            {
                _previewUrl = ConfigurationManager.AppSettings["FileServerUrl"] + "Preview.ashx";
            }
            return _previewUrl;
        }
    }

    private static string _root;

    public static string Root
    {
        get
        {
            if (string.IsNullOrEmpty(_root))
            {
                _root = ConfigurationManager.AppSettings["Root"];
            }
            return _root;
        }
    }

}

