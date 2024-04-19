import * as React from 'react';
import styled from 'styled-components';
import { COMPANY_LINKEDIN } from 'constants/internal';
import colors from 'styles/colors.json';

const Line = styled.hr`
  border: 1px solid ${colors.paletteBrandGray.colors[700]};
  border-bottom: none;
`;

const Copyright = () => {
  return (
    <div className="mx-auto mt-16 max-w-[1200px]">
      <Line />
      <div className="mt-10 flex flex-col justify-between sm:flex-row">
        <div className="mb-3 sm:mb-0">
          <p className="font-light text-[0.9] text-color-text-darkmode-secondary md:text-sm">
            © {new Date().getFullYear()} Bounce. All rights reserved.
          </p>
        </div>
        <div className="ion-align-items-center flex justify-between font-light text-color-text-darkmode-secondary sm:justify-start md:text-sm">
          <a className="ion-align-items-center mr-10 flex" href="mailto:team@bounce.game">
            team@bounce.game
          </a>
          <a href={COMPANY_LINKEDIN} target="_blank" rel="noopener noreferrer">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M23.04 0H0.96C0.429 0 0 0.429 0 0.96V23.04C0 23.571 0.429 24 0.96 24H23.04C23.571 24 24 23.571 24 23.04V0.96C24 0.429 23.571 0 23.04 0ZM7.119 20.451H3.558V8.997H7.119V20.451ZM5.34 7.431C4.93178 7.431 4.53273 7.30995 4.1933 7.08315C3.85388 6.85636 3.58933 6.534 3.43311 6.15686C3.27689 5.77971 3.23602 5.36471 3.31566 4.96433C3.3953 4.56396 3.59188 4.19619 3.88053 3.90753C4.16919 3.61888 4.53696 3.4223 4.93733 3.34266C5.33771 3.26302 5.75271 3.30389 6.12986 3.46011C6.507 3.61633 6.82936 3.88088 7.05615 4.2203C7.28295 4.55973 7.404 4.95878 7.404 5.367C7.401 6.507 6.477 7.431 5.34 7.431ZM20.451 20.451H16.893V14.88C16.893 13.551 16.869 11.844 15.042 11.844C13.191 11.844 12.906 13.29 12.906 14.784V20.451H9.351V8.997H12.765V10.563H12.813C13.287 9.663 14.448 8.712 16.182 8.712C19.788 8.712 20.451 11.085 20.451 14.169V20.451Z"
                fill="currentColor"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Copyright;
