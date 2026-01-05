using Microsoft.AspNetCore.Http;
using PCBuilder.DAL.DTO.Requests;
using PCBuilder.DAL.DTO.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.BLL.Services.Interfaces
{
    public interface IPostService
    {
        Task<PostResponse> CreatePostAsync(PostCreateRequest dto, string userId, HttpRequest httpRequest);
        Task<List<PostResponse>> GetAllApprovedPostsAsync(HttpRequest httpRequest);
        Task<List<PostResponse>> GetPendingPostsAsync(HttpRequest httpRequest);
        Task<List<PostResponse>> GetUserPostsAsync(string userId, HttpRequest httpRequest);
        Task<int> GetUserPostCountAsync(string userId);
        Task<PostResponse> GetPostByIdAsync(int postId, HttpRequest httpRequest);
        Task ApprovePostAsync(int postId);
        Task CancelPostAsync(int postId);
        Task DeletePostAsync(int postId);
        Task LikePostAsync(int postId, string userId);
        Task<CommentResponse> AddCommentAsync(int postId, string userId, string content, int? parentCommentId = null);
        Task<List<CommentWithRepliesResponse>> GetPostCommentsAsync(int postId);
    }
}
