import { supabase } from '../supabaseClient'
import { Product } from '../types/Product'

export async function getProductById(productId: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single()

  if (error) {
    console.error('Error fetching product:', error.message)
    return null
  }

  return data as Product
}
