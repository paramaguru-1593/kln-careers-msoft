import React from 'react'
import LocationIcon from '../images/location.svg'
import Logo from '../images/msLogo.png'
import WhatsappIcon from '../images/whatsapp.png'
import MainIcon from '../images/mail.svg'



const Footer = () => {

     // Office location data
  const officeLocations = {
    corporate: {
      title: "Corporate Office",
      addresses: [
        "Ground Floor, VLV Complex New, 41, Anna Salai, Little Mount, Saidapet, Chennai, Tamil Nadu 600015.",
      ],
    },
    branch: {
      title: "Branch Office",
      addresses: [
        "Block-3, 9th Floor, TEMPLE STEPS, 184-187, Anna Salai, Little Mount, Saidapet, Chennai, Tamil Nadu 600015.",
        "24/17, Five Furlong Rd, Guindy, Chennai, Tamil Nadu 600032.",
        "2nd Floor, Shiv Chambers, 247, Alagesan Rd, Saibaba Colony, Coimbatore, Tamil Nadu 641011.",
      ],
    },
  };
  
  return (
    <footer className="">
          <div className="bg-[#44444436] py-12">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Logo and Contact */}
              <div className="space-y-6">
                <img
                  className="w-[180px] h-[60px] object-cover"
                  alt="Marketsof1 Official Logo"
                  src={Logo}
                />
                <div className="flex items-center">
                    <img
                        className="w-[25px] h-[25px] object-cover mr-2"
                        alt="Phone icon"
                        src={WhatsappIcon}
                    />
                  <span className="font-normal text-[#111111] text-base font-['Poppins',Helvetica]">
                  +91 96774 70425
                  </span>
                </div>
                <div className="flex items-center">
                    <img
                        className="w-[25px] h-[25px] object-cover mr-2"
                        alt="Phone icon"
                        src={WhatsappIcon}
                    />
                  <span className="font-normal text-[#111111] text-base font-['Poppins',Helvetica]">
                  +91 98842 27667
                  </span>
                </div>
                <div className="flex items-center">
                  <img
                    className="w-[25px] h-[25px] object-cover mr-2"
                    alt="Email icon"
                    src={MainIcon}
                  />
                  <span className="font-normal text-[#111111] text-base font-['Poppins',Helvetica]">
                  careers@marketsof1.com
                  </span>
                </div>
              </div>

              {/* Office Locations */}
              <div className="md:col-span-2">
                {Object.values(officeLocations).map((office, index) => (
                  <div key={index} className={`${index % 2 == 0 ?  "mb-8": ""}`}>
                    <h4 className="font-semibold text-lg xl:text-xl mb-4 font-['Poppins',Helvetica]">
                      {office.title}
                    </h4>
                    <div className="space-y-4">
                      {office.addresses.map((address, i) => (
                        <div key={i} className="flex">
                          <img
                            className="w-[18px] h-[18px] mt-1 mr-2 object-cover"
                            alt="Pin"
                            src={LocationIcon}
                          />
                          <span className="font-normal text-black text-[14px] xl:text-[16px] font-['Poppins',Helvetica]">
                            {address}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-[#444444] py-4 text-center">
            <p className="font-normal text-white text-[14px] md:text-base font-['Poppins',Helvetica]">
              @2025 Marketsof1 Analytical Marketing Services Pvt Ltd.
            </p>
          </div>
        </footer>
  )
}

export default Footer
