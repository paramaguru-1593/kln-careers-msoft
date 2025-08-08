import React, { useState } from 'react';
import { Button, Input, message } from 'antd';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { POST } from '../../api/api_helpers';
import Images from '../../images/images';
import SuccessPopup from '../popups/SuccessPopup';

const InternalCampaignForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    emp_code: Yup.string().required('Employee ID is required'),
    references: Yup.array()
        .of(
        Yup.object().shape({
            name: Yup.string().required('Reference name is required'),
            number: Yup.string()
            .required('Reference number is required')
            .matches(/^[0-9]{10}$/, 'Reference number must be exactly 10 digits'), // Ensure exactly 10 digits
        })
        )
        .test(
        'at-least-one-reference',
        'At least one reference is required',
        (references) => Array.isArray(references) && references.some((ref) => ref.name && ref.number)
        ),
    });


    const handleSubmit = async (values, {resetForm}) => {
        setIsSubmitting(true);

        const validReferences = values.references.filter((ref) => ref.name || ref?.number);

        const refNames = validReferences.map((ref) => ref.name);
        const refNumbers = validReferences.map((ref) => ref.number);

        const payload = {
            name: values.name,
            emp_code: values.emp_code,
            ref_name: refNames,
            ref_number: refNumbers,
        };


        try {
        const response = await POST('internalCampaignApplicant', payload, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('API Response:', response.data);

        if (response?.data?.message === 'Registration successful') {
            // message.success('Reference submitted successfully!');
            setShowSuccessPopup(true);
            resetForm(); // Reset the form after successful submission
        } else {
            message.error('Failed to submit the reference. Please try again.');
        }
        } catch (error) {
        console.error('API Error:', error);
        message.error('Failed to submit the reference. Please try again.');
        } finally {
        setIsSubmitting(false);
        }
    };

    const addReference = (setFieldValue, values) => {
    if (values.references.length >= 10) {
        message.error('You can add up to 10 references only.');
        return;
    }
    const updatedReferences = [...values.references, { name: '', number: '' }];
    setFieldValue('references', updatedReferences);
    };

    return (
        <section className="w-full bg-[#ffcdcd36] py-4 sm:py-10 pr-4 lg:pr-12">
        {showSuccessPopup && (
            <SuccessPopup
                visible={showSuccessPopup}
                onClose={() => setShowSuccessPopup(false)}
                message="Reference submitted successfully!"
            />
        )}
        <div className="container mx-auto px-4">
            <div className="text-center mb-5 xl:mb-8">
                <h2 className="text-[22px] lg:text-[25px] xl:text-[28px] font-semibold text-center">
                    Fill your{' '}
                    <span className="font-bold text-[#ed1b24]">Reference</span> Details
                </h2>
                <p className="text-[16px] xl:text-[18px] font-normal italic mt-2 text-black font-['Poppins',Helvetica] max-w-lg mx-auto flex items-center justify-center gap-2">
                    Share your references here and start earning
                    <img src={Images.MoneyIcon} className='w-5 h-5' alt="MoneyIcon" />
                </p>
            </div>
            <div className="text-center mb-5 xl:mb-8">
            <h2 className="text-[22px] lg:text-[25px] xl:text-[28px] font-semibold text-start mx-4 md:mx-8">
                <span className="block">Personal Information</span>
            </h2>
            </div>

            <Formik
            initialValues={{
                name: '',
                emp_code: '',
                  references: [{ name: '', number: '' }], // Start with one reference
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => handleSubmit(values, { resetForm })}
            >
            {({ values, setFieldValue }) => (
                <Form className="mx-4 md:mx-8">
                {/* Name Field */}
                <div className="space-y-2">
                    <label className="font-medium text-[14px] xl:text-[16px] font-['Montserrat',Helvetica] mb-1">
                    Your Name <span className="text-[#ed1b24]">*</span>
                    </label>
                    <Field
                    name="name"
                    as={Input}
                    placeholder="Enter your name"
                    className="w-full"
                    onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, ''); // Allow only letters and spaces
                    }}
                    />
                    <ErrorMessage
                    name="name"
                    component="div"
                    className="text-[#ed1b24] text-sm"
                    />
                </div>

                {/* Employee ID Field */}
                <div className="space-y-2 mt-4">
                    <label className="font-medium text-[14px] xl:text-[16px] font-['Montserrat',Helvetica] mb-1">
                    Your Employee ID <span className="text-[#ed1b24]">*</span>
                    </label>
                    <Field
                    name="emp_code"
                    as={Input}
                    placeholder="MA-"
                    className="w-full"
                    onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 5); // Allow only numbers
                    }}
                    />
                    <ErrorMessage
                    name="emp_code"
                    component="div"
                    className="text-[#ed1b24] text-sm"
                    />
                </div>

                {/* References Section */}
                <div className="mt-6">
                    {/* {values.references.map((_, index) => ( */}
                    {values.references.map((ref, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4 mb-4">
                        {/* Reference Name */}
                        <div>
                        <label className="font-medium text-[14px] xl:text-[16px] font-['Montserrat',Helvetica] mb-1">
                            {index + 1}. Reference Name <span className="text-[#ed1b24]">*</span>
                        </label>
                        <Field
                            name={`references[${index}].name`}
                            as={Input}
                            placeholder="Enter reference name"
                            className="w-full mt-2"
                            onInput={(e) => {
                                e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, ''); // Allow only letters and spaces
                            }}
                        />
                        <ErrorMessage
                            name={`references[${index}].name`}
                            component="div"
                            className="text-[#ed1b24] text-sm"
                        />
                        </div>

                        {/* Reference Number */}
                        <div>
                        <label className="font-medium text-[14px] xl:text-[16px] font-['Montserrat',Helvetica] mb-1">
                            Contact Number <span className="text-[#ed1b24]">*</span>
                        </label>
                        <Field
                        name={`references[${index}].number`}
                        as={Input}
                        placeholder="Enter reference number"
                        className="w-full mt-2"
                        onInput={(e) => {
                            e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10); // Allow only numbers and limit to 10 digits
                        }}
                        />
                        <ErrorMessage
                        name={`references[${index}].number`}
                        component="div"
                        className="text-[#ed1b24] text-sm"
                        />
                        </div>
                    </div>
                    ))}

                    <ErrorMessage
                        name="references"
                        render={msg =>
                            typeof msg === 'string'
                                ? <div className="text-[#ed1b24] text-sm">{msg}</div>
                                : null
                        }
                    />


                    {/* Add More References Button */}
                    <Button
                    type="button"
                    onClick={() => addReference(setFieldValue, values)}
                    className="w-max text-[#ED1B24] font-bold text-[16px] xl:text-[16px] mt-4 flex items-center justify-end ml-auto"
                    >
                    <span className="text-white bg-[#ED1B24] w-4 h-4 flex items-center justify-center rounded-full">+</span> Add more
                    </Button>
                </div>

                {/* Submit Button */}
                <div className="mt-5">
                    <button
                    type="submit"
                    className="bg-[#ED1B24] text-white font-bold text-[14px] xl:text-[16px] rounded-xl py-2 px-8 font-['Poppins',Helvetica] flex items-center justify-center w-max"
                    disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Reference'}
                    </button>
                </div>
                </Form>
            )}
            </Formik>
        </div>
        </section>
    );
};

export default InternalCampaignForm;