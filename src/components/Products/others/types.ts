export interface Product {
  id: string;
  name: string;
  currentPrice: number;
  isFeatured: boolean;
  createdAt: Date;
  productImageURL1: string;
  category: string;
  sub_category: string;
  selectedCategory: any;
  isTrending: any;
  isElite: boolean;
  isSpecial: boolean;
  isBudget: boolean;
}

export  interface Category {
  id: string;
  name: string;
  properties: Record<string, any>; // Store additional properties of the category
}
