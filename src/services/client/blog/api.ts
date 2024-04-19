import { Article, Category } from 'constants/blog';
import { getClient } from 'services/client/contentful';

export const fetchArticleBySlug = async (slug: string): Promise<Article | null> => {
  const contentfulClient = getClient();

  const data = await contentfulClient.getEntries({ content_type: 'article', 'fields.slug': slug });

  const article = data.items[0];

  if (!article) return null;

  return articleToDomain(article);
};

export const fetchArticles = async (): Promise<Article[]> => {
  const contentfulClient = getClient();

  const data = await contentfulClient.getEntries({
    content_type: 'article',
    select:
      'fields.slug,fields.categories,fields.title,fields.author,fields.bannerImage,fields.previewImage,fields.previewText,sys.id,sys.createdAt',
  });

  return data.items.map(articleToDomain);
};

export const fetchCategories = async (): Promise<Category[]> => {
  const contentfulClient = getClient();

  const data = await contentfulClient.getEntries({ content_type: 'category' });

  return data.items.map((dataItem: any) => {
    const category = dataItem?.fields;

    return {
      ...category,
      id: dataItem.sys.id,
      createdAt: dataItem.sys.createdAt,
    };
  });
};

const articleToDomain = (data: any): Article => {
  return {
    ...data?.fields,
    id: data.sys.id,
    slug: data?.fields.slug,
    categories: (data?.fields.categories || []).map((category: any) => ({
      label: category?.fields.label,
      id: category.sys.id,
      createdAt: category.sys.createdAt,
    })),
    author: {
      name: data?.fields.author?.fields.name,
      position: data?.fields.author?.fields.position,
      id: data?.fields.author.sys.id,
      createdAt: data?.fields.author.sys.createdAt,
      avatar: data?.fields.author?.fields.avatar?.fields.file.url,
    },
    bannerImage: data?.fields.bannerImage?.fields.file.url,
    previewImage: data?.fields.previewImage?.fields.file.url,
    createdAt: data.sys.createdAt,
  };
};
