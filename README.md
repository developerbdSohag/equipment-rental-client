# GearUp | Equipment Rental Platform - Frontend Client

**Project Name**: GearUp Equipment Rental Platform (Client Application)  
**Live Application URL**: [https://rental-equipment-client.vercel.app](https://rental-equipment-client.vercel.app) (or your live deployment URL)  
**Author**: developerbdSohag  

---

## 📌 Project Purpose
The **Equipment Rental Platform** is a transparent, secure, and peer-to-peer equipment rental marketplace designed to allow equipment owners to list machinery and equipment for rent, and enable customers (contractors, filmmakers, farmers, event organizers) to easily browse, book, and pay for equipment rentals. The system incorporates robust role-based access control, Stripe payment checkout, dynamic dashboard analytics, and server-side search, filtering, and pagination.

---

## 🔑 Demo & Testing Credentials

The application includes convenient 1-Click Demo Login buttons directly on the Login page:

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@rentalequip.com` | `AdminPassword123!` | Master Admin Dashboard, User Role Management, Equipment Approvals, Platform Analytics |
| **Owner** | `owner@rentalequip.com` | `OwnerPassword123!` | Owner Dashboard, Add Equipment (Pending), Manage Listings, Rental Orders, Earnings Analytics |
| **Customer** | `customer@rentalequip.com` | `CustomerPassword123!` | Equipment Booking, Stripe Payment, My Rentals, Saved Favorites, Profile Management |

---

## 🚀 Key Features

### 1. Home Page (Public Route)
- **Sticky Navbar**: Includes modern brand logo, navigation links (`Home`, `All Equipment`, `How It Works`, `About Us`, `Contact Us`), Dark/Light mode theme toggle, unauthenticated `Login`/`Register` buttons, and logged-in user profile dropdown with role badge, direct Dashboard link, and `Logout`.
- **Hero Banner**: High-definition hero machinery image, eye-catching title with gradient styling, short mission description, trust statistics counters, and animated CTAs powered by Framer Motion.
- **Categories Section**: Showcases 6 popular domains (Construction, Photography, Vehicles & Transportation, Agriculture, Electronics, Event Equipment) with interactive icon cards and equipment count badges.
- **Featured Equipment Section**: Displays 6 approved equipment cards fetched using MongoDB `limit(6)`. Includes instant login check: redirects unauthenticated users to Login with return callback, or logged-in users directly to Equipment Details.
- **Why Choose Us Section**: Emphasizes platform benefits (Affordable Rental Prices, Verified Equipment Owners, Flexible Rental Schedules, and Secure Stripe Online Payments).
- **Customer Reviews Section**: 4 verified reviews with 5-star ratings, quotes, user avatars, and contractor titles.
- **Extra Sections**:
  - `How It Works`: 4-step visual workflow (Discover & Compare -> Book & Pay Securely -> Dispatch & Work -> Return & Review).
  - `Owner CTA`: Encourages equipment owners to monetize idle machinery with insurance and payout guarantees.
- **Footer**: Includes detailed brand description, category navigation, contact information, legal links, and the new **X logo** matching the modern rebrand.

### 2. All Equipment Page (Public Route)
- **3-Column Grid Layout**: Uniform, equal-height equipment cards with high-res photos, category tags, availability status pills, and pricing badges.
- **Dynamic Server-Side Search (Challenge 1)**: Real-time search across equipment name, brand, location, and description.
- **Multi-Facet Server-Side Filters (Challenge 1)**: Filter by category, rental type (`Daily`, `Weekly`, `Monthly`), availability (`In Stock Only` vs `All`), and dynamic price range slider.
- **Dynamic Sorting**: Sort by `Price: Low to High`, `Price: High to Low`, and `Recently Added`.
- **Pagination (Bonus 1)**: Interactive pagination controls with previous/next and numerical page navigation.

### 3. Equipment Details Page (Private Route)
- Complete technical specifications: Category, Rental Price, Rental Type, Location, Available Quantity, Condition, Brand, Model, Description, Owner info, and Rental Terms & Conditions.
- **Add to Favorites**: Save or remove equipment from favorites, instantly synchronized with the MongoDB backend.
- **Interactive Booking Modal**: Date pickers for rental duration, quantity selector with availability validation, phone number, job-site delivery address, and additional notes.
- Automatic calculation of rental duration and total rental cost.
- **Stripe Checkout Integration**: Seamless redirection to secure Stripe card checkout.
- Decrements available equipment quantity upon confirmed payment and logs transaction details into the payments collection.

### 4. Role-Based Dashboards (Private Routes)
- **Customer Dashboard**:
  - `My Rentals`: Comprehensive table of all customer bookings with equipment image, rental duration, booking date, total amount, payment status (`Paid`), and booking status.
  - `Favorites`: Table of bookmarked equipment with quick actions to view details or remove from favorites.
  - `Profile`: View and update user profile (Name, Photo URL, Phone, Address).
- **Owner Dashboard**:
  - `Owner Analytics (Challenge 3)`: Dynamic cards for Total Listed Equipment, Completed Rentals, Active Rentals, Total Earnings, and interactive monthly revenue bar chart.
  - `Add Equipment`: Full listing form with Category dropdown, Rental Type, Condition, Brand, Model, Image URL/upload, and Rental Terms (automatically submitted with `Pending` status).
  - `My Equipment`: Table of owner listings with `Pending`, `Approved`, or `Rejected` badges, and actions to Update, Delete, or View.
  - `My Equipment Rental`: Table of customer rental orders on the owner's equipment.
  - `My Profile`: Owner profile management.
- **Admin Dashboard**:
  - `Admin Analytics (Challenge 3)`: Platform-wide metrics for Total Users, Total Equipment, Total Bookings, Pending Approvals, Completed Rentals, Total Revenue, and monthly booking & revenue charts.
  - `All Users`: Table of all registered users with actions to change role (`Customer`, `Owner`, `Admin`) and delete accounts.
  - `All Equipment`: Moderation table to Approve or Reject pending equipment, update specs, or delete.
  - `All Rentals`: Master audit log of all rental activities and transactions across the platform.
  - `My Profile`: Admin profile management.

### 5. UI/UX & Reliability Guarantees
- **Reload Reliability**: Protected routes verify auth state without redirecting active logged-in sessions to login upon page reload.
- **Theme Toggle (Bonus 2)**: Dark mode and Light mode toggle with local storage persistence.
- **Custom Loading & Error Handling**: Beautiful root loading spinner, custom 404 page, and React error boundaries.

---

## 📦 NPM Packages Used

| Package | Version | Purpose |
| :--- | :--- | :--- |
| `next` | ^14.2.23 | React Framework for the Web with App Router |
| `react` & `react-dom` | ^18.3.1 | Core React UI library |
| `tailwindcss` | ^3.4.4 | Utility-first CSS framework |
| `daisyui` | ^4.12.23 | Tailwind CSS component library |
| `lucide-react` | ^0.469.0 | Modern SVG icon pack |
| `framer-motion` | ^11.15.0 | Production-ready motion and animation library |
| `axios` | ^1.7.9 | Promise-based HTTP client for API requests |
| `sweetalert2` | ^11.15.3 | Responsive popup alerts and toasts |
| `react-hot-toast` | ^2.4.1 | Lightweight notifications for React |
| `recharts` | ^2.15.0 | Composable charting library for dashboard analytics |
| `@stripe/stripe-js` | ^5.4.0 | Stripe SDK for web checkout |

---

## 🛠️ Environment Variables Configuration

Create a `.env.local` file in the root of the `client` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

---

## 🏃‍♂️ How to Run Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)
