import { useState, useEffect } from "react";
import axios from "axios";

import PolygonMap from "./components/PolygonMap";
import NDVIMap from "./components/NDVIMap";
import BeforeAfterNDVI from "./components/BeforeAfterNDVI";
import "./App.css";

function App() {
  const [polygons, setPolygons] = useState([]);

  // Fetch all polygons from backend
  useEffect(() => {
    const fetchPolygons = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/polygons");
        setPolygons(res.data || []);
      } catch (err) {
        console.error("Error fetching polygons:", err.response?.data || err);
      }
    };
    fetchPolygons();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Map + Draw Polygon */}
      <div className="h-[55vh] w-screen">
        <PolygonMap polygons={polygons} setPolygons={setPolygons} />
      </div>

      {/* NDVI Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <NDVIMap polygons={polygons} />
        <BeforeAfterNDVI polygons={polygons} />
      </div>
    </div>
  );
}

export default App;
