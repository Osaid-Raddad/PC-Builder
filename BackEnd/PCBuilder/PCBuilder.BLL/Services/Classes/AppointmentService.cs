using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
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
    public class AppointmentService : IAppointmentService
    {
        private readonly IAppointmentRepository _appointmentRepo;
        private readonly IAvailabilityRepository _availabilityRepo;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IEmailSender _emailSender;

        public AppointmentService(
            IAppointmentRepository appointmentRepo,
            IAvailabilityRepository availabilityRepo,
            UserManager<ApplicationUser> userManager,IEmailSender emailSender)
        {
            _appointmentRepo = appointmentRepo;
            _availabilityRepo = availabilityRepo;
            _userManager = userManager;
            _emailSender = emailSender;
        }



        public async Task CreateAsync(string userId, CreateAppointmentRequest request)
        {

            var tech = await _userManager.FindByIdAsync(request.TechSupportId);
            if (tech == null)
                throw new KeyNotFoundException("TechSupport not found");


            var roles = await _userManager.GetRolesAsync(tech);
            if (!roles.Contains("TechSupport"))
                throw new BadHttpRequestException("Selected user is not a TechSupport");

            if (request.StartDateTime >= request.EndDateTime)
                throw new BadHttpRequestException("Invalid appointment time");


            var day = request.StartDateTime.DayOfWeek;

            var availabilities = await _availabilityRepo.GetByTechAsync(request.TechSupportId);

            bool isWithinAvailability = availabilities.Any(a =>
                a.Day == day &&
                request.StartDateTime.TimeOfDay >= a.StartTime &&
                request.EndDateTime.TimeOfDay <= a.EndTime
            );

            if (!isWithinAvailability)
                throw new BadHttpRequestException("Appointment is outside tech support availability");


            var techAppointments = await _appointmentRepo.GetForTechAsync(request.TechSupportId);

            bool overlap = techAppointments.Any(a =>
                a.Status == AppointmentStatus.Approved &&
                request.StartDateTime < a.EndDateTime &&
                request.EndDateTime > a.StartDateTime
            );

            if (overlap)
                throw new BadHttpRequestException("Time slot is already booked");


            var appointment = new Appointment
            {
                UserId = userId,
                TechSupportId = request.TechSupportId,
                StartDateTime = request.StartDateTime,
                EndDateTime = request.EndDateTime,
                Status = AppointmentStatus.Pending
            };

           
            await _appointmentRepo.AddAsync(appointment);
            var user = await _userManager.FindByIdAsync(userId);

            
            await _emailSender.SendEmailAsync(user.Email,
                "Appointment Request Sent - PC Builder",
                                    $@"
                            <!DOCTYPE html>
                            <html lang='en'>
                            <head><meta charset='UTF-8'></head>
                            <body style='margin:0;padding:0;background-color:#f2f4f7;font-family:Arial,Helvetica,sans-serif;'>
                            <table width='100%' style='padding:40px 0;background:#f2f4f7;'>
                            <tr><td align='center'>
                            <table width='600' style='background:#fff;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.08);'>
                            <tr>
                            <td style='background:#0d6efd;padding:30px;text-align:center;'>
                            <h1 style='margin:0;color:#fff;'>PC Builder</h1>
                            <p style='color:#dbe7ff;'>Appointment Request</p>
                            </td>
                            </tr>
                            <tr>
                            <td style='padding:35px 40px;'>
                            <h2>Your request has been sent</h2>
                            <p>Your appointment request was successfully sent.</p>
                            <div style='background:#f8f9fb;padding:20px;border-radius:10px;'>
                            <strong>Tech Support:</strong> {tech.FullName}<br/>
                            <strong>Date:</strong> {appointment.StartDateTime:dddd, MMM dd, yyyy}<br/>
                            <strong>Time:</strong> {appointment.StartDateTime:hh:mm tt} - {appointment.EndDateTime:hh:mm tt}
                            </div>
                            <p style='font-size:14px;color:#666;'>You will be notified once the tech support approves or rejects your request.</p>
                            </td>
                            </tr>
                            <tr>
                            <td style='background:#f8f9fb;padding:20px;text-align:center;font-size:12px;color:#888;'>
                            © {DateTime.Now.Year} PC Builder
                            </td>
                            </tr>
                            </table>
                            </td></tr>
                            </table>
                            </body>
                            </html>
                            ");

          
            await _emailSender.SendEmailAsync(tech.Email,
                "New Appointment Request - PC Builder",
                                        $@"
                                <!DOCTYPE html>
                                <html lang='en'>
                                <head><meta charset='UTF-8'></head>
                                <body style='margin:0;padding:0;background-color:#f2f4f7;font-family:Arial,Helvetica,sans-serif;'>
                                <table width='100%' style='padding:40px 0;background:#f2f4f7;'>
                                <tr><td align='center'>
                                <table width='600' style='background:#fff;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.08);'>
                                <tr>
                                <td style='background:#0d6efd;padding:30px;text-align:center;'>
                                <h1 style='margin:0;color:#fff;'>PC Builder</h1>
                                <p style='color:#dbe7ff;'>New Appointment</p>
                                </td>
                                </tr>
                                <tr>
                                <td style='padding:35px 40px;'>
                                <h2>New appointment request</h2>
                                <div style='background:#f8f9fb;padding:20px;border-radius:10px;'>
                                <strong>User:</strong> {user.FullName}<br/>
                                <strong>Email:</strong> {user.Email}<br/>
                                <strong>Date:</strong> {appointment.StartDateTime:dddd, MMM dd, yyyy}<br/>
                                <strong>Time:</strong> {appointment.StartDateTime:hh:mm tt} - {appointment.EndDateTime:hh:mm tt}
                                </div>
                                <p style='font-size:14px;color:#666;'>Please approve or reject this appointment from your dashboard.</p>
                                </td>
                                </tr>
                                <tr>
                                <td style='background:#f8f9fb;padding:20px;text-align:center;font-size:12px;color:#888;'>
                                © {DateTime.Now.Year} PC Builder
                                </td>
                                </tr>
                                </table>
                                </td></tr>
                                </table>
                                </body>
                                </html>
                                ");
        }


        public async Task ApproveAsync(int id, string techId)
        {
            var appointment = await _appointmentRepo.GetAsync(id);

            if (appointment == null)
                throw new KeyNotFoundException("Appointment not found");

            if (appointment.TechSupportId != techId)
                throw new UnauthorizedAccessException("Unauthorized");

            if (appointment.Status != AppointmentStatus.Pending)
                throw new BadHttpRequestException("Only pending appointments can be approved");

            appointment.Status = AppointmentStatus.Approved;
            await _appointmentRepo.SaveAsync();

            var user = appointment.User; 
            var tech = appointment.TechSupport; 

            if (user != null && tech != null)
            {
                var subject = "Appointment Approved - PC Builder";
                var body = $@"
                <!DOCTYPE html>
                <html lang='en'>
                <head><meta charset='UTF-8'><title>Appointment Approved</title></head>
                <body style='margin:0;padding:0;font-family:Arial,sans-serif;'>
                    <h2>Your appointment has been approved!</h2>
                    <p>Details of your appointment:</p>
                    <ul>
                        <li>Tech Support: {tech.FullName}</li>
                        <li>Date: {appointment.StartDateTime:yyyy-MM-dd}</li>
                        <li>Start Time: {appointment.StartDateTime:HH:mm}</li>
                        <li>End Time: {appointment.EndDateTime:HH:mm}</li>
                    </ul>
                    <p>Thank you for using PC Builder.</p>
                </body>
                </html>";

                await _emailSender.SendEmailAsync(user.Email, subject, body);

            }

        }
        public async Task RejectAsync(int id, string techId)
        {
            var appointment = await _appointmentRepo.GetAsync(id);

            if (appointment == null)
                throw new KeyNotFoundException("Appointment not found");

            if (appointment.TechSupportId != techId)
                throw new UnauthorizedAccessException("Unauthorized");

            if (appointment.Status != AppointmentStatus.Pending)
                throw new BadHttpRequestException("Only pending appointments can be rejected");

            appointment.Status = AppointmentStatus.Rejected;
            await _appointmentRepo.SaveAsync();
            var user = appointment.User; 
            var tech = appointment.TechSupport; 

            if (user != null && tech != null)
            {
                var subject = "Appointment Rejected - PC Builder";
                var body = $@"
                <!DOCTYPE html>
                <html lang='en'>
                <head><meta charset='UTF-8'><title>Appointment Rejected</title></head>
                <body style='margin:0;padding:0;font-family:Arial,sans-serif;'>
                    <h2>Your appointment has been rejected.</h2>
                    <p>Details of your appointment:</p>
                    <ul>
                        <li>Tech Support: {tech.FullName}</li>
                        <li>Date: {appointment.StartDateTime:yyyy-MM-dd}</li>
                        <li>Start Time: {appointment.StartDateTime:HH:mm}</li>
                        <li>End Time: {appointment.EndDateTime:HH:mm}</li>
                    </ul>
                    <p>Please try booking another slot with this tech support.</p>
                    <p>Thank you for using PC Builder.</p>
                </body>
                </html>";

                await _emailSender.SendEmailAsync(user.Email, subject, body);
            }
        }



        public async Task CompleteAsync(int id, string techId)
        {
            var appointment = await _appointmentRepo.GetAsync(id);

            if (appointment == null)
                throw new KeyNotFoundException("Appointment not found");

            if (appointment.TechSupportId != techId)
                throw new UnauthorizedAccessException("Unauthorized");

            if (appointment.Status != AppointmentStatus.Approved)
                throw new BadHttpRequestException("Only approved appointments can be completed");

            appointment.Status = AppointmentStatus.Completed;


            var tech = await _userManager.FindByIdAsync(techId);
            tech.CompletedSessionsCount++;

            await _userManager.UpdateAsync(tech);
            await _appointmentRepo.SaveAsync();

            var user = appointment.User;
            if (user != null && tech != null)
            {
                var subject = "Appointment Completed - PC Builder";
                var body = $@"
                    <!DOCTYPE html>
                    <html lang='en'>
                    <head><meta charset='UTF-8'><title>Appointment Completed</title></head>
                    <body style='margin:0;padding:0;font-family:Arial,sans-serif;'>
                        <h2>Your appointment has been completed successfully.</h2>
                        <p>Details of your appointment:</p>
                        <ul>
                            <li>Tech Support: {tech.FullName}</li>
                            <li>Date: {appointment.StartDateTime:yyyy-MM-dd}</li>
                            <li>Start Time: {appointment.StartDateTime:HH:mm}</li>
                            <li>End Time: {appointment.EndDateTime:HH:mm}</li>
                        </ul>
                        <p>Thank you for using PC Builder. You can now rate your session.</p>
                    </body>
                    </html>";

                await _emailSender.SendEmailAsync(user.Email, subject, body);
            }
        }
        public async Task RateAsync(int id, string userId, double rating)
        {
            if (rating < 1 || rating > 5)
                throw new BadHttpRequestException("Rating must be between 1 and 5");

            var appointment = await _appointmentRepo.GetAsync(id);

            if (appointment == null)
                throw new KeyNotFoundException("Appointment not found");

            if (appointment.UserId != userId)
                throw new UnauthorizedAccessException("Unauthorized");

            if (appointment.Status != AppointmentStatus.Completed)
                throw new BadHttpRequestException("Only completed appointments can be rated");

            if (appointment.Rating.HasValue)
                throw new BadHttpRequestException("Appointment already rated");

         
            appointment.Rating = rating;

            var tech = await _userManager.FindByIdAsync(appointment.TechSupportId);
            if (tech == null)
                throw new KeyNotFoundException("TechSupport not found");

            int completedSessions = tech.CompletedSessionsCount;

          
            if (completedSessions <= 1 || tech.Rate == null)
            {
                tech.Rate = rating;
            }
            else
            {
                tech.Rate =
                    ((tech.Rate.Value * (completedSessions - 1)) + rating)
                    / completedSessions;
            }

            await _userManager.UpdateAsync(tech);
            await _appointmentRepo.SaveAsync(); 
        }

        public async Task<List<AppointmentResponse>> GetUserAppointmentsAsync(string userId)
        {
            var appointments = await _appointmentRepo.GetForUserAsync(userId);

            return appointments.Select(a => new AppointmentResponse
            {
                Id = a.Id,
                UserId = a.UserId,
                UserName = a.User.FullName,
                TechSupportId = a.TechSupportId,
                TechSupportName = a.TechSupport.FullName,
                StartDateTime = a.StartDateTime,
                EndDateTime = a.EndDateTime,
                Status = a.Status,
                Rating = a.Rating
            }).ToList();
        }

        public async Task<List<AppointmentResponse>> GetTechAppointmentsAsync(string techId)
        {
            var appointments = await _appointmentRepo.GetForTechAsync(techId);

            return appointments.Select(a => new AppointmentResponse
            {
                Id = a.Id,
                UserId = a.UserId,
                UserName = a.User.FullName,
                TechSupportId = a.TechSupportId,
                TechSupportName = a.TechSupport.FullName,
                StartDateTime = a.StartDateTime,
                EndDateTime = a.EndDateTime,
                Status = a.Status,
                Rating = a.Rating
            }).ToList();
        }
    }
}
