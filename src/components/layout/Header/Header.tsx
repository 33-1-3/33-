import { useRecoilValue } from 'recoil';
import { loginState, userState } from '@/recoil/globalState';
import styled from 'styled-components';
import { LogoLink, SearchInput, SquareLink, ProfileLink } from '@/components';
import useHandleSubmit from '@/hooks/useHandleSubmit';

function Header({ ...props }) {
  const isLogIn = useRecoilValue(loginState);
  const userId = useRecoilValue(userState);

  const isMain: boolean = window.location.pathname === '/';

  const SearchInputRender = useHandleSubmit();

  return (
    <StyledHeader style={{ height: 64, width: '100vw' }} {...props}>
      <LogoLink $width="74px" $height="40px" />
      <BetaText>Beta</BetaText>
      {!isMain && isLogIn !== undefined && (
        <SearchInput inputSize="small" handleSubmit={SearchInputRender} />
      )}
      {isLogIn !== undefined && (
        <SquareLink
          $width={178}
          $height={40}
          $fontSize={'20px'}
          link={isLogIn ? `/mycollections/${userId}` : '/signin'}
        >
          My Collections
        </SquareLink>
      )}
      {isLogIn !== undefined &&
        (isLogIn === true ? (
          <ProfileLink />
        ) : (
          <SquareLink
            $width={100}
            $height={40}
            $fontSize={'20px'}
            $isFilled={false}
            $hasTransition={true}
            link={isLogIn ? `/mycollections/${userId}` : '/signin'}
          >
            Sign In
          </SquareLink>
        ))}
    </StyledHeader>
  );
}

const StyledHeader = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  background-color: var(--white);
  min-width: 680px;
  padding: 12px 16px;
  gap: 12px;
  box-shadow: var(--shadow-Header);
  z-index: 2000;

  > a:first-child {
    margin-right: auto;
  }
`;

const BetaText = styled.span`
  position: absolute;
  left: 96px;
  bottom: 10px;
  font-style: italic;
  font-size: var(--text-sm);
  font-weight: 400;
  color: var(--purple-900);
`;

export default Header;
