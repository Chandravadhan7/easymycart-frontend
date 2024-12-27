import { setWishlist } from "../store/slices/wishListSlice";

export const fetchWishlist = (wishlistId) => async (dispatch) => {
  try {
    const response = await fetch(`http://localhost:8080/wishlist/${wishlistId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch wishlist. Status: ${response.status}`);
    }

    const wishlistItems = await response.json();

    const productPromises = wishlistItems.map((item) =>
      fetch(`http://localhost:8080/product/${item.productId}`).then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch product ${item.productId}. Status: ${res.status}`);
        }
        return res.json();
      })
    );

    const wishlistProducts = await Promise.all(productPromises);

    dispatch(setWishlist(wishlistProducts));
  } catch (error) {
    console.error("Error fetching wishlist:", error);
  }
};
