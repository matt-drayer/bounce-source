import * as React from 'react';
import styled from 'styled-components';
import { mobile } from 'styles/breakpoints';
import colors from 'styles/colors.json';

const HowItWorks = () => {
  return (
    <Container className="mt-36">
      <Header>How it works</Header>

      <ItemsSection className="flex-col items-center">
        <Item>
          <div className="body mx-auto flex max-w-[1200px] px-6 lg:px-0">
            <img src="/images/tour-page/how-it-works/1.png" alt="" />
            <div>
              <div className="index">1.</div>
              <div className="title">Stand out from the crowd</div>
              <div className="desc">
                Use your profile to show players what makes your coaching style unique.
              </div>
            </div>
          </div>
        </Item>
        <Item className="right">
          <div className="body mx-auto flex max-w-[1200px] px-6 lg:px-0">
            <img src="/images/tour-page/how-it-works/2.png" alt="" />
            <div>
              <div className="index">2.</div>
              <div className="title">Show players your availability</div>
              <div className="desc">
                List lessons and general availability to allow players to seamlessly book time with
                you.
              </div>
            </div>
          </div>
        </Item>
        <Item>
          <div className="body mx-auto flex max-w-[1200px] px-6 lg:px-0">
            <img src="/images/tour-page/how-it-works/3.png" alt="" />
            <div>
              <div className="index">3.</div>
              <div className="title">Invite players to your lessons </div>
              <div className="desc">
                Share your lessons with individuals, groups and social networks to attract more
                clients.
              </div>
            </div>
          </div>
        </Item>
        <Item className="right">
          <div className="body mx-auto flex max-w-[1200px] px-6 lg:px-0">
            <img src="/images/tour-page/how-it-works/4.png" alt="" />
            <div>
              <div className="index">4.</div>
              <div className="title">Receive notifications at the right time</div>
              <div className="desc">
                You'll be notified for the important things, like player registrations and payment
                confirmation - you will not be spammed with nonsense.
              </div>
            </div>
          </div>
        </Item>
        <Item>
          <div className="body mx-auto flex max-w-[1200px] px-6 lg:px-0">
            <img src="/images/tour-page/how-it-works/5.png" alt="" />
            <div>
              <div className="index">5.</div>
              <div className="title">See your impact over time</div>
              <div className="desc">
                Exclusively visible to you is the Dashboard, where you'll see all the impact you've
                made over time.
              </div>
            </div>
          </div>
        </Item>
      </ItemsSection>
    </Container>
  );
};

const Header = styled.h2`
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 3rem;
  color: ${colors.paletteBrandGray.colors[700]};
  text-align: center;
`;

const Container = styled.div``;

const ItemsSection = styled.div``;

const Item = styled.div`
  &.right {
    background: ${colors.paletteBrandGray.colors[25]};

    .body {
      flex-direction: row-reverse;

      > div {
        padding-left: 0;
      }
    }
  }

  .body {
    display: flex;
    align-items: center;
    justify-content: space-between;

    > img {
      width: 45%;
    }

    > div {
      max-width: 30rem;
    }

    .index {
      color: ${colors.paletteBrandFire.colors[500]};
      font-size: 4rem;
      font-weight: 700;
      font-family: 'Poppins', sans-serif;
    }

    .title {
      font-size: 2rem;
      color: ${colors.paletteBrandGray.colors[700]};
      font-weight: 700;
      font-family: 'Poppins', sans-serif;
    }

    .desc {
      font-weight: 400;
      font-size: 1rem;
      color: ${colors.paletteBrandGray.colors[700]};
      margin-top: 0.5rem;
    }
  }

  &.right,
  & {
    ${mobile()} {
      :not(:first-child) {
        padding-top: 4em;
      }

      .body {
        flex-direction: column-reverse;

        > img {
          width: 100%;
        }

        > div {
          align-items: center;
          display: flex;
          flex-direction: column;
          text-align: center;
        }
      }
    }
  }
`;

export default HowItWorks;
