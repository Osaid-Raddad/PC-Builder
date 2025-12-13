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
    public interface IAuthenticationService
    {
        Task<RegisterResponse> RegisterAsync(RegisterRequest registerRequest, HttpRequest httpRequest);
        Task<UserResponse> LoginAsync(LoginRequest loginRequest);
        Task<string> ConfirmEmail(string userId, string token);
        Task<bool> ForgotPassword(ForgotPasswordRequest request);
        Task<bool> ResetPassword(ResetPasswordRequest request);
    }
}
