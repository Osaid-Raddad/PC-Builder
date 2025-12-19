using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PCBuilder.BLL.Services.Interfaces;
using PCBuilder.DAL.DTO.Requests;
using System.Security.Claims;

namespace PCBuilder.PL.Areas.TechSupport.Controllers
{
    [Route("api/[area]/[controller]")]
    [ApiController]
    [Authorize(Roles = "TechSupport")]
    [Area("TechSupport")]
    public class AvailabilityController : ControllerBase
    {
        private readonly IAvailabilityService _service;

        public AvailabilityController(IAvailabilityService service)
        {
            _service = service;
        }

        [HttpPost("Add-Availabile")]
        public async Task<IActionResult> Add([FromBody] AvailabilityRequest request)
        {
            var techId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            await _service.AddAsync(techId, request);
            return Ok(new{ message="Added Successfully"});
        }

        [HttpGet("Schedule")]
        public async Task<IActionResult> Get()
        {
            var techId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return Ok(await _service.GetMyAsync(techId));
        }

        [HttpDelete("Delete-Availabile/{id}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            var techId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            await _service.DeleteAsync(id, techId);
            return Ok(new { message ="Deleted Successfully"});
        }
    }
}
