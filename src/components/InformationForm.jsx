import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, message, Select } from 'antd';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { POST } from '../api/api_helpers';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import SuccessPopup from './popups/SuccessPopup';

const InformationForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const fileInputRef = useRef(null);

  const handleFileClick = () => {
    fileInputRef.current.click();
  };
  

  const handleFileChange = (e, setFieldValue) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      message.error('File size should not exceed 5MB');
      return;
    }

    // Check file type
    if (
      !file.type.match('image.*') &&
      file.type !== 'application/pdf' &&
      file.type !== 'application/msword' &&
      file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      message.error('Only images, PDF, and document files (DOC, DOCX) are allowed');
      return;
    }

    const fileUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setFieldValue('resume', file);
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, 'Contact number must be 10 digits')
      .required('Contact number is required'),
    education: Yup.string().required('Education is required'),
    experience: Yup.string().required('Experience is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    language: Yup.string().required('Language is required'),
  });

  const handleSubmit = async (values) => {
    setIsSubmitting(true)
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('mobile_number', values.phone);
    formData.append('resume', selectedFile);
    formData.append('city', values.city);
    formData.append('state', values.state);
    formData.append('education', values.education);
    formData.append('year_of_exp', values.experience);
    formData.append('language', values.language);
    formData.append('utm_source', searchParams.get('utm_source'))
    formData.append('utm_medium', searchParams.get('utm_medium'))
    formData.append('utm_campaign', searchParams.get('utm_campaign'))

    try {
      const response = await POST('registerApplicant', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('API Response:', response.data);
      if (response?.data?.message === "Registration successful") {
        document.querySelector('form').reset();
        setSelectedFile(null);
        setShowSuccessPopup(true);
        // message.success('Your Application Submitted Successfully, Please wait for a call from our Team.');
        setError("")
      } else if (response?.data?.message === "An error occurred") {
        if(response?.data?.error == "Mobile number already exists."){
          message.error(response?.data?.error);
          setFieldError('phone', 'Mobile number already exists.');
        }else{
          message.error(response?.data?.error);
        }
      } else {
        message.error('Failed to submit the application. Please try again.');
      }
      setIsSubmitting(false)
    } catch (error) {
      setIsSubmitting(false)
      console.error('API Error:', error);
      message.error('Failed to submit the application. Please try again.');
    }
  };

  return (
    <section className="w-full bg-[#ffcdcd36] py-4 sm:py-10 pr-4 lg:pr-12">

      {/* Success Popup */}
      {showSuccessPopup && (
        <SuccessPopup 
        visible={showSuccessPopup} 
        onClose={()=>{
          setShowSuccessPopup(false);
        }}
        />
      )}
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-5 xl:mb-8">
          <h2 className="text-[22px] lg:text-[25px] xl:text-[28px] font-semibold text-center">
            Check your{' '}
            <span className="font-bold text-[#ed1b24]">Eligibility</span> to
            Apply
          </h2>
          <p className="text-[16px] xl:text-[18px] font-normal italic mt-2 text-black font-['Poppins',Helvetica] max-w-lg mx-auto">
            Don't worry, we'll keep your info 100% safe and only use it to
            contact you about the job.
          </p>
        </div>

        {/* Form */}
        <Formik
          initialValues={{
            name: '',
            phone: '',
            education: '',
            experience: '',
            city: '',
            state: '',
            resume: null,
            language: '', 
          }}
          validationSchema={validationSchema}
          onSubmit={(values)=>{
            handleSubmit(values)
          }}
        >
          {({ setFieldValue }) => (
            <Form className="mx-4 md:mx-8">
              {/* Personal Information Section */}
              <h3 className="text-[18px] font-semibold mb-3 xl:mb-6 font-['Poppins',Helvetica]">
                Personal Information
              </h3>

              <div className="space-y-3 xl:space-y-5">
                {[
                  { id: 'name', label: 'Name', placeholder: 'Name as per Aadhar', allowOnlyLetters: true },
                  { id: 'phone', label: 'Contact Number', placeholder: 'Enter your Contact Number', allowOnlyNumbers: true },
                  { id: 'education', label: 'Education', placeholder: 'Diploma, Graduate, Post Graduate, Others', allowOnlyLetters: true },
                ].map((field) => (
                  <div key={field.id} className="space-y-2">
                    <label className="font-medium text-[14px] xl:text-[16px] font-['Montserrat',Helvetica] mb-1">
                      {field.label} <span className="text-[#ed1b24]">*</span>
                    </label>
                    <Field
                      name={field.id}
                      as={Input}
                      placeholder={field.placeholder}
                      className="w-full"
                      onInput={(e) => {
                        if (field.id === 'education') {
                          e.target.value = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '');
                        }
                        if (field.allowOnlyLetters) {
                          e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, ''); // Allow only letters and spaces
                        }
                        if (field.allowOnlyNumbers) {
                          e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10); // Allow only numbers
                        }
                      }}
                    />
                    <ErrorMessage
                      name={field.id}
                      component="div"
                      className="text-[#ed1b24] text-sm"
                    />
                  </div>
                ))}

                {/* Language Field */}
                <div className="space-y-2">
                  <label className="font-medium text-[14px] xl:text-[16px] font-['Montserrat',Helvetica] mb-1">
                    Language <span className="text-[#ed1b24]">*</span>
                  </label>
                  <div className="relative">
                    <Field name="language">
                      {({ field, form }) => (
                        <Select
                          {...field}
                          className="w-full"
                          onChange={(value) => form.setFieldValue("language", value)}
                          value={field.value || undefined}
                          options={[
                            { value: "Malayalam", label: "Malayalam" },
                            { value: "Telugu", label: "Telugu" },
                            { value: "Kannada", label: "Kannada" },
                            { value: "Tamil", label: "Tamil", disabled: true },
                          ]}
                          placeholder="Open position Malayalam, Telugu, Kannada"
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="language"
                      component="div"
                      className="text-[#ed1b24] text-sm"
                    />
                  </div>
                </div>

                {[
                  { id: 'experience', label: 'Years of Experience in sales', placeholder: '5 Yrs, 5-10 Yrs, 10+ Yrs of Experience', allowOnlyNumbers: true },
                  { id: 'city', label: 'City', placeholder: 'Enter your city', allowOnlyLetters: true },
                  { id: 'state', label: 'State', placeholder: 'Enter your state', allowOnlyLetters: true },
                ].map((field) => (
                  <div key={field.id} className="space-y-2">
                    <label className="font-medium text-[14px] xl:text-[16px] font-['Montserrat',Helvetica] mb-1">
                      {field.label} <span className="text-[#ed1b24]">*</span>
                    </label>
                    <Field
                      name={field.id}
                      as={Input}
                      placeholder={field.placeholder}
                      className="w-full"
                      onInput={(e) => {
                        if (field.allowOnlyLetters) {
                          e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, ''); // Allow only letters and spaces
                        }
                        if (field.allowOnlyNumbers) {
                          e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10); // Allow only numbers
                        }
                      }}
                    />
                    <ErrorMessage
                      name={field.id}
                      component="div"
                      className="text-[#ed1b24] text-sm"
                    />
                  </div>
                ))}
              </div>

              {/* Employment Information Section */}
              <h3 className="text-[14px] xl:text-[16px] font-medium mt-5 mb-2 font-['Poppins',Helvetica]">
                Employment Information/Upload Resume{' '}
                <span className="text-[#ed1b24]">*</span>
              </h3>
              <div className="">
                <div className="flex items-center gap-5">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(event) => handleFileChange(event, setFieldValue)}
                    accept="image/*,.pdf,.doc,.docx"
                    className="hidden"
                  />
                  <button
                    onClick={handleFileClick}
                    type='button'
                    className="bg-[#D7D7D7] text-[#2D2D2D] font-bold text-[14px] rounded py-2 px-6 font-['Poppins',Helvetica] cursor-pointer"
                  >
                    Choose File
                  </button>
                  {selectedFile ? (
                    <p className="text-sm text-[#646464]">
                      Selected file: {selectedFile.name}
                    </p>
                  ) : (
                    <p className="text-sm text-[#646464]">No file chosen</p>
                  )}
                </div>
                <ErrorMessage
                  name="resume"
                  component="div"
                  className="text-[#ed1b24] text-sm mt-2"
                />
                <p className="text-[14px] font-medium text-[#636363] font-['Montserrat',Helvetica] mt-2">
                  Allowed file type DOC or PDF, Max file size 5MB
                </p>
              </div>

              {error && 
                <p className='text-[16px] text-[red] mt-2'>{error}</p>
              }

              <div className="mt-5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#ED1B24] text-white font-bold text-[14px] xl:text-[16px] rounded-xl py-2 px-8 font-['Poppins',Helvetica]"
                >
                  {isSubmitting ? "Submit Application..." : "Submit Application"}
                </button>
                <p className="mt-4 text-[14px] lg:text-[16px] font-normal italic text-black font-['Poppins',Helvetica]">
                  We have received many resumes. Please wait for a call from our
                  team
                </p>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
};

export default InformationForm;
