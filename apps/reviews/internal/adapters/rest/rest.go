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
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"msg": "Error Processing Review"})
		return
	}
	c.JSON(http.StatusOK, result)
}

func (a Adapter) Get(c *gin.Context) {
	uID := c.Query("user_id")
	rID := c.Query("reviewer_id")
	review, err := a.api.GetReview(uID, rID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"msg": "Error Processing Request"})
		fmt.Println(err)
		return
	}
	c.JSON(http.StatusOK, review)
}

func (a Adapter) Update(c *gin.Context) {
	var r domain.Review
	rID := c.Param("id")

	if err := c.ShouldBindJSON(&r); err != nil {
		fmt.Printf("binding json to review: %v\n", err)
		c.JSON(http.StatusBadRequest, gin.H{"msg": "Bad input"})
		return
	}
	_, err := a.api.UpdateReview(rID, r)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"msg": "Error Processing Request"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"msg": "Update successful"})
}

func (a Adapter) Delete(c *gin.Context) {
	rID := c.Param("id")
	res, err := a.api.DeleteReview(rID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"msg": "Error Processing Request"})
		return
	}
	c.JSON(http.StatusOK, res)
}

func (a Adapter) Average(c *gin.Context) {
	id := c.Param("user_id")
	ave, err := a.api.GetUserAverage(id)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"msg": "Error getting user average"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"id": id, "ave": ave})
}