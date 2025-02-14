package api

import (
	"crypto/rand"
	"encoding/base64"

	"github.com/gin-gonic/gin"
)

type AuthRequest struct {
	Password string `json:"password"`
}

func (a *API) auth(c *gin.Context) {
	var authRequest AuthRequest
	if err := c.BindJSON(&authRequest); err != nil {
		c.JSON(400, gin.H{
			"error": "invalid request",
		})
		return
	}

	if authRequest.Password != "password" {
		c.JSON(401, gin.H{
			"error": "unauthorized",
		})
		return
	}

	adminToken, err := generateRandomToken(32)
	if err != nil {
		c.JSON(500, gin.H{
			"error": "something went wrong",
		})
		return
	}
	c.Header("Set-Cookie", "admin-token="+adminToken+"; Path=/; SameSite=Strict")
	c.Redirect(301, "http://localhost:5173/app")
}

func generateRandomToken(length int) (string, error) {
	randomBytes := make([]byte, length)

	_, err := rand.Read(randomBytes)
	if err != nil {
		return "", err
	}

	token := base64.URLEncoding.EncodeToString(randomBytes)

	return token, nil
}
