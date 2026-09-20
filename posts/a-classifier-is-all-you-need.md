---
layout: post
title: A classifier is all you need?
sub_title: Why I'm excited about Jev
read_time: 6
date: September 2026
featured_image: https://opeonikute.dev/media/recover-with-agent.png
image-theme: dark no-image-styling
---

I’m excited about [Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev), and I’ll explain why.

A lot of SREs have been thinking about how we can reasonably use LLMs in automation workflows. The main concern beyond safety is determinism — how can you guarantee that if you hand your “agent” the same task 1000 times, you get the same result every time?

I’ve written several iterations of handing specific tasks off to agents, but predictability has always been missing. The best we could do was constrain as much as possible using the prompt and harness, and prefer structured outputs like JSON over raw text. I once tried to adopt a “classifier” approach by having the agent return a score that indicates how confident it is in the result. This also failed to be predictable.

This failed classifier attempt is why I’m excited by the promise of a new abstraction, Jev. I haven’t tried it yet, but it’s meant to be great at classification i.e. decisions. Jev could be the missing piece for an autonomous agent for ops.

It’s difficult to automate complex situations like machine recovery because it’s hard for logic to cover every possible route to success. In Cloudflare SRE, successfully applied state machines to several such scenarios. But rigid state machines have a frustrating shortcoming. 

A slight deviation from the expected state of the system being recovered means that a human needs to intervene to manually determine what the new best path to success is.

![Recover a machine](/media/recover-machine.png)

The best recent example of a solution to this challenge comes from Stripe: [How Stripe uses graph search and state machines to auto-remediate a global database fleet](https://stripe.dev/blog/how-stripe-uses-graph-search-and-state-machines-to-auto-remediate-a-global-database-fleet). They also use state machines for auto-remediation, but use Dijkstra’s to figure out the best path to resolution, which should require no human decisions and handle edge cases pretty well.

But can Jev help create a new decision layer?

## Primitives are all you need

I built and maintain [a workflow automation platform](https://blog.cloudflare.com/improving-platform-resilience-at-cloudflare/) used by up to 6 different operations teams. A big part of that success lay in building primitives for others to use.

Think of primitives as the foundational elements needed to perform actions in production. One such example is a command to wipe a machine, and another to reboot. By themselves, they can barely move mountains. But they can combine with others to create powerful workflows.

The most powerful workflows combine these primitives using embedded logic that **decides** how to use them to achieve the desired goal. But again, rigif logic falls short when it hits an unexpected state.

## Collaboration is all you need

I'm currently reading [The Cathedral & the Bazaar : Musings on Linux and Open Source by an Accidental Revolutionary](https://www.goodreads.com/book/show/33053). Eric S. Raymond has a famous quote in the book:

“Given enough eyeballs, all bugs are shallow.”

When human operators spent most of their time fixing production by running commands (that have now become workflows), complex problems were often solved using many eyes. When we built the automation platform, we also solved architectural challenges and bug fixes in a similar collaborative manner.

In the same vein, I’m willing to bet that if we treat an agent that’s great at making decisions with the right combination of primitives and a good harness, we can treat it as a *semi-autonomous collaborator*.

![Recover a machine with an agent](/media/recover-with-agent.png)

In workflows that demand contextual flexibility, we can have the agent generate new state machines on the fly, given the actual state of the resource. And in true collaborative fashion, a human just needs to review and approve. If the confidence score is too low, the agent bails and the human decides what to do.

I recognize that whipping up a state machine is a little more involved than making simple classifications, but state machines are exactly like workflows — a collection of decisions that manipulate primitives. Another drawback of this design is that it doesn’t account for the outcomes of the state actions. What if the result is different from what the model thought would happen?

It remains to be seen if this new AI primitive can (finally) help us build autonomous systems for operations. If we succeed, you’ll definitely read about it on the [Cloudflare blog](https://blog.cloudflare.com/author/opeyemi/), or here.
