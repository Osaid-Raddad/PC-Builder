using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RddStore.DAL.Utilities
{
    public interface ISeedData
    {  
        Task IdentityDataSeedingAsync();
    }
}
