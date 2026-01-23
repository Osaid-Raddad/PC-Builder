using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PCBuilder.BLL.Services.Classes;
using PCBuilder.BLL.Services.Interfaces;
using PCBuilder.DAL.DTO.Responses;

namespace PCBuilder.PL.Areas.Admins.Controllers
{
    [Route("api/[area]/[controller]")]
    [ApiController]
    [Area("Admin")]
    [Authorize(Roles ="SuperAdmin")]
    public class TechSupportController : ControllerBase
    {
        private readonly IUpgradeUserRoleService _service;

        public TechSupportController(IUpgradeUserRoleService service)
        {
            _service = service;
        }


        [HttpPatch("upgrade-requests/{id}")]
        public async Task<IActionResult> Decide(int id, [FromBody] UpgradeUserRoleResponse response)
        {
            await _service.DecideAsync(id, response);

            return Ok(new { message = "Decision saved successfully" });
        }


        [HttpGet("pending")]
        public async Task<IActionResult> GetAllPending()
        {
            var requests = await _service.GetAllPendingRequestsAsync();
            return Ok(requests);
        }
    }
}
