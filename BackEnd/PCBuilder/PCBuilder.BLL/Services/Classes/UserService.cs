using Mapster;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
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
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IFileService _fileService;

        public UserService(IUserRepository userRepository, UserManager<ApplicationUser> userManager, IFileService fileService) 
        {
            _userRepository = userRepository;
            _userManager = userManager;
            _fileService = fileService;
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

        public async Task<UserProfileResponse> GetProfileAsync(string userId, HttpRequest httpRequest)
        {
            var user = await _userRepository.GetUserByIdAsync(userId)
        ?? throw new Exception("User not found");

            var roles = await _userManager.GetRolesAsync(user);

            string? imageUrl = null;
            if (!string.IsNullOrEmpty(user.ProfileImageUrl))
            {
                imageUrl =
                    $"{httpRequest.Scheme}://{httpRequest.Host}/images/users/{user.ProfileImageUrl}";
            }

            return new UserProfileResponse
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Phone = user.PhoneNumber,
                City = user.City,
                Street = user.Street,
                Bio = user.Bio,
                ProfileImageUrl = imageUrl,
                Role = roles.FirstOrDefault() ?? "User",
                CreatedAt = user.CreatedAt
            };
        }

        public async Task UpdateProfileAsync(string userId, UpdateProfileRequest request, HttpRequest httpRequest)
        {
            var user = await _userRepository.GetUserByIdAsync(userId)
        ?? throw new Exception("User not found");

           
            user.FullName = request.FullName;
            user.Email = request.Email;
            user.UserName = request.Email;
            user.PhoneNumber = request.Phone;
            user.City = request.City;
            user.Street = request.Street;
            user.Bio = request.Bio;

           
            if (request.ProfileImage != null && request.ProfileImage.Length > 0)
            {
                string folder = "users";
                if (!string.IsNullOrEmpty(user.ProfileImageUrl))
                {
                    var oldImagePath = Path.Combine(
                        Directory.GetCurrentDirectory(),
                        "wwwroot",
                        "images",
                        folder,
                        user.ProfileImageUrl
                    );

                    if (File.Exists(oldImagePath))
                    {
                        File.Delete(oldImagePath);
                    }
                }

               
                var fileName = await _fileService.UploadAsync(request.ProfileImage, folder);

              
                user.ProfileImageUrl = fileName;
            }

            await _userRepository.UpdateAsync(user);
        }

        public async Task DeleteAccountAsync(string userId)
        {
            var user = await _userRepository.GetUserByIdAsync(userId)
            ?? throw new Exception("User not found");

            await _userRepository.SoftDeleteAsync(user);
        }

        public async Task<TechSupportProfileResponse> GetTechSupportProfileAsync(string userId, HttpRequest httpRequest)
        {
            var user = await _userRepository.GetUserByIdAsync(userId)
        ?? throw new Exception("User not found");

            var roles = await _userManager.GetRolesAsync(user);

            string? imageUrl = null;
            if (!string.IsNullOrEmpty(user.ProfileImageUrl))
            {
                imageUrl =
                    $"{httpRequest.Scheme}://{httpRequest.Host}/images/users/{user.ProfileImageUrl}";
            }

            return new TechSupportProfileResponse
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Phone = user.PhoneNumber,
                City = user.City,
                Street = user.Street,
                Bio = user.Bio,
                ProfileImageUrl = imageUrl,
                Specialization = user.Specialization,
                YearsOfExperience = user.YearsOfExperience,
                Rate = user.Rate,
                NumberOfSessionsDone = user.NumberOfSessionsDone,
                Role = roles.FirstOrDefault() ?? "TechSupport",
                CreatedAt = user.CreatedAt
            };
        }

        public async Task UpdateTechSupportProfileAsync(string userId, UpdateTechSupportProfileRequest request, HttpRequest requestHttp)
        {
            var user = await _userRepository.GetUserByIdAsync(userId)
        ?? throw new Exception("User not found");

            user.FullName = request.FullName;
            user.Email = request.Email;
            user.UserName = request.Email;
            user.PhoneNumber = request.Phone;
            user.City = request.City;
            user.Street = request.Street;
            user.Bio = request.Bio;

            
            user.Specialization = request.Specialization;
            user.YearsOfExperience = request.YearsOfExperience;

           
            if (request.ProfileImage != null && request.ProfileImage.Length > 0)
            {
                string folder = "users"; 
                if (!string.IsNullOrEmpty(user.ProfileImageUrl))
                {
                    var oldImagePath = Path.Combine(
                        Directory.GetCurrentDirectory(),
                        "wwwroot",
                        "images",
                        folder,
                        user.ProfileImageUrl
                    );
                    if (File.Exists(oldImagePath)) File.Delete(oldImagePath);
                }

                var fileName = await _fileService.UploadAsync(request.ProfileImage, folder);
                user.ProfileImageUrl = fileName;
            }

            await _userRepository.UpdateAsync(user);
        }

       
    }
}
