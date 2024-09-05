package rest

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/owjoel/send-notes/reviews/internal/application/core/domain"
)

func (a Adapter) Create(c *gin.Context) {
	var r domain.Review
	if err := c.ShouldBindJSON(&r); err != nil {
		fmt.Printf("binding json to review: %v\n", err)
		c.JSON(http.StatusBadRequest, gin.H{"msg": "Bad input"})
		return
	}
	result, err := a.api.SubmitReview(r)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"msg": "Error Processing Review"})
		return
	}
	c.JSON(http.StatusOK, result)
}

func (a Adapter) Get(c *gin.Context) {
	uID := c.Query("user_id")
	rID := c.Query("reviewer_id")
	fmt.Printf("Getting review of ID: %v", rID)
	review, err := a.api.GetReview(uID, rID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"msg": "Error Processing Request"})
		fmt.Println(err)
		return
	}
	c.JSON(http.StatusOK, review)
}

func (a Adapter) Update(c *gin.Context) {

}

func (a Adapter) Delete(c *gin.Context) {

}
