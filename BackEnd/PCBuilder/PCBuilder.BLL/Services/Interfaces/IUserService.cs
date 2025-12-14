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
    }
}
