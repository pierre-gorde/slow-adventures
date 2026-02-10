export interface DestinationData {
  country: string;
  description: string;
  image: string;
  overlayColor: 'terracotta' | 'sauge';
  order: number;
}

export interface AnalyticsEvent {
  name: string;
  params: Record<string, string | number>;
}

export interface ProcessStepData {
  number: number;
  title: string;
  description: string;
  icon?: string;
}

export interface TestimonialData {
  imageSrc: string;
  quote: string;
  name: string;
  tripContext: string;
}

export interface PricingData {
  label: string;
  price: string;
  description?: string;
}
