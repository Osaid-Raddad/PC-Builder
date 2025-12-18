using Microsoft.AspNetCore.Http;
using PCBuilder.BLL.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.BLL.Services.Classes
{
    public class FileService : IFileService
    {
        public async Task<string> UploadAsync(IFormFile file, string folder)
        {
            if (file == null || file.Length == 0)
                throw new Exception("File is empty or null");

            // تأكد من أن folder صالح
            folder = string.IsNullOrWhiteSpace(folder) ? "default" : folder;

            // اسم الملف
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);

            // المسار النهائي
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", folder, fileName);

            // تأكد أن الفولدر موجود
            var directory = Path.GetDirectoryName(filePath);
            if (!Directory.Exists(directory))
                Directory.CreateDirectory(directory);

            // رفع الملف
            using (var stream = File.Create(filePath))
            {
                await file.CopyToAsync(stream);
            }

            return fileName;
        }
    }
}
