import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-base-200 text-base-content py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Logo & Description */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex flex-col items-start gap-3 mb-4">
              <img
                src="/src/assets/bookC.webp" // have to change logo later
                alt="BookCourier"
                className="h-12 w-12 rounded-lg object-contain bg-white p-1"
              />
              <span className="text-2xl font-bold">BookCourier</span>
            </div>
            <p className="text-sm text-center md:text-left opacity-80 max-w-xs">
              Your trusted library-to-home book delivery service across the city.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="link link-hover">Home</a></li>
              <li><a href="/all-books" className="link link-hover">All Books</a></li>
              <li><a href="/request-delivery" className="link link-hover">Request Delivery</a></li>
              <li><a href="/dashboard" className="link link-hover">Dashboard</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm opacity-80">
              <li>support@bookcourier.com</li>
              <li>+880123456789</li>
              <li>Dhaka, Bangladesh</li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-circle hover:bg-blue-600 hover:text-white transition"
              >
                <FiFacebook className="w-6 h-6" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-circle hover:bg-black hover:text-white transition"
              >
                <FiTwitter className="w-6 h-6" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-circle hover:bg-pink-600 hover:text-white transition"
              >
                <FiInstagram className="w-6 h-6" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-circle hover:bg-blue-700 hover:text-white transition"
              >
                <FiLinkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-10 pt-8 border-t border-base-300 text-sm opacity-70">
          © {new Date().getFullYear()} BookCourier – All Rights Reserved
        </div>
      </div>
    </footer>
  );
}