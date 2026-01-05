using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.DAL.Models
{
    public class PostComment
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
        public int PostId { get; set; }
        public Post Post { get; set; }

        public int? ParentCommentId { get; set; }
        public PostComment ParentComment { get; set; }
        public List<PostComment> Replies { get; set; } = new();
        public DateTime CreatedAt { get; set; }
    }
}
