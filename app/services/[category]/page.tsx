import { notFound } from 'next/navigation';
import { serviceCategories, getCategory } from '../data';
import CategoryPageClient from './CategoryPageClient';

export function generateStaticParams() {
  return serviceCategories.map(category => ({ category: category.id }));
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categoryId } = await params;
  const category = getCategory(categoryId);

  if (!category) {
    notFound();
  }

  return <CategoryPageClient category={category} />;
}
