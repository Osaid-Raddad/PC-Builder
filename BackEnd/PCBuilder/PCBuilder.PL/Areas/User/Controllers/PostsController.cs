using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PCBuilder.BLL.Services.Interfaces;
using PCBuilder.DAL.DTO.Requests;
using System.Security.Claims;

namespace PCBuilder.PL.Areas.User.Controllers
{
    [Route("api/[area]/[controller]")]
    [ApiController]
    [Area("User")]
    [Authorize(Roles = "User,TechSupport,Admin,SuperAdmin")]
    public class PostsController : ControllerBase
    {
        private readonly IPostService _postService;

        public PostsController(IPostService postService)
        {
            _postService = postService;
        }

        // -------------------- Create Post --------------------
        [HttpPost("createPost")]
        public async Task<IActionResult> CreatePost([FromForm] PostCreateRequest dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var post = await _postService.CreatePostAsync(dto, userId, Request);
            return Ok(post);
        }

        // -------------------- Get All Approved Posts --------------------
        [HttpGet("GetApprovedPosts")]
        public async Task<IActionResult> GetAllPosts()
        {
            var posts = await _postService.GetAllApprovedPostsAsync(Request);
            return Ok(posts);
        }

        // -------------------- Get My Posts --------------------
        [HttpGet("myPosts")]
        public async Task<IActionResult> GetMyPosts()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var posts = await _postService.GetUserPostsAsync(userId, Request);
            return Ok(posts);
        }

        // -------------------- Get My Post Count --------------------
        [HttpGet("myPost/count")]
        public async Task<IActionResult> GetMyPostCount()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var count = await _postService.GetUserPostCountAsync(userId);
            return Ok(count);
        }

        // -------------------- Get Post By Id --------------------
        [HttpGet("Post/{id}")]
        public async Task<IActionResult> GetPostById([FromRoute] int id)
        {
            var post = await _postService.GetPostByIdAsync(id, Request);
            return Ok(post);
        }

        // -------------------- Like Post --------------------
        [HttpPost("likePost/{id}")]
        public async Task<IActionResult> LikePost([FromRoute] int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            await _postService.LikePostAsync(id, userId);
            return Ok(new { message = "Action completed successfully." });
        }

        // -------------------- Add Comment --------------------
        [HttpPost("commentPost/{id}")]
        public async Task<IActionResult> AddComment([FromRoute] int id, [FromBody] CommentCreateRequest dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var comment = await _postService.AddCommentAsync(id, userId, dto.Content, dto.ParentCommentId);
            return Ok(comment);
        }
        // -------------------- Get Comment With Replies --------------------
        [HttpGet("Post/comments/{id}")]
        public async Task<IActionResult> GetPostComments([FromRoute] int id)
        {
            var comments = await _postService.GetPostCommentsAsync(id);
            return Ok(comments);
        }
    }
}
