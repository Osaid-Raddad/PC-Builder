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
    public class AvailabilityRepository : IAvailabilityRepository
    {

        private readonly ApplicationDbContext _context;

        public AvailabilityRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(TechSupportAvailability availability)
        {
            await _context.TechSupportAvailabilities.AddAsync(availability);
            await _context.SaveChangesAsync();
        }

        public async Task<List<TechSupportAvailability>> GetByTechAsync(string techId)
        {
            return await _context.TechSupportAvailabilities
                .Where(x => x.TechSupportId == techId)
                .ToListAsync();
        }

        public async Task<TechSupportAvailability?> GetByIdAsync(int id)
        {
            return await _context.TechSupportAvailabilities
                .FirstOrDefaultAsync(x => x.Id == id);
        }
        public async Task DeleteAsync(int id)
        {
            var item = await _context.TechSupportAvailabilities.FindAsync(id);
            _context.Remove(item);
            await _context.SaveChangesAsync();
        }
    }
}
