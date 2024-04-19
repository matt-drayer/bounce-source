import * as React from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import { format } from 'date-fns';
import { spans } from 'next/dist/build/webpack/plugins/profiling-plugin';
import { Article, Category } from 'constants/blog';
// import CoachLandingFooter from 'components/CoachLandingFooter';
import ContactForm from 'components/ContactForm';
import Tag from 'components/Tag';
import Conclusion from 'components/blog/Conclusion';
import LatestPosts from 'components/blog/LatestPosts';
import TopNav from 'components/nav/TopNav/TopNav';
import Head from 'components/utilities/Head';
import PopppinsFont from 'components/utilities/PoppinsFont';

const LATEST_POSTS_ANCHOR = 'latestPosts';

interface Props {
  articles: Article[];
  article: Article;
  categories: Category[];
}

const ArticlePage = (props: Props) => {
  const { articles, article, categories } = props;
  console.log(article);

  if (!article) {
    return null;
  }

  return (
    <>
      <Head title={article.title} description={article.previewText} />
      <PopppinsFont />
      <TopNav
        shouldShowMobile
        shouldLinkToAuthPage
        shouldShowAdditionalLinks
        shouldShowStartAction
        shouldHideNavigation={false}
        isBlur
      />

      <main className="min-h-screen">
        <div className="flex flex-col bg-color-bg-lightmode-primary dark:bg-color-bg-darkmode-primary">
          <div className="mx-auto max-w-[1200px]">
            <header className="mt-36 flex flex-col">
              <p className="text-center text-[1rem] font-medium accent-brand-gray-700">
                Published {format(new Date(article.createdAt), 'd LLL yyyy')}
              </p>
              <h1 className="mt-3 text-center font-family-poppins text-[3rem] font-bold accent-brand-gray-700">
                {article.title}
              </h1>
              <p className="mt-5 text-center text-[1.4rem] font-light accent-brand-gray-700">
                {article.previewText}
              </p>

              <div className="mb-20 mt-10 flex justify-center">
                {article.categories.map((category: Category, index: number) => {
                  return (
                    <Tag
                      text={category.label}
                      key={index}
                      classes={index + 1 < article.categories.length ? 'mr-3' : ''}
                    />
                  );
                })}
              </div>
            </header>
            <img src={article.bannerImage} alt="" className="object-cover object-center" />
          </div>
          <div className="mx-auto max-w-[720px]">
            <article className="prose mb-16 mt-20 lg:prose-xl">
              {!!article.body &&
                documentToReactComponents(article.body, {
                  renderNode: {
                    [INLINES.ENTRY_HYPERLINK]: (node) => {
                      // @ts-ignore
                      if (!node.data.target) return <span>{node.content[0]?.value}</span>;

                      const fields = node.data.target?.fields;

                      const articleUrl = `${process.env.APP_URL}/blog/${fields?.slug || ''}`;

                      return (
                        <a href={articleUrl} target="_blank">
                          {/*@ts-ignore*/}
                          {node.content[0].value}
                        </a>
                      );
                    },
                    [BLOCKS.EMBEDDED_ASSET]: (node, children) => {
                      const fields = node.data.target?.fields;

                      return (
                        <img
                          src={`https://${fields.file.url}`}
                          style={{
                            maxHeight: fields.file.details.image.height,
                            maxWidth: fields.file.details.image.width,
                            width: '100%',
                            height: '100%',
                          }}
                          alt={fields.description}
                        />
                      );
                    },
                  },
                })}
            </article>

            {article?.conclusion && <Conclusion body={article.conclusion} />}

            <div className="rounded-[16px] bg-brand-gray-25 pb-10 pl-6 pr-6 pt-10">
              <h3 className="mb-5 text-3xl font-medium accent-brand-gray-800">Ready to play?</h3>
              <div className="flex items-center justify-between">
                <span className="text-lg font-light text-gray-600">
                  Find your next session here.
                </span>
                <a
                  href={'#'}
                  rel="noopener noreferrer"
                  className="flex h-[40px] w-[160px] items-center justify-center rounded-[28px] bg-brand-gray-900"
                >
                  <img src="/images/tour-page/play.svg" alt="play" className="rounded-[50%]" />
                  <span className="ml-3 text-[1rem] font-light text-white">View Hits</span>
                </a>
              </div>
            </div>
            <div className="border-color mt-10 flex items-center justify-between border-t pt-5">
              <div className="flex items-center justify-between">
                <img src={article.author.avatar} alt="avatar" className="h-14 w-14 rounded-[50%]" />
                <div className="ml-3 flex flex-col">
                  <span className="text-lg font-medium text-gray-800">{article.author.name}</span>
                  <span className="text-[1rem] font-light text-gray-600">
                    {article.author.position}
                  </span>
                </div>
              </div>
              <a
                href={'#'}
                rel="noopener noreferrer"
                className="flex h-[42px] w-[130px] items-center justify-center rounded-[24px] border border-brand-gray-900"
              >
                <img src="/images/tour-page/external-link.svg" alt="link" />
                <span className="ml-3 accent-brand-gray-900">Share</span>
              </a>
            </div>
          </div>
        </div>
        <LatestPosts sectionAnchor={LATEST_POSTS_ANCHOR} data={articles.slice(0, 3)} />

        <ContactForm />
        {/* <CoachLandingFooter /> */}
      </main>
    </>
  );
};
export default ArticlePage;
