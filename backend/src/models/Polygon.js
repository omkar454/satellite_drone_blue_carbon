import mongoose from "mongoose";

const polygonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    area: {
      type: Number, // hectares
      required: true,
    },
    geometry: {
      type: {
        type: String,
        enum: ["Polygon"],
        required: true,
      },
      coordinates: {
        type: [[[Number]]], // [[[lng, lat], ...]]
        required: true,
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Enable geospatial queries
polygonSchema.index({ geometry: "2dsphere" });

const Polygon = mongoose.model("Polygon", polygonSchema);
export default Polygon;
