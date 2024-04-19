import styled from 'styled-components';

interface Props {
  coverImageUrl: string;
  className: string;
}

const BackgroundImage = styled.div<{ coverImageUrl: string }>`
  background-image: url('${({ coverImageUrl }) => coverImageUrl}');
`;

const CoverImageBackground = ({ coverImageUrl, className }: Props) => {
  return (
    <BackgroundImage coverImageUrl={coverImageUrl} className="bg-cover bg-center bg-no-repeat">
      <div className="safearea-spacer-top w-full"></div>
      <div className={className}>&nbsp;</div>
    </BackgroundImage>
  );
};

export default CoverImageBackground;
