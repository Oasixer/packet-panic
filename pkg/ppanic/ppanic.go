package ppanic

import (
	"encoding/json"
	"errors"
	"fmt"
	"math/rand"
	"net"

	// "sync"
	"time"

	// "github.com/Oasixer/packet-panic/pkg/config"

	"github.com/orcaman/concurrent-map/v2"
	"github.com/rs/zerolog/log"
	"github.com/songgao/water"
	"golang.org/x/net/ipv4"
)

// used to be defined here, now moved to connections/connections.go
// type Packet struct {
//   header *ipv4.Header
//   payload []byte
// }
//

const (
  maxIPPacketSize = 65535
)
// type Connection struct {
//   nPackets uint64
//   srcIP net.IP
//   dstIP net.IP
//   srcPort uint16
//   dstPort uint16
//   method string
//   speedGBps float32
//   displayPackets []Packet
//   lastPacketTs int64
// }

// type Change interface {
//   Type() string
// }

// func (c CorruptorManipulation) Type() string {
//   return "corruptor"
// }

type DelayerConfig struct{
  MinDelay time.Duration `json:"MinDelay"`
  MaxDelay time.Duration `json:"MaxDelay"`
}

type CorruptorConfig struct{
  NumBitsToFlipPayload int `json:"numBitsToFlipPayload"`
  L2HeaderCorruptionProbability float32 `json:"l2HeaderCorruptionProbability"`
  L3HeaderCorruptionProbability float32 `json:"l3HeaderCorruptionProbability"`
}


type PacketManipulator interface {
	Manipulate(packet *Packet, displayPacket *DisplayPacket)
	DecideManipulations(packet *Packet, displayPacket *DisplayPacket)
}

type Delayer struct {
  cfg DelayerConfig
  manip *DelayerManipulation
  delayMs time.Duration
}

type Corruptor struct{
  cfg CorruptorConfig
  manip *CorruptorManipulation
}

type CorruptorManipulation struct{
  Cfg CorruptorConfig `json:"cfg"`
  HeaderBitFlips []HeaderBitFlip `json:"headerBitFlips"`
  PayloadBitFlips []PayloadBitFlip `json:"payloadBitFlips"`
}

type DelayerManipulation struct{
  Cfg DelayerConfig `json:"cfg"`
  DelayMs int `json:"delayMs"`
  delay time.Duration
}

type DelayApplied struct{
  DelayMs int `json:"delayMs"`
  PrevValue string `json:"prevValue"`
  NewValue string `json:"newValue"`
}

type HeaderBitFlip struct{
  HeaderLayer int `json:"headerLayer"`
  FieldName string `json:"fieldName"`
  PrevValue string `json:"prevValue"`
  NewValue string `json:"newValue"`
}

type PayloadBitFlip struct{
  Byte int `json:"byte"`
  Bit int `json:"bit"`
  PrevValue string `json:"prevValue"`
  NewValue string `json:"newValue"`
}

func NewCorruptor(corruptorConfig CorruptorConfig) *Corruptor {
  return &Corruptor{cfg: corruptorConfig, manip: nil}
}

func NewCorruptorConfig(numBitsToFlipPayload int, l2HeaderCorruptionProbability, l3HeaderCorruptionProbability float32 ) *CorruptorConfig {
  return &CorruptorConfig{NumBitsToFlipPayload: numBitsToFlipPayload,
    L2HeaderCorruptionProbability: l2HeaderCorruptionProbability,
    L3HeaderCorruptionProbability: l3HeaderCorruptionProbability,
  }
}

func NewDelayer(delayerConfig DelayerConfig) *Delayer {
  return &Delayer{cfg: delayerConfig, manip: nil, delayMs: 0}
}

func NewDelayerConfig(minDelay, maxDelay time.Duration) *DelayerConfig {
  return &DelayerConfig{MinDelay: minDelay, MaxDelay: maxDelay}
}

func (d *Delayer) DecideManipulations(packet *Packet, displayPacket *DisplayPacket) {
	randomDelay := d.cfg.MinDelay + time.Duration(rand.Int63n(int64(d.cfg.MaxDelay-d.cfg.MinDelay)))
  manip := DelayerManipulation{
    Cfg: d.cfg,
    DelayMs: int(randomDelay.Milliseconds()),
    delay: randomDelay,
  }
  d.manip = &manip
  delayerManipDataStr, err := json.Marshal(manip)
  if err != nil {
    log.Printf("error calling json.Marshal to json-string-encode delayerManipulation: %v\n", err)
    return
  }
  manipulation := Manipulation{
    ManipulatorType: "delayer", 
    Data: string(delayerManipDataStr),
  }
  displayPacket.Manips = append(displayPacket.Manips, manipulation)
}

