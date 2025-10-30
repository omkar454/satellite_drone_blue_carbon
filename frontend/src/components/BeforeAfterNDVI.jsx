import { useState } from "react";
import axios from "axios";

export default function BeforeAfterNDVI({ polygons }) {
  const [selectedPolygonId, setSelectedPolygonId] = useState("");
  const [beforeFile, setBeforeFile] = useState(null);
  const [afterFile, setAfterFile] = useState(null);
  const [beforeDate, setBeforeDate] = useState("2025-09-01");
  const [afterDate, setAfterDate] = useState("2025-09-25");
  const [ndviData, setNdviData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePolygonChange = (e) => {
    setSelectedPolygonId(e.target.value);
    setNdviData(null);
  };

  const handleBeforeFile = (e) => setBeforeFile(e.target.files[0]);
  const handleAfterFile = (e) => setAfterFile(e.target.files[0]);

  const uploadToPinata = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(
      "http://localhost:5000/api/ipfs/upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return res.data.url;
  };

  const handleSubmit = async () => {
    if (!selectedPolygonId) return alert("Select a polygon first!");
    if (!beforeFile || !afterFile)
      return alert("Upload both before & after images!");

    const polygon = polygons.find((p) => p._id === selectedPolygonId);
    if (!polygon) return;

    setLoading(true);
    try {
      // 1️⃣ Upload before & after images
      const beforeURL = await uploadToPinata(beforeFile);
      const afterURL = await uploadToPinata(afterFile);

      // 2️⃣ Send to backend for NDVI comparison
      const res = await axios.post("http://localhost:5000/api/ndvi/compare", {
        polygonId: polygon._id,
        geometry: polygon.geometry,
        beforeDate,
        afterDate,
        beforeMapURL: beforeURL,
        afterMapURL: afterURL,
      });

      setNdviData(res.data);
    } catch (err) {
      console.error("NDVI comparison error:", err.response?.data || err);
      alert(
        "Failed to save NDVI comparison: " +
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
        <input
          type="file"
          accept="image/*"
          onChange={handleBeforeFile}
          className="border px-2 py-1 w-full"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleAfterFile}
          className="border px-2 py-1 w-full"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Uploading..." : "Get Comparison"}
      </button>

      {ndviData && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
          <div>
            <p>
              <strong>Before ({formatDate(ndviData.beforeDate)})</strong>
            </p>
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
            <img
              src={ndviData.afterMapURL}
              alt="After NDVI"
              className="mx-auto border rounded"
            />
          </div>
          <div className="col-span-2 mt-2">
            <p>
              <strong>Growth (after - before): </strong>
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
