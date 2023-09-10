const express = require("express");
const app = express();
const cors = require("cors");

const port = 8080; // Choose your desired port
const { calculateDepthRate } = require("./depthRateCalculator");
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Use the API routes
app.get("/depth-rate", async (req, res) => {
  const { startDate, endDate, pageUrl } = req.query;

  try {
    const depthRateData = await calculateDepthRate(startDate, endDate, pageUrl);
    res.json(depthRateData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
