import React from "react";
import "rbx/index.css";
import { Card, Image, Button, Title } from "rbx";

const ProductCard = ({ product }) => {
  const sizes = ["S", "M", "L", "XL"];

  return (
    <Card>
      <Card.Image>
        <Image.Container>
          <Image src={`data/products/${product.sku}_1.jpg`} />
        </Image.Container>
      </Card.Image>
      <Card.Content>
        <Title as="p" size={4}>{product.title}</Title>
        <p>
          {product.description}
          <br />
          {product.currencyFormat}
          {product.price}
        </p>
        <Button.Group>
          {sizes.map(size => (
            <Button outlined color="info" key={size}>
              {size}
            </Button>
          ))}
        </Button.Group>
      </Card.Content>
    </Card>
  );
};

export default ProductCard;
