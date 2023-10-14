package config

import (
	"fmt"
	"net"

	"github.com/spf13/viper"
)

type config struct {
	Debug       bool              `mapstructure:"debug"`
	LogCli      bool              `mapstructure:"log-cli"`
	IFaceCidrStr   string            `mapstructure:"net_iface_cidr"`
	IName          string            `mapstructure:"interface"`
	IFaceAddr      net.IP
	IPNetwork   *net.IPNet
}

var Config config

// config.UnmarshalInitConfig: unmarshal viper to config.InitConfig global instance of config.initConfig
func UnmarshalConfig() error {
	err := viper.Unmarshal(&Config)
	if err != nil {
		return fmt.Errorf("config.UnmarshalConfig: %w", err)
	}

	return nil
}
