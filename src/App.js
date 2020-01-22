import React, { useEffect, useState } from "react";
import "rbx/index.css";
import { Container, Level, Button, Block, Message } from "rbx";
import { Drawer } from "@material-ui/core";
import ProductGrid from "./components/ProductGrid";
import ShoppingCart from "./components/ShoppingCart";
import UpdatedCartModal from "./components/UpdatedCartModal";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import CheckOutModal from "./components/CheckOutModal";

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
  const [activeModal, setActiveModal] = useState(false);
  const [outOfStockItems, setOutOfStockItems] = useState({});
  const [limitedQuanityItems, setLimitedQuanityItems] = useState({});
  const [activeCheckOutModal, setActiveCheckOutModal] = useState(false);

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
      }
    };
    db.once("value", handleData, error => alert(error));
    return () => {
      db.off("value", handleData);
    };
  }, []);

  // Get user
  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser);
  }, []);

  // Update current cart with old cart after sign in
  useEffect(() => {
    if (user) {
      const handleData = snap => {
        if (snap.val() && snap.val()["cart"] && snap.val()["cart"][user.uid]) {
          var oldCart = snap.val()["cart"][user.uid];
          var updatedCart = {};

          // Copy over old cart and update prices
          Object.keys(oldCart).forEach(product_key => {
            updatedCart[product_key] = Object.assign({}, oldCart[product_key]);
            if (cartContents[product_key]) {
              updatedCart[product_key]["quantity"] =
                oldCart[product_key]["quantity"] +
                cartContents[product_key]["quantity"];
            }
          });

          // Copy over the rest of current cart contents
          Object.keys(cartContents).forEach(product_key => {
            if (!updatedCart[product_key]) {
              updatedCart[product_key] = Object.assign(
                {},
                cartContents[product_key]
              );
            }
          });

          // Check inventory
          var outOfStock = {};
          var reducedQuantity = {};
          Object.keys(updatedCart).forEach(product_key => {
            const product_sku = updatedCart[product_key]["sku"];
            const product_size = updatedCart[product_key]["size"];
            const inventory_quantity = snap.val()[product_sku][product_size];
            if (inventory_quantity === 0) {
              outOfStock[product_key] = updatedCart[product_key];
              delete updatedCart[product_key];
            } else if (
              updatedCart[product_key]["quantity"] > inventory_quantity
            ) {
              reducedQuantity[product_key] = updatedCart[product_key];
              updatedCart[product_key]["quantity"] = inventory_quantity;
            }
          });

          // Open modal if out of stock or reduced quantity items
          if (
            Object.keys(outOfStock).length !== 0 ||
            Object.keys(reducedQuantity).length !== 0
          ) {
            setLimitedQuanityItems(reducedQuantity);
            setOutOfStockItems(outOfStock);
            setActiveModal(true);
          }

          // Update cart
          setCartContents(updatedCart);
          firebase
            .database()
            .ref("cart")
            .update({
              [user.uid]: updatedCart
            });

          // Update inventory
          var newInventory = snap.val();
          Object.keys(updatedCart).forEach(product_key => {
            const product_sku = updatedCart[product_key]["sku"];
            const product_size = updatedCart[product_key]["size"];
            newInventory[product_sku][product_size] -=
              updatedCart[product_key]["quantity"];
          });
          setInventory(newInventory);
        }
      };
      db.once("value", handleData, error => alert(error));
      return () => {
        db.off("value", handleData);
      };
    }
  }, [user]);

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
        <ProductGrid
          user={user}
          products={products}
          setOpenCart={setOpenCart}
          cartContents={cartContents}
          setCartContents={setCartContents}
          inventory={inventory}
          setInventory={setInventory}
          rowSize={5}
        />
        <UpdatedCartModal
          activeModal={activeModal}
          outOfStockItems={outOfStockItems}
          limitedQuanityItems={limitedQuanityItems}
          setActiveModal={setActiveModal}
        />
        <CheckOutModal
          user={user}
          contents={cartContents}
          setCartContents={setCartContents}
          inventory={inventory}
          setInventory={setInventory}
          activeCheckOutModal={activeCheckOutModal}
          setActiveCheckOutModal={setActiveCheckOutModal}
        />
        <Drawer
          anchor="right"
          open={openCart}
          onClose={() => setOpenCart(false)}
        >
          <ShoppingCart
            user={user}
            contents={cartContents}
            setOpenCart={setOpenCart}
            setCartContents={setCartContents}
            inventory={inventory}
            setInventory={setInventory}
            setActiveCheckOutModal={setActiveCheckOutModal}
          />
        </Drawer>
      </Container>
    </div>
  );
};

export default App;
