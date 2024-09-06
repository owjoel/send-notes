package rest

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/owjoel/send-notes/reviews/internal/ports"
)

type Adapter struct {
	api  ports.APIPort
	port int
}

func NewAdapter(api ports.APIPort, port int) *Adapter {
	return &Adapter{api, port}
}

func (a Adapter) Run() {
	server := gin.Default()

	server.GET("/reviews", a.Get)
	server.POST("/reviews", a.Create)
	server.PUT("/reviews/:id", a.Update)
	server.DELETE("/reviews/:id", a.Delete)
	server.GET("/reviews/user/:user_id", a.Average)

	fmt.Printf("Application started")
	server.Run(fmt.Sprintf(":%d", a.port))
}
