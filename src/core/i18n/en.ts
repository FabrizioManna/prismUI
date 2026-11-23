/** Default English UI strings. Keys are camelCase (architecture.md §2.2). */
export const en = {
  loading: 'Loading…',
  updating: 'Updating…',
  clear: 'Clear',
  showPassword: 'Show password',
  hidePassword: 'Hide password',
  close: 'Close',
  required: 'required',
  remove: 'Remove {label}',
  selectAll: 'Select all',
  noOptions: 'No options',
  optionsCount: '{count, plural, one {# option} other {# options}}',
  selectedCount: '{count} selected',
  charactersRemaining: '{count} characters remaining',
  characterLimit: 'Character limit reached',
  errorPrefix: 'Error:',
  selectPlaceholder: 'Select…',
};

export type PrismStrings = typeof en;
export type PrismStringKey = keyof PrismStrings;
