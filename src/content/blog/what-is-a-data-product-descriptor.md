---
title: What is a data product descriptor?
date: 2026-11-06
summary: A short tour of DPDS — the open specification that describes a data product in a single JSON or YAML document.
art: mesh-dark
tags: [data & governance, dpds]
draft: true
---

> **Draft** — this post is only visible when running the site locally (`npm run dev`). Set `draft: false` to publish it.

A data product is more than a table. It has **ports** through which it is consumed and observed, **contracts** that describe what it promises, and **infrastructure** that makes it run.

The [Data Product Descriptor Specification](https://dpds.opendatamesh.org/) (DPDS) captures all of that in a single declarative document:

```yaml
dataProductDescriptor: 1.0.0
info:
  fullyQualifiedName: urn:dpds:acme:dataproducts:trip-execution:1
  name: trip-execution
  version: 1.0.0
  domain: transport-management
  owner:
    id: john.doe@acme.com
interfaceComponents:
  outputPorts: []
```

The specification is:

| Principle  | What it means |
| ---------- | ------------- |
| Open       | Apache 2.0 — use it as it is or extend it |
| Flexible   | Technology agnostic |
| Composable | Reusable, parametrised templates |
| Extensible | Custom properties, plus OpenAPI / AsyncAPI where they fit |

_To be continued…_
