import NotFound from '@/components/NotFound';
import { ErpLayout } from '@/layout';
import UpdateItem from '@/modules/ErpPanelModule/UpdateItem';
import InvoiceForm from '@/modules/InvoiceModule/Forms/InvoiceForm';
import TableSkeleton from '@/components/TableSkeleton';
import { Skeleton, Row, Col, Divider } from 'antd';
import { erp } from '@/redux/erp/actions';
import { selectReadItem } from '@/redux/erp/selectors';
import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const FormSectionSkeleton = () => (
  <div>
    <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
      <Col xs={24} sm={12}>
        <Skeleton.Input active style={{ width: '100%', height: 38, marginBottom: 16 }} />
        <Skeleton.Input active style={{ width: '100%', height: 38, marginBottom: 16 }} />
      </Col>
      <Col xs={24} sm={12}>
        <Skeleton.Input active style={{ width: '100%', height: 38, marginBottom: 16 }} />
        <Skeleton.Input active style={{ width: '100%', height: 38, marginBottom: 16 }} />
      </Col>
    </Row>
    <Divider />
    <TableSkeleton rows={3} />
  </div>
);

export default function UpdateInvoiceModule({ config }) {
  const dispatch = useDispatch();
  const { id } = useParams();

  useLayoutEffect(() => {
    dispatch(erp.read({ entity: config.entity, id }));
  }, [id]);

  const { result: currentResult, isSuccess, isLoading = true } = useSelector(selectReadItem);

  useLayoutEffect(() => {
    if (currentResult) {
      const data = { ...currentResult };
      dispatch(erp.currentAction({ actionType: 'update', data }));
    }
  }, [currentResult]);

  return (
    <ErpLayout>
      {isLoading ? (
        <FormSectionSkeleton />
      ) : isSuccess ? (
        <UpdateItem config={config} UpdateForm={InvoiceForm} />
      ) : (
        <NotFound entity={config.entity} />
      )}
    </ErpLayout>
  );
}
