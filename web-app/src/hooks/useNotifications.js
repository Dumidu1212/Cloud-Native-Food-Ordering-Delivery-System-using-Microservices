import { useState,useEffect,useCallback,useRef } from 'react';
import {
  getUnreadCount,
  getNotifications,
  markNotification,
  markAllNotifications
} from '../services/notificationApi';

export function useNotifications(pollMs = 30_000){
  const [unread,setUnread]     = useState(0);
  const [list,setList]         = useState([]);
  const [loading,setLoading]   = useState(false);
  const alive = useRef(true);
  useEffect(()=>()=>{alive.current=false},[]);

  const loadCount = useCallback(async()=>{
    try{
      const { unreadCount } = await getUnreadCount();
      alive.current && setUnread(unreadCount);
    }catch{/*logged already*/}
  },[]);

  const loadList = useCallback(async()=>{
    alive.current && setLoading(true);
    try{
      const data = await getNotifications();
      alive.current && setList(data);
    }finally{
      alive.current && setLoading(false);
    }
  },[]);

  useEffect(()=>{
    loadCount();
    const id = setInterval(loadCount,pollMs);
    return ()=>clearInterval(id);
  },[loadCount,pollMs]);

  const markAsRead = async id=>{
    setList(lst=>lst.map(n=>n._id===id?{...n,isRead:true}:n));
    setUnread(u=>Math.max(0,u-1));
    try{ await markNotification(id); }
    catch{ loadList(); loadCount(); }
  };

  const markAll = async ()=>{
    setList(lst=>lst.map(n=>({...n,isRead:true})));
    setUnread(0);
    try{ await markAllNotifications(); }
    catch{ loadList(); loadCount(); }
  };

  return { unread,list,loading,
           reload: async()=>{ await loadList(); await loadCount(); },
           markAsRead, markAll };
}
