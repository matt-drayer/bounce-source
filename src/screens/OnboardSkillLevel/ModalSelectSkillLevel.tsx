import * as React from 'react';
import { RadioGroup } from '@headlessui/react';
import { GetSkillLevelsQuery } from 'types/generated/client';
import CloseIcon from 'svg/CloseIcon';
import Modal from 'components/modals/Modal';
import classNames from 'styles/utils/classNames';

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  skillLevels: GetSkillLevelsQuery['skillLevels'];
  setSkillLevel: (level: string) => void;
  sportName: string;
}

const ModalSelectSkillLevel: React.FC<Props> = ({
  isOpen,
  handleClose,
  skillLevels,
  setSkillLevel,
  sportName,
}) => {
  const [selectedSkillLevelId, setSelectedSkillLevelId] = React.useState('');
  const displaySkillLevels = skillLevels.filter((level) => level.isDisplayed);

  return (
    <Modal isOpen={isOpen} handleClose={() => handleClose()}>
      <div className="p-6">
        <div className="flex justify-between">
          <h3 className="text-xl font-bold text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
            {sportName} skill level
          </h3>
          <button
            className="text-color-text-lightmode-primary dark:text-color-text-darkmode-primary"
            type="button"
            onClick={() => handleClose()}
          >
            <CloseIcon />
          </button>
        </div>
        <div>
          <RadioGroup value={selectedSkillLevelId} onChange={setSelectedSkillLevelId}>
            <div className="space-y-3">
              {displaySkillLevels.map((option) => {
                const { displayName, id } = option;
                return (
                  <RadioGroup.Option
                    key={id}
                    value={id}
                    className={({ checked }) =>
                      classNames(
                        checked
                          ? 'border-color-brand-primary bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary'
                          : 'border-color-border-input-lightmode dark:border-color-border-input-darkmode',
                        'mt-6 flex cursor-pointer flex-col rounded-md border px-4 py-3 focus:outline-none',
                      )
                    }
                  >
                    {({ active, checked }) => (
                      <div className="flex w-full items-center">
                        <div className="flex">
                          <span
                            className={classNames(
                              checked
                                ? 'border-transparent bg-color-brand-primary'
                                : 'border-gray-300 bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary',
                              active ? 'ring-2 ring-color-brand-primary ring-offset-2' : '',
                              'flex h-5 w-5 items-center justify-center rounded-full border',
                            )}
                            aria-hidden="true"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary" />
                          </span>
                        </div>
                        <div className="ml-4">
                          <RadioGroup.Label className="block text-base leading-none">
                            {displayName}
                          </RadioGroup.Label>
                        </div>
                      </div>
                    )}
                  </RadioGroup.Option>
                );
              })}
            </div>
          </RadioGroup>
          <div className="mt-8">
            <button
              onClick={() => {
                setSkillLevel(selectedSkillLevelId);
                handleClose();
              }}
              className="button-rounded-full-primary"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalSelectSkillLevel;
