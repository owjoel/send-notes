package domain

import "time"

type Review struct {
	ID         string `json:"id"`
	UserID     string `json:"user_id"`
	ReviewerID string `json:"reviewer_id"`
	Rating     int32  `json:"rating"`
	CreatedAt  int64  `json:"created_at"`
}

func NewReview(userId string, reviewerId string, rating int32) Review {
	return Review{
		CreatedAt:  time.Now().Unix(),
		UserID:     userId,
		ReviewerID: reviewerId,
		Rating:     rating,
	}
}

func GetReview(userId int64, reviewerId int64) {

}
