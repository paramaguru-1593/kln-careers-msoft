import React, { useRef, useState } from 'react';
import { Button, Input, message, Select, DatePicker, TimePicker } from 'antd';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import SuccessPopup from '../popups/SuccessPopup';
import { Clock } from 'lucide-react';
import dayjs from 'dayjs';
import { POST } from '../../api/api_helpers';
import { useSearchParams } from 'react-router-dom';

const ExternalCampaignForm = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false)
    const fileInputRef = useRef(null);
    const [searchParams, setSearchParams] = useSearchParams()


    const todayISO = dayjs().format("YYYY-MM-DD");
    const now = dayjs();

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e, setFieldValue) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      message.error('File size should not exceed 5MB');
      return;
    }

    if (
      !file.type.match('image.*') &&
      file.type !== 'application/pdf' &&
      file.type !== 'application/msword' &&
      file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      message.error('Only images, PDF, and document files (DOC, DOCX) are allowed');
      return;
    }

    setSelectedFile(file);
    setFieldValue('resume', file);
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    phone: Yup.string()
        .matches(/^[0-9]{10}$/, 'Contact number must be 10 digits')
        .required('Contact number is required'),
    jobLocation: Yup.string().required('Job location is required'),
    language: Yup.string().required('Language is required'),
    preferredDate: Yup.string().required('Preferred date is required'),
    preferredTime: Yup.string().required('Preferred time is required'),
  });

    const handleSubmit = async (values) => {
        setIsSubmitting(true);
        console.log('Form Values:', selectedFile);
        

        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('mobile_number', values.phone);
        formData.append('location', values.jobLocation);
        formData.append('language', values.language);
        formData.append('preferrable_dttm', `${values.preferredDate} ${values.preferredTime}`);
        if (selectedFile) {
            formData.append('resume', selectedFile);
        }        
        formData.append('utm_source', searchParams.get('utm_source'))
        formData.append('utm_medium', searchParams.get('utm_medium'))
        formData.append('utm_campaign', searchParams.get('utm_campaign'))

        try {
            const response = await POST('externalCampaignApplicant', formData , {
                headers: {
                'Content-Type': 'multipart/form-data',
                },
            });

            console.log('API Response:', response.data);

            if (response?.data?.message === 'Registration successful') {
            document.querySelector('form').reset();
            setSelectedFile(null);
            setShowSuccessPopup(true);
            } else if (response?.data?.message === 'An error occurred') {
            if (response?.data?.error === 'Mobile number already exists.') {
                message.error(response?.data?.error);
            } else {
                message.error(response?.data?.error);
            }
            } else {
            message.error('Failed to submit the application. Please try again.');
            }

            setIsSubmitting(false);
        } catch (error) {
            setIsSubmitting(false);
            console.error('API Error:', error);
            message.error('Failed to submit the application. Please try again.');
        }
    };


  
    const generateTimeSlots = (isToday) => {
    const start = dayjs().hour(9).minute(30);
    const end = dayjs().hour(19).minute(0);
    const now = dayjs();

    let times = [];
    let current = start;

    while (current.isBefore(end) || current.isSame(end)) {
        if (!isToday || current.isAfter(now)) {
        times.push(current.format("HH:mm"));
        }
        current = current.add(30, "minute"); // increment by 30 mins
    }
    return times;
    };



// const generateTimeSlots = (isToday) => {
//   const start = dayjs().hour(9).minute(30);
//   const end = dayjs().hour(19).minute(0);
//   const now = dayjs();

//   let times = [];
//   let current = start;

