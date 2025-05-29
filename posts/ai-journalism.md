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

Almost 10 years ago, I had an idea for a tool to generate stories for journalists based on strictly-defined prompts [^1]. After answering a couple of questions, the user gets a long-form story they can tweak at will. If that sounds familiar, it's because it has turned out to be Generative AI. 

I did not pursue this idea any further because a usable solution was not in my skillset at the time, and the technology wasn't there. I also obviously had no way of knowing that it would manifest in this way. It has however been interesting to see technology finally catch up to a version of this idea. 

Also, nobody reached out:
> Hopefully i’ll be able to revisit this later in some machine-learning capacity. If you’re reading this and have ideas on how this could work, please reach out.

## *Insert title of next section*
Nowadays, I don't believe we should aim to have machines generate our stories. Journalism is about much more than generating content, and Large-Language Models (LLMs) cannot be fully trusted with both real-time and historical facts. BBC research recently found that popular AI tools like ChatGPT and Gemini produced significant inaccuracies in over half of the news summaries that they tested [^2].

It should not be surprising that I now think the best use of such a tool would be as an assistant for research, fact-checking, and ideation. **LLMs should not replace our fundamental ability to reason and create**.

So how can we use AI to write better stories in the real world?

### Training a Model

*TODO* LLM model arhcitecture image

The foundation of any LLM is the underlying model. Most popular vendors have a fair amount of available models with different price points. There are also several open-source models of comparable quality [^3]. The models are trained on a vast amount of data, which helps them to generate and understand human language.

Because existing models are already so good at human language, there should be no need for a journalist/newsroom to train their own models. Training is expensive and it's more cost-effective to use one of the existing models. The skill you should probably be honing is choosing the right model -- personally I prefer the OpenAI models for any sort of creative writing/ideation.

The existence of AI doesn't mean we should blindly apply it to everything, though. It's important to understand *why* we are applying LLMs to story-telling. It's not enough to use a shiny new technology just because it exists. It needs to provide exponential benefits over existing techniques to provide a return on investment.

The main power of AI agents is their ability to handle non-deterministic scenarios, where traditional approaches fall short. They can evaluate context, consider different scenarios and spot patterns [^4]. Instead of a sequential, checklist-based approach, an LLM can take in structured/un-structured information and apply a holistic approach to solving a complex problem.

The world of journalism is full of unstructured data that needs to be broken down, understood and used to create compelling stories. With the right approach, we can use AI tools to write more insightful, creative and important stories.

With a good base model, we then need to provide real-time context for accurate results. Even though LLMs are trained on a vast database of information, it's very likely that they don't have local context, or that the training information is already out-of-date.

There are two primary ways to provide this context - Retrieval Augmented Generation (RAG) and more recently the Model Context Protocol (MCP).

#### Retrieval Augmented Generation (RAG)

RAG is a method used to improve the output of an LLM by allowing having it reference external, authoritative knowledge before generating a response. With access to factual information, the model is less likely to "*hallucinate*" [^2]. This is especially important in a field like journalism where wrong information can spread like wildfire.

*TODO* - RAG Image but in the context of journalism content (websites, books, blogs, articles)

With RAG, an LLM assistant for journalism can first obtain relevant new information from websites, blogs, books, etc, for relevant, context-aware responses. Basic users of AI tools simply instruct the provider to "search the web", but it would be even more useful to implement in-house RAG based on internal proprietary data and in-house research.

A basic RAG system can be implemented in a sequence of steps:
1. **Ingest the data**:
    Compile the information into an accessible source like a filesystem or database. There are several options because tools like LangChain [can load several types of documents](https://python.langchain.com/docs/integrations/document_loaders/), from webpages and PDFs, to cloud providers.

2. **Pre-process the data**: 
    To solve for context-window limitations, basic RAG splits text data into chunks and indexed. These are then used to create vector embeddings and stored in a vector database. When providing context to the LLMs, the same mechanism is then used to do a similar search between the user query and the stored data [^5]. This helps the LLM find the most relevant information.

    ```
    from langchain.text_splitter import RecursiveCharacterTextSplitter

    def split_documents(self, documents):
        """Split documents into smaller chunks for better retrieval."""
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )
        chunks = text_splitter.split_documents(documents)
        print(f"Split into {len(chunks)} chunks")
        return chunks

    # Split documents into chunks 
    documents = self.load_documents()
    chunks = self.split_documents(documents)
    ```

3. **Store the data in a vector database**: 
    Production-grade systems should store in a proper database. But for test purposes, local storage is acceptable.

    ```
    from langchain_community.embeddings import HuggingFaceEmbeddings
    from langchain_chroma import Chroma
    
    persist_dir = "./vectorstore
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

    # Create and persist the vector store
    vector_store = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=persist_dir
    )
    ```

4. **Prompt augmentation and response generation**:
    When handling a query, the prompt provided to the LLM can then be enriched with the most relevant documents based on the basic semantic search.

    ```
    def setup_qa_chain(self, vector_store: Chroma) -> RetrievalQA:
        """Set up the question-answering chain"""
        prompt_template = """You are an expert on African technology companies and startups.
        Use the following articles to answer the question. If you don't know or aren't sure, say so.
        Always cite your sources using the provided URLs.

        Articles:
        {context}

        Question: {question}

        Answer with facts from the provided articles, citing sources using URLs when possible:"""
        
        PROMPT = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
        
        # Create the chain
        qa_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=vector_store.as_retriever(
                search_type="similarity",
                search_kwargs={"k": 3}
            ),
            chain_type_kwargs={
                "prompt": PROMPT,
                "verbose": True
            },
            return_source_documents=True
        )
        
        return qa_chain
    
    qa_chain = self.setup_qa_chain(vector_store)

    ## Answer a user's question
    result = qa_chain({"query": question})
    ```

I'd argue that while vector embeddings are useful and can help with making sense of a large corpus of unstructured data, it's possible to do RAG by simply just augmenting prompts. If context windows don't matter much and you have a limited set of specific data, you can just load the text into the prompt. That's also a form of RAG, albeit very basic.

Full sample code can be found on [Github](https://github.com/OpeOnikute/news-rag).

#### Model Context Protocol (MCP)
MCP is a more recent development from Anthropic. Their aim was to define an industry standard for providing LLMs access to external resources [^6]. Similar to RAG, this saves LLMs from their isolation from data.

One problem with RAG is the need to implement an LLM integration for every data source. Instead, developers can create an MCP server and **any** for any LLM to use. The data is exposed through MCP servers, and consumed by MCP clients (LLM applications).

We've already seen an explosion of MCP servers in the past couple of months, with several infrastructure companies also making it possible to host remote MCP servers. While the standard is nascent, it's simple to implement with little barrier-to-entry. The main concerns have been security, which has seen several proposals [^7].

*TODO: Make MCP server demo page for news site*

- Also add a simple MCP server demo for a news site?
    - Another open-source project to spam
    - A server that can get a link to a blog, read it using beautifulsoup and create the resources (pages/articles) to the LLM. But managing context windows is important
        - The MCP server can do things like get specific posts
            - Maybe a combination of RAG and MCP?
            - Implementing any specific text search to handle context windows only works if you can fetch the relevant content, which is ultimately RAG

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
[^5]: [Retrieval-Augmented Generation for Large Language Models: A Survey](https://arxiv.org/abs/2312.10997)
[^6]: [Introducing the Model Context Protocol](https://www.anthropic.com/news/model-context-protocol)
[^7]: [Authentication #64](https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/64)

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