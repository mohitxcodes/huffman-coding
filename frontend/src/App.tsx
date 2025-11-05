import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import UploadFile from './pages/components/UploadFile';
import PreviewFile from './pages/components/PreviewFile';

interface CompressionResult {
  originalSize: number;
  compressedSize: number;
  ratio: string;
  timeTaken: number;
  downloadUrl?: string;
}

function App() {
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);
  const [fileName, setFileName] = useState('');

  const handleReset = () => {
    console.log('Resetting compression result');
    // Clean up the blob URL to free memory
    if (compressionResult?.downloadUrl) {
      console.log('Revoking download URL');
      window.URL.revokeObjectURL(compressionResult.downloadUrl);
    }
    setCompressionResult(null);
    setFileName('');
  };

  // Log when compression result changes
  useEffect(() => {
    console.log('Compression result updated:', compressionResult);
  }, [compressionResult]);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <Routes>
          <Route
            path="/"
            element={
              <UploadFileWrapper
                onFileProcessed={(result, name) => {
                  setCompressionResult(result);
                  setFileName(name);
                }}
              />
            }
          />
          <Route
            path="/preview"
            element={
              compressionResult ? (
                <PreviewFile
                  fileName={fileName}
                  result={compressionResult}
                  onReset={handleReset}
                />
              ) : (
                <div className="flex items-center justify-center min-h-screen">
                  <div className="text-center p-6 bg-gray-800/70 rounded-xl border border-gray-700/50">
                    <p className="text-gray-300 mb-4">No file to preview. Please upload a file first.</p>
                    <button
                      onClick={() => window.location.href = '/'}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      Go to Upload
                    </button>
                  </div>
                </div>
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

// Wrapper component to access navigate hook
function UploadFileWrapper({ onFileProcessed }: { onFileProcessed: (result: CompressionResult, name: string) => void }) {
  const navigate = useNavigate();

  const handleFileProcessed = (result: CompressionResult, name: string) => {
    console.log('File processed - navigating to preview:', { name, result });
    onFileProcessed(result, name);
    navigate('/preview');
  };

  return <UploadFile onFileProcessed={handleFileProcessed} />;
}

export default App;