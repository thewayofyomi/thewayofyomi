import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import toastr from "toastr";
import debug from "sabio-debug";
import protectionSchema from "schemas/protectionSchema";
import PropTypes from "prop-types";
import "./clientprotection.css";
import clientProtectionService from "services/clientProtectionService";

const _logger = debug.extend("Client Protection");

function ClientProtection(props) {
  const [formData, setFormData] = useState({
    clientId: props.clientId,
    hasHealthInsurance: "",
    hasLifeInsurance: "",
    hasDisabilityInsurance: "",
    hasCarInsurance: "",
    hasTrustOrWill: "",
    isRevocable: false,
    isIrrevocable: false,
  });

  const handleOnChange = (event) => {
    const target = event.target;
    let value = target.value;
    value = value === "true" ? true : false;

    setFormData((prevState) => {
      let newState = { ...prevState };

      if (target.name.toString() === "isRevocable") {
        newState[target.name] = !value;
      } else if (target.name.toString() === "isIrrevocable") {
        newState[target.name] = !value;
      } else {
        newState[target.name] = value;
      }
      return newState;
    });
  };

  const onSubmitForm = (values) => {
    props.updateProtection(values);
    clientProtectionService
      .addProtection(values)
      .then(onSubmitSuccess)
      .catch(onSubmitError);
  };

  const onSubmitSuccess = (response) => {
    _logger("Success Message:", response.message);
    toastr.success("Form Completed");
    props.onNext();
  };

  const onSubmitError = (error) => {
    _logger("Error Message:", error.message);
    toastr.error(error.message);
  };

  return (
    <React.Fragment>
      <div className="py-6">
        <div className="card shadow-lg mb-5 bg-white rounded">
          <div className="card-body shadow-lg bg-white rounded rounded mb-1">
            <h1 className="fw-bold h2 mb-1 ps-3">Protection Summary</h1>
          </div>
          <div className="card-body bg-white bg-gradient rounded">
            <Formik
              enableReinitialize={true}
              initialValues={formData}
              validationSchema={protectionSchema.clientProtection}
              onSubmit={onSubmitForm}
            >
              <Form>
                <div className="row form-check">
                  <div className="col">
                    <label
                      htmlFor="hasHealthInsurance"
                      className="pb-1"
                    >{`Do you currently have Health Insurance?`}</label>
                  </div>
                  <div
                    className="clientprotection-vertical-align-field"
                    role="health-group"
                    aria-labelledby="health-group"
                  >
                    <label className="clientprotection-vertical-align-field">
                      <Field
                        type="radio"
                        name="hasHealthInsurance"
                        className="me-2"
                        value={true}
                        onChange={handleOnChange}
                      />
                      Yes
                    </label>
                    <label className="clientprotection-vertical-align-field ps-2">
                      <Field
                        type="radio"
                        name="hasHealthInsurance"
                        className="me-2"
                        value={false}
                        onChange={handleOnChange}
                      />
                      No
                    </label>
                    <ErrorMessage
                      name="hasHealthInsurance"
                      component="div"
                      className="has-error text-danger ps-2"
                    />
                  </div>
                </div>
                <div className="row form-check">
                  <div className="col pt-1">
                    <label
                      htmlFor="hasLifeInsurance"
                      className="pb-1"
                    >{`Do you currently have Life Insurance?`}</label>
                  </div>
                  <div
                    className="clientprotection-vertical-align-field"
                    role="group"
                    aria-labelledby="life-group"
                  >
                    <label className="clientprotection-vertical-align-field">
                      <Field
                        type="radio"
                        name="hasLifeInsurance"
                        className="me-2"
                        value={true}
                        onChange={handleOnChange}
                      />
                      Yes
                    </label>
                    <label className="clientprotection-vertical-align-field ps-2">
                      <Field
                        type="radio"
                        name="hasLifeInsurance"
                        className="me-2"
                        value={false}
                        onChange={handleOnChange}
                      />
                      No
                    </label>
                    <ErrorMessage
                      name="hasLifeInsurance"
                      component="div"
                      className="has-error text-danger ps-2"
                    />
                  </div>
                </div>
                <div className="row form-check">
                  <div className="col pt-1">
                    <label
                      htmlFor="hasDisabilityInsurance"
                      className="pb-1"
                    >{`Do you currently have Disability Insurance?`}</label>
                  </div>
                  <div
                    className="clientprotection-vertical-align-field"
                    role="disability-group"
                    aria-labelledby="disability-group"
                  >
                    <label className="clientprotection-vertical-align-field">
                      <Field
                        type="radio"
                        name="hasDisabilityInsurance"
                        className="me-2"
                        value={true}
                        onChange={handleOnChange}
                      />
                      Yes
                    </label>
                    <label className="clientprotection-vertical-align-field ps-2">
                      <Field
                        type="radio"
                        name="hasDisabilityInsurance"
                        className="me-2"
                        value={false}
                        onChange={handleOnChange}
                      />
                      No
                    </label>
                    <ErrorMessage
                      name="hasDisabilityInsurance"
                      component="div"
                      className="has-error text-danger ps-2"
                    />
                  </div>
                </div>
                <div className="row form-check">
                  <div className="col pt-1">
                    <label
                      htmlFor="hasCarInsurance"
                      className="pb-1"
                    >{`Do you currently have Car Insurance?`}</label>
                  </div>
                  <div
                    className="clientprotection-vertical-align-field"
                    role="car-group"
                    aria-labelledby="car-group"
                  >
                    <label className="clientprotection-vertical-align-field">
                      <Field
                        type="radio"
                        name="hasCarInsurance"
                        className="me-2"
                        value={true}
                        onChange={handleOnChange}
                      />
                      Yes
                    </label>
                    <label className="clientprotection-vertical-align-field ps-2">
                      <Field
                        type="radio"
                        name="hasCarInsurance"
                        className="me-2"
                        value={false}
                        onChange={handleOnChange}
                      />
                      No
                    </label>
                    <ErrorMessage
                      name="hasCarInsurance"
                      component="div"
                      className="has-error text-danger ps-2"
                    />
                  </div>
                </div>
                <div className="row form-check">
                  <div className="col pt-1">
                    <label
                      htmlFor="hasTrustOrWill"
                      className="pb-1"
                    >{`Do you currently have a Will or a Trust set up?`}</label>
                  </div>
                  <div
                    className="clientprotection-vertical-align-field"
                    role="will-group"
                    aria-labelledby="will-group"
                  >
                    <label className="clientprotection-vertical-align-field">
                      <Field
                        type="radio"
                        name="hasTrustOrWill"
                        className="me-2"
                        value={true}
                        onChange={handleOnChange}
                      />
                      Yes
                    </label>
                    <label className="clientprotection-vertical-align-field ps-2">
                      <Field
                        type="radio"
                        name="hasTrustOrWill"
                        className="me-2"
                        value={false}
                        onChange={handleOnChange}
                      />
                      No
                    </label>
                    <ErrorMessage
                      name="hasTrustOrWill"
                      component="div"
                      className="has-error text-danger ps-2"
                    />
                  </div>
                </div>
                {formData.hasTrustOrWill && (
                  <div className="row form-check">
                    <div className="col pt-1">
                      <label className="pb-1">{`Is the Trust Revocable or Irrevocable?`}</label>
                    </div>
                    <div className="ps-5 clientprotection-vertical-align-field">
                      <label
                        className="clientprotection-vertical-align-field me-4"
                        htmlFor="isRevocable"
                      >
                        <Field
                          type="checkbox"
                          name="isRevocable"
                          className="form-check-input me-2 border border-secondary"
                          checked={formData.isRevocable}
                          onChange={handleOnChange}
                        />
                        {` Revocable`}
                      </label>
                      <label
                        className="clientprotection-vertical-align-field ps-2"
                        htmlFor="isIrrevocable"
                      >
                        <Field
                          type="checkbox"
                          name="isIrrevocable"
                          className="form-check-input me-2 border border-secondary"
                          checked={formData.isIrrevocable}
                          onChange={handleOnChange}
                        />
                        {` Irrevocable`}
                      </label>
                    </div>
                  </div>
                )}
                <div className="mt-4 ps-3">
                  {!props.isInStepper && (
                    <button
                      type="submit"
                      className="btn btn-primary float-end mt-3"
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
ClientProtection.propTypes = {
  clientId: PropTypes.number,
  nextLabel: PropTypes.string,
  backLabel: PropTypes.string,
  onNext: PropTypes.func,
  onBack: PropTypes.func,
  isInStepper: PropTypes.bool,
  updateProtection: PropTypes.func,
};
export default ClientProtection;
