export const fetchNDVIImage = async (geometry, startDate, endDate) => {
  // Placeholder: Generate NDVI value and image
  const ndviValue = Math.random().toFixed(2);
  const ndviMapURL = `https://via.placeholder.com/400x400.png?text=NDVI+${ndviValue}`;
  return { ndviValue, ndviMapURL };
};
