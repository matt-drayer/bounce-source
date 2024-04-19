import * as React from 'react';
import GoogleMapsScript from 'components/scripts/GoogleMapsScript';
import Layout from 'components/tournaments-builder/Layout';
import Head from 'components/utilities/Head';

type props = {
  eventData: any;
  isEdit: any;
};

const TournamentsBuilder = ({ isEdit, eventData }: props) => {
  return (
    <>
      <GoogleMapsScript />
      <Layout isEdit={isEdit} eventData={eventData} />
    </>
  );
};

export default TournamentsBuilder;
