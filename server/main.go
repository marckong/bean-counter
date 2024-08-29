package main

import (
	"github.com/ryan-willis/bean-counter/server/api"
)

func main() {
	api.NewAPI().Serve()
}
