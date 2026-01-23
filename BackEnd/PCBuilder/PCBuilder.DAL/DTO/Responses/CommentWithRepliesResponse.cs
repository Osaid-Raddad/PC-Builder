using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.DAL.DTO.Responses
{
    public class CommentWithRepliesResponse
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public string UserFullName { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<CommentWithRepliesResponse> Replies { get; set; } = new();
        public string UserId { get; set; }
        public int? ParentCommentId { get; set; }
    }
}
