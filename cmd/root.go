/*
Copyright © 2023 NAME HERE <EMAIL ADDRESS>

*/
package cmd

import (
	"os"

	"github.com/Oasixer/ppanic/pkg/config"

	"github.com/Oasixer/ppanic/pkg/tun"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"


)

var cfgFile string

// rootCmd represents the base command when called without any subcommands
var rootCmd = &cobra.Command{
	Use:   "packet-panic",
	Short: "A brief description of your application",
	Long: `A longer description that spans multiple lines and likely contains
examples and usage of using your application. For example:

Cobra is a CLI library for Go that empowers applications.
This application is a tool to generate the needed files
to quickly create a Cobra application.`,
	// Uncomment the following line if your bare application
	// has an action associated with it:
	// Run: func(cmd *cobra.Command, args []string) { },
}

// Execute adds all child commands to the root command and sets flags appropriately.
// This is called by main.main(). It only needs to happen once to the rootCmd.
func Execute() {
	err := rootCmd.Execute() 
	if err != nil {
		os.Exit(1)
	}
}

func init() {
	// Here you will define your flags and configuration settings.
	// Cobra supports persistent flags, which, if defined here,
	// will be global for your application.
	pFlags := rootCmd.PersistentFlags()

	pFlags.StringVar(&cfgFile, "config", "", "config file (default is $HOME/.packet-panic.yaml)")

	// Cobra also supports local flags, which will only run
	// when this action is called directly.
	// rootCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
	pFlags.StringP("net_iface_cidr", "i", "", "CIDR of network to join")
	viper.BindPFlag("net_iface_cidr", pFlags.Lookup("fleet"))
	
	pFlags.StringP("interface", "i", "by1", "The internal network interface name")
	viper.BindPFlag("interface", pFlags.Lookup("interface"))

}

// initConfig reads in config file and ENV variables if set.
func initConfig() {
	if cfgFile != "" {
		// Use config file from the flag.
		viper.SetConfigFile(cfgFile)
	} else {

		// search config in defualt directory(/etc/buoy)
		// with name `buoy.yaml`
		// viper.AddConfigPath("/etc/pp/")
		viper.SetConfigType("yaml")
		viper.SetConfigName("ppanic")
	}

	err := viper.ReadInConfig()
	if err != nil {
		log.Fatal().
			Err(err).
			Msg("Couldn't read in config")
	}

	// viper.AutomaticEnv() // read in environment variables that match

	// unmarshal viper to config.InitConfig
	err = config.UnmarshalConfig()
	if err != nil {
		log.Fatal().
			Err(err).
			Msg("Couldn't unmarshal config")
	}
	zerolog.TimeFieldFormat = zerolog.TimeFormatUnixMs

	config.Config.FleetAddr, config.Config.FleetNet, err = net.ParseCIDR(config.Config.FleetStr)
	if err != nil {
		log.Fatal().
			Err(err).
			Msg("Couldn't parse CIDR")
	}

	config.Config.Password = []byte(config.Config.PasswordStr)

	// set to info level first
	zerolog.SetGlobalLevel(zerolog.InfoLevel)

	// if debug true then set to debug level
	if config.Config.Debug {
		zerolog.SetGlobalLevel(zerolog.DebugLevel)
	}

	// if LogCli true then log to stderr with pretty formatting
	if config.Config.LogCli {
		log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stdout, TimeFormat: time.RFC1123Z})
	} else {
		// this is thread safe because the underlying file write sys
		// calls are blocking and so they are thread safe
		f, err := os.OpenFile("/var/log/ppanic.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
		if err != nil {
			log.Fatal().
				Err(err).
				Msg("Couldn't open file /var/log/ppanic.log")
		}

		log.Logger = log.Output(f)
	}

	log.Debug().Msgf("Using config file: %s", viper.ConfigFileUsed())

	log.Debug().
		Bool("Debug", config.Config.Debug).
		Bool("Log-Cli", config.Config.LogCli).
		Str("Iname", config.Config.IName).
		Str("Listen-Port", config.Config.ListenPort).
		Str("IFaceAddr", config.Config.FleetNet.String()).
		Str("IPNetwork", config.Config.FleetAddr.String()).
		Msg("Config")
}
func Root(cmd *cobra.Command, args []string) {
	// TODO look into creating interface in tunrouter
	inf, err := tun.New(config.Config.IName,
		config.Config.FleetAddr, config.Config.FleetNet)
	if err != nil {
		log.Fatal().Err(err).Msg("Tun Creation Error")
	}

	eg := new(errgroup.Group)

	eth2TunQ := make(chan []byte, 1)
	tun2EthQ := make(chan ethrouter.Packet, 1)

	eg.Go(func() error {
		return ethrouter.Run(eg, tun2EthQ, eth2TunQ)
	})

	eg.Go(func() error {
		return tunrouter.Run(eg, inf, tun2EthQ, eth2TunQ) //TODO verify order of egress and ingress
	})

	if err = eg.Wait(); err != nil {
		log.Fatal().Err(err).Msg("Buoy Run Failed")
	}
}
