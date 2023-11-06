# Explanation?

for some reason
`conn, err := net.ListenPacket("ip4:icmp", "0.0.0.0")`
behaves the same as
`conn, err := net.ListenPacket("ip4:tcp", "0.0.0.0")`
I mean if anything, it should be TCP... right???

1. `nc -l -p 8080 -4` listen on `8080` on `loopback` (`127.0.0.1`)

- setup listener to receive the packets

2. `main.go` runs, setting up the tun interface and two async helper coroutines

- `tun.go` creates virtual network interface `butt`
- The kernel places all packets destined for the `69.69.69.X/24` range onto `butt` iface
  - (due to `syscalls` made by `water`, the library that sets up the TUN iface)
- Coroutines spawn `ppanic.Dispatcher()` and `ppanic.PacketSender()`.
  - `ppanic.Dispatcher()` continuously reads from `butt` and spawns a coroutine to handle each packet
    - each packet is processed and placed in `tun2EthQ`
  - `ppanic.PacketSender()` continuously reads from `tun2EthQ` and sends each packet that arrives in the queue over TCP

3. Some packet is sent and eventually intercepted

- ie. `echo "hiii" | nc 69.69.69.3 8080`
  - implying that the real destination is `127.0.0.1 8080`?
- The packet gets picked up by `Dispatcher()` listening at `0.0.0.0` on the `TUN` and a coroutine is spawned to handle it
  - The packet that gets picked up resembles:
    `src` = `69.69.69.2`
    `dst` = `69.69.69.3`
  - Before the packet can be forwarded, we need to fix some IP addressing so that it can be intercepted on the return.
    - `src` = `69.69.69.2` (`Config.NetReturnAddr`)
      - once this gets received by the listener, its going to have the Dst address correctly as 69.69.69.2
    - `dst` = `127.0.0.1`
      - this needs to make it to loopback, the real destination as mentioned at the top.
- The packet is passed through `tun2EthQ` and picked up by `PacketSender()`
  - and sent to `127.0.0.1` with a `src` of `69.69.69.2` as per above

4. The netcat listener on `8080` doesn't report anything for some reason, even though wireshark shows that loopback receives the following packet:

```
   No. Time Source Destination Protocol Length Info
   5 4.534479898 69.69.69.2 127.0.0.1 TCP 74 36150 → 8080 [SYN] Seq=0 Win=64240 Len=0 MSS=1460 SACK_PERM=1 TSval=3312775950 TSecr=0 WS=128

Frame 5: 74 bytes on wire (592 bits), 74 bytes captured (592 bits) on interface lo, id 0
Ethernet II, Src: 00:00:00_00:00:00 (00:00:00:00:00:00), Dst: 00:00:00_00:00:00 (00:00:00:00:00:00)
Internet Protocol Version 4, Src: 69.69.69.2, Dst: 127.0.0.1
Transmission Control Protocol, Src Port: 36150, Dst Port: 8080, Seq: 0, Len: 0
```

wireshark uses xdp a type of ebpf

xdp the moment it runs a hook, when kernel sees a packet b4 processing it
iptables in the middle of the processing
