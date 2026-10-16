export const BRAND = process.env.REACT_APP_BRAND_NAME || 'BRIAN — CEO TNT';
export const TEAM = process.env.REACT_APP_TEAM_NAME || 'TNT';
export const CEO_NAME = 'Brian';
export const CEO_WHATSAPP = process.env.REACT_APP_CEO_WHATSAPP || '254116378188';

export const SOURCES = ['instagram', 'tiktok', 'facebook', 'whatsapp', 'direct', 'referral', 'other'];

export const LOOKING_FOR_OPTIONS = [
  { value: 'extra_income', label: 'Extra income' },
  { value: 'business_opportunity', label: 'Business opportunity' },
  { value: 'personal_development', label: 'Personal development' },
  { value: 'networking', label: 'Networking' },
  { value: 'exploring', label: "I'm just exploring" }
];

export const PREFERRED_CONTACT_OPTIONS = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'phone', label: 'Phone call' },
  { value: 'email', label: 'Email' }
];

export const WANTS_EXPLANATION_OPTIONS = [
  { value: 'yes', label: 'Yes, I want a personal explanation' },
  { value: 'maybe', label: 'Maybe, send me more info first' },
  { value: 'not_now', label: 'Not right now' }
];

export const WEEKLY_TIME_OPTIONS = [
  'Less than 2 hours',
  '2-5 hours',
  '5-10 hours',
  '10+ hours'
];

export function whatsappLink(message) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${CEO_WHATSAPP}?text=${encoded}`;
}

export const PROSPECT_STATUSES = [
  { value: 'NEW', label: 'New', color: 'secondary' },
  { value: 'CONTACTED', label: 'Contacted', color: 'info' },
  { value: 'INTERESTED', label: 'Interested', color: 'primary' },
  { value: 'FOLLOW_UP', label: 'Follow-up', color: 'warning' },
  { value: 'QUALIFIED', label: 'Qualified', color: 'success' },
  { value: 'NOT_INTERESTED', label: 'Not interested', color: 'dark' },
  { value: 'JOINED', label: 'Joined', color: 'success' }
];

export const LEAD_CATEGORIES = [
  { value: 'HIGH_INTEREST', label: 'High interest', color: 'danger' },
  { value: 'EXPLORING', label: 'Exploring', color: 'warning' },
  { value: 'FOLLOW_UP', label: 'Follow up', color: 'info' },
  { value: 'NOT_READY', label: 'Not ready', color: 'secondary' }
];

export const LOG_CHANNELS = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'call', label: 'Phone call' },
  { value: 'email', label: 'Email' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'other', label: 'Other' }
];

export const LOG_DIRECTIONS = [
  { value: 'outbound', label: 'We reached out' },
  { value: 'inbound', label: 'They reached out' }
];

export function statusMeta(value) {
  return PROSPECT_STATUSES.find((s) => s.value === value) || { label: value, color: 'secondary' };
}

export function categoryMeta(value) {
  return LEAD_CATEGORIES.find((c) => c.value === value) || { label: value, color: 'secondary' };
}
