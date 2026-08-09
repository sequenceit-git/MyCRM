const useAppSettings = () => {
  let settings = {};
  settings['idurar_app_email'] = 'noreply@mycrm.com';
  settings['idurar_base_url'] = 'http://localhost:8888';
  return settings;
};

module.exports = useAppSettings;
