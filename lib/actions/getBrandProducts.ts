import { supabase } from '../supabaseClient'
import { Product } from '../types/Product'

export async function getBrandProducts(brandId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('brand_id', brandId)

  if (error) {
    console.error('Error fetching brand products:', error.message)
    return []
  }

  return data as Product[]
}
