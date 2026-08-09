import NotFound from '@/components/NotFound';
import { ErpLayout } from '@/layout';
import ReadItem from '@/modules/ErpPanelModule/ReadItem';
import TableSkeleton from '@/components/TableSkeleton';
import { Skeleton, Row, Col, Divider } from 'antd';
import { erp } from '@/redux/erp/actions';
import { selectReadItem } from '@/redux/erp/selectors';
import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const SectionSkeleton = () => (
  <div>
    <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
      <Col xs={24} sm={12}>
        <Skeleton active paragraph={{ rows: 4 }} />
      </Col>
      <Col xs={24} sm={12}>
        <Skeleton active paragraph={{ rows: 4 }} />
      </Col>
    </Row>
    <Divider />
    <TableSkeleton rows={4} />
  </div>
);

export default function ReadQuoteModule({ config }) {
  const dispatch = useDispatch();
  const { id } = useParams();

  useLayoutEffect(() => {
    dispatch(erp.read({ entity: config.entity, id }));
  }, [id]);

  const { result: currentResult, isSuccess, isLoading = true } = useSelector(selectReadItem);

  return (
    <ErpLayout>
      {isLoading ? (
        <SectionSkeleton />
      ) : isSuccess ? (
        <ReadItem config={config} selectedItem={currentResult} />
      ) : (
        <NotFound entity={config.entity} />
      )}
    </ErpLayout>
  );
}
