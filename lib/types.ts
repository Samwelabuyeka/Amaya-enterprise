export type Brand = {
  id: string;
  name: string;
  logo: string;
  email?: string;
  website?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  region?: string;
  category?: string;
  dropshipping?: boolean;
  premium?: boolean;
  description?: string;
  created_at?: string;
};

export type Product = {
  id: string;
  brand_id: string;
  name: string;
  description?: string;
  image: string;
  price: number;
  stock: number;
  created_at?: string;
};
