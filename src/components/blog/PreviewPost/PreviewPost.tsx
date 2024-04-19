import * as React from 'react';
import { FC } from 'react';
import { format } from 'date-fns';
import { Author } from 'constants/blog';
import Link from 'components/Link';
import Tag from 'components/Tag';
import { StyledPostPreview } from './styles';

const PreviewPost: FC<{
  title: string;
  image: string;
  author: Author;
  previewText: string;
  createdAt: Date;
  tags: string[];
  id: string;
}> = (props) => {
  const { id, image, tags, previewText, author, title, createdAt } = props;

  return (
    <StyledPostPreview className="post">
      <Link
       href={`/blog/${id}`}>
      <img src={image} alt={title} className='object-cover object-center'/>
      </Link>
      <div className="body flex items-center justify-between">
        <div>
          <Link
            href={`/blog/${id}`}>
          <span className="author text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
            {author.name} • {format(createdAt, 'd LLL yyyy')}
          </span>
          <h4 className="title mb-2 mt-1 font-bold">{title}</h4>
          <p className="text-md mb-3 mt-0 text-left text-color-text-lightmode-secondary dark:text-color-text-darkmode-secondary">
            {previewText}
          </p>
          <div className="tags">
            {tags.map((tag: string, index) => (
              <Tag text={tag} key={index} />
            ))}
          </div>
          </Link>
        </div>
        <div>
          <Link
            href={`/blog/${id}`}
            className="flex h-[42px] w-[130px] items-center justify-center rounded-[24px] border border-brand-gray-900"
          >
            <img src="/images/tour-page/arrow-right.svg" alt="arrow" />
            <span className="ml-3 accent-brand-gray-900">Read</span>
          </Link>
        </div>
      </div>
    </StyledPostPreview>
  );
};

export default PreviewPost;
