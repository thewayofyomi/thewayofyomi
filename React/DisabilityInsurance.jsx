import React, { useState } from "react";
import toastr from "toastr";
import debug from "sabio-debug";
import { Table } from "react-bootstrap";
import protectionSchema from "schemas/protectionSchema";
import { ErrorMessage, Formik, Form, Field, FieldArray } from "formik";
import clientProtectionService from "services/clientProtectionService";
import PropTypes from "prop-types";

const _logger = debug.extend("Disability Insurance");

function DisabilityInsurance(props) {
  const insurance = {
    name: "",
    insuranceTypeId: 4,
    monthlyPayment: "",
    monthlyBenefit: "",
    isPayWork: "",
    institutionName: "",
    purchaseDate: "",
  };

  const [disabilityInsurance] = useState({
    clientInsurances: [insurance],
    clientId: props.clientId,
  });

  const onSubmitForm = (values) => {
    let payload = { ...values };

    payload.clientInsurances = values.clientInsurances.map((insurance) => ({
      ...insurance,
      monthlyPayment: insurance.monthlyPayment || null,
      monthlyBenefit: insurance.monthlyBenefit || null,
      isPayWork: insurance.isPayWork === "true" ? true : false,
      purchaseDate: insurance.purchaseDate || null,
    }));
    _logger(payload);
    clientProtectionService
      .addInsurance(payload)
      .then(onSuccess)
      .catch(onError);
  };

  const onSuccess = (response) => {
    _logger("Success Message:", response.message);
    toastr.success("Disability Insurance Completed");
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
            <h1 className="fw-bold h2 mb-1 ps-1">Disability Insurance</h1>
          </div>
          <div className="card-body bg-white bg-gradient rounded">
            <Formik
              enableReinitialize={true}
              initialValues={disabilityInsurance}
              validationSchema={protectionSchema.disabilityInsurance}
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
                                  className="align-middle text-center border border-secondary pe-3 ps-3"
                                  scope="col"
                                >{`Premium`}</th>
                                <th
                                  className="align-middle text-center text-wrap border border-secondary pe-5 ps-5"
                                  scope="col"
                                >
                                  {`Monthly Benefit Amount`}
                                </th>
                                <th
                                  className="align-middle text-center text-wrap border border-secondary"
                                  scope="col-auto"
                                >
                                  {`Paid Through Work?`}
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
                                  (disabilityInsurance, index) => {
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
                                            name={`clientInsurances.${index}.monthlyBenefit`}
                                            className="form-control py-2 ps-3 pe-3 w-100"
                                            onChange={(event) => {
                                              const target = event.target.value;
                                              setFieldValue(
                                                `clientInsurances.${index}.monthlyBenefit`,
                                                parseInt(target)
                                              );
                                            }}
                                          />
                                          <ErrorMessage
                                            name={`clientInsurances.${index}.monthlyBenefit`}
                                            component="div"
                                            className="has-error text-danger"
                                          />
                                        </td>
                                        <td className="border border-secondary p-1">
                                          <Field
                                            as="select"
                                            type="select"
                                            name={`clientInsurances.${index}.isPayWork`}
                                            className="form-select text-dark py-2 ps-3 pe-3 w-100"
                                          >
                                            <option
                                              disabled
                                              defaultValue={" "}
                                            ></option>
                                            <option value={true}>Yes</option>
                                            <option value={false}>No</option>
                                          </Field>{" "}
                                          <ErrorMessage
                                            name={`clientInsurances.${index}.isPayWork`}
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
DisabilityInsurance.propTypes = {
  clientId: PropTypes.number,
  nextLabel: PropTypes.string,
  backLabel: PropTypes.string,
  onNext: PropTypes.func,
  onBack: PropTypes.func,
  isInStepper: PropTypes.bool,
};
export default DisabilityInsurance;
