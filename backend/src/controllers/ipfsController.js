import axios from "axios";
import FormData from "form-data";

export const uploadToPinata = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const formData = new FormData();
    formData.append("file", req.file.buffer, req.file.originalname);

    const pinataRes = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: "Infinity",
        headers: {
          ...formData.getHeaders(),
          pinata_api_key: process.env.PINATA_API_KEY,
          pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
        },
      }
    );

    const ipfsHash = pinataRes.data.IpfsHash;
    const ipfsURL = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

    res.json({ url: ipfsURL, hash: ipfsHash });
  } catch (err) {
    console.error("Pinata upload error:", err.message);
    res.status(500).json({ message: err.message });
  }
};
