export const fields = {
  name: {
    type: 'string',
    required: true,
  },
  price: {
    type: 'currency',
    required: true,
  },
  ref: {
    type: 'string',
  },
  description: {
    type: 'textarea',
  },
  enabled: {
    type: 'boolean',
  },
};
