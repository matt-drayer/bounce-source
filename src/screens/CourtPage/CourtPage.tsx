import * as React from 'react';
import SafeAreaPage from 'layouts/SafeAreaPage';
import CourtPageContent from './CourtPageContent';
import { Props } from './types';

export default function CourtPage(props: Props) {
  return (
    <>
      <SafeAreaPage isShowTopNav isHideSidebar isIgnoreMobileTabs>
        <CourtPageContent {...props} />
      </SafeAreaPage>
      {!!props.jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: props.jsonLd }} />
      )}
    </>
  );
}
