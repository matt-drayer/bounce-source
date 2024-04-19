import * as React from 'react';

const SuccessStep = () => {
  return (
    <div>
      <p className="text-[1.25rem] font-medium italic text-brand-fire-500">Hooray!</p>

      <p className="mb-6 mt-8 text-brand-gray-800">
        You're in. A member of our team will be in touch within the next two days.{' '}
      </p>
      <p className="text-brand-gray-800">We can't wait to see you.</p>
    </div>
  );
};

export default SuccessStep;
