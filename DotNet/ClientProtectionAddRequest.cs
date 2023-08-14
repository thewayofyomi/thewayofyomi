using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests
{
    public class ClientProtectionAddRequest
    {
        [Required]
        [Range(1, Int32.MaxValue)]
        public int ClientId { get; set; }
        [Required]
        public bool HasHealthInsurance { get; set; }
        [Required]
        public bool HasLifeInsurance { get; set; }
        [Required]
        public bool HasDisabilityInsurance { get; set; }
        [Required]
        public bool HasCarInsurance { get; set; }
        [Required]
        public bool HasTrustOrWill { get; set; }
        [Required]
        public bool IsRevocable { get; set; }
        [Required]
        public bool IsIrrevocable { get; set; }
    }
}
