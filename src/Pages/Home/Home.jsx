import { API_BASE_URL } from '../../config/api'
import React, { useEffect } from 'react'
import { Link } from "react-router-dom"
import axios from "axios"
import { useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import LibraryIllustration from "../../Assets/Images/Library_Illustration_1.jpg"
import jwt_decode from "jwt-decode"
import { Sparkles, ArrowRight } from "lucide-react"
import {
  GenreCard,
  NewArrivals,
  Footer,
  useWishlist,
  useCart
} from "../../index.js"
import { useProductAvailable } from "../../Context/product-context"
import { useGenre } from "../../Context/genre-context"
import "./Home.css"

function Home() {
  const { dispatchProductFilterOptions } = useProductAvailable()
  const { dispatchUserWishlist } = useWishlist()
  const { dispatchUserCart } = useCart()
  const {
    setFictionCategoryCheckbox,
    setThrillerCategoryCheckbox,
    setTechCategoryCheckbox,
    setPhilosophyCategoryCheckbox,
    setRomanceCategoryCheckbox,
    setMangaCategoryCheckbox,
  } = useGenre()

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token) {
      const user = jwt_decode(token)
      if (!user) {
        localStorage.removeItem('token')
      }
      else {
        (async function getUpdatedWishlistAndCart() {
          let updatedUserInfo = await axios.get(
            `${API_BASE_URL}/api/user`,
            {
              headers:
              {
                'x-access-token': localStorage.getItem('token'),
              }
            })

          if (updatedUserInfo.data.status === "ok") {
            dispatchUserWishlist({ type: "UPDATE_USER_WISHLIST", payload: updatedUserInfo.data.user.wishlist })
            dispatchUserCart({ type: "UPDATE_USER_CART", payload: updatedUserInfo.data.user.cart })
          }
        })()
      }
    }
  }, [])

  return (
    <div className="home-page">
      <section className="home-hero">
        <img
          className="home-hero-image"
          src={LibraryIllustration}
          alt="Library shelves"
        />

        <div className="home-hero-content">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="home-hero-badge"
          >
            <Sparkles size={14} /> Discover your next great read
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="home-hero-title"
          >
            BookStack
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="home-hero-copy"
          >
            Curated books across fiction, tech, philosophy, romance, manga, and thrillers, arranged for readers who know the next chapter matters.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="home-hero-actions"
          >
            <Link to="/shop">
              <button className="primary-action">
                Browse Catalog <ArrowRight size={18} />
              </button>
            </Link>
            <Link to="/wishlist" className="secondary-action">
              View Wishlist
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="home-stats"
          >
            <div>
              <span>10k+</span>
              <p>Books Available</p>
            </div>
            <div>
              <span>5k+</span>
              <p>Happy Readers</p>
            </div>
            <div>
              <span>4.9/5</span>
              <p>Top Reviews</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="home-section page-shell">
        <div className="section-heading">
          <p>Explore the shelves</p>
          <h2>Shop by Genre</h2>
        </div>

        <div className="genre-grid">
          <Link to={"/shop"}>
            <GenreCard genretype="Fiction" />
          </Link>
          <Link to={"/shop"}>
            <GenreCard genretype="Thriller" />
          </Link>
          <Link to={"/shop"}>
            <GenreCard genretype="Tech" />
          </Link>
          <Link to={"/shop"}>
            <GenreCard genretype="Philosophy" />
          </Link>
          <Link to={"/shop"}>
            <GenreCard genretype="Romance" />
          </Link>
          <Link to={"/shop"} state={{ navigate: true }}>
            <GenreCard genretype="Manga" />
          </Link>
        </div>

        <div className="home-section-action">
          <Link to={"/shop"}>
            <button
              onClick={() => {
                setFictionCategoryCheckbox(true)
                setThrillerCategoryCheckbox(true)
                setTechCategoryCheckbox(true)
                setPhilosophyCategoryCheckbox(true)
                setRomanceCategoryCheckbox(true)
                setMangaCategoryCheckbox(true)
                dispatchProductFilterOptions({ type: "RESET_DEFAULT_FILTERS" })
              }}
              className="secondary-action"
            >
              Explore All Books
            </button>
          </Link>
        </div>
      </section>

      <section className="home-arrivals">
        <div className="page-shell">
          <div className="section-heading">
            <p>Fresh on the desk</p>
            <h2>New Arrivals</h2>
          </div>

          <NewArrivals />
        </div>
      </section>

      <Footer />
    </div>
  )
}

export { Home };



