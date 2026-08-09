import { Skeleton } from 'antd';

export default function TableSkeleton({ rows = 6 }) {
  return (
    <div style={{ padding: '8px 0', width: '100%' }}>
      {/* Header Bar Skeleton */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#f8fafc',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '12px',
        }}
      >
        <Skeleton.Input active size="small" style={{ width: 70, height: 16 }} />
        <Skeleton.Input active size="small" style={{ width: 130, height: 16 }} />
        <Skeleton.Input active size="small" style={{ width: 90, height: 16 }} />
        <Skeleton.Input active size="small" style={{ width: 80, height: 16 }} />
        <Skeleton.Input active size="small" style={{ width: 30, height: 16 }} />
      </div>

      {/* Row Skeletons */}
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 16px',
            borderBottom: '1px solid #f8fafc',
          }}
        >
          <Skeleton.Input active size="small" style={{ width: 50, height: 16 }} />
          <Skeleton.Input active size="small" style={{ width: 140, height: 16 }} />
          <Skeleton.Input active size="small" style={{ width: 75, height: 16 }} />
          <Skeleton.Button active size="small" style={{ width: 65, height: 22, borderRadius: 6 }} />
          <Skeleton.Input active size="small" style={{ width: 24, height: 16 }} />
        </div>
      ))}
    </div>
  );
}
