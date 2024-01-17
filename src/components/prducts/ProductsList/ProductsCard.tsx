import { ProductsPostType } from "../ProductsType"

const ProductsCard = ({product}: {product: ProductsPostType}) => {
  const { title, price, quality, image_url } = product

  return (
    <div style={{padding: '10px', width: '250px', listStyle: 'none', border: '2px solid darkgray'}}>
      <div style={{marginBottom: '10px', width: '230px', height: '230px'}}>
        {image_url !== null ? <img src={image_url[0]} style={{objectPosition: 'center', objectFit: 'contain', width: '100%', height: '100%'}} /> : <h1></h1>}
      </div>
      <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '10px', marginBottom: '10px'}}>
        {[quality].map(condition =>
          <li key={condition} style={{width: '120px', backgroundColor: 'lightblue', textAlign: 'center', border: '1px solid skyblue'}}>{condition}</li>
        )}
      </div>
      <h2 style={{marginBottom: '10px'}}>{title}</h2>
      <h3>{price}원</h3>
    </div>
  )
}

export default ProductsCard