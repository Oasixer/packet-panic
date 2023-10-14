package tun

import (
	"net"
	"testing"
)

func TestTunNew(t *testing.T) {
	ip, net, err := net.ParseCIDR("192.168.2.1/24")
	if err != nil {
		t.Log("net.ParseCIDR error should be nil", err)
		t.Fail()
	}

	inf, err := New("by-test", ip, net)
	if err != nil {
		t.Log("tun.New error should be nil:", err)
		t.Fail()
	}

	if inf == nil {
		t.Log("tun.New interface shouldn't be nil:", err)
		t.Fail()
	}
}
