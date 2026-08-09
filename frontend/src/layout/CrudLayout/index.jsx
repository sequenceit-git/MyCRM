import { useEffect, useState } from 'react';

import DefaultLayout from '../DefaultLayout';

import SidePanel from '@/components/SidePanel';
import { Layout } from 'antd';
import { useCrudContext } from '@/context/crud';
import { useAppContext } from '@/context/appContext';

const { Content } = Layout;

const ContentBox = ({ children }) => {
  const { state: stateCrud, crudContextAction } = useCrudContext();
  const { state: stateApp } = useAppContext();
  const { isPanelClose } = stateCrud;
  // const { isNavMenuClose } = stateApp;
  const { panel } = crudContextAction;

  const [isSidePanelClose, setSidePanel] = useState(isPanelClose);

  useEffect(() => {
    let timer = [];
    if (isPanelClose) {
      timer = setTimeout(() => {
        setSidePanel(isPanelClose);
      }, 200);
    } else {
      setSidePanel(isPanelClose);
    }

    return () => clearTimeout(timer);
  }, [isPanelClose]);

  // useEffect(() => {
  //   if (!isNavMenuClose) {
  //     panel.close();
  //   }
  // }, [isNavMenuClose]);
  return (
    <Content
      className="whiteBox shadow"
      style={{
        margin: '0 auto 30px',
        width: '100%',
        maxWidth: '100%',
        flex: 'none',
        borderRadius: '12px',
        background: '#ffffff',
        border: '1px solid #edf2f7',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
        padding: '24px 28px',
      }}
    >
      {children}
    </Content>
  );
};

export default function CrudLayout({
  children,
  config,
  sidePanelTopContent,
  sidePanelBottomContent,
  fixHeaderPanel,
}) {
  return (
    <>
      <DefaultLayout>
        <SidePanel
          config={config}
          topContent={sidePanelTopContent}
          bottomContent={sidePanelBottomContent}
          fixHeaderPanel={fixHeaderPanel}
        ></SidePanel>

        <ContentBox> {children}</ContentBox>
      </DefaultLayout>
    </>
  );
}
