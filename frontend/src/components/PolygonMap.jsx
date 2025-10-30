import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  Polygon,
  Popup,
  useMap,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import leafletImage from "leaflet-image";
import axios from "axios";

export default function PolygonMap({ polygons, setPolygons }) {
  // Hook to access the Leaflet map instance
  const MapHandler = () => {
    const map = useMap();
    return null;
  };

  const onCreated = async (e) => {
    const map = e.target._map; // Leaflet map instance
    const { layer } = e;
    let latlngs = layer.getLatLngs();
    if (Array.isArray(latlngs[0][0])) latlngs = latlngs[0];
    else latlngs = latlngs[0];

    if (latlngs.length < 3)
      return alert("Polygon must have at least 3 points!");

    let coordinates = latlngs.map((latlng) => [latlng.lng, latlng.lat]);
    if (
      coordinates[0][0] !== coordinates[coordinates.length - 1][0] ||
      coordinates[0][1] !== coordinates[coordinates.length - 1][1]
    ) {
      coordinates.push(coordinates[0]);
    }

    const geometry = { type: "Polygon", coordinates: [coordinates] };
    const polygonName = `Polygon ${Date.now()}`;

    try {
      if (!map) throw new Error("Map instance not found");

      // Capture map snapshot
      leafletImage(map, async (err, canvas) => {
        if (err) return alert("Failed to capture map");

        canvas.toBlob(async (blob) => {
          if (!blob) return alert("Failed to generate image blob");

          const file = new File([blob], `${polygonName}.png`, {
            type: "image/png",
          });
          const formData = new FormData();
          formData.append("file", file);

          // Upload snapshot to Pinata
          const ipfsRes = await axios.post(
            "http://localhost:5000/api/ipfs/upload",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );

          const snapshotURL = ipfsRes.data.url;

          // Save polygon with snapshot URL
          const polygonRes = await axios.post(
            "http://localhost:5000/api/polygons",
            {
              name: polygonName,
              geometry,
              snapshotURL,
            }
          );

          setPolygons((prev) => [...prev, polygonRes.data]);
        });
      });
    } catch (err) {
      console.error("Pinata upload error:", err);
      alert("Failed to upload snapshot to Pinata");
    }
  };

  return (
    <MapContainer
      center={[19.076, 72.8777]}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapHandler />
      <FeatureGroup>
        <EditControl
          position="topright"
          draw={{
            rectangle: false,
            circle: false,
            marker: false,
            polyline: false,
            circlemarker: false,
          }}
          onCreated={onCreated}
        />
      </FeatureGroup>

      {(polygons || []).map((poly) => (
        <Polygon
          key={poly._id}
          positions={poly.geometry.coordinates[0].map(([lng, lat]) => [
            lat,
            lng,
          ])}
          pathOptions={{ color: "blue" }}
        >
          <Popup>
            <strong>{poly.name}</strong>
            <br />
            Area: {poly.area?.toFixed(2) || 0} hectares
            <br />
            {poly.snapshotURL && (
              <img
                src={poly.snapshotURL}
                alt="Snapshot"
                className="mt-1 border w-full"
              />
            )}
          </Popup>
        </Polygon>
      ))}
    </MapContainer>
  );
}
