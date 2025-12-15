using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.DAL.DTO.Requests
{
    public class SendMessageRequest
    {
        public string ReceiverId { get; set; }
        public string Message { get; set; }
    }
}
