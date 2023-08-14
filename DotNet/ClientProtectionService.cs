using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using Sabio.Services.ClientServices;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class ClientProtectionService : IClientProtectionService
    {
        IDataProvider _data = null;
        IClientService _mapClientBase = null;
        IMapBaseUser _mapBaseUser = null;      
     
        public ClientProtectionService(IDataProvider data, IClientService mapClientBase, IMapBaseUser mapBaseUser)
        {
            _data = data;
            _mapClientBase = mapClientBase;
            _mapBaseUser = mapBaseUser;
        }

        public ClientProtection Get(int id)
        {
            ClientProtection client = null;
            string procName = "[dbo].[ClientProtection_SelectProtection_ByClientId]";

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCol)
            {
                paramCol.AddWithValue("@Id", id);

            }, delegate (IDataReader reader, short set)
            {
                client = MapClientProtection(reader);
            });
            return client;
        }

        public int Add(ClientProtectionAddRequest model, int userId)
        {
            int id = 0;
            string procName = "[dbo].[ClientProtection_Insert]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection paramCol)
            {
                AddCommonParams(model, userId, paramCol);

                SqlParameter idOutput = new SqlParameter("@Id", SqlDbType.Int);
                idOutput.Direction = ParameterDirection.Output;
                paramCol.Add(idOutput);

            }, returnParameters: delegate (SqlParameterCollection returnCol)
            {
                object oldId = returnCol["@Id"].Value;
                int.TryParse(oldId.ToString(), out id);
            });
            return id;
        }



        public void Update(ClientProtectionUpdateRequest model, int userId)
        {
            string procName = "[dbo].[ClientProtection_Update]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection paramCol)
            {
                AddCommonParams(model, userId, paramCol);
                paramCol.AddWithValue("@Id", model.Id);
            },
            returnParameters: null);
        }

        public void Delete(int id)
        {
            string procName = "[dbo].[ClientProtection_Delete_ById]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection param)
            {
                param.AddWithValue("@Id", id);
            },
            returnParameters: null);
        }

        public ClientProtection MapClientProtection(IDataReader reader)
        {

            int index = 0;
            ClientProtection clientProtection = new ClientProtection();

            clientProtection.Id = reader.GetSafeInt32(index++);
            clientProtection.Client = _mapClientBase.MapClientBase(reader, ref index);
            clientProtection.HasHealthInsurance = reader.GetSafeBool(index++);
            clientProtection.HasLifeInsurance = reader.GetSafeBool(index++);
            clientProtection.HasDisabilityInsurance = reader.GetSafeBool(index++);
            clientProtection.HasTrustOrWill = reader.GetSafeBool(index++);
            clientProtection.IsRevocable = reader.GetSafeBool(index++);
            clientProtection.IsIrrevocable = reader.GetSafeBool(index++);
            clientProtection.CreatedBy = _mapBaseUser.MapBaseUser(reader, ref index);
            clientProtection.ModifiedBy = reader.GetSafeInt32(index++);
            clientProtection.DateCreated = reader.GetSafeDateTime(index++);
            clientProtection.DateModified = reader.GetSafeDateTime(index++);

            return clientProtection;
        }

        private static void AddCommonParams(ClientProtectionAddRequest model, int userId, SqlParameterCollection paramCol)
        {
            paramCol.AddWithValue("@ClientId", model.ClientId);
            paramCol.AddWithValue("@HasHealthInsurance", model.HasHealthInsurance);
            paramCol.AddWithValue("@HasLifeInsurance", model.HasLifeInsurance);
            paramCol.AddWithValue("@HasDisabilityInsurance", model.HasDisabilityInsurance);
            paramCol.AddWithValue("@HasCarInsurance", model.HasCarInsurance);
            paramCol.AddWithValue("@HasTrustOrWill", model.HasTrustOrWill);
            paramCol.AddWithValue("@IsRevocable", model.IsRevocable);
            paramCol.AddWithValue("@IsIrrevocable", model.IsIrrevocable);
            paramCol.AddWithValue("@UserId", userId);
        }
    }
}
