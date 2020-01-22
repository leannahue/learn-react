import React from "react";
import firebase from "firebase/app";
import "rbx/index.css";
import { Modal, Content, Button } from "rbx";

const checkOutCart = (
  user,
  contents,
  setCartContents,
  inventory,
  setInventory,
  setActiveCheckOutModal
) => {
  // Update inventory
  var newInventory = Object.assign({}, inventory);
  Object.keys(contents).forEach(product_key => {
    const product_sku = contents[product_key]["sku"];
    const product_size = contents[product_key]["size"];
    newInventory[product_sku][product_size] -=
      contents[product_key]["quantity"];

    firebase
      .database()
      .ref(product_sku)
      .update({ [product_size]: newInventory[product_sku][product_size] });
  });
  setInventory(newInventory);

  // Clear cart
  setCartContents({});
  if (user) {
    firebase
      .database()
      .ref("cart")
      .child(user.uid)
      .remove();
  }

  setActiveCheckOutModal(false);
};

const CheckOutModal = ({
  user,
  contents,
  setCartContents,
  inventory,
  setInventory,
  activeCheckOutModal,
  setActiveCheckOutModal
}) => {
  return (
    <Modal active={activeCheckOutModal} closeOnBlur={true}>
      <Modal.Background />
      <Modal.Card>
        <Modal.Card.Head>Check Out</Modal.Card.Head>
        <Modal.Card.Body>
          <Content>
            <p>
              <strong>You are purchasing these items.</strong>
              {Object.values(contents).map(product => (
                <li>
                  {product.title} ({product.size}): {product.quantity}
                </li>
              ))}
            </p>
          </Content>
        </Modal.Card.Body>
        <Modal.Card.Foot>
          <Button
            color="success"
            onClick={() =>
              checkOutCart(
                user,
                contents,
                setCartContents,
                inventory,
                setInventory,
                setActiveCheckOutModal
              )
            }
          >
            Finish Checking Out
          </Button>
          <Button onClick={() => setActiveCheckOutModal(false)}>Cancel</Button>
        </Modal.Card.Foot>
        <Modal.Close onClick={() => setActiveCheckOutModal(false)} />
      </Modal.Card>
    </Modal>
  );
};

export default CheckOutModal;
