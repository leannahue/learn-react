import React from "react";
import "rbx/index.css";
import { Block, Title, Image, Column, Tile, Button, Delete, Level } from "rbx";

const removeItem = (product, contents, setCartContents) => {
  console.log("contents", contents);
  console.log("remove this ", product[0]);
  const updatedCart = Object.assign({}, contents);
  delete updatedCart[product[0]];
  console.log("updated cart", updatedCart);
  setCartContents(updatedCart);
};

const ShoppingCart = ({ contents, setOpenCart, setCartContents }) => {
  return (
    <Column size="full">
      <Level>
        <Level.Item align="left">
          <Title as="p">Shopping Cart</Title>
        </Level.Item>
        <Level.Item align="right">
          <Delete onClick={() => setOpenCart(false)}/>
        </Level.Item>
      </Level>
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
                  <br />
                  <Block>
                    <Button
                      color="danger"
                      onClick={() =>
                        removeItem(product, contents, setCartContents)
                      }
                    >
                      Remove
                    </Button>
                  </Block>
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
