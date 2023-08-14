using Sabio.Models.Domain.Lookups;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain
{
    public class ClientInsurance
    {
        public int Id { get; set; }
        public ClientBase Client { get; set; }
        public string Name { get; set; }
        public LookUp InsuranceType { get; set; }
        public LookUp InsurancePolicyType { get; set; }
        public decimal? MonthlyPayment { get; set; }
        public decimal Deductible { get; set; }
        public string InstitutionName { get; set; }
        public decimal? MonthlyBenefit { get; set; }
        public decimal? DeathBenefit { get; set; }
        public bool IsPayWork { get; set; }
        public DateTime? PurchaseDate { get; set; }
        public DateTime? LastReviewDate { get; set; }
        public BaseUser CreatedBy { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
    }
}
