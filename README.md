## BookCourier – Library-to-Home Delivery System <img src="https://i.imgur.com/kQ4ngAc.png" alt="Book Icon" width="70" height="35" />

**A full-stack book delivery management system** where users browse books, request deliveries, librarians add/manage books, and admins control the platform. Features role-based auth, Stripe payments, Google login, reviews, wishlist, and more.

🔥 **Live Demo**: [https://bookcourier-client.vercel.app](https://bookcourier-client.vercel.app/)


![BookCourier Preview](https://i.imgur.com/0jo4Fj9.png)

### ✨ Key Features
- Role-based authentication (User, Librarian, Admin) with JWT and Firebase
- Google social login for quick signup/login
- Home page with animated hero sliders, latest books carousel, coverage map, and why choose us section
- All Books page with search by title/author and sort by price/newest/title
- Book details page with price, order modal (phone/address), wishlist add/remove, reviews (only if ordered & delivered)
- User dashboard with My Orders (pay/cancel), Wishlist, Invoices, Profile edit
- Librarian dashboard with Add Book (price, image, description), My Books (publish/unpublish/delete), Manage Orders (update status)
- Admin dashboard with All Users (role change), Librarian Requests (approve/reject), All Orders, Manage Books (publish/delete)
- Stripe payment for orders (book price + ৳150 delivery)
- Reviews with star ratings and comments, average rating displayed
- Wishlist add/remove from book details
- Profile update with name and photo (upload or URL)
- Secure protected routes and admin-only actions
- Responsive UI with light/dark mode toggle
- Toast notifications for actions
- 404 page and access denied pages
- Skeleton loading and error handling

### Tech Stack

| Package             | Purpose                    |
|---------------------|----------------------------|
| React               | Core framework             |
| Vite                | Build tool                 |
| React Router        | Routing & navigation       |
| Axios               | API requests               |
| Firebase            | Google authentication      |
| React Icons         | Icons                      |
| Swiper              | Sliders & carousels        |
| React Leaflet       | Maps                       |
| React Hot Toast     | Notifications              |
| Tailwind CSS        | Styling                    |
| DaisyUI             | UI components              |
| date-fns            | Date formatting            |

### Server & Database
- Backend API: Node.js + Express (deployed on Vercel)
- Database: MongoDB Atlas
- Server Repo: [https://github.com/TheLunatic1/bookcourier-server](https://github.com/TheLunatic1/bookcourier-server)

### 🚀 How to Run Locally

#### Client (Frontend)
```
git clone https://github.com/TheLunatic1/bookcourier-client.git
cd bookcourier-client
npm install
npm run dev
```
- Open http://localhost:5173
- Use .env for VITE_API_URL (point to server)