import './App.css';
import Home from './pages/home';
import { Routes, Route, useLocation } from 'react-router-dom';
import Category from './pages/category';
import Header from './components/header/header';
import Details from './pages/details';
import DashBoard from './pages/dashboard';
import Cart from './pages/cart';
import Wishlist from './pages/wishlist';
import  Checkout  from './pages/checkout';
import Login from './pages/loginpage';
import Order from './pages/order';
import OrderDetails from './pages/orderDetails';
import CategoryBar from './components/caterogybar/categorybar';
import Products from './pages/products';
import Addresses from './pages/addresspage';
import Addaddress from './pages/Addaddress';
import UpdateAddress from './pages/updatepage';
import SignUp from './pages/signup';
import HomeHeader from './components/header/homeheader';
import Profile from './pages/profile';
function App() {
  let location = useLocation();

  const showCategoryBarPaths = ['/cart', '/wishlist', '/orders',"/product/category's/","/product","/add-address","/addresses"];

  const shouldShowCategoryBar = showCategoryBarPaths.some((path) =>
    location.pathname.startsWith(path)
  );
  const hideHeader = ['/login','/']
  const shouldHideHeader = hideHeader.some((path) => 
    location.pathname.startsWith(path)
  );

  const showHomeHeaderBarPaths = ['/'];
  const shouldshowHomeHeader = hideHeader.some((path) => 
    location.pathname.startsWith(path)
  );
  return (
    <div className="App">
      {!shouldHideHeader && <Header />}
      {shouldshowHomeHeader && <HomeHeader/>}
       {shouldShowCategoryBar && <CategoryBar />}        
       <Routes>
        {/* <Route path="/*" element={<DashBoard />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/product/category's/:id" element={<Category />} />
        <Route path="/product" element={<Products/>}/>
        <Route path="/product/:id" element={<Details />} />
        <Route path="/checkoutpage" element={<Checkout/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path="/orders" element={<Order/>}/>
        <Route path="/orders/:cartId/:addressId" element={<OrderDetails/>}/>
        <Route path="/addresses" element={<Addresses/>}/>
        <Route path="/add-address" element={<Addaddress/>}/>
        <Route path="/address/edit/:addressId" element={<UpdateAddress/>}/>
        <Route path="/profile" element={<Profile/>}/>
      </Routes>
    </div>
  );
}

export default App;
