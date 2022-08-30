import { UserOutlined as UserIcon } from '@ant-design/icons'
import { Avatar as AntDAvatar } from 'antd'
import { ComponentPropsWithoutRef } from 'react'

const Avatar = (props: ComponentPropsWithoutRef<typeof AntDAvatar>) => {
  return <AntDAvatar icon={<UserIcon />} {...props} />
}

export default Avatar
