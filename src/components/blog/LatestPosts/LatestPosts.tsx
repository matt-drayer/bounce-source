import * as React from 'react';
import { Article } from 'constants/blog';
import { BLOG_PAGE } from 'constants/pages';
import Link from 'components/Link';
import Post from 'components/blog/Post';
import { Posts } from './styles';

interface Props {
  sectionAnchor: string;
  data: any;
}

const LatestPosts: React.FC<Props> = ({ sectionAnchor, data }) => {
  return (
    <div id={sectionAnchor} className="relative accent-brand-gray-25">
      <div className="px-gutter-base py-14 sm:py-20 lg:py-32">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="text-center font-family-poppins text-5xl font-bold leading-relaxed text-color-text-lightmode-primary dark:text-color-text-darkmode-primary md:text-[64px] md:leading-[96px]">
            Latest blog posts
          </h2>
          <p className="text-center text-lg text-color-text-lightmode-primary dark:text-color-text-darkmode-primary md:text-xl">
            Choose from an array of topics in the world of tennis and pickleball.
          </p>
          <Posts className="mt-12">
            {data.map((post: Article, index: number) => {
              return (
                <Post
                  key={index}
                  tags={post.categories.map(({ label }) => label)}
                  title={post.title}
                  createdAt={post.createdAt}
                  author={post.author}
                  previewText={post.previewText}
                  image={post.previewImage}
                  id={post.id}
                />
              );
            })}
          </Posts>
          <div className="mt-12 flex w-full justify-center">
            <Link
              href={BLOG_PAGE}
              className="button-rounded-inline-brand w-[180px] bg-color-button-brand-primary py-4"
            >
              View all
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestPosts;
