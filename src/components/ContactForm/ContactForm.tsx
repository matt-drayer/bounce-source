import * as React from 'react';
import styled from 'styled-components';
import { mobile } from 'styles/breakpoints';
import colors from 'styles/colors.json';

const ContactForm = () => {
  return (
    <div className="bg-color-bg-darkmode-secondary px-gutter-base py-14 sm:py-20 lg:py-32">
      <Content className="mx-auto flex max-w-[1200px] items-center">
        <div>
          <p className="text-xl font-bold leading-tight text-color-text-darkmode-primary md:text-3xl">
            Stay connected
          </p>
          <p className="color-text-darkmode-tertiary mt-3 text-center text-sm font-light text-brand-gray-50 sm:mt-6 sm:text-left md:text-xl">
            We'll keep you in the loop with our monthly newsletter.
          </p>
        </div>
        <InputWithBtn className="relative flex w-full max-w-[384px] flex-col sm:flex-row">
          <input
            className="input-form color-text-lightmode-inactive h-[48px] rounded-3xl"
            placeholder="Your email"
          />
          <button className="button-rounded-inline-background-bold right-0 mx-auto mt-7 flex h-[48px] w-[125px] items-center justify-center rounded-[28px] py-4 pb-2 pl-3 pr-3 pt-2 sm:absolute sm:mt-0">
            Get Started
          </button>
        </InputWithBtn>
      </Content>
    </div>
  );
};

const InputWithBtn = styled.div`
  input {
    background: rgba(243, 242, 241, 0.15);
    color: ${colors.paletteBrandGray.colors[200]};

    :focus {
      outline: none;
      box-shadow: none;
    }
  }
`;

const Content = styled.div`
  ${mobile()} {
    flex-direction: column;
    justify-content: center;
  }

  > div {
    width: 50%;

    :last-child {
      margin-left: auto;
    }

    ${mobile()} {
      width: 100%;

      :first-child {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 40px;
      }

      :last-child {
        margin-left: initial;
      }
    }
  }
`;

export default ContactForm;
