export type TextRadioValueType = {
  title: string,
  contents: string,
  price: number,
  count: number, 
  exchange_product: string,
  tags: string[],
  shipping_cost: string,
  deal_type: string,
  quality: string,
  changable: string,
  address: string,
  detailAddress: string
}

export type ProductsPostType = {
  id:string,
  post_user: string,
  nickname: string,    
  created_at: string,
  title: string,
  category: string[],
  price: number,
  shipping_cost: string,
  count: number, 
  deal_type: string,
  address: string,
  detailAddress: string,
  quality: string,
  changable: string,
  exchange_product: string,
  contents: string,
  tags: string[], 
  agreement: boolean,
  like_user: {uid:string, }[],
  likes: number,
  image_url: string
};

export interface Props {
  products: ProductsPostType[],
  setProducts: React.Dispatch<React.SetStateAction<ProductsPostType>>
}