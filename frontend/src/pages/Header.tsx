import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';

export default function Header() {
    return (
        <header className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo and Name */}
                    <div className="flex-shrink-0 flex items-center">
                        <div className="flex items-center space-x-2">
                            <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg">
                                <svg
                                    className="w-6 h-6 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                                    />
                                </svg>
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                                File Compression
                            </span>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center space-x-4">
                        <a
                            href="https://github.com/mohitxcodes"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700/50 transition-colors duration-200"
                            aria-label="GitHub"
                        >
                            <Github className="w-5 h-5" />
                        </a>
                        <a
                            href="https://twitter.com/mohitxcodes"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-blue-400 p-2 rounded-full hover:bg-gray-700/50 transition-colors duration-200"
                            aria-label="Twitter"
                        >
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a
                            href="https://linkedin.com/in/mohitxcodes"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-blue-500 p-2 rounded-full hover:bg-gray-700/50 transition-colors duration-200"
                            aria-label="LinkedIn"
                        >
                            <Linkedin className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
}