func (d *Delayer) Manipulate(packet *Packet, displayPacket *DisplayPacket) {
  if d.manip == nil {
    log.Fatal().Msg("Logic error or witchcraft has occured??! you called Manipulate() without saturating d.manip!!")
  }
	time.Sleep(d.manip.delay)
}

func (c *Corruptor) DecideManipulations(packet *Packet, displayPacket *DisplayPacket) {
  // decide how to corrupt headers  
  var headerBitFlips []HeaderBitFlip
  // TODO: append to this by implementing the following TODOS...
  if c.cfg.L2HeaderCorruptionProbability > 0 {
    // TODO: implement corruption on ip header
    // TODO: implement tracking of modifications to ipHeader via
    // some sort of string encoding based on the IpHeader struct fields
  }
  if c.cfg.L3HeaderCorruptionProbability > 0 {
    // TODO: implement corruption on udp header
    // TODO: implement tracking of modifications to udpHeader via
    // some sort of string encoding based on the UdpHeader struct fields
  }

  // decide how to corrupt payload  
  payloadStart := 8 // Start corrupting after the first 8 bytes of the payload
  if len(packet.payload) <= payloadStart {
    return
  }

  payloadBitFlips := make([]PayloadBitFlip, c.cfg.NumBitsToFlipPayload)
  for i := 0; i < c.cfg.NumBitsToFlipPayload; i++ {
    randByte := payloadStart + rand.Intn(len(packet.payload)-payloadStart)
    randBit := uint(rand.Intn(8))
    prevValue := packet.payload[randByte]
    bitMask := byte(1 << randBit)
    newValue := prevValue ^ bitMask // Calculate newValue by XORing prevValue with the bitMask

    payloadBitFlips[i] = PayloadBitFlip{
      Byte: randByte,
      Bit: int(randBit),
      PrevValue: string(prevValue),
      NewValue: string(newValue),
    }
  }

  corruptorManipulation := &CorruptorManipulation{
    Cfg: c.cfg,
    HeaderBitFlips: headerBitFlips,
    PayloadBitFlips: payloadBitFlips,
  }
  c.manip = corruptorManipulation

  corruptorManipDataStr, err := json.Marshal(corruptorManipulation)
  if err != nil {
    log.Printf("error calling json.Marshal to json-string-encode corruptorManipulation: %v\n", err)
    return
  }
  manipulation := Manipulation{
    ManipulatorType: "corruptor", 
    Data: string(corruptorManipDataStr),
  }
  displayPacket.Manips = append(displayPacket.Manips, manipulation)
}

func (c *Corruptor) Manipulate(packet *Packet, displayPacket *DisplayPacket) {
  if c.manip == nil {
    log.Fatal().Msg("Logic error or witchcraft has occured??! you called Manipulate() without saturating d.manip!!")
  }
  // Applying payload bit flips
  for _, flip := range c.manip.PayloadBitFlips {
    packet.payload[flip.Byte] ^= 1 << flip.Bit
  }
  // TODO: assert that packet.payload[flip.Byte] = c.manip.NewValue or whatever

  // TODO: Apply header bit flips when implemented
}

