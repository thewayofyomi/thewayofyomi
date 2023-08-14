using Sabio.Models.Domain;
using Sabio.Models.Requests;
using System.Collections.Generic;

namespace Sabio.Services.Interfaces
{
    public interface IClientInsuranceService
    {
        List<ClientInsurance> Get(int id);
        int Add(ClientInsuranceAddRequest model, int userId);
        void Batch(ClientInsurancesAddRequest model, int userId);
        void Update(ClientInsuranceUpdateRequest model, int userId);
        void Delete(int id);
    }
}