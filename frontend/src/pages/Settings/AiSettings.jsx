import useLanguage from '@/locale/useLanguage';
import AiSettingsModule from '@/modules/SettingModule/AiSettingsModule';

export default function AiSettings() {
  const translate = useLanguage();

  const entity = 'setting';

  const Labels = {
    PANEL_TITLE: translate('settings'),
    DATATABLE_TITLE: translate('settings_list'),
    ADD_NEW_ENTITY: translate('add_new_settings'),
    ENTITY_NAME: translate('settings'),

    SETTINGS_TITLE: translate('AI Copilot & Model Settings'),
  };

  const configPage = {
    entity,
    settingsCategory: 'ai_settings',
    ...Labels,
  };
  return <AiSettingsModule config={configPage} />;
}
