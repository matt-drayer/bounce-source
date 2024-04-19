import { FC } from 'react';
import * as React from 'react';
import { Tab } from '@headlessui/react';
import classNames from 'classnames';
import { TournamentPreview } from 'constants/tournaments';
import Event from 'components/tournaments/Event/Event';

type Props = {
  tournaments: TournamentPreview[];
};

const sortForDisplay = (a: TournamentPreview, b: TournamentPreview) => {
  return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
};

/**
 * @todo drive this through the data
 */
const categories = ['Mixed', "Men's", "Women's"];

const ComingSoon = () => {
  return (
    <Tab.Panel className="mx-auto flex w-full max-w-[697px] flex-col">
      <h2 className="pb-5 text-center text-[4rem] font-bold italic leading-tight text-brand-gray-300">
        Coming soon{' '}
      </h2>
      <span className="pb-6 text-center font-light text-brand-gray-300">
        Do you want a Bounce tournament in your city? Let us know.
      </span>
      <div className="flex flex-col items-center justify-between sm:flex-row">
        <input
          className="input-form color-text-lightmode-inactive bg-brand-bg-gray-900 mb-4 mr-2 h-[39px] max-w-[178px] rounded-md text-brand-gray-300 sm:mb-0"
          placeholder="Your name"
        />
        <input
          className="input-form color-text-lightmode-inactive bg-brand-bg-gray-900 mb-4 mr-2 h-[39px] max-w-[178px] rounded-md text-brand-gray-300 sm:mb-0"
          placeholder="Your email"
        />
        <input
          className="input-form color-text-lightmode-inactive bg-brand-bg-gray-900 mb-4 mr-2 h-[39px] max-w-[178px] rounded-md text-brand-gray-300 sm:mb-0"
          placeholder="Your city"
        />
        <button className="max-h-[39px] w-full max-w-[90px] rounded-3xl border border-solid border-white pl-4 pr-4 text-[1rem] font-normal text-white">
          Submit
        </button>
      </div>
    </Tab.Panel>
  );
};

const TournamentsList: FC<Props> = ({ tournaments }) => {
  return (
    <div className="flex flex-col">
      <div>
        {tournaments.sort(sortForDisplay).map((tournamentEvent, index) => {
          return (
            <div className="pb-4" key={index}>
              <Event tournament={tournamentEvent} />
            </div>
          );
        })}
      </div>

      {/*<Tab.Group>*/}
      {/*<Tab.List className="flex pb-10">*/}
      {/*  {categories.map((category, index) => {*/}
      {/*    return (*/}
      {/*      <Tab*/}
      {/*        key={index}*/}
      {/*        className={({ selected }) =>*/}
      {/*          classNames(*/}
      {/*            'mr-4 rounded-2xl border-solid pr-3 pl-3 pt-1 pb-1 text-[1rem] font-normal focus:outline-none sm:mr-6',*/}
      {/*            selected ? 'bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary' : 'border border-white text-white',*/}
      {/*          )*/}
      {/*        }*/}
      {/*      >*/}
      {/*        {category}*/}
      {/*      </Tab>*/}
      {/*    );*/}
      {/*  })}*/}
      {/*</Tab.List>*/}
      {/*  <Tab.Panel>*/}
      {/*    <div>*/}
      {/*      {tournaments.sort(sortForDisplay).map((tournamentEvent, index) => {*/}
      {/*        return (*/}
      {/*          <div className="pb-4" key={index}>*/}
      {/*            <Event tournament={tournamentEvent} />*/}
      {/*          </div>*/}
      {/*        );*/}
      {/*      })}*/}
      {/*    </div>*/}
      {/*  </Tab.Panel>*/}
      {/*  <ComingSoon />*/}
      {/*  <ComingSoon />*/}
      {/*</Tab.Group>*/}
    </div>
  );
};

export default TournamentsList;
