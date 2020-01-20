import React, { useState } from "react";
import "rbx/index.css";
import { Card, Image, Button, Title } from "rbx";

const clickBuy = (
  product,
  setOpenCart,
  cartContents,
  setCartContents,
  chosenSize,
  setSize,
  inventory,
  setInventory
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

  // Remove item from inventory
  inventory[product.sku][chosenSize] -= 1;
  setInventory(inventory);

  // Add product to cart
  contents[productKey] = productForCart;
  setCartContents(contents);
};

const ProductCard = ({
  product,
  inventory,
  setOpenCart,
  cartContents,
  setCartContents,
  setInventory
}) => {
  const sizes = ["S", "M", "L", "XL"];
  const [chosenSize, setSize] = useState("");
  console.log(product.title, inventory[product.sku]);

  return (
    <Card>
      <Card.Image>
        <Image.Container>
          <Image src={`data/products/${product.sku}_1.jpg`} />
        </Image.Container>
      </Card.Image>
      <Card.Content>
        <Title subtitle>{product.title}</Title>
        <p>
          {product.description}
          <br />
          {product.currencyFormat}
          {Number.parseFloat(product.price).toFixed(2)}
        </p>
        {!inventory[product.sku] ||
        Object.values(inventory[product.sku]).every(value => value === 0) ? (
          <strong>Out Of Stock</strong>
        ) : (
          <div>
            <br />
            <Button.Group>
              {sizes.map(size => (
                <Button
                  outlined
                  color="info"
                  key={size}
                  onClick={() => setSize(size)}
                  disabled={
                    !inventory[product.sku] ||
                    inventory[product.sku][size] === 0
                  }
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
                  setSize,
                  inventory,
                  setInventory
                )
              }
            >
              Buy
            </Button>
          </div>
        )}
      </Card.Content>
    </Card>
  );
};

export default ProductCard;
