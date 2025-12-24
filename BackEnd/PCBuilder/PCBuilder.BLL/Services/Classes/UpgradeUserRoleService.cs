using Microsoft.AspNetCore.Http;
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
    public class UpgradeUserRoleService : IUpgradeUserRoleService
    {
        private readonly IUpgradeUserRoleRepository _upgradeRepo;
        private readonly IUserService _userService;

        public UpgradeUserRoleService(
            IUpgradeUserRoleRepository upgradeRepo,
            IUserService userService)
        {
            _upgradeRepo = upgradeRepo;
            _userService = userService;
        }

        public async Task CreateRequestAsync(string userId, UpgradeUserRoleRequest request)
        {
            
            var existingRequest = await _upgradeRepo.GetPendingByUserIdAsync(userId);

            if (existingRequest != null)
                throw new BadHttpRequestException("You already have a pending request");

            var entity = new UpgradeUserRole
            {
                UserId = userId,
                Reason = request.Reason,
                CreatedAt = DateTime.UtcNow,
                IsApproved = null
            };

            await _upgradeRepo.AddAsync(entity);
            await _upgradeRepo.SaveChangesAsync();
        }

        public async Task DecideAsync(int requestId, UpgradeUserRoleResponse response)
        {
            var request = await _upgradeRepo.GetByIdAsync(requestId)
                ?? throw new KeyNotFoundException("Request not found");

            if (request.IsApproved != null)
                throw new BadHttpRequestException("Request already reviewed");

            request.IsApproved = response.Approve;

            if (response.Approve)
            {
                await _userService.ChangeUserRoleAsync(
                    request.UserId,
                    "TechSupport");
            }

            await _upgradeRepo.SaveChangesAsync();
        }
    }
}
