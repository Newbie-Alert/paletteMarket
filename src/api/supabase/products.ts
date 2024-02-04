export interface LikeUser {
  userNickname: string;
  user_uid: string;
}
export interface Product {
  id: string;
  nickname: string;
  quality: string;
  title: string;
  price: number;
  user: string;
  image_url: string;
  like_user: LikeUser[];
  about: string;
  isSell: boolean;
}

export interface ProductCardProps {
  activeTab: number;
}

export interface MyPageItemCardProps {
  id: string;
  image_url: string;
  user: string;
  quality: string;
  title: string;
  price: number;
}
