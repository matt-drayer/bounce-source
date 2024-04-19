export const extractAddressParts = (placeResult: google.maps.places.PlaceResult) => {
  const addressComponents = placeResult.address_components || [];
  let street = '';
  let city = '';
  let state = '';
  let zipcode = '';

  addressComponents.forEach((component) => {
    const componentType = component.types[0];

    if (componentType === 'street_number' || componentType === 'route') {
      street = `${component.long_name} ${street}`;
    }

    if (componentType === 'locality') {
      city = component.long_name;
    }

    if (componentType === 'administrative_area_level_1') {
      state = component.short_name;
    }

    if (componentType === 'postal_code') {
      zipcode = component.long_name;
    }
  });

  return {
    street,
    city,
    state,
    zipcode,
  };
};
