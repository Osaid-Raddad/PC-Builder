using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.DAL.DTO.Requests
{
    public class PostCreateRequest
    {
        public string Description { get; set; }
        public List<IFormFile> ?Images { get; set; }
    }
}
