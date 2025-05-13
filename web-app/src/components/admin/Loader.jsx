import styled,{keyframes} from 'styled-components';
const spin=keyframes`to{transform:rotate(360deg)}`;
const Ring=styled.div`
  width:46px;height:46px;border:5px solid ${({theme})=>theme.colours.primary};
  border-right-color:transparent;border-radius:50%;
  animation:${spin} 1s linear infinite;
`;
export default ()=><Ring aria-label="loading"/>;
