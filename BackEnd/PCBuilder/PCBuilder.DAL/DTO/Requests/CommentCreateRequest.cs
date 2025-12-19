using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.DAL.DTO.Requests
{
    public class CommentCreateRequest
    {
        public string Content { get; set; } = string.Empty; 
        public int? ParentCommentId { get; set; } = null;  
    }
}
