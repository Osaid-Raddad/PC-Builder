using PCBuilder.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.DAL.DTO.Responses
{
    public class AppointmentResponse
    {
        public int Id { get; set; }

        public string UserId { get; set; }
        public string UserName { get; set; }

        public string TechSupportId { get; set; }
        public string TechSupportName { get; set; }

        public DateTime StartDateTime { get; set; }
        public DateTime EndDateTime { get; set; }

        public AppointmentStatus Status { get; set; }
        public double? Rating { get; set; }
    }
}
