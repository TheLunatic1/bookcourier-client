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

      {/* WHY CHOOSE US */}
      <section className="py-20 bg-base-100">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Why Choose BookCourier?
          </h2>
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center group">
              <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition">
                <FiTruck className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Lightning Fast Delivery</h3>
              <p className="text-base-content/70 text-lg">
                Get your favorite books delivered within <strong>48 hours</strong> — faster than you can finish a chapter!
              </p>
            </div>
              
            <div className="text-center group">
              <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-success/10 flex items-center justify-center group-hover:bg-success/20 transition">
                <FiCheckCircle className="w-12 h-12 text-success" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Trusted Local Libraries</h3>
              <p className="text-base-content/70 text-lg">
                Every book comes from verified libraries near you — quality and authenticity guaranteed.
              </p>
            </div>
              
            <div className="text-center group">
              <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition">
                <FiClock className="w-12 h-12 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-4">24/7 Support & Easy Returns</h3>
              <p className="text-base-content/70 text-lg">
                We're here whenever you need us. Not happy? Return it free within 7 days.
              </p>
            </div>
          </div>
        </div>
      </section>
              
      {/* COVERAGE MAP */}
      <section className="py-20 bg-gradient-to-b from-base-200 to-base-300">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-4">We Deliver Across Bangladesh</h2>
          <p className="text-xl text-center opacity-80 mb-12 max-w-2xl mx-auto">
            From Dhaka to the hills of Sylhet — if you're in a major city, we're coming to you!
          </p>
              
          <div className="max-w-5xl mx-auto h-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-primary/20">
            <MapContainer center={[23.685, 90.3563]} zoom={6} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='© OpenStreetMap contributors'
              />
              {cities.map((city) => (
                <Marker key={city.name} position={city.position}>
                  <Popup>
                    <div className="text-center">
                      <h3 className="font-bold text-lg">{city.name}</h3>
                      <p className="text-sm">Delivery Available</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
            
          <div className="text-center mt-12">
            <p className="text-lg opacity-80">
              Serving <strong>10+ major cities</strong> and expanding every month!
            </p>
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