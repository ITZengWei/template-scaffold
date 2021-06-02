import { FC } from 'react'
import { Empty, Button } from 'antd'
import { Link } from 'react-router-dom'

const Forbidden: FC = (props: any) => {
  return (
    <Empty
      image={Empty.PRESENTED_IMAGE_DEFAULT}
      description="Forbidden(对不起，您没有此项功能访问权力)"
    >
      <Button>
        <Link to="/" replace>
          返回首页
        </Link>
      </Button>
    </Empty>
  )
}

export default Forbidden
