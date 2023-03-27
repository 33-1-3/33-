import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { IconButton } from '@/components';
import {
  dialogContentState,
  dialogState,
  userState,
} from '@/recoil/globalState';

export interface BookshelfProps {
  userId: string;
  collectionId: string;
  width?: string | number;
  height?: string | number;
  title: string;
  count: number;
  step?: number;
}

function Bookshelf({
  userId,
  collectionId,
  width,
  height,
  title,
  count,
  step,
  ...props
}: BookshelfProps) {
  const [isLogin] = useRecoilState(userState);
  const [, setDialogType] = useRecoilState(dialogState);
  const [dialogContent, setDialogContent] = useRecoilState(dialogContentState);
  const imgIdx = Math.min(Math.ceil(count / (step as number)), 5);

  return (
    <Wrapper style={{ width: width, height: 'fit-content' }}>
      <Title title={title}>{title}</Title>
      {isLogin && (
        <IconButtons>
          <IconButton
            width={22}
            height={22}
            iconType="pencil"
            handleClick={() => {
              setDialogContent({
                ...dialogContent,
                collectionId: collectionId,
                collectionTitle: title,
              });
              setDialogType('edit-collection');
            }}
          />
          <IconButton
            width={22}
            height={22}
            iconType="minus"
            handleClick={() => {
              setDialogContent({
                ...dialogContent,
                collectionId: collectionId,
              });
              setDialogType('delete-collection');
            }}
          />
        </IconButtons>
      )}
      <Link
        to={`/mycollection/${userId}/${collectionId}`}
        aria-label={`${title} 콜렉션으로 이동`}
      >
        <img
          width={width}
          height={height}
          src={`/assets/shelf${imgIdx}.svg`}
          alt=""
          {...props}
        />
      </Link>
    </Wrapper>
  );
}

Bookshelf.defaultProps = {
  width: '520px',
  height: '130px',
  step: 10,
};

const Wrapper = styled.div`
  position: relative;
`;

const Title = styled.div`
  max-width: 432px;
  font-size: 22px;
  margin-left: 8px;
  overflow: hidden;
  white-space: nowrap;
  text-align: start;
  text-overflow: ellipsis;
`;

const IconButtons = styled.div`
  position: absolute;
  top: 2px;
  right: 0;
  display: flex;
  gap: 8px;
  margin-right: 8px;
`;

export default Bookshelf;