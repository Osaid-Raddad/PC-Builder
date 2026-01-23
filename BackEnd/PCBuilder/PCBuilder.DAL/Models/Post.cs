using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.DAL.Models
{
    public enum PostStatus
    {
        Pending,
        Approved,
        Canceled
    }
    public class Post
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public List<PostImage> Images { get; set; } = new();
        public PostStatus Status { get; set; } = PostStatus.Pending; 
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public List<PostLike> Likes { get; set; } = new();
        public List<PostComment> Comments { get; set; } = new();
    }
}
