import styled from 'styled-components';
import { mobile, tablet } from 'styles/breakpoints';

const cards = [
  {
    author: 'Jason Benson',
    text: 'The Bounce tournament was a blast. I enjoyed the format of having round robin on one day and single elimination the next.',
  },

  {
    img: 'feedback-3.png',
  },
  {
    author: 'Mark Trenda',
    text: 'The energy at the Bounce tournament was infectious. It reminded me why I love the sport.',
  },
  {
    img: 'feedback-1.png',
  },
  {
    author: 'Brian Boaz',
    text: "Amateur tournaments with prize money is so cool. I won money and I'm a 3.5 player!",
  },
  {
    img: 'feedback-4.png',
  },
  {
    author: 'Lisa Douglas',
    text: "I enjoyed the tournament because it blended fun and competitiveness. Everyone wants to win, but having fun with dozens of pickleball players is what it's all about.",
  },
  {
    img: 'feedback-5.png',
  },

  {
    img: 'feedback-2.png',
  },
  {
    author: 'Tamara Billing',
    text: 'This was my first pickleball tournament and it was awesome. The team team running the event made things super easy for players.',
  },

  {
    img: 'feedback-6.png',
  },
];

const gridAreas = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
];
const PayersFeedback = () => {
  return (
    <div className="flex flex-col bg-brand-gray-900 pb-16 pl-6 pr-6 pt-10 sm:pt-16 md:pl-16 md:pr-16">
      <h2 className="pb-10 text-center text-[2.5rem] font-light text-white sm:pb-16 sm:text-left sm:text-[4rem]">
        What <strong className="font-bold italic text-brand-fire-500">players</strong> say
      </h2>
      <Container className="grid gap-3">
        {cards.map((card, index) => {
          if (card.img) {
            return (
              <div
                key={index}
                className={`${gridAreas[index]} rounded-xl border border-solid border-white border-opacity-5`}
              >
                <img
                  src={`/images/tournaments/${card.img}`}
                  alt="card image"
                  className="h-full w-full"
                />
              </div>
            );
          }

          return (
            <div
              key={index}
              className={`${gridAreas[index]} text-card flex flex-col rounded-xl border border-solid border-white border-opacity-5 bg-brand-gray-800 pb-8 pl-8 pr-8 pt-8`}
            >
              <span className="font-light text-white">{card.text}</span>
              <span className="ml-auto mt-auto text-xs text-brand-gray-300">{card.author}</span>
            </div>
          );
        })}
      </Container>
    </div>
  );
};

const Container = styled.div`
  grid-template-areas:
    'one four seven nine'
    'one four seven nine'
    'two five seven ten'
    'two five eight ten'
    'three six eight eleven'
    'three six eight eleven';

  ${tablet()} {
    grid-template-areas:
      'one four seven'
      'one four seven'
      'two five seven'
      'two five eight'
      'three six eight'
      'three six eight'
      'nine ten eleven'
      'nine ten eleven';
  }

  ${mobile()} {
    grid-template-areas:
      'one'
      'one'
      'two'
      'two'
      'three'
      'three'
      'four'
      'four'
      'five'
      'five'
      'six'
      'six'
      'seven'
      'seven'
      'seven'
      'eight'
      'eight'
      'eight'
      'nine'
      'nine'
      'ten'
      'ten'
      'eleven'
      'eleven';
  }

  .one {
    grid-area: one;
  }

  .two {
    grid-area: two;
  }

  .three {
    grid-area: three;
  }

  .four {
    grid-area: four;
  }

  .five {
    grid-area: five;
  }

  .six {
    grid-area: six;
  }

  .seven {
    grid-area: seven;
  }

  .eight {
    grid-area: eight;
  }

  .nine {
    grid-area: nine;
  }

  .ten {
    grid-area: ten;
  }

  .eleven {
    grid-area: eleven;
  }

  .text-card {
    :hover {
      background: linear-gradient(145deg, #ff4229 0%, #bf2713 100%);
    }
  }
`;

export default PayersFeedback;
