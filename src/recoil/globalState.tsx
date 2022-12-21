import { atom } from 'recoil';
import axios from 'axios';
import { TextInput, SelectCollectionForm } from '@/common/components';
import { DialogProps } from '@/common/components/Dialog/Dialog';

export const initialDialogState = {
  isOpen: false,
  width: 0,
  height: 0,
  title: '',
  children: null,
  confirm: () => console.log('Dialog confirm button clicked.'),
};

// export const setAddItemDialogState = (
//   collectionList: { title: string; isChecked: boolean }[],
//   userId: number,
//   releasedId: string
// ) => ({
//   isOpen: true,
//   width: 480,
//   height: 480,
//   title: 'Add Item',
//   children: <SelectCollectionForm collectionList={collectionList} />,
//   confirm: async () => {
//     const { data } = await axios.get(
//       `https://api.discogs.com/releases/${releasedId}`
//     );

//     const { title, artists_sort: artist, released, genres } = data;

//     // TODO: selectedCollectionIds, imgUrl 해결
//     await axios.post(`http://localhost:3313/vinyl/${userId}`, {
//       releasedId,
//       // selectedCollectionIds:
//       // imgUrl: '',
//       title,
//       artist,
//       released,
//       genres,
//     });
//   },
// });

export const deleteItemDialogState = {
  isOpen: true,
  width: 480,
  height: 200,
  children: '아이템을 삭제하시겠습니까?',
  confirm: () => console.log('아이템 삭제'),
};

export const createCollectionDialogState = {
  isOpen: true,
  width: 480,
  height: 300,
  title: 'Create Collection',
  children: (
    <TextInput
      errorMsg="최소 두 글자 이상 입력해주세요."
      height={36}
      label="Collection Name"
      placeholder="생성할 콜렉션의 이름을 입력해주세요."
      required
      validationTester={/^.{2,}$/}
      width={416}
    />
  ),
  confirm: () => console.log('콜렉션 생성'),
};

export const editCollectionDialogState = {
  isOpen: true,
  width: 480,
  height: 300,
  title: 'Edit Name',
  children: (
    <TextInput
      errorMsg="최소 두 글자 이상 입력해주세요."
      height={36}
      label="Collection Name"
      placeholder="수정할 콜렉션의 이름을 입력해주세요."
      required
      validationTester={/^.{2,}$/}
      width={416}
    />
  ),
  confirm: () => console.log('콜렉션 수정'),
};

// export const deleteCollectionDialogState = (collectionId: number) => ({
//   isOpen: true,
//   width: 480,
//   height: 200,
//   children: '콜렉션을 삭제하시겠습니까?',
//   confirm: async () => {
//     await axios.delete(`http://localhost:3313/collections/${collectionId}`);

//   },
// });

export const editWritableInfoDialogState = {
  isOpen: true,
  width: 480,
  height: 480,
  title: 'Edit Information',
  children: null,
  confirm: () => console.log('소장 음반 정보 수정'),
};

export const dialogState = atom<boolean>({
  key: 'dialogState',
  default: false,
});

export interface dialogContentProps {
  releasedId: string;
  collectionList: { id?: string; title: string; isChecked: boolean }[];
}

export const dialogContentState = atom<dialogContentProps>({
  key: 'dialogContentState',
  default: { releasedId: '', collectionList: [] },
});

export const userState = atom<string | null | undefined>({
  key: 'userState',
  default: '63a28cd7e71fd88649c17ac8',
});
