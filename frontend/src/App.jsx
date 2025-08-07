import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import About from "./pages/About";
import Account from "./pages/Account";
import CartPage from "./pages/CartPage";
import Category from "./pages/Category";
import Contact from "./pages/Contact";
import EditItem from "./pages/EditItem";
import Home from "./pages/Home";
import ItemDetails from "./pages/ItemDetails";
import Login from "./pages/Login";
import MyItems from "./pages/MyItems";
import PurchaseHistory from "./pages/PurchaseHistory";
import Signup from "./pages/Signup";

function App() {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <AuthProvider>
          <CartProvider>
            <Router>
              <div className="App">
                <Navbar />
                <div className="main-content">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/category/:category" element={<Category />} />
                    <Route path="/items/:id" element={<ItemDetails />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/account" element={<Account />} />

                    <Route path="/myitems" element={<MyItems />} />
                    <Route path="/edit-item/:id" element={<EditItem />} />
                    <Route path="/purchases" element={<PurchaseHistory />} />
                    <Route path="/cart" element={<CartPage />} />
                  </Routes>
                </div>
                <Footer />
              </div>
            </Router>
          </CartProvider>
        </AuthProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}

export default App;
