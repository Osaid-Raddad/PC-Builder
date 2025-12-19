using Microsoft.EntityFrameworkCore;
using PCBuilder.DAL.Data;
using PCBuilder.DAL.Models;
using PCBuilder.DAL.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.DAL.Repositories.Classes
{
    public class AppointmentRepository : IAppointmentRepository
    {
        private readonly ApplicationDbContext _context;

        public AppointmentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Appointment appointment)
        {
            await _context.Appointments.AddAsync(appointment);
            await _context.SaveChangesAsync();
        }

        public async Task<Appointment?> GetAsync(int id)
        {
            return await _context.Appointments
                .Include(a => a.User)
                .Include(a => a.TechSupport)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<List<Appointment>> GetForTechAsync(string techId)
        {
            return await _context.Appointments
                    .Where(a => a.TechSupportId == techId)
                    .Include(a => a.User)        
                    .Include(a => a.TechSupport) 
                    .OrderByDescending(a => a.StartDateTime)
                    .ToListAsync();
        }

    
        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task<List<Appointment>> GetForUserAsync(string userId)
        {
            return await _context.Appointments
                    .Where(a => a.UserId == userId)
                    .Include(a => a.User)
                    .Include(a => a.TechSupport)
                    .OrderByDescending(a => a.StartDateTime)
                    .ToListAsync();
        }
    }
}
