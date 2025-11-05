import { motion } from 'framer-motion';
import { FileText, Download, Clock, FileDown, FileUp, BarChart2, CheckCircle2, X, RotateCcw } from 'lucide-react';

interface CompressionResult {
    originalSize: number;
    compressedSize: number;
    ratio: number;
    timeTaken: number;
    downloadUrl?: string;
}

interface PreviewFileProps {
    fileName: string;
    result: CompressionResult;
    onReset: () => void;
    onDownload: () => void;
}

export default function PreviewFile({ fileName, result, onReset, onDownload }: PreviewFileProps) {
    const formatBytes = (bytes: number, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    const getSavingsPercentage = (original: number, compressed: number) => {
        return ((original - compressed) / original * 100).toFixed(2);
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
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg">
                        <BarChart2 className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-400 mb-2">
                        Compression Complete
                    </h2>
                    <p className="text-gray-400 max-w-md mx-auto">
                        Your file has been successfully compressed
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="relative bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-700/50"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5"></div>
                    <div className="relative z-10 p-6">
                        {/* File Info */}
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl border border-gray-700/50">
                                    <FileText className="w-6 h-6 text-green-400" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-white truncate max-w-xs">
                                        {fileName}
                                    </h3>
                                    <div className="flex items-center space-x-3 mt-1">
                                        <span className="text-sm text-gray-400">
                                            {formatBytes(result.originalSize)}
                                        </span>
                                        <span className="text-xs px-2 py-0.5 bg-gray-700/50 text-gray-300 rounded-full">
                                            Original
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={onReset}
                                className="p-1.5 hover:bg-gray-700/50 rounded-lg transition-colors text-gray-400 hover:text-white"
                                aria-label="Reset"
                            >
                                <RotateCcw className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-blue-500/10 rounded-lg">
                                        <FileUp className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Original Size</p>
                                        <p className="text-white font-medium">{formatBytes(result.originalSize)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-green-500/10 rounded-lg">
                                        <FileDown className="w-5 h-5 text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Compressed Size</p>
                                        <p className="text-white font-medium">{formatBytes(result.compressedSize)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-purple-500/10 rounded-lg">
                                        <BarChart2 className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Compression Ratio</p>
                                        <p className="text-white font-medium">{result.ratio}x</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-amber-500/10 rounded-lg">
                                        <Clock className="w-5 h-5 text-amber-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Time Taken</p>
                                        <p className="text-white font-medium">{result.timeTaken}ms</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Savings Badge */}
                        <div className="mb-6">
                            <div className="relative pt-1">
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                                            You saved {getSavingsPercentage(result.originalSize, result.compressedSize)}%
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-semibold inline-block text-green-400">
                                            {getSavingsPercentage(result.originalSize, result.compressedSize)}% smaller
                                        </span>
                                    </div>
                                </div>
                                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
                                    <div
                                        style={{ width: `${getSavingsPercentage(result.originalSize, result.compressedSize)}%` }}
                                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-green-500 to-emerald-500"
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                            <button
                                onClick={onReset}
                                className="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors flex items-center justify-center space-x-2"
                            >
                                <X className="w-4 h-4" />
                                <span>New File</span>
                            </button>

                            <button
                                onClick={onDownload}
                                className="px-5 py-2.5 text-sm font-medium text-white rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 hover:shadow-lg hover:shadow-green-500/20"
                            >
                                <Download className="w-4 h-4" />
                                <span>Download Compressed File</span>
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Additional Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-6 text-center"
                >
                    <p className="text-sm text-gray-500">
                        Your file is processed securely and will be deleted from our servers after download
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}
