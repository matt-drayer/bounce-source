import React from 'react';
import classNames from 'classnames';
import DocumentDuplicate from 'svg/DocumentDuplicate';
import Pencil from 'svg/Pencil';
import Trash from 'svg/Trash';

type Props = {
  time: string;
  eventName: string;
  format: string;
  minGames: number;
  scoring: string;
  gamePerMatch: number;
  teamsCount: number;
  eventFee: number;
  className?: string;

  onEdit(): void;
  onDelete(): void;
  onDuplicate(): void;
};

const FilledEvent = ({
  eventName,
  time,
  minGames,
  gamePerMatch,
  scoring,
  format,
  teamsCount,
  eventFee,
  className = '',

  onEdit,
  onDuplicate,
  onDelete,
}: Props) => {
  const classes = classNames(
    'flex w-full flex-col rounded-md border border-color-border-input-lightmode bg-color-bg-lightmode-secondary dark:bg-color-bg-darkmode-secondary p-6',
    className,
  );
  return (
    <div className={classes}>
      <div className="flex w-full justify-between">
        <span className="typography-product-heading-compact font-bold">{eventName}</span>
        <span className="typography-product-heading-compact font-bold">{time}</span>
      </div>

      <div className="mt-6 flex justify-between">
        <div className="flex flex-col">
          <span className="font-medium text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
            Format
          </span>
          <span className="font-medium text-color-text-lightmode-primary">{format}</span>
        </div>

        <div className="flex flex-col">
          <span className="font-medium text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
            Number of min games
          </span>
          <span className="font-medium text-color-text-lightmode-primary">{minGames}</span>
        </div>

        <div className="flex flex-col">
          <span className="font-medium text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
            Scoring{' '}
          </span>
          <span className="font-medium text-color-text-lightmode-primary">{scoring}</span>
        </div>

        <div className="flex flex-col">
          <span className="font-medium text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
            Games per match
          </span>
          <span className="font-medium text-color-text-lightmode-primary">{gamePerMatch}</span>
        </div>
      </div>
      <div className="mt-6 flex">
        <div className="mr-6 flex ">
          <span className="mr-2 font-medium text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
            Teams
          </span>
          <span className="font-medium text-color-text-lightmode-primary">{teamsCount}</span>
        </div>
        <div className="flex">
          <span className="mr-6 font-medium text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary ">
            Event Fee
          </span>
          <span className="font-medium text-color-text-lightmode-primary">{eventFee}</span>
        </div>

        <div className="ml-auto flex">
          <Pencil
            onClick={onEdit}
            className="mr-4 h-5 w-5 shrink-0 cursor-pointer [&>path]:fill-color-text-lightmode-icon"
          />

          <DocumentDuplicate
            onClick={onDuplicate}
            className="mr-4 h-5 w-5 shrink-0 cursor-pointer [&>path]:fill-color-text-lightmode-icon"
          />

          <Trash
            onClick={onDelete}
            className="h-5 w-5 shrink-0 cursor-pointer [&>path]:fill-color-text-lightmode-icon"
          />
        </div>
      </div>
    </div>
  );
};

export default FilledEvent;
