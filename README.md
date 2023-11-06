# Packet Panic

<p align="center">A high performance network proxy written in <b>Go</b> that emulates bad network conditions to verify the fault-tolerance of distributed systems in adverse conditions.

Capable of transparently and bidirectionally intercepting 15+ Gb/s of layer 3 packets using the TUN kernel virtual interface.

</p>
  
## Table of Contents

<!--toc:start-->

- [How it works](#how-it-works)
  - [Overview](#overview)
  - [Packet interception](#packet-interception)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)

<!--toc:end-->

## How It Works

### Overview

- Coroutines are dispatched to handle requests concurrently, apply packet loss/corruption/delay, forward to destination
  - Filter stages such as packet loss/corruption/delay are applied using probablistic models
- Each request is then forwarded to the original destination with a spoofed source address so that replies can also be intercepted and processed.

### Packet interception

- The [TUN](https://en.wikipedia.org/wiki/TUN/TAP) Kernel Virtual Interface is brought up and configured by a [user-supplied yaml](#Configuration) ([see pp.example.yaml](https://github.com/Oasixer/packet-panic/blob/master/pp.example.yaml))
- Configuration summary:
  - IP Range [CIDR](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) to intercept packets on, specified by `config` -> `net_iface_cidr` (example: `69.69.69.1/24`) to intercept packets on [Layer 3](https://en.wikipedia.org/wiki/OSI_model)
  - An interface name (example: `ppanic`) set in `config`->`interface_name`)
  - An IP to output packets on, specified by `config` -> `net_iface_cidr` (example: `127.0.0.1/24` for loopback output)

## Requirements

- [go](https://go.dev/doc/install) version >= `1.21.1`
- Linux based OS (Windows is not supported due to the application fundamentally relying on Linux networking features)

## Installation

Assuming you have Go installed and up to date, you can build the executable binary `main` with:

```console
$ go build main.go
```

## Usage

- If you want to intercept interactions with a device on localhost or loopback at a certain port (example: `8081`), simply replace the destination IP address `localhost` or `172.0.0.1` (loopback) with an address in the IP CIDR range such as `69.69.69.7` assuming the example CIDR (`69.69.69.1/24`) was used.
- If you want to intercept interactions with an external device, you need to configure your DNS to use the IP range `net_iface_cidr` or manually change your application code to target an IP in that range, and set the `net_oface_cidr` to the actual target IP your application is reaching out to.
- Run the program using:

```console
$ sudo ./main --config your/config/here.yaml
```

(replace `your/config/here.yaml` with the path to your [configuration yaml](#Configuration) file)

## Configuration

Example configuration yaml, the path to which is a required argument of the program:

```yaml
net_iface_cidr: "69.69.69.1/24" # TUN interface network CIDR
net_oface_cidr: "127.0.0.1/24" # outgoing packet network CIDR - choose where to route packets to
net_return_addr: "69.69.69.2" # IP to set the spoofed src address to - must be in the `net_iface_cidr` range.
interface_name: "ppanic" # name of the TUN interface brought up by packet panic
debug: true # debug mode
log-cli: true # log CLI to output or /var/log/ppanic
```
