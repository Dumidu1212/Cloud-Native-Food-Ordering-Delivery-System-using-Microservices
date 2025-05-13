/**
 * Admin sidebar / drawer
 * ------------------------------------------------------------
 *  ‣ full-height fixed panel
 *  ‣ 240 px wide on desktop, 70 px collapsed
 *  ‣ slides in/out on mobile (< 768 px)
 */
import {
  FaUsers, FaTruck, FaUtensils, FaMoneyBill, FaSignOutAlt
}                                from 'react-icons/fa';
import { useEffect, useState }   from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled                    from 'styled-components';
import { useAuth }               from '../../context/AuthContext';

/* ───────── styled helpers ────────────────────────────────── */
const Drawer = styled.aside`
  /* width also exposed as a css-custom-property */
  --sidebar-w : ${({ $open }) => ($open ? '240px' : '70px')};

  width        : var(--sidebar-w);
  background   : #fff;
  border-right : 1px solid #e5e7eb;
  position     : fixed; inset: 0 auto 0 0;
  z-index      : 120;
  transition   : width .25s cubic-bezier(.4,0,.2,1);

  /* on phones we slide the whole drawer left/right */
  @media (max-width:${({theme})=>theme.bp.md}) {
    width     : 240px;
    transform : translateX(${p=>p.$open ? '0' : '-100%'});
    transition: transform .25s cubic-bezier(.4,0,.2,1);
  }
`;

const Burger = styled.button`
  position:absolute;top:14px;right:-44px;
  width:36px;height:36px;border:none;border-radius:50%;
  background:${({theme})=>theme.colours.primary};color:#fff;
  display:flex;align-items:center;justify-content:center;
  font-size:1.25rem;line-height:1;

  /* hide burger on ≥ md */
  @media (min-width:${({theme})=>theme.bp.md}){ display:none; }
`;

const Brand = styled.div`
  font:700 1.35rem/1.1 Inter,system-ui,sans-serif;
  padding:1.25rem 1.2rem;
`;

const Item = styled.li`
  list-style:none;
  display:flex;align-items:center;gap:.9rem;
  padding:.85rem 1.2rem;cursor:pointer;

  color      : ${({$active,theme})=>$active ? theme.colours.primary
                                            : theme.colours.gray600};
  background : ${({$active,theme})=>$active ? theme.colours.gray200 : 'transparent'};

  &:hover{ background:${({theme})=>theme.colours.gray200}; }
`;

/* ───────── component ─────────────────────────────────────── */
export default function Sidebar () {
  const { logout }           = useAuth();
  const navigate             = useNavigate();
  const { pathname }         = useLocation();

  /* open drawer by default on desktop */
  const [open,setOpen]       = useState(window.innerWidth >= 768);

  /* ── expose the width to the whole document ───────────────── */
  useEffect(()=> {
    document.documentElement
            .style.setProperty('--sidebar-w', open ? '240px' : '70px');
  },[open]);

  /* ── auto-toggle when viewport crosses md breakpoint ───────── */
  useEffect(()=>{
    const onResize = () => setOpen(window.innerWidth >= 768);
    window.addEventListener('resize', onResize);
    return ()=> window.removeEventListener('resize', onResize);
  },[]);

  /* ── helpers ──────────────────────────────────────────────── */
  const go = path => {
    navigate(path);
    /* close the drawer on mobile after navigation */
    if (window.innerWidth < 768) setOpen(false);
  };

  const menu = [
    { icon:<FaUsers/>,     label:'Users',       path:'/admin/users'        },
    { icon:<FaUtensils/>,  label:'Restaurants', path:'/admin/restaurants'  },
    { icon:<FaTruck/>,     label:'Deliveries',  path:'/admin/deliveries'   }
    // { icon:<FaMoneyBill/>, label:'Finance',     path:'/admin/financials'   }
  ];

  /* ── render ───────────────────────────────────────────────── */
  return (
    <Drawer $open={open}>
      <Burger onClick={()=>setOpen(o=>!o)}>≡</Burger>

      <Brand>{open && 'Admin'}</Brand>

      <ul>
        {menu.map(m=>(
          <Item key={m.path}
                $active={pathname.startsWith(m.path)}
                onClick={()=>go(m.path)}>
            {m.icon}
            {open && m.label}
          </Item>
        ))}
      </ul>

      <Item as="button" onClick={()=>{ logout(); navigate('/login'); }}>
        <FaSignOutAlt/>{open && 'Logout'}
      </Item>
    </Drawer>
  );
}
