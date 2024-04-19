import styled from 'styled-components';

export const StyledPost = styled.div`
  max-width: 384px;
  width: 100%;
  box-shadow: 0 4px 40px rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  cursor: pointer;

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
