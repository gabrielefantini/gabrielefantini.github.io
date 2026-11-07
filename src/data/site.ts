/**
 * Central place for everything personal on the site.
 * Edit this file to update links, bio, work and organisations.
 */

export type ArtName =
  | 'flow'
  | 'mesh'
  | 'orbits'
  | 'spiro'
  | 'lattice'
  | 'contours'
  | 'rays'
  | 'ribbon'
  | 'banner';

/** An illustration reference, e.g. `mesh-dark` or `flow-light`. */
export type Art = `${ArtName}-${'dark' | 'light'}`;

export const profile = {
  name: 'Gabriele Fantini',
  shortName: 'Gabriele',
  role: 'Software Engineer',
  headline: 'Building the tooling that makes data governable.',
  tagline:
    'I’m a software engineer working on data governance, data products and data mesh — at Blindata and in the Open Data Mesh Initiative.',
  email: 'gabrielefantini97@gmail.com',
  links: {
    github: 'https://github.com/gabrielefantini',
    linkedin: 'https://www.linkedin.com/in/gabriele-fantini-3b9711130',
  },
};

export type Org = {
  id: string;
  name: string;
  kicker: string;
  summary: string;
  description: string[];
  url: string;
  github?: string;
  art: Art;
  highlights: { title: string; text: string }[];
  repos?: { name: string; description: string; url: string }[];
};

export const orgs: Org[] = [
  {
    id: 'blindata',
    name: 'Blindata',
    kicker: 'Where I work · since 2022',
    summary:
      'A governance platform for the full lifecycle of the enterprise information architecture — from knowledge to data assets.',
    description: [
      'Blindata is an Italian SaaS platform that governs information architectures end to end: business glossary and ontologies, data catalog, lineage, data quality, data products and privacy compliance — all linked in a single knowledge graph.',
      'As a software engineer I work on the platform that brings governance into the place where data is actually built: data products with standard descriptors, computational governance policies, and metadata that is ready to be used as context by Gen AI and agents.',
    ],
    url: 'https://blindata.io',
    github: 'https://github.com/blindata',
    art: 'contours-dark',
    highlights: [
      {
        title: 'Metadata management',
        text: 'Business glossary, data catalog and a data products catalog, linked through ontologies.',
      },
      {
        title: 'Data products',
        text: 'Marketplace, computational governance policies and a DataOps platform with shift-left data contracts.',
      },
      {
        title: 'Data quality & lineage',
        text: 'Key quality indicators, probes, observability, and automated technical & semantic SQL lineage.',
      },
      {
        title: 'Gen AI on governed metadata',
        text: 'AI assistant, semantic search and an MCP server that turns governed metadata into context for agents.',
      },
      {
        title: 'Privacy & compliance',
        text: 'Record of processing activities, privacy notices and consent management for GDPR and regulated industries.',
      },
    ],
  },
  {
    id: 'opendatamesh',
    name: 'Open Data Mesh Initiative',
    kicker: 'Open source · specifications & platform',
    summary:
      'Open source software, standards and protocols to boost data mesh adoption. Sharing is caring.',
    description: [
      'The Open Data Mesh Initiative fosters the paradigm shift in the world of data through open specifications and open source software, released under the Apache 2.0 license.',
      'At its core is the Data Product Descriptor Specification (DPDS): a technology-agnostic, composable and extensible way to declaratively describe a data product — its ports, contracts and infrastructure — in a JSON or YAML document. The ODM Platform builds on it to manage the whole data product lifecycle. I contribute to the platform’s services, including the registry and blueprint servers.',
    ],
    url: 'https://initiative.opendatamesh.org/',
    github: 'https://github.com/opendatamesh-initiative',
    art: 'mesh-light',
    highlights: [
      {
        title: 'DPDS',
        text: 'An open specification that declaratively defines a data product in all its components.',
      },
      {
        title: 'ODM Platform',
        text: 'A platform to manage the data product lifecycle: registry, blueprints, DevOps, policies and notifications.',
      },
      {
        title: 'Adapters',
        text: 'Integrations with the wider ecosystem — GitLab, Jira, ServiceNow, and Blindata as observer.',
      },
    ],
    repos: [
      {
        name: 'odm-specification-dpdescriptor',
        description: 'The Data Product Descriptor Specification (DPDS).',
        url: 'https://github.com/opendatamesh-initiative/odm-specification-dpdescriptor',
      },
      {
        name: 'odm-platform',
        description: 'A platform to manage the data product life cycle.',
        url: 'https://github.com/opendatamesh-initiative/odm-platform',
      },
      {
        name: 'odm-platform-pp-registry-server',
        description: 'Registry service of the ODM platform.',
        url: 'https://github.com/opendatamesh-initiative/odm-platform-pp-registry-server',
      },
      {
        name: 'odm-platform-pp-blueprint-server',
        description: 'Blueprint service of the ODM platform.',
        url: 'https://github.com/opendatamesh-initiative/odm-platform-pp-blueprint-server',
      },
      {
        name: 'odm-platform-adapter-observer-blindata',
        description: 'Open Data Mesh meta-service adapter for blindata.io.',
        url: 'https://github.com/opendatamesh-initiative/odm-platform-adapter-observer-blindata',
      },
      {
        name: 'odm-specification-datastoreapi',
        description: 'The Data Store API specification.',
        url: 'https://github.com/opendatamesh-initiative/odm-specification-datastoreapi',
      },
    ],
  },
];

