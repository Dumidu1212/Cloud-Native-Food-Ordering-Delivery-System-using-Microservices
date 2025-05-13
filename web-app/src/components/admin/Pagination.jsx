import styled from 'styled-components';
export default function Pagination({page,total,limit,onChange}){
  const pages = Math.ceil(total/limit);
  if(pages<=1) return null;

  const Bar = styled.nav`margin-top:1rem;text-align:right`;
  const Btn = styled.button`
    border:none;background:none;margin:0 .25rem;padding:.4rem .7rem;
    color:${({theme})=>theme.colours.primary};
    &[disabled]{opacity:.4;cursor:not-allowed}
  `;

  return(
    <Bar>
      <Btn disabled={page===1} onClick={()=>onChange(page-1)}>‹ Prev</Btn>
      {Array.from({length:pages}).map((_,i)=>(
        <Btn key={i} disabled={i+1===page} onClick={()=>onChange(i+1)}>{i+1}</Btn>
      ))}
      <Btn disabled={page===pages} onClick={()=>onChange(page+1)}>Next ›</Btn>
    </Bar>
  );
}
