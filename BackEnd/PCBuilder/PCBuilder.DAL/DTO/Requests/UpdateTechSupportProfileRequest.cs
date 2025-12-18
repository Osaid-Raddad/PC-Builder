using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.DAL.DTO.Requests
{
    public class UpdateTechSupportProfileRequest
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string? Phone { get; set; }

        public string? City { get; set; }
        public string? Street { get; set; }
        public string? Bio { get; set; }

        public IFormFile? ProfileImage { get; set; }

        // TechSupport fields
        public string? Specialization { get; set; }
        public int? YearsOfExperience { get; set; }
    }
}
