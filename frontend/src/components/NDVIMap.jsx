import { useState } from "react";
import axios from "axios";

export default function NDVIMap({ polygons }) {
  const [selectedPolygonId, setSelectedPolygonId] = useState("");
  const [ndviResult, setNdviResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePolygonChange = (e) => {
    setSelectedPolygonId(e.target.value);
    setNdviResult(null);
  };

  const fetchNDVI = async () => {
    if (!selectedPolygonId) {
      alert("Please select a polygon first!");
      return;
    }

    const polygon = polygons.find((p) => p._id === selectedPolygonId);
    if (!polygon) return;

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/ndvi", {
        polygonId: polygon._id,
        geometry: polygon.geometry,
        startDate: "2025-09-01",
        endDate: "2025-09-25",
      });

      setNdviResult(res.data);
    } catch (err) {
      console.error("Error fetching NDVI:", err.response?.data || err);
      alert(
        "Error fetching NDVI: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded shadow-md max-w-xl mx-auto">
      <h2 className="text-lg font-semibold mb-2">NDVI Analysis</h2>

      <select
        className="border px-2 py-1 mb-2 w-full"
        value={selectedPolygonId}
        onChange={handlePolygonChange}
      >
        <option value="">Select a polygon</option>
        {(polygons || []).map((poly) => (
          <option key={poly._id} value={poly._id}>
            {poly.name}
          </option>
        ))}
      </select>

      <button
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        onClick={fetchNDVI}
        disabled={loading}
      >
        {loading ? "Calculating..." : "Get NDVI"}
      </button>

      {ndviResult && (
        <div className="mt-4">
          <p>
            <strong>Average NDVI Value:</strong> {ndviResult.ndviValue}
          </p>
          <img
            src={ndviResult.ndviMapURL}
            alt="NDVI Map"
            className="mt-2 border rounded"
          />
        </div>
      )}
    </div>
  );
}
