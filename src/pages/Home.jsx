import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Link } from "react-router-dom";
import API from "../services/api";
import { FiArrowRight, FiCheckCircle, FiTruck, FiBookOpen, FiClock, FiDollarSign } from "react-icons/fi";
import useAuth from "../hooks/useAuth";
import CountUp from "react-countup";

// Leaflet icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function Home() {
  const { user } = useAuth();
  const [latestBooks, setLatestBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestBooks = async () => {
      try {
        const res = await API.get("/books");
        const sorted = res.data
          .filter(book => book.isAvailable)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 6);
        setLatestBooks(sorted);
      } catch (err) {
        console.error("Failed to load latest books:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestBooks();
  }, []);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 80 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
  };

  const scaleHover = {
    rest: { scale: 1, rotate: 0 },
    hover: { scale: 1.08, rotate: 1, transition: { duration: 0.4 } },
  };

  const staggerContainer = {
    hidden: { opacity: 1 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
  };

  const pulse = {
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Infinity, repeatType: "reverse" },
  };

  return (
    <div className="min-h-screen bg-base-200 overflow-x-hidden">

{/* HERO — BIG SINGLE HERO, TEXT ALIGNED LEFT */}
<section className="relative h-screen flex items-center justify-start overflow-hidden">
  {/* Gradient Overlay — stronger for readability */}
  {/* <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent z-10" /> */}

  {/* Your Background Image */}
  <div
    className="absolute inset-0 bg-cover bg-center scale-101"
    style={{
      backgroundImage: "url('https://i.imgur.com/HgqtGYQ.jpeg')",
      // filter: "brightness(0.45) contrast(1.15)",
    }}
  />

{/* Animated Hero Content — LEFT ALIGNED */}
  <motion.div
    className="relative z-20 text-left max-w-5xl ml-6 md:ml-12 lg:ml-24 px-6 md:px-12"
    initial="hidden"
    animate="visible"
    variants={staggerContainer}
  >
    <motion.h1
      variants={fadeInUp}
      className="text-5xl md:text-7xl lg:text-9xl font-black text-white mb-8 leading-tight drop-shadow-[0_6px_12px_rgba(0,0,0,0.9)]"
    >
      Discover & Deliver
      <motion.span
        variants={fadeInUp}
        className="block text-accent mt-4 md:mt-6 text-6xl md:text-8xl lg:text-9xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
      >
        Your Next Read
      </motion.span>
    </motion.h1>

    <motion.p
      variants={fadeInUp}
      className="text-xl md:text-2xl lg:text-3xl text-white/95 mb-10 lg:mb-14 font-light max-w-3xl drop-shadow-[0_3px_6px_rgba(0,0,0,0.8)]"
    >
      Borrow or buy from local libraries — delivered to your doorstep in 48 hours for just ৳150
    </motion.p>

    <motion.div variants={fadeInUp}>
      <Link
        to="/all-books"
        className="btn btn-accent btn-lg text-xl md:text-2xl px-10 md:px-14 py-6 md:py-8 shadow-2xl hover:shadow-accent/60 hover:scale-105 transition-all duration-500"
      >
        Browse Books Now
        <FiArrowRight className="ml-3 md:ml-4 w-6 md:w-8 h-6 md:h-8" />
      </Link>
    </motion.div>
  </motion.div>
</section>



 {/* WHY CHOOSE US — ANIMATED CARDS */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="py-24 bg-base-200"
      >
        <div className="container mx-auto px-6">
          <motion.h2
            variants={fadeInUp}
            className="text-5xl font-black text-center mb-20 text-primary"
          >
            Why Choose BookCourier?
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { icon: FiTruck, title: "Lightning Fast Delivery", desc: "48 hours or less — guaranteed" },
              { icon: FiCheckCircle, title: "Trusted Libraries", desc: "Only verified partners" },
              { icon: FiDollarSign, title: "Flat ৳150 Delivery", desc: "No hidden fees" },
              { icon: FiBookOpen, title: "Vast Collection", desc: "Thousands of titles" },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={scaleHover}
                initial="rest"
                whileHover="hover"
                className="card bg-base-100 shadow-2xl hover:shadow-3xl transition-shadow duration-500 rounded-3xl overflow-hidden border border-base-300"
              >
                <div className="card-body items-center text-center p-10">
                  <item.icon className="w-16 h-16 text-primary mb-6" />
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-lg opacity-80">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>


{/* NEW: STATS / TRUST BAR */}
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.8 }}
      variants={staggerContainer}
      className="py-16 bg-base-300 border-t border-base-200"
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {/* Stat 1 */}
          <motion.div variants={fadeInUp} className="space-y-2">
            <div className="text-5xl md:text-6xl font-black text-primary">
              <CountUp end={10000} duration={2.5} separator="," />+
            </div>
            <p className="text-lg font-medium opacity-80">Happy Readers</p>
          </motion.div>

          {/* Stat 2 */}
          <motion.div variants={fadeInUp} className="space-y-2">
            <div className="text-5xl md:text-6xl font-black text-primary">
              <CountUp end={500} duration={2.5} separator="," />+
            </div>
            <p className="text-lg font-medium opacity-80">Books Available</p>
          </motion.div>

          {/* Stat 3 */}
          <motion.div variants={fadeInUp} className="space-y-2">
            <div className="text-5xl md:text-6xl font-black text-primary">
              48<span className="text-3xl">h</span>
            </div>
            <p className="text-lg font-medium opacity-80">Delivery Guarantee</p>
          </motion.div>

          {/* Stat 4 */}
          <motion.div variants={fadeInUp} className="space-y-2">
            <div className="text-5xl md:text-6xl font-black text-primary">
              4.8<span className="text-3xl">/5</span>
            </div>
            <p className="text-lg font-medium opacity-80">Average Rating</p>
          </motion.div>
        </div>
      </div>
    </motion.section>


