using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain
{
    public class ClientProtection
    {
        public int Id { get; set; }
        public ClientBase Client { get; set; }
        public bool HasHealthInsurance { get; set; }
        public bool HasLifeInsurance { get; set; }
        public bool HasDisabilityInsurance { get; set; }
        public bool HasTrustOrWill { get; set; }
        public bool IsRevocable { get; set; }
        public bool IsIrrevocable { get; set; }
        public BaseUser CreatedBy { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
    }
}
