import { useEffect, useState } from 'react'
import ProductsTags from '../../components/prducts/ProductsList/ProductsTags'
import ProductList from '../../components/prducts/ProductsList/ProductList'
import ProductsSearchBar from '../../components/prducts/ProductsList/ProductsSearchBar'
import ProductsSortBtn from '../../components/prducts/ProductsList/ProductsSortBtn'
import { supabase } from '../../api/supabase/supabaseClient'
import { ProductsPostType } from '../../components/prducts/ProductsType'

const Products = () => {

  const [products, setProducts] = useState<ProductsPostType[]>([]);

  useEffect(() => {
    getProducts();
  }, [])
  
  // 나중에 필요한 것만 가져오기 ex. select('id, name')
  const getProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        //.eq('category', ['조소'])
      if (error) throw error;
      if (data != null) {
        setProducts(data);
      }
    } catch (error) {
      alert('예상치 못한 문제가 발생하였습니다. 다시 시도하여 주십시오.')
    }
  }
  // console.log(products)

  return (
    <div style={{padding: '20px'}}>
      <h2 style={{marginBottom: '20px', fontSize: '30px', fontWeight: 'bold'}}>{products.length}개의 상품이 거래되고 있어요</h2>
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <ProductsTags />
        <ProductsSearchBar />
        <ProductsSortBtn />
      </div>
      <ProductList products={products} />
    </div>
  )
}

export default Products