{/* LATEST BOOKS — HOVER SHOWS FULL IMAGE + DESCRIPTION PANEL */}
<motion.section
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.2 }}
  variants={staggerContainer}
  className="py-24 bg-base-100"
>
  <div className="container mx-auto px-6">
    <motion.h2 variants={fadeInUp} className="text-5xl font-black text-center mb-20">
      Latest Arrivals
    </motion.h2>

    {loading ? (
      <div className="text-center py-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    ) : latestBooks.length === 0 ? (
      <div className="text-center py-20">
        <p className="text-2xl opacity-70">No books available yet</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
        {latestBooks.slice(0, 5).map((book, index) => (
          <motion.div
            key={book._id}
            variants={scaleHover}
            initial="rest"
            whileHover="hover"
            className="group relative card bg-base-200 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl overflow-hidden h-full flex flex-col border border-base-300 cursor-pointer"
          >
            <Link to={`/book/${book._id}`} className="block h-full">
            {/* Card Content */}
            <figure className="px-8 pt-8 relative z-10">
              <img
                src={book.coverImage}
                alt={book.title}
                className="rounded-2xl h-80 w-full object-cover shadow-2xl border-4 border-white transition-transform duration-700 group-hover:scale-110"
              />
            </figure>

            {/* Hover Overlay with Description */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 flex flex-col justify-end p-8">
              <h3 className="text-2xl font-bold text-white mb-3 line-clamp-2">
                {book.title}
              </h3>
              <p className="text-lg text-white/90 mb-4">by {book.author}</p>
              <p className="text-base text-white/80 line-clamp-3 mb-6">
                {book.description || "A captivating read from our trusted library partners. Available for immediate delivery."}
              </p>
              <div className="flex items-center justify-between">
                <div className="badge badge-success badge-lg py-4 px-6 text-lg font-bold">
                  ৳{book.price}
                </div>
                <Link
                  to={`/book/${book._id}`}
                  className="btn btn-accent btn-sm px-3 "
                >
                  View Details
                </Link>
              </div>
            </div>

            {/* Default visible info (bottom) */}
            <div className="card-body p-6 text-center relative z-10 bg-gradient-to-t from-base-200/80 to-transparent">
              <h3 className="font-bold text-xl line-clamp-1 text-primary group-hover:opacity-0 transition-opacity duration-300">
                {book.title}
              </h3>
              <p className="text-base opacity-80 group-hover:opacity-0 transition-opacity duration-300">
                by {book.author}
              </p>
              <div className="mt-4">
                <div className="badge badge-success badge-md py-3 px-6">
                  ৳{book.price}
                </div>
              </div>
            </div>
            </Link>
          </motion.div>
        ))}
      </div>
    )}
  </div>
</motion.section>


{/* COVERAGE MAP - ALL 8 DIVISIONS, ZOOM LOCKED TO BANGLADESH */}
<motion.section
  initial={{ opacity: 0, y: 60 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 1, ease: "easeOut" }}
  viewport={{ once: true, amount: 0.3 }}
  className="py-20 bg-base-200"
>
  <div className="container mx-auto px-6">
    <motion.h2
      className="text-5xl font-black text-center mb-16 text-primary"
      initial={{ scale: 0.95 }}
      whileInView={{ scale: 1 }}
      transition={{ duration: 0.8 }}
    >
      Nationwide Coverage – All 8 Divisions
    </motion.h2>

    <div className="h-[500px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-base-300">
      <MapContainer
        center={[23.6850, 90.3563]} // Approximate center of Bangladesh
        zoom={7}
        minZoom={7}                  // ← Prevent zooming out too far
        maxZoom={10}                 // ← Limit max zoom
        maxBounds={[
          [20.34, 88.01],           // Southwest corner
          [26.63, 92.67]            // Northeast corner (Bangladesh bounds)
        ]}
        maxBoundsViscosity={1.0}     // ← Hard lock — no panning outside
        style={{ height: "100%", width: "100%" }}
        className="z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Markers for all 8 divisions (approx center coordinates) */}
        <Marker position={[23.8103, 90.4125]}>
          <Popup>Dhaka Division – Central Hub</Popup>
        </Marker>
        <Marker position={[22.3569, 91.7832]}>
          <Popup>Chittagong Division – Port City</Popup>
        </Marker>
        <Marker position={[24.8949, 91.8687]}>
          <Popup>Sylhet Division – Northeast</Popup>
        </Marker>
        <Marker position={[25.7466, 89.2516]}>
          <Popup>Rangpur Division – North</Popup>
        </Marker>
        <Marker position={[24.3636, 88.6245]}>
          <Popup>Rajshahi Division – Northwest</Popup>
        </Marker>
        <Marker position={[23.4607, 91.1809]}>
          <Popup>Comilla Division (Chattogram Division part)</Popup>
        </Marker>
        <Marker position={[22.7010, 90.3535]}>
          <Popup>Barishal Division – South</Popup>
        </Marker>
        <Marker position={[23.2378, 90.6563]}>
          <Popup>Mymensingh Division – North-Central</Popup>
        </Marker>
      </MapContainer>
    </div>

    <motion.p
      className="text-center mt-8 text-lg opacity-80 max-w-3xl mx-auto"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.8 }}
    >
      Currently serving all 8 divisions of Bangladesh — expanding to every district soon.
    </motion.p>
  </div>
