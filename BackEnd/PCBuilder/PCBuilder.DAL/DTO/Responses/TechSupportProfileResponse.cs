using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.DAL.DTO.Responses
{
    public class TechSupportProfileResponse
    {
        public string Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string? Phone { get; set; }

        public string? City { get; set; }
        public string? Street { get; set; }
        public string? Bio { get; set; }
        public string? ProfileImageUrl { get; set; }

        // TechSupport fields
        public string? Specialization { get; set; }
        public int? YearsOfExperience { get; set; }
        public double? Rate { get; set; }
        
        public int CompletedSessionsCount { get; set; }

        public string Role { get; set; }
        public DateTime CreatedAt { get; set; }

       
    }
}
