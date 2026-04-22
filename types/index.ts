export type UserRole = "buyer" | "seller" | "job_seeker" | "admin";

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
}

export type ProductCategory = "home_decor" | "jewelry" | "accessories";
export type ProductStatus = "active" | "pending" | "rejected";

export interface Product {
  id: string;
  seller_id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  image_url: string | null;
  stock: number;
  status: ProductStatus;
  created_at: string;
  seller?: Profile;
}

export type WasteType = "plastic_bottles" | "wrappers" | "hard_plastic" | "mixed";
export type WasteStatus = "active" | "pending" | "rejected" | "sold";

export interface WasteListing {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  waste_type: WasteType;
  quantity: number;
  unit: string;
  location: string;
  price_per_unit: number | null;
  image_url: string | null;
  status: WasteStatus;
  created_at: string;
  seller?: Profile;
}

export type JobCategory = "crafting" | "collection" | "design" | "delivery";
export type JobType = "full_time" | "part_time" | "contract";

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  category: JobCategory;
  job_type: JobType;
  salary_range: string;
  description: string;
  requirements: string;
  age_preference: string | null;
  status: string;
  created_at: string;
}

export interface JobApplication {
  id: string;
  job_id: string;
  applicant_id: string | null;
  name: string;
  email: string;
  phone: string;
  cover_letter: string;
  created_at: string;
  job?: JobListing;
}

export type InnovationStatus = "pending" | "approved" | "rejected";

export interface Innovation {
  id: string;
  author_id: string;
  title: string;
  description: string;
  tags: string[];
  image_url: string | null;
  status: InnovationStatus;
  created_at: string;
  author?: Profile;
}

export interface Order {
  id: string;
  buyer_id: string;
  items: CartItem[];
  total: number;
  status: string;
  created_at: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  quantity: number;
  category: ProductCategory;
}
