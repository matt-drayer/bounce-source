import React from 'react';
import { LabelProps } from '@headlessui/react/dist/components/label/label';
import CloseIcon from 'svg/CloseIcon';
import { Button, ButtonText } from 'components/Button';
import Modal from 'components/modals/Modal';
import { ModalProps } from 'components/modals/Modal';
import classNames from 'styles/utils/classNames';

interface Props extends ModalProps {}

const Label = ({
  children,
  className,
  ...props
}: React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>) => (
  <label
    {...props}
    className={classNames('typography-product-subheading', !!className && className)}
  >
    {children}
  </label>
);

export default function ModalAdditionalDetails({ isOpen, handleClose }: Props) {
  /**
   * @todo react-hook-form
   * For rows, grid or flex?
   */

  return (
    <Modal isOpen={isOpen} handleClose={handleClose} classNameMaxWidth="max-w-[51rem]">
      <div className="flex h-full max-h-[90vh] flex-col">
        <div className="border-b border-color-border-input-lightmode dark:border-color-border-input-darkmode">
          <div className="flex items-center justify-between px-ds-xl py-4 md:px-ds-3xl md:py-5">
            <h3 className="typography-product-heading">Complete your profile</h3>
            <ButtonText
              onClick={() => handleClose}
              tabIndex={-1}
              className="-mr-2 rounded-full p-2 font-medium transition-colors hover:bg-color-bg-lightmode-secondary dark:hover:bg-color-bg-darkmode-secondary"
            >
              <CloseIcon className="h-6 w-6" />
            </ButtonText>
          </div>
        </div>
        <div className="flex w-full flex-auto flex-col space-y-6 divide-y divide-color-border-input-lightmode overflow-y-auto px-ds-xl py-ds-xl dark:divide-color-border-input-darkmode md:px-ds-3xl">
          <div className="grid w-full grid-cols-3 gap-8">
            <div>
              <Label>Phone number (hide if already have?)</Label>
            </div>
            <div className="col-span-2">
              <input className="input-form block" placeholder="City or zip" />
              <p className="typography-product-text-card mt-2 text-color-text-lightmode-tertiary dark:text-color-text-darkmode-tertiary">
                Receive game day updates and court assignments. Unsubscribe anytime.
              </p>
            </div>
          </div>
          <div className="grid w-full grid-cols-3 gap-8 pt-6">
            <div>
              <Label>Birthday</Label>
            </div>
            <div className="col-span-2">
              <input className="input-form" />
            </div>
          </div>
          <div className="grid w-full grid-cols-3 gap-8 pt-6">
            <div>
              <Label>City (hide if already have?)</Label>
            </div>
            <div className="col-span-2">
              <input className="input-form" placeholder="City or zip" />
            </div>
          </div>
          <div className="grid w-full grid-cols-3 gap-8 pt-6">
            <div>
              <Label>Favorite format</Label>
            </div>
            <div className="col-span-2">
              Radio group: round robin, single elimination, double elimination, other
            </div>
          </div>
          <div className="grid w-full grid-cols-3 gap-8 pt-6">
            <div>
              <Label>Favorite event</Label>
            </div>
            <div className="col-span-2">Radio group: singles, doubles</div>
          </div>
          <div className="grid w-full grid-cols-3 gap-8 pt-6">
            <div>
              <Label>How far would you travel for a tournament</Label>
            </div>
            <div className="col-span-2">Radio group</div>
          </div>
          <div className="grid w-full grid-cols-3 gap-8 pt-6">
            <div>
              <Label>Preferred rating scale</Label>
            </div>
            <div className="col-span-2">
              select (allow a "none" or something cheeky like "None are good". Or maybe all scales
              but some radio to select that they hate all)
            </div>
          </div>
          <div className="grid w-full grid-cols-3 gap-8 pt-6">
            <div>
              <Label>Rating scales</Label>
            </div>
            <div className="col-span-2">Ability to set multiple</div>
          </div>
        </div>
        <div className="w-full border-t border-color-border-input-lightmode dark:border-color-border-input-darkmode">
          <div className="flex w-full items-center justify-end px-ds-xl py-4 md:px-ds-3xl md:py-5">
            <Button variant="primary" size="lg" isInlineDesktop>
              Save
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
