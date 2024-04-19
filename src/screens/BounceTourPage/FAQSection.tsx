import * as React from "react";
import { useState } from "react";

export default function FAQSection() {
  const [questionAnswers, setQuestionAnswers] = useState([
    {
      question: "Is DUPR or UTR-P required to participate?",
      answer:
        "Yes, you can try us for free for 30 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.",
      isClicked: false,
    },
    {
      question: "Do matches count towards my DUPR rating??",
      answer:
        "Yes, you can try us for free for 30 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.",
      isClicked: false,
    },
    {
      question: "How do I qualify for the Tour Final?",
      answer:
        "Yes, you can try us for free for 30 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.",
      isClicked: false,
    },
    {
      question: "Can I sign up for multiple events?",
      answer:
        "Yes, you can try us for free for 30 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.",
      isClicked: false,
    },
  ]);

  const handleClick = (index: number) => {
    const updatedQuestions = [...questionAnswers];
    updatedQuestions[index].isClicked = !updatedQuestions[index].isClicked;
    setQuestionAnswers(updatedQuestions);
  };

  return (
    <div className="bg-brand-gray-1000 p-8 md:p-20">
      <div className="flex-col flex md:flex-row justify-around">
        <div className="flex flex-col gap-2">
          <div className="md:flex">
            <h2 className="hidden md:block text-5xl text-color-text-darkmode-primary italic inline-block mr-4">
              Tour
            </h2>
            <h2 className="hidden md:block text-5xl text-color-text-darkmode-primary italic font-bold inline-block">
              questions
            </h2>
          </div>
          <div>
            <h3 className="text-5xl text-color-text-darkmode-primary italic inline-block mr-4 md:hidden">
              Frequently
            </h3>
            <h3 className="text-5xl text-color-text-darkmode-primary italic font-bold inline-block md:hidden">
              asked question
            </h3>
          </div>
          <h3 className="mb-6 md:mb-0 text-brand-gray-500">
            Everything you need to know about the tour
          </h3>
        </div>
        <div className="md:w-1/2 md:flex flex-col gap-5 w-full">
          {questionAnswers.map((qa, index) => (
            <div key={index} className="p-4 rounded-md w-full bg-brand-gray-900">
              <div className="flex justify-between items-center">
                {" "}
                <p className="text-white text-lg font-medium w-3/4">
                  {" "}
                  {qa.question}
                </p>
                <button
                  onClick={() => handleClick(index)}
                  className="w-5 h-5 border-none focus:outline-none"
                >
                  <img
                    src="/images/tour-page/Arrow-up.png"
                    className={`w-full h-full transform ${
                      qa.isClicked ? "rotate-0" : "rotate-180"
                    }`}
                    alt="Arrow Icon"
                  />
                </button>
              </div>
              {qa.isClicked && (
                <div className="w-3/4 mt-2">
                  <p className="text-sm text-brand-gray-400">{qa.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
