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

           
            folder = string.IsNullOrWhiteSpace(folder) ? "default" : folder;

            
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);

           
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", folder, fileName);

           
            var directory = Path.GetDirectoryName(filePath);
            if (!Directory.Exists(directory))
                Directory.CreateDirectory(directory);

            
            using (var stream = File.Create(filePath))
            {
                await file.CopyToAsync(stream);
            }

            return fileName;
        }

        public async Task<List<string>> UploadManyAsync(List<IFormFile> files)
        {
            var fileNames = new List<string>();
            foreach (var file in files)
            {
                if (file != null && file.Length > 0)
                {
                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "Posts", fileName);

                    using (var stream = File.Create(filePath))
                    {
                        await file.CopyToAsync(stream);
                    }
                    fileNames.Add(fileName);
                }
            }

            return fileNames;

        }
    }
}
