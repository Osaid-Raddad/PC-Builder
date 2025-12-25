using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.DAL.DTO.Requests
{
    public class UpgradeUserRoleRequest
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }

        public string AreaOfSpecialization { get; set; }

        public int YearsOfExperience { get; set; }

        public string Reason { get; set; }

    }
}
