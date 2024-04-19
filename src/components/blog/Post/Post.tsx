import * as React from 'react';
import { format } from 'date-fns';
import { Author } from 'constants/blog';
import { getArticlePageUrl } from 'constants/pages';
import Link from 'components/Link';
import Tag from 'components/Tag';
import { StyledPost } from './styles';

interface Props {
  title: string;
  image: string;
  author: Author;
  previewText: string;
  createdAt: string;
  tags: string[];
  id: string;
}

const Post: React.FC<Props> = (props) => {
  const { image, title, createdAt, tags, author, previewText, id } = props;
  
  return (
    <Link href={getArticlePageUrl(id)} legacyBehavior>
      <StyledPost className="post">
        <img src={image} alt={title} className='object-cover object-center'/>
        <div className="body">
          <span className="author text-color-text-lightmode-primary dark:text-color-text-darkmode-primary">
            {author.name} • {format(new Date(createdAt), 'd LLL yyyy')}
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
        </div>
      </StyledPost>
    </Link>
  );
};

export default Post;
