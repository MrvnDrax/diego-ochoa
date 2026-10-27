import { contact } from '@data/contact';
import { doctor } from '@data/doctor';
import { education } from '@data/education';
import { memberships } from '@data/memberships';
import { site } from '@data/site';
import { socialLinks } from '@data/social-links';

export type StructuredDataNode = Record<string, unknown>;
export type StructuredDataReference = { '@id': string };

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface PageStructuredDataOptions {
  title: string;
  description: string;
  canonicalUrl: string;
  pageType?: string | string[];
  breadcrumbs?: BreadcrumbItem[];
  mainEntity?: StructuredDataNode | StructuredDataNode[];
  additionalNodes?: StructuredDataNode[];
}

export interface ServiceSchemaInput {
  slug: string;
  name: string;
  description: string;
  category: string;
}

export interface FaqSchemaInput {
  question: string;
  answer: string;
}

const rootUrl = `${site.url}/`;
const websiteEntityId = `${rootUrl}#website`;
export const doctorEntityId = `${rootUrl}#doctor`;
const socialImageUrl = new URL(site.defaultSocialImagePath, rootUrl).href;
const socialImageEntityId = `${socialImageUrl}#primaryimage`;

const absoluteUrl = (path: string) => new URL(path, rootUrl).href;

const websiteSchema: StructuredDataNode = {
  '@type': 'WebSite',
  '@id': websiteEntityId,
  url: rootUrl,
  name: site.brandName,
  alternateName: 'Diego Ochoa',
  inLanguage: site.htmlLang,
  publisher: { '@id': doctorEntityId },
};

const socialImageSchema: StructuredDataNode = {
  '@type': 'ImageObject',
  '@id': socialImageEntityId,
  url: socialImageUrl,
  contentUrl: socialImageUrl,
  width: 1672,
  height: 941,
  caption: `${site.brandName}, ${site.specialty}`,
};

const doctorSchema: StructuredDataNode = {
  '@type': 'Person',
  '@id': doctorEntityId,
  name: doctor.fullName,
  alternateName: doctor.publicName,
  
  jobTitle: doctor.professionalTitle,
  description: `${doctor.professionalTitle} en ${doctor.city}, ${doctor.country}.`,
  url: absoluteUrl('/diego-ochoa'),
  image: { '@id': socialImageEntityId },
  telephone: contact.phoneE164,
  address: {
    '@type': 'PostalAddress',
    addressLocality: doctor.city,
    addressCountry: 'MX',
  },
  knowsAbout: doctor.clinicalFocus,
  alumniOf: education.map((item) => ({
    '@type': 'EducationalOrganization',
    name: item.institution,
  })),
  memberOf: memberships.map((membership) => ({
    '@type': 'Organization',
    name: membership.organization,
  })),
  sameAs: socialLinks.map((socialLink) => socialLink.href),
};

const createBreadcrumbSchema = (
  canonicalUrl: string,
  breadcrumbs: BreadcrumbItem[],
): StructuredDataNode | undefined => {
  if (breadcrumbs.length < 2) {
    return undefined;
  }

  return {
    '@type': 'BreadcrumbList',
    '@id': `${canonicalUrl}#breadcrumb`,
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
};

export const createPageStructuredData = ({
  title,
  description,
  canonicalUrl,
  pageType = 'WebPage',
  breadcrumbs = [],
  mainEntity,
  additionalNodes = [],
}: PageStructuredDataOptions): StructuredDataNode => {
  const breadcrumbSchema = createBreadcrumbSchema(canonicalUrl, breadcrumbs);

  const pageSchema: StructuredDataNode = {
    '@type': pageType,
    '@id': `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: title,
    description,
    inLanguage: site.htmlLang,
    isPartOf: { '@id': websiteEntityId },
    about: { '@id': doctorEntityId },
    primaryImageOfPage: { '@id': socialImageEntityId },
    ...(breadcrumbSchema
      ? { breadcrumb: { '@id': breadcrumbSchema['@id'] } }
      : {}),
    ...(mainEntity ? { mainEntity } : {}),
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      websiteSchema,
      socialImageSchema,
      doctorSchema,
      pageSchema,
      ...(breadcrumbSchema ? [breadcrumbSchema] : []),
      ...additionalNodes,
    ],
  };
};

export const createLocationSchemas = (): StructuredDataNode[] => [];

export const createServiceSchema = ({
  slug,
  name,
  description,
  category,
}: ServiceSchemaInput): StructuredDataNode => {
  const serviceUrl = absoluteUrl(`/servicios/${slug}/`);

  return {
    '@type': 'Service',
    '@id': `${serviceUrl}#service`,
    name,
    description,
    serviceType: category,
    url: serviceUrl,
    provider: { '@id': doctorEntityId },
    areaServed: {
      '@type': 'City',
      name: doctor.city,
    },
  };
};

const stripMarkdown = (value: string): string =>
  value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`>#]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export const createFaqQuestionSchemas = (
  entries: FaqSchemaInput[],
): StructuredDataNode[] =>
  entries.map((entry) => ({
    '@type': 'Question',
    name: entry.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: stripMarkdown(entry.answer),
    },
  }));

export const referenceStructuredData = (
  nodes: StructuredDataNode[],
): StructuredDataReference[] =>
  nodes.map((node) => ({ '@id': String(node['@id']) }));
