---
layout: post
title: SSL configuration on a load-balanced platform
sub_title: Options and caveats.
date: August 2019
synopsis: Most web applications start out as monoliths, where all the components live on the same server instance. When the time comes to scale, the go-to architecture is usually multiple server instances behind a load-balancer.
featured_image: https://opeonikute.dev//media/Scale_diagrams_(1)-bfbd1fc4-acc3-4415-a2cd-c78a6edd9224.png
---

Most web applications start out as monoliths, where all the components live on the same server instance, like so:

![](/media/Scale_diagrams_(1)-bfbd1fc4-acc3-4415-a2cd-c78a6edd9224.png)

When the time comes to scale, the go-to architecture is usually multiple server instances behind a load-balancer, like so:

![](/media/Scale_diagrams_(1)-c7c0e6e4-0c2d-408a-befa-ddb6d78da262.png)

Scaling up this way presents challenges in the way your application is written. For example:

- You have an image-storage component, and so far you've been storing images on the single server, you'd have to extract that to a central storage location like Cloudinary.
- You also have application logs that are stored on that server etc.

It also presents challenges in terms of routing, DNS configs and SSL provision. The purpose of this post is to discuss options for a simple SSL configuration for a load-balanced setup.

The primary purpose of SSL is to secure requests between two systems, preventing attacks such as man-in-the-middle, cross-site scripting etc.  

Depending on the architecture, requests between the load balancer and app servers are handled using private IPs, which means the security of the requests between them is dependent on your cloud provider/datacenter. 

### #1 - Install the SSL Cert and Private Key on the Load Balancer (LB)

![](/media/Scale_diagrams_(2)-6d11ace9-58f7-49ff-bdb9-e48b82bdbc8d.png)

Using a certificate authority like [Lets Encrypt](https://letsencrypt.org/getting-started/), you can install both on your LB and handle external SSL requests on port 443. You can also choose to handle normal http requests on port 80.

Whilst this might be a simple solution and is straightforward to understand, some gotchas that can occur are:

1. If you can't SSH into your load balancer like on Linode, you'd have to install on a different machine like your local computer and then paste the values in the LB config.
2. You are responsible for renewing the certificates, which might be on that different machine.
3. Having your LB handle every SSL handshake might lead to issues when you start to receive lots of traffic.

### #2 - Configure the LB to pass-through requests as TCP

![](/media/Scale_diagrams_(3)-3c9b2889-13eb-4812-b29d-7977bbdf1642.png)

Using this option, you can have your LB forward requests to port 443 as TCP, allowing you to then handle SSL on your app servers. Again, caveats:

1. Passing through requests as TCP, you might not be able to get the actual origin IP address when it gets to your application server. Using HTTP, an X-FORWARDED-FOR header is usually passed. 
2. Provisioning SSL certificates for each app server you spin up can be a nightmare. You can write a config management script (e.g. Ansible) to do this, but if you can't get that done it'll become a major headache.

    *If you have an Ansible/Terraform script to do this, please send me a link!*

### #3 - Cloudflare SSL

![](/media/Scale_diagrams_(5)-1d08d356-32a8-4632-a5e6-4caeed38639b.png)

Right now, this is my favourite option. In this, you take advantage [Cloudflare](https://cloudflare.com)'s SSL features and let them handle the main SSL hand-shake and renewal of certificates for you.

The steps:

1. Sign up and change your DNS nameservers to Cloudflare's in your DNS provider's (e.g Namecheap) settings.
2. Wait the normal 24-48 hours for changes to propagate. By default, cloudflare should generate a certificate and handle SSL requests to your domain. This might take up to 24 hours too.
3. To ensure requests between Cloudflare and the LB are secure, go to `Dashboard → Crypto → SSL` and select Full SSL. 
4. Create an Origin Certificate. The origin certificate is what your LB would serve on port 443 to ensure requests are actually from Cloudflare. Go to `Dashboard → Crypto → Create Origin Certificate`. Copy this certificate and serve them in your LB config. If you're using Terraform, you can easily add the path to the certificate in your main yml.

Few caveats:

1. The free certificate provided is Cloudflare SSL. Depending on your needs you might upgrade your plan to get a dedicated SSL.
2. Having cloudflare and an LB between your servers and the world increase latency. 

### Conclusion

Overall, i'm comfortable with option 3 and looking forward to exploring how to handle this when you're using orchestration tools like Swarm or Kubernetes. How much would be different? If you know a lot about this, feel free to contact me.

Also, this post has used [Linode](https://linode.com) as the sample cloud provider. Of course some parameters would be different if you're using AWS and using ELB or another provider. 

If you noticed that I didnt speak about securing requests to your database server, my assumption here is that you're using a database provider like MongoDB Atlas and making HTTPS requests.

Some reference articles I looked through when trying to figure this out are:

1. [Linode NodeBalancer TCP Pass Through](https://www.linode.com/community/questions/366/how-do-i-configure-my-nodebalancer-to-pass-through-ssl-connections-to-the-back-e)
2. [Linode NodeBalancer SSL Configuration](https://www.linode.com/docs/platform/nodebalancer/nodebalancer-ssl-configuration/)
3. [Let's Encrypt HTTPS + Linode NodeBalancer](https://deliciousbrains.com/lets-encrypt-https-linode-nodebalancer/)
4. [This great post on SSL handshakes ](https://medium.com/@kasunpdh/ssl-handshake-explained-4dabb87cdce)

Shalom.