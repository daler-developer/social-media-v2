import dayjs from 'dayjs'

export const formatDate = (string: string) => {
  const date = dayjs(new Date(Date.parse(string)))

  return date.format('YYYY-MM-DD')
}
