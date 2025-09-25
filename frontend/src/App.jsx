import PolygonMap from "./components/PolygonMap";
import NDVIMap from "./components/NDVIMap";
import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [polygons, setPolygons] = useState([]);

  useEffect(() => {
    const fetchPolygons = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/polygons");
        setPolygons(res.data);
      } catch (err) {
        console.error("Error fetching polygons:", err);
      }
    };
    fetchPolygons();
  }, []);

  return (
    <>
      <div className="h-2/3 w-screen">
        <PolygonMap />
      </div>
      <div className="h-1/3 w-screen">
        <NDVIMap polygons={polygons} />
      </div>
    </>
  );
}

export default App;
