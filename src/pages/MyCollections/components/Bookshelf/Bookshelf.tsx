import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { IconButton } from '@/common/components';
import { useRecoilState } from 'recoil';
import {
  dialogState,
  editCollectionDialogState,
  deleteCollectionDialogState,
} from '@/recoil/globalState';

export interface BookshelfProps {
  userId: number;
  collectionId: number;
  title: string;
  count: number;
  step: number;
}

const Wrapper = styled.div`
  position: relative;
`;

const Title = styled.div`
  font-size: 28px;
  margin-left: 8px;
`;

const IconButtons = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 8px;
  margin-right: 8px;
`;

const Bookshelf = ({
  userId,
  collectionId,
  title,
  count,
  step,
  ...props
}: BookshelfProps) => {
  const [_, setDialog] = useRecoilState(dialogState);
  const imgIdx = Math.min(Math.ceil(count / step), 5);
  return (
    <Wrapper style={{ width: '640px', height: 'fit-content' }}>
      <Title>{title}</Title>
      <IconButtons>
        <IconButton
          width={28}
          height={28}
          iconType="pencil"
          clickHandler={() => setDialog(editCollectionDialogState)}
        />
        <IconButton
          width={28}
          height={28}
          iconType="minus"
          clickHandler={() => setDialog(deleteCollectionDialogState)}
        />
      </IconButtons>
      <Link
        to={`/mycollection/${userId}/${collectionId}`}
        aria-label={`${title} 콜렉션으로 이동`}
      >
        <img
          width="640px"
          height="160px"
          src={`/assets/shelf${imgIdx}.svg`}
          alt=""
          {...props}
        />
      </Link>
    </Wrapper>
  );
};

Bookshelf.defaultProps = {
  width: '640px',
  height: '160px',
  step: 10,
};

export default Bookshelf;
