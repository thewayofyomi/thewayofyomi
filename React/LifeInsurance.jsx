import React, { useEffect, useState } from "react";
import toastr from "toastr";
import debug from "sabio-debug";
import lookUp from "services/lookUpService";
import { Table } from "react-bootstrap";
import protectionSchema from "schemas/protectionSchema";
import { ErrorMessage, Formik, Form, Field, FieldArray } from "formik";
import clientProtectionService from "services/clientProtectionService";
import PropTypes from "prop-types";

const _logger = debug.extend("Life Insurance");

function LifeInsurance(props) {
  const insurance = {
    name: "",
    insuranceTypeId: 3,
    insurancePolicyTypeId: "",
    monthlyPayment: "",
    deathBenefit: "",
    institutionName: "",
    purchaseDate: "",
  };

  const [lifeInsurance] = useState({
    clientInsurances: [insurance],
    clientId: props.clientId,
  });

  const [lookUps, setLookUps] = useState({
    insurancePolicyTypes: [],
    insurancePolicyTypesComp: [],
  });

  useEffect(() => {
    lookUp
      .lookUp(["InsurancePolicyTypes"])
      .then(onLookUpSuccess)
      .catch(onError);
  }, [lifeInsurance]);

  const onLookUpSuccess = (response) => {
    setLookUps((prevState) => {
      const prev = { ...prevState };
      prev.insurancePolicyTypes = response.item.insurancePolicyTypes;
      prev.insurancePolicyTypesComp =
        prev.insurancePolicyTypes.map(lookUpMapper);
      return prev;
    });
  };

  const lookUpMapper = (lookUp) => {
    return (
      <option key={lookUp.id} value={lookUp.id} className="text-dark">
        {lookUp.name}
      </option>
    );
  };

  const onSubmitForm = (values) => {
    let payload = { ...values };

    payload.clientInsurances = values.clientInsurances.map((insurance) => ({
      ...insurance,
      monthlyPayment: insurance.monthlyPayment || null,
      purchaseDate: insurance.purchaseDate || null,
      deathBenefit: insurance.deathBenefit || null,
    }));

    clientProtectionService
      .addInsurance(payload)
      .then(onSuccess)
      .catch(onError);
  };

  const onSuccess = (response) => {
    _logger("Success Message:", response.message);
    toastr.success("Life Insurance Completed");
    props.onNext();
  };

  const onError = (error) => {
    _logger("Error Message:", error.message);
    toastr.error(error.message);
  };

  return (
    <React.Fragment>
      <div className="py-6">
        <div className="card shadow-lg mb-5 bg-white rounded">
          <div className="card-body shadow-lg bg-white rounded rounded mb-1">
            <h1 className="fw-bold h2 mb-1 ps-1">Life Insurance</h1>
          </div>
          <div className="card-body bg-white bg-gradient rounded">
            <Formik
              enableReinitialize={true}
              initialValues={lifeInsurance}
              validationSchema={protectionSchema.lifeInsurance}
              onSubmit={onSubmitForm}
            >
              {({ values, setFieldValue }) => (
                <FieldArray name="clientInsurances">
                  {({ push, remove }) => {
                    return (
                      <>
                        <Form>
                          <Table responsive className="text-nowrap mt-4">
                            <thead className="table-primary">
                              <tr>
                                <th
                                  className="align-middle text-center border border-secondary pe-3 ps-3"
                                  scope="col"
                                >{`Name of Policy`}</th>
                                <th
                                  className="align-middle text-center border border-secondary pe-5 ps-5"
                                  scope="col"
                                >
                                  {`Plan Type`}
                                </th>
                                <th
                                  className="align-middle text-center border border-secondary col-1"
                                  scope="col-auto"
                                >
                                  {`Premium`}
                                </th>
                                <th
                                  className="align-middle text-center border border-secondary col-1"
                                  scope="col-auto"
                                >
                                  {`Death Benefit`}
                                </th>
                                <th
                                  className="align-middle text-center border border-secondary col-3"
                                  scope="col-auto"
                                >
                                  {`Institution Name`}
                                </th>
                                <th
                                  className="align-middle text-center border border-secondary"
                                  scope="col-auto"
                                >
                                  {`Purchase Date`}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {values.clientInsurances.length > 0 &&
                                values.clientInsurances.map(
                                  (lifeInsurance, index) => {
                                    return (
                                      <tr key={index}>
                                        <td className="border border-secondary p-1">
                                          <Field
                                            type="text"
                                            name={`clientInsurances.${index}.name`}
                                            className="form-control py-2 ps-3 pe-3 w-100"
                                          />
                                          <ErrorMessage
                                            name={`clientInsurances.${index}.name`}
                                            component="div"
                                            className="has-error text-danger"
                                          />
                                        </td>
                                        <td className="border border-secondary p-1">
                                          <Field
                                            as="select"
                                            type="select"
                                            name={`clientInsurances.${index}.insurancePolicyTypeId`}
                                            className="form-select text-dark py-2 ps-3 pe-3 w-100"
                                            onChange={(event) => {
                                              const target = event.target.value;
                                              setFieldValue(
                                                `clientInsurances.${index}.insurancePolicyTypeId`,
                                                parseInt(target)
                                              );
                                            }}
                                          >
                                            <option
                                              disabled
                                              defaultValue={" "}
                                            ></option>
                                            {lookUps.insurancePolicyTypesComp}
                                          </Field>
                                          <ErrorMessage
                                            name={`clientInsurances.${index}.insurancePolicyTypeId`}
                                            component="div"
                                            className="has-error text-danger"
                                          />
                                        </td>
                                        <td className="border border-secondary p-1">
                                          <Field
                                            type="text"
                                            name={`clientInsurances.${index}.monthlyPayment`}
                                            className="form-control py-2 ps-3 pe-3 w-100"
                                            onChange={(event) => {
                                              const target = event.target.value;
                                              setFieldValue(
                                                `clientInsurances.${index}.monthlyPayment`,
                                                parseInt(target)
                                              );
                                            }}
                                          />
                                          <ErrorMessage
                                            name={`clientInsurances.${index}.monthlyPayment`}
                                            component="div"
                                            className="has-error text-danger"
                                          />
                                        </td>
                                        <td className="border border-secondary p-1">
                                          <Field
                                            type="text"
                                            name={`clientInsurances.${index}.deathBenefit`}
                                            className="form-control ps-3 py-2 w-100"
                                            onChange={(event) => {
                                              const target = event.target.value;
                                              setFieldValue(
                                                `clientInsurances.${index}.deathBenefit`,
                                                parseInt(target)
                                              );
                                            }}
                                          />
                                          <ErrorMessage
                                            name={`clientInsurances.${index}.deathBenefit`}
                                            component="div"
                                            className="has-error text-danger"
                                          />
                                        </td>
                                        <td className="border border-secondary p-1">
                                          <Field
                                            type="text"
                                            name={`clientInsurances.${index}.institutionName`}
                                            className="form-control ps-3 py-2 w-100"
                                          />
                                          <ErrorMessage
                                            name={`clientInsurances.${index}.institutionName`}
                                            component="div"
                                            className="has-error text-danger"
                                          />
                                        </td>
                                        <td className="border border-secondary p-1">
                                          <Field
                                            type="date"
                                            name={`clientInsurances.${index}.purchaseDate`}
                                            className="form-control ps-3 py-2 w-100"
                                          />
                                          <ErrorMessage
                                            name={`clientInsurances.${index}.purchaseDate`}
                                            component="div"
                                            className="has-error text-danger"
                                          />
                                        </td>
                                        <td className="bg-white px-1">
                                          {index > 0 && (
                                            <button
                                              type="button"
                                              className="bg-white border-0"
                                              onClick={() => remove(index)}
                                            >
                                              <index className="fe fe-trash" />
                                            </button>
                                          )}
                                          {index + 1 ===
                                            values.clientInsurances.length && (
                                            <button
                                              type="button"
                                              className="bg-white border-0"
                                              onClick={() => push(insurance)}
                                            >
                                              <index className="fe fe-plus-circle" />
                                            </button>
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  }
                                )}
                            </tbody>
                          </Table>
                          <div>
                            {!props.isInStepper && (
                              <button
                                type="submit"
                                className="btn btn-primary mt-3 float-end"
                              >
                                Submit
                              </button>
                            )}
                            {props.isInStepper && (
                              <>
                                <button
                                  type="submit"
                                  onClick={props.onBack}
                                  className="btn btn-secondary me-3 mt-3"
                                >
                                  {props.backLabel}
                                </button>
                                <button
                                  type="submit"
                                  className="btn btn-primary mt-3"
                                >
                                  {props.nextLabel}
                                </button>
                                <button
                                  type="submit"
                                  onClick={props.onNext}
                                  className="btn btn-info mt-3"
                                >
                                  {props.nextLabel}
                                </button>
                              </>
                            )}
                          </div>
                        </Form>
                      </>
                    );
                  }}
                </FieldArray>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
LifeInsurance.propTypes = {
  clientId: PropTypes.number,
  nextLabel: PropTypes.string,
  backLabel: PropTypes.string,
  onNext: PropTypes.func,
  onBack: PropTypes.func,
  isInStepper: PropTypes.bool,
};
export default LifeInsurance;
