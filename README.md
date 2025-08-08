<div align="center">
  <img src="frontend/src/assets/ostaeasy_night_logo.png" alt="OSTAEASY Logo" width="300"/>

</div>

## Developer Information

- **Name:** Md Aslam Hossain
- **Email:** aslam.hossain@abo.fi

## Implemented Requirements

### Mandatory Requirements

1. **Project folder** ✅

   - Root folder contains README.md with required information
   - Backend folder contains requirements.txt and source code
   - Frontend folder contains package.json and source files

2. **Backend** ✅

   - Django backend providing REST API
   - JSON responses for shop page and HTML for landing page
   - SQLite database implementation
   - Multi-language support with Django i18n (Finnish, Swedish)

3. **Frontend** ✅

   - React web shop implementation
   - Modern responsive design with pagination
   - Multi-language support i18n (Finnish, Swedish)

4. **Automatic DB population** ✅

   - Landing page has button to populate database
   - Creates 6 users (testuser1-testuser6 with passwords pass1-pass6)
   - Creates 1000 realistic demo items (200 items per category)
   - 5 categories: Clothing, Accessories, Bags, Shoes, Sunglasses
   - Clears database before re-population
   - Items include realistic brands, variations, and detailed descriptions

5. **Browse** ✅

   - All users can view items for sale with pagination (20 items per page)
   - Item components display: Title, Description, Price, Date added
   - Category-based browsing with advanced filtering and sorting

6. **Create account** ✅

   - User registration with username, password, and email
   - No strong password validation (as requested)

7. **Login** ✅

   - User authentication with username and password
   - JWT token-based authentication

8. **Add item** ✅

   - Authenticated users can add items for sale
   - Required fields: Title, Description, Price
   - Automatic creation date saving

9. **Add to cart** ✅
   - Authenticated users can add items to cart
   - Users cannot add their own items
   - Items remain available for other users

### Optional Requirements

10. **Search** ✅

    - Advanced search functionality across titles and descriptions
    - Server-side search with API integration
    - Real-time search results

11. **Remove from cart** ✅

    - Users can remove items from their cart

12. **Pay** ✅

    - Cart checkout with Stripe payment processing
    - Price change detection and notifications
    - Item availability checking
    - Successful payment updates item status to SOLD

13. **Routing** ✅

    - Single Page Application with React Router
    - Routes include: Home, Categories, Account, Items, Cart

14. **Edit Account** ✅

    - Password change functionality
    - Old password verification required

15. **Display inventory** ✅

    - User inventory categorized as: on sale, sold, purchased
    - Complete item history tracking

16. **Edit item** ✅

    - Sellers can edit item prices
    - Only available for items still on sale

17. **UI Design** ✅
    - Modern, responsive design with professional styling
    - Clean and user-friendly interface
    - Advanced pagination and filtering components
    - Dark/Light theme support with toggle
    - Multi-language support (English, Finnish, Swedish)
    - Multi-currency support with live conversion

## Enhanced Features

### Advanced Pagination System

- **Home Page Sections**: Independent pagination for "Discovery all new items" and "Best Sellers"
- **Category Pages**: Server-side pagination with 20 items per page
- **Navigation**: Smooth page transitions with loading states

### Comprehensive Filtering & Sorting

- **Sort Options**:
  - Newest items first
  - Alphabetical (A to Z)
  - Price: Low to High
  - Price: High to Low
- **Price Range Filter**: Adjustable price range sliders
- **Search Integration**: Server-side search across titles and descriptions
- **Category Filtering**: Browse by specific categories

### Responsive Design Features

- **Grid View Options**: 1-6 column layouts for optimal viewing
- **List View**: Alternative layout for detailed item browsing
- **Mobile Responsive**: Optimized for all device sizes
- **Professional Styling**: Modern UI with smooth animations
- **Dark/Light Theme**: Toggle between dark and light modes with user preference persistence
- **Multi-language Support**: Available in English, Finnish, and Swedish
- **Multi-currency Display**: Support for multiple currencies with live conversion rates

### Internationalization & Accessibility Features

- **Multi-language Interface**: Complete translations for English, Finnish, and Swedish
- **Theme Accessibility**: High contrast support in both dark and light modes
- **Currency Localization**: Automatic currency formatting based on selected language
- **Responsive Typography**: Optimized text scaling across all device sizes
- **Keyboard Navigation**: Full keyboard accessibility for all interactive elements
- **Screen Reader Support**: Proper ARIA labels and semantic HTML structure

## How to Run the Project

### Prerequisites

- Python 3.8+
- Node.js latest (18+)
- pnpm (or npm)

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Create a virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Run migrations:

   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. Start the Django server:
   ```bash
   python manage.py runserver
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   pnpm install
   # or
   npm install
   ```

3. Start the React development server:
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

### Database Population

