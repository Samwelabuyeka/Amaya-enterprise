import { getAllProducts } from "@/lib/supabase/queries";
import Image from "next/image";
import Link from "next/link";

export default async function ProductsPage() {
  const products = await getAllProducts();

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">All Products</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/home/products/${product.slug}`}
            className="border rounded-xl p-2 hover:shadow-lg transition"
          >
            {product.image_url && (
              <Image
                src={product.image_url}
                alt={product.name}
                width={200}
                height={200}
                className="rounded-md object-cover w-full h-40"
              />
            )}
            <div className="mt-2">
              <h2 className="font-semibold text-lg">{product.name}</h2>
              <p className="text-gray-600 text-sm">{product.brand_name}</p>
              <p className="text-green-600 font-bold">Ksh {product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
