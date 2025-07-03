import { setWishlist } from '../store/slices/wishListSlice';

export const fetchWishlist = (wishlistId) => async (dispatch) => {
  try {
    let sessionKey = localStorage.getItem('sessionId');
    let userId = localStorage.getItem('userId');
    const response = await fetch(
      `http://ec2-13-203-205-26.ap-south-1.compute.amazonaws.com:8081/wishlist/${wishlistId}`,
      {
        method: 'GET',
        credentials: 'include', // Include session cookies
        headers: {
          'Content-Type': 'application/json',
          sessionId: sessionKey,
          userId: userId,
        },
      },
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch wishlist. Status: ${response.status}`);
    }

    const wishlistItems = await response.json();

    const productPromises = wishlistItems.map((item) =>
      fetch(
        `http://ec2-13-203-205-26.ap-south-1.compute.amazonaws.com:8081/product/${item.productId}`,
        {
          method: 'GET',
          credentials: 'include', // Include session cookies
          headers: {
            'Content-Type': 'application/json',
            sessionId: sessionKey,
            userId: userId,
          },
        },
      ).then((res) => {
        if (!res.ok) {
          throw new Error(
            `Failed to fetch product ${item.productId}. Status: ${res.status}`,
          );
        }
        return res.json();
      }),
    );

    const wishlistProducts = await Promise.all(productPromises);

    dispatch(setWishlist(wishlistProducts));
  } catch (error) {
    console.error('Error fetching wishlist:', error);
  }
};
