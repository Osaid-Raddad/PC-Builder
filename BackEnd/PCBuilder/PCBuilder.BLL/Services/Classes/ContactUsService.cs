using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Configuration;
using PCBuilder.DAL.Data;
using PCBuilder.DAL.DTO.Requests;
using PCBuilder.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.BLL.Services.Classes
{
    public class ContactUsService : IContactUsService
    {
        private readonly IEmailSender _emailSender;
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public ContactUsService(
            IEmailSender emailSender, ApplicationDbContext context, IConfiguration configuration)
        {
            _emailSender = emailSender;
            _context = context;
            _configuration = configuration;
        }

        public async Task SendAsync(ContactUsRequest request)
        {
            
            if (string.IsNullOrWhiteSpace(request.Message))
                throw new BadHttpRequestException("Message is required");

           
            var entity = new ContactMessage
            {
                Name = request.Name,
                Email = request.Email,
                Subject = request.Subject,
                Message = request.Message,
                CreatedAt = DateTime.UtcNow
            };

            _context.ContactMessages.Add(entity);
            await _context.SaveChangesAsync();

          
            var adminEmail = _configuration["Contact:AdminEmail"];

            await _emailSender.SendEmailAsync(
                adminEmail,
                $"Contact Us - {request.Subject}",
                BuildEmailBody(request)
            );
        }

        private string BuildEmailBody(ContactUsRequest request)
        {
            return $@"
<!DOCTYPE html>
<html lang='en'>
<head>
  <meta charset='UTF-8'>
  <title>Contact Message</title>
</head>
<body style='margin:0;padding:0;background-color:#f2f4f7;font-family:Arial,Helvetica,sans-serif;'>

<table width='100%' cellpadding='0' cellspacing='0' style='padding:40px 0;'>
<tr>
<td align='center'>

<table width='600' style='background:#fff;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.08);'>

<tr>
<td style='background:#0d6efd;padding:30px;text-align:center;'>
<h1 style='color:#fff;margin:0;'>PC Builder</h1>
<p style='color:#dbe7ff;margin-top:8px;'>New Contact Message</p>
</td>
</tr>

<tr>
<td style='padding:35px;color:#333;'>

<p><strong>Name:</strong> {request.Name}</p>
<p><strong>Email:</strong> {request.Email}</p>
<p><strong>Subject:</strong> {request.Subject}</p>

<hr style='margin:20px 0;' />

<p style='font-size:15px;line-height:1.6;'>
{request.Message}
</p>

</td>
</tr>

<tr>
<td style='background:#f8f9fb;padding:20px;text-align:center;font-size:12px;color:#888;'>
© {DateTime.Now.Year} PC Builder
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>";
        }
    }
}
