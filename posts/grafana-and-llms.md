---
layout: post
title: Grafana and LLMs
sub_title: 
read_time: 
date: July 2025
featured_image:
---

## TODO: Intro section - what about?
- A rallying cry, a story?
- The point would be how LLMs are changing the way we interact with our work?
- How they can be helpful?
    - Provide a concrete, real-world example that people that aim for
    - Then bring it home to Grafana, and what we hope this means to dashboarding
    - But talk about what it actually means right now (Grafana Labs had been snoozing until recently, etc)
    - Mention the course

## Problems with Grafana
As far as easy-to-use platforms go, Grafana has some catching-up to do. A few years ago, I did not enjoy working with Grafana - especially when I needed to create table panels. What I'd expect to be a 30-minute task would end up taking more than double the time, leaving me frustrated.

Before writing any scripts for this course, I asked other SREs [what they currently hate](https://www.reddit.com/r/sre/comments/1j6fzyd/what_do_you_hate_about_using_grafana/) about using Grafana. A lot of the comments were about difficulty doing basic things with panels. You'd expect that these difficulties should have simple solutions, but that is not the case.

A dashboard tool like Grafana has to support both simple and complex use-cases, and the nature of the tooling reflects that. Unfortunately, the complex tools can easily get in the way of the simple use-cases, as they are present on the same client. An approach I've seen Grafana (and Prometheus) take to make the tooling easier to understand is to add helpers. For example, Grafana includes help descriptors for Transformations, and tools like [Promlens](https://promlens.com/) provide assistance for writing and understanding [PromQL](https://prometheus.io/docs/prometheus/latest/querying/basics/).

*TODO - Image of the Grafana table helpers*

Naturally, I think this type of assistance is the future of making Grafana simple to use.

## Grafana and LLMs

Artificial Intelligence has really taken off in more day-to-day usecases in the last couple of years. Previously limited to industry professional and big companies, we now have several tools that bring the power AI to our doorstep. ChatGPT is becoming the go-to search mechanism for humans, Cursor is increasingly useful for vibe-coding and building MVPs, NotebookLM is great for research and must be transforming the lives of students, etc.

While there is consistent chatter about AI replacing entire jobs and making us irrelevant, the reality is that the goal should never be to replace humans. LLMs in particular are proving to be great for assistance - augmenting existing roles and opening up new dedicated roles. This is why I believe LLMs are a natural fit for assisting people with dashboarding.

With the right context provided, an LLM assistant for your dashboard is akin to a search engine and assistant that understands your challenges. You could ask an LLM to help you troubleshoot a tricky Transformation that's not working. You could ask it to show you new insights in specific ways. Previously impossible tasks like spotting trends (and anomalies) also become easier once you expose that information to the right model.

Earlier this year, I spent a lot of time researching what was currently available, and I wasn't too impressed with what Grafana had available. There was no integration for LLM assistance in dashboards. That changed two months ago at the latest GrafanaCon, where they announced [plans for a native LLM agent built into Grafana Cloud](https://grafana.com/blog/2025/05/07/llm-grafana-assistant/).

But before the announcement, I had come up with an open-source way to get LLMs into Grafana dashboards natively. Inspired by [this Youtube video](https://youtu.be/fOF-SmDU9zo?si=eksJRNOmnQF8SHAF) from Grafana Labs, we can use a panel plugin that can receive text queries and send them to an LLM. The main change I made is in the architecrure - a backend API is more secure and should be the bridge between the plugin and the LLM.

I go into more detail and walk through the code a bit in [this video](http://todo). The rest of this post will discuss everything that's relevant about how LLMs can interact with Grafana.

### The Grafana JSON Model

Every dashboard is represented by a JSON object. This is really useful for interacting with dashboards in code - forming the basis for advances like [dashboards-as-code](https://grafana.com/blog/2022/12/06/a-complete-guide-to-managing-grafana-as-code-tools-tips-and-tricks/). I've particularly found it useful when working with larger teams to declare dashboards using Terraform.

Here's what the model looks like. Each dashboard has a unique identifier and other useful metadata, such as the templating, annotations and tags.
```
{
  "id": null,
  "uid": "cLV5GDCkz",
  "title": "New dashboard",
  "tags": [],
  "timezone": "browser",
  "editable": true,
  "graphTooltip": 1,
  "panels": [],
  "time": {
    "from": "now-6h",
    "to": "now"
  },
  "timepicker": {
    "refresh_intervals": []
  },
  "templating": {
    "list": []
  },
  "annotations": {
    "list": []
  },
  "refresh": "5s",
  "schemaVersion": 17,
  "version": 0,
  "links": []
}
```

The dashboard below has a Text, Gauge and Time Series panel.

![Dash Example](/media/grafana_dash_example.png)

Here's how the panels look in JSON:
```
"panels": [
{
    "fieldConfig": //...
    "id": 1,
    "options": {
        "code": //...
        "content": "# Service Monitoring Dashboard\n\nThis dashboard monitors CPU usage, memory consumption, and response times for our three microservices.",
        "mode": "markdown"
    },
    "pluginVersion": "11.5.2",
    "title": "Dashboard Overview",
    "type": "text"
},
{
    "datasource": {
        "type": "prometheus",
        "uid": //...
    },
    "fieldConfig": {
        "defaults": //...
        "overrides": []
    },
    "gridPos": //...
    "id": 6,
    "options": //...
    "pluginVersion": "11.5.2",
    "targets": [
        {
            "editorMode": "code",
            "expr": "100 - (avg by(service) (rate(node_cpu_seconds_total{mode=\"idle\"}[1m])) * 100)",
            "legendFormat": "__auto",
            "range": true,
            "refId": "A"
        }
    ],
    "title": "CPU utilisation per service",
    "type": "gauge"
},
{
    "datasource": {
        "type": "prometheus",
        "uid": "Prometheus"
    },
    "description": "Memory consumption by service",
    "fieldConfig": //...
    "gridPos": //...
    "id": 3,
    "options": //...
    "pluginVersion": "11.5.2",
    "targets": [
        {
            "datasource": {
            "type": "prometheus",
            "uid": "Prometheus"
            },
            "editorMode": "code",
            "expr": "node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes",
            "legendFormat": "{{service}}",
            "range": true,
            "refId": "A"
        }
    ],
    "title": "Memory Consumption",
    "type": "timeseries"
}]
```

This structure makes it possible to provide all the relevant dashboard to an LLM. We don't need to load the entire JSON into prompts - we can pick and choose the relevant fields based on the goal. For basic questions, the most common information needed would be the Dashboard ID, title and panel information. 

More advanced troubleshooting would then need to provide other fields like `options` (Panel Options) and `fieldConfig` (e.g. Thresholds, Overrides). A full description of the JSON model can be found on the [Grafana website](https://grafana.com/docs/grafana/latest/dashboards/build-dashboards/view-dashboard-json-model/).

### Retrieval Augmented Generation (RAG)
### The Model Context Protocol (MCP)

### Handling Context Windows

### Context Pipelines, Guardrails
*not dissimilar to what I mentioned during the journalism post*

## Grafana Cloud LLM announcement, and the future
As I mentioned earlier, users of Grafana Cloud can expect a native LLM integration soon. The interface looks like Cursor a bit, which translates well for existing Cursor users. If you're however thinking of implementing your own solution, I describe everything in full in my upcoming course on Linkedin Learning! 

Amongst other intermediate to advance Grafana concepts, this specific course chapter covers a full intro to LLMs, how it's relevant to Grafana, the role of RAG/MCP and finally a detailed description and demos of the LLM plugin. If you only want an overview of the idea, feel free to just watch [the Youtube video](http://todo).

To get notified when the course becomes available, feel free to follow me on LinkedIn or Twitter. You can also subscribe to my Substack account below. If you want me to personally reach out to you, try sending a message wherever you can reach me and I'll do my best to get to everyone.

Finally, the best way to keep track of Grafana advancements is to receive the newsletters from Grafana Labs, which is something you get when you create a Grafana Cloud account. If I hadn't, I probably wouldn't have found out that Grafana had publicly announced with LLM plans before writing this.