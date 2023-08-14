import React, { useState, useEffect } from "react";
import debug from "sabio-debug";
import PropTypes from "prop-types";
import { Table } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import commonFormater from "utils/commonFormater";
import { formatDateShort } from "utils/dateFormater";
import clientProtectionService from "services/clientProtectionService";

const _logger = debug.extend("ClientProtectionSummary");

function ClientProtectionSummary({ id }) {
  const [insuranceData, setInsuranceData] = useState({
    data: [],
    dataComp: [],
    lifeMonthlyPremium: 0,
    lifeDeathBenefit: 0,
    disabilityMonthlyPremium: 0,
    disabilityMonthlyBenefit: 0,
  });

  useEffect(() => {
    clientProtectionService
      .insuranceGetByClientId(id)
      .then(onInsuranceDataSuccess)
      .catch(onError);
  }, [id]);

  const onInsuranceDataSuccess = (response) => {
    const sumLifeMonthlyPremium = response.items.reduce((total, item) => {
      if (item.insuranceType.id === 3) {
        return total + item.monthlyPayment;
      }
      return total;
    }, 0);

    const sumLifeDeathBenefit = response.items.reduce((total, item) => {
      if (item.insuranceType.id === 3) {
        return total + item.deathBenefit;
      }
      return total;
    }, 0);

    const sumDisabilityMonthlyPremium = response.items.reduce((total, item) => {
      if (item.insuranceType.id === 4) {
        return total + item.monthlyPayment;
      }
      return total;
    }, 0);

    const sumDisabilityMonthlyBenefit = response.items.reduce((total, item) => {
      if (item.insuranceType.id === 4) {
        return total + item.monthlyBenefit;
      }
      return total;
    }, 0);

    setInsuranceData((prevState) => {
      const prev = { ...prevState };
      prev.data = response.items;
      prev.dataComp = prev.data.map(dataMapper);
      prev.lifeMonthlyPremium = sumLifeMonthlyPremium;
      prev.lifeDeathBenefit = sumLifeDeathBenefit;
      prev.disabilityMonthlyPremium = sumDisabilityMonthlyPremium;
      prev.disabilityMonthlyBenefit = sumDisabilityMonthlyBenefit;
      return prev;
    });
  };

  const dataMapper = (data) => {
    const dataOfInsurance = {
      name: data.name,
      insuranceTypeId: data.insuranceType.id,
      insurancePolicyTypeName: data.insurancePolicyType.name,
      monthlyPayment: data.monthlyPayment,
      deductible: data.deductible,
      institutionName: data.institutionName,
      monthlyBenefit: data.monthlyBenefit,
      deathBenefit: data.deathBenefit,
      isPayWork: data.isPayWork,
      purchaseDate: data.purchaseDate,
      lastReviewDate: data.lastReviewDate,
    };
    return dataOfInsurance;
  };

  const onError = (error) => {
    _logger("Error Message:", error.message);
  };

  const mapHealthInsuranceView = (values, index) => {
    if (values.insuranceTypeId === 1 || values.insuranceTypeId === 2)
      return (
        <tr key={`HIV_${index}`}>
          <td>
            {values.insuranceTypeId === 1
              ? "Client's Health Insurance"
              : "Spouse's Health Insurance"}
          </td>
          <td>{values.insurancePolicyTypeName}</td>
          <td>{values.isPayWork === true ? "Yes" : "No"}</td>
          <td>{commonFormater.formatUsd(values.deductible)}</td>
          <td>{commonFormater.formatUsd(values.monthlyPayment)}</td>
          <td>{values.institutionName}</td>
        </tr>
      );
  };

  const mapLifeInsuranceView = (values, index) => {
    if (values.insuranceTypeId === 3)
      return (
        <tr key={`LIV_${index}`}>
          <td>{values.name}</td>
          <td>{values.insurancePolicyTypeName}</td>
          <td>
            {values.monthlyPayment
              ? commonFormater.formatUsd(values.monthlyPayment)
              : "N/A"}
          </td>
          <td>{commonFormater.formatUsd(values.deathBenefit)}</td>
          <td>{values.institutionName}</td>
          <td>
            {values.purchaseDate ? formatDateShort(values.purchaseDate) : "N/A"}
          </td>
        </tr>
      );
  };

  const mapDisabilityInsuranceView = (values, index) => {
    if (values.insuranceTypeId === 4)
      return (
        <tr key={`DIV_${index}`}>
          <td>{values.name}</td>
          <td>
            {values.monthlyPayment
              ? commonFormater.formatUsd(values.monthlyPayment)
              : "N/A"}
          </td>
          <td>{commonFormater.formatUsd(values.monthlyBenefit)}</td>
          <td>{values.isPayWork === true ? "Yes" : "No"}</td>
          <td>{values.institutionName}</td>
          <td>
            {values.purchaseDate ? formatDateShort(values.purchaseDate) : "N/A"}
          </td>
        </tr>
      );
  };

  return (
    <>
      <div className="container-fluid bg-white px-4">
        <div className="row">
          <div className="col-auto">
            <h3 className="mb-1  fw-bold pt-3 pb-2">Health Insurance</h3>
          </div>
          <div className="col d-flex align-items-center">
            <FaEdit className="h2" cursor={"pointer"} />
          </div>
          <div className="row d-flex align-items-center text-nowrap">
            {insuranceData.data.find((item) =>
              [1, 2].includes(item.insuranceType.id)
            ) ? (
              <Table
                responsive
                bordered
                hover
                className="text-wrap text-center"
              >
                <thead className="table-primary">
                  <tr className="align-middle">
                    <th scope="col" style={{ width: "20px" }}></th>
                    <th scope="col" className="col-2">
                      Plan Type
                    </th>
                    <th scope="col">Paid Through Work?</th>
                    <th scope="col">Deductible</th>
                    <th scope="col">Monthly Payment</th>
                    <th scope="col">Institution Name</th>
                  </tr>
                </thead>
                <tbody className="table-light align-middle text-nowrap">
                  {insuranceData.dataComp.map(mapHealthInsuranceView)}
                </tbody>
              </Table>
            ) : (
              <div className="text-center py-2">
                <h4>No Health Insurance Information Available</h4>
              </div>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-auto">
            <h3 className="mb-1  fw-bold pt-3 pb-2">Life Insurance</h3>
          </div>
          <div className="col d-flex align-items-center">
            <FaEdit className="h2" cursor={"pointer"} />
          </div>
          <div className="row d-flex align-items-center ">
            {insuranceData.data.find((item) =>
              [3].includes(item.insuranceType.id)
            ) ? (
              <Table
                responsive
                bordered
                hover
                className="text-wrap text-center"
              >
                <thead className="table-primary">
                  <tr className="align-middle">
                    <th scope="col" style={{ width: "20px" }}>
                      Name of Policy
                    </th>
                    <th scope="col" className="col-2">
                      Plan Type
                    </th>
                    <th scope="col">Premium</th>
                    <th scope="col">Death Benefit</th>
                    <th scope="col">Institution Name</th>
                    <th scope="col">Purchase Date</th>
                  </tr>
                </thead>
                <tbody className="table-light align-middle text-nowrap">
                  {insuranceData.dataComp.map(mapLifeInsuranceView)}
                  <tr className="border border-0">
                    <td
                      colSpan={2}
                      className="text-start fw-bold border border-secondary-subtle"
                    >
                      Total:
                    </td>
                    <td className="fw-bold border border-secondary-subtle">
                      {commonFormater.formatUsd(
                        insuranceData.lifeMonthlyPremium
                      )}
                    </td>
                    <td className="fw-bold border border-secondary-subtle">
                      {commonFormater.formatUsd(insuranceData.lifeDeathBenefit)}
                    </td>
                  </tr>
                </tbody>
              </Table>
            ) : (
              <div className="text-center py-2">
                <h4>No Life Insurance Information Available</h4>
              </div>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-auto">
            <h3 className="mb-1  fw-bold pt-3 pb-2">Disability Insurance</h3>
          </div>
          <div className="col d-flex align-items-center">
            <FaEdit className="h2" cursor={"pointer"} />
          </div>
          <div className="row d-flex align-items-center">
            {insuranceData.data.find((item) =>
              [4].includes(item.insuranceType.id)
            ) ? (
              <Table
                responsive
                bordered
                hover
                className="text-wrap text-center"
              >
                <thead className="table-primary">
                  <tr className="align-middle">
                    <th scope="col" style={{ width: "20px" }}>
                      Name of Policy
                    </th>
                    <th scope="col" className="col-2">
                      Premium
                    </th>
                    <th scope="col">Monthly Benefit Amount</th>
                    <th scope="col">Paid Through Work?</th>
                    <th scope="col">Institution Name</th>
                    <th scope="col">Purchase Date</th>
                  </tr>
                </thead>
                <tbody className="table-light align-middle text-nowrap">
                  {insuranceData.dataComp.map(mapDisabilityInsuranceView)}
                  <tr className="border border-0">
                    <td
                      colSpan={1}
                      className="text-start fw-bold border border-secondary-subtle"
                    >
                      Total:
                    </td>
                    <td className="fw-bold border border-secondary-subtle">
                      {commonFormater.formatUsd(
                        insuranceData.disabilityMonthlyPremium
                      )}
                    </td>
                    <td className="fw-bold border border-secondary-subtle">
                      {commonFormater.formatUsd(
                        insuranceData.disabilityMonthlyBenefit
                      )}
                    </td>
                  </tr>
                </tbody>
              </Table>
            ) : (
              <div className="text-center py-2">
                <h4>No Disability Insurance Information Available</h4>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

ClientProtectionSummary.propTypes = {
  id: PropTypes.string.isRequired,
};

export default ClientProtectionSummary;
