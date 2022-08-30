import useGetMeQuery from './queries/useGetMeQuery'

export default () => {
  const getMeQuery = useGetMeQuery({ enabled: false })

  return !!getMeQuery.data
}
