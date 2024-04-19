import { Document } from '@contentful/rich-text-types';

export type Article = {
  id: string;
  title: string;
  previewText: string;
  categories: Category[];
  createdAt: string;
  author: Author;
  bannerImage: string;
  previewImage: string;
  body: Document;
  conclusion: string;
  slug: string;
};

export type Category = {
  label: string;
  id: string;
};

export type Author = {
  id: string;
  name: string;
  avatar: string;
  position: string;
  createdAt: string;
};
