export interface UsedItem {
  id: number;
  uid: string;
  created_at: string;
  post_user: string;
  nickname: string;
  title: string;
  contents: string;
  price: number;
  count: number;
  tags: string[];
  location: string;
  deal_type: string;
  like_user: string[];
  likes: number;
  quality: string;
  exchangable: boolean;
  shipping_cost: boolean;
  agreement: boolean;
  image_filename?: string;
  imageData?: any;
  image_url: string;
  image_Url: string;
  publicURL: string;
  error: string;
}

export interface Communityy {
  post_id: string;
  post_user: string;
  created_at: Date;
  title: string;
  content: string;
  category: string | null;
  comment: string[];
  likes: number | null;
  like_user: string[];
  image_filename?: string;
  imageData?: any;
  image_url: string;
  image_Url: string;
  publicURL: string;
  error: string;
}
