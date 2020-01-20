import React, { useState } from "react";
import "rbx/index.css";
import { Card, Image, Button, Title } from "rbx";

const clickBuy = (
  product,
  setOpenCart,
  cartContents,
  setCartContents,
  chosenSize,
  setSize
) => {
  setOpenCart(true);
  const contents = cartContents;
  var productKey = `${product.sku}, ${chosenSize}`;
  const productForCart = Object.assign({}, product); // must pass by value not reference

  // Set or increment quantity
  if (Object.keys(cartContents).includes(productKey)) {
    productForCart.quantity = contents[productKey]["quantity"] + 1;
  } else {
    productForCart.quantity = 1;
  }

  // Add size
  if (chosenSize.length !== 0) {
    productForCart.size = chosenSize;
    setSize("");
  } else {
    console.log("SET A SIZE SMH"); // TO DO don't add item, add popup to choose size
  }

  // Add product to cart
  contents[productKey] = productForCart;
  setCartContents(contents);
};

const ProductCard = ({
  product,
  setOpenCart,
  cartContents,
  setCartContents
}) => {
  const sizes = ["S", "M", "L", "XL"];
  const [chosenSize, setSize] = useState("");

  return (
    <Card>
      <Card.Image>
        <Image.Container>
          <Image src={`data/products/${product.sku}_1.jpg`} />
        </Image.Container>
      </Card.Image>
      <Card.Content>
        <Title subtitle>
          {product.title}
        </Title>
        <p>
          {product.description}
          <br />
          {product.currencyFormat}
          {Number.parseFloat(product.price).toFixed(2)}
        </p>
        <br />
        <Button.Group>
          {sizes.map(size => (
            <Button
              outlined
              color="info"
              key={size}
              onClick={() => setSize(size)}
            >
              {size}
            </Button>
          ))}
        </Button.Group>
        <Button
          color="primary"
          onClick={() =>
            clickBuy(
              product,
              setOpenCart,
              cartContents,
              setCartContents,
              chosenSize,
              setSize
            )
          }
        >
          Buy
        </Button>
      </Card.Content>
    </Card>
  );
};

export default ProductCard;
