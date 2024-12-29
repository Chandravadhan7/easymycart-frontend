import './wishlistcard.css';
export default function WishListCard({ wishListItem }) {
  return (
    <div className="wishcard">
      <div className="containimage">
        <img
          src={wishListItem?.image}
          alt={wishListItem?.title}
          className="imge"
        />
      </div>
      <div className="rating21">
        {/* <div style={{fontWeight:"bolder"}}>{wishListItem?.rating.rate}</div> */}
        {/* <div><Icon className="classN"  path={mdiStar} size= {0.8} /></div> */}
        {/* <div>| {wishListItem?.rating.count} </div> */}
      </div>
      <div className="contents1">
        <div className="cat">{wishListItem?.category}</div>
        <div className="title">{wishListItem?.title}</div>
        {/* <Rating rating={wishListItem.rating.rate} maxRating={5} size={1} /> */}
        <div className="prce">Rs.{wishListItem?.price}</div>
      </div>
    </div>
  );
}
