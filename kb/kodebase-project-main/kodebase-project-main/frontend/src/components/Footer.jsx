import React from "react";
import "../App.css";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-[#071029] via-[#07172b] to-[#071029] text-gray-200 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5 text-center md:text-left">
            <h2 className="text-4xl font-extrabold text-blue-300 drop-shadow-lg">
              Himanshu <span className="text-yellow-300">Kumar</span>
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Transforming ideas into digital reality
            </p>

            <div className="mt-6 flex items-center justify-center md:justify-start gap-3">
              {/* Social icons */}
              <a
                href="https://github.com/cjhimanshu"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="p-2 rounded-md bg-white/5 hover:bg-white/10 transition"
              >
                <svg
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 .5a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.5-1.2-1.2-1.5-1.2-1.5-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1.7 1.6 1.7 2.2.1.6.4 1 .8 1 .5 0 .9-.2 1.2-.4-2.6-.3-5.3-1.3-5.3-6a4.6 4.6 0 011.2-3.1c-.1-.3-.5-1.6.1-3.3 0 0 1-.3 3.3 1.2a11.2 11.2 0 016 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 3 .1 3.3a4.6 4.6 0 011.2 3.1c0 4.7-2.7 5.6-5.3 6 .3.3.7.8.7 1.6v2.4c0 .3.2.7.8.6A12 12 0 0012 .5z" />
                </svg>
              </a>

              <a
                href="https://www.linkedin.com/in/himanshu-kumar-02ab40249"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-2 rounded-md bg-white/5 hover:bg-white/10 transition"
              >
                <svg
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.1 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v16H0V8zm7.5 0h4.8v2.2h.1c.7-1.3 2.4-2.6 4.9-2.6C22.6 7.6 24 10.1 24 14.6V24h-5v-8.9c0-2.1 0-4.7-2.8-4.7-2.8 0-3.2 2.2-3.2 4.5V24H7.5V8z" />
                </svg>
              </a>

              <a
                href="mailto:cjhimanshu49@gmail.com"
                aria-label="Email"
                className="p-2 rounded-md bg-white/5 hover:bg-white/10 transition"
              >
                <svg
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 13.5l-11-7V19a2 2 0 002 2h18a2 2 0 002-2V6.5l-11 7zM1 5.5L12 12l11-6.5V5a2 2 0 00-2-2H3A2 2 0 001 5v.5z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">
                Languages & Frameworks used
              </h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-3">
                  <span
                    className="w-2 h-2 rounded-full bg-yellow-400 inline-block"
                    aria-hidden
                  ></span>
                  <span>JavaScript</span>
                </li>
                <li className="flex items-center gap-3">
                  <span
                    className="w-2 h-2 rounded-full bg-cyan-400 inline-block"
                    aria-hidden
                  ></span>
                  <span>React</span>
                </li>
                <li className="flex items-center gap-3">
                  <span
                    className="w-2 h-2 rounded-full bg-green-400 inline-block"
                    aria-hidden
                  ></span>
                  <span>Node.js</span>
                </li>
                <li className="flex items-center gap-3">
                  <span
                    className="w-2 h-2 rounded-full bg-teal-400 inline-block"
                    aria-hidden
                  ></span>
                  <span>Express</span>
                </li>
                <li className="flex items-center gap-3">
                  <span
                    className="w-2 h-2 rounded-full bg-sky-400 inline-block"
                    aria-hidden
                  ></span>
                  <span>Tailwind CSS</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-3">
                Quick Links
              </h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="/" className="hover:text-white">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/about" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="/services" className="hover:text-white">
                    Skills
                  </a>
                </li>
                <li>
                  <a href="/projects" className="hover:text-white">
                    Projects
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="font-medium text-white">Himanshu Kumar</li>
                <li>
                  <a
                    href="mailto:cjhimanshu49@gmail.com"
                    className="hover:text-white"
                  >
                    cjhimanshu49@gmail.com
                  </a>
                </li>
                <li>
                  <a href="tel:+919065022165" className="hover:text-white">
                    +91 90650 22165
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/cjhimanshu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/himanshu-kumar-02ab40249"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 pb-8 text-center text-sm text-gray-400">
          <div className="max-w-2xl mx-auto">
            <p>© {year} Himanshu Kumar. All rights reserved.</p>
            <p className="mt-2">
              Crafted with <span aria-hidden>❤️</span> by Himanshu Kumar
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
