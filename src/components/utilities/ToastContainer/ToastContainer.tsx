import * as React from 'react';
import { Toaster } from 'react-hot-toast';

const ToastContainer = () => {
  return <Toaster containerClassName="toast-force-safe-area-top" />;
};

export default ToastContainer;
