import { getBrandBySlug } from "@/lib/supabase/queries";
import Image from "next/image";
import Link from "next/link";

export default async function BrandProfile({ params }: { params: { slug: string } }) {
  const brand = await getBrandBySlug(params.slug);

  if (!brand) {
    return <div className="p-4 text-center text-red-500">Brand not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center gap-4 mb-6">
        {brand.logo_url && (
          <Image
            src={brand.logo_url}
            alt={`${brand.name} logo`}
            width={80}
            height={80}
            className="rounded-xl border"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold">{brand.name}</h1>
          <p className="text-gray-500">{brand.category}</p>
        </div>
      </div>

      <p className="mb-4 text-lg">{brand.description}</p>

      <div className="grid gap-2 text-sm">
        {brand.email && (
          <p>
            <strong>Email:</strong> <a href={`mailto:${brand.email}`} className="text-blue-600 underline">{brand.email}</a>
          </p>
        )}
        {brand.phone && (
          <p>
            <strong>Phone:</strong> <a href={`tel:${brand.phone}`} className="text-blue-600 underline">{brand.phone}</a>
          </p>
        )}
        {brand.whatsapp && (
          <p>
            <strong>WhatsApp:</strong>{" "}
            <a
              href={`https://wa.me/${brand.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              className="text-green-600 underline"
            >
              {brand.whatsapp}
            </a>
          </p>
        )}
        {brand.website && (
          <p>
            <strong>Website:</strong>{" "}
            <a href={brand.website} target="_blank" className="text-blue-600 underline">
              {brand.website}
            </a>
          </p>
        )}
      </div>

      <div className="mt-6">
        <Link href="/home/brands" className="text-sm text-gray-500 hover:underline">
          ← Back to brands
        </Link>
      </div>
    </div>
  );
}
