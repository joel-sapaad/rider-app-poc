import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const LiveTracking = () => {
  const user = useSelector((state: RootState) => state.user);
  const [coords, setCoords] = useState({ lat: 0, lon: 0 });

  useEffect(() => {
    let id: any, target: any, options: any;
    
    function success(pos:GeolocationPosition) {
      let {latitude,longitude} = pos.coords
      setCoords({ lat: latitude, lon: longitude });
      let crd = pos.coords;
      console.log(crd);
      if (
        target.latitude === crd.latitude &&
        target.longitude === crd.longitude
      ) {
        console.log("Congratulations, you reached the target");
        navigator.geolocation.clearWatch(id);
      }
    }

    function error(err: any) {
      console.warn("ERROR(" + err.code + "): " + err.message);
    }

    target = {
      latitude: 52.520007,
      longitude: 13.404954,
    };

    options = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 0,
    };

    id = navigator.geolocation.watchPosition(success, error, options);
  }, []);
  return (
    <div>
      <h1>Welcome {user.email}</h1>
      <h2>Live tracking test</h2>
      <h3>Latitude: {coords.lat}</h3>
      <h3>Longitude: {coords.lon}</h3>
    </div>
  );
};

export default LiveTracking;
