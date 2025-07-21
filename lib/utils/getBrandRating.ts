export function getBrandRating(
  sales: number,
  reviews: number,
  averageReview: number,
  verified: boolean
): number {
  const scoreFromSales = Math.min(sales / 100, 5); // Max 5 points
  const scoreFromReviews = Math.min(reviews / 20, 5); // Max 5 points
  const scoreFromAvgReview = (averageReview / 5) * 5; // Normalize to 5
  const verifiedBonus = verified ? 2 : 0; // Bonus for verification

  const rawScore = scoreFromSales * 0.3 + scoreFromReviews * 0.3 + scoreFromAvgReview * 0.3 + verifiedBonus;
  return Math.min(Math.round(rawScore * 10) / 10, 10); // Out of 10
}
