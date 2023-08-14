using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models.Domain.Lookups;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sabio.Services.ClientServices;
using Microsoft.AspNetCore.Components;

namespace Sabio.Services
{
    public class ClientInsuranceService : IClientInsuranceService
    {
        IDataProvider _data = null;
        ILookUpService _lookUpService = null;
        IClientService _mapClientBase = null;
        IMapBaseUser _mapBaseUser = null;
        

        public ClientInsuranceService(IDataProvider data, ILookUpService lookUpService, IClientService mapClientBase, IMapBaseUser mapBaseUser)
        {
            _data = data;
            _lookUpService = lookUpService;
            _mapClientBase = mapClientBase;
            _mapBaseUser = mapBaseUser;
        }

        public List<ClientInsurance> Get(int id)
        {
            List<ClientInsurance> client = null;
            string procName = "[dbo].[ClientInsurance_Select_ByClientId]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCol)
            {
                paramCol.AddWithValue("@Id", id);

            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                if(client == null)
                {
                    client = new List<ClientInsurance>();
                }
                client.Add(MapClientInsurance(reader));
            });

            return client;
        }


        public int Add(ClientInsuranceAddRequest model, int userId)
        {
            int id = 0;
            int clientId = 6;
            string procName = "[dbo].[ClientInsurance_Insert]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection paramCol)
            {
                AddCommonParams(model, userId, paramCol);
                paramCol.AddWithValue("@ClientId", clientId);

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

        public void Batch(ClientInsurancesAddRequest model, int userId)
        {
            DataTable table = null;
            string procName = "[dbo].[ClientInsurance_Batch_Insert]";

            if(model.ClientInsurances != null)
            {
                table = MapClientInsuranceTable(model.ClientInsurances);

            }

            if(table != null)
            {
                _data.ExecuteNonQuery(procName, delegate (SqlParameterCollection paramCol)
                {
                    paramCol.AddWithValue("@BatchClientInsurance", table);
                    paramCol.AddWithValue("@ClientId", model.ClientId);
                    paramCol.AddWithValue("@Id", userId);
                },
                returnParameters: null);
            }       
        }

        public void Update(ClientInsuranceUpdateRequest model, int userId)
        {
            string procName = "[dbo].[ClientInsurance_Update]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection paramCol)
            {
                AddCommonParams(model, userId, paramCol);
                paramCol.AddWithValue("@Id", model.Id);
            },
            returnParameters: null);
        }

        public void Delete(int id)
        {
            string procName = "[dbo].[ClientInsurance_Delete_ById]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection paramCol)
            {
                paramCol.AddWithValue("@Id", id);
            },
            returnParameters: null);
        }

        public ClientInsurance MapClientInsurance(IDataReader reader)
        {
            int index = 0;
            ClientInsurance clientInsurance = new ClientInsurance();

            clientInsurance.Id = reader.GetSafeInt32(index++);
            clientInsurance.Client = _mapClientBase.MapClientBase(reader, ref index);
            clientInsurance.Name = reader.GetSafeString(index++);
            clientInsurance.InsuranceType = _lookUpService.MapSingleLookUp(reader, ref index);
            clientInsurance.InsurancePolicyType = _lookUpService.MapSingleLookUp(reader, ref index);
            clientInsurance.MonthlyPayment = reader.GetSafeDecimalNullable(index++);
            clientInsurance.Deductible = reader.GetSafeDecimal(index++);
            clientInsurance.InstitutionName = reader.GetSafeString(index++);
            clientInsurance.MonthlyBenefit = reader.GetSafeDecimalNullable(index++);
            clientInsurance.DeathBenefit = reader.GetSafeDecimalNullable(index++);
            clientInsurance.IsPayWork = reader.GetSafeBool(index++);
            clientInsurance.PurchaseDate = reader.GetSafeDateTimeNullable(index++);
            clientInsurance.LastReviewDate = reader.GetSafeDateTimeNullable(index++);
            clientInsurance.CreatedBy = _mapBaseUser.MapBaseUser(reader, ref index);
            clientInsurance.ModifiedBy = reader.GetSafeInt32(index++);

            return clientInsurance;
        }

        private static void AddCommonParams(ClientInsuranceAddRequest model, int userId, SqlParameterCollection paramCol)
        {
            paramCol.AddWithValue("@Name", model.Name);
            paramCol.AddWithValue("@InsuranceTypeId", model.InsuranceTypeId);
            paramCol.AddWithValue("@InsurancePolicyTypeId", model.InsurancePolicyTypeId);
            paramCol.AddWithValue("@MonthlyPayment", model.MonthlyPayment);
            paramCol.AddWithValue("@Deductible", model.Deductible);
            paramCol.AddWithValue("@InstitutionName", model.InstitutionName);
            paramCol.AddWithValue("@MonthlyBenefit", model.MonthlyBenefit);
            paramCol.AddWithValue("@DeathBenefit", model.DeathBenefit);
            paramCol.AddWithValue("@IsPayWork", model.IsPayWork);
            paramCol.AddWithValue("@PurchaseDate", model.PurchaseDate);
            paramCol.AddWithValue("@LastReviewDate", model.LastReviewDate);
            paramCol.AddWithValue("@UserId", userId);
        }

        private DataTable MapClientInsuranceTable(List<ClientInsuranceAddRequest> model)
        {
            DataTable table = new DataTable();

            table.Columns.Add("Name", typeof(string));
            table.Columns.Add("InsuranceTypeId", typeof(int));
            table.Columns.Add("InsurancePolicyTypeId", typeof(int));
            table.Columns.Add("MonthlyPayment", typeof(decimal));
            table.Columns.Add("Deductible", typeof(decimal));
            table.Columns.Add("InstitutionName", typeof(string));
            table.Columns.Add("MonthlyBenefit", typeof(decimal));
            table.Columns.Add("DeathBenefit", typeof(decimal));
            table.Columns.Add("IsPayWork", typeof(bool));
            table.Columns.Add("PurchaseDate", typeof(DateTime));
            table.Columns.Add("LastReviewDate", typeof(DateTime));

            if(model == null || model.Count == 0)
            {
                return table;
            }
             
            foreach(ClientInsuranceAddRequest element in model)
            {
                int index = 0;
                DataRow row = table.NewRow();

                row[index++] = element.Name;
                row[index++] = element.InsuranceTypeId;
                row[index++] = element.InsurancePolicyTypeId.HasValue ? element.InsurancePolicyTypeId : DBNull.Value;
                row[index++] = element.MonthlyPayment.HasValue ? element.MonthlyPayment : DBNull.Value;
                row[index++] = element.Deductible;
                row[index++] = element.InstitutionName;
                row[index++] = element.MonthlyBenefit.HasValue ? element.MonthlyBenefit : DBNull.Value;
                row[index++] = element.DeathBenefit.HasValue ? element.DeathBenefit : DBNull.Value;
                row[index++] = element.IsPayWork;
                row[index++] = element.PurchaseDate.HasValue ? element.PurchaseDate : DBNull.Value;
                row[index++] = element.LastReviewDate.HasValue ? element.LastReviewDate: DBNull.Value;

                table.Rows.Add(row);
            }
            return table;
        }
    }
}
