import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { 
  Navbar, 
  Toast,
  Home,
  Shop, 
  ProductPage,
  Login,
  Signup,
  Wishlist,
  Cart,
  Orders,
} from "./index"

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar/>
        <Routes>
          <Route path="/"         exact element={<Home/>} />
          <Route path="/shop"     exact element={<Shop/>} />
          <Route path="/shop/:id"       element={<ProductPage/>} />
          <Route path="/login"          element={<Login/>} />
          <Route path="/signup"         element={<Signup/>} />
          <Route path="/wishlist"       element={<Wishlist/>} />
          <Route path="/cart"           element={<Cart/>} />
          <Route path="/orders"         element={<Orders/>} />
        </Routes>
        <Toast position="bottom-right"/>
      </div>
    </Router>
  );
}

export default App;
