import * as React from 'react';
import { FC } from 'react';
import isMobile from 'is-mobile';
import styled from 'styled-components';
import { AuthStatus } from 'constants/auth';
import { Article, Category } from 'constants/blog';
import { HOME_PAGE } from 'constants/pages';
import { useViewer } from 'hooks/useViewer';
import ContactForm from 'components/ContactForm';
import Link from 'components/Link';
import Post from 'components/blog/Post';
import PostsList from 'components/blog/PostsList';
import PreviewPost from 'components/blog/PreviewPost';
// import CoachLandingFooter from 'components/CoachLandingFooter';
import TopNav from 'components/nav/TopNav/TopNav';
import Head from 'components/utilities/Head';
import PopppinsFont from 'components/utilities/PoppinsFont';
import { mobile } from 'styles/breakpoints';
import colors from 'styles/colors.json';

const BlogPage: FC<{ articles: Article[]; categories: Category[] }> = ({
  categories = [],
  articles = [],
}) => {
  const viewer = useViewer();
  const isAnonymous = viewer?.status === AuthStatus.Anonymous;

  const mobile = isMobile({
    tablet: true,
  });

  const [previewArticle, ...restArticles] = articles;

  return (
    <>
      <Head
        title="Blog"
        description="The best content on pickleball, tennis, and padel. Join the largest global racket sports community."
      />
      <PopppinsFont />
      <TopNav
        shouldHideNavigation={false}
        shouldShowMobile
        shouldLinkToAuthPage
        shouldShowAdditionalLinks={false}
        shouldShowStartAction
        isBlur
      />

      <main className="min-h-screen">
        <Preview className="bg-color-bg-darkmode-primary px-gutter-base pb-48 pt-24 lg:pb-96">
          <div className="mx-auto flex max-w-[1200px] flex-col items-center">
            <strong className="mb-4">The Bounce blog</strong>
            <h1 className="font-family-poppins text-[4rem] font-medium text-white">
              <span className="font-semibold italic">Hit</span> different
            </h1>
            <p className="mt-7 text-center text-[1.25rem]">
              An everyday guide for amateur pickleball players.
            </p>
          </div>
        </Preview>
        {previewArticle && (
          <div className="w-full bg-color-bg-lightmode-primary px-6 dark:bg-color-bg-darkmode-primary lg:px-0">
            {mobile ? (
              <PreviewPostMobile className="mx-auto mb-10 max-w-[1200px]">
                <Post
                  id={previewArticle.slug}
                  tags={previewArticle.categories.map(({ label }) => label)}
                  title={previewArticle.title}
                  createdAt={previewArticle.createdAt}
                  author={previewArticle.author}
                  previewText={previewArticle.previewText}
                  image={previewArticle.previewImage}
                />
              </PreviewPostMobile>
            ) : (
              <div className="mx-auto mb-20 max-w-[1200px]">
                <PreviewPost
                  id={previewArticle.slug}
                  tags={previewArticle.categories.map(({ label }) => label)}
                  title={previewArticle.title}
                  createdAt={new Date(previewArticle.createdAt)}
                  author={previewArticle.author}
                  previewText={previewArticle.previewText}
                  image={previewArticle.bannerImage}
                />
              </div>
            )}
            <PostsList articles={restArticles} categories={categories} />
          </div>
        )}
        <div className="w-full bg-brand-gray-50">
          <GetStartedSection className="relative mx-auto flex max-w-[1200px] flex-col items-center justify-between px-6 md:flex-row lg:px-0">
            <div className="mt-8 flex flex-col items-center pb-16 pt-36 md:items-start md:pb-36">
              <h2 className="text-center text-[3rem] font-bold accent-brand-gray-800 md:text-left">
                Ready to play?
              </h2>
              <p className="mb-7 max-w-full text-center text-[1.2rem] accent-brand-gray-800 md:max-w-[70%] md:text-left">
                Join the fastest growing community of racket sports players.
              </p>
              <Link
                href={HOME_PAGE}
                className="button-rounded-inline-background-bold flex h-[56px] w-[180px] w-full items-center justify-center"
              >
                {isAnonymous ? 'Sign up' : 'Get started'}
              </Link>
            </div>
            <div className="flex w-full justify-center self-end md:block md:w-[initial]">
              <img
                className="relative z-20 w-full max-w-[373px]"
                src="/images/tour-page/iphone-12.png"
                alt=""
              />
              <img
                className="absolute bottom-[15px] right-[212px] z-10"
                src="/images/tour-page/ball-6.png"
                alt=""
              />
              <img
                className="absolute right-[-150px] top-[80px] z-10"
                src="/images/tour-page/ball-7.png"
                alt=""
              />
            </div>
          </GetStartedSection>
        </div>
        <ContactForm />
        {/* <CoachLandingFooter /> */}
      </main>
    </>
  );
};

const GetStartedSection = styled.div``;

const Preview = styled.div`
  h1 {
    line-height: 1.2;
  }

  strong,
  p {
    color: ${colors.paletteBrandBlue.colors[100]};
  }
`;

const PreviewPostMobile = styled.div`
  .post {
    max-width: 100%;

    .body {
      margin-top: -14%;

      ${mobile()} {
        margin-top: -20%;
      }
    }

    > img {
      transform: translateY(-50%);
    }
  }
`;

export default BlogPage;
