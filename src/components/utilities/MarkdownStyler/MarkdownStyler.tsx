import * as React from 'react';
import styled from 'styled-components';

const Content = styled.div`
  p,
  ul,
  h1,
  h2 {
    margin-bottom: 1rem;
  }
  ul,
  li {
    list-style: disc;
    padding-left: 1rem;
  }
  a {
    text-decoration: underline;
  }
`;

interface Props {
  children: React.ReactNode;
  className?: string;
}

const MarkdownStyler: React.FC<Props> = ({ children, className }) => {
  return <Content className={className}>{children}</Content>;
};

export default MarkdownStyler;
