import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const pageVariants = {
  initial: {
    opacity: 0,
    y: 10
  },
  in: {
    opacity: 1,
    y: 0
  },
  out: {
    opacity: 0,
    y: -10
  }
}

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.3
}

function MainLayout() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  // For demo purposes, we're using a mock user
  // In a real app, you'd redirect to login if !user && !loading
  useEffect(() => {
    // Skip for demo: if (!user && !loading) navigate('/login')
  }, [user, loading, navigate])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <motion.div
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className="pb-12"
        >
          <Outlet />
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout