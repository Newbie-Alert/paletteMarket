export interface Product {
  id: number;
  quality: string;
  title: string;
  price: number;
  user: string;
  image_url: string;
}

export interface ProductCardProps {
  //   list: Product[];
  activeTab: number;
}

// TODO: ProductCard에 있는 함수들 공통화