/** What I focus on — shown on the home page. */
export const focusAreas: { title: string; text: string }[] = [
  {
    title: 'Data products',
    text: 'Describing data products declaratively with DPDS: ports, data contracts and infrastructure as one versioned descriptor.',
  },
  {
    title: 'Data product lifecycle',
    text: 'Platform services that register, scaffold, deploy and observe data products — the ODM registry, blueprint and DevOps flows.',
  },
  {
    title: 'Computational governance',
    text: 'Turning governance rules into policies that run automatically, shifting checks left into the data product pipeline.',
  },
  {
    title: 'Metadata & lineage',
    text: 'Catalogs, glossaries and lineage linked in a knowledge graph, so every asset has meaning and provenance.',
  },
  {
    title: 'Data quality',
    text: 'Business-driven quality indicators, probes and observability rather than one-off technical checks.',
  },
  {
    title: 'AI on governed metadata',
    text: 'Exposing trusted metadata to assistants and agents through APIs and MCP, so AI works on context you can trust.',
  },
];

export const experience: { period: string; title: string; place: string; text: string; url?: string }[] = [
  {
    period: '2022 — now',
    title: 'Software Engineer',
    place: 'Blindata',
    text: 'Building the Blindata governance platform and contributing to the Open Data Mesh Initiative’s open source platform.',
    url: 'https://blindata.io',
  },
  {
    period: 'Side project',
    title: 'Front-end developer',
    place: 'Ecosentinel',
    text: 'Front end of the Ecosentinel web application.',
    url: 'https://www.ecosentinel.it/',
  },
];

export const education: { period: string; title: string; place: string; text: string }[] = [
  {
    period: '2020 — 2022',
    title: 'MSc, Computer Engineering',
    place: 'Politecnico di Torino',
    text: 'Thesis: “Continuous integration for end-to-end testing of mobile applications”.',
  },
  {
    period: '2016 — 2020',
    title: 'BSc, Computer & Electronic Engineering',
    place: 'Università degli Studi di Perugia',
    text: 'Thesis on over-the-air (OTA) software updates for automotive applications.',
  },
];

/**
 * Open source projects I sponsor or want to support.
 * Empty for now — add entries and the Sponsoring page fills itself in.
 */
export type Sponsored = {
  name: string;
  owner: string;
  description: string;
  url: string;
  sponsorUrl?: string;
  art?: Art;
};

export const sponsored: Sponsored[] = [];
