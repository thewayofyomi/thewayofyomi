import React from "react";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { Table } from "react-bootstrap";
import PropTypes from "prop-types";
import protectionSchema from "schemas/protectionSchema";
import clientProtectionService from "services/clientProtectionService";
import toastr from "toastr";
import logger from "sabio-debug";
const _logger = logger.extend("CarInsurance");

function CarInsuranceForm(props) {
  const isMarried = props.isMarried;

  const formData = {
    client: {
      insuranceTypeId: 5,
      deductible: "",
      monthlyPayment: "",
      institutionName: "",
    },
    spouse: {
      insuranceTypeId: 8,
      deductible: "",
      monthlyPayment: "",
      institutionName: "",
    },
    isMarried: isMarried,
  };

  const onSubmitForm = (dataValues) => {
    if (!dataValues.client.deductible) dataValues.client.deductible = 0;

    const dataArray = [dataValues.client];

    if (isMarried) {
      if (!dataValues.spouse.deductible) dataValues.spouse.deductible = 0;
      dataArray.push(dataValues.spouse);
    }

    const payload = {
      clientId: props.clientId,
      clientInsurances: dataArray,
    };
    _logger(payload);
    clientProtectionService
      .addInsurance(payload)
      .then(onAddSuccess)
      .catch(onAddError);
  };

  const onAddSuccess = () => {
    toastr.success("Health Insurance Completed");
    props.onNext();
  };

  const onAddError = (error) => {
    _logger("Error Message:", error.message);
    toastr.error(error.message);
  };

  return (
    <div className="py-6">
      <div className="card shadow-lg mb-5 bg-white rounded ">
        <div className="card-body shadow-lg bg-white rounded rounded mb-1">
          <h1 className="fw-bold h2 mb-1 ps-1">Car Insurance</h1>
        </div>
        <div className="card-body bg-white bg-gradient rounded">
          <Formik
            enableReinitialize={true}
            initialValues={formData}
            onSubmit={onSubmitForm}
            validationSchema={protectionSchema.carInsurance}
          >
            <Form>
              <Table
                responsive
                bordered
                className="text-nowrap mt-4 border border-secondary"
              >
                <thead className="table-primary border border-secondary">
                  <tr>
                    <th className="col-1" scope="col"></th>
                    <th
                      className="align-middle text-center text-wrap col-2"
                      scope="col-auto"
                    >
                      Deductible
                    </th>
                    <th
                      className="align-middle text-center col-2"
                      scope="col-auto"
                    >
                      Monthly Payment
                    </th>
                    <th
                      className="align-middle text-center text-wrap"
                      scope="col-auto"
                    >
                      Institution Name
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="align-middle fw-semibold">{`Client's Car Insurance`}</td>
                    <td className="p-1">
                      <Field
                        type="text"
                        name="client.deductible"
                        className="form-control py-2 ps-3 pe-3 w-100"
                      />
                      <ErrorMessage
                        name="client.deductible"
                        component="div"
                        className="has-error text-danger"
                      />
                    </td>
                    <td className="p-1">
                      <Field
                        type="text"
                        name="client.monthlyPayment"
                        className="form-control py-2 ps-3 pe-3 w-100"
                      />
                      <ErrorMessage
                        name="client.monthlyPayment"
                        component="div"
                        className="has-error text-danger"
                      />
                    </td>
                    <td className="p-1">
                      <Field
                        type="text"
                        name="client.institutionName"
                        className="form-control py-2 ps-3 pe-3 w-100"
                      />
                      <ErrorMessage
                        name="client.institutionName"
                        component="div"
                        className="has-error text-danger"
                      />
                    </td>
                  </tr>
                  {isMarried && (
                    <tr>
                      <td className="align-middle fw-semibold">{`Spouse's Car Insurance`}</td>
                      <td className="p-1">
                        <Field
                          type="text"
                          name="spouse.deductible"
                          className="form-control py-2 ps-3 pe-3 w-100"
                        />
                        <ErrorMessage
                          name="spouse.deductible"
                          component="div"
                          className="has-error text-danger"
                        />
                      </td>
                      <td className="p-1">
                        <Field
                          type="text"
                          name="spouse.monthlyPayment"
                          className="form-control py-2 ps-3 pe-3 w-100"
                        />
                        <ErrorMessage
                          name="spouse.monthlyPayment"
                          component="div"
                          className="has-error text-danger"
                        />
                      </td>
                      <td className="p-1">
                        <Field
                          type="text"
                          name="spouse.institutionName"
                          className="form-control py-2 ps-3 pe-3 w-100"
                        />
                        <ErrorMessage
                          name="spouse.institutionName"
                          component="div"
                          className="has-error text-danger"
                        />
                      </td>
                    </tr>
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
                    <button type="submit" className="btn btn-primary mt-3">
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
          </Formik>
        </div>
      </div>
    </div>
  );
}

CarInsuranceForm.propTypes = {
  clientId: PropTypes.number,
  nextLabel: PropTypes.string,
  backLabel: PropTypes.string,
  onNext: PropTypes.func,
  onBack: PropTypes.func,
  isMarried: PropTypes.bool,
  isInStepper: PropTypes.bool,
};

export default CarInsuranceForm;
