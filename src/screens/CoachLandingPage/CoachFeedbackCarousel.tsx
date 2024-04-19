import { FC } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import StarsRating from 'react-star-rate';
import styled from 'styled-components';
import { mobile, tablet } from 'styles/breakpoints';
import colors from 'styles/colors.json';

const SlideItem: FC<{
  content: string;
  author: string;
  location: string;
  avatar: string;
}> = ({ location, author, avatar, content }) => {
  return (
    <Slide>
      <Profile className="mt-10">
        <img src={avatar} alt={author} />
        <Body className="ml-32">
          <StarsRating
            style={{
              style: { fontSize: 0 },
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
          <p className="comment mt-3 mb-5 text-[36px] font-medium">{content}</p>
          <span className="author mb-2 text-[18px] font-medium text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
            {author}
          </span>
          <span className="location text-[16px] font-light">{location}</span>
        </Body>
      </Profile>
    </Slide>
  );
};

const CoachFeedbackCarousel = () => {
  return (
    <CarouselContainer className="mx-auto max-w-[1200px] pt-24">
      <Carousel
        showStatus={false}
        showThumbs
        renderArrowNext={(clickHandler, hasNext) => {
          return <SliderArrow onClick={clickHandler} isPrev={false} disabled={!hasNext} />;
        }}
        renderArrowPrev={(clickHandler, hasPrev) => {
          return <SliderArrow onClick={clickHandler} isPrev disabled={!hasPrev} />;
        }}
      >
        <SlideItem
          author="— Brian Bass"
          avatar="/images/tour-page/avatars/avatar-6.png"
          content="Bounce is incredible. It's saved me so much time and effort, plus my players love it!"
          location="USPTA Pro, Nashville, Tennessee"
        />

        <SlideItem
          author="— Brian Bass"
          avatar="/images/tour-page/avatars/avatar-6.png"
          content="Bounce is incredible. It's saved me so much time and effort, plus my players love it!"
          location="USPTA Pro, Nashville, Tennessee"
        />
      </Carousel>
    </CarouselContainer>
  );
};

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
    height: 420px;
  }

  ${tablet()} {
    .carousel .slide {
      height: 600px;
    }
  }
`;

const Slide = styled.div`
  .comment {
    max-width: 500px;
    color: ${colors.paletteBrandGray.colors[700]};
    font-size: 2.25rem;
    line-height: 1.3;
  }

  .author {
    color: ${colors.paletteBrandGray.colors[700]};
  }
}

  ${tablet()} {
    .comment {
      font-size: 1.5rem;
      height: auto;
      text-align: center;
    }

    ${mobile()} {
      .comment {
        font-size: 1.2rem;
      }
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  .react-star-rate__star {
    :last-child {
      margin-right: 0 !important;
    }
  }

  > img {
    border-radius: 50%;
    width: 280px !important;
    height: 280px;
  }

  ${tablet()} {
    flex-direction: column;

    > img {
      width: 200px !important;
      height: 200px;
    }
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

  ${tablet()} {
    display: none;
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
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Arrow>
  );
};

const Body = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;

  ${tablet()} {
    margin-left: 0;
    align-items: center;
    margin-top: 2em;
  }
`;
export default CoachFeedbackCarousel;
