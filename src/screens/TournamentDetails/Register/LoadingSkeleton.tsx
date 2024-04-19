import React from 'react';
import Skeleton from 'components/LoadingSkeleton';
import Header from './Header';

export default function LoadingSkeleton() {
  return (
    <div className="w-full flex-shrink-0 overflow-hidden p-6">
      <Header title="Register" />
      <div className="mt-8">
        <Skeleton height="3rem" />
      </div>
      <div className="mt-2.5">
        <Skeleton count={4} />
      </div>
    </div>
  );
}
