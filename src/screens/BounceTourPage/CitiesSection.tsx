import * as React from "react";
import { useState } from "react";
import Link from "components/Link";
import { SIGNUP_CODE_PAGE } from "constants/pages";
import styled from "styled-components";
import { ImgHTMLAttributes } from "react";

interface AccordionItemProps {
  question: string;
  answer: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}


interface ThreeDMapImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  rotationY: number;
  rotationX: number;
}

const ThreeDMapImage = styled.img<ThreeDMapImageProps>`
  width: 100%;
  height: 100%;
  transition: transform 0.5s ease;
  transform: perspective(1000px) rotateY(${(props) => props.rotationY}deg)
    rotateX(${(props) => props.rotationX}deg);
`;


type AccordionItems = "item1" | "item2" | "item3";

const AccordionItem: React.FC<AccordionItemProps> = ({
  question,
  answer,
  isOpen,
  onClick,
}) => {
  return (
    <div
      className={`rounded-md ${
        isOpen ? "open" : "closed"
      } bg-brand-gray-900 transition-height duration-300 ease-in-out`}
    >
      <div className="flex justify-between p-4">
        <h2 className="text-white italic font-semibold md:text-3xl">
          {question}
        </h2>
        <button onClick={onClick}>
          <img
            src="/images/tour-page/plus.png"
            className={`w-5 h-5 transform`}
            alt="Arrow"
          />
        </button>
      </div>
      {isOpen && (
        <div className="w-full mt-2 rounded-md">
          <h3 className="w-full bg-brand-gray-900">{answer}</h3>
        </div>
      )}
    </div>
  );
};

