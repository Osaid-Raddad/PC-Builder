using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace PCBuilder.DAL.DTO.Responses
{
    public class ShopResponseDto
    {
        public Guid Id { get; set; }
        public string ShopName { get; set; }
        public string OwnerName { get; set; }
        [JsonIgnore]
        public string ShopLogo { get; set; }
        public string ShopLogoUrl { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string City { get; set; }
        public string ExactLocation { get; set; }
        public string WebURL { get; set; }
        public string Description { get; set; }
        public string Specialities { get; set; }
    }
}
