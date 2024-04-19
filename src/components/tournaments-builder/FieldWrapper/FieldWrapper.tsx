import { PropsWithChildren } from 'react';
import classNames from 'classnames';

type Props = {
  label?: string;
  isLast?: boolean;
  className?: string;
} & PropsWithChildren;

const FieldWrapper = ({ label, isLast = false, children, className = '' }: Props) => {
  const classes = classNames({
    'flex justify-between pt-10': true,
    'border-b border-color-border-input-lightmode pb-10': !isLast,
    [className]: true,
  });

  return (
    <div className={classes}>
      <div className="font-bod w-[20%] font-bold text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
        {label}
      </div>
      <div className="ml-6 w-[80%] shrink-0">{children}</div>
    </div>
  );
};

export default FieldWrapper;
