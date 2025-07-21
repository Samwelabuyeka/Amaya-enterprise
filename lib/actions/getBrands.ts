import { supabase } from '../supabaseClient'
import { Brand } from '../types/Brand'

export async function getBrands(): Promise<Brand[]> {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching brands:', error.message)
    return []
  }

  return data as Brand[]
}
