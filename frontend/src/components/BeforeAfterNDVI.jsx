import { useState } from "react";
import axios from "axios";

export default function BeforeAfterNDVI({ polygons }) {
  const [selectedPolygonId, setSelectedPolygonId] = useState("");
  const [beforeDate, setBeforeDate] = useState("2025-09-01");
  const [afterDate, setAfterDate] = useState("2025-09-25");
  const [ndviData, setNdviData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePolygonChange = (e) => {
    setSelectedPolygonId(e.target.value);
    setNdviData(null);
  };

  const fetchNDVIComparison = async () => {
    if (!selectedPolygonId) {
      alert("Select a polygon first!");
      return;
    }

    const polygon = polygons.find((p) => p._id === selectedPolygonId);
    if (!polygon) return;

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/ndvi/compare", {
        polygonId: polygon._id,
        geometry: polygon.geometry,
        beforeDate,
        afterDate,
      });
      setNdviData(res.data);
    } catch (err) {
      console.error("NDVI comparison error:", err.response?.data || err);
      alert(
        "Error fetching NDVI comparison: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

  return (
    <div className="p-4 bg-gray-50 rounded shadow-md max-w-4xl mx-auto">
      <h2 className="text-lg font-semibold mb-2">NDVI Before vs After</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
        <select
          className="border px-2 py-1 w-full"
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

        <input
          type="date"
          className="border px-2 py-1"
          value={beforeDate}
          onChange={(e) => setBeforeDate(e.target.value)}
        />

        <input
          type="date"
          className="border px-2 py-1"
          value={afterDate}
          onChange={(e) => setAfterDate(e.target.value)}
        />
      </div>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={fetchNDVIComparison}
        disabled={loading}
      >
        {loading ? "Calculating..." : "Get Comparison"}
      </button>

      {ndviData && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
          <div>
            <p>
              <strong>Before ({formatDate(ndviData.beforeDate)})</strong>
            </p>
            <p className="mb-2">NDVI: {ndviData.beforeNDVI}</p>
            <img
              src={ndviData.beforeMapURL}
              alt="Before NDVI"
              className="mx-auto border rounded"
            />
          </div>

          <div>
            <p>
              <strong>After ({formatDate(ndviData.afterDate)})</strong>
            </p>
            <p className="mb-2">NDVI: {ndviData.afterNDVI}</p>
            <img
              src={ndviData.afterMapURL}
              alt="After NDVI"
              className="mx-auto border rounded"
            />
          </div>

          <div className="col-span-2 mt-2">
            <p>
              <strong>Growth (after - before):</strong>{" "}
              <span
                className={
                  ndviData.growth >= 0 ? "text-green-600" : "text-red-600"
                }
              >
                {ndviData.growth}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
