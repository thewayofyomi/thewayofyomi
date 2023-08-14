using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests
{
    public class ClientInsurancesAddRequest
    {
        [Required]
        public List<ClientInsuranceAddRequest> ClientInsurances { get; set; }
        [Required]
        [Range(1, int.MaxValue)]
        public int ClientId { get; set; }
    }
}
