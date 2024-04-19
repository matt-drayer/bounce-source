import { FC } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import StarsRating from 'react-star-rate';
import styled from 'styled-components';
import { mobile, tablet } from 'styles/breakpoints';
import colors from 'styles/colors.json';

const CarouselContainer = styled.div`
  position: relative;

  .carousel .control-dots .dot {
    background: ${colors.paletteBrandGray.colors[300]};
    box-shadow: none;
    margin-right: 0;

    :first-child {
      margin-left: 0;
    }

    &.selected {
      background: ${colors.paletteBrandBlue.colors[500]};
    }
  }

  .carousel .slide {
    height: 470px;
  }
`;

const Slide = styled.div`
  .comment {
    max-width: 1025px;
    margin: auto;
    height: 210px;
  }

  ${tablet()} {
    .comment {
      font-size: 1.5rem;
      height: 150px;
    }

    ${mobile()} {
      .comment {
        font-size: 1.2rem;
      }
`;

const Profile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .react-star-rate__star {
    :last-child {
      margin-right: 0 !important;
    }
  }

  > img {
    border-radius: 50%;
    width: 64px !important;
    height: 64px;
    margin-bottom: 12px;
  }
`;

const Arrow = styled.div<{ isPrev: boolean; disabled: boolean }>`
  cursor: pointer;
  height: 56px;
  width: 56px;
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0;
  z-index: 9;

  ${({ isPrev }) => isPrev && 'left: 0; right: initial;'}
  ${({ disabled }) => disabled && `cursor: not-allowed;`}

  svg {
    stroke: #8d8c94;

    ${({ isPrev }) => isPrev && 'transform: rotate(180deg);'}
    ${({ disabled }) => disabled && `stroke: ${colors.paletteBrandGray.colors[100]};`}
  }
`;

const SliderArrow: FC<{ isPrev: boolean; onClick(): void; disabled: boolean }> = ({
  isPrev,
  onClick,
  disabled,
}) => {
  return (
    <Arrow isPrev={isPrev} onClick={onClick} disabled={disabled}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1 8H15M15 8L8 1M15 8L8 15"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </Arrow>
  );
};
const SlideItem: FC<{
  content: string;
  author: string;
  location: string;
  avatar: string;
}> = ({ location, author, avatar, content }) => {
  return (
    <Slide>
      <p className="comment text-[36px] font-medium">{content}</p>

      <Profile className="mt-10">
        <img src={avatar} alt={author} />
        <span className="author text-[18px] font-medium text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
          {author}
        </span>
        <span className="text-[16px] font-light">{location}</span>
        <StarsRating
          style={{
            style: { fontSize: 0, marginTop: '12px' },
            full: {
              star: {
                fontSize: '20px',
                marginRight: '4px',
              },
            },
          }}
          disabled
          value={5}
        />
      </Profile>
    </Slide>
  );
};

const FeedbackCarousel = () => {
  return (
    <CarouselContainer className="mx-auto max-w-[1200px]">
      <Carousel
        showStatus={false}
        showThumbs
        renderArrowNext={(clickHandler, hasNext) => {
          console.log('hasNext', hasNext);
          return <SliderArrow onClick={clickHandler} isPrev={false} disabled={!hasNext} />;
        }}
        renderArrowPrev={(clickHandler, hasPrev) => {
          console.log('hasPrev', hasPrev);
          return <SliderArrow onClick={clickHandler} isPrev disabled={!hasPrev} />;
        }}
      >
        <SlideItem
          author="Kelly Bloom"
          avatar="/images/tour-page/avatars/avatar-1.png"
          content="This app is fantastic. The Cardio Tennis classes gave me an easier way to jump back into
        tennis. I hadn’t played since high school!"
          location="Naples, Florida"
        />

        <SlideItem
          author="Michael Green"
          avatar="/images/tour-page/avatars/avatar-2.png"
          content="There isn't a better app for organizing openplay pickleball sessions."
          location="New York, New York"
        />

        <SlideItem
          author="Bryan Johnson"
          avatar="/images/tour-page/avatars/avatar-3.png"
          content="Being someone who coaches at multiple locations, managing all my lessons is usually a nightmare. Not anymore! Bounce has made my life so much easier."
          location="Nashville, Tennessee"
        />

        <SlideItem
          author="Elisabeth Jones"
          avatar="/images/tour-page/avatars/avatar-4.png"
          content="Finally an app that helps me meet more players!"
          location="Atlanta, Georgia"
        />

        <SlideItem
          author="Robert Norman"
          avatar="/images/tour-page/avatars/avatar-5.png"
          content="This app made it easy to find the right tennis coaches for my kids. It’s much better than asking around on Facebook."
          location="Austin, Texas"
        />
      </Carousel>
    </CarouselContainer>
  );
};

export default FeedbackCarousel;
