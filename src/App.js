import './App.css';
import Home from './pages/home';
import { Routes,Route } from 'react-router-dom';
import Category from './pages/category';
import Header from './components/header/header';
import Details from './pages/details';
import DashBoard from './pages/dashboard';
import Cart from './pages/cart';
import Wishlist from './pages/wishlist';

function App() {

   return(
    <div className='App'>
      <Header/>
      <Routes>
      <Route path="/*" element={<DashBoard/>} />
        <Route path='/home' element={<Home/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/wishlist' element={<Wishlist/>}/>
        <Route path="/product/category's/:id" element={<Category/>}/>
        <Route path="/product/:id" element={<Details />}/>
      </Routes>
    </div>
    
   )
  
}

export default App;
