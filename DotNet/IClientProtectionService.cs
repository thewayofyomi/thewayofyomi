using Sabio.Models.Domain;
using Sabio.Models.Requests;

namespace Sabio.Services.Interfaces
{
    public interface IClientProtectionService
    {
        ClientProtection Get(int id);
        int Add(ClientProtectionAddRequest model, int userId);
        void Update(ClientProtectionUpdateRequest model, int userId);
        void Delete(int id);
    }
}