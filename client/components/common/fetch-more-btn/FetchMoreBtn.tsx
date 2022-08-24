import { PlusOutlined as PlusIcon } from '@ant-design/icons'
import { Button } from 'antd'
import { ComponentPropsWithoutRef } from 'react'

const FetchMoreBtn = (props: ComponentPropsWithoutRef<typeof Button>) => {
  return <Button role='button' shape='circle' icon={<PlusIcon />} {...props} />
}

export default FetchMoreBtn
