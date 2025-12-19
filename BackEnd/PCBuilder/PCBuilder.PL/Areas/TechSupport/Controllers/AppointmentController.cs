using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PCBuilder.BLL.Services.Interfaces;
using PCBuilder.DAL.DTO.Requests;
using System.Security.Claims;

namespace PCBuilder.PL.Areas.TechSupport.Controllers
{
    [Route("api/[area]/[controller]")]
    [ApiController]
    [Authorize(Roles = "TechSupport,User")]
    [Area("TechSupport")]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;

        public AppointmentController(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
        }

        [Authorize(Roles = "User,Admin,SuperAdmin")]
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateAppointmentRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            await _appointmentService.CreateAsync(userId, request);
            return Ok(new { message = "Appointment created successfully" });
        }

       [Authorize(Roles = "TechSupport")]
       [HttpPost("approve/{id}")]
        public async Task<IActionResult> Approve([FromRoute] int id)
        {
            var techId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            await _appointmentService.ApproveAsync(id, techId);
            return Ok(new { message = "Appointment approved successfully" });
        }

        [Authorize(Roles = "TechSupport")]
        [HttpPost("reject/{id}")]
        public async Task<IActionResult> Reject([FromRoute] int id)
        {
            var techId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            await _appointmentService.RejectAsync(id, techId);
            return Ok(new { message = "Appointment rejected successfully" });
        }

        [Authorize(Roles = "TechSupport")]
        [HttpPost("complete/{id}")]
        public async Task<IActionResult> Complete([FromRoute] int id)
        {
            var techId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            await _appointmentService.CompleteAsync(id, techId);
            return Ok(new { message = "Appointment completed successfully" });
        }

        [Authorize(Roles = "TechSupport,User")]
        [HttpPost("rate/{id}")]
        public async Task<IActionResult> Rate([FromRoute] int id, [FromBody] RateAppointmentRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            await _appointmentService.RateAsync(id, userId, request.Rating);
            return Ok(new { message = "Appointment rated successfully" });
        }

        [Authorize(Roles = "TechSupport,User")]
        [HttpGet("myAppointment")]
        public async Task<IActionResult> GetUserAppointments()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var appointments = await _appointmentService.GetUserAppointmentsAsync(userId);
            return Ok(appointments);
        }
        [Authorize(Roles = "TechSupport")]
        [HttpGet("tech/schedule")]
        public async Task<IActionResult> GetTechAppointments()
        {
            var techId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var appointments = await _appointmentService.GetTechAppointmentsAsync(techId);
            return Ok(appointments);
        }
    }
}
