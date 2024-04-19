import { useEffect } from 'react';
import noop from 'utils/shared/noop';

interface LoadScriptParams {
  src: string;
  onLoad?: (loadObject?: any) => void;
  onError?: () => void;
  isAsync: boolean;
}

export const useScript = ({ src, onLoad = noop, onError = noop, isAsync }: LoadScriptParams) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = src;

    if (isAsync) {
      script.async = true;
    }

    script.onload = (loadObject) => {
      onLoad(loadObject);
    };
    script.onerror = onError;

    document.getElementsByTagName('head')[0].appendChild(script);
  }, []);
};
