export interface BreadcrumbItem {
  id: string;
  name: string;
  image?: string;
}

export interface BreadcrumbListInput {
  items: BreadcrumbItem[];
  context?: string;
}

export const generateBreadcrumbListJsonLd = (input: BreadcrumbListInput): object => {
  const context = input.context || 'https://schema.org';
  const itemListElement = input.items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@id': item.id,
      name: item.name,
      ...(item.image && { image: item.image }),
    },
  }));

  return {
    '@context': context,
    '@type': 'BreadcrumbList',
    itemListElement,
  };
};
