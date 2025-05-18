---
layout: post
title: Something about AI in journalism
sub_title: TBD
read_time: 
date: May 2025
featured_image: TBD
image-theme: dark no-image-styling
---

I came into the tech industry in Nigeria at a fortunate time. There was a very strong sense of community, with a lot of early-phase builders working together. My fortune was not just because those builders existed though -- it was because platforms like TechCabal told their stories so we could learn about them.

*TODO* - create the conflict - why I had the idea.

Almost 10 years ago, I had an idea for a tool to generate stories for journalists based on strictly-defined prompts [^1]. After answering a couple of questions, the users would get a long-form story they could tweak at will. If that sounds familiar, it's because that has turned out to be Generative AI. 

A usable solution was not in my skillset at the time and the technology wasn't there. I also obviously had no way of knowing that it would manifest in this way, but it has been interesting to see technology finally catch up to a version of my vision. 

Also, nobody reached out:
> Hopefully i’ll be able to revisit this later in some machine-learning capacity. If you’re reading this and have ideas on how this could work, please reach out.

## *Insert title of next section*
Nowadays, I don't believe we should aim to have machines generate our stories. Journalism is about much more than generating content, and Large-Language Models (LLMs) cannot be fully trusted with both real-time and historical facts. BBC research found that major AI chatbots like ChatGPT and Gemini produced significant inaccuracies in over half of the news summaries that they tested [^2].

It should not be surprising that I now think the best use of such a tool would be as an assistant for research, fact-checking, and ideation. LLMs should not replace our fundamental ability to reason and create.

In the rest of this post, I'll discuss LLMs in the context of journalism. How can we use AI to write better stories in the real world?

### Training a Model

The foundation of any LLM is the underlying model. Most popular vendors have a fair amount of available models with different price points. There are also several open-source models of comparable quality. The models are trained on a vast amount of data, which helps them to generate and understand human language.

Because existing models are already so good at language, there should be no need for a journalist/newsroom to train one. Training is expensive and it's more cost-effective to use one of the existing models. The skill you should be honing is choosing the right model -- personally I prefer the OpenAI models for any sort of creative writing/ideation.

The existence of AI doesn't we should blindly apply it to everything, though. It's important to understand **why** we are applying LLMs to story-telling. It's not enough to use a shiny new technology just because it exists. It needs to provide exponential benefits over existing techniques to provide a return on investment.

The main power of AI agents is their ability to handle non-deterministic scenarios, where traditional approaches fall short. They can evaluate context, consider different scenarios and spot patterns [^4]. Instead of a sequential, checklist-based approach, an LLM can take in multiple pieces of information and apply a holistic approach to solving a complex problem.

The world of journalism is full of unstructured data that need to be broken down, understood and used to create compelling stories. With the right approach, we can use AI tools to write more insightful, creative and important stories.

With a good base model, we then need to provide real-time context for accurate results. Even though LLMs are trained on a vast database of information, it's very likely that they don't have local context, or that the training information is already out-of-date.

There are two primary ways to provide this context - Retrieval Augmented Generation (RAG) and more recently the Model Context Protocol (MCP).

#### Retrieval Augmented Generation (RAG)


#### Model Context Protocol (MCP)
- Also add a simple MCP server demo for a news site?
    - Another open-source project to spam

### Research question: how do you design an in-house information system to ensure news accuracy?

#### Real-time streaming

#### Human in-the-loop

#### Guardrails

### Auto-RAG

### Other Existing Tools

### Bonus: RAG demo (my website)
* Will need an open-source model so people can test 
* Or should I use Auto-RAG to promote Cloudflare and somehow embed it into the post?

### Footnotes
[^1]: [Original post with a confusing, non-indicative name](https://opeonikute.dev/posts/write)
[^2]: [AI chatbots unable to accurately summarise news, BBC finds](https://www.bbc.com/news/articles/c0m17d8827ko)
[^3]: [Open Router, Models](https://openrouter.ai/models)
[^4]: [A practical guide to building agents - Open AI](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf)

# Notes
- An LLM chat interface to talk to me based on the information in my blog (TODO: This is blocked on switching to a ).
    - Built on Temporal to automatically retry prompts
- Section about alternatives (NoteBookLM, etc) and how you can use them in this scenario
- Section about how a setup in a news agency would probably look like
- Send email to Techcabal editor ✅
    - Inform them about danger of open wordpress
    - Suggest a page on AI training policy for their website
    - Chance to read the draft, option to add the Techcabal information to the post?
- Add a bottom update to the write++ post, linking to the new one
- Send message to Skweird
- Rewrite this as a research paper and submit to a journal to get feedback