</motion.section>


{/* TESTIMONIALS — AUTO-SCROLL CAROUSEL + RICH ANIMATIONS */}
<motion.section
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.3 }}
  variants={staggerContainer}
  className="py-24 bg-base-100"
>
  <div className="container mx-auto px-6">
    <motion.h2
      variants={fadeInUp}
      className="text-5xl font-black text-center mb-16 text-primary"
    >
      What Our Readers Say
    </motion.h2>

    <Swiper
      modules={[Autoplay, Pagination]}
      spaceBetween={30}
      slidesPerView={1}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
      loop={true}
      pagination={{ clickable: true }}
      grabCursor={true}
      breakpoints={{
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
      className="testimonials-swiper pb-12"
    >
      {[
        {
          name: "Ayesha Rahman",
          photo: "https://i.pravatar.cc/150?img=68",
          rating: 5,
          text: "Books arrived in just 36 hours — perfect condition! This service changed how I read. 100% recommend.",
        },
        {
          name: "Rahim Khan",
          photo: "https://i.pravatar.cc/150?img=12",
          rating: 5,
          text: "As a busy student, the flat ৳150 delivery is a lifesaver. Huge collection, easy app — love it!",
        },
        {
          name: "Fatima Begum",
          photo: "https://i.pravatar.cc/150?img=47",
          rating: 5,
          text: "First order was flawless. Librarians are super helpful, and the books are always fresh.",
        },
        {
          name: "Samiul Islam",
          photo: "https://i.pravatar.cc/150?img=33",
          rating: 5,
          text: "The app is easy to use and the customer support is quick. Got my favorite novel delivered in perfect time.",
        },
        {
          name: "Nusrat Jahan",
          photo: "https://i.pravatar.cc/150?img=55",
          rating: 5,
          text: "Finally an affordable way to enjoy new releases. 5 stars — can't wait for my next order!",
        },
      ].map((testimonial, index) => (
        <SwiperSlide key={index}>
          <motion.div
            variants={scaleHover}
            initial="rest"
            whileHover="hover"
            className="card bg-base-200 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl overflow-hidden p-8 border border-base-300"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="avatar">
                <div className="w-16 rounded-full ring ring-primary ring-offset-2 ring-offset-base-200">
                  <img src={testimonial.photo} alt={testimonial.name} />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-xl">{testimonial.name}</h4>
                <div className="flex text-yellow-400 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
                    >
                      ★
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-lg leading-relaxed opacity-90 italic">
              "{testimonial.text}"
            </p>
          </motion.div>
        </SwiperSlide>
      ))}
    </Swiper>

    {/* Mobile swipe hint */}
    <motion.p
      variants={fadeInUp}
      className="text-center mt-6 text-base opacity-70 md:hidden"
    >
      Swipe left/right to see more stories
    </motion.p>
  </div>
</motion.section>

{/* ANIMATED CTA */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
        className="py-32 text-white text-center relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.1)_0%,transparent_50%)]"
          style={{
      backgroundImage: "url('https://i.imgur.com/nqebE69.jpeg')",
      // filter: "brightness(0.45) contrast(1.15)",
    }}
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="text-6xl font-black mb-10 drop-shadow-[0_6px_12px_rgba(0,0,0,0.9)]"
          >
            Join 10,000+ Happy Readers
          </motion.h2>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-3xl mb-14 font-light max-w-4xl mx-auto drop-shadow-[0_3px_6px_rgba(0,0,0,0.8)]"
          >
            Start your reading journey today!
          </motion.p>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link
              to="/all-books"
              className="btn btn-accent btn-lg text-2xl px-16 py-8 shadow-2xl hover:shadow-accent/60 animate-pulse"
            >
              <FiBookOpen className="mr-4 w-8 h-8" />
              Browse Books Now
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}