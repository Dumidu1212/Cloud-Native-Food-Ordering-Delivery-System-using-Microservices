import styled from 'styled-components';
import Sidebar from './Sidebar';
import Topbar  from './Topbar';

const Main = styled.main`
  margin-left : var(--sidebar-w,70px);
  padding-top : 60px;                /* height of Topbar  */
  min-height  : calc(100vh - 60px);  /* full viewport     */

  padding:1.6rem 2rem;
  transition:margin-left .25s cubic-bezier(.4,0,.2,1);

  /* Scroll only the content, not the whole page */
  overflow-y:auto;
`;

export default function PageLayout({children}){
  return(
    <>
      <Sidebar/>
      <Topbar/>
      <Main>{children}</Main>
    </>
  );
}
