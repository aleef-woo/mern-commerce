export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
  //Calculate items price
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  );

  //Calculate shipping price (Order > RM 100 than free else RM 10)
  state.shippingPrice = addDecimals(
    state.cartItems.length === 0 ? 0 : state.itemsPrice > 100 ? 0 : 10
  );

  //Calculate tax price
  state.taxPrice = addDecimals(Number((0.06 * state.itemsPrice).toFixed(2)));

  //Calculate total price
  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);

  localStorage.setItem("cart", JSON.stringify(state));
  return state;
};
