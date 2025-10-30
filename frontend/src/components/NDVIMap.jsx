import { useState } from "react";
import axios from "axios";

export default function NDVIMap({ polygons }) {
  const [selectedPolygonId, setSelectedPolygonId] = useState("");
  const [ndviImageFile, setNdviImageFile] = useState(null);
  const [ndviResult, setNdviResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePolygonChange = (e) => {
    setSelectedPolygonId(e.target.value);
    setNdviResult(null);
  };

  const handleFileChange = (e) => {
    setNdviImageFile(e.target.files[0]);
  };

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

    return res.data.url; // Pinata URL
  };

  const handleSubmit = async () => {
    if (!selectedPolygonId) return alert("Select a polygon first!");
    if (!ndviImageFile) return alert("Select an NDVI image file first!");

    const polygon = polygons.find((p) => p._id === selectedPolygonId);
    if (!polygon) return;

    setLoading(true);
    try {
      // 1️⃣ Upload image to Pinata
      const pinataURL = await uploadToPinata(ndviImageFile);

      // 2️⃣ Send NDVI info to backend
      const res = await axios.post("http://localhost:5000/api/ndvi", {
        polygonId: polygon._id,
        geometry: polygon.geometry,
        startDate: "2025-09-01",
        endDate: "2025-09-25",
        pinataURL,
      });

      setNdviResult(res.data);
    } catch (err) {
      console.error("NDVI submit error:", err.response?.data || err);
      alert(
        "Failed to save NDVI: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded shadow-md max-w-xl mx-auto">
      <h2 className="text-lg font-semibold mb-2">
        Upload NDVI Satellite Image
      </h2>

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

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="border px-2 py-1 mb-2 w-full"
      />

      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload NDVI"}
      </button>

      {ndviResult && (
        <div className="mt-4 text-center">
          <p>
            <strong>NDVI Value:</strong> {ndviResult.ndviValue}
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
