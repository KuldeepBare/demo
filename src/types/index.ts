export type Category = 
  | 'whisky' 
  | 'gin' 
  | 'wine' 
  | 'vodka' 
  | 'tequila' 
  | 'beer' 
  | 'cocktail_kits';

export interface Product {
  id: string;
  name: string;
  category: Category;
  subCategory: string;
  origin: string;
  abv: number;
  volume: string;
  price: number;
  inStock: boolean;
  stockCount: number;
  description: string;
  tastingNotes: string[];
  pairing: string;
  servingTemp: string;
  curatorNotes: string;
  image: string;
  maxPerOrder?: number;
  exciseCode: string;
}

export type OrderStatus = 
  | 'New'
  | 'Verification pending'
  | 'Verified'
  | 'Accepted'
  | 'Preparing'
  | 'Out for delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Rejected';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface VerificationToken {
  token: string;
  verifiedAt: string;
  expiresAt: string;
  provider: 'DigiLocker_API' | 'IDCentral_Auth' | 'Aadhaar_Offline_XML' | 'Manual_Physical_ID';
  ageVerified: boolean;
  minAgeMet: number;
  verificationHash: string; // Zero-knowledge proof hash, no raw PII
}

export interface OrderCustomer {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  pincode: string;
  deliveryNotes?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  category: Category;
  volume: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  customer: OrderCustomer;
  items: OrderItem[];
  subtotal: number;
  exciseTax: number;
  deliveryFee: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  verificationStatus: 'Verified' | 'Pending Courier Verification' | 'Rejected';
  verificationToken?: string;
  verificationMethod: string;
  legalAffirmationAccepted: boolean;
  deliveryWindow: string;
  operatorNotes?: string;
}

export interface ComplianceConfig {
  serviceWindowStart: string; // e.g. "23:00"
  serviceWindowEnd: string;   // e.g. "05:00"
  minLegalAge: number;       // e.g. 21 or 25
  jurisdiction: string;      // e.g. "Maharashtra Excise Jurisdiction"
  licenseNumber: string;     // e.g. "FL-III/2026/MUM-WZ-8849"
  maxBottlesPerOrder: number;// e.g. 3 bottles
  permittedPincodes: string[]; // List of serviced pincodes
  permittedNeighborhoods: string[];
  mandatoryPhysicalIdCheckAtDoor: boolean;
  serviceEnabled: boolean;
  maintenanceReason?: string;
  isSimulatedOpenForTesting?: boolean; // Convenience toggle for reviewers testing during daytime!
  isOpenNow?: boolean;
  currentTime?: string;
  displayWindow?: string;
}

export interface NotificationLog {
  id: string;
  orderId: string;
  type: 'SMS' | 'EMAIL' | 'WHATSAPP';
  recipient: string;
  message: string;
  sentAt: string;
  status: 'DELIVERED' | 'QUEUED' | 'SIMULATED';
}
