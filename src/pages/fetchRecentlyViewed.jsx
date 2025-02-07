import { setRecent } from "../store/slices/recentlyVieweditems";

export const recentlyViewed = () => async (dispatch) => {
  let sessionId = localStorage.getItem("sessionId");
  let userId = localStorage.getItem("userId");

  try {
    // Fetch recently viewed product IDs
    const response = await fetch(`http://localhost:8080/product/recentlyViewed`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        sessionId: sessionId,
        userId: userId,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch recently viewed products. Status: ${response.status}`);
    }

    const recentEntities = await response.json();

    // Fetch product details
    const recentProductPromises = recentEntities.map(async (item) => {
      const productResponse = await fetch(`http://localhost:8080/product/${item.productId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          sessionId: sessionId,
          userId: userId,
        },
      });

      if (!productResponse.ok) {
        throw new Error(`Product fetch failed. Status: ${productResponse.status}`);
      }

      const product = await productResponse.json();
      let promises = [];

      // Fetch rating if available
      if (product.rating_id) {
        let ratingPromise = fetch(`http://localhost:8080/product/rating/${product.rating_id}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            sessionId: sessionId,
            userId: userId,
          },
        })
          .then((ratingResponse) => {
            if (!ratingResponse.ok) {
              throw new Error(`Rating fetch failed. Status: ${ratingResponse.status}`);
            }
            return ratingResponse.json();
          })
          .then((ratingData) => {
            product.rating = ratingData;
          });

        promises.push(ratingPromise);
      }

      // Fetch category if available
      if (product.category_id) {
        let categoryPromise = fetch(`http://localhost:8080/product/category/${product.category_id}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            sessionId: sessionId,
            userId: userId,
          },
        })
          .then((categoryResponse) => {
            if (!categoryResponse.ok) {
              throw new Error(`Category fetch failed. Status: ${categoryResponse.status}`);
            }
            return categoryResponse.json();
          })
          .then((categoryData) => {
            product.category = categoryData;
          });

        promises.push(categoryPromise);
      }

      await Promise.all(promises);
      return product;
    });

    // Resolve all product fetch promises
    const recentProducts = await Promise.all(recentProductPromises);

    console.log("Final Recently Viewed Products:", recentProducts);

    // Dispatch to Redux
    dispatch(setRecent(recentProducts));
  } catch (error) {
    console.error("Error fetching recently viewed products:", error);
  }
};
