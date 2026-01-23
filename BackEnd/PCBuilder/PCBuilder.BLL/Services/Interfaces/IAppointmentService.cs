using PCBuilder.DAL.DTO.Requests;
using PCBuilder.DAL.DTO.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.BLL.Services.Interfaces
{
    public interface IAppointmentService
    {
        public  Task<List<AppointmentResponse>> GetTechAppointmentsAsync(string techId);
        public  Task<List<AppointmentResponse>> GetUserAppointmentsAsync(string userId);
        Task CreateAsync(string userId, CreateAppointmentRequest request);
        Task ApproveAsync(int id, string techId);
        Task RejectAsync(int id, string techId);
        Task CompleteAsync(int id, string techId);
        Task RateAsync(int id, string userId, double rating);
    }
}
