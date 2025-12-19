using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.DAL.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; }
        public string? City { get; set; }
        public string? Street { get; set; }

        public string? Bio { get; set; }
        public string? ProfileImageUrl { get; set; }

        public string? Specialization { get; set; }
        public int? YearsOfExperience { get; set; }

        
        public double? Rate { get; set; }
       

        public bool IsDeleted { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
 

        public string? CodeResetPassword { get; set; }
        public DateTime? CodeResetPasswordExpiration { get; set; }
        public int CompletedSessionsCount { get; set; }
    }
}
