---
layout: post
title: How to use perf on MacOS for code profiling
sub_title:
read_time: 2
date: May 2021
updated: Jul 2022
featured_image: https://opeonikute.dev/img/Background.png
---

This is a quick post that details how to run perf (also known as perf_events) on an OSX machine. Perf is a powerful Linux tool - it can instrument CPU performance and is capable of lightweight profiling. You can get more context about what perf can do [here](http://www.brendangregg.com/perf.html).

It is usually included in the Linux kernel, but there's no way install it on a Mac. This is a pain because you'd usually want to profile (and generate flame-graphs [^1]) for your applications locally and not on a prod/staging server because that has a suitable Linux distribution running.

On OSX you can use Docker containers to create such an environment and install perf by downloading the Linux kernel source and building perf manually.

**TLDR;** If you need a quick solution, try using the Nginx-based Docker image with instructions [here](https://github.com/OpeOnikute/perf-tools). The rest of the post just describes how to create a Node-based image and install perf.

The steps for creating the image are:

1. Create a Dockerfile with the base image of the distribution you intend to use. e.g. if you're targeting a Node app for profiling, you can use a Node base image which is debian-based.

    ```docker
    FROM node:14.17.0

    WORKDIR /usr/src/app
    ```

2. In the same Dockerfile, download the linux-tools source for the Linux version you are using [^2], and compile using make.

    ```docker

    RUN LINUX_NUM=$(uname -r | cut -d'.' -f1) && \
        # Gets the Linux version and strips out the 'linuxkit' part
        LINUX_VER=$(uname -r | cut -d'.' -f1-3 | cut -d'-' -f1) && \
        # Downloads compressed linux-tools for the version
        wget "https://cdn.kernel.org/pub/linux/kernel/v$LINUX_NUM.x/linux-$LINUX_VER.tar.xz" && \
        tar -xf "./linux-$LINUX_VER.tar.xz" && cd "linux-$LINUX_VER/tools/perf/" && \ 
        # Install libelf-dev or `perf probe` gets disabled
        apt-get update && apt -y install python-dev flex bison ocaml \ 
            libelf-dev libdw-dev systemtap-sdt-dev libunwind-dev \
            libperl-dev binutils-dev libzstd-dev libcap-dev \
            libnuma-dev libbabeltrace-dev && \
        make -C . && make install && \
        # copy perf into the executable path. Works as long as "/usr/local/bin"
        # is in the $PATH variable
        cp perf /usr/local/bin
    ```

3. Since our example is a Node app, we'll do the normal Node things like install packages and copy in source code to the image.

    ```docker
    COPY package*.json ./

    RUN npm install

    COPY app.js ./

    EXPOSE 3000

    # Start Node with debug symbols available. (Don't do that in production)
    ENTRYPOINT ["node", "--perf-basic-prof", "app.js"]
    ```

4. Build the image.

    ```docker
    docker build -t example-perf .
    ```

5. Run the container in privileged mode and open a bash shell in it.

    ```docker
    docker run --name example-perf --privileged -d example-perf
    docker container exec -it example-perf bash
    ```

6. Use perf in it's installed directory.

    ```docker
    # Enables you run perf without some kernel errors
    echo 0 > /proc/sys/kernel/kptr_restrict

    # If perf isn't in your executable path, use it from the directory
    cd ./linux-$(uname -r | cut -d'.' -f1-3 | cut -d'-' -f1)/tools/perf
    ./perf record -F99 -p "$(pgrep -n node)" -g -- sleep 30

    # Else, use it directly
    perf record -F99 -p "$(pgrep -n node)" -g -- sleep 30
    ```

As a bonus, you can copy perf to the `/bin` directory so you can access it anywhere, but I haven't tested that.

If you don't like/use Docker, you can try replicating this in Vagrant. With Vagrant I don't think you'd even need to download the source, because Linux headers are available. The `apt-get` command should suffice.

You can use [this repository](https://github.com/OpeOnikute/vagrant-bcctools) to get started with creating a Vagrant environment.

### Notes

[^1]: I talk about generating flame-graphs for Node applications in a post coming out soon.

[^2]: In a sane world, you should be able to install perf in the container using `apt-get install linux-tools-common linux-tools-generic linux-tools-$(uname -r)` and be done with it, but you can't because there are no Linux headers in Docker for Mac. I discussed this briefly in [this post](https://opeonikute.dev/posts/how-to-set-up-bcc-for-ebpf-on-mac-os). You end up with errors like this:
    ```docker
    E: Unable to locate package linux-tools-common
    E: Unable to locate package linux-tools-generic
    E: Unable to locate package linux-tools-4.9.125-linuxkit
    E: Couldn't find any package by glob 'linux-tools-4.9.125-linuxkit'
    E: Couldn't find any package by regex 'linux-tools-4.9.125-linuxkit'
    ```