import { Link } from "react-router-dom";
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiInstagram, FiTwitter } from "react-icons/fi";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-base-300 text-base-content py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex flex-col items-start gap-3 mb-4">
              <img src="/src/assets/bookC.webp" alt="BookCourier" className="h-10 w-10 rounded-lg object-contain bg-transparent p-1" />
              <h2 className="text-2xl font-bold">BookCourier</h2>
            </div>
            <p className="text-base-content/70">
              Your favorite books delivered to your doorstep from local libraries.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="link link-hover">Home</Link></li>
              <li><Link to="/all-books" className="link link-hover">All Books</Link></li>
              <li><Link to="/request-delivery" className="link link-hover">Request Delivery</Link></li>
              <li><Link to="/dashboard" className="link link-hover">Dashboard</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3 text-base-content/70">
              <div className="flex items-center gap-3">
                <FiMail className="w-5 h-5" />
                <span>support@bookcourier.com</span>
              </div>
              <div className="flex items-center gap-3">
                <FiPhone className="w-5 h-5" />
                <span>+880 123 456 7890</span>
              </div>
              <div className="flex items-center gap-3">
                <FiMapPin className="w-5 h-5" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="btn btn-circle btn-outline hover:bg-blue-600 hover:text-white">
                <FiFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="btn btn-circle btn-outline hover:bg-pink-600 hover:text-white">
                <FiInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="btn btn-circle btn-outline hover:bg-black hover:text-white">
                {/* NEW X LOGO */}
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="divider my-8"></div>

        <div className="text-center text-base-content/60">
          <p>&copy; {currentYear} BookCourier. All rights reserved. Made by TheLunatic1</p>
        </div>
      </div>
    </footer>
  );
}