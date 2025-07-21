import { supabase } from '../supabaseClient'
import { Brand } from '../types/Brand'

export async function getBrandById(id: string): Promise<Brand | null> {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching brand:', error.message)
    return null
  }

  return data as Brand
}
