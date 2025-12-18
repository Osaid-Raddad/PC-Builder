using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.DAL.DTO.Requests
{
    public class UpdateProfileRequest
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string? Phone { get; set; }
        public IFormFile? ProfileImage { get; set; }
        public string? City { get; set; }
        public string? Street { get; set; }
        public string? Bio { get; set; }
    }
}
