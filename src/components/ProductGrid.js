import React from "react";
import "rbx/index.css";
import { Tile, Container } from "rbx";
import ProductCard from "./ProductCard";

const ProductGrid = ({
  user,
  products,
  setOpenCart,
  cartContents,
  setCartContents,
  inventory,
  setInventory,
  rowSize
}) => {
  var index = 0;
  var row = [];
  var columnsGroupedByFour = [];
  products.forEach(product => {
    row.push(
      <Tile kind="parent" key={product.sku}>
        <ProductCard
          user={user}
          product={product}
          inventory={inventory}
          setInventory={setInventory}
          setOpenCart={setOpenCart}
          cartContents={cartContents}
          setCartContents={setCartContents}
        />
      </Tile>
    );
    if ((index + 1) % rowSize === 0) {
      columnsGroupedByFour.push(
        <Tile kind="ancestor" key={(index + 1) / rowSize}>
          {row}
        </Tile>
      );
      row = [];
    }
    index += 1;
  });
  return <Container>{columnsGroupedByFour}</Container>;
};

export default ProductGrid;
