import { Button, Result, Skeleton, Table, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { isNil } from 'lodash-es';
import { useRouter } from 'next/router';

import { useAdminGetRegisteredSubscriptions } from '@/api/useAdminGetRegisteredSubscriptions';
import { ManageGarageLayout } from '@/layouts';

const PAID_STATUS = {
  waiting: 'Đợi thanh toán',
  paid: 'Đã thanh toán',
  fail: 'Thanh toán không thành công',
};

export default function ManageGarageTransactionPage() {
  const { query, push } = useRouter();
  const { garageId, vnp_TransactionStatus } = query as {
    garageId: string;
    vnp_TransactionStatus: string;
  };

  const { data, isLoading } = useAdminGetRegisteredSubscriptions({
    garageId: +garageId,
    enabled: !isNil(garageId),
  });

  return (
    <div>
      {!vnp_TransactionStatus && (
        <Typography.Title level={3}>Giao dịch</Typography.Title>
      )}

      <Skeleton active loading={isLoading && !isNil(garageId)}>
        {vnp_TransactionStatus ? (
          <Result
            status="success"
            title="Mua gói thành viên thành công"
            extra={[
              <Button
                type="primary"
                key="console"
                onClick={() => {
                  push('/my-garages');
                }}
              >
                Về trang quản lý garage
              </Button>,
              // <Button key="buy">Buy Again</Button>,
            ]}
          />
        ) : (
          <Table
            columns={[
              { title: 'Tên gói', render: (_, item) => item.name },
              { title: 'Thời hạn', render: (_, item) => item.period },
              {
                title: 'Giá',
                render: (_, item) =>
                  Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(item.price),
              },
              {
                title: 'Ngày mua',
                render: (_, item) =>
                  dayjs(item.dateCreate).format('DD-MM-YYYY'),
              },
              {
                title: 'Ngày hết hạn',
                render: (_, item) =>
                  dayjs(item.expirationDate).format('DD-MM-YYYY'),
              },
              {
                title: 'Trạng thái',
                render: (_, item) => (
                  <Tag className="rounded-full">
                    {PAID_STATUS[item.status as keyof typeof PAID_STATUS]}
                  </Tag>
                ),
              },
            ]}
            dataSource={data}
          />
        )}
      </Skeleton>
    </div>
  );
}

ManageGarageTransactionPage.Layout = ManageGarageLayout;
