import React, { useEffect, useState } from "react";
import "rbx/index.css";
import { Tile, Container, Level, Button, Block, Message } from "rbx";
import { Drawer } from "@material-ui/core";
import ProductCard from "./components/ProductCard";
import ShoppingCart from "./components/ShoppingCart";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

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
      <Tile kind="parent" key={product.sku}>
        <ProductCard
          product={product}
          inventory={inventory}
          setOpenCart={setOpenCart}
          cartContents={cartContents}
          setCartContents={setCartContents}
          setInventory={setInventory}
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

// Initialize Firebase database
const firebaseConfig = {
  apiKey: "AIzaSyBGg0BClIgl6Ae6FHtUhVqYQW6tOB_bEhw",
  authDomain: "learn-react-data.firebaseapp.com",
  databaseURL: "https://learn-react-data.firebaseio.com",
  projectId: "learn-react-data",
  storageBucket: "learn-react-data.appspot.com",
  messagingSenderId: "884246629473",
  appId: "1:884246629473:web:986780504a1f59ac642e20",
  measurementId: "G-19JTWKZ2R6"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref();

// Firebase Auth
const uiConfig = {
  signInFlow: "popup",
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  callbacks: {
    signInSuccessWithAuthResult: () => false
  }
};

const Welcome = ({ user }) => (
  <Message color="info">
    <Message.Header>
      Welcome, {user.displayName}
      <Button primary onClick={() => firebase.auth().signOut()}>
        Log out
      </Button>
    </Message.Header>
  </Message>
);

const SignIn = () => (
  <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
);

const App = () => {
  const [data, setData] = useState({});
  const [openCart, setOpenCart] = useState(false);
  const [cartContents, setCartContents] = useState({});
  const [inventory, setInventory] = useState({});
  const [user, setUser] = useState(null);

  const products = Object.values(data);

  // Get products
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("./data/products.json");
      const json = await response.json();
      setData(json);
    };
    fetchProducts();
  }, []);

  // Get inventory
  useEffect(() => {
    const handleData = snap => {
      if (snap.val()) {
        setInventory(snap.val());
        console.log("The database returns: " + snap);
      }
    };
    db.on("value", handleData, error => alert(error));
    return () => {
      db.off("value", handleData);
    };
  }, []);

  // Get user
  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser);
  }, []);

  return (
    <div>
      {user ? <Welcome user={user} /> : null}
      <Container>
        <Level>
          <Level.Item align="left">{user ? null : <SignIn />}</Level.Item>
          <Level.Item align="right">
            <Button color="primary" onClick={() => setOpenCart(true)}>
              Cart
            </Button>
          </Level.Item>
        </Level>
        <Block />
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
      </Container>
    </div>
  );
};

export default App;
