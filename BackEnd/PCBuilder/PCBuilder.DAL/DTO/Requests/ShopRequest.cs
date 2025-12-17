using Microsoft.AspNetCore.Http;
using PCBuilder.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.DAL.DTO.Requests
{
    public class ShopRequest
    {
        public string ShopName { get; set; }
        public string OwnerName { get; set; }
        public IFormFile? ShopLogo { get; set; }

        public string Email { get; set; }
        public string Phone { get; set; }

        public string City { get; set; }
        public string ExactLocation { get; set; }

        public string WebURL { get; set; }
        public string Description { get; set; }
        public string Specialties { get; set; }
        
    }
}
