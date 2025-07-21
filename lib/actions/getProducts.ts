import { supabase } from '../supabaseClient'
import { Product } from '../types/Product'

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')

  if (error) {
    console.error('Error fetching products:', error.message)
    return []
  }

  return data as Product[]
}
