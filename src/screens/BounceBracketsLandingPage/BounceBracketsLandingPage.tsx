import React from 'react';
import Head from 'components/utilities/Head';
import PopppinsFont from 'components/utilities/PoppinsFont';
import Container from './Container';
import Header from './Header';

export default function Page() {
  return (
    <>
      <Head
        title="Pickleball Tournament Software"
        description="Pickleball tournaments that run themselves - Bounce Brackets is the #1 pickleball tournament software. Create, manage, and run your pickleball tournaments with ease."
      />
      <PopppinsFont />
      <Header />
      <Container />
    </>
  );
}
