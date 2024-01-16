import ProductsCard from './ProductsCard'
import { ProductsPostType } from '../ProductsType';

interface Props {
  products: ProductsPostType[],
}

const ProductList = ({products}: Props) => {

  return (
    <>
      <div style={{display: 'flex', flexDirection: 'row', gap: '10px', marginBottom: '10px', flexWrap: 'wrap'}}>
        {products.map((product) => {
          return <ProductsCard product={product}/>
        })}
      </div>
    </>
  )
}

export default ProductList