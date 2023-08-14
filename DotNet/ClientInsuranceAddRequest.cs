using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests
{
    public class ClientInsuranceAddRequest
    {
   
        [StringLength(100, MinimumLength = 2)]
        public string Name { get; set; }

        [Range(1, Int32.MaxValue)]
        public int InsuranceTypeId { get; set; }
        [Range(1, Int32.MaxValue)]
        public int? InsurancePolicyTypeId { get; set; }

        public decimal? MonthlyPayment { get; set; }
        [Required]
        public decimal Deductible { get; set; }
        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string InstitutionName { get; set; }
        [Range(1, Int32.MaxValue)]
        public decimal? MonthlyBenefit { get; set; }
        [Range(1, Int32.MaxValue)]
        public decimal? DeathBenefit { get; set; }
        [Required]
        public bool IsPayWork { get; set; }
    
        public DateTime?  PurchaseDate { get; set; }
  
        public DateTime? LastReviewDate { get; set; }
    }
}
