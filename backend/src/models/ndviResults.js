import mongoose from "mongoose";

const ndviResultSchema = new mongoose.Schema(
  {
    polygonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Polygon",
      required: true,
    },
    startDate: { type: Date },
    endDate: { type: Date },
    ndviValue: { type: Number }, // average NDVI
    ndviMapURL: { type: String }, // map image URL
  },
  { timestamps: true }
);

const NDVIResult = mongoose.model("NDVIResult", ndviResultSchema);
export default NDVIResult;
