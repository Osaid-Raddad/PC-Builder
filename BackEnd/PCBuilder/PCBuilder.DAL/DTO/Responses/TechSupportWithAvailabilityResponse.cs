using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.DAL.DTO.Responses
{
    public class TechSupportWithAvailabilityResponse
    {
        public string TechSupportId { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }

        public List<AvailabilityResponse> Availabilities { get; set; } = new();
    }
}
