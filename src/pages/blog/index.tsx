import { Article, Category } from 'constants/blog';
import { fetchArticles, fetchCategories } from 'services/client/blog/api';
import BlogPage from 'screens/Blog';

export const getStaticProps = async () => {
  const articles = await fetchArticles();
  const categories = await fetchCategories();

  const props = {
    articles,
    categories,
  };

  return {
    props,
    revalidate: 3600,
  };
};

const Blog: React.FC<{ articles: Article[]; categories: Category[] }> = ({
  articles,
  categories,
}) => <BlogPage categories={categories} articles={articles} />;

export default Blog;