//   while (current.isBefore(end) || current.isSame(end)) {
//     if (!isToday || current.isAfter(now)) {
//       times.push(current.format("HH:mm"));
//     }
//     current = current.add(30, "minute"); // increment by 30 mins
//   }
//   return times;
// };
  return (
    <section className="w-full bg-[#ffcdcd36] py-4 sm:py-10 pr-4 lg:pr-12">
      {showSuccessPopup && (
        <SuccessPopup
          visible={showSuccessPopup}
          onClose={() => setShowSuccessPopup(false)}
        />
      )}
      <div className="container mx-auto px-4">
        <div className="text-center mb-5 xl:mb-8">
          <h2 className="text-[22px] lg:text-[25px] xl:text-[28px] font-semibold text-center">
            <span className="block">Fill out your details to</span>
            <span className="font-bold text-[#ed1b24]">Reach you back</span>
          </h2>
          <p className="text-[16px] xl:text-[18px] font-normal italic mt-2 text-black font-['Poppins',Helvetica] max-w-lg mx-auto">
            Don't worry, we'll keep your info 100% safe and only use it to
            contact you about the job.
          </p>
        </div>

        <Formik
          initialValues={{
            name: '',
            phone: '',
            jobLocation: '',
            language: '',
            preferredDate: '',
            preferredTime: '',
            resume: null,
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
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
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="font-medium text-[14px] xl:text-[16px] font-['Montserrat',Helvetica] mb-1">
                    Name <span className="text-[#ed1b24]">*</span>
                  </label>
                  <Field
                    name="name"
                    as={Input}
                    placeholder="Name as per Aadhar"
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

                {/* Contact Number Field */}
                <div className="space-y-2">
                  <label className="font-medium text-[14px] xl:text-[16px] font-['Montserrat',Helvetica] mb-1">
                    Contact Number <span className="text-[#ed1b24]">*</span>
                  </label>
                  <Field
                    name="phone"
                    as={Input}
                    placeholder="Enter your Contact Number"
                    className="w-full"
                    onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10); // Allow only numbers
                    }}
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-[#ed1b24] text-sm"
                  />
                </div>

                {/* Job Location Field */}
                <div className="space-y-2">
                  <label className="font-medium text-[14px] xl:text-[16px] font-['Montserrat',Helvetica] mb-1">
                    Job Location <span className="text-[#ed1b24]">*</span>
                  </label>
                  <Field name="jobLocation">
                    {({ field, form }) => (
                      <Select
                        {...field}
                        className="w-full"
                        onChange={(value) => form.setFieldValue('jobLocation', value)}
                        value={field.value || undefined}
                        options={[
                          { value: 'Chennai', label: 'Chennai' },
                          { value: 'Coimbatore', label: 'Coimbatore' },
                        ]}
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

                {/* Language Field */}
                <div className="space-y-2">
                  <label className="font-medium text-[14px] xl:text-[16px] font-['Montserrat',Helvetica] mb-1">
                    Language <span className="text-[#ed1b24]">*</span>
                  </label>
                  <Field name="language">
                    {({ field, form }) => (
                      <Select
                        {...field}
                        className="w-full"
                        onChange={(value) => form.setFieldValue('language', value)}
                        value={field.value || undefined}
                        options={[
                          { value: 'Malayalam', label: 'Malayalam' },
                          { value: 'Telugu', label: 'Telugu' },
                          { value: 'Kannada', label: 'Kannada' },
                          { value: 'Tamil', label: 'Tamil' },
                        ]}
                        placeholder="Select Language"
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="language"
                    component="div"
                    className="text-[#ed1b24] text-sm"
                  />
                </div>

                {/* Preferred Time to Reach */}
                <div className="space-y-2">
                  <label className="font-medium text-[14px] xl:text-[16px] font-['Montserrat',Helvetica] mb-1">
                    Preferrable Time to Reach <span className="text-[#ed1b24]">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <Field name="preferredDate">
                    {({ field, form }) => (
                        <DatePicker
                        autoclear={false}
                        value={field.value ? dayjs(field.value, "YYYY-MM-DD") : null}
                        format="DD-MM-YYYY"
                        disabledDate={(current) => {
                            // Disable Sundays and previous dates
                            return current && (current.day() === 0 || current.isBefore(dayjs().startOf("day")));
                        }}
                        onChange={(date, dateString) => {
                            const isoDate = dayjs(date).format("YYYY-MM-DD"); // Format as YYYY-MM-DD
                            form.setFieldValue("preferredDate", isoDate);

                            // Update preferrable_dttm if time is already selected
                            const time = form.values.preferredTime || "09:30:00.000";
                            const merged = `${isoDate} ${time}`;
                            form.setFieldValue("preferredDateTime", merged);
                        }}
                        className="w-full border border-gray-300 !rounded-[5px] px-3 py-2 focus:ring-2 focus:ring-[#6c54c3] h-10"
                        placeholder="Select a date"
                        />
                    )}
                    </Field>

                    {/* <Field name="preferredTime">
                    {({ field, form }) => {
                        const isToday =
                        form.values.preferredDate === dayjs().format("DD-MM-YYYY");

                        // Use 24-hour values for min/max to work correctly in <input type="time">
                        let minTime = "09:30";
                        let maxTime = "19:00";

                        if (isToday) {
                        const currentTime = dayjs().format("HH:mm");
                        if (currentTime > minTime && currentTime < maxTime) {
                            minTime = currentTime;
                        }
                        }

                        // This is only for displaying/formatting in AM/PM
                        const formatToAmPm = (time) => {
                        return dayjs(time, "HH:mm").format("hh:mm A");
                        };

                        return (
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Clock className="h-5 w-5 text-gray-400" />
                            </div>

                            <input
                            type="time"
                            value={field.value ? dayjs(field.value, "hh:mm A").format("HH:mm") : ""}
                            min={minTime}
                            max={maxTime}
                            step="60"
                            onChange={(e) => {
                                const rawTime = e.target.value; // 24-hour format from input
                                const amPmTime = formatToAmPm(rawTime); // convert to 12-hour for form value

                                form.setFieldValue("preferredTime", amPmTime);

                                const isoDate = dayjs(
                                form.values.preferredDate,
                                "DD-MM-YYYY"
                                ).format("YYYY-MM-DD");

                                const merged = `${isoDate} ${rawTime}:00.000`; // store 24-hour for backend
                                form.setFieldValue("preferredDateTime", merged);
                            }}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm
                                focus:ring-2 focus:ring-[#6c54c3] focus:border-[#6c54c3]"
                            />
                        </div>
                        );
                    }}
                    </Field> */}

                    {/* <Field name="preferredTime">
                    {({ field, form }) => {
                        // Disable hours outside 9 AM - 7 PM
                        const disabledHours = () => {
                        const hours = [];
                        for (let i = 0; i < 24; i++) {
                            if (i < 9 || i > 19) {
                            hours.push(i);
                            }
                        }
                        return hours;
                        };

                        // Disable minutes for specific hours
                        const disabledMinutes = (hour) => {
                        if (hour === 9) {
                            return Array.from({ length: 30 }, (_, i) => i); // Before 09:30
                        }
                        if (hour === 19) {
                            return Array.from({ length: 60 }, (_, i) => i > 0); // After 07:00 PM
                        }
                        return [];
                        };

                        return (
                        <TimePicker
                            format="hh:mm A"
                            use12Hours
                            value={field.value ? dayjs(field.value, "hh:mm A") : null}
                            onChange={(time) => {
                            if (!time) {
                                form.setFieldValue("preferredTime", "");
                                form.setFieldValue("preferredDateTime", "");
                                return;
                            }

                            // UI value in AM/PM
                            const timeString = dayjs(time).format("hh:mm A");

                            // Backend value with seconds & milliseconds
                            const timeWithSeconds = dayjs(time).format("HH:mm:ss.000");

                            form.setFieldValue("preferredTime", timeString);

                            const isoDate = dayjs(form.values.preferredDate, "DD-MM-YYYY")
                                .format("YYYY-MM-DD");

                            form.setFieldValue(
                                "preferredDateTime",
                                `${isoDate} ${timeWithSeconds}`
                            );
                            }}
                            disabledHours={disabledHours}
                            disabledMinutes={disabledMinutes}
                            minuteStep={1}
                            className="w-full py-2 border border-gray-300 rounded-[5px] shadow-sm focus:ring-2 focus:ring-[#6c54c3] focus:border-[#6c54c3]"
                            placeholder="Select a time"
                        />
                        );
                    }}
                    </Field> */}
                    {/* <Field name="preferredTime">
                    {({ field, form }) => {
                        const isToday =
                        form.values.preferredDate === dayjs().format("DD-MM-YYYY");

                        // Use 24-hour values for min/max to work correctly in <input type="time">
                        let minTime = "09:30";
                        let maxTime = "19:00";

                        if (isToday) {
                        const currentTime = dayjs().format("HH:mm");
                        if (currentTime > minTime && currentTime < maxTime) {
                            minTime = currentTime;
                        }
                        }

                        // This is only for displaying/formatting in AM/PM
                        const formatToAmPm = (time) => {
                        return dayjs(time, "HH:mm").format("hh:mm A");
                        };

                        return (
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Clock className="h-5 w-5 text-gray-400" />
                            </div>

                            <input
                            type="time"
                            value={field.value ? dayjs(field.value, "hh:mm A").format("HH:mm") : ""}
                            min={minTime}
                            max={maxTime}
                            step="60"
                            onChange={(e) => {
                                const rawTime = e.target.value; // 24-hour format from input
                                const amPmTime = formatToAmPm(rawTime); // convert to 12-hour for form value

                                form.setFieldValue("preferredTime", amPmTime);

                                const isoDate = dayjs(
                                form.values.preferredDate,
                                "DD-MM-YYYY"
                                ).format("YYYY-MM-DD");

                                const merged = `${isoDate} ${rawTime}:00.000`; // store 24-hour for backend
                                form.setFieldValue("preferredDateTime", merged);
                            }}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm
                                focus:ring-2 focus:ring-[#6c54c3] focus:border-[#6c54c3]"
                            />
                        </div>
                        );
                    }}
                    </Field> */}
                    <Field name="preferredTime">
                    {({ field, form }) => {
                        const isToday =
                        form.values.preferredDate === dayjs().format("DD-MM-YYYY");

                        const timeSlots = generateTimeSlots(isToday);

                        return (
                        <div className="relative">
                            <Select
                            value={field.value || undefined}
                            onChange={(value) => {
                                form.setFieldValue("preferredTime", value);

                                const isoDate = dayjs(
                                form.values.preferredDate,
                                "DD-MM-YYYY"
                                ).format("YYYY-MM-DD");

                                const merged = `${isoDate} ${value}:00.000`;
                                form.setFieldValue("preferredDateTime", merged);
                            }}
                            className="w-full rounded-md shadow-sm focus:ring-2 focus:ring-[#6c54c3] focus:border-[#6c54c3] h-10"
                            placeholder="Select Time"
                            options={timeSlots.map((time) => ({
                                value: time,
                                label: dayjs(time, "HH:mm").format("hh:mm A"),
                            }))}
                            suffixIcon={<Clock className="h-4 w-4 text-gray-300" />} // Clock icon as the dropdown icon
                            />
                        </div>
                        );
                    }}
                    </Field>




                  </div>
                  <ErrorMessage
                    name="preferredDate"
                    component="div"
                    className="text-[#ed1b24] text-sm"
                  />
                  <ErrorMessage
                    name="preferredTime"
                    component="div"
                    className="text-[#ed1b24] text-sm"
                  />
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

                {/* {error && 
                <p className='text-[16px] text-[red] mt-2'>{error}</p>
                } */}
              </div>

              <div className="mt-5">
                <button
                  type="submit"
                  className="bg-[#ED1B24] text-white font-bold text-[14px] xl:text-[16px] rounded-xl py-2 px-8 font-['Poppins',Helvetica]"
                >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
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

export default ExternalCampaignForm;