import * as React from 'react';
import { ReactNode } from 'react';
import classNames from 'classnames';
import { chunk } from 'lodash';

type Props = {
  data: {
    icon: string;
    title: string;
    body: ReactNode;
  }[];
};

export default function TournamentDetails({ data }: Props) {
  const chunks = chunk(data, 3);

  return (
    <div>
      {chunks.map((list, index, array) => {
        const classes = classNames('mb-0 flex flex-col justify-between md:mb-12 md:flex-row', {
          'mt-16': index < array.length - 1,
        });

        return (
          <ul className={classes} key={index}>
            {list.map((item, index) => {
              return (
                <li className="mb-3 flex w-full max-w-[265px] flex-col md:mb-0" key={index}>
                  <div className="mb-1 flex">
                    <img src={item.icon} alt={item.title} className="mr-1" />
                    <span className="font-light text-brand-gray-600">{item.title}</span>
                  </div>
                  <span className="font-light text-brand-gray-1000">{item.body}</span>
                </li>
              );
            })}
          </ul>
        );
      })}
    </div>
  );
}
