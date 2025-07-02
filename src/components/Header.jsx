import { MailIcon } from 'lucide-react'
import React from 'react'
import Logo from '../images/msLogo.png'

const Header = () => {
  return (
    <header className="w-full h-auto min-h-[76px] bg-[#444444] flex flex-row items-center justify-between px-4 sm:px-8 md:px-12 py-4 sm:py-0">
      <img
        className="w-[140px] md:w-[180px] h-auto md:h-[60px] object-cover"
        alt="Offical"
        src={Logo}
      />

      <div className="flex items-center gap-[5px]">
        <MailIcon className="w-[20px] md:w-[25px] h-[20px] md:h-[25px] text-white" />
        <span className="font-['Poppins',Helvetica] font-semibold text-white text-sm sm:text-base">
          careers@marketsof1.com
        </span>
      </div>
    </header>
  )
}

export default Header
