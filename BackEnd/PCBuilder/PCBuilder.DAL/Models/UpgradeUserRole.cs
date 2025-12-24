using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.DAL.Models
{
    public class UpgradeUserRole
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string Reason { get; set; }
        public bool? IsApproved { get; set; } // null = Pending
        public DateTime CreatedAt { get; set; }
    }
}
