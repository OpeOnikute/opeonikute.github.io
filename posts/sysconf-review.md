---
layout: post
title: Sysconf 2025 Review
sub_title: 
read_time: 
date:
featured_image:
image-theme: dark no-image-styling
---

On the 8th of November, I attended the Sysconf Conference organised by the Sysdesign team. This was the best Sysconf yet in my opinion, although I barely had time to enjoy the talks in the last one as I was a [speaker](https://youtu.be/OH0CuqNpo_A?si=swXiRa8IdENZwA8g).

This time however, I had all the time to attend more talks, and had a blast. 

![Tweet about the conference](/media/sysconf-tweet.png)

I enjoyed some of the sessions so much that I decided to write a quick recap to crystallise my thoughts on each of them. 
Because the structure of the conference is two sessions happening at the same time, I unfortunately could not watch them all.

## The Sysdesign ethos

![Sysdesgn ethos](/media/sysconf-ethos.png)

This was [Ayo](https://x.com/_alternatewolf) talking about what SysDesign is and what they stand for. I only caught the tail end, but his talk was valuable beyond understanding what Sysconf/SysDesign is. We should all be learning from first principles, reading and making simple things to learn + grow.

One thing I've found very useful (and wish I learned and practiced earlier) is the power of compound effect. When aiming to learn/grow in any area, I'd typically wait until I had time to focus on the one thing, meaning I only grew in one area at a time. It also unfortunately meant that my growth in several long-term areas was hindered because I just never started.

But with slow, consistent growth e.g. committing to one hour of deep focus per day **no matter what**, I'm able to consistently create, learn and grow. You'd be surprised at how much you can achieve in just one week if you adopt this principle. Now I just need to learn how to take breaks (😅).

Finally, please READ. Read long books. Difficult books. Research papers. Blog posts. Read wide, and read consistently.

The full video is [on Youtube](https://youtu.be/EJsn4z77OYA?si=XcBukLWTBeV82pp4).

## Whisperer: An Elixir Based Multi Agent Framework

![Pelumi talking about Elixir](/media/sysconf-elixir.png)

In this talk, [Pelumi](https://x.com/Pelumi_SA) preached about Elixir and did a pretty good job of convincing us to try it out.
The main premise was that building multi-agent systems is already a common pattern in Elixir (and functional programming languages as a whole), making it relevant for building agents we want to in this LLM world. He also spoke a bit about common agentic workflow patterns that serve as a great foundation for designing agentic workflows. 

What was however interesting to me was the concept of an LLM for observability actions (MonitorLizard). I asked about hallucination and he gave a "no bullshit" answer, which I appreciated. While some agentic design patterns *try* to prevent hallucination, they are not crash-proof. This makes sense as a practical drawback, and can be solved using [durable execution](https://temporal.io/blog/what-is-durable-execution) frameworks.

You can find the full video [on Youtube](https://youtu.be/5KFaMKGNjTU?si=QWgNWde1_4qP0igw).

## Trustless Federated Learning at Edge Scale

![Paul talking about TFL](/media/sysconf-tfl.png)

Paul is a researcher that believes the models of the future should be trained on billions of independent devices. One drawback of the way models are trained today is privacy. What if we could have our devices contribute to anonymised learning and prevent big companies from harvesting our data for training purposes?

As is common with research, this was mostly theoretical. It provides a very useful thought experiment about the future of training (and maybe even inference). Full talk is on [here](https://youtu.be/mAptRTmmvYk?si=QmEzw08RhlwTb0lU).

## The AI’s Toolbox: Solving the Systems Challenges of a Multi-Tool Data Agent

![Zainab talking about AI toolbox](/media/sysconf-applied-ai.png)

[Zainab](https://x.com/Zeeskylaw) spoke about the systems you need to build around an LLM to make it reliable, secure and truly useful for an enterprise product. I really enjoy when people speak more about challenges and the thinking behind solutions. It was also not surprising how much MCP was a game-changer for the Decide team.

This talk was also a great example of how research is forever relevant. As a company, you can solve the most complex problems by having willingness to invest time in research. It seems obvious, but it's not often the reality because of stakeholder requirements, timelines etc. Zainab mentioned that she mostly does the research and hands over to other members of the team. A dedicated engineer is often more feasible for more in-depth asks like this.

Another interesting concept explored in this talk was Sandboxing for LLM output. They isolate all the LLM execution in a secure, containerised environment with resource limits and clean state. It reminds me of the [bulkhead pattern](https://medium.com/nerd-for-tech/bulkhead-pattern-distributed-design-pattern-c673d5e81523), which prevents failure in a system from affecting others.

They also use a self-correcting loop to provide resilience and a simple form of reinforcement learning for their LLMs. I was not totally convinced because LLMs can be sneaky. They have been known to "fix" tests by deleting them. But for simple errors, I think a loop with retry guards is sufficient. Ultimately needs more guardrails like human-in-the-loop, LLM-as-a-judge etc.

Watch the full talk on [Youtube](https://youtu.be/nFrvAM03OHg?si=4Tx1lMEFF4B6EtxS).

## How to Develop Intuition About AI Agents, or Introduction to Graph Theory

![Justin talk about AI agents](/media/sysconf-graph-theory.png)

- My favorite talk of the day
- Fundamentals of graph theory
- Why it is important
- Practical applications when reasoning about AI agents
- Interesting observation about workflows vs. agents: the difference being AGENCY. How it applies to what I've been thinking about for the past year.

## Dead Programs Tell Tales: A Peek at Coredumps
- Very good overview of coredumps and why they are useful
- Brave to do a live demo
- Debugging session was fruitful
- My extra thoughts about the sensitivity of coredumps and taking coredumps from a running process

## A Panel on Technical Leadership
- Main takeaways about excellence
- Ife implicitly saying "it's important to work for a great company"
- Some advice about promotions and how to be an excellent person to deserve one
- I'm curious about what more junior people learned from this talk

## Forget the 1 Billion Rows Challenge, Let’s Solve The I, Zombie Endless
- Great intro about the fundamentals of concurrency in Go
- Looks like a challenging problem solved with great fundamentals
- Other attendees seemed very tuned-in and impressed. I was distracted.


The talks I'm sad that I missed entirely (or most of):
- What Makes It Go Brrrrr? An Introduction to the Inner Workings of LLM Inference Engines by Habeeb Shopeju
- Networking Stalemates: An Insider View to CLOSE_WAIT Sockets by Emmanuel Bakare
- How We Handle Data Encryption at InfraRed by Allen Akinkunle

All the videos should be available on Youtube or somewhere else eventually, so I'll try to catch them then. I also spent very little time networking, so if you want to have a chat about anything, feel free to reach out! I spend a lot of time thinking about research, SRE, Youtube and machine-learning these days. Any of these topics is a great way to get my attention.

See you at Sysconf '26!