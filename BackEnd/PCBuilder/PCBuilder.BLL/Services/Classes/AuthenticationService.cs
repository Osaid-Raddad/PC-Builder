using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using PCBuilder.BLL.Services.Interfaces;
using PCBuilder.DAL.DTO.Requests;
using PCBuilder.DAL.DTO.Responses;
using PCBuilder.DAL.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.BLL.Services.Classes
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IEmailSender _emailSender;
        private readonly IConfiguration _confige;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public AuthenticationService(UserManager<ApplicationUser> userManager, IEmailSender emailSender, IConfiguration confige, SignInManager<ApplicationUser> signInManager)
        {
            _userManager = userManager;
            _emailSender = emailSender;
            _confige = confige;
            _signInManager = signInManager;
        }

        public async Task<string> ConfirmEmail(string userId, string token)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new Exception("Invalid user ID.");
            }
            var result = await _userManager.ConfirmEmailAsync(user, token);
            if (!result.Succeeded)
            {
                throw new Exception("Email confirmation failed.");
            }
            return "Email confirmed successfully.";
        }

        public Task<bool> ForgotPassword(ForgotPasswordRequest request)
        {
            throw new NotImplementedException();
        }

        public async Task<UserResponse> LoginAsync(LoginRequest loginRequest)
        {
            var user = await _userManager.FindByEmailAsync(loginRequest.Email);
            if (user == null)
            {
                throw new Exception("Invalid email or password.");
            }
            var result = await _signInManager.CheckPasswordSignInAsync(user, loginRequest.Password, true);
            if (result.Succeeded)
            {
                return new UserResponse()
                {
                    Token = await CreateTokenAsync(user)
                };
            }
            else if (result.IsLockedOut)
            {
                throw new Exception("User account is locked out.");
            }
            else if (result.IsNotAllowed)
            {
                throw new Exception("Please Confirm Your Email");
            }
            else
            {
                throw new Exception("Invalid email or password.");
            }
        }

        public async Task<RegisterResponse> RegisterAsync(RegisterRequest registerRequest, HttpRequest httpRequest)
        {
            var newUser = new ApplicationUser()
            {
                FullName = registerRequest.FullName,
                UserName = registerRequest.UserName,
                Email = registerRequest.Email,
                PhoneNumber = registerRequest.PhoneNumber,
            };
            var result = await _userManager.CreateAsync(newUser, registerRequest.Password);
            if (result.Succeeded)
            {
                var token = await _userManager.GenerateEmailConfirmationTokenAsync(newUser);
                var escapeToken = Uri.EscapeDataString(token);
                var emailUrl = $"{httpRequest.Scheme}://{httpRequest.Host}/api/Identity/Account/ConfirmEmail?token={escapeToken}&userId={newUser.Id}";

                var roleResult = await _userManager.AddToRoleAsync(newUser, "User");

                 await _emailSender.SendEmailAsync(newUser.Email,
                            "Confirm Your Email - PC Builder",
                        $@"
                        <!DOCTYPE html>
                        <html lang='en'>
                        <head>
                          <meta charset='UTF-8'>
                          <title>Confirm Your Email</title>
                        </head>
                        <body style='margin:0;padding:0;background-color:#f2f4f7;font-family:Arial,Helvetica,sans-serif;'>

                          <table width='100%' cellpadding='0' cellspacing='0' style='background-color:#f2f4f7;padding:40px 0;'>
                            <tr>
                              <td align='center'>
                                <table width='600' cellpadding='0' cellspacing='0' style='background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08);'>
          
                                  <!-- Header -->
                                  <tr>
                                    <td style='background:#0d6efd;padding:30px;text-align:center;'>
                                      <h1 style='margin:0;color:#ffffff;font-size:28px;'>PC Builder</h1>
                                      <p style='margin:8px 0 0;color:#dbe7ff;font-size:14px;'>Build smarter. Choose better.</p>
                                    </td>
                                  </tr>

                                  <!-- Body -->
                                  <tr>
                                    <td style='padding:35px 40px;color:#333333;'>
                                      <h2 style='margin-top:0;font-size:22px;'>Confirm your email</h2>

                                      <p style='font-size:15px;line-height:1.6;'>
                                        Hi <strong>{newUser.UserName}</strong>,
                                      </p>

                                      <p style='font-size:15px;line-height:1.6;'>
                                        Thanks for joining PC Builder. Please confirm your email address to activate your account.
                                      </p>

                                      <div style='text-align:center;margin:35px 0;'>
                                        <a href='{emailUrl}'
                                           style='display:inline-block;padding:15px 40px;
                                                  background:#0d6efd;color:#ffffff;
                                                  text-decoration:none;font-size:16px;
                                                  font-weight:bold;border-radius:30px;'>
                                          Confirm Email
                                        </a>
                                      </div>

                                      <p style='font-size:14px;color:#666666;line-height:1.6;'>
                                        If you did not create an account, you can safely ignore this email.
                                      </p>
                                    </td>
                                  </tr>

                                  <!-- Footer -->
                                  <tr>
                                    <td style='background:#f8f9fb;padding:20px;text-align:center;font-size:12px;color:#888888;'>
                                      © {DateTime.Now.Year} PC Builder. All rights reserved.
                                    </td>
                                  </tr>

                                </table>
                              </td>
                            </tr>
                          </table>

                        </body>
                        </html>
                        ");


                return new RegisterResponse()
                {
                    Success = true,
                    Message = "User Registered Successfully. Please check your email to confirm your account."
                };
            }
            else
            {
                var errors = string.Join("; ", result.Errors.Select(e => e.Description));

                return new RegisterResponse()
                {
                    Success = false,
                    Message = errors
                };
            }
        }

        public Task<bool> ResetPassword(ResetPasswordRequest request)
        {
            throw new NotImplementedException();
        }

        private async Task<string> CreateTokenAsync(ApplicationUser user)
        {
            var Claims = new List<Claim>()
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Name,user.UserName),
                new Claim(ClaimTypes.Email,user.Email),
            };

            var Roles = await _userManager.GetRolesAsync(user);
            foreach (var role in Roles)
            {
                Claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_confige.GetSection("JwtOption")["SecretKey"]));
            var Credentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            var Token = new JwtSecurityToken(
                claims: Claims,
                expires: DateTime.Now.AddDays(15),
                signingCredentials: Credentials
                );
            return new JwtSecurityTokenHandler().WriteToken(Token);
        }

    }
}
