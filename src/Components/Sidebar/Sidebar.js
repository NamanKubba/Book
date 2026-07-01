import React, { useState, useEffect, useRef } from "react";
import { useProductAvailable } from "../../Context/product-context"
import { useGenre } from "../../Context/genre-context";
import { SlidersHorizontal } from "lucide-react"
import "./Sidebar.css"

function Sidebar() {
  const {
  dispatchSortedProductsList,
  productFilterOptions,
  dispatchProductFilterOptions
  } = useProductAvailable()

  const {
    fictionCategoryCheckbox,
    setFictionCategoryCheckbox,
    thrillerCategoryCheckbox, 
    setThrillerCategoryCheckbox,
    techCategoryCheckbox, 
    setTechCategoryCheckbox,
    philosophyCategoryCheckbox, 
    setPhilosophyCategoryCheckbox,
    romanceCategoryCheckbox, 
    setRomanceCategoryCheckbox,
    mangaCategoryCheckbox, 
    setMangaCategoryCheckbox, 
  } = useGenre()

  const ratingRadioBtnRef = useRef(null)

  const [sortPriceLowToHigh, setSortPriceLowToHigh ] = useState(false)
  const [sortPriceHighToLow, setSortPriceHighToLow ] = useState(false)
  
  const [includeOutOfStockCheckbox, setIncludeOutOfStockCheckbox] = useState(true);
  const [fastDeliveryOnlyCheckbox, setFastDeliveryOnlyCheckbox] = useState(false);

  const [minPriceRange, setMinPriceRange] = useState(0);
  const [maxPriceRange, setMaxPriceRange] = useState(1200);


  useEffect(()=>{
    dispatchSortedProductsList({type:"UPDATE_LIST_AS_PER_FILTERS",payload:productFilterOptions})
    if(sortPriceLowToHigh){ setSortPriceLowToHigh(true); setSortPriceHighToLow(false); dispatchSortedProductsList({type:"PRICE_LOW_TO_HIGH"}) }
    if(sortPriceHighToLow){ setSortPriceLowToHigh(false); setSortPriceHighToLow(true); dispatchSortedProductsList({type:"PRICE_HIGH_TO_LOW"}) }
  },[productFilterOptions, dispatchSortedProductsList])

  function clearFilters()
  {
    setMinPriceRange(0)
    setMaxPriceRange(1200)
    setFictionCategoryCheckbox(true)
    setThrillerCategoryCheckbox(true)
    setTechCategoryCheckbox(true)
    setPhilosophyCategoryCheckbox(true)
    setRomanceCategoryCheckbox(true)
    setMangaCategoryCheckbox(true)
    ratingRadioBtnRef.current.click()
    setSortPriceLowToHigh(false) 
    setSortPriceHighToLow(false)
    setIncludeOutOfStockCheckbox(true)
    setFastDeliveryOnlyCheckbox(false)
    dispatchProductFilterOptions({type:"RESET_DEFAULT_FILTERS"})
  }

  return (
    <aside className="filter-panel">
      <div className="filter-panel-header">
        <div className="filter-panel-title">
          <SlidersHorizontal size={18} />
          <span>Filters</span>
        </div>
        <button 
          onClick={clearFilters}
          className="filter-clear-btn"
        >
          Clear All
        </button>
      </div>

      <div className="filter-group">
        <span className="filter-label">Price Range</span>
        <div className="price-range-labels">
          <span>Rs. {minPriceRange}</span>
          <span>Rs. {maxPriceRange}</span>
        </div>
        <div className="range-stack">
          <input
            onChange={(e) => {
              if(maxPriceRange-e.target.value>100)
              {
                setMinPriceRange(Number(e.target.value)); 
                dispatchProductFilterOptions({type:"UPDATE_MIN_PRICE_RANGE_FILTER",minPrice:Number(e.target.value)})
              }
            }}
            type="range"
            className="filter-range"
            min="0"
            max="1200"
            value={minPriceRange}
            step="50"
          />
          <input
            onChange={(e) => {
              if(e.target.value-minPriceRange>100)
              {
                setMaxPriceRange(Number(e.target.value)); 
                dispatchProductFilterOptions({type:"UPDATE_MAX_PRICE_RANGE_FILTER",maxPrice:Number(e.target.value)})
              }
            }}
            type="range"
            className="filter-range"
            min="0"
            max="1200"
            value={maxPriceRange}
            step="50"
          />
        </div>
      </div>

      <div className="filter-group separated">
        <span className="filter-label">Categories</span>
        {[
          { id: 'fiction-checkbox', label: 'Fiction', checked: fictionCategoryCheckbox, setter: setFictionCategoryCheckbox, actionType: 'UPDATE_FICTION_FILTER' },
          { id: 'thriller-checkbox', label: 'Thriller', checked: thrillerCategoryCheckbox, setter: setThrillerCategoryCheckbox, actionType: 'UPDATE_THRILLER_FILTER' },
          { id: 'tech-checkbox', label: 'Tech', checked: techCategoryCheckbox, setter: setTechCategoryCheckbox, actionType: 'UPDATE_TECH_FILTER' },
          { id: 'philosophy-checkbox', label: 'Philosophy', checked: philosophyCategoryCheckbox, setter: setPhilosophyCategoryCheckbox, actionType: 'UPDATE_PHILOSOPHY_FILTER' },
          { id: 'romance-checkbox', label: 'Romance', checked: romanceCategoryCheckbox, setter: setRomanceCategoryCheckbox, actionType: 'UPDATE_ROMANCE_FILTER' },
          { id: 'manga-checkbox', label: 'Manga', checked: mangaCategoryCheckbox, setter: setMangaCategoryCheckbox, actionType: 'UPDATE_MANGA_FILTER' },
        ].map(cat => (
          <label key={cat.id} className="filter-choice">
            <input
              onChange={() => { cat.setter(prev => !prev); dispatchProductFilterOptions({type: cat.actionType}) }}
              id={cat.id}
              type="checkbox"
              checked={cat.checked}
            />
            <span>{cat.label}</span>
          </label>
        ))}
      </div>

      <div className="filter-group separated">
        <span className="filter-label">Minimum Rating</span>
        {[
          { id: '4-stars-or-above', label: '4 stars & above', val: 4 },
          { id: '3-stars-or-above', label: '3 stars & above', val: 3 },
          { id: '2-stars-or-above', label: '2 stars & above', val: 2 },
        ].map(rate => (
          <label key={rate.id} className="filter-choice">
            <input
              onChange={() => dispatchProductFilterOptions({type:"UPDATE_MINIMUM_RATING_FILTER",minRating : rate.val})   }
              type="radio"
              id={rate.id}
              name="rating"
              value={rate.id}
            />
            <span>{rate.label}</span>
          </label>
        ))}
        <label className="filter-choice">
          <input
            onChange={() => dispatchProductFilterOptions({type:"UPDATE_MINIMUM_RATING_FILTER",minRating : 1})   }
            type="radio"
            id="1-stars-or-above"
            name="rating"
            value="1-stars-or-above"
            defaultChecked
            ref={ratingRadioBtnRef}
          />
          <span>Show All Ratings</span>
        </label>
      </div>

      <div className="filter-group separated">
        <span className="filter-label">Sort By</span>
        <label className="filter-choice">
          <input
            onChange={() => { setSortPriceLowToHigh(true); setSortPriceHighToLow(false); dispatchSortedProductsList({type:"PRICE_LOW_TO_HIGH"}) } }
            type="radio"
            id="price-low-to-high"
            name="sort-by"
            value="price-low-to-high"
            checked={sortPriceLowToHigh}
          />
          <span>Price: Low to High</span>
        </label>
        <label className="filter-choice">
          <input
            onChange={() => { setSortPriceLowToHigh(false); setSortPriceHighToLow(true); dispatchSortedProductsList({type:"PRICE_HIGH_TO_LOW"}) } }
            type="radio"
            id="price-high-to-low"
            name="sort-by"
            value="price-high-to-low"
            checked={sortPriceHighToLow}
          />
          <span>Price: High to Low</span>
        </label>
      </div>

      <div className="filter-group separated">
        <span className="filter-label">Preferences</span>
        <label className="filter-choice">
          <input
            id="out-of-stock-checkbox"
            value=""
            onChange={(e) => {setIncludeOutOfStockCheckbox(prevState=>!prevState); dispatchProductFilterOptions({type:"UPDATE_OUTOFSTOCK_FILTER"}) }  }
            type="checkbox"
            checked={includeOutOfStockCheckbox}
          />
          <span>Include Out of Stock</span>
        </label>
        <label className="filter-choice">
          <input
            id="fast-delivery-available-checkbox"
            value=""
            onChange={(e) => {setFastDeliveryOnlyCheckbox(prevState=>!prevState); dispatchProductFilterOptions({type:"UPDATE_FASTDELIVERY_FILTER"})} }
            type="checkbox"
            checked={fastDeliveryOnlyCheckbox}
          />
          <span>Fast Delivery Only</span>
        </label>
      </div>
    </aside>
  );
}

export { Sidebar };
