import React, { useEffect, useState } from "react";
import "rbx/index.css";
import { Column, Container, Navbar, Button } from "rbx";
import { Drawer } from "@material-ui/core";
import ProductCard from "./components/ProductCard";
import ShoppingCart from "./components/ShoppingCart";

const createGrid = (products, setOpenCart, cartContents, setCartContents, rowSize) => {
  var index = 0;
  var row = [];
  var columnsGroupedByFour = [];
  products.forEach(product => {
    row.push(
      <Column key={product.sku}>
        <ProductCard product={product} setOpenCart={setOpenCart} cartContents={cartContents} setCartContents={setCartContents} />
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
      {createGrid(products, setOpenCart, cartContents, setCartContents, 5)}
      <Drawer
        anchor="right"
        open={openCart}
        onClose={() => setOpenCart(false)}
        width="50%"
      >
        <ShoppingCart contents={cartContents} setCartContents={setCartContents} />
      </Drawer>
    </div>
  );
};

export default App;
