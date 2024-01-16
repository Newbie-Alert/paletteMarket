export interface Product {
  id: string;
  uid: string;
  created_at: string;
  post_user: string;
  nickname: string;
  title: string;
  contents: string;
  price: number;
  tags: string[];
  location: string;
  dealType: string;
  like_user: { user_id: string; user_name: string }[];
  likes: number;
  quality: string;
  changable: boolean;
  shipping_cost: boolean;
  agreement: boolean;
  exchange_product: string;
  count: number;
  category: string[];
}

export type CustomUser = {
  id: string;
  uid: string;
  created_at: string;
  username: string;
  nickname: string;
  address: string;
  chat_rooms: {}[];
  likes: {}[];
  board: {}[];
  comment: {}[];
};
