import { syncCartDataSuccess, syncCartDataFailure } from "../cart/cartActions";

export const syncCartData = (cartProducts) => async (dispatch) => {
  try {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      alert("User is not authenticated.");
      return;
    }

    const response = await fetch("http://192.168.1.2:8081/api/cart/all", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: userId,
        products: cartProducts.map((product) => ({
          id: product.id,
          name: product.name,
          quantity: product.quantity,
          price: product.price,
        })),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to sync cart data.");
    }

    const responseData = await response.json();
    dispatch(syncCartDataSuccess(responseData));
    alert("Cart synced successfully!");
  } catch (error) {
    dispatch(syncCartDataFailure(error.message));
    alert(`Error syncing cart: ${error.message}`);
  }
};
