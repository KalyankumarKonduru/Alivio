// src/components/LocationInput.js
import React, { useEffect, useRef, useState } from 'react';
import { TextField } from '@material-ui/core';

const LocationInput = ({ onLocationChange }) => {
  const inputRef = useRef(null);
  const [location, setLocation] = useState('');

  useEffect(() => {
    const loadGoogleMaps = () => {
      const googleApiKey = process.env.REACT_APP_GOOGLE_API_KEY;
      if (!googleApiKey) {
        console.error('Google API key is missing. Please set REACT_APP_GOOGLE_API_KEY in your .env file.');
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places`;
      script.async = true;
      script.onload = initAutocomplete;
      script.onerror = () => console.error('Failed to load Google Maps API');
      document.body.appendChild(script);
    };

    const initAutocomplete = () => {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['geocode'], // Restrict to geographical locations
        fields: ['address_components', 'geometry', 'formatted_address'], // Fields to return
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        const locationData = {
          address: place.formatted_address || '',
          city: '',
          state: '',
          country: '',
          zip: '',
          lat: place.geometry?.location?.lat() || null,
          lng: place.geometry?.location?.lng() || null,
        };

        // Extract address components (city, state, country, zip)
        place.address_components.forEach((component) => {
          if (component.types.includes('locality')) {
            locationData.city = component.long_name;
          }
          if (component.types.includes('administrative_area_level_1')) {
            locationData.state = component.long_name;
          }
          if (component.types.includes('country')) {
            locationData.country = component.long_name;
          }
          if (component.types.includes('postal_code')) {
            locationData.zip = component.long_name;
          }
        });

        setLocation(locationData.address);
        onLocationChange(locationData); // Pass the location data to the parent component
      });
    };

    loadGoogleMaps();
  }, [onLocationChange]);

  return (
    <TextField
      inputRef={inputRef}
      label="Location"
      value={location}
      onChange={(e) => setLocation(e.target.value)}
      fullWidth
      variant="outlined"
      placeholder="Enter a location"
    />
  );
};

export default LocationInput;