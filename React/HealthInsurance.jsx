import React, { useEffect, useState } from "react";
import toastr from "toastr";
import debug from "sabio-debug";
import { ErrorMessage, Formik, Form, Field } from "formik";
import { Table } from "react-bootstrap";
import lookUp from "services/lookUpService";
import protectionSchema from "schemas/protectionSchema";
import clientProtectionService from "services/clientProtectionService";
import PropTypes from "prop-types";

const _logger = debug.extend("Health Insurance");

function HealthInsurance(props) {
  const [formData] = useState({
    client: {
      insuranceTypeId: 1,
      insurancePolicyTypeId: "",
      monthlyPayment: "",
      deductible: "",
      isPayWork: "",
      institutionName: "",
    },
    spouse: {
      insuranceTypeId: 2,
      insurancePolicyTypeId: "",
      monthlyPayment: "",
      deductible: "",
      isPayWork: "",
      institutionName: "",
    },
    clientId: props.clientId,
    isMarried: props.isMarried,
  });

  useEffect(() => {
    lookUp
      .lookUp(["InsurancePolicyTypes"])
      .then(onLookUpSuccess)
      .catch(onError);
  }, []);

  const [lookUps, setLookUps] = useState({
    insurancePolicyTypes: [],
    insurancePolicyTypesComp: [],
  });

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
    const client = values.client;
    const spouse = values.spouse;
    let payload = [];

    if (formData.isMarried === true) {
      payload = {
        clientId: parseInt(formData.clientId),
        clientInsurances: [
          {
            insuranceTypeId: parseInt(client.insuranceTypeId),
            insurancePolicyTypeId: parseInt(client.insurancePolicyTypeId),
            monthlyPayment: parseInt(client.monthlyPayment),
            deductible: parseInt(client.deductible),
            institutionName: client.institutionName,
            isPayWork: client.isPayWork === "true" ? true : false,
          },
          {
            insuranceTypeId: parseInt(spouse.insuranceTypeId),
            insurancePolicyTypeId: parseInt(spouse.insurancePolicyTypeId),
            monthlyPayment: parseInt(spouse.monthlyPayment),
            deductible: parseInt(spouse.deductible),
            institutionName: spouse.institutionName,
            isPayWork: spouse.isPayWork === "true" ? true : false,
          },
        ],
      };
      clientProtectionService
        .addInsurance(payload)
        .then(onSuccess)
        .catch(onError);
      _logger(payload);
    } else {
      payload = {
        clientId: parseInt(formData.clientId),
        clientInsurances: [
          {
            insuranceTypeId: parseInt(client.insuranceTypeId),
            insurancePolicyTypeId: parseInt(client.insurancePolicyTypeId),
            monthlyPayment: parseInt(client.monthlyPayment),
            deductible: parseInt(client.deductible),
            institutionName: client.institutionName,
            isPayWork: client.isPayWork === "true" ? true : false,
          },
        ],
      };
      clientProtectionService
        .addInsurance(payload)
        .then(onSuccess)
        .catch(onError);
      _logger(payload);
    }
  };

  const onSuccess = (response) => {
    _logger("Success Message:", response.message);
    toastr.success("Health Insurance Completed");
    props.onNext();
  };

  const onError = (error) => {
    _logger("Error Message:", error.message);
    toastr.error(error.message);
  };

  return (
    <React.Fragment>
      <div className="py-6">
        <div className="card shadow-lg mb-5 bg-white rounded ">
          <div className="card-body shadow-lg bg-white rounded rounded mb-1">
            <h1 className="fw-bold h2 mb-1 ps-1">Health Insurance</h1>
          </div>
          <div className="card-body bg-white bg-gradient rounded">
            <Formik
              enableReinitialize={true}
              initialValues={formData}
              onSubmit={onSubmitForm}
              validationSchema={protectionSchema.healthInsurance}
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
                        className="align-middle text-center col-1"
                        scope="col"
                      >
                        {`Plan Type`}
                      </th>
                      <th
                        className="align-middle text-center text-wrap col-1"
                        scope="col-auto"
                      >
                        {`Paid Through Work?`}
                      </th>
                      <th
                        className="align-middle text-center col-1"
                        scope="col-auto"
                      >
                        {`Deductible`}
                      </th>
                      <th
                        className="align-middle text-center text-wrap col-1"
                        scope="col-auto"
                      >
                        {`Monthly Payment`}
                      </th>
                      <th
                        className="align-middle text-center col-3"
                        scope="col-auto"
                      >
                        {`Institution Name`}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="align-middle fw-semibold">{`Client's Health Insurance`}</td>
                      <td className="p-1">
                        <Field
                          as="select"
                          type="select"
                          name="client.insurancePolicyTypeId"
                          className="form-select text-dark py-2 ps-3 pe-3 w-100"
                        >
                          <option disabled defaultValue={" "}></option>
                          {lookUps.insurancePolicyTypesComp}
                        </Field>
                        <ErrorMessage
                          name="client.insurancePolicyTypeId"
                          component="div"
                          className="has-error text-danger"
                        />
                      </td>
                      <td className="p-1">
                        <Field
                          as="select"
                          type="select"
                          name="client.isPayWork"
                          className="form-select text-dark py-2 ps-3 pe-3 w-100"
                        >
                          <option disabled defaultValue={" "}></option>
                          <option value={true}>Yes</option>
                          <option value={false}>No</option>
                        </Field>{" "}
                        <ErrorMessage
                          name="client.isPayWork"
                          component="div"
                          className="has-error text-danger"
                        />
                      </td>
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
                  </tbody>
                  {formData.isMarried && (
                    <tbody>
                      <tr>
                        <td className="align-middle fw-semibold">{`Spouse's Health Insurance`}</td>
                        <td className="p-1">
                          <Field
                            as="select"
                            type="select"
                            name="spouse.insurancePolicyTypeId"
                            className="form-select text-dark py-2 ps-3 pe-3 w-100"
                          >
                            <option></option>
                            {lookUps.insurancePolicyTypesComp}
                          </Field>
                          <ErrorMessage
                            name="spouse.insurancePolicyTypeId"
                            component="div"
                            className="has-error text-danger"
                          />
                        </td>
                        <td className="p-1">
                          <Field
                            as="select"
                            type="select"
                            name="spouse.isPayWork"
                            className="form-select text-dark ps-3 pe-3 py-2"
                          >
                            <option></option>
                            <option value={true}>Yes</option>
                            <option value={false}>No</option>
                          </Field>{" "}
                          <ErrorMessage
                            name="spouse.isPayWork"
                            component="div"
                            className="has-error text-danger"
                          />
                        </td>
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
                    </tbody>
                  )}
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
    </React.Fragment>
  );
}
HealthInsurance.propTypes = {
  clientId: PropTypes.number,
  nextLabel: PropTypes.string,
  backLabel: PropTypes.string,
  onNext: PropTypes.func,
  onBack: PropTypes.func,
  isMarried: PropTypes.bool,
  isInStepper: PropTypes.bool,
};
export default HealthInsurance;
