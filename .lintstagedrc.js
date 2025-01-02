const buildPrettierCommand = (filenames) =>
  `prettier ${filenames.join(' ')} -w`;

export default {
  'programs/mess/src/**/*.rs': 'cargo fmt --',
  'tests/**/*.ts': [buildPrettierCommand],
};
