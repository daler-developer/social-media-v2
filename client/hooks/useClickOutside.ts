import { RefObject, useEffect } from 'react'

export default (ref: RefObject<HTMLElement>, callback: Function) => {
  useEffect(() => {
    const handler = (e: any) => {
      if (ref.current?.contains(e.target)) {
        return
      }

      callback()
    }

    document.addEventListener('click', handler)

    return () => document.removeEventListener('click', handler)
  }, [ref, callback])
}
