const express = require("express");
const cors = require("cors");
const sqiRoutes = require("./routes/sqi.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "Backend Running 🚀" });
});

app.use("/api/sqi", sqiRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
