import styled from 'styled-components';
import NotificationBell from '../common/NotificationBell';

const Bar = styled.header`
  position:fixed;top:0;right:0;left:var(--sidebar-w,70px);
  height:60px;z-index:100;

  background:#fff;border-bottom:1px solid #e5e7eb;
  display:flex;align-items:center;justify-content:flex-end;
  padding:0 1.4rem;
  transition:left .25s cubic-bezier(.4,0,.2,1);
`;

export default function Topbar(){
  return(
    <Bar>
      <NotificationBell/>
    </Bar>
  )
}
