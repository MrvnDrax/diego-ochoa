export const analyticsEvents = {
  whatsapp: 'click_whatsapp',
  phone: 'click_phone',
  doctoralia: 'click_doctoralia',
  form: 'form_submit',
  location: 'click_location',
  promotionClick: 'promotion_click',
  promotionOpen: 'promotion_open',
  promotionDismiss: 'promotion_dismiss',
} as const;

export type AnalyticsEventName =
  (typeof analyticsEvents)[keyof typeof analyticsEvents];

export const analyticsEventNames = Object.values(analyticsEvents);

export interface AnalyticsEventDetail {
  name: AnalyticsEventName;
  parameters?: Record<string, string>;
}
