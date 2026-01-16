import React from 'react';
import { Heart, Github, Facebook, Music } from 'lucide-react';

export const Footer: React.FC = () => {
    return (
        <footer className="w-full mt-auto border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    {/* Brand Section */}
                    <div className="flex flex-col items-center md:items-start space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
                                <Music className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">
                                My Music
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center md:text-left leading-relaxed">
                            Trải nghiệm âm nhạc đỉnh cao cùng<br />không gian không giới hạn.
                        </p>
                    </div>

                    {/* Developer Info */}
                    <div className="flex flex-col items-center justify-center space-y-3">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Developed by
                        </p>
                        <div className="group relative">
                            <div className=" абсолюte -inset-0.5 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative flex items-center gap-2 px-6 py-2 rounded-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
                                <span className="text-sm font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                    Nguyễn Nam Bắc
                                </span>
                                <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
                            </div>
                        </div>
                    </div>

                    {/* Social/Contact */}
                    <div className="flex flex-col items-center md:items-end space-y-4">
                        <div className="flex items-center gap-3">
                            <a href="#" className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="https://www.facebook.com/ng.nambac/" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/10 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-all duration-300 hover:scale-110">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="https://zalo.me/0378049162" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/10 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-all duration-300 hover:scale-110 group relative" title="Zalo: 0378049162">
                                <svg
                                    viewBox="0 0 512 512"
                                    className="w-5 h-5 fill-current"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M439.296,236.416c-17.664-83.2-86.4-131.2-180.224-131.2c-108.8,0-197.632,71.2-197.632,157.632c0,50.4,32.8,96.8,81.6,126.4c-4.8,20.8-16,56-42.4,80l-4,3.2l5.6,2.4c65.6,28,126.4,3.2,132.8,0.8c8,2.4,16,4,24,4c108.8,0,197.6-71.2,197.6-157.6C456.896,287.616,449.696,259.616,439.296,236.416z M287.6,303.6c-4.8,8.8-13.6,14.4-23.2,14.4H157.2l12-38.4l12,38.4h68l-37.6-59.2h36c13.6,0,24.8-10.4,24.8-24V214c0-13.6-11.2-24-24-24H144.4c-13.6,0-24.8,11.2-24.8,24.8v20.8c0,13.6,11.2,24,24.8,24H162l-12,37.6l-12-37.6H170.8l-36.8-58.4h-35.2c-13.6,0-24.8,11.2-24.8,24v69.6c0,13.6,11.2,24,24.8,24h35.2l36,57.6l-36-57.6h-7.2c-13.6,0-24.8,11.2-24.8,24v20.8c0,13.6,11.2,24,24.8,24h103.2c16.8,0,30.4-13.6,30.4-30.4v-46.4l-31.2,50.4h41.6c13.6,0,24-8,24-21.6v-2.4C297.2,311.6,293.2,306.8,287.6,303.6z" />
                                    <path d="M356.4,213.2h-32v70.4h32c18.4,0,32.8-14.4,32.8-35.2C389.2,227.6,374.8,213.2,356.4,213.2z" />
                                </svg>
                            </a>
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                            © {new Date().getFullYear()} Nguyễn Nam Bắc. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};
