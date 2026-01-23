using PCBuilder.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.DAL.DTO.Responses
{
    public class PostResponse
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public List<string> ImageUrls { get; set; } = new();
        public string UserFullName { get; set; }
        public int LikesCount { get; set; }
        public int CommentsCount { get; set; }
        public PostStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
