import React, { useEffect, useState } from 'react';
import { Button, Input, message, Select } from 'antd';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { GET, POST } from '../../api/api_helpers';
import Images from '../../images/images';
import SuccessPopup from '../popups/SuccessPopup';

const InternalCampaignForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [locations, setLocations] = useState([]); // State to store locations
    const [hrList, setHrList] = useState([]); // State to store locations

    const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    emp_code: Yup.string().required('Employee ID is required'),
    jobLocation: Yup.string().required('Job location is required'),
    locationBasedHr: Yup.string()
            .required('HR is required'),
    references: Yup.array()
        .of(
        Yup.object().shape({
            name: Yup.string().required('Reference name is required'),
            // number: Yup.string()
            // .required('Reference number is required')
            // .matches(/^[0-9]{10}$/, 'Reference number must be exactly 10 digits'), // Ensure exactly 10 digits
            number: Yup.string()
                    .required('Reference number is required')
                    .matches(/^\d{10}$/, 'Reference number must be 10 digits')
                    .matches(/^[6-9]/, 'Please Enter Valid Reference number.'),
            language: Yup.string().required('Language is required'),
        })
        )
        .test(
        'at-least-one-reference',
        'At least one reference is required',
        (references) => Array.isArray(references) && references.some((ref) => ref.name && ref.number && ref.language)
        ),
    });

    const handleSubmit = async (values, {resetForm}) => {
        setIsSubmitting(true);

        const validReferences = values.references.filter((ref) => ref.name || ref?.number || ref?.language);

        const refNames = validReferences.map((ref) => ref.name);
        const refNumbers = validReferences.map((ref) => ref.number);
        const refLanguage = validReferences.map((ref) => ref.language);

        const payload = {
            name: values.name,
            emp_code: values.emp_code,
            location: values.jobLocation,
            user_id: values.locationBasedHr === 'any' ? null : values.locationBasedHr,
            ref_name: refNames,
            ref_number: refNumbers,
            ref_language: refLanguage
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
    const updatedReferences = [...values.references, { name: '', number: '', language: '' }];
    setFieldValue('references', updatedReferences);
    };

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await GET('getLocation'); // Replace with the correct endpoint
                
                if (response?.data?.status === 200) {
                    setLocations(response?.data?.locations.map((loc) => ({ value: loc, label: loc })));
                } else {
                    message.error('Failed to fetch locations.');
                }
            } catch (error) {
                console.error('Error fetching locations:', error);
                message.error('Failed to fetch locations.');
            }
        };

        fetchLocations();
    }, []);

    const fetchHrListBasedOnLocation = async (location) => {
        try {
            const response = await POST('getAvailableHrBasedOnLocation', { location }); // Use POST instead of GET
            console.log(response?.data, 'HR list response');

            if (response?.data?.status === 200) {
                const hrList = response?.data?.data || [];
                // setHrList(hrList.map((hr) => ({ value: hr?.id, label: hr?.name })));
                const updatedHrList = [
                { value: 'any', label: 'Any recruiter' },
                ...hrList.map((hr) => ({ value: hr?.id, label: hr?.name })),
                ];
                setHrList(updatedHrList);
                console.log(updatedHrList,'fkopkosfos');
                
            } else {
                message.error('Failed to fetch HR list for the selected location.');
            }
        } catch (error) {
            console.error('Error fetching HR list:', error);
            message.error('Failed to fetch HR list for the selected location.');
        }
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
                jobLocation: '',
                locationBasedHr: '',
                references: [{ name: '', number: '', language: '' }], // Start with one reference
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
                        let text = e.target.value ?? "";
                        // Step 1: Clean the input
                        text = text
                            .trimStart()
                            .replace(/[^a-zA-Z .]/g, "")   // Only letters, space, dot
                            .replace(/  +/g, " ");         // Replace multiple spaces with single space

                        // Step 2: Capitalize first letter of each word
                        let splitStr = text.toLowerCase().split(" ");
                        for (let i = 0; i < splitStr.length; i++) {
                            splitStr[i] =
                            splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
                        }
                        text = splitStr.join(" ");

                        // Optional: Limit to one dot
                        if ((text.split(".").length - 1) > 1) return;

                        // Update the input value
                        e.target.value = text;
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

                {/* Job Location Field */}
                <div className="space-y-2 mt-4">
                  <label className="font-medium text-[14px] xl:text-[16px] font-['Montserrat',Helvetica] mb-1">
                    Job Location <span className="text-[#ed1b24]">*</span>
                  </label>
                  <Field name="jobLocation">
                    {({ field, form }) => (
                      <Select
                        {...field}
                        className="w-full"
                        onChange={(value) => {
                            form.setFieldValue('jobLocation', value)
                            form.setFieldValue('locationBasedHr', '')
                            setHrList([])
                            fetchHrListBasedOnLocation(value);
                        }}
                        value={field.value || undefined}
                        // options={[
                        //   { value: 'Chennai', label: 'Chennai' },
                        //   { value: 'Coimbatore', label: 'Coimbatore' },
                        // ]}
                        options={locations}
                        placeholder="Select Job Location"
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="jobLocation"
                    component="div"
                    className="text-[#ed1b24] text-sm"
                  />
                </div>

                {/* Location based hr Field */}
                <div className="space-y-2 mt-4">
                  <label className="font-medium text-[14px] xl:text-[16px] font-['Montserrat',Helvetica] mb-1">
                    Recruiter name <span className="text-[#ed1b24]">*</span>
                  </label>
                  <Field name="locationBasedHr">
                    {({ field, form }) => (
                    <Select
                        {...field}
                        className="w-full"
                        onChange={(value) => {
                            form.setFieldValue("locationBasedHr", value);
                        }}
                        value={hrList.some(hr => hr.value === field.value) ? field.value : ""} // ensure valid value
                        placeholder="Select HR"
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                        //   dropdownClassName="custom-dropdown"
                        dropdownMatchSelectWidth={false}
                        >
                        {/* <Option key="any" value="any">
                            Any recruiter
                        </Option> */}
                        {hrList.map((hr, index) => (
                        <Option key={`${hr?.value}-${index}`} value={hr.value}>
                            {hr.label}
                            </Option>
                        ))}
                    </Select>


                    )}
                  </Field>
                  <ErrorMessage
                    name="locationBasedHr"
                    component="div"
                    className="text-[#ed1b24] text-sm"
                  />
                </div>

                {/* References Section */}
                <div className="mt-4">
                    {/* {values.references.map((_, index) => ( */}
                    {values.references.map((ref, index) => (
                    <div key={index} className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
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
                                let text = e.target.value ?? "";
                                // Step 1: Clean the input
                                text = text
                                    .trimStart()
                                    .replace(/[^a-zA-Z .]/g, "")   // Only letters, space, dot
                                    .replace(/  +/g, " ");         // Replace multiple spaces with single space

                                // Step 2: Capitalize first letter of each word
                                let splitStr = text.toLowerCase().split(" ");
                                for (let i = 0; i < splitStr.length; i++) {
                                    splitStr[i] =
                                    splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
                                }
                                text = splitStr.join(" ");

                                // Optional: Limit to one dot
                                if ((text.split(".").length - 1) > 1) return;

                                // Update the input value
                                e.target.value = text;
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

                        {/* Reference Language */}
                        <div>
                        <label className="font-medium text-[14px] xl:text-[16px] font-['Montserrat',Helvetica] mb-1">
                            Language <span className="text-[#ed1b24]">*</span>
                        </label>
                        <Field name={`references[${index}].language`}>
                            {({ field, form }) => (
                            <Select
                                {...field}
                                className="w-full mt-2"
                                onChange={(value) => form.setFieldValue(`references[${index}].language`, value)}
                                value={field.value || undefined}
                                options={[
                                { value: "Kannada", label: "Kannada" },
                                { value: "Malayalam", label: "Malayalam" },
                                { value: "Tamil", label: "Tamil" },
                                { value: "Telugu", label: "Telugu" },
                                ]}
                                placeholder="Select Language"
                            />
                            )}
                        </Field>
                        <ErrorMessage
                            name={`references[${index}].language`}
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