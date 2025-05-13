import styled from 'styled-components';

/* ───── wrapper lets the table scroll horizontally on mobile ──── */
export const TableWrap = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: 12px;                /* clip gradient header corners */
  box-shadow: 0 8px 18px rgba(0,0,0,.06);
`;

/* ───── actual table ──────────────────────────────────────────── */
export const Table = styled.table`
  width: 100%;
  border-collapse: separate;          /* to keep rounded corners */
  border-spacing: 0;
  min-width: 680px;                   /* so narrow cols don’t squish */

  /* — header — */
  thead th{
    position: sticky; top: 0; z-index: 2;
    background: linear-gradient(135deg,
                 ${({theme}) => theme.colours.gray100} 0%,
                 ${({theme}) => theme.colours.gray200} 100%);
    color: ${({theme}) => theme.colours.gray600};
    font: 600 .9rem/1.4 Inter,system-ui,sans-serif;
    text-align: left;
    padding: 1rem 1.2rem;
    border-bottom: 1px solid ${({theme}) => theme.colours.gray200};
  }

  /* — rows — */
  tbody tr{
    transition: box-shadow .15s ease, transform .15s ease;
  }
  tbody tr:nth-child(even) td{
    background: ${({theme}) => theme.colours.gray100};
  }
  tbody tr:hover{
    transform: scale(1.005);
    box-shadow: inset 0 0 0 9999px rgba(0,0,0,.025);
  }

  /* — cells — */
  td{
    padding: 1rem 1.2rem;
    font-size: .925rem;
    color: ${({theme}) => theme.colours.gray900};
    border-bottom: 1px solid ${({theme}) => theme.colours.gray200};
    white-space: nowrap;              /* keeps long e-mails in one line */
  }

  /* first cell in every row a little bolder */
  tbody td:first-child{
    font-weight: 600;
  }

  /* remove bottom border + radius on the last row */
  tbody tr:last-child td{
    border-bottom: none;
  }
  tbody tr:last-child td:first-child  { border-bottom-left-radius:12px; }
  tbody tr:last-child td:last-child   { border-bottom-right-radius:12px; }
`;
