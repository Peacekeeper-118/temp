
import { Post } from '../types';

// Levenshtein distance algorithm for fuzzy matching (handling typos)
const levenshteinDistance = (a: string, b: string): number => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // deletion
          Math.min(matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1) // substitution
        );
      }
    }
  }
  return matrix[b.length][a.length];
};

/**
 * Enhanced search service for Revendre
 * Uses weighted scoring and term coverage multipliers to ensure the most relevant items
 * appear first. Handles typos, partial matches, and multi-word queries.
 */
export const searchPosts = (posts: Post[], query: string): Post[] => {
  const cleanQuery = query.toLowerCase().trim().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
  if (!cleanQuery) return posts;

  const terms = cleanQuery.split(/\s+/).filter(t => t.length > 0);
  if (terms.length === 0) return posts;

  const scoredPosts = posts.map(post => {
    let baseScore = 0;
    let matchedTermsCount = 0;
    
    // Normalize fields for searching
    const brand = post.brand.toLowerCase();
    const desc = post.description.toLowerCase();
    const tags = post.tags.map(t => t.toLowerCase());
    const size = post.size.toLowerCase();
    const location = post.location?.toLowerCase() || '';
    const color = post.color?.toLowerCase() || '';
    const material = post.material?.toLowerCase() || '';

    // Check each term individually
    terms.forEach(term => {
      let termScore = 0;
      let matched = false;

      // 1. Exact Matches (Highest Priority)
      if (brand === term) { termScore += 100; matched = true; }
      if (tags.includes(term)) { termScore += 50; matched = true; }
      if (size === term) { termScore += 40; matched = true; }
      if (color === term) { termScore += 30; matched = true; }
      if (material === term) { termScore += 25; matched = true; }
      
      // 2. Inclusion Matches (High Priority)
      if (!matched && brand.includes(term)) { termScore += 40; matched = true; }
      if (desc.includes(term)) { termScore += 15; matched = true; }
      if (location.includes(term)) { termScore += 10; matched = true; }

      // 3. Fuzzy Matches (Handling Typos)
      // Only for terms with 3+ chars to avoid excessive false positives
      if (!matched && term.length >= 3) {
        const allowedErrors = term.length > 6 ? 2 : 1;
        
        // Check brand fuzzy
        if (levenshteinDistance(brand, term) <= allowedErrors) {
          termScore += 35;
          matched = true;
        }
        
        // Check tags fuzzy
        if (!matched && tags.some(tag => levenshteinDistance(tag, term) <= allowedErrors)) {
          termScore += 25;
          matched = true;
        }
      }

      if (matched) {
        baseScore += termScore;
        matchedTermsCount++;
      }
    });

    // 4. Term Coverage Multiplier
    // If a post matches more search terms, it's significantly more relevant
    // e.g. "Vintage Nike Shirt" - a post matching all 3 words is much better than matching 1.
    const coverageMultiplier = (matchedTermsCount / terms.length);
    const finalScore = baseScore * (1 + coverageMultiplier);

    // 5. Recency and Status modifiers
    let metaScore = 0;
    // Boost items that aren't sold
    if (!post.isSold) metaScore += 10;
    
    // Small boost for recency
    const ageInHours = (Date.now() - new Date(post.createdAt || Date.now()).getTime()) / (1000 * 60 * 60);
    if (ageInHours < 48) metaScore += 5;

    return { post, score: finalScore + metaScore };
  });

  // Filter out items with 0 relevance and sort by score descending
  return scoredPosts
    .filter(item => item.score > 1) // Using 1 as a threshold for any actual match
    .sort((a, b) => b.score - a.score)
    .map(item => item.post);
};
