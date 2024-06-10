import { Outlet } from 'react-router-dom'
import Navbar from './Navbar/Navbar'

export default function Layout() {
  return (
    <>
      <nav className='bg-neutral-100' >
        <Navbar/>
      </nav>
        <Outlet/>
    </>
  )
}
