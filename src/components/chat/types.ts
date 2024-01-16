import { User } from '@supabase/supabase-js';
import { ReactNode } from 'react';

export type MessageType = {
  id: string;
  sender_id: string;
  chat_room_id: string;
  content: string;
  image_url: string;
  created_at: string;
  isNew: boolean;
  timeStamp: string;
};

export type Participants = {
  user_id: string;
  user_name: string;
};

export type RoomType = {
  id: string;
  created_at: string;
  participants: Participants[];
};

export type RoomStyledProps = {
  $current: string | undefined;
  children: ReactNode;
};

export type MessageCompProps = {
  messages: MessageType[];
  curUser: User | null | undefined;
};