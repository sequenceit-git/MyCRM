export const fields = {
  name: {
    type: 'string',
    required: true,
  },
  description: {
    type: 'string',
  },
  color: {
    type: 'color',
    options: [
      { value: '#1677ff', label: 'Blue', color: '#1677ff' },
      { value: '#52c41a', label: 'Green', color: '#52c41a' },
      { value: '#fa8c16', label: 'Orange', color: '#fa8c16' },
      { value: '#722ed1', label: 'Purple', color: '#722ed1' },
      { value: '#eb2f96', label: 'Magenta', color: '#eb2f96' },
      { value: '#13c2c2', label: 'Cyan', color: '#13c2c2' },
    ],
    defaultValue: '#1677ff',
  },
  enabled: {
    type: 'boolean',
  },
};
