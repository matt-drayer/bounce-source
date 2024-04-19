import React, { useState } from 'react';
import { useModal } from 'hooks/useModal';
import Pencil from 'svg/Pencil';
import SearchIcon from 'svg/SearchIcon';
import Trash from 'svg/Trash';
import { Button, ButtonText } from 'components/Button';
import TabSlider from 'components/TabSlider';
import classNames from 'styles/utils/classNames';
import EmailModal from './EmailModal';
import { groups } from './dummy';

export default function Registrants() {
  const [searchValue, setSearchValue] = React.useState('');
  const [activeButton, setActiveButton] = React.useState(0);
  const [hoveredTeam, setHoveredTeam] = useState<number | null>(null);
  const [included, setIncluded] = React.useState<any[]>([]);
  const { isOpen, openModal, closeModal } = useModal();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleButtonClick = (index: number) => {
    setActiveButton(index);
  };

  const handleTeamHover = (index: number) => {
    setHoveredTeam(index);
  };

  const handleTeamLeave = () => {
    setHoveredTeam(null);
  };

  const filter = (format: string) => {
    setIncluded(groups.teams.filter((f) => f.format === format));
  };

  const deleted = (id: string) => {
    setIncluded((prevIncluded) => prevIncluded.filter((item) => item.id !== id));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* header */}
      <div className="flex w-full justify-between gap-5 px-8 py-4 leading-5 max-md:max-w-full max-md:flex-wrap max-md:px-5">
        <div className="bg-color-bg-lightmode-input dark:bg-color-bg-darkmode-input flex justify-between gap-2 rounded-md px-3.5 py-2 leading-[150%]">
          <SearchIcon className="my-auto aspect-square h-4 w-5 text-color-text-lightmode-placeholder dark:text-color-text-darkmode-placeholder" />
          <div className="flex-auto">
            <input
              type="text"
              value={searchValue}
              onChange={handleInputChange}
              placeholder="Search"
              className="input-base-form dark:bg-color-bg-darkmode-input w-full border-none px-2 py-1"
            />
          </div>
        </div>
        <div className="w-[8rem]">
          <Button
            variant="primary"
            size="md"
            onClick={() => openModal()}
            className="justify-center whitespace-nowrap rounded-full bg-color-bg-lightmode-invert px-6 py-3 text-color-text-lightmode-invert dark:bg-color-bg-darkmode-invert dark:text-color-text-darkmode-invert max-md:px-5"
          >
            Send email
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {groups.format.map((f, index) => (
          <div className="w-1/4 rounded-md" key={index}>
            <ButtonText
              size="md"
              onClick={() => {
                handleButtonClick(index);
                filter(f);
              }}
              className={classNames(
                'p-3',
                activeButton === index
                  ? 'typography-product-chips-filters bg-color-bg-lightmode-invert text-color-text-lightmode-invert dark:bg-color-bg-darkmode-invert dark:text-color-text-darkmode-invert'
                  : 'typography-product-chips-filters bg-color-bg-lightmode-secondary text-color-text-lightmode-secondary dark:bg-color-bg-darkmode-secondary dark:text-color-text-darkmode-secondary',
              )}
            >
              {f}
            </ButtonText>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-6">
        {included &&
          included.map((t, index) => (
            <div
              className="flex items-center justify-between rounded-md border-color-border-brand p-2 hover:border hover:bg-color-bg-lightmode-brand-secondary"
              key={index}
              onMouseEnter={() => handleTeamHover(index)}
              onMouseLeave={handleTeamLeave}
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <img src={t.userProfile.profile_image_1} alt="Player 1" />
                  <p className="typography-product-caption text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                    {t.userProfile.player_1_fullName}
                  </p>
                </div>
                <div className="relative top-[-6px]">
                  <div className="flex items-center gap-1">
                    <img src={t.userProfile.profile_image_2} alt="Player 2" />
                    <p className="typography-product-caption text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
                      {t.userProfile.player_2_fullName}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex">
                {hoveredTeam === index && (
                  <>
                    <Button
                      variant="secondary"
                      className="border-none"
                      size="xs"
                      onClick={() => deleted(t.id)}
                    >
                      <Trash className="h-5 w-5 text-color-text-lightmode-icon dark:text-color-text-darkmode-icon" />
                    </Button>
                    <Button variant="secondary" className="border-none" size="xs">
                      <Pencil className="h-5 w-5 text-color-text-lightmode-icon dark:text-color-text-darkmode-icon" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
      </div>
      <EmailModal isOpen={isOpen} openModal={openModal} closeModal={closeModal} />
    </div>
  );
}
