import express from "express";

const app = express();
const PORT = 8000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from express server");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});