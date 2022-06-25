---
layout: post
title: Life is short, bash commands should be too
sub_title:
read_time: 1
date: July 2021
featured_image: https://opeonikute.dev/img/Background.png
synopsis: As a person that likes to maximise my output and minimise the input required, I don't like having to type and re-type all my bash commands repeatedly during the day.
---

As a person that likes to maximise my output and minimise the input required, I don't like having to type and re-type all my bash commands repeatedly during the day. Thankfully, I can create aliases on my machine that shorten them.

These are my favourite:

<script src="https://gist.github.com/OpeOnikute/0f359be9b019819a3cd1c989df6ec0fe.js"></script>

I especially like the functions because I can shorten long commands that have variable input. e.g. to start an ssm session, I just have to type:

```docker
run_ssm <instance-id> <region>
```

My second favourite thing is being able to combine two shortened commands. e.g.

```docker
# old - git push origin chore/do-some-amazing-thing-with-code
gpo `get_branch`
```

### How to use (OS X)

1. Open your `.bash_profile` file

    ```docker
    nano ~/.bash_profile
    ```

2. Paste any of the commands in and save it
3. Update the shell session with the new content

    ```docker
    source ~/.bash_profile
    ```

I will add more commands to the gist as the need for them comes along. Feel free to add your favourites to the gist too!