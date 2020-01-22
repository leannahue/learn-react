import React from "react";
import "rbx/index.css";
import {
  Block,
  Title,
  Image,
  Column,
  Tile,
  Button,
  Delete,
  Level,
  Container
} from "rbx";
import firebase from "firebase/app";
import "firebase/database";

const removeItem = (
  user,
  product,
  contents,
  setCartContents,
  inventory,
  setInventory
) => {
  // Update inventory
  const newInventory = Object.assign({}, inventory);
  newInventory[product[1].sku][product[1].size] += product[1].quantity;
  setInventory(newInventory);

  // Remove item from cart
  const updatedCart = Object.assign({}, contents);
  delete updatedCart[product[0]];
  setCartContents(updatedCart);

  // Remove item from cart in database
  if (user) {
    firebase
      .database()
      .ref("cart/" + user.uid)
      .child(product[0])
      .remove();
  }
};

const ShoppingCart = ({
  user,
  contents,
  setOpenCart,
  setCartContents,
  inventory,
  setInventory,
  setActiveCheckOutModal
}) => {

  return (
    <Column size="full">
      <Level>
        <Level.Item align="left">
          <Title as="p">Shopping Cart</Title>
        </Level.Item>
        <Level.Item align="right">
          <Delete onClick={() => setOpenCart(false)} />
        </Level.Item>
      </Level>
      <Block />
      {Object.entries(contents).length === 0 ? (
        <h2>You have no items in your shopping cart</h2>
      ) : (
        <Container>
          {Object.entries(contents).map(product => (
            <Tile key={product[0]} kind="ancestor">
              <Tile kind="parent">
                <Image.Container>
                  <Image src={`data/products/${product[1].sku}_2.jpg`} />
                </Image.Container>
              </Tile>
              <Tile size={8} kind="parent" vertical>
                <Title subtitle>{product[1].title}</Title>
                <p>
                  Quantity: {product[1].quantity} <br /> Size: {product[1].size}
                </p>
                <br />
                <Block>
                  <Button
                    color="danger"
                    onClick={() =>
                      removeItem(
                        user,
                        product,
                        contents,
                        setCartContents,
                        inventory,
                        setInventory
                      )
                    }
                  >
                    Remove
                  </Button>
                </Block>
              </Tile>
            </Tile>
          ))}
          <Button
            color="primary"
            align="centered"
            onClick={() => {
              setActiveCheckOutModal(true);
              setOpenCart(false);
            }}
          >
            Check Out
          </Button>
        </Container>
      )}
    </Column>
  );
};

export default ShoppingCart;
