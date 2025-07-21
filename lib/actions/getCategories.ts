import { supabase } from '../supabaseClient'
import { Category } from '../types/Category'

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error.message)
    return []
  }

  return data as Category[]
}
