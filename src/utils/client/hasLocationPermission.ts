export const hasLocationPermission = async () => {
  if (!navigator.geolocation) {
    return false;
  }

  try {
    const geoPermissionQuery = await navigator.permissions.query({
      name: 'geolocation',
    });

    return geoPermissionQuery.state === 'granted';
  } catch (_error) {
    return false;
  }
};
