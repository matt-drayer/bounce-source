import React, { useState } from 'react';
import styled from 'styled-components';
import { SIGNUP_CODE_PAGE } from 'constants/pages';
import Link from 'components/Link';

interface ThreeDImageProps {
  rotationY: number;
  rotationX: number;
}

const ThreeDImage = styled.img<ThreeDImageProps>`
  width: 50%;
  height: 100%;
  /* Add your 3D effect styles here */
  transition: transform 0.5s ease;
  transform: perspective(1000px) rotateY(${(props) => props.rotationY}deg)
    rotateX(${(props) => props.rotationX}deg);
`;

export default function CTASection() {
  const [rotationY, setRotationY] = useState(0);
  const [rotationX, setRotationX] = useState(0);

  React.useEffect(() => {
    const handleMouseMove: (e: MouseEvent) => void = (e) => {
      const { clientX, clientY } = e;
      const sensitivity = 0.2;

      const newRotationY = (clientX / window.innerWidth - 0.5) * 360 * sensitivity;
      const newRotationX = -(clientY / window.innerHeight - 0.5) * 360 * sensitivity;

      setRotationY(newRotationY);
      setRotationX(newRotationX);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      <div className="bg-brand-fire-600">
        {/*large screens only*/}
        <div className="hidden items-center md:flex">
          <ThreeDImage
            src="/images/tour-page/frame.png"
            alt="two paddle"
            rotationY={rotationY}
            rotationX={rotationX}
          />
          <div className="flex flex-col gap-5">
            <h2 className="text-5xl text-color-text-darkmode-primary ">
              Win a tournament, join an
            </h2>
            <h2 className="text-5xl font-bold text-color-text-darkmode-primary ">
              exclusive community.
            </h2>
            <div className="pr-6 text-color-text-darkmode-primary">
              <h3>
                Winners of each tournament receive the Bounce paddle, which acts as a key to
                exclusive events.
              </h3>
            </div>
            <div className=" flex justify-start">
              <Link
                href={SIGNUP_CODE_PAGE}
                className="bg-brand-gray-1100 button-rounded-inline-background-bold ml-4 flex items-center justify-center border-none bg-gray-800 px-6 py-3 text-sm font-normal text-white sm:ml-6"
              >
                Learn more
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col p-12 md:hidden">
          <div className="text-5xl text-color-text-darkmode-primary">
            <h3 className="text-5xl italic text-color-text-darkmode-primary">
              Call-to-action Heading
            </h3>
            <p className="mt-6 pr-6 text-lg text-color-text-darkmode-primary">
              Please write here a few general points abouttournaments. Short intro
            </p>
          </div>
          <div className="mt-12 flex items-center justify-center">
            <Link
              href={SIGNUP_CODE_PAGE}
              className="button-rounded-inline-background-bold min-w-auto ml-4 flex h-auto w-full items-center justify-center border-none px-4 py-3 text-sm font-normal md:w-auto"
            >
              Register now
            </Link>
          </div>
          <div className="relative mt-6">
            <img src="/images/tour-page/man-with-p.png" className="transparent-background w-full" />
          </div>
        </div>
      </div>
    </>
  );
}
