export const EXCHANGE_OPTIONS = [
    { label: 'All Exchanges', value: '' },
    { label: 'NSE', value: 'NSE' },
    { label: 'BSE', value: 'BSE' },
    { label: 'US Markets', value: 'US' },
];

export const STATUS_OPTIONS = [
    { label: 'All Status', value: '' },
    { label: 'Active Only', value: 'true' },
    { label: 'Disabled Only', value: 'false' },
];

export const VISIBILITY_OPTIONS = [
    { label: 'All Items', value: '' },
    { label: 'Visible', value: 'true' },
    { label: 'Hidden', value: 'false' },
];

export const DEFAULT_FILTERS = {
    page: 1,
    limit: 20,
    search: '',
    exchange: '',
    isTradable: '',
    isTracked: '',
    isVisible: '',
};
