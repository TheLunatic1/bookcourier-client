import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiPackage, FiTruck, FiClock, FiStar } from "react-icons/fi";

export default function Home() {
  return (
    <>
      {/* Hero Section with Animation */}
      <section className="hero min-h-screen bg-linear-to-br from-primary/10 via-base-100 to-secondary/10">
        <div className="hero-content text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-primary mb-6">
              Books Delivered to Your Doorstep
            </h1>
            <p className="text-xl md:text-2xl text-base-content/80 mb-10">
              Borrow from your nearest library without leaving home. Fast, reliable, and free delivery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/all-books" className="btn btn-primary btn-lg">
                Browse Books
              </Link>
              <Link to="/request-delivery" className="btn btn-outline btn-lg">
                Request Delivery
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose BookCourier?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: FiPackage, title: "Wide Collection", desc: "Access thousands of books from city libraries" },
              { icon: FiTruck, title: "Fast Delivery", desc: "Get books delivered within 24 hours" },
              { icon: FiClock, title: "Easy Returns", desc: "Return books with one click pickup" },
              { icon: FiStar, title: "Trusted Service", desc: "Loved by 50,000+ readers in Dhaka" },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
              >
                <div className="card-body items-center text-center p-8">
                  <feature.icon className="w-16 h-16 text-primary mb-4" />
                  <h3 className="card-title text-xl">{feature.title}</h3>
                  <p className="text-base-content/70">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary text-primary-content">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Start Reading Today</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of readers who never visit the library anymore.
          </p>
          <Link to="/register" className="btn btn-secondary btn-lg">
            Create Free Account
          </Link>
        </div>
      </section>
    </>
  );
}