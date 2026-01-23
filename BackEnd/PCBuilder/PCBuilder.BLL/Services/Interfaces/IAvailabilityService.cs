using PCBuilder.DAL.DTO.Requests;
using PCBuilder.DAL.DTO.Responses;
using PCBuilder.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.BLL.Services.Interfaces
{
    public interface IAvailabilityService
    {
        Task AddAsync(string techId, AvailabilityRequest request);
        Task<List<AvailabilityResponse>> GetMyAsync(string techId);
        Task<List<TechSupportWithAvailabilityResponse>> GetAllAsync();
        Task DeleteAsync(int id, string techId);
    }
}
