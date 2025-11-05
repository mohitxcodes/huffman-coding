import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, Loader2, CheckCircle2, FileUp, FileDown, Sparkles, Play } from 'lucide-react';

interface FileState {
    file: File | null;
    isUploading: boolean;
    isComplete: boolean;
    error: string | null;
}

interface UploadFileProps {
    onFileProcessed: (result: any, fileName: string) => void;
}

interface FileState {
    file: File | null;
    isUploading: boolean;
    isComplete: boolean;
    error: string | null;
}

export default function UploadFile({ onFileProcessed }: UploadFileProps) {
    const [fileState, setFileState] = useState<FileState>({
        file: null,
        isUploading: false,
        isComplete: false,
        error: null,
    });
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDragging) setIsDragging(true);
    }, [isDragging]);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
                setFileState({
                    file,
                    isUploading: false,
                    isComplete: false,
                    error: null,
                });
            } else {
                setFileState(prev => ({
                    ...prev,
                    error: 'Please upload a .txt file',
                }));
            }
        }
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
                setFileState({
                    file,
                    isUploading: false,
                    isComplete: false,
                    error: null,
                });
            } else {
                setFileState(prev => ({
                    ...prev,
                    error: 'Please upload a .txt file',
                }));
            }
        }
    };

    const handleUpload = async () => {
        if (!fileState.file) return;

        setFileState(prev => ({ ...prev, isUploading: true, error: null }));

        try {
            // Simulate file processing
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Create a mock result object
            const result = {
                originalSize: fileState.file.size,
                compressedSize: Math.floor(fileState.file.size * 0.6), // 40% compression for demo
                ratio: (fileState.file.size / (fileState.file.size * 0.6)).toFixed(1),
                timeTaken: 1200, // ms
            };

            // Call the parent handler with the result
            onFileProcessed(result, fileState.file.name);

        } catch (error) {
            setFileState(prev => ({
                ...prev,
                isUploading: false,
                error: 'Upload failed. Please try again.',
            }));
        }
    };

    const resetUpload = () => {
        setFileState({
            file: null,
            isUploading: false,
            isComplete: false,
            error: null,
        });
    };

    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl mx-auto"
            >
                <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                        File Compression
                    </h2>
                    <p className="text-gray-400 max-w-md mx-auto">
                        Upload your text file and let our Huffman Coding algorithm compress it efficiently
                    </p>
                </motion.div>

                <AnimatePresence mode="wait">
                    {!fileState.file ? (
                        <motion.div
                            key="upload-area"
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={variants}
                            className={`relative bg-gray-800/50 backdrop-blur-sm border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${isDragging
                                ? 'border-blue-400 bg-blue-900/20 shadow-lg scale-[1.02]'
                                : 'border-gray-700 hover:border-blue-500/70 hover:shadow-xl hover:scale-[1.01]'
                                }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                            <div className="relative z-10 flex flex-col items-center justify-center space-y-5">
                                <motion.div
                                    animate={isDragging ? { y: [0, -5, 0] } : { y: 0 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                    className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl border border-gray-700/50"
                                >
                                    <FileUp className="w-8 h-8 text-blue-400" />
                                </motion.div>

                                <div className="space-y-2">
                                    <p className="text-lg font-medium text-white">
                                        {isDragging ? 'Drop to upload' : 'Drag & drop your file'}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        or
                                    </p>
                                </div>

                                <label className="cursor-pointer group">
                                    <span className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 group-hover:shadow-lg group-hover:shadow-blue-500/20">
                                        <Upload className="w-4 h-4" />
                                        <span>Browse Files</span>
                                    </span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept=".txt,text/plain"
                                        onChange={handleFileChange}
                                    />
                                </label>

                                <p className="text-xs text-gray-500">
                                    Supported format: .txt (Max 10MB)
                                </p>

                                <div className="flex items-center justify-center space-x-4 pt-4">
                                    <div className="flex items-center text-xs text-gray-500">
                                        <div className="w-2 h-2 bg-green-400 rounded-full mr-1.5"></div>
                                        Secure Upload
                                    </div>
                                    <div className="h-4 w-px bg-gray-700"></div>
                                    <div className="flex items-center text-xs text-gray-500">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-1.5"></div>
                                        Fast Processing
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="file-preview"
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={variants}
                            className="relative bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-700/50"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
                            <div className="relative z-10 p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-gray-700/50">
                                            <FileText className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-white truncate max-w-xs">
                                                {fileState.file.name}
                                            </h3>
                                            <div className="flex items-center mt-1 space-x-3">
                                                <span className="text-sm text-gray-400">
                                                    {(fileState.file.size / 1024).toFixed(2)} KB
                                                </span>
                                                <span className="text-xs px-2 py-0.5 bg-gray-700/50 text-gray-300 rounded-full">
                                                    {fileState.file.type || 'text/plain'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={resetUpload}
                                        className="p-1.5 hover:bg-gray-700/50 rounded-lg transition-colors text-gray-400 hover:text-white"
                                        aria-label="Remove file"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {fileState.error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-4 p-3 bg-red-900/30 border border-red-800/50 text-red-300 text-sm rounded-lg flex items-start space-x-2"
                                    >
                                        <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                        <span>{fileState.error}</span>
                                    </motion.div>
                                )}

                                {fileState.isComplete && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="mt-4 p-3 bg-green-900/20 border border-green-800/50 text-green-300 text-sm rounded-lg flex items-center space-x-2"
                                    >
                                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                                        <span>File compressed successfully! Ready to download.</span>
                                    </motion.div>
                                )}

                                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
                                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                                        {!fileState.isComplete && !fileState.isUploading && (
                                            <div className="flex items-center text-sm text-gray-400">
                                                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                                                Ready to compress
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                                        <button
                                            onClick={resetUpload}
                                            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors flex items-center justify-center space-x-2"
                                        >
                                            <X className="w-4 h-4" />
                                            <span>Change File</span>
                                        </button>

                                        <button
                                            onClick={handleUpload}
                                            disabled={!fileState.file || fileState.isUploading}
                                            className={`px-5 py-2 text-sm font-medium text-white rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 ${fileState.isUploading
                                                    ? 'bg-blue-600/70 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 hover:shadow-lg hover:shadow-blue-500/20'
                                                }`}
                                        >
                                            {fileState.isUploading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    <span>Processing...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Play className="w-4 h-4" />
                                                    <span>Start Compression</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
