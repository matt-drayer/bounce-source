import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { NextParsedUrlQuery } from 'next/dist/server/request-meta';
import { Article as ArticleModel, Category } from 'constants/blog';
import { fetchArticleBySlug, fetchArticles, fetchCategories } from 'services/client/blog/api';
import ArticlePage from 'screens/Blog/ArticlePage';

const Article: NextPage<{
  article: ArticleModel;
  categories: Category[];
  articles: ArticleModel[];
}> = ({ article, categories, articles }) => (
  <ArticlePage article={article} articles={articles} categories={categories} />
);

function safeStringify(obj: object, cache = new WeakSet()) {
  return JSON.stringify(obj, (key, value) => {
    // If type of value is an object or array
    if (typeof value === 'object' && value !== null) {
      // If the value has been JSON stringified before, return a placeholder
      if (cache.has(value)) {
        return; // or you could return a placeholder string, e.g., "[Circular]"
      }
      // Add the current item to the cache
      cache.add(value);
    }
    return value;
  });
}

export const getStaticProps: GetStaticProps<{
  articles: ArticleModel[];
  categories: Category[];
}> = async ({ params }) => {
  const { slug } = params as NextParsedUrlQuery;

  const article = await fetchArticleBySlug(slug as string);

  if (!article) {
    return {
      notFound: true,
    };
  }

  const articles = await fetchArticles();
  const categories = await fetchCategories();

  return {
    props: {
      article: JSON.parse(safeStringify(article)),
      articles: JSON.parse(safeStringify(articles)),
      categories: JSON.parse(safeStringify(categories)),
    },
    revalidate: 180000,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await fetchArticles();

  const paths = articles.map((article) => ({ params: { slug: article.slug } }));

  return {
    paths,
    fallback: true,
  };
};

export default Article;
