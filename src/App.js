import React, { useEffect, useState } from "react";
import "rbx/index.css";
import { Column, Container } from "rbx";
import ProductCard from './components/ProductCard'

const createGrid = (products, rowSize) => {
  var index = 0;
  var row = [];
  var columnsGroupedByFour = [];
  products.forEach(product => {
    row.push(<Column key={product.sku}><ProductCard product={product} /></Column>);
    if (((index + 1) % rowSize) === 0) {
      columnsGroupedByFour.push(<Column.Group key={((index + 1) / rowSize)}>{row}</Column.Group>);
      row = [];
    } 
    index += 1;
  });
  return <Container>{columnsGroupedByFour}</Container>;
};

const App = () => {
  const [data, setData] = useState({});
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
    // <Container>
    //   <Column.Group>
    //     {products.map(product => (
    //       <Column>{product.title}</Column>
    //     ))}
    //   </Column.Group>
    // </Container>
    createGrid(products, 5)
  );
};

export default App;
