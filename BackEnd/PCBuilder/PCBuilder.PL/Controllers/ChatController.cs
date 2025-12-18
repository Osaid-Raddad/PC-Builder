using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PCBuilder.BLL.Services.Interfaces;
using System.Security.Claims;

namespace PCBuilder.PL.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;

        public ChatController(IChatService chatService)
        {
            _chatService = chatService;
        }

        [HttpGet("GetChat/{userId}")]
        public async Task<IActionResult> GetChat([FromRoute] string userId)
        {
            var currentUserId =
                User.FindFirstValue(ClaimTypes.NameIdentifier);

            return Ok(await _chatService.GetChatAsync(currentUserId, userId));
        }
    }
}
