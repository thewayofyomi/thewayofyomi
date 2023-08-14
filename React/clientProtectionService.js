import axios from "axios";
import * as helper from "./serviceHelpers";

const clientProtectionService = {
  endpoint: `${helper.API_HOST_PREFIX}/api/clients/`
}

clientProtectionService.addProtection = (payload) => {

  const config = {
    method: "POST",
    url: clientProtectionService.endpoint + 'protection',
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };

  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

clientProtectionService.addInsurance = (payload) => {

  const config = {
    method: "POST",
    url: clientProtectionService.endpoint + "insurance",
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };

  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

clientProtectionService.insuranceGetByClientId = (id) => {

  const config = {
    method: "GET",
    url: clientProtectionService.endpoint + "insurance/" + id,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };

  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

export default clientProtectionService;