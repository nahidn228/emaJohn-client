import React, { useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import {
  addToDb,
  deleteShoppingCart,
  getShoppingCart,
} from "../../utilities/fakedb";
import Cart from "../Cart/Cart";
import Product from "../Product/Product";
import "./Shop.css";

const Shop = () => {
  const cart = useLoaderData();
  const [products, setProducts] = useState([]);
  //   const [cart, setCart] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPages, setItemsPerPages] = useState(10);
  const storedCart = getShoppingCart();
  const storedCartIds = Object.keys(storedCart);
  const [count, setCount] = useState(0);

  //   const { count } = useLoaderData();
  //   const count = 76;
  //   console.log(count);
  //   console.log(currentPage);

  const numberOfPages = Math.ceil(count / itemsPerPages);

  const pages = [...Array(numberOfPages).keys()];
  //   const pages = [];
  //   for (let i = 0; i < numberOfPages; i++) {
  //     pages.push(i);
  //   }
  //   console.log(pages);

  useEffect(() => {
    fetch("http://localhost:5000/productsCount")
      .then((res) => res.json())
      .then((data) => setCount(data.count));
  }, []);

  useEffect(() => {
    fetch(
      `http://localhost:5000/products?pages=${currentPage}&size=${itemsPerPages}`
    )
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, [currentPage, itemsPerPages]);

  //   useEffect(() => {
  //     const savedCart = [];
  //     // step 1: get id of the addedProduct
  //     for (const id in storedCart) {
  //       // step 2: get product from products state by using id
  //       const addedProduct = products.find((product) => product._id === id);
  //       if (addedProduct) {
  //         // step 3: add quantity
  //         const quantity = storedCart[id];
  //         addedProduct.quantity = quantity;
  //         // step 4: add the added product to the saved cart
  //         savedCart.push(addedProduct);
  //       }
  //       // console.log('added Product', addedProduct)
  //     }
  //     // step 5: set the cart
  //     setCart(savedCart);
  //   }, [products]);

  const handleAddToCart = (product) => {
    // cart.push(product); '
    let newCart = [];
    // const newCart = [...cart, product];
    // if product doesn't exist in the cart, then set quantity = 1
    // if exist update quantity by 1
    const exists = cart.find((pd) => pd._id === product._id);
    if (!exists) {
      product.quantity = 1;
      newCart = [...cart, product];
    } else {
      exists.quantity = exists.quantity + 1;
      const remaining = cart.filter((pd) => pd._id !== product._id);
      newCart = [...remaining, exists];
    }

    setCart(newCart);
    addToDb(product._id);
  };

  const handleClearCart = () => {
    setCart([]);
    deleteShoppingCart();
  };

  const handleItemsPerPage = (e) => {
    console.log(e.target.value);
    const val = e.target.value;
    setItemsPerPages(val);
    setCurrentPage(0);
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="shop-container">
      <div className="products-container">
        {products.map((product) => (
          <Product
            key={product._id}
            product={product}
            handleAddToCart={handleAddToCart}
          ></Product>
        ))}
      </div>
      <div className="cart-container">
        <Cart cart={cart} handleClearCart={handleClearCart}>
          <Link className="proceed-link" to="/orders">
            <button className="btn-proceed">Review Order</button>
          </Link>
        </Cart>
      </div>
      <div className="pagination">
        <p>Current Page: {currentPage}</p>
        <button onClick={handlePreviousPage}>Prev</button>
        {pages.map((page, idx) => (
          <button
            className={currentPage === page ? "selected" : ""}
            onClick={() => setCurrentPage(page)}
            key={page}
          >
            {page}
          </button>
        ))}
        <button onClick={handleNextPage}>Next</button>
        <select
          defaultValue={itemsPerPages}
          onChange={handleItemsPerPage}
          name=""
          id=""
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="40">40</option>
          <option value="50">50</option>
        </select>
      </div>
    </div>
  );
};

export default Shop;
