import styled from 'styled-components';

export const Table = styled.table`
  width:100%;
  border-collapse:collapse;
  background:#fff;
  border-radius:8px;
  overflow:hidden;
  box-shadow:0 2px 4px rgba(0,0,0,.05);

  th,td { padding:.8rem 1rem; text-align:left }
  th   { background:${({theme})=>theme.colours.gray200};
         font-size:.85rem; font-weight:600;
         color:${({theme})=>theme.colours.gray600}; }

  tr:nth-child(even) td { background:${({theme})=>theme.colours.gray100}; }
`;
