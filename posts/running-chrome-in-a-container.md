---
layout: post
title: Running Chrome in a container
sub_title: 
date: June 2019
featured_image: 
image-theme: dark
---

I thought this wasn't gonna be possible because MacOS, but it blew my mind when it did so, blogpost. I found [this Dockerfile](https://github.com/jessfraz/dockerfiles/blob/master/chrome/beta/Dockerfile) from [Jess Frazelle](https://github.com/jessfraz)'s amazing repo that contains dockerfiles for a bunch of stuff. 

### Steps

1. **Ensure you have xhost running.** 

    XQuartz is a tool that allows you give access to your screen over a network. You can follow the instructions [here](https://sourabhbajaj.com/blog/2017/02/07/gui-applications-docker-mac/) to install XQuartz so you can do that.

2. **Get your machine IP.** 

    For this, you can run `IP=$(ifconfig en0 | grep inet | awk '$1=="inet" {print $2}')` and then `echo $IP`. I added it to the .sh file straight so doing this would be just to be sure.

3. **Add machine IP to xhost access.**

    Simply run `xhost + $IP` to do this.

4. **Download chrome.json file**

    You need the chrome.json file in your home directory, so run 
        
        cd $HOME && curl https://raw.githubusercontent.com/jfrazelle/dotfiles/master/etc/docker/seccomp/chrome.json -O ~/chrome.json 

    You can use `wget` too but I don't have that installed.

5. **Create run.sh file to run the build.** 

    I had to remove the `/dev/snd` and all other `dev` stuff (which would've provided access to the machine's sound etc) because MacOS doesn't allow you access to the hardware from shell, but you should be fine if you're on Ubuntu or something similar.

        IP=$(ifconfig en0 | grep inet | awk '$1=="inet" {print $2}')
        DISPLAY=$IP:0
        docker run -it \
            --net host \
            --cpuset-cpus 0 \
            --memory 512mb \
            -v /tmp/.X11-unix:/tmp/.X11-unix \
            -e DISPLAY=$DISPLAY \
            -v $HOME/Downloads:/home/chrome/Downloads \
            -v $HOME/.config/google-chrome/:/data \
            --security-opt seccomp=$HOME/chrome.json \
            -v /dev/shm:/dev/shm \
            --name chrome \
            jess/chrome:beta

6. **Run the script.**

You might see a bunch of errors like these, but they won't stop Chrome from *popping up like a hungry friend when you're cooking*.

![](/media/Screen_Shot_2019-05-31_at_18-3dc3bc3e-c0dd-4f85-947f-b1b14853fcc0.04.52.png)

If you get this to work too, feel free to shoutout. Shoutout to [Jess](https://twitter.com/jessfraz) also for her Dockerfiles repo.

Shalom.