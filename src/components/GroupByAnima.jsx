import React from "react";

export const GroupByAnima = () => {
  const contentItems = [
    {
      question: "Who are we?",
      answer:
        "Marketsof1 uses Analytics and Sales expertise to deliver unimaginable value to customers.",
      questionFont: "font-normal font-montserrat text-xl md:text-xl",
      answerFont: "font-montserrat text-[14px] md:text-[18px] lg:text-[25px] xl:text-[28px] leading-tight",
    },
    {
      question: "Where will you be?",
      answer:
        `As part of our "Super Team" in Chennai, a Ninja warrior group of 50 tele sales Team, within 500 other tele sales people. This Super Team is at the core of organizational performance strategy within Marketsof1. But it is on invite only basis!`,
      questionFont: "font-normal font-poppins text-base md:text-xl",
      answerFont: "font-normal italic font-poppins text-[13px] md:text-[16px] lg:text-[16px] xl:text-[20px] leading-tight md:leading-6 lg:leading-8",
    },
    {
      question: "Who you are right now?",
      answer:
        "Have you sold Credit Cards, Insurance, Loans, Financial Services, Homes or Matrimony for at least 5 years and take home at least Rs.25,000/-?",
      questionFont: "font-normal font-poppins text-base md:text-xl",
      answerFont: "font-normal italic font-poppins text-[13px] md:text-[16px] lg:text-[16px] xl:text-[20px] leading-tight md:leading-6 lg:leading-8",
    },
    {
      question: "Check now:",
      answer:
        "If you want to join this Super Team check your eligibility by filling the form below.",
      questionFont: "font-normal font-poppins text-xl md:text-xl",
      answerFont: "font-montserrat text-[14px] md:text-[18px] lg:text-[25px] xl:text-[28px] leading-tight",
    },
  ];

  return (
    <section className="w-full h-full relative overflow-y-auto flex items-center">
      <div className="w-full h-full relative">
        <div className="h-full w-full absolute inset-0" />
        <div className="relative w-full mx-auto py-4 sm:py-6 md:py-12 px-6 sm:px-8 md:px-16 flex flex-col justify-center">
          {contentItems.map((item, index) => (
            <div
              key={index}
              className={`w-full flex flex-row gap-1 sm:gap-2 md:gap-4 mb-3 sm:mb-4 md:!mb-6 ${
                index === 3 ? "mb-0" : ""
              }`}
            >
              <div
                className={`w-full md:w-[247px] text-white ${item.questionFont}`}
              >
                {item.question}
              </div>
              <div
                className={`md:ml-20 lg:ml-40 w-full text-white ${item.answerFont}`}
              >
                {item.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};