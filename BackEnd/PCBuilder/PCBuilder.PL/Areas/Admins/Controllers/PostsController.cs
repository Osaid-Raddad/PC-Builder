using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PCBuilder.BLL.Services.Interfaces;

namespace PCBuilder.PL.Areas.Admins.Controllers
{
    [Route("api/[area]/[controller]")]
    [ApiController]
    [Area("Admins")]
    [Authorize(Roles ="Admin,SuperAdmin")]
    public class PostsController : ControllerBase
    {
        private readonly IPostService _postService;

        public PostsController(IPostService postService)
        {
            _postService = postService;
        }

        // -------------------- Get All Posts (Admin) --------------------
        [HttpGet("allPosts")]
        public async Task<IActionResult> GetAllPosts()
        {
            var posts = await _postService.GetAllApprovedPostsAsync(Request); // كل البوستات المعتمدة
            return Ok(posts);
        }

        // -------------------- Approve Post --------------------
        [HttpPut("ApprovePost/{id}")]
        public async Task<IActionResult> ApprovePost([FromRoute] int id)
        {
            await _postService.ApprovePostAsync(id);
            return Ok(new { message = "Post approved successfully." });
        }

        // -------------------- Cancel Post --------------------
        [HttpPut("RejectPost/{id}")]
        public async Task<IActionResult> CancelPost([FromRoute] int id)
        {
            await _postService.CancelPostAsync(id);
            return Ok(new { message = "Post canceled successfully." });
        }

        // -------------------- Delete Post --------------------
        [HttpDelete("DeletePost/{id}")]
        public async Task<IActionResult> DeletePost([FromRoute] int id)
        {
            await _postService.DeletePostAsync(id);
            return Ok(new { message = "Post deleted successfully." });
        }
    }
}
