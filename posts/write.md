---
layout: post
title: Write++
sub_title: Article generation using pre-defined paths.
date: July 2016
synopsis: Inspired by Automated Insights, the aim of this project is to generate stories/articles based on user inputs.
---

![](/media/Screen_Shot_2019-05-17_at_17-b91e7ca1-7408-48c4-9d4d-34cfbe5febfc.22.51.png)

Inspired by [Automated Insights](https://automatedinsights.com/), the aim of this project is to generate stories/articles based on user inputs. A suitable approach for this would ideally be to train an AI to generate stories using Natural Language Generation (NLG), but this was ahead of my skillset (and still is) at the time. 

Users answer a couple of questions and an article of considerable length is generated. The article can then be downloaded as pdf or just copied from the browser. Each pre-defined path has different options at each stage leading to a tree-like algorithm. To add randomness to the result, the words used to depict different options in the result are chosen in a pseudo-random fashion.

### Issues/Considerations

Clearly this technique can't scale. The only way to grow and make stories seem more real would be to add more paths and word options manually i.e. content generation. This was the plan then, but clearly can't scale in hindsight.

Hopefully i'll be able to revisit this later in some machine-learning capacity. If you're reading this and have ideas on how this could work, please reach out.

### Stack/Dependencies

- Python 2.7
- Django 1.9.2
- PyPDF2
- reportlab
- HTML & CSS

### Paths

The scenario here is that there's a writer/journalist that needs to write a story. The base path is the type of story. There is then a critical path after which, the user then forms the main story by answering questions allocated to that path.

![](/media/Screen_Shot_2019-05-17_at_17-14568238-922d-4749-8a51-354bb895656b.37.09.png)

The types of stories were basically gotten by going through a couple of [Techcabal](https://techcabal.com/) stories and categorising them.

Base paths are:

- Events
    - Past Event
    - Opportunity
- News
    - Recent changes/developments
    - Gist
    - Good news
- Emails
    - Customer Service
    - Client
    - Friends and family
    - Job Acceptance
    - Job Interview

    ![](/media/flow_chart-c11f9b7c-f7d9-47b8-b60d-221672f61fcf.png)

### Ideas for Improvement

- The entire structure can be changed into a tree-type thing.
- You can add paths (nodes) to the tree, and defined the content options for that node (or train an AI).
- Paths won't be hardcoded, there would be a new data layer for storing paths.
- The most promising path for me is the email base path. The potential to give users hundreds of options for content (e.g. to send to clients) based on different scenarios is interesting.

### Summary

This project was an attempt to provide something to help anyone create stories at a blistering pace. Hopefully i'll be able to come back and make it better later.