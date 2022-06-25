---
layout: post
title: High Availability in Kubernetes
sub_title: Part 1
read_time: 2
date: October 2019
featured_image: https://opeonikute.dev/img/Background.png
---

## What is High Availability?

Availability means well, **available**. If you say something is available, it means it's there when you need/want it. 

In the context of software systems, availability means your system is constantly up and running.

And in the context of distributed systems, it means when one node goes down, the system does not fail, it remains operational. 

High availability means your system has a high rate for uptime/availability. i.e. [The system or system component is "continuously available for a desirably long length of time"](https://searchdatacenter.techtarget.com/definition/high-availability). Examples of this:

- SLA guarantees like [AWS' uptime guarantee](https://aws.amazon.com/compute/sla/).
- [Twitter's architecture for scale](http://highscalability.com/blog/2013/7/8/the-architecture-twitter-uses-to-deal-with-150m-active-users.html?utm_source=feedly).

The rest of this post is gonna assume we're in the context of distributed systems. 

## Why is it important?

Several factors come into play when you decide what you should care about in your system. One of the most important factors, which should go without saying really, is that users should be able to access your system. Amongst other great benefits, High Availability ensures:

- Redundancy - The software system/component doesn't go down in case of a single-node failure. i.e. Disaster recovery before you even discover there's been one.
- Scalability - New nodes can be added when the inevitable need to scale comes.
- Easier Maintenance - Nodes can be taken down, maintained and put back up without system failure.

## What are some patterns commonly used for high availability?

A HA system usually consists of two nodes, since that's the minimum number of nodes needed for redundancy. 

### Node configurations

- Active/active
- Active/passive
- N + 1
- N + M

### Failover Strategies

What happens when a master node fails?

- Fail fast
- On fail, try one
- On fail, try all

Source ([Wikipedia](https://en.wikipedia.org/wiki/High-availability_cluster))

### Tools & providers

- Nginx - [NGINX Plus configured with HA](https://www.nginx.com/products/nginx/high-availability/), or Nginx with [keepalived](https://docs.nginx.com/nginx/admin-guide/high-availability/ha-keepalived-nodes/).
- AWS - [SoftNas](https://aws.amazon.com/marketplace/solutions/infrastructure-software/high-availability)
- Digital Ocean - [Community tools for HA](https://www.digitalocean.com/community/tags/high-availability/tools)
- GCP - Wasn't immediately apparent but [this tutorial](https://campus.barracuda.com/product/cloudgenfirewall/doc/73007965/how-to-configure-a-high-availability-cluster-in-google-cloud/) seems good.

## Conclusion

High Availability is important. Especially in the context of distributed systems. It prevents disasters, enables you provide SLAs, builds in redundancy and all-round makes your system more battle-ready.

In the next post, we'll go into implementing HA in Kubernetes. Exciting times, innit?

### Further Reading

Some resources you can check out to dig deeper.

**High Availability**

- [High Availability (Simplicable)](https://simplicable.com/new/high-availability)
- [Another article about Twitter's scale](https://blog.twitter.com/engineering/en_us/topics/infrastructure/2017/the-infrastructure-behind-twitter-scale.html)
- [This Quora answer](https://www.quora.com/What-is-High-Availability-and-why-is-it-important)
- [Wikipedia](https://en.wikipedia.org/wiki/High-availability_cluster)

**Distributed Systems**

- [Introduction to distributed systems](https://medium.com/free-code-camp/a-thorough-introduction-to-distributed-systems-3b91562c9b3c)
- [Distributed Systems Step-By-Step](https://medium.com/free-code-camp/distributed-systems-when-you-should-build-them-and-how-to-scale-a-step-by-step-guide-37e76a177218)