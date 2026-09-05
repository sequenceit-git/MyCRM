import CrudModule from '@/modules/CrudModule/CrudModule';
import AdminForm from '@/forms/AdminForm';

import useLanguage from '@/locale/useLanguage';

export default function Admin() {
  const translate = useLanguage();
  const entity = 'admin';
  const searchConfig = {
    displayLabels: ['name', 'surname', 'email'],
    searchFields: 'name,surname,email',
  };
  const deleteModalLabels = ['name', 'surname'];

  const fields = {
    name: {
      type: 'string',
      required: true,
    },
    surname: {
      type: 'string',
      required: true,
    },
    email: {
      type: 'email',
      required: true,
    },
    role: {
      type: 'selectWithTranslation',
      options: [
        { value: 'owner', label: 'Account owner', color: 'purple' },
        { value: 'admin', label: 'super_admin', color: 'blue' },
        { value: 'manager', label: 'manager', color: 'green' },
        { value: 'employee', label: 'employee', color: 'cyan' },
        { value: 'guest', label: 'read_only', color: 'orange' },
      ],
      defaultValue: 'admin',
    },
    enabled: {
      type: 'boolean',
    },
  };

  const Labels = {
    PANEL_TITLE: translate('admin'),
    DATATABLE_TITLE: translate('admin_list'),
    ADD_NEW_ENTITY: translate('add_new_admin'),
    ENTITY_NAME: translate('admin'),
  };
  const configPage = {
    entity,
    ...Labels,
  };
  const config = {
    ...configPage,
    fields,
    searchConfig,
    deleteModalLabels,
  };
  return (
    <CrudModule
      createForm={<AdminForm isUpdateForm={false} />}
      updateForm={<AdminForm isUpdateForm={true} />}
      config={config}
    />
  );
}
