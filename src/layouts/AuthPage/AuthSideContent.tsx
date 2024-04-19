import * as React from 'react';

interface Props {
  imageSrc: string;
  title: string;
  description: string;
}

const AuthSideContent: React.FC<Props> = ({ imageSrc, title, description }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <img src={imageSrc} />
      <h1 className="mt-8 text-[2rem] font-bold leading-[3rem] text-brand-gray-100">{title}</h1>
      <p className="mt-8 max-w-[336px] text-xl leading-normal text-brand-gray-300">{description}</p>
    </div>
  );
};

export default AuthSideContent;
