import { getBrandRating } from "@/lib/utils/getBrandRating";

type BrandData = {
  sales: number;
  reviews: number;
  averageReview: number;
  verified: boolean;
};

export function analyzeBrandScore(brand: BrandData) {
  const rating = getBrandRating(
    brand.sales,
    brand.reviews,
    brand.averageReview,
    brand.verified
  );

  let remark = "";

  if (rating >= 8) {
    remark = "This is a top-performing verified brand.";
  } else if (rating >= 6) {
    remark = "Solid performance, consider increasing reviews or engagement.";
  } else {
    remark = "Brand needs to improve reputation and trust signals.";
  }

  return {
    score: rating,
    summary: remark,
  };
}
