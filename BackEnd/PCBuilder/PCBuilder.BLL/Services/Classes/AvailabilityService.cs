using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
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

        public async Task<List<TechSupportWithAvailabilityResponse>> GetAllAsync()
        {
            var availabilities = await _repo.GetAllWithTechAsync();

         
            if (availabilities == null || !availabilities.Any())
                throw new KeyNotFoundException("No tech support availability found");

            
            if (availabilities.Any(a => a.TechSupport == null))
                throw new InvalidOperationException("Some availability records are missing tech support data");

            var result = availabilities
                .GroupBy(a => a.TechSupportId)
                .Select(group =>
                {
                    var tech = group.First().TechSupport;

                
                    if (string.IsNullOrWhiteSpace(tech.Id))
                        throw new InvalidOperationException("Invalid tech support ID");

                    if (string.IsNullOrWhiteSpace(tech.FullName))
                        throw new InvalidOperationException($"Tech support ({tech.Id}) has no full name");

                   
                    var validAvailabilities = group
                        .Where(a =>
                            a.StartTime < a.EndTime &&                 
                            Enum.IsDefined(typeof(DayOfWeek), a.Day)   
                        )
                        .Select(a => new AvailabilityResponse
                        {
                            Id = a.Id,
                            Day = a.Day,
                            StartTime = a.StartTime,
                            EndTime = a.EndTime
                        })
                        .ToList();

                  
                    if (!validAvailabilities.Any())
                        throw new InvalidOperationException(
                            $"Tech support ({tech.FullName}) has no valid availability schedule");

                    return new TechSupportWithAvailabilityResponse
                    {
                        TechSupportId = tech.Id,
                        FullName = tech.FullName,
                        Email = tech.Email,
                        Availabilities = validAvailabilities
                    };
                })
                .ToList();

            return result;
        }

    }
}
