using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.DAL.DTO.Responses
{
    public class CommentResponse
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public string UserId { get; set; }
        public string UserFullName { get; set; } = "";
        public int? ParentCommentId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
