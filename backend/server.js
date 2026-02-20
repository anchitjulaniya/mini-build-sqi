const express = require("express");
const cors = require("cors");
const sqiRoutes = require("./routes/sqi.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/sqi", sqiRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));