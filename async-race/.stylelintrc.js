module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-recommended-scss', 'stylelint-config-recess-order'],
  rules: {
    'color-hex-case': 'lower',
    'color-hex-length': 'long',
    'import-notation': 'string',
    'property-no-vendor-prefix': null,
  },
};
