import { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import {
  dialogContentState,
  dialogState,
  userState,
} from '@/recoil/globalState';
import {
  Header,
  Main,
  Footer,
  Dropdown,
  SearchResultText,
  VinylItems,
  GoToTopButton,
  LoadingSpinner,
  InquiryButton,
  NewDialog,
  SelectCollectionForm,
  NoSearchWord,
} from '@/components';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { absolute, flexContainer } from '@/styles/mixin';
import {
  getResourceUrl,
  commonRelease,
  commonMaster,
  processSearchResult,
} from '@/utils/functions/processResult';
import { FLOATING_MOTION_VALUE } from '@/utils/constants/motion';
import {
  SORT_LABEL,
  VIEW_CONTENT,
  VIEW_LABEL,
} from '@/utils/constants/dropdown';
import { ViewProps } from '@/types/render';
import { ProcessedResult } from '@/types/data';

const SECRET = import.meta.env.VITE_API_SECRET;
const KEY = import.meta.env.VITE_API_KEY;

// 옵저버 범위 설정값
interface IntersectionObserverInit {
  root?: Element | Document | null;
  rootMargin?: string;
  threshold?: number | number[];
}

const options: IntersectionObserverInit = {
  root: null,
  rootMargin: '180px',
  threshold: 1.0,
};

function SearchResult() {
  const [searchParams] = useSearchParams();
  const [itemCount, setItemCount] = useState<number>(0);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPageNum, setTotalPageNum] = useState<number>(1);
  const [result, setResult] = useState<ProcessedResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dialogType, setDialogType] = useRecoilState(dialogState);
  const [dialogContent] = useRecoilState(dialogContentState);
  const [userId] = useRecoilState(userState);
  const observerTarget = useRef<HTMLDivElement>(null);

  const params = new URLSearchParams(window.location.search);
  const value = params.get('query');
  const sort = params.get('sort');

  const url = `https://api.discogs.com/database/search?&q=${value}&key=${KEY}&secret=${SECRET}&format=vinyl&sort=${
    sort === 'date' ? 'date_added&sort_order=desc' : 'score'
  }&page=${pageNum}&per_page=24`;

  useEffect(() => setDialogType(''), []);

  useEffect(() => {
    if (value) {
      const observer = new IntersectionObserver(([entry]) => {
        if (pageNum === totalPageNum) return;

        if (entry.isIntersecting) {
          setPageNum((pageNum) => (pageNum += 1));
        }
      }, options);

      observer.observe(observerTarget?.current as HTMLDivElement);

      return () => observer.disconnect();
    }
  }, [result]);

  useEffect(() => {
    async function fetchResults() {
      setPageNum(1);
      setIsLoading(true);

      try {
        const res = await axios.get(
          `https://api.discogs.com/database/search?&q=${value}&key=${KEY}&secret=${SECRET}&format=vinyl&sort=${
            sort === 'date' ? 'date_added&sort_order=desc' : 'score'
          }&page=1&per_page=24`
        );

        setIsLoading(false);
        setTotalPageNum(res.data.pagination.pages);
        setItemCount(res.data.pagination.items);
        setResult(processSearchResult(res.data.results));
        window.scrollTo({ top: 0 });
      } catch (error) {
        console.error(error);
      }
    }
    fetchResults();
  }, [searchParams]);

  useEffect(() => {
    if (pageNum === 1) return;

    async function fetchResults() {
      try {
        setIsLoading(true);

        const res = await axios.get(url);

        setIsLoading(false);
        setTotalPageNum(res.data.pagination.pages);
        setItemCount(res.data.pagination.items);
        setResult([...result, ...processSearchResult(res.data.results)]);
      } catch (error) {
        console.error(error);
      }
    }
    fetchResults();
  }, [pageNum]);

  const { initial, animate, transition } = FLOATING_MOTION_VALUE;

  return useMemo(
    () => (
      <>
        <Header />
        <Main>
          <h1 className="srOnly">Search Result</h1>
          {value ? (
            <>
              <SearchResultWrapper>
                <SearchResultText resultCount={itemCount} />
                {/* <Dropdown
              dropKind="sort"
              label={SORT_LABEL}
              content={SORT_CONTENT}
            /> */}
                <Dropdown
                  dropKind="view"
                  label={VIEW_LABEL}
                  content={VIEW_CONTENT}
                />
              </SearchResultWrapper>
              <motion.div
                initial={initial}
                animate={animate}
                transition={transition}
              >
                <VinylItems
                  searchResults={result}
                  page={'all'}
                  view={params.get('view') as ViewProps['view']}
                />
              </motion.div>
              <div
                ref={observerTarget}
                style={{
                  width: '100vw',
                  height: '40px',
                }}
              />
              <LoadingSpinner isLastPage={pageNum === totalPageNum} />
            </>
          ) : (
            <NoSearchWord />
          )}
          <InquiryButton />
          <GoToTopButton />
        </Main>
        <Footer />
        <NewDialog
          isOpened={dialogType === 'add-item'}
          width={480}
          height={480}
          title="Add Item"
          onConfirm={async () => {
            const resourceUrl = getResourceUrl(dialogContent.releasedId);
            const resourceUrlWithAuth =
              resourceUrl +
              `?key=${import.meta.env.VITE_API_KEY}&secret=${
                import.meta.env.VITE_API_SECRET
              }`;
            const splitedResourceUrl = resourceUrl.split('/');
            const type = splitedResourceUrl[splitedResourceUrl.length - 2];
            const { data: response } = await axios.get(resourceUrlWithAuth);

            let commonData;
            if (type === 'releases') commonData = commonRelease(response);
            if (type === 'masters') commonData = commonMaster(response);

            await axios.post(
              `${import.meta.env.VITE_DB_SERVER}vinyl/${userId}`,
              {
                releasedId: commonData?.id,
                collectionList: dialogContent.collectionList,
                imgUrl: commonData?.imgUrl,
                title: commonData?.title,
                artist: commonData?.artist,
                year: commonData?.year,
                genres: commonData?.genre,
                resourceUrl: commonData?.resourceUrl,
              }
            );
          }}
          onClose={() => setDialogType('')}
        >
          <SelectCollectionForm />
        </NewDialog>
      </>
    ),
    [itemCount, result, SORT_LABEL, isLoading, observerTarget, params]
  );
}

const SearchResultWrapper = styled.div`
  ${flexContainer({
    d: 'row',
    w: 'nowrap',
    ai: 'center',
    g: 'var(--space-bs)',
  })}
  position: relative;
  min-width: 680px;
  max-width: 828px;
  width: 65vw;
  height: 34px;
  margin: 0 auto;
  margin-top: 36px;

  > div:first-child {
    margin-top: 4px;
    margin-right: auto;
  }

  > div:nth-of-type(2) {
    ${absolute({ t: 0, r: 134 })}
  }

  > div:last-child {
    ${absolute({ t: 0, r: 0 })}
  }
`;

export default SearchResult;