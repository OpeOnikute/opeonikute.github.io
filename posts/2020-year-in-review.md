---
layout: post
title: 2020 - Year in Review
sub_title:
read_time: 5
date: Dec 2020
featured_image: https://opeonikute.dev/img/Background.png
image-theme: dark
---

I didn’t want to write this. Maybe I didn’t want to share because it feels like an attempt to impress people with the year’s accomplishments, to which:

1. Is anything I’ve done even impressive?
2. Impressing people is a vanity metric [1], that I shouldn't let influence my decisions.

Nonetheless, it’s important to take stock and have a reference point for the future. It's also important to share these things because one person might get inspired by the little you do, and do even greater.

My life changed a lot this year and overall I’m grateful for all the progress made.

## Work

I transitioned from a previous full-stack role to a DevOps role at [Paystack](http://paystack.com/) at the beginning of the year, and it has been amazing so far. The best thing about working at Paystack is the culture and then the people. Everywhere you turn, there’s someone who is a genius at what they do.

My reasons for the transition were achieved in just 6 months and then my expectations kept getting exceeded. I also managed to get promoted within my first 3 months which was cool 🎉.

My role is a blend of Observability & DevOps, which means I get to spend a lot of time looking under the hood to understand how complex systems work, building tools to automate that and sharing the information with everyone (evangelism).

## Observability

I've spent a lot of time grokking problems around observability and the more I discover, the more I enjoy solving them. It's a constant learning journey and it's nice to see how far I've come in such little time.

**Observability is tooling and techniques that improve our understanding of how complex systems work.** It is important as a company scales because understanding+visibility of a system's behaviour is needed before you can solve issues e.g. if a problem is caused by a problematic patch that causes a Linux package to look for files in the wrong directory, you need tooling to figure that out in reasonable time.

If you don't have that visibility, your mean time to detect and resolve issues is longer, and your customers will have a bad experience leading to a loss in revenue.

This year I've grokked Distributed Tracing, APM, Network (TCP, UDP, DNS), System (CPU, Memory, I/O etc), Dashboarding, Synthetics etc. There is still so much more to discover in [all the layers](https://www.cloudflare.com/en-gb/learning/ddos/glossary/open-systems-interconnection-model-osi/).

If you're interested in learning more about what observability is, [Cory Watson's blog](http://onemogin.com/observability/) has a lot of great resources.

## Projects

I built some fun, nice-to-have projects this year. [Olojo Ibi](https://olojo-ibi.xyz/), a fun game for birthday celebrants to make them more special [2]. [Daily Panda](https://daily-panda.site/), a very on-brand daily magazine for my spirit animal. Plus spent some time re-writing the backend for [Safety Alert](http://safety-alert.herokuapp.com/index) [3].

I also contributed to some other open-source projects like [the API for Paystack Music](https://github.com/PaystackHQ/paystack-music-api), [Node API starter](https://github.com/opeonikute/node-api-starter) etc.

## Books

I'm not much of a recreational reader anymore. I mostly read technical books to learn, and most of my reading was at the beginning of the year and towards the end. At the beginning of the year, I read [Practical AWS Networking](https://www.amazon.com/Practical-AWS-Networking-networks-Balancing-ebook/dp/B076WX4XNH?tag=techblast0f-20) (in prep for my DevOps transition), completed [Distributed Systems Design](https://www.amazon.com/Designing-Distributed-Systems-Patterns-Paradigms/dp/1491983647?tag=harshabalani-20) and [Site Reliability Engineering: How Google Runs Production Systems](https://www.amazon.com/Site-Reliability-Engineering-Production-Systems/dp/149192912X?tag=techblast0f-20).

Towards the end i've been reading two books: 

1. [High Performance Browser Networking](https://hpbn.co/) - a really great (online) book for understanding how the Application (HTTP) and Transport (TCP/IP) layers behave, and how performance is a feature. 
2. [BPF Performance Tools: Linux System and Application Observability](https://search.safaribooksonline.com/book/operating-systems-and-server-administration/linux/9780136588870) [4].

Overall, I didn't crack 15% of [the number of books I wanted to read](https://www.notion.so/2020-Reading-List-c4ba241c664140aa9c030f1ca4b67cef) but it's within reason. I selected most of them because they seemed interesting. In the future, the books I'm reading will be tuned to fit my specific learning paths.

## Misc

This section contains stuff that don't have enough content to get a whole section. 

**Gym-gym-gymnastics:** I started working out properly towards the end of the year. I've gained about 3kg so far (I had been the same weight for almost 5 years).

Writing: I wrote [three articles this year](https://opeonikute.dev/posts). I plan to write more whenever I discover any technical knowledge that is underrepresented online.

**Music**: I listened to a lot of great music this year [5].

**Nigeria**: I didn't think the country could show in even clearer terms that it's just a blood-sucking demon, but it did [6]. 

**Relationship**: Started the year single, ending it single. 

**Friendships**: I've met so many great people this year, and I'm really grateful for every one.

## The Future

**Observability**: Next year I'm going to spend a lot of time still thinking about observability. I also plan to get a better understanding of how Linux systems work, to help with observing them. Depending on how my eBPF exploration goes, I might learn how to write C properly.

**Templice**: I also plan to finish building and test a new product at the beginning of the year. Excited about the people I'm working with on this one. More on that later.

**Evangelism**: I need to get better at evangelism of the tooling I build. I've learnt that a lot of it has to do with being intentional about sharing the information in a way that gets people excited about it.

**Efficiency**: I will spend some time thinking about and implementing some new ways to be more efficient at the work I do. Automation, templates etc.

Thanks to [Chidi](https://twitter.com/ChidiWilliams__) for inspiring me to write this down in more ways than one.

## Notes

[1] It matters little on the level of the work you do. If it does, it means you can lose motivation to do good work if people don’t seem impressed with it.

[2] It has already done so for a bunch of people and I’m glad they enjoyed the experience. 

[3] The plan was to revamp the entire thing and make it more useful, but the bandwidth wasn't available on most fronts. The good news is, some other brilliant devs have built a part of what was our vision. The name is [Aabo](https://getaabo.com/) and a detailed article explaining it is [here](https://restofworld.org/2020/end-sars-nigeria-apps/).

[4] I recently encountered eBPF, a tool that is useful for getting much more information about the behaviour of Linux systems. The tools built on top of it help in diagnosing problems and opportunities to optimise performance.

[5] My top songs this year - [https://open.spotify.com/playlist/37i9dQZF1EM0px5fqk7VWJ](https://open.spotify.com/playlist/37i9dQZF1EM0px5fqk7VWJ). 

[6] We asked our government to stop the police from killing us, and they responded with even more killing. More information about the End SARS protest on the [Wiki Page](https://en.wikipedia.org/wiki/End_SARS).