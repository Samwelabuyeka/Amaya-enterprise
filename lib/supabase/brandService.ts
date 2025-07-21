import { supabase } from './client'
import { Brand } from '@/types/brand'

export async function fetchBrands(): Promise<Brand[]> {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching brands:', error.message)
    return []
  }

  return data || []
}

export async function fetchBrandById(id: string): Promise<Brand | null> {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching brand by ID:', error.message)
    return null
  }

  return data
}
