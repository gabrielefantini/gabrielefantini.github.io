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
  | 'contexts'
  | 'banner';

/** An illustration reference, e.g. `mesh-dark` or `flow-light`. */
export type Art = `${ArtName}-${'dark' | 'light'}`;

export const profile = {
  name: 'Gabriele Fantini',
  shortName: 'Gabriele',
  role: 'Software Engineer',
  eyebrow: 'Software engineer · Domain-driven design · AI in software engineering',
  headline: 'From conversations to code.',
  tagline:
    'I’m a software engineer who starts from the domain. I turn conversations with domain experts into models, models into clean architecture, and architecture into code — increasingly with AI in the loop.',
  currently:
    'Currently a software engineer at Blindata, a data governance platform, and a contributor to the open source platform of the Open Data Mesh Initiative.',
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
    kicker: 'Software engineer · since 2022',
    summary:
      'A governance platform for the full lifecycle of the enterprise information architecture — from knowledge to data assets.',
    description: [
      'Blindata is an Italian SaaS platform that governs information architectures end to end: business glossary and ontologies, data catalog, lineage, data quality, data products and privacy compliance — all linked in a single knowledge graph.',
      'It’s where I apply domain-driven thinking to data: data products with explicit contracts, governance policies that run as code, and governed metadata that AI assistants and agents can use as trusted context.',
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
    kicker: 'Open source contributor',
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

/** How I work — the four pillars on the home page. */
export const pillars: { title: string; text: string }[] = [
  {
    title: 'Collaborative modelling',
    text: 'Domain storytelling and EventStorming to discover the real problem together with the people who know it — before a line of code is written.',
  },
  {
    title: 'Domain-driven design',
    text: 'Ubiquitous language, bounded contexts and aggregates: models that speak the language of the business and keep complexity where it belongs.',
  },
  {
    title: 'Clean architecture',
    text: 'Explicit boundaries, ports and adapters, and a core that doesn’t depend on frameworks — so the code stays testable and easy to change.',
  },
  {
    title: 'Engineering with AI',
    text: 'AI as a real collaborator across the loop — modelling sessions, code, tests and reviews — with honest notes on what actually works.',
  },
];

/** What I'm experimenting with right now. */
export const exploring: { title: string; text: string; art: Art; tag: string }[] = [
  {
    title: 'From EventStorming to domain model',
    text: 'Using LLMs to turn workshop output — events, commands, policies — into a first draft of bounded contexts and aggregates to refine together.',
    art: 'contours-light',
    tag: 'AI × Modelling',
  },
  {
    title: 'Agents that respect the architecture',
    text: 'Coding agents in the development loop, guided by explicit boundaries, tests and conventions instead of hope.',
    art: 'spiro-dark',
    tag: 'AI × Engineering',
  },
  {
    title: 'Governed context for AI',
    text: 'Giving agents trusted context — ontologies and governed metadata exposed through MCP — instead of guesswork.',
    art: 'mesh-light',
    tag: 'AI × Data',
  },
];

/** Where software craft meets data governance: the same ideas, one level up. */
export const bridge: { from: string; to: string; text: string }[] = [
  {
    from: 'Ubiquitous language',
    to: 'Ontologies & business glossaries',
    text: 'Shared meaning, made explicit and linked to the data it describes.',
  },
  {
    from: 'Bounded contexts',
    to: 'Federated domains',
    text: 'Domain autonomy, with a shared core model across the mesh.',
  },
  {
    from: 'Ports & contracts',
    to: 'Data products & data contracts',
    text: 'Declarative descriptors with explicit, versioned interfaces.',
  },
  {
    from: 'CI & automated tests',
    to: 'Computational governance',
    text: 'Policies as code, run as quality gates across the data product lifecycle.',
  },
  {
    from: 'A shared domain model',
    to: 'Governed context for AI',
    text: 'The model that aligns a team is also what grounds an AI agent.',
  },
];

export const experience: { period: string; title: string; place: string; text: string; url?: string }[] = [
  {
    period: '2022 — now',
    title: 'Software Engineer',
    place: 'Blindata',
    text: 'Software engineering on a data governance platform — data products, contracts, computational governance and context for AI. Contributor to the Open Data Mesh Initiative’s open source platform.',
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
