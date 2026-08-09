import { Progress, Skeleton } from 'antd';
import useLanguage from '@/locale/useLanguage';

const statusColors = {
  draft: '#374151',
  sent: '#1677ff',
  pending: '#3b82f6',
  unpaid: '#ef4444',
  overdue: '#dc2626',
  paid: '#22c55e',
  partially: '#f59e0b',
  accepted: '#22c55e',
  declined: '#ef4444',
  expired: '#9ca3af',
  collected: '#22c55e',
};

const PreviewState = ({ tag, label, value = 0 }) => {
  const translate = useLanguage();
  const rawColor = statusColors[tag?.toLowerCase()] || '#374151';
  const strokeColor = value > 0 ? rawColor : '#e5e7eb';
  const displayLabel = label || translate(tag) || tag;

  return (
    <div style={{ marginBottom: '12px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '13px',
          fontWeight: '600',
          color: '#1f2937',
          marginBottom: '5px',
        }}
      >
        <span style={{ textTransform: 'capitalize' }}>{displayLabel}</span>
        <span style={{ color: '#4b5563', fontSize: '12px', fontWeight: '600' }}>
          {value} %
        </span>
      </div>
      <Progress
        percent={value}
        showInfo={false}
        strokeColor={strokeColor}
        trailColor="#f3f4f6"
        size={['100%', 6]}
        style={{ margin: 0 }}
      />
    </div>
  );
};

export default function PreviewCard({
  title = 'Preview',
  statistics = [],
  isLoading = false,
}) {
  return (
    <div style={{ padding: '0 12px', height: '100%' }}>
      <h4
        style={{
          color: '#22075e',
          fontSize: '15px',
          fontWeight: '700',
          margin: '0 0 20px',
          letterSpacing: '-0.2px',
        }}
      >
        {title}
      </h4>
      {isLoading ? (
        <div style={{ padding: '4px 0' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ marginBottom: '14px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '6px',
                }}
              >
                <Skeleton.Input active size="small" style={{ width: 65, height: 13 }} />
                <Skeleton.Input active size="small" style={{ width: 30, height: 13 }} />
              </div>
              <Skeleton.Button
                active
                size="small"
                style={{ width: '100%', height: 6, borderRadius: 4 }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div>
          {statistics.map((status, index) => (
            <PreviewState
              key={index}
              tag={status.tag}
              label={status.label}
              value={status?.value || 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
