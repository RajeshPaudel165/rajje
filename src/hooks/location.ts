import { useState, useEffect } from "react";
import * as Location from "expo-location";

export function useCurrentLocation() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000, // Update every 10 seconds
          distanceInterval: 1, // Update every 10 meters
        },
        (loc) =>{setLocation(loc);},
        );
      
    })();
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return { location, errorMsg };
}