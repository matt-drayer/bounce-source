import styled from 'styled-components';

export const StyledPostPreview = styled.div`
> a {
  img {
    width: 100%;
    margin-bottom: 32px;
    height: 550px;
    transform: translateY(-40%);
  }
}
  .author {
    font-weight: 600;
  }

  .title {
    font-size: 24px;
    color: #525360;
  }

  .body {
    padding: 0;
    margin-top: -18%;
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
