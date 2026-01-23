using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.DAL.DTO.Responses
{
    public class ChatMessageResponse
    {
        public string SenderId { get; set; }
        public string Message { get; set; }
        public DateTime SentAt { get; set; }
    }
}
