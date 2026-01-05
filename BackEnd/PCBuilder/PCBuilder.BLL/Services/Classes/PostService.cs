using Microsoft.AspNetCore.Http;
using PCBuilder.BLL.Services.Interfaces;
using PCBuilder.DAL.DTO.Requests;
using PCBuilder.DAL.DTO.Responses;
using PCBuilder.DAL.Models;
using PCBuilder.DAL.Repositories.Classes;
using PCBuilder.DAL.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.BLL.Services.Classes
{
    public class PostService : IPostService
    {
        private readonly IPostRepository _postRepository;
        private readonly IFileService _fileService;
        private readonly IUserRepository _userRepository;

        public PostService(IPostRepository postRepository, IFileService fileService,IUserRepository userRepository)
        {
            _postRepository = postRepository;
            _fileService = fileService;
            _userRepository = userRepository;
        }

        // -------------------- Create Post --------------------
        public async Task<PostResponse> CreatePostAsync(
            PostCreateRequest dto,
            string userId,
            HttpRequest httpRequest)
        {
            if (string.IsNullOrWhiteSpace(dto.Description) &&
                (dto.Images == null || !dto.Images.Any()))
                throw new ArgumentException("Post must have a description or at least one image.");

            var user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null)
                throw new KeyNotFoundException("User not found.");

            var fileNames = dto.Images != null && dto.Images.Any()
                ? await _fileService.UploadManyAsync(dto.Images)
                : new List<string>();

            var post = new Post
            {
                Description = dto.Description,
                UserId = userId,
                Status = PostStatus.Pending,
                Images = fileNames.Select(f => new PostImage
                {
                    ImageUrl = f
                }).ToList()
            };

            await _postRepository.AddAsync(post);

            var createdPost = await _postRepository.GetByIdAsync(post.Id);

            return MapToDto(createdPost, httpRequest);
        }

        // -------------------- Get All Approved Posts --------------------
        public async Task<List<PostResponse>> GetAllApprovedPostsAsync(HttpRequest httpRequest)
        {
            var posts = await _postRepository.GetApprovedPostsAsync();
            return posts.Select(p => MapToDto(p, httpRequest)).ToList();
        }

        // -------------------- Get Pending Posts (Admin) --------------------
        public async Task<List<PostResponse>> GetPendingPostsAsync(HttpRequest httpRequest)
        {
            var posts = await _postRepository.GetPendingPostsAsync();

            if (posts == null || !posts.Any())
                return new List<PostResponse>();

            return posts.Select(p => MapToDto(p, httpRequest)).ToList();
        }

        // -------------------- Get User Posts --------------------
        public async Task<List<PostResponse>> GetUserPostsAsync(string userId, HttpRequest httpRequest)
        {
            var posts = await _postRepository.GetByUserIdAsync(userId);
            return posts.Select(p => MapToDto(p, httpRequest)).ToList();
        }

        // -------------------- Get User Post Count --------------------
        public async Task<int> GetUserPostCountAsync(string userId)
        {
            return await _postRepository.GetUserPostCountAsync(userId);
        }

        // -------------------- Get Post By Id --------------------
        public async Task<PostResponse> GetPostByIdAsync(int postId, HttpRequest httpRequest)
        {
            var post = await _postRepository.GetByIdAsync(postId);
            if (post == null)
                throw new KeyNotFoundException("Post not found.");

            return MapToDto(post, httpRequest);
        }

        // -------------------- Approve Post (Admin) --------------------
        public async Task ApprovePostAsync(int postId)
        {
            var post = await _postRepository.GetByIdAsync(postId);
            if (post == null)
                throw new KeyNotFoundException("Post not found.");

            if (post.Status != PostStatus.Pending)
                throw new InvalidOperationException("Only pending posts can be approved.");

            post.Status = PostStatus.Approved;
            await _postRepository.UpdateAsync(post);
        }

        // -------------------- Cancel Post (Admin) --------------------
        public async Task CancelPostAsync(int postId)
        {
            var post = await _postRepository.GetByIdAsync(postId);
            if (post == null)
                throw new KeyNotFoundException("Post not found.");

            if (post.Status != PostStatus.Pending)
                throw new InvalidOperationException("Only pending posts can be canceled.");

            post.Status = PostStatus.Canceled;
            await _postRepository.UpdateAsync(post);
        }

        // -------------------- Delete Post --------------------
        public async Task DeletePostAsync(int postId)
        {
            var post = await _postRepository.GetByIdAsync(postId);
            if (post == null)
                throw new KeyNotFoundException("Post not found.");

            if (post.Status != PostStatus.Approved)
                throw new InvalidOperationException("cannot deleted pending posts.");

            await _postRepository.DeleteAsync(post);
        }

        // -------------------- Like / Unlike Post --------------------
        public async Task LikePostAsync(int postId, string userId)
        {
            var post = await _postRepository.GetByIdAsync(postId);
            if (post == null)
                throw new KeyNotFoundException("Post not found.");

            if (post.Status != PostStatus.Approved)
                throw new InvalidOperationException("Cannot like a post that is not approved.");

            post.Likes ??= new List<PostLike>();

            var existingLike = post.Likes.FirstOrDefault(l => l.UserId == userId);
            if (existingLike != null)
            {
                post.Likes.Remove(existingLike);
            }
            else
            {
                post.Likes.Add(new PostLike
                {
                    PostId = post.Id,
                    UserId = userId
                });
            }

            await _postRepository.UpdateAsync(post);
        }

        // -------------------- Add Comment --------------------
        public async Task<CommentResponse> AddCommentAsync(
            int postId,
            string userId,
            string content,
            int? parentCommentId = null)
        {
            if (string.IsNullOrWhiteSpace(content))
                throw new ArgumentException("Comment cannot be empty.");

            var post = await _postRepository.GetByIdAsync(postId);
            if (post == null)
                throw new KeyNotFoundException("Post not found.");

            if (post.Status != PostStatus.Approved)
                throw new InvalidOperationException("Cannot comment on a post that is not approved.");

            var comment = new PostComment
            {
                PostId = postId,
                UserId = userId,
                Content = content,
                ParentCommentId = parentCommentId
            };

            post.Comments.Add(comment);
            await _postRepository.UpdateAsync(post);

            var user = post.User ?? await _userRepository.GetUserByIdAsync(userId);

            return new CommentResponse
            {
                Id = comment.Id,
                Content = comment.Content,
                UserId = userId,
                UserFullName = user?.FullName ?? "",
                ParentCommentId = parentCommentId
            };
        }

        // -------------------- Mapper Helper --------------------
        private PostResponse MapToDto(Post post, HttpRequest httpRequest)
        {
            var baseUrl = $"{httpRequest.Scheme}://{httpRequest.Host}";

            return new PostResponse
            {
                Id = post.Id,
                Description = post.Description,
                ImageUrls = post.Images
                    .Select(i => $"{baseUrl}/images/Posts/{i.ImageUrl}")
                    .ToList(),
                UserFullName = post.User?.FullName ?? "",
                LikesCount = post.Likes?.Count ?? 0,
                CommentsCount = post.Comments?.Count ?? 0,
                Status = post.Status,
                CreatedAt = post.CreatedAt
            };
        }
    }
}
