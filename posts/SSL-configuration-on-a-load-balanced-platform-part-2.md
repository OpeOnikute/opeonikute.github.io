---
layout: post
title: SSL configuration on a load-balanced platform (Part 2)
sub_title: Cloudflare vs Route 53
read_time: 2
date: October 2019
synopsis: I saw that Amazon Route 53 also allows you install SSL on your servers with just a click. This is a slight but important improvement on the Cloudflare setup in which we had to download and install the certificates on the load balancer manually.
featured_image: https://opeonikute.dev/img/Background.png
---

In the [previous post](/posts/SSL-configuration-on-a-load-balanced-platform), I concluded that Cloudflare was a great option to provide SSL, and also comes with other great features such as caching, DDOS protection and more.

Recently, in [this post](https://medium.com/free-code-camp/distributed-systems-when-you-should-build-them-and-how-to-scale-a-step-by-step-guide-37e76a177218), I saw that [Amazon Route 53](https://aws.amazon.com/route53/) also allows you install SSL on your servers with just a click. This is a slight but important improvement on the Cloudflare setup in which we had to download and install the certificates on the load balancer manually. 

This post is intended to be a quick comparison between Route 53 and Cloudflare.

### Route 53

Amazon describes Route 53 as "a highly available and scalable cloud Domain Name System (DNS) web service". It essentially provides the DNS features you'd get when you buy a domain name from a DNS provider such as [Namecheap](http://namecheap.com) or [Greengeeks](http://greengeeks.com). 

The DNS features itself aren't really eye-catching. It's when you consider the benefit of inter-operability when you have an AWS service to provide an important layer of your web infrastructure: DNS. 

If we make the assumption that all your services are running on AWS, then it can become immediately apparent that these services each provide layers of your architecture and can be linked together, because that's one of the philosophies of AWS itself. So, you can install SSL on your EC2 instances using Route 53 with just a button-click etc. 

Some of Route 53's basic features (as seen on the website) are:

- Configure DNS health checks to route traffic to healthy endpoints.
- Independently monitor the health of your application and its endpoints.
- Manage traffic globally through a variety of routing types.
 
### Route 53 vs Cloudflare
As we understand what Route 53 is now, we can compare. Please note, this list is not intended to be comprehensive. It's just meant to give a basic overview of what features and advantages these providers have.


| Route 53 | Cloudflare | 
|-------|--------|
| Makes DNS integration with other AWS services seamless. | Not as great with AWS because external provider and manual integration. | 
| Can't find any out-of-the-box DDOS features. | Provides DDOS protection as a service. | 
| No CDN features (Although for that, you'd just use S3). | Can be used directly as a CDN. |
| Provides traffic and routing management. | Also provides traffic management with a service called Argo. |
:-----:|:-----:

### Conclusion

In the end, a few factors would determine your choice of provider. Factors such as:

- What cloud provider you're running on (which is determined by other factors too lol).
- Domain expertise
- Ease of use etc.

As long as you consider the factors that are most important to excellent service delivery to your users, you would be fine with the setup you eventually run with.

### Futher Reading

- [What is DNS?](https://www.cloudflare.com/learning/dns/what-is-dns/) by Cloudflare.
- [Route 53 resources](https://aws.amazon.com/route53/resources/).
- [Cloudflare docs](https://developers.cloudflare.com/docs/).