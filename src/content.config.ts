import { defineCollection } from 'astro/content/config';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const serviceSignal = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.enum([
    'accessibility',
    'activity',
    'bandage',
    'biceps-flexed',
    'bone-fracture',
    'expand',
    'footprints',
    'lock-keyhole',
    'move-3d',
    'rotate-ccw',
    'route',
    'shield-alert',
    'timer-reset',
    'trending-down',
  ]),
});

const serviceSection = z.object({
  eyebrow: z.string().min(1),
  heading: z.string().min(1),
  description: z.string().min(1),
  tone: z.enum(['canvas', 'subtle', 'strong', 'warm']),
});

const services = defineCollection({
  loader: glob({ base: './src/content/services', pattern: '**/*.md' }),
  schema: z.object({
    card: z.object({ title: z.string().min(1), summary: z.string().min(1) }),
    media: z.object({ key: z.string().min(1), alt: z.string().min(1) }),
    featured: z.boolean(),
    order: z.number().int().positive(),
    page: z.object({
      category: z.string().min(1),
      hero: z.object({
        title: z.string().min(1),
        description: z.string().min(1),
      }),
      signals: z.array(serviceSignal).min(3).max(4),
      sections: z.array(serviceSection).min(3),
      cta: z.object({
        heading: z.string().min(1),
        description: z.string().min(1),
      }),
    }),
  }),
});

const faqs = defineCollection({
  loader: glob({ base: './src/content/faqs', pattern: '**/*.md' }),
  schema: z.object({
    question: z.string().min(1).max(140),
    category: z.enum(['consulta', 'lesiones', 'cirugia']),
    featured: z.boolean(),
    order: z.number().int().min(1).max(6),
  }),
});

const simplePageSection = z.object({
  id: z.string().min(1),
  heading: z.string().min(1),
  text: z.string().min(1),
});

const detailedPageSection = z.object({
  id: z.string().min(1),
  heading: z.string().min(1),
  paragraphs: z.array(z.string().min(1)).min(1),
  bullets: z.array(z.string().min(1)).optional(),
  links: z
    .array(
      z.object({
        label: z.string().min(1),
        href: z.string().min(1),
        external: z.boolean().optional(),
      }),
    )
    .optional(),
});

const pageSection = z.union([simplePageSection, detailedPageSection]);

const pageAction = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  variant: z.enum(['primary', 'secondary', 'inverse']),
});

const pageLink = z.object({
  label: z.string().min(1),
  description: z.string().min(1),
  href: z.string().min(1),
  icon: z.enum(['stethoscope', 'map-pin', 'message-circle']),
});

const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    heading: z.string().min(1),
    intro: z.string().min(1),
    eyebrow: z.string().min(1).optional(),
    noindex: z.boolean(),
    updatedAt: z.string().min(1).optional(),
    sections: z.array(pageSection).optional(),
    actions: z.array(pageAction).optional(),
    links: z.array(pageLink).optional(),
  }),
});
const testimonials = defineCollection({
  loader: glob({ base: './src/content/testimonials', pattern: '**/*.md' }),
  schema: z.object({
    authorDisplay: z.string().min(1),
    portrait: z.enum(['rosario-hoil', 'areli-perez', 'armando-rivas']),
    source: z.literal('guide'),
    sourceUrl: z.string().min(1),
    quote: z.string().min(1),
    rating: z.number().int().min(1).max(5),
    sourceLocation: z.string().min(1),
    locationId: z.enum(['coyoacan', 'coapa', 'acoxpa']).optional(),
    publishedAt: z.coerce.date(),
    featured: z.boolean(),
    order: z.number().int().positive(),
  }),
});
export const collections = { services, faqs, pages, testimonials };
