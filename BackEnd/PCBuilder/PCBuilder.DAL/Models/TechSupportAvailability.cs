using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.DAL.Models
{
    public class TechSupportAvailability
    {
        public int Id { get; set; }

        public string TechSupportId { get; set; }
        public ApplicationUser TechSupport { get; set; }

        public DayOfWeek Day { get; set; }

        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
    }
}
