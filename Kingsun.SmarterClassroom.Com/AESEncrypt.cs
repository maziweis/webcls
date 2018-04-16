using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Security.Cryptography;
using System.IO;

namespace Kingsun.SmarterClassroom.Com
{
    public class AESEncrypt
    {
        public string AESDecrypt(string aesStr)
        {
            byte[] bKey = Encoding.UTF8.GetBytes("1123456781234567");
            byte[] bIV = Encoding.UTF8.GetBytes("dadadadadadadada");
            byte[] byteArray = Convert.FromBase64String(aesStr);

            string decrypt = null;
            Rijndael aes = Rijndael.Create();
            using (MemoryStream mStream = new MemoryStream())
            {
                using (CryptoStream cStream = new CryptoStream(mStream, aes.CreateDecryptor(bKey, bIV), CryptoStreamMode.Write))
                {
                    cStream.Write(byteArray, 0, byteArray.Length);
                    cStream.FlushFinalBlock();
                    decrypt = Encoding.Default.GetString(mStream.ToArray());
                }
            }
            aes.Clear();
            return decrypt;
        }
    }
}
