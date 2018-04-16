var TeachLessonManage = TeachLessonManage || {};
TeachLessonManage = this;
TeachLessonManage.Template = TeachLessonManage.Template || {};
TeachLessonManage.Template.Manage = TeachLessonManage.Template.Manage || {};
TeachLessonManage.Template.Manage = function () {
    //////////////////////////////////////////////////
    ////////////////////用账号获取用户信息//////////////////
    //////////////////////////////////////////////////
    var UserAccount = sessionStorage.getItem("UserAccount");
    this.GetUserInfoList = function (UserAccount) {
        var obj = { UserAccount: UserAccount };
        return Common.Ajax("TeachImplement", "GetUserInfoList", obj).Data;
    };
    //////////////////////////////////////////////////
    ////////////////////用GUID获取用户信息//////////////////
    //////////////////////////////////////////////////
    this.GetUserInfoByGuid = function (UserAccount, IP) {
        var obj = { UserAccount: UserAccount, IP: IP };
        return Common.Ajax("TeachImplement", "GetUserInfoByGuid", obj).Data;
    };
    //////////////////////////////////////////////////
    ////////////////////获取目录列表//////////////////
    //////////////////////////////////////////////////
    this.GetCatalogList = function (BookID) {
        var obj = { BookID: BookID };
        return Common.Ajax("TeachImplement", "GetCatalogList", obj).Data;
    };
    //////////////////////////////////////////////////
    /////////////保存SelectBook页面初始化数据/////////
    //////////////////////////////////////////////////
    this.SaveInitData = function (PageInitID, UserID, EditionID, SubjectID, GradeID, BookType, Stage, ClassID, BookID, AspxName, CreateTime) {
        var obj = { PageInitID: PageInitID, UserID: UserID, EditionID: EditionID, SubjectID: SubjectID, GradeID: GradeID, BookType: BookType, Stage: Stage, ClassID: ClassID, BookID: BookID, AspxName: AspxName, CreateTime: CreateTime };
        return Common.Ajax("TeachImplement", "SaveInitData", obj).Data;
    };
    //////////////////////////////////////////////////
    /////////////查询SelectBook页面初始化数据/////////
    //////////////////////////////////////////////////
    this.SelectInitData = function (UserID, AspxName) {
        var obj = { UserID: UserID, AspxName: AspxName };
        return Common.Ajax("TeachImplement", "SelectInitData", obj).Data;
    }
    //////////////////////////////////////////////////
    /////////////更新SelectBook页面初始化数据/////////
    //////////////////////////////////////////////////
    this.UpdateInitData = function (UserID, EditionID, SubjectID, GradeID, BookType, Stage, ClassID, BookID, AspxName, CreateTime) {
        var obj = { UserID: UserID, EditionID: EditionID, SubjectID: SubjectID, GradeID: GradeID, BookType: BookType, Stage: Stage, ClassID: ClassID, BookID: BookID, AspxName: AspxName, CreateTime: CreateTime };
        return Common.Ajax("TeachImplement", "UpdateInitData", obj).Data;
    };
    //////////////////////////////////////////////////
    /////////////查询Teaching页面初始化数据/////////
    //////////////////////////////////////////////////
    this.SelectTeachingData = function (UserID, BookID,ClassID, AspxName) {
        var obj = { UserID: UserID, BookID: BookID,ClassID:ClassID, AspxName: AspxName };
        return Common.Ajax("TeachImplement", "SelectTeachingData", obj).Data;
    };
    //////////////////////////////////////////////////
    /////////////保存Teaching页面初始化数据/////////
    //////////////////////////////////////////////////
    this.SaveTeachingData = function (PageInitID, UserID, EditionID, SubjectID, GradeID, ClassID, BookID, UnitID, PageNum, AspxName, CreateTime, UnitName) {
        var obj = { PageInitID: PageInitID, UserID: UserID, EditionID: EditionID, SubjectID: SubjectID, GradeID: GradeID, ClassID: ClassID, BookID: BookID, UnitID: UnitID, PageNum: PageNum, AspxName: AspxName, CreateTime: CreateTime, UnitName: UnitName };
        return Common.Ajax("TeachImplement", "SaveTeachingData", obj).Data;
    };
    //////////////////////////////////////////////////
    /////////////更新Teaching页面初始化数据/////////
    //////////////////////////////////////////////////
    this.UpdateTeachingData = function (UserID, EditionID, SubjectID, GradeID, ClassID, BookID, UnitID, PageNum, AspxName, CreateTime, UnitName) {
        var obj = { UserID: UserID, EditionID: EditionID, SubjectID: SubjectID, GradeID: GradeID, ClassID: ClassID, BookID: BookID, UnitID: UnitID, PageNum: PageNum, AspxName: AspxName, CreateTime: CreateTime, UnitName: UnitName };
        return Common.Ajax("TeachImplement", "UpdateTeachingData", obj).Data;
    };
    //////////////////////////////////////////////////
    /////////////查询页面备课数据从智慧教室后台/////////
    //////////////////////////////////////////////////
    this.SelBookPageData = function (UserID, BookID, Pages) {
        var obj = { UserID: UserID, BookID: BookID, Pages: Pages };
        return Common.Ajax("TeachImplement", "SelBookPageData", obj).Data;
    };
    //////////////////////////////////////////////////
    /////////////查询电子书页信息从智慧校园接口/////////
    //////////////////////////////////////////////////
    this.SelEleBookData = function (SubjectID, GradeID, EditionID) {
        var obj = { Stage: null, SubjectID: SubjectID, GradeID: GradeID, Booklet: null, EditionID: EditionID };
        return Common.Ajax("TeachImplement", "GetBookInfoList", obj).Data;
    };

    //////////////////////////////////////////////////
    /////////////查询页面默认备课水滴数据从智慧校园接口/////////
    //////////////////////////////////////////////////
    this.GetTextBookResource = function (BookID, Pages) {
        var obj = { BookID: BookID, Pages: Pages };
        return Common.Ajax("TeachImplement", "GetTextBookResource", obj).Data;
    };
    //////////////////////////////////////////////////
    /////////////查询电子书页从智慧校园接口/////////
    //////////////////////////////////////////////////
    this.GetTextbookById = function (BookID) {
        var obj = { BookID: BookID };
        return Common.Ajax("TeachImplement", "GetTextbookById", obj).Data;
    };
    //////////////////////////////////////////////////
    /////////////保存用户操作记录/////////////////////
    //////////////////////////////////////////////////
    this.SaveOperData = function (UserID, UserType, OperID, Content) {
        var obj = { UserID: UserID, UserType: UserType, OperID: OperID, Content: Content };
        return Common.Ajax("TeachImplement", "SaveOperData", obj).Data;
    };
    //////////////////////////////////////////////////
    /////////////检查用户账号密码/////////////////////
    //////////////////////////////////////////////////
    this.CheckLoad = function (UserAccount, UserPassword) {
        var obj = { UserAccount: UserAccount, UserPassword: UserPassword };
        return Common.Ajax("TeachImplement", "CheckLoad", obj).Data;
    };
    //////////////////////////////////////////////////
    /////////////检查空白页用户账号密码/////////////////////
    //////////////////////////////////////////////////
    this.CheckLoadDF = function (UserAccount, UserPassword) {
        var obj = { UserAccount: UserAccount, UserPassword: UserPassword };
        return Common.Ajax("TeachImplement", "CheckLoadDF", obj).Data;
    };
    //////////////////////////////////////////////////
    /////////////查询是否存在课堂练习/////////////////////
    //////////////////////////////////////////////////
    this.SelExercises = function (UserID) {
        var obj = { UserID: UserID };
        return Common.Ajax("TeachImplement", "SelExercises", obj).Data;
    };
    //////////////////////////////////////////////////
    /////////////插入课堂练习/////////////////////
    //////////////////////////////////////////////////
    this.InsertExercises = function (UserID, Resources) {
        var obj = { UserID: UserID, Resources: Resources };
        return Common.Ajax("TeachImplement", "InsertExercises", obj).Data;
    };
    //////////////////////////////////////////////////
    /////////////更新课堂练习/////////////////////
    //////////////////////////////////////////////////
    this.UpdateExercises = function (UserID, Resources) {
        var obj = { UserID: UserID, Resources: Resources };
        return Common.Ajax("TeachImplement", "UpdateExercises", obj).Data;
    };
    ////////////////////////////////////////////////////////
    ////////////////////获取用户的教材数据//////////////////
    ////////////////////////////////////////////////////////
    this.GetUserStandBook = function (userID) {
        var obj = { UserID: userID };
        return Common.Ajax("BasicDataImplement", "GetUserStandBook", obj).Data;
    };
    ////////////////////////////////////////////////////////
    ////////////////////获取当前单元教学地图////////////////
    ////////////////////////////////////////////////////////
    this.GetCurTeachMap = function (userID,BookID,UnitID) {
        var obj = { UserID: userID, BookID: BookID, UnitID: UnitID };
        return Common.Ajax("TeachImplement", "GetUserTeachMapJsonByWhere", obj).Data;
    };
}

var teachLessonManage = new TeachLessonManage.Template.Manage();