func Dispatcher(iface *water.Interface, tun2EthQ chan Packet, displayPacketQ chan InfoUpdate, manipulators []PacketManipulator) error {
  log.Debug().Msgf("hi")

  // connections := make(map[string]Connection) // not concurrency safe, would need a lock: VVVVVVVVVVVVVVVVV
  // lock := sync.RWMutex{} // this works but its easier to just use cmap (concurrent-map)
  PP.connections = cmap.New[*Connection]()
  // also, major TODO: would be to look closely on if this has a major performance impact (quite possible!) and if so we'll have to do an append-only data system instead of having individual request handler coroutines sharing the map!


  for {
    buf := make([]byte, maxIPPacketSize)
    n, err := iface.Read(buf)
    if err != nil {
      // TODO fix that error, its useless(stupid copy paste). Change it to be the same behavior(interface close)
      if errors.Is(err, net.ErrClosed) {
        return nil
      }

      return fmt.Errorf("ppanic.dispatcher: %w", err)
    }

    go func(buf []byte, buf_len int) {
      // startTime := time.Now()

      if ok := HandleIpPacket(buf, buf_len, tun2EthQ, displayPacketQ, manipulators); !ok{
        fmt.Printf("packet failed to parse")
      }

    }(buf, n)
  }
}
    //   tun2EthQ <- packet
    // }(buf, n)


   //      // Fix UDP checksum which is for some reason based on src and dest IP addresses
   //      // from the IP packet header even though UDP is layer 4... 
   //      udpStart := header.Len
   //      udpHeader := buf[udpStart : udpStart+8] // 8 bytes of UDP header
   //      udpPayload := buf[udpStart+8 : buf_len]
			//
   //      udpSrcPort := binary.BigEndian.Uint16(udpHeader[0:2]) // Source port is the first 2 bytes
   //      udpDstPort := binary.BigEndian.Uint16(udpHeader[2:4]) // Destination port is the next 2 bytes
			//
   //      fmt.Printf("UDP Source Port: %d, Destination Port: %d\n", udpSrcPort, udpDstPort)
   //      fmt.Printf("oldSrc %s, oldDst: %s\n", oldSrc, oldDst)
			//
   //      // for i := 0; i < len(config.Config.KnownClients); i++ {
			//
   //      hash := fmt.Sprintf("%s:%d-%d", udpSrcPort, udpDstPort, "UDP")
			//
   //      var curConnection Connection
   //      var curConnectionHash string
   //      if connect, ok := connections.Get(hash); ok {
   //        // ayo WTF is connections.GetShard()?????
			//
   //        fmt.Printf("found connection: %d -> %d", udpSrcPort, udpDstPort)
   //        connect.nPackets++
   //        connect.lastPacketTs = time.Now().UnixMilli()
   //        curConnection = connect
			//
   //        // TODO update recent 10 packets or whatever depending on timing
   //      } else {
   //        for i := 0; i < len(config.Config.KnownClients); i++ {
   //          knownClient := config.Config.KnownClients[i]
   //          p1 := uint16(knownClient.Port1)
   //          p2 := uint16(knownClient.Port2)
   //          ports_match := p1 == udpSrcPort && p2 == udpDstPort   
   //          backward_match := p2 == udpSrcPort && p1 == udpDstPort
			//
   //          // todo mild refactor
   //          if (ports_match || backward_match) && knownClient.Method == "UDP" {
   //            curConnectionHash = fmt.Sprintf("%s:%d-%d", knownClient.Method, udpSrcPort, udpDstPort)
   //            srcIP := net.ParseIP(knownClient.IP1)
   //            dstIP := net.ParseIP(knownClient.IP2)
   //            if backward_match{ // if 2->1 rather than 1->2 which is assumed
   //              srcIP = net.ParseIP(knownClient.IP2)
   //              dstIP = net.ParseIP(knownClient.IP1)
   //            }
   //            curConnection = Connection{
   //              nPackets: 1,
   //              srcIP: srcIP,
   //              dstIP: dstIP,
   //              srcPort: udpSrcPort,
   //              dstPort: udpDstPort,
   //              method: knownClient.Method,
   //              speedGBps: 0,
   //              displayPackets: make([]Packet, 0),
   //            }
   //            connections.Set(curConnectionHash, curConnection)
   //          }
   //        }
   //      }
			//
			//
			//
   //      udpHeader[6] = 0
   //      udpHeader[7] = 0
   //      checksum := ComputeUDPChecksum(header.Src, header.Dst, udpHeader, udpPayload)
   //      // fmt.Printf("checksum: 0x%x%x", byte(checksum >> 8), byte(checksum & 0xFF))
   //      // checksum2 := UpdateChecksumForNewIPs(udpHeader[6:8], oldSrc, oldDst, header.Src, header.Dst)
			//
			//
   //      udpHeader[6] = byte(checksum >> 8) // update header w/ new checksum
   //      udpHeader[7] = byte(checksum & 0xFF)
			//
   //    } else {
   //      fmt.Printf("Header was not UDP!: %v", header.Protocol)
   //    }
   //    packet := Packet{
   //      header: header,
   //      payload: payload,
   //    }
			//
   //    // Apply manipulations
			// for _, manipulator := range manipulators {
			// 	manipulator.Manipulate(&packet)
			// }

  //     tun2EthQ <- packet
  //   }(buf, n)
  // }
// }

func PacketSender(conn *ipv4.RawConn, tun2EthQ chan Packet) error{
  startTime := time.Now()
  gotFirstPacket := false
	lifetimeBytesSent := 0
  nPackets := 0
  for {
    packet := <-tun2EthQ
    packetSizeBytes := packet.ipHeader.TotalLen
		lifetimeBytesSent += packetSizeBytes
    // log.Debug().Msgf("payload_len: %d", len(packet.payload))
    // send packet
    err := conn.WriteTo(packet.ipHeader, packet.payload, nil)
    if err != nil { // if connection is closed, exit nicely
      if errors.Is(err, net.ErrClosed) {
        return nil
      }
      return fmt.Errorf("Error: %w", err)
    }
    nPackets += 1

    // log.Debug().Msgf("sent packet to %s", packet.header.Dst.String())
    if (gotFirstPacket == false){
      startTime = time.Now()
      gotFirstPacket = true
    }
    if (nPackets % 10000 == 0) {
      elapsedTime := time.Now().Sub(startTime)
      speedGBps := float64(lifetimeBytesSent) / (1024 * 1024 * 1024) / elapsedTime.Seconds()
      fmt.Printf("Speed: %.2f P/s, %.2f Gb/s %.2f GB/s\n", float64(nPackets) / elapsedTime.Seconds(), speedGBps*8, speedGBps)
    }
	}
}
