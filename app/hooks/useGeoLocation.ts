import { useEffect, useState } from "react";

export function useGeoLocation(): string | null {
  const [location, setLocation] = useState<string | null>(null);
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation(
            `Latitude: ${pos.coords.latitude}, Longitude: ${pos.coords.longitude}`
          );
        },
        () => {
          setLocation(null);
        }
      );
    }
  }, []);
  return location;
}
