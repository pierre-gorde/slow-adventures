import { describe, it, expect, expectTypeOf } from 'vitest';
import type {
  DestinationData,
  AnalyticsEvent,
  ProcessStepData,
  TestimonialData,
  PricingData,
} from '../../src/types/index';

// Runtime import to verify module is actually resolvable
const typesModule = await import('../../src/types/index');

describe('shared types', () => {
  it('module exports are resolvable at runtime', () => {
    expect(typesModule).toBeDefined();
  });

  it('DestinationData has correct shape', () => {
    expectTypeOf<DestinationData>().toEqualTypeOf<{
      country: string;
      description: string;
      image: string;
      overlayColor: 'terracotta' | 'sauge';
      order: number;
    }>();
  });

  it('AnalyticsEvent has correct shape', () => {
    expectTypeOf<AnalyticsEvent>().toEqualTypeOf<{
      name: string;
      params: Record<string, string | number>;
    }>();
  });

  it('ProcessStepData has correct shape', () => {
    expectTypeOf<ProcessStepData>().toEqualTypeOf<{
      number: number;
      title: string;
      description: string;
      icon?: string;
    }>();
  });

  it('TestimonialData has correct shape', () => {
    expectTypeOf<TestimonialData>().toEqualTypeOf<{
      imageSrc: string;
      quote: string;
      name: string;
      tripContext: string;
    }>();
  });

  it('PricingData has correct shape', () => {
    expectTypeOf<PricingData>().toEqualTypeOf<{
      label: string;
      price: string;
      description?: string;
    }>();
  });
});
