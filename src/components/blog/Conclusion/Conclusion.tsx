import { FC } from 'react';

const Conclusion: FC<{ body: string }> = ({ body }) => {
  return (
    <div className="rounded-[16px] bg-brand-gray-25 pt-10 pb-10 pr-6 pl-6 mb-16">
      <h3 className="mb-5 text-3xl font-medium accent-brand-gray-800">Conclusion</h3>
      <p className="text-lg font-light accent-brand-gray-600">{body}</p>
    </div>
  );
};

export default Conclusion;
