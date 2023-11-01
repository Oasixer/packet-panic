package tun

import (
	"fmt"
	"net"

	"github.com/milosgajdos/tenus"
	"github.com/songgao/water"
)

// tun.New: create, initialize, and bring up tun interface
// Creates interface with name `<iname>` and address `<ip>` with range `<network>`
func New(iname string, ip net.IP, network *net.IPNet) (*water.Interface, error) {
	tunConf := water.Config{
		DeviceType: water.TUN,
		PlatformSpecificParams: water.PlatformSpecificParams{
			Name: iname,
		},
	}

	tunInf, err := water.New(tunConf)
	if err != nil {
		return nil, fmt.Errorf("tun.Init: %w", err)
	}

	// get already existing link
	inf, err := tenus.NewLinkFrom(iname)
	if err != nil {
		return nil, fmt.Errorf("tun.Init: %w", err)
	}

	// This is the same as running `ip addr add <ip + network in CIDR notation> dev <iname>`
	err = inf.SetLinkIp(ip, network)
	if err != nil {
		return nil, fmt.Errorf("tun.Init: %w", err)
	}

	// This is the same as running `ip addr add <ip + network in CIDR notation> dev <iname>`
	err = inf.SetLinkMTU(65535)
	if err != nil {
		return nil, fmt.Errorf("tun.Init: %w", err)
	}

	// This is the same as `ip link set dev <iname> up`
	err = inf.SetLinkUp()
	if err != nil {
		return nil, fmt.Errorf("tun.Init: %w", err)
	}

	return tunInf, nil
}
