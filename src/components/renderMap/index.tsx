import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";

interface IRenderMapProps {
  userLat: number;
  userLon: number;
}

mapboxgl.accessToken =
  "pk.eyJ1Ijoiam9lbGZpbnRhbiIsImEiOiJjbDFieDA3d2swMjF3M2pvMnR6NGtkZnp4In0.5_kd5BU2Pk4rF2xlwaS-Mw";

function RenderMap(props:IRenderMapProps) {
  const mapContainer = useRef(null as any);
  const map = useRef(null as any);
  const [lng, setLng] = useState(76.2460675);
  const [lat, setLat] = useState(9.9617373);
  const [zoom, setZoom] = useState(16);
  let mark = new mapboxgl.Marker({})

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });
  });

  useEffect(() => {
    map.current
    mark.setLngLat([props.userLon, props.userLat]);
    mark.addTo(map.current);
  }, [props.userLat]);

  return (
    <div>
      <div
        ref={mapContainer}
        className="map-container"
        style={{ height: "400px", width: "100%" }}
      />
    </div>
  );
}

export default RenderMap;
