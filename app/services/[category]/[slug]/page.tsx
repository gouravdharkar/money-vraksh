import { notFound } from 'next/navigation';
import { serviceCategories, getSubService } from '../../data';
import ServiceDetailPage from '../../components/ServiceDetailPage';

export function generateStaticParams() {
  return serviceCategories.flatMap(category =>
    category.subServices.map(service => ({
      category: category.id,
      slug: service.slug,
    }))
  );
}

export default async function ServiceDetailPageWrapper({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category: categoryId, slug } = await params;
  const service = getSubService(categoryId, slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="relative w-full pt-[120px] pb-24">
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full relative z-10">
        <ServiceDetailPage service={service} />
      </main>
    </div>
  );
}
