export type ApparelCategory = 
  | 'Trending' 
  | 'Latest' 
  | 'Most Liked' 
  | 'For You' 
  | 'Minimal' 
  | 'Anime' 
  | 'Streetwear' 
  | 'Quotes' 
  | 'Indian' 
  | 'Abstract';

export type TShirtSize = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export type OrderStatus = 
  | 'Pending' 
  | 'Confirmed' 
  | 'In Production' 
  | 'Shipped' 
  | 'Delivered' 
  | 'Cancelled';

export interface Creator {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isVerified?: boolean;
}

export interface FabricSpecs {
  gsm: number;
  material: string;
  fit: string;
  wash: string;
}

export interface Design {
  id: string;
  title: string;
  slug: string;
  creator: Creator;
  description: string;
  tags: string[];
  fabric: FabricSpecs;
  colors: string[];
  defaultColor: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  likesCount: number;
  remixesCount?: number;
  viewsCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  frontImage: string;
  backImage?: string;
  graphicImage?: string;
  prompt: string;
  style: string;
  category: ApparelCategory;
  isTrending?: boolean;
  isCommunity?: boolean;
  isOwnerDrop?: boolean;
  isRecentlyCreated?: boolean;
  createdAt: string;
  // Remix attribution
  originalDesignId?: string;
  originalDesignTitle?: string;
  originalCreatorName?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  bio: string;
  avatar: string;
  tryOnPhotoUrl: string;
  location: string;
  joinedDate: string;
  stats: {
    designs: number;
    likes: number;
    orders: number;
  };
  creditsRemaining?: number;
  hasUnlimitedPass?: boolean;
  role?: 'admin' | 'user';
  email?: string;
}

export interface TrackingStep {
  step: string;
  description: string;
  date: string;
  completed: boolean;
  current: boolean;
}

export interface OrderCustomer {
  fullName: string;
  phoneNumber: string;
  address: string;
  city: string;
  pincode: string;
  state?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  designId: string;
  designTitle: string;
  designImage: string;
  color: string;
  size: TShirtSize;
  material?: string;
  materialGsm?: number;
  quantity: number;
  unitPrice: number;
  deliveryFee: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod?: string;
  paymentId?: string;
  isPaid?: boolean;
  ownerNotified?: boolean;
  customer: OrderCustomer;
  trackingSteps: TrackingStep[];
  createdAt: string;
}

export interface Review {
  id: string;
  designId: string;
  user: {
    name: string;
    avatar: string;
    isVerifiedBuyer: boolean;
  };
  rating: number;
  comment: string;
  date: string;
  helpfulCount: number;
}

export interface AIVariation {
  id: string;
  name: string;
  mockupUrl: string;
  graphicUrl?: string;
  prompt: string;
  color: string;
  fit: string;
  aspectRatio: string;
  tags: string[];
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  variations?: AIVariation[];
  activeAction?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}

export type ActiveModal = 
  | { type: 'tryon'; design: Design }
  | { type: 'order'; design: Design; initialColor?: string; initialSize?: TShirtSize }
  | { type: 'detail'; design: Design }
  | { type: 'edit-profile' }
  | { type: 'upgrade-credits' }
  | { type: 'admin-orders' }
  | { type: 'auth'; mode?: 'login' | 'signup' }
  | null;

export type NavigationPage = 
  | 'home' 
  | 'explore' 
  | 'create' 
  | 'shop' 
  | 'community' 
  | 'my-designs' 
  | 'orders' 
  | 'admin-orders' 
  | 'profile' 
  | 'editor';
