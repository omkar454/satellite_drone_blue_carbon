import mongoose from "mongoose";

const polygonSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    area: { type: Number, required: true },
    geometry: {
      type: { type: String, enum: ["Polygon"], required: true },
      coordinates: { type: [[[Number]]], required: true },
    },
    snapshotURL: { type: String }, // store Pinata URL
  },
  { timestamps: true }
);

polygonSchema.index({ geometry: "2dsphere" });
export default mongoose.model("Polygon", polygonSchema);
