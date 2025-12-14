using Mapster;
using Microsoft.AspNetCore.Identity;
using PCBuilder.BLL.Services.Interfaces;
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
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly UserManager<ApplicationUser> _userManager;

        public UserService(IUserRepository userRepository, UserManager<ApplicationUser> userManager) 
        {
            _userRepository = userRepository;
            _userManager = userManager;
        }

        public async Task<List<UserDTO>> GetAllUsersAsync()
        {
            var users = await _userRepository.GetAllUsersAsync();
            var userDto = new List<UserDTO>();
            foreach (var user in users)
            {
                var userRole = await _userManager.GetRolesAsync(user);
                userDto.Add(new UserDTO
                {
                    Id = user.Id,
                    FullName = user.FullName,
                    UserName = user.UserName,
                    Email = user.Email,
                    PhoneNumber = user.PhoneNumber,
                    EmailConfirmed = user.EmailConfirmed,
                    UserRole = userRole.FirstOrDefault()
                });

            }

            return userDto;
        }

        public async Task<UserDTO> GetUserByIdAsync(string id)
        {
            var user = await _userRepository.GetUserByIdAsync(id);

            if (user == null)
                return null;

            var roles = await _userManager.GetRolesAsync(user);

            return new UserDTO
            {
                Id = user.Id,
                FullName = user.FullName,
                UserName = user.UserName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                EmailConfirmed = user.EmailConfirmed,
                UserRole = roles.FirstOrDefault()
            };
        }



        public async Task<bool> BlockUserAsync(string id, int days)
        {
            return await _userRepository.BlockUserAsync(id, days);
        }
      
        public async Task<bool> IsBlockedAsync(string id)
        {
            return await _userRepository.IsBlockedAsync(id);
        }

        public async Task<bool> UnblockUserAsync(string id)
        {
            return await _userRepository.UnblockUserAsync(id);
        }

        public async Task<bool> ChangeUserRoleAsync(string userId, string newRole)
        {
            return await _userRepository.ChangeUserRoleAsync(userId, newRole);
        }

    }
}
