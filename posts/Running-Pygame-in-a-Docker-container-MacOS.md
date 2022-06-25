---
layout: post
title: Running Pygame in a Docker container (MacOS)
sub_title: 
read_time: 3
date: August 2019
featured_image: https://opeonikute.dev//media/Screen_Shot_2019-05-31_at_09-548f6c6f-d375-44d3-b794-845e5e2a0041.23.51.png
image-theme: dark
---

When I was going through the Ejo repo again, i tried to *dockerize* the application like I normally do. But since the app is running Pygame, it presented a different sort of challenge than *dockerizing* a web server app (WSA), since it’s essentially a GUI application.

I decided to give it a try since early Google results seemed like it was hard, but possible. Turns out I should’ve just stuck to providing a virtual env config and moving on, but the learning experience was worth it.

My machine is a MacBook running Darwin.

### XQuartz

If you are running a *WSA*, all you need to do is expose ports to your host machine. But for a GUI app, you need to give the container access to your video graphics driver so it can, in simple terms, share it’s screen with the host.

To do this on my machine, I had to install XQuartz and set the `DISPLAY` environment variable, which is <host-ip:0>.  [This post](https://sourabhbajaj.com/blog/2017/02/07/gui-applications-docker-mac/) contains more in-depth explanation of how to get this done on a Mac.

Since you can't set host directories for volumes in a Dockerfile, I had to use a compose file.

    version: '3'
    
    services:
      app:
        build: .
        environment:
          DISPLAY: 172.20.10.13:0
        volumes:
          - /tmp/.X11-unix:/tmp/.X11-unix
          - .:/usr/src/app

### Attempt #1 - Python27 install

    FROM python:2.7
    
    RUN apt-get update && apt-get install -y python-dev python-setuptools
    
    WORKDIR /usr/src/app
    COPY requirements.txt ./
    RUN pip install -r requirements.txt
    COPY . .
    
    CMD ["python", "main.py"]

The base image for Python 2.7 is a debian image, so we know we're working with a Linux distribution. The result? Doesn’t work at all because Pygame has no video driver set. 

![](/media/Screen_Shot_2019-05-31_at_09-548f6c6f-d375-44d3-b794-845e5e2a0041.23.51.png)

### Attempt #2 - Python 27 install with x11 as Pygame driver

I found [this example](http://www.karoltomala.com/blog/?p=679), that tries explicitly set the video driver for Pygame, which in our case should be x11 since we're trying to use xhost. 

    drivers = ['x11', 'directfb', 'fbcon', 'svgalib']
    
    found = False
    for driver in drivers:
        if not os.getenv('SDL_VIDEODRIVER'):
            os.environ['SDL_VIDEODRIVER'] = driver
        try:
            pygame.display.init()
        except pygame.error:
            print 'Driver: {0} failed.'.format(driver)
            continue
        found = True
        break
    
    if not found:
       raise Exception('No suitable video driver found!')

Doesn't work because Pygame doesn’t recognise x11 or any of the others as a video driver. Starting to think this was an issue with the version of Python I was using, I decided to try Python3.

### Attempt #3 - Python3 install with x11 Pygame driver

Cant get python 3 to work with Pygame 1.9.2. Had to upgrade to Pygame 1.9.5 to get the install to work.

After install, Pygame still complains that no video driver is found.

### Attempt #4 - Python3 install with x11 Pygame driver and libsdl driver

I found all these libsdl packages in a docker file for another app supposedly running Pygame in a container and added them to the python3 install. 

    FROM python:3
    
    WORKDIR /usr/src/app
    
    RUN apt-get update && apt-get install -y \
        python3-dev -y \ 
        python3-setuptools -y \ 
        python3-numpy -y \ 
        python3-opengl -y  \ 
        libsdl-image1.2-dev -y \ 
        libsdl-mixer1.2-dev -y \ 
        libsdl-ttf2.0-dev -y \ 
        libsmpeg-dev -y \ 
        libsdl1.2-dev -y \ 
        libportmidi-dev -y \ 
        libswscale-dev -y \ 
        libavformat-dev -y \ 
        libavcodec-dev -y \ 
        libtiff5-dev -y \ 
        libx11-6 -y \ 
        libx11-dev -y \ 
        fluid-soundfont-gm -y \ 
        timgm6mb-soundfont -y \ 
        xfonts-base -y \ 
        xfonts-100dpi -y \ 
        xfonts-75dpi -y \ 
        xfonts-cyrillic -y \ 
        fontconfig -y \ 
        fonts-freefont-ttf -y \ 
        libfreetype6-dev -y 
    
    COPY requirements.txt .
    RUN pip install -r requirements.txt
    COPY . .
    
    CMD ["python", "main.py"]

Result? Same error.

### Conclusion? Don't run in a container.

The methods above should work on a Unix distribution like Ubuntu, but because of the limitations MacOS places on accessing hardware drivers, it's best to just install Python on your OSX machine and install pygame. 

It's as simple as `pip install pygame` and `python main.py` or what your file name is.

**Please note:**

- The issue with running Pygame in a container on MacOS are Pygame specific. You can display x11 windows from containers on MacOS. [My post on running Chrome in a container](https://opeonikute.dev/posts/running-chrome-in-a-container) has a great example of this.
- If you read this and decide to give it a try and get it to work, please shoot me an email at [opeyemionikute@yahoo.com](mailto:opeyemionikute@yahoo.com).