1. Open your browser and go to `http://localhost:8000`
2. Click the "Populate Database" button on the landing page
3. This will create 6 test users and 1000 realistic demo items across 5 categories:
   - **Clothing** (200 items): T-shirts, jeans, jackets, dresses, etc.
   - **Accessories** (200 items): Watches, jewelry, belts, scarves, etc.
   - **Bags** (200 items): Handbags, backpacks, totes, briefcases, etc.
   - **Shoes** (200 items): Sneakers, boots, heels, sandals, etc.
   - **Sunglasses** (200 items): Aviators, wayfarers, designer frames, etc.

### Test Users

After database population, you can use these credentials:

- **testuser1** / pass1 (Seller with demo items)
- **testuser2** / pass2 (Seller with demo items)
- **testuser3** / pass3 (Seller with demo items)
- **testuser4** / pass4 (Buyer)
- **testuser5** / pass5 (Buyer)
- **testuser6** / pass6 (Buyer)

### Test Payment Information

For testing the checkout functionality, use the following Stripe test card details:

**Credit Card Number:** `4242 4242 4242 4242`  
**Expiry Date:** Use any valid future date (e.g., `12/34`)  
**CVC:** Use any three-digit number (e.g., `123`)  
**Name:** Any name  
**Address:** Any address

> **Note:** These are Stripe's official test card numbers. No real money will be charged, and these cards will only work in test/development mode.

## Features Overview

### For Anonymous Users

- Browse all items for sale with pagination (20 items per page)
- Advanced search across titles and descriptions
- Filter and sort items by price, name, and date
- View items by category (Clothing, Accessories, Bags, Shoes, Sunglasses)
- Responsive grid view with customizable column layouts
- Switch between dark and light themes
- Change interface language (English, Finnish, Swedish)
- View prices in different currencies
- Create new account
- Login to existing account

### For Authenticated Users

- All anonymous features
- Add items for sale with category selection
- Add items to cart with real-time updates
- Remove items from cart
- Purchase items with Stripe checkout integration
- View personal inventory (on sale, sold, purchased)
- Edit item prices for items still on sale
- Change account password

### Technical Features

- **Advanced Pagination**: Independent pagination for home sections and category pages
- **Server-side Filtering**: Efficient filtering and sorting through Django REST API
- **Real-time Updates**: Instant cart updates and item count displays
- **Responsive Design**: Mobile-first design with flexible grid layouts
- **Professional UI**: Modern styling with smooth animations and transitions
- **Dark/Light Theme**: User preference persistence with smooth transitions
- **Internationalization**: Complete i18n support for English, Finnish, and Swedish
- **Multi-currency Support**: Live currency conversion and display options
- **JWT Authentication**: Secure token-based user authentication
- **Stripe Integration**: Complete payment processing with test mode support
- **Price Change Detection**: Automatic detection of price changes during checkout
- **Item Availability Checking**: Real-time availability verification
- **Clean REST API**: Well-structured API endpoints with proper pagination
- **Single Page Application**: Smooth routing with React Router
- **1000 Realistic Demo Items**: Diverse product catalog across 5 categories with authentic variations

## Testing Guide

### Testing Payment Checkout

To test the complete checkout flow with Stripe integration:

1. **Add items to cart** - Login with any test user and add items to cart
2. **Proceed to checkout** - Click the cart icon and proceed to payment
3. **Use test payment details:**
   ```
   Card Number: 4242 4242 4242 4242
   Expiry Date: 12/34 (or any valid future date)
   CVC: 123 (or any three-digit number)
   Name: Test User
   Address: Any test address
   ```
4. **Complete payment** - The test payment will process successfully
5. **Verify purchase** - Check "My Items" → "Purchased" tab to see your purchase

### Testing User Flows

1. **Seller Flow:**

   - Login as `testuser1` (password: `pass1`)
   - Add new items for sale with category selection
   - View items in "My Items" → "On Sale"
   - Edit item prices for active listings

2. **Buyer Flow:**

   - Login as `testuser4` (password: `pass4`)
   - Browse items using pagination and filtering options
   - Use advanced search and category filters
   - Test different sorting options (newest, A-Z, price ranges)
   - Add items to cart and watch real-time updates
   - Complete checkout with test card
   - View purchases in "My Items" → "Purchased"

3. **Advanced Features:**

   - Test independent pagination on home page sections
   - Try different grid column layouts (1-6 columns)
   - Use price range sliders for filtering
   - Search across titles and descriptions
   - Test responsive design on different screen sizes
   - **Theme Testing**: Toggle between dark and light modes
   - **Language Testing**: Switch between English, Finnish, and Swedish
   - **Currency Testing**: Change currency and verify price conversions

4. **Real-time Features:**

   - Add items to cart and watch the cart count update immediately
   - Remove items and see instant updates
   - No page refresh needed for cart operations

5.
