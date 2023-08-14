using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/clients/protection")]
    [ApiController]
    public class ClientProtectionApiController : BaseApiController
    {
        private IClientProtectionService _service = null;
        private IAuthenticationService<int> _authService = null;
        public ClientProtectionApiController(IClientProtectionService service,
                                             IAuthenticationService<int> authService,
                                             ILogger<ClientProtectionApiController> logger) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<ClientProtection>> Get(int id)
        {
            int code = 200;
            BaseResponse response = null;
            
            try
            {
                ClientProtection client = _service.Get(id);

                if (client == null)
                {
                    code = 404;
                    response = new ErrorResponse("Resource Not Found.");
                }
                else
                {
                    response = new ItemResponse<ClientProtection> { Item = client };
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

        [HttpPost]
        public ActionResult<ItemResponse<int>> Add(ClientProtectionAddRequest model)
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

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(ClientProtectionUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;

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
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.Delete(id);

                response = new SuccessResponse();
            }
            catch (Exception exception)
            {
                code = 500;
                response = new ErrorResponse(exception.Message);
            }
            return StatusCode(code, response);
        }
    }
}
