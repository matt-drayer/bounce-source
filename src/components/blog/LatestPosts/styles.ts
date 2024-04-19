import styled from 'styled-components';
import { desktop, tablet } from 'styles/breakpoints';

export const Post = styled.a`
  max-width: 384px;
  width: 100%;
  box-shadow: 0px 4px 40px rgba(0, 0, 0, 0.08);
  border-radius: 6px;

  > img {
    width: 100%;
    margin-bottom: 32px;
    height: 220px;
  }

  .author {
    font-weight: 600;
  }

  .title {
    font-size: 24px;
    color: #525360;
  }

  .body {
    padding: 0 24px 24px 24px;
  }

  .tags {
    display: flex;

    > span {
      margin-right: 8px;

      :last-child {
        margin-right: 0;
      }
    }
  }
`;

export const Posts = styled.div`
  display: flex;
  justify-content: space-between;
  ${desktop()} {
    flex-wrap: wrap;
    justify-content: space-around;

    .post {
      margin-bottom: 2em;
    }
  }

  ${tablet()} {
    flex-wrap: wrap;
    justify-content: space-around;

    .post {
      margin-bottom: 2em;
    }
  }
`;
