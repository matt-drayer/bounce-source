import * as React from 'react';

interface CollectedAriaAttributes extends React.AriaAttributes {
  [key: string]: any;
}

const collectAriaAttributes = (props: CollectedAriaAttributes) => {
  let ariaProps: CollectedAriaAttributes = {};

  for (let key in props) {
    if (/^(aria-)/.test(key)) {
      ariaProps[key] = props[key];
    }
  }

  return ariaProps;
};

export default collectAriaAttributes;
