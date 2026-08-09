import { Skeleton } from 'antd';

export default function Loading({ isLoading, children }) {
  if (isLoading) {
    return (
      <div style={{ padding: '24px', width: '100%' }}>
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }
  return children;
}
