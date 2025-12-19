using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using PCBuilder.BLL.Services.Interfaces;
using PCBuilder.DAL.DTO.Requests;
using PCBuilder.DAL.DTO.Responses;
using PCBuilder.DAL.Models;
using PCBuilder.DAL.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.BLL.Services.Classes
{
    public class AvailabilityService : IAvailabilityService
    {
        private readonly IAvailabilityRepository _repo;

        public AvailabilityService(IAvailabilityRepository repo)
        {
            _repo = repo;
        }

        public async Task AddAsync(string techId, AvailabilityRequest request)
        {
            if (request.StartTime >= request.EndTime)
                throw new BadHttpRequestException(
                    "StartTime must be less than EndTime"
                );

            await _repo.AddAsync(new TechSupportAvailability
            {
                TechSupportId = techId,
                Day = request.Day,
                StartTime = request.StartTime,
                EndTime = request.EndTime
            });
        }

        public async Task<List<AvailabilityResponse>> GetMyAsync(string techId)
        {
            var list = await _repo.GetByTechAsync(techId);

            return list.Select(x => new AvailabilityResponse
            {
                Id = x.Id,
                Day = x.Day,
                StartTime = x.StartTime,
                EndTime = x.EndTime
            }).ToList();
        }
        
        public async Task DeleteAsync(int id, string techId)
        {
            var availability = await _repo.GetByIdAsync(id);

            if (availability == null)
                throw new KeyNotFoundException("Availability not found");

            if (availability.TechSupportId != techId)
                throw new UnauthorizedAccessException("You cannot delete this availability");

            await _repo.DeleteAsync(id);
        }
    }
}
