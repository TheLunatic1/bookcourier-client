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
import useAuth from "../hooks/useAuth";

// Leaflet icon
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
        // Get available books, sort by newest, take 6
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


  const cities = [
    { name: "Dhaka", position: [23.8103, 90.4125] },
    { name: "Chittagong", position: [22.3569, 91.7832] },
    { name: "Sylhet", position: [24.8949, 91.8687] },
    { name: "Khulna", position: [22.8456, 89.5403] },
  ];

  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-base-200">

      {/* HERO SLIDER */}
      <section className="relative">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation={true}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          className="h-screen"
        >
          {/* SLIDE 1 */}
          <SwiperSlide>
            <div className="hero h-full bg-linear-to-br from-blue-600 to-indigo-700">
              <div className="hero-overlay bg-black/60"></div>
              <div className="hero-content text-center text-white">
                <div className="max-w-5xl">
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
                    Books Delivered
                    <span className="block text-cyan-300 mt-4">to Your Doorstep</span>
                  </h1>
                  <p className="text-xl md:text-3xl mb-12 font-light opacity-95 max-w-3xl mx-auto">
                    Borrow from local libraries — delivered in 48 hours for just ৳150
                  </p>
                  <Link to="/all-books" className="btn btn-info btn-lg text-xl px-12 shadow-2xl hover:shadow-info/50">
                    Browse Books
                    <FiArrowRight className="ml-3 w-6 h-6" />
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>

          {/* SLIDE 2 */}
          <SwiperSlide>
            <div className="hero h-full bg-linear-to-br from-indigo-700 to-purple-700">
              <div className="hero-overlay bg-black/60"></div>
              <div className="hero-content text-center text-white">
                <div className="max-w-5xl">
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
                    1000+ Books
                    <span className="block text-cyan-300 mt-4">Ready to Borrow</span>
                  </h1>
                  <p className="text-xl md:text-3xl mb-12 font-light opacity-95 max-w-3xl mx-auto">
                    From classics to bestsellers — all from trusted libraries near you
                  </p>
                  <Link to="/all-books" className="btn btn-info btn-lg text-xl px-12 shadow-2xl hover:shadow-info/50">
                    Explore Now
                    <FiArrowRight className="ml-3 w-6 h-6" />
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>

          {/* SLIDE 3 */}
          <SwiperSlide>
            <div className="hero h-full bg-linear-to-br from-purple-700 to-pink-700">
              <div className="hero-overlay bg-black/60"></div>
              <div className="hero-content text-center text-white">
                <div className="max-w-5xl">
                  {user ? (
                    <>
                      <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
                        Welcome Back,
                        <span className="block text-cyan-300 mt-4">{user.name.split(" ")[0]}!</span>
                      </h1>
                      <p className="text-xl md:text-3xl mb-12 font-light opacity-95 max-w-3xl mx-auto">
                        Your next great read is waiting
                      </p>
                      <Link to="/dashboard" className="btn btn-info btn-lg text-xl px-12 shadow-2xl hover:shadow-info/50">
                        Go to Dashboard
                        <FiArrowRight className="ml-3 w-6 h-6" />
                      </Link>
                    </>
                  ) : (
                    <>
                      <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
                        Join BookCourier
                        <span className="block text-cyan-300 mt-4">Today</span>
                      </h1>
                      <p className="text-xl md:text-3xl mb-12 font-light opacity-95 max-w-3xl mx-auto">
                        Start your reading journey in seconds
                      </p>
                      <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link to="/register" className="btn btn-info btn-lg text-xl px-12 shadow-2xl hover:shadow-info/50">
                          Register Now
                        </Link>
                        <Link to="/login" className="btn btn-ghost btn-lg text-xl px-12 border-2 border-white/30 hover:border-white">
                          Login
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>
                
      {/* LATEST BOOKS */}
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
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={30}
              slidesPerView={1.3}
              centeredSlides={false}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              loop={true}
              pagination={{ clickable: true }}
              grabCursor={true}
              breakpoints={{
                640: { slidesPerView: 2, centeredSlides: false },
                768: { slidesPerView: 3, centeredSlides: false },
                1024: { slidesPerView: 4, centeredSlides: false },
                1280: { slidesPerView: 5, centeredSlides: false },
              }}
              className="latest-books-swiper pb-12"
            >
              {latestBooks.map((book) => (
                <SwiperSlide key={book._id} className="!w-80 md:!w-96">
                  <Link to={`/book/${book._id}`} className="block h-full">
                    <div className="card bg-base-200 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 rounded-3xl overflow-hidden h-full flex flex-col border border-base-300">
                      <figure className="px-8 pt-8">
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="rounded-2xl h-80 w-full object-cover shadow-2xl border-4 border-white"
                        />
                      </figure>
                      <div className="card-body p-8 text-center flex flex-col justify-between flex-1 bg-gradient-to-b from-base-200 to-base-300">
                        <div>
                          <h3 className="font-bold text-2xl line-clamp-2 leading-tight text-primary">
                            {book.title}
                          </h3>
                          <p className="text-lg opacity-90 mt-3 font-medium">by {book.author}</p>
                        </div>
                        <div className="mt-6">
                          <div className="badge badge-success badge-lg py-5 px-8 text-lg font-bold">
                            ৳{book.price}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 bg-base-100">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-16 bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
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
      <section className="py-20 bg-linear-to-b from-base-200 to-base-300">
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