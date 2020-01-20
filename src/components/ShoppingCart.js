import React from "react";
import "rbx/index.css";
import { Block, Title, Image, Column, Tile } from "rbx";

const ShoppingCart = ({ contents }) => {
  return (
    <Column size="full">
      <Title as="p" size={2}>
        Shopping Cart
      </Title>
      {Object.entries(contents).length === 0 ? (
        <h2>You have no items in your shopping cart</h2>
      ) : (
        <div>
          {Object.entries(contents).map(product => (
            <Block key={product[0]}>
              <Tile kind="ancestor">
                <Tile kind="parent">
                  <Image.Container>
                    <Image src={`data/products/${product[1].sku}_2.jpg`} />
                  </Image.Container>
                </Tile>
                <Tile size={8} kind="parent" vertical>
                  <Title subtitle>{product[1].title}</Title>
                  <p>
                    Quantity: {product[1].quantity} <br /> Size:{" "}
                    {product[1].size}
                  </p>
                </Tile>
              </Tile>
            </Block>
          ))}
        </div>
      )}
    </Column>
  );
};

export default ShoppingCart;
