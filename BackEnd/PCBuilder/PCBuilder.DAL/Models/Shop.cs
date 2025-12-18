using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.DAL.Models
{
    public enum ShopRequestStatus
    {
        Pending = 0,
        Approved = 1,
        Rejected = 2
    }
    public class Shop
    {
        public Guid Id { get; set; }

        public string ShopName { get; set; }
        public string OwnerName { get; set; }
        public string ShopLogo { get; set; }

        public string Email { get; set; }
        public string Phone { get; set; }

        public string City { get; set; }
        public string ExactLocation { get; set; }

        public string WebURL { get; set; }
        public string Description { get; set; }
        public string Specialties { get; set; }

        public ShopRequestStatus Status { get; set; }
        public DateTime RequestedAt { get; set; }
    }
}
