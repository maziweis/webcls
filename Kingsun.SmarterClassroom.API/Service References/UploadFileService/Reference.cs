﻿//------------------------------------------------------------------------------
// <auto-generated>
//     此代码由工具生成。
//     运行时版本:4.0.30319.42000
//
//     对此文件的更改可能会导致不正确的行为，并且如果
//     重新生成代码，这些更改将会丢失。
// </auto-generated>
//------------------------------------------------------------------------------

namespace Kingsun.SmarterClassroom.API.UploadFileService {
    using System.Runtime.Serialization;
    using System;
    
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Runtime.Serialization", "4.0.0.0")]
    [System.Runtime.Serialization.DataContractAttribute(Name="R_File", Namespace="http://schemas.datacontract.org/2004/07/Fz.Core.WcfService.Contracts")]
    [System.SerializableAttribute()]
    public partial class R_File : object, System.Runtime.Serialization.IExtensibleDataObject, System.ComponentModel.INotifyPropertyChanged {
        
        [System.NonSerializedAttribute()]
        private System.Runtime.Serialization.ExtensionDataObject extensionDataField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private string FileDescriptionField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private string FileExtensionField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private string FileNameField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private string FilePathField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private int FileSizeField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private int FileTypeField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private int HeightField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private string IdField;
        
        [System.Runtime.Serialization.OptionalFieldAttribute()]
        private int WidthField;
        
        [global::System.ComponentModel.BrowsableAttribute(false)]
        public System.Runtime.Serialization.ExtensionDataObject ExtensionData {
            get {
                return this.extensionDataField;
            }
            set {
                this.extensionDataField = value;
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string FileDescription {
            get {
                return this.FileDescriptionField;
            }
            set {
                if ((object.ReferenceEquals(this.FileDescriptionField, value) != true)) {
                    this.FileDescriptionField = value;
                    this.RaisePropertyChanged("FileDescription");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string FileExtension {
            get {
                return this.FileExtensionField;
            }
            set {
                if ((object.ReferenceEquals(this.FileExtensionField, value) != true)) {
                    this.FileExtensionField = value;
                    this.RaisePropertyChanged("FileExtension");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string FileName {
            get {
                return this.FileNameField;
            }
            set {
                if ((object.ReferenceEquals(this.FileNameField, value) != true)) {
                    this.FileNameField = value;
                    this.RaisePropertyChanged("FileName");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string FilePath {
            get {
                return this.FilePathField;
            }
            set {
                if ((object.ReferenceEquals(this.FilePathField, value) != true)) {
                    this.FilePathField = value;
                    this.RaisePropertyChanged("FilePath");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public int FileSize {
            get {
                return this.FileSizeField;
            }
            set {
                if ((this.FileSizeField.Equals(value) != true)) {
                    this.FileSizeField = value;
                    this.RaisePropertyChanged("FileSize");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public int FileType {
            get {
                return this.FileTypeField;
            }
            set {
                if ((this.FileTypeField.Equals(value) != true)) {
                    this.FileTypeField = value;
                    this.RaisePropertyChanged("FileType");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public int Height {
            get {
                return this.HeightField;
            }
            set {
                if ((this.HeightField.Equals(value) != true)) {
                    this.HeightField = value;
                    this.RaisePropertyChanged("Height");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public string Id {
            get {
                return this.IdField;
            }
            set {
                if ((object.ReferenceEquals(this.IdField, value) != true)) {
                    this.IdField = value;
                    this.RaisePropertyChanged("Id");
                }
            }
        }
        
        [System.Runtime.Serialization.DataMemberAttribute()]
        public int Width {
            get {
                return this.WidthField;
            }
            set {
                if ((this.WidthField.Equals(value) != true)) {
                    this.WidthField = value;
                    this.RaisePropertyChanged("Width");
                }
            }
        }
        
        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;
        
        protected void RaisePropertyChanged(string propertyName) {
            System.ComponentModel.PropertyChangedEventHandler propertyChanged = this.PropertyChanged;
            if ((propertyChanged != null)) {
                propertyChanged(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
            }
        }
    }
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    [System.ServiceModel.ServiceContractAttribute(ConfigurationName="UploadFileService.IFileService")]
    public interface IFileService {
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IFileService/GetFileByFileID", ReplyAction="http://tempuri.org/IFileService/GetFileByFileIDResponse")]
        Kingsun.SmarterClassroom.API.UploadFileService.R_File GetFileByFileID(string FileID);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IFileService/GetFileByFileID", ReplyAction="http://tempuri.org/IFileService/GetFileByFileIDResponse")]
        System.Threading.Tasks.Task<Kingsun.SmarterClassroom.API.UploadFileService.R_File> GetFileByFileIDAsync(string FileID);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IFileService/UpdateFileWH", ReplyAction="http://tempuri.org/IFileService/UpdateFileWHResponse")]
        void UpdateFileWH(Kingsun.SmarterClassroom.API.UploadFileService.R_File file);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IFileService/UpdateFileWH", ReplyAction="http://tempuri.org/IFileService/UpdateFileWHResponse")]
        System.Threading.Tasks.Task UpdateFileWHAsync(Kingsun.SmarterClassroom.API.UploadFileService.R_File file);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IFileService/UploadFileFromClassRoom", ReplyAction="http://tempuri.org/IFileService/UploadFileFromClassRoomResponse")]
        bool UploadFileFromClassRoom(string Filedata);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IFileService/UploadFileFromClassRoom", ReplyAction="http://tempuri.org/IFileService/UploadFileFromClassRoomResponse")]
        System.Threading.Tasks.Task<bool> UploadFileFromClassRoomAsync(string Filedata);
    }
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public interface IFileServiceChannel : Kingsun.SmarterClassroom.API.UploadFileService.IFileService, System.ServiceModel.IClientChannel {
    }
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public partial class FileServiceClient : System.ServiceModel.ClientBase<Kingsun.SmarterClassroom.API.UploadFileService.IFileService>, Kingsun.SmarterClassroom.API.UploadFileService.IFileService {
        
        public FileServiceClient() {
        }
        
        public FileServiceClient(string endpointConfigurationName) : 
                base(endpointConfigurationName) {
        }
        
        public FileServiceClient(string endpointConfigurationName, string remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public FileServiceClient(string endpointConfigurationName, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public FileServiceClient(System.ServiceModel.Channels.Binding binding, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(binding, remoteAddress) {
        }
        
        public Kingsun.SmarterClassroom.API.UploadFileService.R_File GetFileByFileID(string FileID) {
            return base.Channel.GetFileByFileID(FileID);
        }
        
        public System.Threading.Tasks.Task<Kingsun.SmarterClassroom.API.UploadFileService.R_File> GetFileByFileIDAsync(string FileID) {
            return base.Channel.GetFileByFileIDAsync(FileID);
        }
        
        public void UpdateFileWH(Kingsun.SmarterClassroom.API.UploadFileService.R_File file) {
            base.Channel.UpdateFileWH(file);
        }
        
        public System.Threading.Tasks.Task UpdateFileWHAsync(Kingsun.SmarterClassroom.API.UploadFileService.R_File file) {
            return base.Channel.UpdateFileWHAsync(file);
        }
        
        public bool UploadFileFromClassRoom(string Filedata) {
            return base.Channel.UploadFileFromClassRoom(Filedata);
        }
        
        public System.Threading.Tasks.Task<bool> UploadFileFromClassRoomAsync(string Filedata) {
            return base.Channel.UploadFileFromClassRoomAsync(Filedata);
        }
    }
}
