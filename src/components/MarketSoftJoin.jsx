import React from "react";
import Images from "../images/images";
import Logo from '../images/msLogo.png'

export const MarketSoftJoin = ({ isFrom }) => {
  const benefitItems = [
    {
      id: 1,
      title: "Great Work Environment",
      icon: Images.GreatWork,
      alt: "Culture",
    },
    {
      id: 2,
      title: "Career Growth",
      icon: Images.CareerGrowth,
      alt: "Success",
    },
    {
      id: 3,
      title: "On Time Salary",
      icon: Images.Calendar,
      alt: "Calendar",
    },
    {
      id: 4,
      title: `Medical Benefits - ESI & Insurance`,
      icon: Images.Protection,
      alt: "Performance",
    },
    {
      id: 5,
      title: "Earn through Referral Bonus",
      icon: Images.Delegation,
      alt: "Job promotion",
    },
    {
      id: 6,
      title: "Rewards & Recognitions",
      icon: Images.Trophy,
      alt: "Benefit",
    },
    {
      id: 7,
      title: "Appraisals & Promotions",
      icon: Images.AppraisalPerformance,
      alt: "Protection",
    },
    {
      id: 8,
      title: "Internal Job Promotion (IJP)",
      icon: Images.JobPromotion,
      alt: "Delegation",
    },
    {
      id: 9,
      title: "Additional Incentives",
      icon: Images.Benefit,
      alt: "Trophy",
    },
    {
      id: 10,
      title: "Spot Cash Awards",
      icon: Images.CashAward,
      alt: "Payment method",
    },
    {
      id: 11,
      title: "Easy to Access Office Location",
      icon: Images.LocationRed,
      alt: "Location",
    },
    {
      id: 12,
      title: "Fun activities",
      icon: Images.FunActivity,
      alt: "Group",
    },
  ];

  return (
    <section className="w-full mx-auto py-8 sm:py-10 px-4 sm:px-8 md:px-12">
      {isFrom === 'campaignPage' &&
      <img src={Logo} alt="Logo" className="w-[10rem] h-[4rem] object-contain mx-auto mb-4" />
    }

      <div className="flex flex-col items-center mb-8 sm:mb-12">
        <h2 className="text-[22px] lg:text-[25px] xl:text-[28px] font-semibold text-center">
          <span className="font-medium text-black">Why </span>
          <span className="font-bold text-[#ed1b24]">Join Marketsof</span>
          <span className="font-arimo font-bold text-[#ed1b24]">1</span>
          <span className="font-medium text-[#ed1b24]">&nbsp;</span>
          <span className="font-bold text-[#ed1b24]">?</span>
        </h2>
        <p className="text-[16px] xl:text-[18px] font-normal italic mt-2 text-black font-['Poppins',Helvetica]">
          Real growth. Real rewards. Real support.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-x-4 md:gap-y-5 lg:gap-y-6 xl:gap-y-10 2xl:gap-y-8">
        {benefitItems.map((item) => (
          <div key={item.id} className="border-none shadow-none">
            <div className="flex flex-col items-center p-4">
              <div className="mb-4 flex justify-center">
                <img
                  className="w-[2.6rem] h-[2.6rem] md:w-[3rem] md:h-[3rem] xl:w-[3.3rem] xl:h-[3.3rem] object-cover"
                  alt={item.alt}
                  src={item.icon}
                />
              </div>
              <p className="font-poppins font-normal text-black text-[14px] md:text-[16px] xl:text-[18px] 2xl:text-[20px] text-center">
                {item.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};