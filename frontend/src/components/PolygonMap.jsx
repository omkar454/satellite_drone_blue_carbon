import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  Polygon,
  Popup,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { useEffect } from "react";
import axios from "axios";

export default function PolygonMap({ polygons, setPolygons }) {
  // Handle polygon creation
  const onCreated = async (e) => {
    const { layer } = e;
    let latlngs = layer.getLatLngs();

    // Handle nested array structure from Leaflet
    if (Array.isArray(latlngs[0][0])) latlngs = latlngs[0];
    else latlngs = latlngs[0];

    // Ensure at least 3 points
    if (latlngs.length < 3) {
      alert("Polygon must have at least 3 points!");
      return;
    }

    // Convert to GeoJSON [lng, lat]
    let coordinates = latlngs.map((latlng) => [latlng.lng, latlng.lat]);

    // Close polygon loop
    if (
      coordinates[0][0] !== coordinates[coordinates.length - 1][0] ||
      coordinates[0][1] !== coordinates[coordinates.length - 1][1]
    ) {
      coordinates.push(coordinates[0]);
    }

    const geometry = { type: "Polygon", coordinates: [coordinates] };
    const newPolygon = { name: `Polygon ${Date.now()}`, geometry };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/polygons",
        newPolygon
      );
      setPolygons((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Error saving polygon:", err.response?.data || err);
      alert(
        "Error saving polygon: " + (err.response?.data?.message || err.message)
      );
    }
  };

  return (
    <MapContainer
      center={[19.076, 72.8777]}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

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
          </Popup>
        </Polygon>
      ))}
    </MapContainer>
  );
}
