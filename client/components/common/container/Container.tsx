import cn from 'classnames'
import { ReactNode } from 'react'

interface IProps {
  children: ReactNode
}

const Container = ({ children }: IProps) => {
  return (
    <div role='container' className='max-w-[900px] px-[22px] w-full mx-auto'>
      {children}
    </div>
  )
}

export default Container
