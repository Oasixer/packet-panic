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

type DelayerConfig struct{
  MinDelay time.Duration `json:"minDelay"`
  MaxDelay time.Duration `json:"maxDelay"`
}

type CorruptorConfig struct{
  NumBitsToFlipPayload int `json:"numBitsToFlipPayload"`
  L3HeaderCorruptionProbability float32 `json:"l3HeaderCorruptionProbability"`
  L4HeaderCorruptionProbability float32 `json:"l4HeaderCorruptionProbability"`
}


type PacketManipulator interface {
	Manipulate(packet *Packet, displayPacket *DisplayPacket)
	DecideManipulations(packet *Packet, displayPacket *DisplayPacket)
}

type Delayer struct {
  cfg *DelayerConfig
  manip *DelayerManipulation
  // delay time.Duration
}

type Corruptor struct{
  cfg *CorruptorConfig
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

func NewCorruptor(corruptorConfig* CorruptorConfig) *Corruptor {
  return &Corruptor{cfg: corruptorConfig, manip: nil}
}

func NewCorruptorConfig(numBitsToFlipPayload int, l3HeaderCorruptionProbability, l4HeaderCorruptionProbability float32 ) *CorruptorConfig {
  return &CorruptorConfig{NumBitsToFlipPayload: numBitsToFlipPayload,
    L3HeaderCorruptionProbability: l3HeaderCorruptionProbability,
    L4HeaderCorruptionProbability: l4HeaderCorruptionProbability,
  }
}

func NewDelayer(delayerConfig* DelayerConfig) *Delayer {
  return &Delayer{cfg: delayerConfig, manip: nil}
}

func NewDelayerConfig(minDelay, maxDelay time.Duration) *DelayerConfig {
  return &DelayerConfig{MinDelay: minDelay, MaxDelay: maxDelay}
}

func (d *Delayer) DecideManipulations(packet *Packet, displayPacket *DisplayPacket) {
	randomDelay := d.cfg.MinDelay + time.Duration(rand.Int63n(int64(d.cfg.MaxDelay-d.cfg.MinDelay)))
  manip := DelayerManipulation{
    Cfg: *d.cfg,
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
  if c.cfg.L3HeaderCorruptionProbability > 0 {
    // TODO: implement corruption on ip header
    // TODO: implement tracking of modifications to ipHeader via
    // some sort of string encoding based on the IpHeader struct fields
  }
  if c.cfg.L4HeaderCorruptionProbability > 0 {
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
    Cfg: *c.cfg,
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

  // connections := make(map[string]ConnectionData) // not concurrency safe, would need a lock: VVVVVVVVVVVVVVVVV
  // lock := sync.RWMutex{} // this works but its easier to just use cmap (concurrent-map)
  PP.connections = cmap.New[*ConnectionData]()
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
        fmt.Printf("IP packet failed to parse")
      }

    }(buf, n)
  }
}

func PacketSender(conn *ipv4.RawConn, tun2EthQ chan Packet) error{
  startTime := time.Now()
  gotFirstPacket := false
	lifetimeBytesSent := 0
  nPackets := 0
  for {
    packet := <-tun2EthQ
    packetSizeBytes := packet.ipHeader.TotalLen
		lifetimeBytesSent += packetSizeBytes
    log.Debug().Msgf("sending. payload_len: %d to %v", len(packet.payload), packet.ipHeader.Dst)
    // send packet
    err := conn.WriteTo(packet.ipHeader, packet.payload, nil)
    if err != nil { // if connection is closed, exit nicely
      if errors.Is(err, net.ErrClosed) {
        return nil
      }
      log.Printf("error_asdf:")
      return fmt.Errorf("error: %w", err)
    }
    nPackets += 1

    // log.Debug().Msgf("sent packet to %s", packet.header.Dst.String())
    if (gotFirstPacket == false){
      startTime = time.Now()
      gotFirstPacket = true
    }
    if (nPackets % 10000 == 0) {
      // elapsedTime := time.Now().Sub(startTime)
      elapsedTime := time.Since(startTime)
      // speedGBps := float64(lifetimeBytesSent) / (1024 * 1024 * 1024) / elapsedTime.Seconds()
      // fmt.Printf("Speed: %.2f P/s, %.2f Gb/s %.2f GB/s\n", float64(nPackets) / elapsedTime.Seconds(), speedGBps*8, speedGBps)
      fmt.Printf("Time (tmp print just to use elapsedTime)%v\n", elapsedTime.Seconds())
    }
	}
}
