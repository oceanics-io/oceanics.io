---
title: Hybrid cluster
date: "2018-05-03T12:00:00.000Z"
description: "Tips for build a low-cost linux cluster for training events"
tags: ["iot", "linux", "nvidia", "distributed computing", "workshop"]
---

## Components

Networking commodity hardware to achieve higher performance is called a Beowulf cluster. **These instructions were created in 2017, and are out of date**.

The components available during training events includes single-board and system-on-a-chip machines.

| Description          | Vendor     | #    | Price | Address           |
| -------------------- | ---------- | ---- | ----- | ----------------- |
| Jetson TX2           | NVIDIA     | 1    | 299   | 192.168.001.105   |
| Raspberry Pi 3B      | Raspbian   | 4    | 60    | 192.168.001.100-4 |
| USB power, 10-port   | Sabrent    | 1    | 29    | n/a               |
| Micro USB cables, 3' | Sabrent    | 6    | 2     | n/a               |
| WL-520GU router      | ASUS       | 4    | 30    | 192.168.001.001   |
| Gigabit switch       | Netgear    | 1    | 50    | 192.168.001.138   |
| CAT5 cable           | Amazon     | 10   | 2     | n/a               |
| HDMI monitor, 7"     | SunFounder | 1    | 60    | n/a               |
| HDMI cable, 15'      | Amazon     | 1    | 10    | n/a               |
| Wireless keyboard    | Rii        | 1    | 28    | n/a               |

The Jetson TX2 has multiple CPUs, and a pretty serious GPU for accelerating jobs and video rendering. Raspberry Pi make [passable servers](https://www.copahost.com/blog/is-it-possible-to-run-a-web-server-in-a-raspberry-pi-3-as-a-dedicated-server/), even for [websites](https://www.readwrite.com/2014/06/27/raspberry-pi-web-server-website-hosting/).

## Network

The cluster is accessed by secure shell through a wireless local area network (WLAN). The [WL-520GU router](https://www.asus.com/Networking/WL520gU/HelpDesk_Manual/) is flashed with [Tomato firmware](http://www.wi-fiplanet.com/tutorials/article.php/3810281/How-to-Set-Tomato-Firmware-for-Wireless-Client-Modes.htm) to act as a managed switch. Another open source alternative is [DD-WRT](https://www.dd-wrt.com/wiki/index.php/Asus_TFTP_Flash).

The router can be [restored](https://chrishardie.com/2013/02/asus-router-firmware-windows-mac-linux/) if something goes wrong.

Navigating to IP address [192.168.1.1](https://192.168.1.1/basic-static.asp) with username and password "admin".

Here MAC addresses of various components can be assigned static IP addresses to make addressing easier. It can also do [name addressing with DNS](http://www.rhodesmill.org/brandon/2008/tomato-reverse-dns/).

The switch interface is then accessed by navigating to a common gateway interface (CGI) at [192.168.1.138](https://192.168.1.138/login.cgi). The default password is "password".

## Headless access

### RPi

The nodes will only be accessed as headless servers, so you may as well use the Raspbian Lite operating system. It is 1GB smaller, and doesn't come with bloatware. Download the image, and flash it to an SD card with Etcher. Drag and drop, super simple.

To enable `ssh` by default, mount the SD card (diskutil on macOS), then `touch /Volumes/boot/ssh`. Remove the disk,Connect the RPi to ethernet, insert the disk, and power on.

Whether the machine you need to configured is on the local network or Internet, use `ssh user@hostname` to log in the first time with a password. RPi come pre-configured with the user `pi` and password `raspberry`.

Find the IP address from the network admin interface, and ssh into it. If you are connecting one at a time, you can use the `raspberrypi.local` broadcast hostname. Or assign static IPs from the router.

Once you are in, run `sudo raspi-config` to enter setup mode, and do three things:

* change the password
* change the hostname
* configure wireless

For security you can disable WiFi and Bluetooth by editing `/boot/config.txt` to include `dtoverlay=pi3-disable-wifi` and `dtoverlay=pi3-disable-bt` (respectively). Save the file and `reboot`.

To enable wireless, comment out the line and `reboot`. If something is amiss, you can `systemctl enable dhcpcd.service` to start the DHCP client.

You can also overclock by editing this file (e.g. `arm_freq=800`).

If you opted for the full Raspbian experience, you can clear unnecessary packages:

```bash
git clone git://github.com/raspberrycoulis/remove-bloat.git
sudo chmod +x ./remove-bloat/remove-bloat.sh
sudo ./remove-bloat/remove-bloat.sh
```

### Digital Ocean

On Digital Ocean, log in as root using the supplied password with `ssh root@hostname`, and complete the prompts to set a new Unix password.

## Users and privilege

The first time you log in, also setup a new user account with `sudo useradd user`.

Use the `-M flag` to not add a home directory.

Then choose a strong password, and add it with `sudo passwd user`.

The user can be given `sudo` privileges with `gpasswd -a user sudo`.

## Generating keys

Next up is enabling password-less access. On your machine (the client) generate a key and copy it to the server.

```bash
ssh-keygen -t rsa
ssh-copy-id user@hostname
```

For greater security, you would normally disable root access by adding `PermitRootLogin no` to the `/etc/ssh/sshd_config` file, and restarting the service `sudo systemctl reload sshd.service`

## Package installation

The `apt-get` package manager gets registered distributions from public repositories and install them on your system.

Before installing anything new, update the registry and already installed software with,

```bash
sudo apt-get update
sudo apt-get upgrade
```

```bash
sudo apt-get install rsync build-essential manpages-dev gfortran nfs-common nfs-kernel-server vim openmpi-bin libopenmpi-dev openmpi-doc keychain nmap xinetd tftpd tftp libgdal-dev mono-runtime xsel xclip libxml2-dev libxslt-dev cython
```

## Raspberry Pi

### Network file storage

On the designated head node, you can create a root directory and make it mountable for other nodes in the cluster

```bash
mkdir /export
chown pi:pi /export/
nano /etc/fstab
```

Add `hostname:/export /export nfs defaults,rw,exec 0 0`, then edit `/etc/rc.local` to include the lines `sleep 5` and `mount -a`. Restart the service,

```bash
rpcbind start
update-rc.d rpcbind enable
```

### Remote boot image

Each device can also [boot from the same image](https://www.raspberrypi.org/documentation/hardware/raspberrypi/bootmodes/net_tutorial.md), over the network. This means only a single image needs to be configured.

To set up a second node to boot from the main node:

```bash
echo program_usb_boot_mode=1 | tee -a /boot/config.txt
reboot
mkdir -p /nfs/client1
rsync -xa --progress --exclude /nfs / /nfs/client1
```

### Manage remotely

[Remot3.it](https://www.remot3.it/) is a way to manage a lot of remote computers through a centralized web interface.

VNC can also be used, and is installed on the RPi by default, but is targeted toward desktop users.

Each computer will need to set up following these [directions](https://remot3it.zendesk.com/hc/en-us/articles/115006015367-Installing-the-remot3-it-weavedconnectd-daemon-on-your-Raspberry-Pi).
The release version can be displayed with `cat /etc/os-release`.

If you have things setup to be command line only, and need to get to the desktop GUI to configure connections, use `startx`.

Update references with `apt-get update`.

```bash
apt-get install weavedconnectd
weavedinstaller
```

Attach to your account, and create ssh services.