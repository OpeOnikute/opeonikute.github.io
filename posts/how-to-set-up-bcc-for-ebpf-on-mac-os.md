---
layout: post
title: How to set up BCC for eBPF on MacOS
sub_title: 
read_time: 4
date: January 2021
featured_image: https://opeonikute.dev/img/Background.png
---

I recently began exploring eBPF, starting with Brendan Gregg's BPF [Performance Tools: Linux System and Application Observability](https://search.safaribooksonline.com/book/operating-systems-and-server-administration/linux/9780136588870). One of the first requirements is to install [BCC](https://github.com/iovisor/bcc), and my first instinct was to use Docker [1]. 

Doing this with Docker proved to be difficult, and I could barely find any articles that talked about installing BCC on an OS X host. Most of the content assumes Ubuntu or some other Linux host.

I did find [one article](https://petermalmgren.com/docker-mac-bpf-perf/) by Peter Malmgren that explains how to do this using Docker, which was really helpful [2]. However, it fell short on running some BCC tools and I had to change some stuff to get it working. 

If you're only interested in doing the install, I suggest you skip to the "[Using Vagrant]()" section.

## Using Docker

eBPF tools such as BCC and bpftrace rely on Kernel headers which don't ship with the Docker Desktop for macOS VM. This means the regular install command (`apt-get install -y bpfcc-tools "linux-headers-$(uname -r)"`) won't work, because there are no linux-headers [3].

Hence I needed to find a way to compile and install them. The steps below are mostly the same as Peter's, except I added a start script and had to create volumes to `/lib/modules/$(uname -r)/source` and `/lib/modules/$(uname -r)/build`. In his case, symlinks were created automatically from `/usr/src/$(uname -r)` to those directories but that was not my reality.

You can get the files I mention below in [the ebf-playground repo](https://github.com/OpeOnikute/ebpf-playground/tree/master/tools/60-second-analysis/bcc-tools/docker).

- [Download and install](https://docs.docker.com/docker-for-mac/install/) Docker for Mac.
- Get the Linux kit version your Docker for Mac uses. Do this by spinning up an ubuntu container and noting the output. Mine is `4.9.125-linuxkit`.
```bash
$  docker run --rm -it ubuntu uname -r
```
- Clone the Linux kit to be mounted as a volume.
```bash
$  git clone --depth 1 --branch v<your-version-number> https://github.com/linuxkit/linux <your-version-number>-linuxkit
```
- Add the folder name (e.g. `4.9.125-linuxkit`) to the `.dockerignore` so it's not added to builds [4].
- Create a start script in `start.sh`. It is used to install the required kernel headers when the container starts.
```bash
$  nano start.sh
```
- Add the content below to the file. The script creates a `.config` file in the linuxkit download directory, adds config values to enable BPF tracing, and prepares the headers.
```bash
    #!/bin/bash

    # Configure the headers
    echo 'Configuring headers...'
    cd /usr/src/$(uname -r)

    # Create a ./.config file by using the default
    # symbol values from either arch/$ARCH/defconfig
    # or arch/$ARCH/configs/${PLATFORM}_defconfig,
    # depending on the architecture.
    make defconfig

    # Create module symlinks
    echo 'CONFIG_BPF=y' >> .config
    echo 'CONFIG_BPF_SYSCALL=y' >> .config
    echo 'CONFIG_BPF_JIT=y' >> .config
    echo 'CONFIG_HAVE_EBPF_JIT=y' >> .config
    echo 'CONFIG_BPF_EVENTS=y' >> .config
    echo 'CONFIG_FTRACE_SYSCALLS=y' >> .config
    echo 'CONFIG_KALLSYMS_ALL=y' >> .config

    # prepare headers
    echo 'Preparing headers...'
    make prepare

    # move into the bcc tools directory
    cd /usr/share/bcc/tools

    # Start a bash session
    bash
```
- Create a Dockerfile that uses the base bcc image. The resulting image from this file installs the tools needed to compile the Linux headers in the start script.
    ```docker
    FROM zlim/bcc

    RUN apt-get -y -qq update && apt-get -y -qq install gcc make bison flex bc libelf-dev vim

    COPY start.sh /usr/local/bin/start

    CMD ["start"]
    ```

    With these files, the directory structure should look like this.

    ```bash
    - .dockerignore
    - 4.9.125-linuxkit/
    - Dockerfile
    - start.sh
    ```
- In the same directory, build the image with the command below;
    ```bash
    $  docker build -t docker-bpf .
    ```
- Run the container, which starts up a bash session.
    ```bash
    $  docker run -it --rm
        --privileged 
        -v "$(pwd)/<your-version-number>-linuxkit:/lib/modules/<your-version-number>-linuxkit/source"
        -v "$(pwd)/<your-version-number>-linuxkit:/lib/modules/<your-version-number>-linuxkit/build"
        -v "$(pwd)/<your-version-number>-linuxkit:/usr/src/<your-version-number>-linuxkit"
        --workdir /usr/share/bcc/toolsdocker-bpf
        docker-bpf
    ```
- Test out one of the tools such as `execsnoop`.
    ```bash
    root@23234c4a3120:/usr/share/bcc/tools# ./execsnoop
    PCOMM            PID    PPID   RET ARGS
    ```

### Docker Problems

With this setup, most of the tools used for the [60-second analysis](https://github.com/OpeOnikute/ebpf-playground/tree/master/tools/60-second-analysis/bcc-tools) worked. However, it fell short on `ext4` commands. If you run `ext4slower`, it will fail with this error below;

```bash
ERROR: no ext4_file_operations in /proc/kallsyms. Exiting.
HINT: the kernel should be built with CONFIG_KALLSYMS_ALL.
```

I added the config `CONFIG_KALLSYMS_ALL` to `.config` in the start script, but this error kept happening. After a while and some research, I gave up and went with the Vagrant option.

Using Vagrant also makes sense because of all the hacking done to get Docker working. The best solutions are simple and sweet.

## Using Vagrant

Vagrant is a tool for building and managing virtual machine environments in a single workflow. The difference is that the kernels in the Vagrant environments don't use LinuxKit, meaning we can install bcc normally (`apt-get install -y bpfcc-tools "linux-headers-$(uname -r)`) without compiling headers and changing configs.

This is my recommended approach, as it is easier to get up and running.

- Install [Vagrant](https://www.vagrantup.com/downloads) and [Virtualbox](https://www.virtualbox.org/wiki/Downloads).
- Clone the [vagrant-bcctools](https://github.com/OpeOnikute/vagrant-bcctools) repo and start a terminal session in the directory.
    ```bash
    $  git clone https://github.com/OpeOnikute/vagrant-bcctools.git && cd vagrant-bcctools
    ```

- Set up the Vagrant session. This creates the Ubuntu environment and installs bcc using the script in `./scripts/install-bcc.sh`.
    ```bash
    $  make setup
    ```

- SSH into the Vagrant environment.
    ```bash
    $  vagrant ssh
    ```

- Test out a sample tool. The tools are installed in `/sbin` (`/usr/sbin` in Ubuntu 18.04) with a -bpfcc extension.
    ```bash
    sudo /usr/sbin/execsnoop-bpfcc 

    # or

    sudo execsnoop-bpfcc
    ```

### Next Steps

When testing these tools, there needs to be some activity on the Vagrant environment such as `open(2)` syscalls and new processes being executed, which I can trace with `opensnoop` and `execsnoop` respectively.

I'm thinking about running an Nginx server and simulating load so there is activity that can be traced. Before doing that, I will need to understand how Nginx interacts with the system to know what sort of calls to expect.

### Notes

[1] Whenever I test out new tools I like to use Docker containers because they are reusable and won't require installing potentially bulky software on my system.

[2] His article explains the traits of Docker for Mac that affect the way BCC can be installed, so I suggest you take a look if you're curious. Thanks, Peter!

[3] If you try, you get an error similar to the one below;

```bash
bash: linux-headers-4.9.125-linuxkit: command not found
```

[4] Since it's heavy (1GB or so), it's wise not to add it to the build. We are ensuring we only have to download it once and make it available in the container using volumes.