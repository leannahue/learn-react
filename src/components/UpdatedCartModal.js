import React from "react";
import "rbx/index.css";
import { Modal, Content } from "rbx";

const UpdatedCartModal = ({
  activeModal,
  outOfStockItems,
  limitedQuanityItems,
  setActiveModal
}) => {
  return (
    <Modal active={activeModal} closeOnBlur={true}>
      <Modal.Background />
      <Modal.Card>
        <Modal.Card.Body>
          <Content>
            <p>
              <strong>
                Some items that you have selected are no longer in stock or less
                items are in stock than you requested. Your shopping cart has
                been modified accordingly.
              </strong>
              {Object.keys(outOfStockItems).length === 0 ? null : (
                <div>
                  <br />
                  Out Of Stock Items:
                  <ul>
                    {Object.values(outOfStockItems).map(product => (
                      <li>
                        {product.title}: New Quantity: {product.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {Object.keys(limitedQuanityItems).length === 0 ? null : (
                <div>
                  <br />
                  Limited Quantity Items:
                  <ul>
                    {Object.values(limitedQuanityItems).map(product => (
                      <li>
                        {product.title}: Updated Quantity: {product.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </p>
          </Content>
        </Modal.Card.Body>
        <Modal.Close onClick={() => setActiveModal(false)} />
      </Modal.Card>
    </Modal>
  );
};

export default UpdatedCartModal;