export default function CitiesSection() {
  const [accordionState, setAccordionState] = useState<Record<AccordionItems, boolean>>({
    item1: false,
    item2: false,
    item3: false,
  });
  const [rotationY, setRotationY] = useState(0);
  const [rotationX, setRotationX] = useState(0);

  const handleItemClick = (item: AccordionItems) => {
    setAccordionState((prev) => {
      const updatedState: Record<AccordionItems, boolean> = {
        ...(Object.fromEntries(
          Object.entries(prev).map(([key, _]) => [key as AccordionItems, false])
        ) as Record<AccordionItems, boolean>),
        [item]: !prev[item],
      };
      return updatedState;
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    const { clientX, clientY } = e;
    const sensitivity = 0.1; 
    const newRotationY = (clientX / window.innerWidth - 0.5) * 180 * sensitivity;
    const newRotationX = -(clientY / window.innerHeight - 0.5) * 180 * sensitivity;
  
    setRotationY(newRotationY);
    setRotationX(newRotationX);
  };
  
  React.useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove as EventListener);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove as EventListener);
    };
  }, []);
  return (
    <>
      <style jsx>{`
        @keyframes moveHorizontally {
          0% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(50px); /* Adjust the distance as needed */
          }
          100% {
            transform: translateX(0);
          }
        }

        .move-horizontal-animation {
          animation: moveHorizontally 10s linear infinite; /* Adjust the duration as needed */
        }
      `}</style>

      <div className="p-10 md:p-20 bg-brand-gray-1000">
        {/*MAP SECTION */}
        <div className="flex justify-between gap-2">
          <h2 className="text-sm text-brand-gray-500 uppercase">Locations</h2>
          <h3 className="text-xl text-white italic md:text-5xl">
            14 tournaments, <br />
            <span className="font-bold not-italic">1 champion</span>
          </h3>
          <h3></h3>
        </div>
        <ThreeDMapImage
          src="/images/tour-page/3d-map.png"
          className="mt-6 transform perspective-3d move-horizontal-animation"
          rotationY={rotationY}
          rotationX={rotationX}
        />

        {/*Cities Section */}
        <div className="flex flex-col gap-8 w-full md:flex-row gap-8 w-full">
          {/* sm:flex-col md:flex-col */}
          <div className="w-full md:w-full">
            <AccordionItem
              question="USA"
              answer={
                <ul
                  className="bg-brand-gray-700 divide-y divide-gray-600 text-white w-full"
                >
                  <li className="py-2 flex items-center gap-5 p-4 pt-3 pb-3 ">
                    <span className="mr-2">Jan 6</span>
                    <span>Omaha, NE</span>
                  </li>
                  <li className="py-2 flex items-center gap-5 p-4 pt-3 pb-3 ">
                    <span className="mr-2">Jan 6</span>
                    <span>Atlanta, GA</span>
                  </li>
                  <li className="py-2 flex items-center gap-5 p-4 pt-3 pb-3 ">
                    <span className="mr-2">Jan 6</span>
                    <span>St. Louis, MO</span>
                  </li>
                  <li className="py-2 flex items-center gap-5 p-4 pt-3 pb-3">
                    <span className="mr-2">Jan 6</span>
                    <span>Madison, WIFE</span>
                  </li>
                  <li className="py-2 flex items-center justify-between p-4 pt-3 pb-3 ">
                    <div className="flex gap-5">
                      <span className="mr-2">Jan 6</span>
                      <span>Dallas, TX</span>
                    </div>
                    <img src="/images/tour-page/Badge-final.png" />
                  </li>
                </ul>
              }
              isOpen={accordionState.item1}
              onClick={() => handleItemClick("item1")}
            />
          </div>
          <div className="w-full md:w-full">
            <AccordionItem
              question="Canada"
              answer={
                <ul className="divide-y divide-gray-600 text-white w-full bg-brand-gray-700">
                  <li className="py-2 flex items-center gap-5 p-4 pt-3 pb-3 ">
                    <span className="mr-2">Jan 7</span>
                    <span>Toronto</span>
                  </li>
                  <li className="py-2 flex items-center gap-5 p-4 pt-3 pb-3 ">
                    <span className="mr-2">Jan 7</span>
                    <span>Vancouver</span>
                  </li>
                  <li className="py-2 flex items-center justify-between p-4 pt-3 pb-3 ">
                    <div className="flex gap-5">
                      <span className="mr-2">Jan 7</span>
                      <span>Montreal</span>
                    </div>
                    <img src="/images/tour-page/Badge-final.png" />
                  </li>
                </ul>
              }
              isOpen={accordionState.item2}
              onClick={() => handleItemClick("item2")}
            />
          </div>
          <div className="w-full md:w-full">
            <AccordionItem
              question="Mexico"
              answer={
                <ul className="divide-y divide-gray-600 text-white w-full bg-brand-gray-700">
                  <li className="py-2 flex items-center gap-5 p-4 pt-3 pb-3">
                    <span className="mr-2">Jan 9</span>
                    <span>Mexico City</span>
                  </li>
                  <li className="py-2 flex items-center gap-5 p-4 pt-3 pb-3 ">
                    <span className="mr-2">Jan 9</span>
                    <span>Guadalajara</span>
                  </li>
                  <li className="py-2 flex items-center gap-5 p-4 pt-3 pb-3 ">
                    <span className="mr-2">Jan 9</span>
                    <span>Monterrey</span>
                  </li>
                  <li className="py-2 flex items-center justify-between p-4 pt-3 pb-3 ">
                    <div className="flex gap-5">
                      <span className="mr-2">Jan 9</span>
                      <span>Cancún</span>
                    </div>
                    <img src="/images/tour-page/Badge-final.png" />
                  </li>
                </ul>
              }
              isOpen={accordionState.item3}
              onClick={() => handleItemClick("item3")}
            />
          </div>
        </div>
        <div className="flex justify-center items-center mt-10">
          <Link
            href={SIGNUP_CODE_PAGE}
            className="w-full md:w-auto button-rounded-inline-background-bold ml-4 flex h-auto min-w-auto items-center justify-center px-4 py-2 font-normal text-sm"
          >
            Register now
          </Link>
        </div>
      </div>
    </>
  );
}
