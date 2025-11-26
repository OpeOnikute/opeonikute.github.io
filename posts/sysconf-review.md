---
layout: post
title: Sysconf 2025 Review
sub_title: Improving engineering excellence through knowledge
read_time: 7
date: Nov 2025
featured_image: https://opeonikute.dev/media/sysconf-tweet.png
image-theme: dark no-image-styling
---

On the 8th of November, I attended Sysconf 2025. This was the best Sysconf yet in my opinion, although I barely had time to enjoy the talks in the last one as I was a [speaker](https://youtu.be/OH0CuqNpo_A?si=swXiRa8IdENZwA8g).

This time, I was able to attend more talks and had a blast. 

![Tweet about the conference](/media/sysconf-tweet.png)

I enjoyed some of the sessions so much that I decided to write a quick recap to crystallise my thoughts on each of them. 
Because the structure of the conference is two sessions happening at the same time, I unfortunately could not watch them all.

## The Sysdesign ethos

![Sysdesgn ethos](/media/sysconf-ethos.png)

This was [Ayo](https://x.com/_alternatewolf) talking about what SysDesign is and what they stand for. I only caught the tail end, but his talk was valuable beyond understanding what Sysconf/SysDesign is. We should all be learning from first principles, reading and making simple things to learn + grow.

One thing I've found very useful (and wish I learned and practiced earlier) is the power of compound effects. When aiming to learn/grow in any area, I'd typically wait until I had time to focus on the one thing, meaning I only grew in one area at a time. It also unfortunately meant that my growth in several long-term areas was hindered because I just never started.

But with slow, consistent growth e.g. committing to one hour of deep focus per day **no matter what**, I'm able to consistently create, learn and grow. You'd be surprised at how much you can achieve in just one week if you adopt this principle. Now I just need to learn how to take breaks (😅).

Finally, please READ. Read long books. Difficult books. Research papers. Blog posts. Read wide, and read consistently.

The full video is [on Youtube](https://youtu.be/EJsn4z77OYA?si=XcBukLWTBeV82pp4).

## Whisperer: An Elixir Based Multi Agent Framework

![Pelumi talking about Elixir](/media/sysconf-elixir.png)

In this talk, [Pelumi](https://x.com/Pelumi_SA) preached about Elixir and did a pretty good job of convincing us to try it out.
The main premise was that building multi-agent systems is already a common pattern in Elixir (and functional programming languages as a whole), making it relevant for building agents that we want to in this LLM world. He also spoke a bit about common agentic workflow patterns that serve as a great foundation for designing agentic workflows. 

What was however interesting to me was the concept of an LLM for observability actions (MonitorLizard). I asked about hallucination and he gave a "no bullshit" answer, which I appreciated. While some agentic design patterns *try* to prevent hallucination, they are not crash-proof. This makes sense as a practical drawback, and can be solved using [durable execution](https://temporal.io/blog/what-is-durable-execution) frameworks.

You can find the full video [on Youtube](https://youtu.be/5KFaMKGNjTU?si=QWgNWde1_4qP0igw).

## Trustless Federated Learning at Edge Scale

![Paul talking about TFL](/media/sysconf-tfl.png)

[Paul](https://x.com/po_oamen) is a researcher that believes the models of the future should be trained on billions of independent devices. One drawback of the way models are trained today is privacy. What if we could have our devices contribute to anonymised learning and prevent big companies from harvesting our data for training purposes?

As is common with research, this was mostly theoretical. It provides a very useful thought experiment about the future of training (and maybe even inference). Full talk is [here](https://youtu.be/mAptRTmmvYk?si=QmEzw08RhlwTb0lU).

## The AI’s Toolbox: Solving the Systems Challenges of a Multi-Tool Data Agent

![Zainab talking about AI toolbox](/media/sysconf-applied-ai.png)

[Zainab](https://x.com/Zeeskylaw) spoke about the systems you need to build around an LLM to make it reliable, secure and truly useful for an enterprise product. I enjoy when people speak more about challenges and the thinking behind solutions. It was also not surprising how much MCP was a game-changer for the Decide team.

This talk was also a great example of how research is forever relevant. As a company, you can solve the most complex problems by having the willingness to invest time in research. It seems obvious, but it's not often the reality because of stakeholder requirements, timelines etc. Zainab mentioned that she mostly does the research and hands over to other members of the team. A dedicated engineer is often more feasible for more in-depth asks like this.

Another interesting concept explored in this talk was Sandboxing for LLM output. They isolate all the LLM execution in a secure, containerised environment with resource limits and clean state. It reminds me of the [bulkhead pattern](https://medium.com/nerd-for-tech/bulkhead-pattern-distributed-design-pattern-c673d5e81523), which prevents failure in a system from affecting others.

They also use a self-correcting loop to provide resilience and a simple form of reinforcement learning for their LLMs. I was not totally convinced because LLMs can be sneaky. They have been known to "fix" tests by deleting them. But for simple errors, I think a loop with retry guards is sufficient. Ultimately needs more guardrails like human-in-the-loop, LLM-as-a-judge etc.

Watch the full talk on [Youtube](https://youtu.be/nFrvAM03OHg?si=4Tx1lMEFF4B6EtxS).

## How to Develop Intuition About AI Agents, or Introduction to Graph Theory

![Justin talk about AI agents](/media/sysconf-graph-theory.png)

In one of my favourite talks of the day, [Justin](https://de.linkedin.com/in/justinirabor) spoke about how to reason about AI agents using graph theory. He went through a detailed introduction to the fundamentals of graph theory, including the mathematical definitions.

The aim of the talk was to give us a mental model of how agents behave by reframing them through the lens of graph theory. This mental model then makes it easier to predict and debug agents' behaviour. This is a good example of applying fundamental principles to a practical problem.

Graph theory has a lot of usecases, and I encourage you to spend some time learning the fundamentals. Some useful resources:
- [Building effective agents - Anthropic](https://www.anthropic.com/engineering/building-effective-agents)
- [Full course catalog on Graph Theory](https://arxiv.org/pdf/2308.04512)
- [Another great-looking course](https://youtu.be/oXcCAAEDte0?si=WEeKqCsD59CHAiPz)

One observation that is probably only relevant to me -- he mentioned the difference between workflows and agents being *agency*. It sounds obvious in hindsight: a workflow is a defined list of steps that need to be executed, while agents can make decisions and execute steps that were not predicted/planned for. 

A workflow is generally easier to reason about because it ends up being a DAG (Directed Acyclic Graph) most of the time, while agents will surely have more complex graph patterns. While most of the automation I build is related to workflows, it's a useful thought experiment for eventually building more complex, interoperable automation with agents.

Watch the full talk on [Youtube](https://youtu.be/iwAQ_XmD24o?si=jYZ4UyhEMWLxiLYq).

## Dead Programs Tell Tales: A Peek at Coredumps

![Somto talks about coredumps](/media/sysconf-coredump.png)

This talk was given by [Somtochi](https://x.com/somtochiama), who gave a thorough introduction to coredumps and debugging them. I thought it was very brave to do a live demo of a Coredump debugging session, and it went very well.

Like monitoring, Coredump debugging is not a commonly-referenced topic until it is needed for troubleshooting. It is good to practice debugging before you need it, and to understand the fundamentals of what you're doing when troubleshooting. Somtochi does a fantastic job of providing all of this information, so watch the talk.

I had some extra thoughts about the sensitivity of coredumps and the dangers of taking coredumps from a running process, which were covered in the QA section. If you're interested in how to reason about coredumps in NodeJS, read [How good is your memory?](https://opeonikute.dev/posts/how-good-is-your-memory) on this blog.

Watch the full talk on [Youtube](https://youtu.be/BuH3BbJe88Y?si=0jPKZBlMwBBWu1r-).

## A Panel on Technical Leadership

![Panel on leadership](/media/sysconf-leadership.png)

This was a panel on technical leadership with five engineering leaders. The main takeaways for me were about excellence and doing great work. They also gave a lot of useful advice about promotions and accountability, but it all ultimately boiled down to excellence.

I'm curious what more junior people learned from this talk, so feel free to reach out or mention the Sysconf team in a tweet!

Watch the full talk on [Youtube](https://youtu.be/h3IX5wjzNMM?si=Ja1_k70ddG2ewWaz).

## Forget the 1 Billion Rows Challenge, Let’s Solve The I, Zombie Endless

![Fanan talking about iZombie](/media/sysconf-izombie.png)

This was my last talk of the day so I was a bit distracted. It was so good though that I've already rewatched on Youtube. [Fanan](https://x.com/The_cocoreidh) provides a great introduction to the fundamentals of concurrency in Go, and how to simplify overwhelming problems.

The talk goes through solving a challenging problem with great fundamentals, which fit really well into the theme of the day. Other attendees also seemed very tuned-in and engaged.

See full video on [Youtube](https://youtu.be/8Tqb6GW7E18?si=LEp64dZm3GGJZA-N).

## Conclusions
It was a long day and there are several talks that I missed entirely (or most of):
- What Makes It Go Brrrrr? An Introduction to the Inner Workings of LLM Inference Engines by Habeeb Shopeju
- Networking Stalemates: An Insider View to CLOSE_WAIT Sockets by Emmanuel Bakare
- How We Handle Data Encryption at InfraRed by Allen Akinkunle

All the videos are available on Youtube, so I'll try to catch them there. I also spent very little time networking, so if you want to have a chat about anything, feel free to reach out! I spend a lot of time thinking about research, SRE, Youtube and machine-learning these days. Any of these topics is a great way to get my attention.

See you at Sysconf '26!