const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5001;

// ✅ PERMANENT FIX: Allow ALL origins and methods
app.use(cors());

// ✅ Add headers middleware for extra safety
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const upload = multer({ dest: uploadsDir });

// 🧩 File compression endpoint
app.post("/compress", upload.single("file"), (req, res) => {
  console.log('📥 Received compression request');
  
  const file = req.file;
  
  if (!file) {
    console.log('❌ No file uploaded');
    return res.status(400).json({ success: false, error: "No file uploaded" });
  }

  console.log('✅ File received:', file.originalname);

  try {
    const inputPath = file.path;
    const outputPath = `${inputPath}.hf`;
    
    // Execute the Huffman compression
    const { execSync } = require('child_process');
    
    console.log('🔧 Starting compression...');
    
    try {
      const execOptions = {
        stdio: ['pipe', 'pipe', 'pipe'], // Capture all output
        timeout: 30000, // 30 second timeout
      };
      
      console.log(`Executing: ./huffman c "${inputPath}" "${outputPath}"`);
      const compressionOutput = execSync(
        `./huffman c "${inputPath}" "${outputPath}"`,
        execOptions
      ).toString();
      
      console.log('Compression output:', compressionOutput);
      
      if (!fs.existsSync(outputPath)) {
        throw new Error(`Output file was not created: ${outputPath}`);
      }
      
      console.log('✅ Compression complete, sending file...');
    } catch (error) {
      console.error('❌ Compression failed:', error.message);
      if (error.stderr) {
        console.error('Error output:', error.stderr.toString());
      }
      throw new Error(`Compression failed: ${error.message}`);
    }
    
    // Send the compressed file back
    res.download(outputPath, `${file.originalname}.hf`, (err) => {
      // Cleanup: delete uploaded and compressed files after sending
      try {
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        console.log('🗑️ Cleaned up temporary files');
      } catch (cleanupErr) {
        console.error('Cleanup error:', cleanupErr);
      }
      
      if (err) {
        console.error('❌ Download error:', err);
      } else {
        console.log('✅ File sent successfully');
      }
    });
  } catch (error) {
    console.error('❌ Compression error:', error);
    
    // Cleanup on error
    try {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    } catch (cleanupErr) {
      console.error('Cleanup error:', cleanupErr);
    }
    
    res.status(500).json({ success: false, error: 'Compression failed' });
  }
});

// ✅ Health check
app.get("/", (req, res) => {
  res.json({ 
    status: "running",
    message: "Huffman backend is working!",
    endpoints: {
      compress: "POST /compress"
    }
  });
});

// ✅ Test endpoint to verify CORS
app.get("/test", (req, res) => {
  res.json({ success: true, message: "CORS is working!" });
});

// Make sure the huffman binary is executable
const { execSync } = require('child_process');
try {
  execSync('chmod +x huffman');
  console.log('✅ Made huffman binary executable');
} catch (err) {
  console.error('❌ Failed to make huffman binary executable:', err);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📁 Uploads directory: ${uploadsDir}`);
  console.log(`🌐 CORS enabled for all origins`);
  
  // Check if huffman binary exists and is executable
  try {
    const fs = require('fs');
    if (!fs.existsSync('./huffman')) {
      console.error('❌ Error: huffman binary not found. Please compile it first with:');
      console.error('   g++ -std=c++17 -O2 -o huffman huffman.cpp');
      process.exit(1);
    }
    
    // Check if we can execute the binary by checking its version or help output
    try {
      const testOutput = execSync('./huffman', { stdio: 'pipe', timeout: 2000 }).toString();
      // If we get here, the binary executed but likely showed usage
      if (testOutput.includes('Usage:')) {
        console.log('✅ Huffman binary is working (shows usage when run without args)');
      } else {
        console.log('ℹ️ Huffman binary executed but output is unexpected. Continuing anyway...');
        console.log('Output:', testOutput);
      }
    } catch (execError) {
      // If we get here, the binary executed but returned non-zero (which is expected for usage)
      if (execError.stderr && execError.stderr.toString().includes('Usage:')) {
        console.log('✅ Huffman binary is working (shows usage when run without args)');
      } else {
        console.error('❌ Error executing huffman binary:', execError.message);
        if (execError.stderr) console.error('Error output:', execError.stderr.toString());
        console.error('Please make sure the huffman binary is compiled correctly');
        process.exit(1);
      }
    }
  } catch (err) {
    console.error('❌ Error checking huffman binary:', err.message);
    process.exit(1);
  }
});