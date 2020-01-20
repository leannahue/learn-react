import React, { useEffect, useState } from "react";
import "rbx/index.css";
import { Column, Container, Navbar, Button } from "rbx";
import { Drawer } from "@material-ui/core";
import ProductCard from "./components/ProductCard";
import ShoppingCart from "./components/ShoppingCart";

const createGrid = (
  products,
  setOpenCart,
  cartContents,
  setCartContents,
  inventory,
  setInventory,
  rowSize
) => {
  var index = 0;
  var row = [];
  var columnsGroupedByFour = [];
  products.forEach(product => {
    row.push(
      <Column key={product.sku}>
        <ProductCard
          product={product}
          inventory={inventory}
          setOpenCart={setOpenCart}
          cartContents={cartContents}
          setCartContents={setCartContents}
          setInventory={setInventory}
        />
      </Column>
    );
    if ((index + 1) % rowSize === 0) {
      columnsGroupedByFour.push(
        <Column.Group key={(index + 1) / rowSize}>{row}</Column.Group>
      );
      row = [];
    }
    index += 1;
  });
  return <Container>{columnsGroupedByFour}</Container>;
};

const App = () => {
  const [data, setData] = useState({});
  const [openCart, setOpenCart] = useState(false);
  const [cartContents, setCartContents] = useState({});
  const [inventory, setInventory] = useState({
    "12064273040195392": {
      S: 0,
      M: 3,
      L: 1,
      XL: 2
    },
    "10412368723880252": {
      S: 3,
      M: 2,
      L: 2,
      XL: 2
    },
    "8552515751438644": {
      S: 2,
      M: 0,
      L: 0,
      XL: 2
    },
    "18644119330491310": {
      S: 3,
      M: 3,
      L: 2,
      XL: 0
    },
    "27250082398145996": {
      S: 1,
      M: 0,
      L: 0,
      XL: 2
    }
  });
  const products = Object.values(data);
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("./data/products.json");
      const json = await response.json();
      setData(json);
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <Navbar>
        <Navbar.Segment align="end">
          <Navbar.Item>
            <Button color="primary" onClick={() => setOpenCart(true)}>
              Cart
            </Button>
          </Navbar.Item>
        </Navbar.Segment>
      </Navbar>
      {createGrid(
        products,
        setOpenCart,
        cartContents,
        setCartContents,
        inventory,
        setInventory,
        5
      )}
      <Drawer
        anchor="right"
        open={openCart}
        onClose={() => setOpenCart(false)}
        // TO DO fix size
      >
        <ShoppingCart
          contents={cartContents}
          setOpenCart={setOpenCart}
          setCartContents={setCartContents}
          inventory={inventory}
          setInventory={setInventory}
        />
      </Drawer>
    </div>
  );
};

export default App;
