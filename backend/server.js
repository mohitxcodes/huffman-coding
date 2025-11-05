import express from "express";
import multer from "multer";
import cors from "cors";
import { exec } from "child_process";
import fs from "fs";

const app = express();
const PORT = 5000;

app.use(cors()); // Allow React frontend to connect
app.use(express.json());

// Set up multer for file upload
const upload = multer({ dest: "uploads/" });

// Endpoint for file compression
app.post("/compress", upload.single("file"), (req, res) => {
  const inputPath = req.file.path;
  const outputPath = `compressed/${req.file.originalname}.hf`;

  // Run your Huffman C++ program
  const command = `./huffman c ${inputPath} ${outputPath}`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("Compression failed:", stderr);
      return res.status(500).json({ error: "Compression failed" });
    }

    console.log(stdout);

    // Send compressed file back
    res.download(outputPath, (err) => {
      if (err) console.error(err);
      // Clean up (optional)
      fs.unlinkSync(inputPath);
    });
  });
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));