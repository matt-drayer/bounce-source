import * as React from 'react';
import { FC, useEffect, useState } from 'react';
import mobile from 'is-mobile';
import { Controller, useForm } from 'react-hook-form';
import ReactPaginate from 'react-paginate';
import { Article, Category } from 'constants/blog';
import CategorySelect from 'components/CategorySelect';
import Post from 'components/blog/Post';
import { Container, Filters, List, Pagination } from './styles';

const Arrow = () => {
  return (
    <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.76578 11.3657C6.45337 11.6781 5.94683 11.6781 5.63441 11.3657L0.834413 6.56571C0.521993 6.25329 0.521993 5.74676 0.834413 5.43434L5.63441 0.634339C5.94683 0.321919 6.45337 0.321919 6.76579 0.634339C7.0782 0.946759 7.0782 1.45329 6.76579 1.76571L3.33147 5.20002H12.6001C13.0419 5.20002 13.4001 5.5582 13.4001 6.00002C13.4001 6.44185 13.0419 6.80002 12.6001 6.80002L3.33147 6.80002L6.76578 10.2343C7.0782 10.5468 7.0782 11.0533 6.76578 11.3657Z"
      />
    </svg>
  );
};

const PAGE_SIZE = 6;

const defaultFilters = [
  {
    id: 'all',
    label: 'View all',
  },
];

const PostsList: FC<{ articles: Article[]; categories: Category[] }> = ({
  articles,
  categories,
}) => {
  const [page, setPage] = useState(0);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);

  const isMobile = mobile({
    tablet: true,
  });

  const paginate = (data: Article[]): Article[] =>
    data.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const { control, resetField, watch, setValue, getValues, reset } = useForm({
    defaultValues: {
      [defaultFilters[0].id]: true,
    },
  });

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      const filtered = articles.filter((article: Article) => {
        const values = getValues();
        const filters = Object.keys(values).filter((key) => !!values[key]);

        if (values[defaultFilters[0].id] || !filters.length) return true;

        if (article.categories.length !== filters.length) return false;

        return article.categories.every((category) => filters.includes(category.id));
      });

      setFilteredArticles(filtered);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    setFilteredArticles(articles);
  }, []);

  return (
    <Container className="mx-auto max-w-[1200px] pb-24">
      {isMobile ? (
        <div className="mb-5">
          <CategorySelect
            options={categories.map((filter) => ({
              value: filter.id,
              label: filter.label,
            }))}
          />
        </div>
      ) : (
        <Filters>
          {[...defaultFilters, ...categories].map(({ label, id }) => {
            const isAllFilter = id === defaultFilters[0].id;

            return (
              <Controller
                key={id}
                control={control}
                name={id}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <label htmlFor={id} className="mr-2" key={id}>
                    <input
                      type="checkbox"
                      name={id}
                      ref={ref}
                      onBlur={onBlur}
                      checked={value === undefined ? false : value}
                      id={id}
                      onChange={(e) => {
                        if (isAllFilter) {
                          reset();
                        } else {
                          setValue(defaultFilters[0].id, false);
                        }

                        onChange(e);
                      }}
                    />
                    <div className="checkmark">{label}</div>
                  </label>
                )}
              />
            );
          })}
        </Filters>
      )}
      <List>
        {paginate(filteredArticles).map((article: Article) => {
          return (
            <Post
              id={article.slug}
              key={article.id}
              tags={article.categories.map(({ label }) => label)}
              title={article.title}
              createdAt={article.createdAt}
              author={article.author}
              previewText={article.previewText}
              image={article.bannerImage}
            ></Post>
          );
        })}
      </List>
      <Pagination className={isMobile ? 'mobile' : ''}>
        <ReactPaginate
          disabledClassName="disabled"
          breakLabel={isMobile ? '' : '...'}
          nextLabel={
            <>
              {!isMobile ? 'Next' : ''}
              <Arrow />
            </>
          }
          onPageChange={(selectedItem) => {
            setPage(selectedItem.selected);
          }}
          pageRangeDisplayed={isMobile ? 0 : 2}
          marginPagesDisplayed={isMobile ? 1 : 2}
          pageCount={filteredArticles.length / PAGE_SIZE}
          previousLabel={
            <>
              <Arrow /> {!isMobile ? 'Previous' : ''}
            </>
          }
        />
      </Pagination>
    </Container>
  );
};

export default PostsList;
