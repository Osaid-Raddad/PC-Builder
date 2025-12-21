using Azure.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
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
    public class ShopService : IShopService
    {
        private readonly IShopRepository _shopRepo;
       
        private readonly IEmailSender _emailSender;
        private readonly IFileService _fileService;

        public ShopService(
            IShopRepository shopRepo, IEmailSender emailSender, IFileService fileService)
        {
            _shopRepo = shopRepo;  
            _emailSender = emailSender;
            _fileService = fileService;
        }

        public async Task SubmitShopRequestAsync(ShopRequest request)
        {
            string folder = "shop";
            string? logoFileName = null;
            if (request.ShopLogo != null)
            {
                logoFileName = await _fileService.UploadAsync(request.ShopLogo, folder);
            }

            var shopReqEntity = new Shop
            {
                Id = Guid.NewGuid(),
                ShopName = request.ShopName,
                OwnerName = request.OwnerName,
                ShopLogo = logoFileName,
                Email = request.Email,
                Phone = request.Phone,
                City = request.City,
                ExactLocation = request.ExactLocation,
                WebURL = request.WebURL,
                Description = request.Description,
                Specialties = request.Specialties,
                Status = ShopRequestStatus.Pending,
                RequestedAt = DateTime.UtcNow
            };

            await _shopRepo.AddRequestAsync(shopReqEntity);
            await _emailSender.SendEmailAsync(request.Email,
                  "Shop Request Submited - PC Builder",
                                  $@"
                                                   <!DOCTYPE html>
                                <html lang='en'>
                                <head>
                                  <meta charset='UTF-8'>
                                  <title>Shop Request Submitted</title>
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
                                              <p style='margin:8px 0 0;color:#dbe7ff;font-size:14px;'>Shop Request Status</p>
                                            </td>
                                          </tr>

                                          <!-- Body -->
                                          <tr>
                                            <td style='padding:35px 40px;color:#333333;'>
                                              <h2 style='margin-top:0;font-size:22px;'>Your shop request has been submitted</h2>
                                              <p style='font-size:15px;line-height:1.6;'>
                                                Thank you for submitting your shop request. Our admin team will review it and respond within <strong>24 hours</strong>.
                                              </p>
                                              <p style='font-size:15px;line-height:1.6;'>
                                                You will receive an email notification once your request is approved or rejected.
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
        }

        public async Task ApproveRequestAsync(Guid requestId)
        {
            var request = await _shopRepo.GetShopByIdAsync(requestId);

            if (request == null)
                throw new KeyNotFoundException("Request not found");

            if (request.Status != ShopRequestStatus.Pending)
                throw new BadHttpRequestException(
                    $"Request cannot be approved because it is {request.Status}"
                );
            await _shopRepo.UpdateAsync(request);
            await _emailSender.SendEmailAsync(request.Email,
                 "Shop Request Submited - PC Builder",
                                 $@"
                                    <!DOCTYPE html>
                                    <html lang='en'>
                                    <head>
                                      <meta charset='UTF-8'>
                                      <title>Shop Request Approved</title>
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
                                                  <p style='margin:8px 0 0;color:#dbe7ff;font-size:14px;'>Shop Request Status</p>
                                                </td>
                                              </tr>

                                              <!-- Body -->
                                              <tr>
                                                <td style='padding:35px 40px;color:#333333;'>
                                                  <h2 style='margin-top:0;font-size:22px;'>Your shop request has been approved!</h2>
                                                  <p style='font-size:15px;line-height:1.6;'>
                                                    Congratulations! Your request to add a new shop has been <strong>approved</strong> by our admin.
                                                  </p>
                                                  <p style='font-size:15px;line-height:1.6;'>
                                                    Your shop is now visible to all users on PC Builder.
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
        }

        public async Task RejectRequestAsync(Guid requestId)
        {
            var request = await _shopRepo.GetShopByIdAsync(requestId);

            if (request == null)
                throw new KeyNotFoundException("Request not found");

            if (request.Status != ShopRequestStatus.Pending)
                throw new BadHttpRequestException(
                    $"Request cannot be rejected because it is {request.Status}"
                );
            await _shopRepo.UpdateAsync(request);
            await _emailSender.SendEmailAsync(request.Email,
                   "Shop Request Response - PC Builder",
                                   $@"
                    <!DOCTYPE html>
                    <html lang='en'>
                    <head>
                      <meta charset='UTF-8'>
                      <title>Shop Request Rejected</title>
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
                                  <p style='margin:8px 0 0;color:#dbe7ff;font-size:14px;'>Shop Request Status</p>
                                </td>
                              </tr>

                              <!-- Body -->
                              <tr>
                                <td style='padding:35px 40px;color:#333333;'>
                                  <h2 style='margin-top:0;font-size:22px;'>Your shop request has been rejected</h2>

                                  <p style='font-size:15px;line-height:1.6;'>
                                    Unfortunately, your request to add a new shop has been <strong>rejected</strong> by our admin.
                                  </p>

                                  <p style='font-size:15px;line-height:1.6;'>
                                    If you believe this was a mistake, you can contact support for more information.
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
        }

        public async Task<ShopResponse> DeleteShopAsync(Guid shopId)
        {
            var shop = await _shopRepo.GetShopByIdAsync(shopId);

            if (shop == null)
                throw new BadHttpRequestException("Shop not found");

            if (!string.IsNullOrEmpty(shop.ShopLogo))
            {
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "shop", shop.ShopLogo);
                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                }
            }
            await _shopRepo.DeleteShopAsync(shopId);
            return new ShopResponse { Success = true, Message = "Shop deleted successfully" };
        }

        public async Task<List<ShopResponseDto>> GetAllShopsAsync(HttpRequest httpRequest)
        {
            var shops = await _shopRepo.GetAllShopsAsync();

            return shops.Select(s => new ShopResponseDto
            {
                Id = s.Id,
                ShopName = s.ShopName,
                OwnerName = s.OwnerName,

                ShopLogo = s.ShopLogo,
                ShopLogoUrl = string.IsNullOrEmpty(s.ShopLogo)
                    ? null
                    : $"{httpRequest.Scheme}://{httpRequest.Host}/images/shop/{s.ShopLogo}",

                Email = s.Email,
                Phone = s.Phone,
                City = s.City,
                ExactLocation = s.ExactLocation,
                WebURL = s.WebURL,
                Description = s.Description,
                Specialities = s.Specialties,
                Status = s.Status
            }).ToList();
        }

        public async Task<ShopResponseDto> GetShopByIdAsync(Guid shopId, HttpRequest httpRequest)
        {
            var shop = await _shopRepo.GetShopByIdAsync(shopId);

            if (shop == null)
                throw new Exception("Shop not found");

            return new ShopResponseDto
            {
                Id = shop.Id,
                ShopName = shop.ShopName,
                OwnerName = shop.OwnerName,

                ShopLogo = shop.ShopLogo,
                ShopLogoUrl = string.IsNullOrEmpty(shop.ShopLogo)
                    ? null
                    : $"{httpRequest.Scheme}://{httpRequest.Host}/images/shop/{shop.ShopLogo}",

                Email = shop.Email,
                Phone = shop.Phone,
                City = shop.City,
                ExactLocation = shop.ExactLocation,
                WebURL = shop.WebURL,
                Description = shop.Description,
                Specialities = shop.Specialties
            };
        }

        public async Task<List<Shop>> GetPendingShopRequestsAsync()
        {
            return await _shopRepo.GetPendingRequestsAsync();
        }

       
    }
}
