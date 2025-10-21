"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ArrowRight, LogIn, Menu, UserPlus, X } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 sm:top-2 w-full bg-white md:top-4 backdrop-blur-md border-b border-gray-100 shadow-sm"
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16">
          <span className="text-2xl font-bold font-playfair text-white-900">
            AIxSocial_x
          </span>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/auth/login">
              <Button
                variant="ghost"
                className="justify-start cursor-pointer font-inter text-lg transition-all duration-500 hover:scale-105 shadow-md font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-gray-900 transition-all duration-500 hover:scale-105 cursor-pointer hover:bg-gray-800 text-white px-4 py-2 text-lg font-inter font-medium">
                Get Stared
                <ArrowRight className="w-4 h-4 mr-2 mt-0.6" />
              </Button>
            </Link>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 py-4"
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
                <Link href="/auth/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start font-inter font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button
                    className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 font-inter font-medium rounded-full w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
