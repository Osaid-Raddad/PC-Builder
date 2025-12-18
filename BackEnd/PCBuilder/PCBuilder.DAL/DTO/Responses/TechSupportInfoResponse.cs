using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.DAL.DTO.Responses
{
    public class TechSupportInfoResponse
    {
        public string Specialization { get; set; }
        public int YearsOfExperience { get; set; }
        public double Rate { get; set; }
        public int SessionsDone { get; set; }
    }
}
