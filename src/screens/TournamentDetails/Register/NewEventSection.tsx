import React from 'react';
import Trash from 'svg/TrashOutline';
import { EventProps } from '../types';

interface Props extends EventProps {
  index: number;
}

const NewEventSection = ({ event }: EventProps) => {
  /**
   * @todo
   * - Is index defined in the form array?
   * - Set event type and partner email on react-hook-form
   * - Change font color to placeholder if no event type selected
   * - Show the price of event once selected
   */

  return (
    <div className="mt-6 flex flex-col gap-4">
      <div className="flex justify-between">
        <h2 className="typography-product-body-highlight text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
          Event #1
        </h2>
        <div className="flex items-center">
          <p className="typography-product-body-highlight mx-4 text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
            $15
          </p>
          <div>
            <Trash className="h-5 w-5 text-color-text-lightmode-icon dark:text-color-text-darkmode-icon" />
          </div>
        </div>
      </div>
      <div>
        <div>
          <select name="Event" id="Event" className="input-form cursor-pointer" required>
            <option value="" disabled selected>
              Event type
            </option>
            {event.groups.map((group) => (
              <option key={group.id} value={group.id} className="cursor-pointer">
                {group.title}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-3">
          <input
            type="email"
            name="email"
            id="email"
            className="input-form"
            placeholder="Partner email"
            required
          />
          <p className="typography-product-text-card mt-2 text-color-text-lightmode-tertiary dark:text-color-text-lightmode-tertiary">
            You must have a partner to register. Please include their email address and we'll
            confirm their participation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewEventSection;
