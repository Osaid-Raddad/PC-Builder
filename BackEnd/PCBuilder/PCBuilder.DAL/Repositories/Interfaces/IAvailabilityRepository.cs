using PCBuilder.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.DAL.Repositories.Interfaces
{
    public interface IAvailabilityRepository
    {
        Task AddAsync(TechSupportAvailability availability);
        Task<List<TechSupportAvailability>> GetByTechAsync(string techId);
        Task<TechSupportAvailability?> GetByIdAsync(int id);

        Task<List<TechSupportAvailability>> GetAllWithTechAsync();

        Task DeleteAsync(int id);
    }
}
