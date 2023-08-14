import React, { useEffect, useState } from "react";
import clientProtectionService from "services/clientProtectionService";
import { Table } from "react-bootstrap";
import commonFormater from "utils/commonFormater";
import { FaEdit } from "react-icons/fa";
import PropTypes from "prop-types";
import logger from "sabio-debug";
const _logger = logger.extend("CarInsuranceView");

function CarInsuranceView(props) {
  const [insuranceData, setInsuranceData] = useState([]);

  const clientId = props.clientId;

  useEffect(() => {
    clientProtectionService
      .insuranceGetByClientId(clientId)
      .then(onGetSuccess)
      .catch(onGetError);
  }, []);

  const onGetSuccess = (response) => {
    setInsuranceData(response.items);
  };
  _logger(insuranceData);
  const onGetError = (err) => {
    _logger(err.message);
  };

  const mapCarInsurance = (value, index) => {
    if (value.insuranceType.id === 5 || value.insuranceType.id === 8)
      return (
        <tr key={`ci_${index}`}>
          <td>
            {value.insuranceType.id === 5 && "Client's "}
            {value.insuranceType.name}
          </td>
          <td>
            {value.deductible
              ? commonFormater.formatUsd(value.deductible)
              : "N/A"}
          </td>
          <td>{commonFormater.formatUsd(value.monthlyPayment)}</td>
          <td>{value.institutionName}</td>
        </tr>
      );
    return;
  };

  return (
    <React.Fragment>
      <div className="container-fluid bg-white px-4 pb-3">
        <div className="row">
          <div className="col-auto">
            <h3 className="mb-1 fw-bold pt-3 pb-2">Car Insurance</h3>
          </div>
          <div className="col d-flex align-items-center">
            <FaEdit className="h2" cursor={"pointer"} />
          </div>
          {insuranceData.find((item) =>
            [5, 8].includes(item.insuranceType.id)
          ) ? (
            <Table responsive bordered hover className="text-wrap text-center">
              <thead className="table-primary">
                <tr className="align-middle">
                  <th scope="col">Insurance Type</th>
                  <th scope="col">Deductible</th>
                  <th scope="col">Monthly Payment</th>
                  <th scope="col">Institution Name</th>
                </tr>
              </thead>
              <tbody className="table-light">
                {insuranceData.map(mapCarInsurance)}
              </tbody>
            </Table>
          ) : (
            <div className="text-center py-2">
              <h4>No Car Insurance Information Available</h4>
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

CarInsuranceView.propTypes = {
  clientId: PropTypes.number,
};

export default CarInsuranceView;
