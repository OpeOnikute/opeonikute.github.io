---
layout: post
title: Tweet Categories
sub_title: A possible solution to the dedicated accounts problem.
date: November 2020
synopsis: Twitter users have a common problem, in which they only follow another user because of their tweets about a particular topic, and end up having to view other tweets that they aren't interested in.
featured_image: https://opeonikute.dev/media/twitter_timeline_push.png
image-theme: full-image
---

## Abena, why do you follow me?

A common challenge Twitter users have is that people follow them to see tweets about specific stuff, but end up getting 10% of that content and 90% of stuff they aren't interested in. This is because beyond talking about tech stuff occasionally, Twitter also acts as many other things - a social hub, diary etc. 

This makes it difficult for people that followed because they want to see a specific kind of content from the tweeter (i couldn't find a better word, sorry). 

> I don't like when Football Twitter takes over.

This is the where the Dedicated Accounts Problem (DAP) comes in. To work around this, people have mostly created different Twitter accounts with specific content. e.g. ope_dev, ope__o, ope__pandas etc. Managing this can get tiring pretty quick.

The purpose of this post is to propose a solution to DAP - tweet categories.

## Tweet Categories

Think of tweet categories as part of the metadata that is already attached to a tweet, like its location and timestamp. New and existing users decide what categories their tweets fall under based on their top 5 common interests e.g. soccer, tech, beauty, food, women. There's also a default category (common to all users) for generic tweets called misc.

The core features are:

- Whenever someone tweets, he/she can select the category it falls under before sending it out. If none is selected, the default category is used.
- Followers can decide what sort of content they want to see from that individual. Before you follow a person, you select what categories you want to see e.g. just tech. You can change this any time.
- A public list can be automatically created when you create a category. Followers can look through that category's tweets like a timeline of all your thoughts on the topic from time.
- Seasonal categories for topics that are only prevalent during a specific time period. e.g. The Super Bowl, Big Brother. They will be defined by Twitter and users can mute those categories without going to individual profiles to do so.
- Automatic categorisation using hashtags, trends and maybe some [NLP](https://en.wikipedia.org/wiki/Natural_language_processing). Tweets can be automatically placed in a category. Will be especially useful for implementing seasonal categories.

## Build am if e easy

This section tries to think through some of the engineering problems that could be encountered when building this, and possible solutions. For example, since Twitter already has topics, can that feature can be re-factored or inherited to cater to this purpose?

1. **How do Twitter topics work, and how can the attributes be extended to match this?**

    Twitter manually determines the topics - starting with about 300 subjects across gaming, entertainment etc. They are an attempt by Twitter to nail down intermittent users that are more interested in following topics than they are in following users (think Reddit users).

    Since the topics are statically-generated values, there's not much to draw from there. However, trends come to mind. If Twitter can determine that your tweet is part of an on-going trend, it can suggest that it be placed under that seasonal category.

2. **What happens when someone deletes a category?**
There are three options for this.
    - It could be similar to deleting Spotify playlists [1]. Previous tweets that belong to that category are retained and remain on the list.
    - You can also choose to delete all tweets that belong to that category.
    - You can add them to a new category. Useful for if you want to change a category name.
3. **Won't this make it harder to generate tweets?**

    It presents a fresh engineering challenge that can be solved. The algorithm for serving tweets to users can be tweaked in a way that's not resource-intensive. Since Twitter uses either a pull or push-based system to serve tweets [2], we can look at the two scenarios:

    - Pull-based - When pulling from the global collection of tweets, add an extra filter for the categories the user has de-selected, so those tweets are not pulled. Twitter already filters out muted and blocked users so it's an extra step. Whatever overhead can be accounted for and the query tweaked.
    - Push-based - Before the tweet is "pushed" using the fanout service to the user's home timeline cache, the social graph service [3] can filter out users that have de-selected the category.
        ![Twitter timeline push](/media/twitter_timeline_push.png)

4. **Can categories be spammed with wrong tweets like people do with hashtags e.g can I do "I like my women BBW" and put it in a category called "Software Engineering".**

    Very much so, but they determine their categories themselves. If they aren’t tweeting according to them, it’s up to their followers to decide if they are really worth following.

## Summary

Twitter users have a common problem, in which they only follow another user because of their tweets about a particular topic e.g. software, and end up having to view other tweets that they aren't interested in.

This talks about a system in which users can decide what they want to see on their timeline from a specific person. It would take both adoption from users and some extra steps to the Twitter timeline algorithm.

## Notes

1. When a Spotify playlist is deleted, the user "unfollows" and it remains available for other users.
2. [Thread by Chidi on how the Twitter timeline serves tweets](https://twitter.com/ChidiWilliams__/status/1332675824131190785).
3. [Twitter timelines @Scale](https://youtu.be/1LcyCbly73U?t=212).
4. [Infrastructure Behind Twitter (Scale)](https://blog.twitter.com/engineering/en_us/topics/infrastructure/2017/the-infrastructure-behind-twitter-scale.html).

Thanks to [Ife](https://twitter.com/IfeSobog), [Moyo](https://twitter.com/olujedai) and [Chidi](https://twitter.com/ChidiWilliams__) for the questions and suggestions.