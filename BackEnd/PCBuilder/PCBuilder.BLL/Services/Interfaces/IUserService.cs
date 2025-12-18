using Microsoft.AspNetCore.Http;
using PCBuilder.DAL.DTO.Requests;
using PCBuilder.DAL.DTO.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.BLL.Services.Interfaces
{
    public interface IUserService
    {
        Task<List<UserDTO>> GetAllUsersAsync();
        Task<UserDTO> GetUserByIdAsync(string id);

        Task<bool> BlockUserAsync(string id, int days);
        Task<bool> UnblockUserAsync(string id);
        Task<bool> IsBlockedAsync(string id);

        Task<bool> ChangeUserRoleAsync(string userId, string newRole);

        Task<UserProfileResponse> GetProfileAsync(string userId, HttpRequest httpRequest);
        Task UpdateProfileAsync(string userId, UpdateProfileRequest request, HttpRequest httpRequest);
        Task DeleteAccountAsync(string userId);

        Task<TechSupportProfileResponse> GetTechSupportProfileAsync(string userId, HttpRequest request);
        Task UpdateTechSupportProfileAsync(string userId, UpdateTechSupportProfileRequest request, HttpRequest requestHttp);
        
    }
}
