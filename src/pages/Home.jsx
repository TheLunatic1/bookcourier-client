// src/pages/Home.jsx
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Link } from "react-router-dom";
import API from "../services/api";
import { FiArrowRight, FiCheckCircle, FiTruck, FiBookOpen, FiClock } from "react-icons/fi";

// Fix Leaflet icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function Home() {
  const [latestBooks, setLatestBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestBooks = async () => {
      try {
        const res = await API.get("/books");
        // Get only available books, sort by newest, take 6
        const available = res.data
          .filter(book => book.isAvailable)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 6);
        setLatestBooks(available);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestBooks();
  }, []);

  const slides = [
    {
      title: "Get Books Delivered to Your Door",
      desc: "Borrow from local libraries without leaving home",
      btn: "Browse Books",
      to: "/all-books",
    },
    {
      title: "1000+ Books Available",
      desc: "From classics to latest releases",
      btn: "Request Delivery",
      to: "/request-delivery",
    },
    {
      title: "Fast & Secure Delivery",
      desc: "Pay only ৳150 for delivery",
      btn: "Learn More",
      to: "/about",
    },
  ];

  const cities = [
    { name: "Dhaka", position: [23.8103, 90.4125] },
    { name: "Chittagong", position: [22.3569, 91.7832] },
    { name: "Sylhet", position: [24.8949, 91.8687] },
    { name: "Khulna", position: [22.8456, 89.5403] },
  ];

  return (
    <div className="min-h-screen bg-base-200">
      {/* HERO SLIDER */}
      <section className="relative">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          loop
          className="h-screen"
        >
          {slides.map((slide, i) => (
            <SwiperSlide key={i}>
              <div className="hero h-full bg-gradient-to-r from-primary to-secondary">
                <div className="hero-overlay bg-opacity-60"></div>
                <div className="hero-content text-center text-neutral-content">
                  <div className="max-w-4xl">
                    <h1 className="text-5xl md:text-7xl font-bold mb-8">{slide.title}</h1>
                    <p className="text-xl md:text-2xl mb-12 opacity-90">{slide.desc}</p>
                    <Link to={slide.to} className="btn btn-lg btn-accent">
                      {slide.btn}
                      <FiArrowRight className="ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* LATEST BOOKS — REAL DATA FROM LIBRARIANS */}
      <section className="py-20 bg-base-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Latest Books</h2>

          {loading ? (
            <div className="text-center py-20">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : latestBooks.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl opacity-70">No books available yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {latestBooks.map((book) => (
                <Link
                  key={book._id}
                  to={`/book/${book._id}`}
                  className="group card bg-base-200 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                >
                  <figure className="px-4 pt-4">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="rounded-xl h-64 w-full object-cover group-hover:opacity-90 transition"
                    />
                  </figure>
                  <div className="card-body p-4 text-center">
                    <h3 className="font-bold text-sm line-clamp-2">{book.title}</h3>
                    <p className="text-xs opacity-70">by {book.author}</p>
                    <div className="badge badge-success badge-sm mt-2">
                      <FiCheckCircle className="mr-1" />
                      Available
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* COVERAGE MAP */}
      <section className="py-20 bg-base-300">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Delivery Coverage</h2>
          <div className="max-w-4xl mx-auto h-96 rounded-2xl overflow-hidden shadow-2xl">
            <MapContainer center={[23.685, 90.3563]} zoom={6} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='© OpenStreetMap'
              />
              {cities.map((city) => (
                <Marker key={city.name} position={city.position}>
                  <Popup>{city.name}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose BookCourier?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card bg-base-100 shadow-xl p-8 text-center hover:scale-105 transition">
              <FiTruck className="w-16 h-16 mx-auto mb-6 text-primary" />
              <h3 className="text-2xl font-bold mb-4">Fast Delivery</h3>
              <p>Get your books delivered within 48 hours</p>
            </div>
            <div className="card bg-base-100 shadow-xl p-8 text-center hover:scale-105 transition">
              <FiCheckCircle className="w-16 h-16 mx-auto mb-6 text-success" />
              <h3 className="text-2xl font-bold mb-4">Trusted Libraries</h3>
              <p>Borrow from verified local libraries</p>
            </div>
            <div className="card bg-base-100 shadow-xl p-8 text-center hover:scale-105 transition">
              <FiClock className="w-16 h-16 mx-auto mb-6 text-accent" />
              <h3 className="text-2xl font-bold mb-4">24/7 Support</h3>
              <p>We're here to help anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* ANIMATED CTA */}
      <section className="py-20 bg-linear-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-8 animate-pulse">Join 10,000+ Happy Readers</h2>
          <p className="text-2xl mb-12 opacity-90">Start your reading journey today!</p>
          <Link to="/all-books" className="btn btn-lg btn-accent animate-bounce">
            <FiBookOpen className="mr-2" />
            Browse Books Now
          </Link>
        </div>
      </section>
    </div>
  );
}