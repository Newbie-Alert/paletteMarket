import { ProductsPostType } from "../ProductsType"

const ProductsCard = ({product}: {product: ProductsPostType}) => {
  const { title, price, quality } = product

  return (
    <div style={{padding: '10px', width: '250px', listStyle: 'none', border: '2px solid magenta'}}>
      <div style={{marginBottom: '10px', width: '230px', height: '230px', backgroundColor: 'pink'}}>
        <image>
        </image>
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