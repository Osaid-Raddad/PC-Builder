using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.DAL.Models
{
    public enum AppointmentStatus
    {
        Pending,
        Approved,
        Rejected,
        Completed
    }

    public class Appointment
    {
        public int Id { get; set; }

        public string UserId { get; set; }
        public ApplicationUser User { get; set; }

        public string TechSupportId { get; set; }
        public ApplicationUser TechSupport { get; set; }

        public DateTime StartDateTime { get; set; }
        public DateTime EndDateTime { get; set; }

        public AppointmentStatus Status { get; set; }

        public double? Rating { get; set; }
    }
}
