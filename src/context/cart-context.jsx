import { createContext, useReducer } from "react";
import { DUMMY_PRODUCTS } from "../dummy-products";

const INITIAL_CART_STATE_VALUE = {
  items: [],
};

export const CartContext = createContext({
  items: [],
  addItemToCart: (id) => {},
  updateCartItemQuantity: (productId, amount) => {},
});

const cartReducer = (state, action) => {
  const { items } = state;
  switch (action.type) {
    case "ADD_ITEM":
      const id = action.payload;
      const existingCartItemIndex = items.findIndex(
        (cartItem) => cartItem.id === id
      );
      const existingCartItem = items[existingCartItemIndex];

      if (existingCartItem) {
        const updatedItem = {
          ...existingCartItem,
          quantity: existingCartItem.quantity + 1,
        };
        items[existingCartItemIndex] = updatedItem;
      } else {
        const product = DUMMY_PRODUCTS.find((product) => product.id === id);
        items.push({
          id: id,
          name: product.title,
          price: product.price,
          quantity: 1,
        });
      }

      return { ...state, items };

    case "UPDATE_ITEM":
      const { productId, amount } = action.payload;
      const updatedItemIndex = items.findIndex((item) => item.id === productId);

      const updatedItem = {
        ...items[updatedItemIndex],
      };

      updatedItem.quantity += amount;

      if (updatedItem.quantity <= 0) {
        items.splice(updatedItemIndex, 1);
      } else {
        items[updatedItemIndex] = updatedItem;
      }

      return { ...state, items };

    case "value":
      break;

    default:
      break;
  }
};

const CartContextProvider = ({ children }) => {
  const [shoppingCartState, shoppingCartDispatch] = useReducer(
    cartReducer,
    INITIAL_CART_STATE_VALUE
  );

  function handleAddItemToCart(id) {
    shoppingCartDispatch({
      type: "ADD_ITEM",
      payload: id,
    });
  }

  function handleUpdateCartItemQuantity(productId, amount) {
    shoppingCartDispatch({
      type: "UPDATE_ITEM",
      payload: { productId, amount },
    });
  }

  const ctxValue = {
    items: shoppingCartState.items,
    addItemToCart: handleAddItemToCart,
    updateCartItemQuantity: handleUpdateCartItemQuantity,
  };

  return (
    <CartContext.Provider value={ctxValue}>{children}</CartContext.Provider>
  );
};

export default CartContextProvider;
