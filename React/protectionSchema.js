import * as Yup from 'yup';

const clientProtection = Yup.object().shape({
    clientId: Yup.number().required(),
    hasHealthInsurance: Yup.bool().required("Required"),
    hasLifeInsurance: Yup.bool().required("Required"),
    hasDisabilityInsurance: Yup.bool().required("Required"),
    hasCarInsurance: Yup.bool().required("Required"),
    hasTrustOrWill: Yup.bool().required("Required"),
    isRevocable: Yup.bool(),
    isIrrevocable: Yup.bool()
});

const healthInsurance = Yup.object().shape({
    client: Yup.object().shape({
        insuranceTypeId: Yup.number().required(),
        insurancePolicyTypeId: Yup.number().nullable().required("Selection is required"),
        monthlyPayment: Yup.number().typeError("Must be a Number").nullable().required("Monthly Payment is required"),
        deductible: Yup.number().typeError("Must be a Number").required("Deductible is required"),
        institutionName: Yup.string().min(2, "Institution Name must be at least 2 characters").max(100).required("Institution Name is required"),
        isPayWork: Yup.bool().required("Selection is required")
    }),
    spouse: Yup.object().when("isMarried", {
        is: true, then: Yup.object().shape({
            insuranceTypeId: Yup.number().required(),
            insurancePolicyTypeId: Yup.number().nullable().required("Selection is required"),
            monthlyPayment: Yup.number().typeError("Must be a Number").nullable().required("Monthly Payment is required"),
            deductible: Yup.number().typeError("Must be a Number").required("Deductible is required"),
            institutionName: Yup.string().min(2, "Institution Name must be at least 2 characters").max(100).required("Institution Name is required"),
            isPayWork: Yup.bool().required("Selection is required")
        })
    }),
    clientId: Yup.number().required(),
    isMarried: Yup.bool().required()
});

const lifeInsurance = Yup.object().shape({
    clientInsurances: Yup.array().of(Yup.object().shape({
        name: Yup.string().min(2, "Name must be at least 2 characters").max(200).nullable().required("Name is required"),
        insuranceTypeId: Yup.number().required(),
        insurancePolicyTypeId: Yup.number().nullable().required("Selection is required"),
        monthlyPayment: Yup.number().min(0).typeError("Must be a Number").nullable(),
        deathBenefit: Yup.number().min(0).typeError("Must be a Number").nullable().required("Death Benefit is required"),
        institutionName: Yup.string().min(2, "Institution Name must be at least 2 characters").max(100).required("Institution Name is required"),
        purchaseDate: Yup.date().nullable()
    })),
    clientId: Yup.number().required()
})

const disabilityInsurance = Yup.object().shape({
    clientInsurances: Yup.array().of(Yup.object().shape({
        name: Yup.string().min(2, "Name must be at least 2 characters").max(200).nullable().required("Name is required"),
        insuranceTypeId: Yup.number().required(),
        monthlyPayment: Yup.number().min(0).typeError("Must be a Number").nullable().required("Premium is required"),
        monthlyBenefit: Yup.number().min(0).typeError("Must be a Number").nullable(),
        isPayWork: Yup.bool().required("Selection is required"),
        institutionName: Yup.string().min(2, "Institution Name must be at least 2 characters").max(100).required("Institution Name is required"),
        purchaseDate: Yup.date().nullable()
    })),
    clientId: Yup.number().required()
})

const carInsurance = Yup.object().shape({
    client: Yup.object().shape({
        monthlyPayment: Yup.number().typeError("Must be a valid number").required("Monthly Payment is required"),
        deductible: Yup.number().typeError("Must be a valid number"),
        institutionName: Yup.string().min(2, "Institution Name must be at least 2 characters").max(100).required("Institution Name is required"),
    }),
    spouse: Yup.object().when("isMarried", {
        is: true, then: Yup.object().shape({
            monthlyPayment: Yup.number().typeError("Must be a valid number").required("Monthly Payment is required"),
            deductible: Yup.number().typeError("Must be a valid number"),
            institutionName: Yup.string().min(2, "Institution Name must be at least 2 characters").max(100).required("Institution Name is required"),
        })
    }),
    isMarried: Yup.bool().required()
});

const protectionSchema = { clientProtection, healthInsurance, lifeInsurance, disabilityInsurance, carInsurance };

export default protectionSchema;