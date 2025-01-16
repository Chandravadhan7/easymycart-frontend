// import './wishlistcard.css';
// export default function WishListCard({ wishListItem }) {
//   return (
//     <div className="wishcard">
//       <div className="containimage">
//         <img
//           src={wishListItem?.image}
//           alt={wishListItem?.title}
//           className="imge"
//         />
//       </div>
//       <div className="rating21">
//         {/* <div style={{fontWeight:"bolder"}}>{wishListItem?.rating.rate}</div> */}
//         {/* <div><Icon className="classN"  path={mdiStar} size= {0.8} /></div> */}
//         {/* <div>| {wishListItem?.rating.count} </div> */}
//       </div>
//       <div className="contents1">
//         <div className="cat">{wishListItem?.category}</div>
//         <div className="title">{wishListItem?.title}</div>
//         {/* <Rating rating={wishListItem.rating.rate} maxRating={5} size={1} /> */}
//         <div className="prce">Rs.{wishListItem?.price}</div>
//       </div>
//     </div>
//   );
// }


import './wishlistcard.css';
export default function WishListCard({ wishListItem }) {
  const isOutOfStock = wishListItem?.isOutOfStock;

  return (
    <div className={`wishcard ${isOutOfStock ? 'out-of-stock' : ''}`}>
      {/* Image Section */}
      <div className="containimage">
        <img
          src={wishListItem?.image}
          alt={wishListItem?.title}
          className="imge"
        />
        {isOutOfStock && (
          <div className="out-of-stock-overlay">OUT OF STOCK</div>
        )}
        <button className="remove-btn">✕</button>
      </div>

      {/* Product Details Section */}
      <div className="contents1">
        <div className="title">{wishListItem?.title}</div>
        <div className="price-section">
          <span className="prce">Rs.{wishListItem?.sellingPrice}</span>
          {wishListItem?.originalPrice && (
            <span className="original-price">Rs.{wishListItem?.originalPrice}</span>
          )}
          {wishListItem?.discount && (
            <span className="discount">({wishListItem?.discount}%OFF)</span>
          )}
        </div>
      </div>

      {/* Button Section */}
      <button className="move-to-bag-btn">MOVE TO BAG</button>
    </div>
  );
}
