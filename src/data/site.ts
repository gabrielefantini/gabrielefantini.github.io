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
  | 'fan'
  | 'banner';

/** An illustration reference, e.g. `mesh-dark` or `flow-light`. */
export type Art = `${ArtName}-${'dark' | 'light'}`;

export const profile = {
  name: 'Gabriele Fantini',
  shortName: 'Gabriele',
  role: 'Software Engineer',
  location: 'Umbria, Italy',
  eyebrow: 'Software engineer at Blindata · Contributor to the Open Data Mesh Initiative',
  headline: 'From conversations to code.',
  tagline:
    'I’m Gabriele Fantini, a software engineer in Umbria, Italy. I’m the one asking a lot of questions before the code starts. I think good software comes from understanding the domain well, and that usually means listening more than typing. Lately, AI does some of the typing for me.',
  currently:
    'Currently a software engineer at Blindata, a data governance platform, and a contributor to the open source platform of the Open Data Mesh Initiative.',
  email: 'gabrielefantini97@gmail.com',
  links: {
    github: 'https://github.com/gabrielefantini',
    linkedin: 'https://www.linkedin.com/in/gabriele-fantini-3b9711130',
  },
};

/** What I've built at Blindata — shown on the About (Experience) and Work pages. */
export const blindataWork: { title: string; text: string }[] = [
  {
    title: 'AI Assistant',
    text: 'Blindata’s AI Assistant: an in-app chat for the everyday tasks of data stewards and analysts, with answers grounded in the organization’s ontology and linked to the right data assets.',
  },
  {
    title: 'AI agent infrastructure',
    text: 'The layer that gives assistants and external agents governed context — an MCP server, semantic search and context engineering — so AI reasons on trusted metadata instead of guessing.',
  },
  {
    title: 'ML anomaly detection',
    text: 'Machine-learning services that detect anomalies in data quality and observability metrics.',
  },
  {
    title: 'Language parsers',
    text: 'Custom parsers for software and query languages that extract metadata and lineage automatically from code.',
  },
  {
    title: 'System integrations',
    text: 'Low-level connectors for Blindata’s crawlers, harvesting metadata from databases, BI tools and data platforms.',
  },
  {
    title: 'Microservices for data platforms',
    text: 'A microservices architecture that runs data platform activities across the data product lifecycle: registry, blueprints, DevOps and policies.',
  },
];

export type Org = {
  id: string;
  name: string;
  kicker: string;
  summary: string;
  description: string[];
  url: string;
  github?: string;
  art: Art;
  highlightsTitle?: string;
  highlights: { title: string; text: string }[];
  repos?: { name: string; description: string; url: string }[];
};

export const orgs: Org[] = [
  {
    id: 'blindata',
    name: 'Blindata',
    kicker: 'Software engineer · since 2022 · Data governance platform',
    summary:
      'I build a data governance platform for the whole enterprise information architecture: ontologies and glossary, catalog, lineage, data quality, data products and computational governance — with governed metadata as context for AI agents.',
    description: [
      'Blindata is an Italian SaaS platform that governs information architectures end to end: business glossary and ontologies, data catalog, lineage, data quality, data products and privacy compliance — all linked in a single knowledge graph.',
      'It’s where I apply domain-driven thinking to data: data products with explicit contracts, governance policies that run as code, and governed metadata that AI assistants and agents can use as trusted context.',
    ],
    url: 'https://blindata.io',
    github: 'https://github.com/blindata',
    art: 'contours-dark',
    highlightsTitle: 'What I’ve built',
    highlights: blindataWork,
  },
  {
    id: 'opendatamesh',
    name: 'Open Data Mesh Initiative',
    kicker: 'Open source contributor · Data mesh',
    summary:
      'Open source specifications and software to boost data mesh adoption. I contribute to the ODM Platform, which manages the data product lifecycle on top of the Data Product Descriptor Specification (DPDS).',
    description: [
      'The Open Data Mesh Initiative fosters the paradigm shift in the world of data through open specifications and open source software, released under the Apache 2.0 license.',
      'At its core is the Data Product Descriptor Specification (DPDS): a technology-agnostic, composable and extensible way to declaratively describe a data product — its ports, contracts and infrastructure — in a JSON or YAML document. The ODM Platform builds on it to manage the whole data product lifecycle. I contribute to the platform’s services, including the registry and blueprint servers.',
    ],
    url: 'https://initiative.opendatamesh.org/',
    github: 'https://github.com/opendatamesh-initiative',
    art: 'mesh-light',
    highlightsTitle: 'The initiative',
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
    art: 'lattice-light',
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

export const experience: {
  period: string;
  title: string;
  place: string;
  text: string;
  url?: string;
  highlights?: { title: string; text: string }[];
}[] = [
  {
    period: '2022 — now',
    title: 'Software Engineer',
    place: 'Blindata',
    text: 'I design and build the core of a data governance platform, from low-level integrations to AI.',
    url: 'https://blindata.io',
    highlights: blindataWork,
  },
  {
    period: 'Open source',
    title: 'Contributor',
    place: 'Open Data Mesh Initiative',
    text: 'Contributor to the ODM Platform: the open source services that manage the data product lifecycle on top of the Data Product Descriptor Specification (DPDS).',
    url: 'https://github.com/opendatamesh-initiative',
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
 * Lab: public, experimental repositories (AI in software development,
 * modelling tools, architecture spikes…). Empty for now — add entries and
 * the Lab page fills itself in.
 *
 * Example:
 *   {
 *     name: 'eventstorming-to-model',
 *     description: 'LLM-assisted draft of bounded contexts from an EventStorming board.',
 *     url: 'https://github.com/gabrielefantini/eventstorming-to-model',
 *     tags: ['AI × Modelling'],
 *     status: 'experiment',
 *   },
 */
export type Experiment = {
  name: string;
  description: string;
  url: string;
  tags: string[];
  status?: 'experiment' | 'active' | 'archived';
  art?: Art;
};

export const experiments: Experiment[] = [];
