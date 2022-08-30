import { useRouter } from 'next/router'

export default (param: string) => {
  const router = useRouter()

  return router.query[param] as string
}
