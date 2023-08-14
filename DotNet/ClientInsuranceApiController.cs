using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/clients/insurance")]
    [ApiController]
    public class ClientInsuranceApiController : BaseApiController
    {
        private IClientInsuranceService _service = null;
        private IAuthenticationService<int> _authService = null;

        public ClientInsuranceApiController(IClientInsuranceService service,
                                             IAuthenticationService<int> authService,
                                             ILogger<ClientInsuranceApiController> logger) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemsResponse<ClientInsurance>> GetByClientId(int id)
        {
            BaseResponse response = null;
            int code = 200;

            try
            {
                List<ClientInsurance> client = _service.Get(id);

                if (client == null)
                {
                    code = 404;
                    response = new ErrorResponse("Resource Not Found.");
                }
                else
                {
                    response = new ItemsResponse<ClientInsurance> { Items = client };
                }
            }
            catch (Exception exception)
            {
                code = 500;
                response = new ErrorResponse(exception.Message);
                base.Logger.LogError(exception.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpPost("obselete")]
        public ActionResult<ItemResponse<int>> Add(ClientInsuranceAddRequest model)
        {
            ObjectResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _service.Add(model, userId);
                ItemResponse<int> response = new ItemResponse<int>() { Item = id };
                result = Created201(response);
            }
            catch (Exception exception)
            {
                base.Logger.LogError(exception.ToString());
                ErrorResponse response = new ErrorResponse(exception.Message);
                result = StatusCode(500, response);
            }
            return result;
        }

        [HttpPost]
        public ActionResult<SuccessResponse> Batch(ClientInsurancesAddRequest model)
        {
            BaseResponse response = null;
            int code = 201;
            
            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.Batch(model, userId);
                response = new SuccessResponse();
            }
            catch (Exception exception)
            {
                code = 500;
                base.Logger.LogError(exception.ToString());
                response = new ErrorResponse(exception.Message);
            }
            return StatusCode(code, response);
        }

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(ClientInsuranceUpdateRequest model)
        {
            BaseResponse response = null;
            int code = 200;

            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.Update(model, userId);
                response = new SuccessResponse();
            }
            catch (Exception exception)
            {
                code = 500;
                response = new ErrorResponse(exception.Message);
            }
            return StatusCode(code, response);
        }

        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> Delete(int id)
        {
            BaseResponse response = null;
            int code = 200;

            try
            {
                _service.Delete(id);
                response = new SuccessResponse();
            }
            catch(Exception exception)
            {
                code = 500;
                response = new ErrorResponse(exception.Message);
            }
            return StatusCode(code, response);
        }
    }
}
