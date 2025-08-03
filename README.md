# OSTAEASY

## Developer Information

- **Name:** Md Aslam Hossain
- **Email:** aslam.hossain@abo.fi

## Implemented Requirements

### Mandatory Requirements (24 points)

1. **Project folder (4p)** ✅

   - Root folder contains README.md with required information
   - Backend folder contains requirements.txt and source code
   - Frontend folder contains package.json and source files

2. **Backend (3p)** ✅

   - Django backend providing REST API
   - JSON responses for shop page and HTML for landing page
   - SQLite database implementation

3. **Frontend (2p)** ✅

   - React web shop implementation

4. **Automatic DB population (2p)** ✅

   - Landing page has button to populate database
   - Creates 6 users (testuser1-testuser6 with passwords pass1-pass6)
   - First 3 users are sellers with 1000 realistic demo items across 6 categories
   - Clears database before re-population
   - Items include Electronics, Clothing, Home & Garden, Sports & Outdoors, Books & Media, Toys & Games

5. **Browse (3p)** ✅

   - All users can view items for sale
   - Item components display: Title, Description, Price, Date added

6. **Create account (2p)** ✅

   - User registration with username, password, and email
   - No strong password validation (as requested)

7. **Login (2p)** ✅

   - User authentication with username and password
   - JWT token-based authentication

8. **Add item (3p)** ✅

   - Authenticated users can add items for sale
   - Required fields: Title, Description, Price
   - Automatic creation date saving

9. **Add to cart (3p)** ✅
   - Authenticated users can add items to cart
   - Users cannot add their own items
   - Items remain available for other users

### Optional Requirements (18 points)

10. **Search (3p)** ✅

    - Search functionality for items by title
    - API-based search requests

11. **Remove from cart (1p)** ✅

    - Users can remove items from their cart

12. **Pay (3p)** ✅

    - Cart checkout with payment processing
    - Price change detection and notifications
    - Item availability checking
    - Successful payment updates item status to SOLD

13. **Routing (2p)** ✅

    - Single Page Application with React Router
    - Routes: "/" (Shop), "/signup", "/login", "/account", "/myitems"

14. **Edit Account (2p)** ✅

    - Password change functionality
    - Old password verification required

15. **Display inventory (4p)** ✅

    - User inventory categorized as: on sale, sold, purchased
    - Complete item history tracking

16. **Edit item (2p)** ✅

    - Sellers can edit item prices
    - Only available for items still on sale

17. **UI Design (1p)** ✅
    - Modern, responsive design
    - Clean and user-friendly interface

## How to Run the Project

### Prerequisites

- Python 3.8+
- Node.js 14+
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
3. This will create 6 test users and 1000 realistic demo items across 6 categories

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

- Browse all items for sale
- Search items by title
- View item details
- Create new account
- Login to existing account

### For Authenticated Users

- All anonymous features
- Add items for sale
- Add items to cart
- Remove items from cart
- Purchase items (cart checkout)
- View personal inventory (on sale, sold, purchased)
- Edit item prices
- Change account password

### Technical Features

- JWT authentication
- Real-time cart management
- Price change detection during checkout
- Item availability checking
- Responsive design
- Clean REST API
- Single Page Application routing
- **1000 realistic demo items** across 6 categories with varied pricing and descriptions

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
   - Add new items for sale
   - View items in "My Items" → "On Sale"
   - Edit item prices

2. **Buyer Flow:**

   - Login as `testuser4` (password: `pass4`)
   - Browse items and add to cart
   - Complete checkout with test card
   - View purchases in "My Items" → "Purchased"

3. **Real-time Cart Updates:**
   - Add items to cart and watch the cart count update immediately
   - No page refresh needed

## Total Points: 42/42 (100%)

- Mandatory: 24/24 points
- Optional: 18/18 points
