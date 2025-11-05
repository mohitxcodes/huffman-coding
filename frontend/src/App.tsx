import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import UploadFile from './pages/components/UploadFile';
import PreviewFile from './pages/components/PreviewFile';

function App() {
  const [compressionResult, setCompressionResult] = useState(null);
  const [fileName, setFileName] = useState('');

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
                  onReset={() => window.location.href = '/'}
                  onDownload={() => {
                    // TODO: Implement download logic
                    console.log('Downloading file...');
                  }}
                />
              ) : (
                <div className="flex items-center justify-center min-h-screen">
                  <div className="text-center p-6 bg-gray-800/70 rounded-xl">
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
function UploadFileWrapper({ onFileProcessed }: { onFileProcessed: (result: any, name: string) => void }) {
  const navigate = useNavigate();

  const handleFileProcessed = (result: any, name: string) => {
    onFileProcessed(result, name);
    navigate('/preview');
  };

  return <UploadFile onFileProcessed={handleFileProcessed} />;
}

export default App;
