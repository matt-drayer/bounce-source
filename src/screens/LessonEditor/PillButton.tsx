import React from 'react';
import classNames from 'styles/utils/classNames';

interface Props {
  Icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
  name: string;
  isBadgeActive: boolean;
  handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const PillButton: React.FC<Props> = ({ Icon, name, isBadgeActive, handleClick }) => {
  return (
    <button
      type="button"
      onClick={handleClick}
      className={classNames(
        'mr-4 mt-4 flex items-center rounded-3xl border px-4 py-1 lg:mb-4 lg:mt-0',
        isBadgeActive
          ? 'border-transparent bg-color-brand-active text-color-brand-primary'
          : 'border-color-brand-secondary text-color-brand-secondary',
      )}
    >
      <div className="h-4 w-4">
        <Icon />
      </div>
      <span className="ml-2 leading-6">{name}</span>
    </button>
  );
};

export default PillButton;
