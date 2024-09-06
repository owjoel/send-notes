package api

import (
	"fmt"

	"github.com/owjoel/send-notes/reviews/internal/application/core/domain"
	"github.com/owjoel/send-notes/reviews/internal/ports"
)

type Application struct {
	db ports.DBPort
}

func NewApplication(db ports.DBPort) *Application {
	return &Application{
		db: db,
	}
}

func (a Application) SubmitReview(review domain.Review) (domain.Review, error) {
	rID, err := a.db.Save(&review)
	if err != nil {
		return domain.Review{}, err
	}
	review.ID = rID

	aveErr := a.db.IncrementRating(review.UserID, review.Rating, 1)
	if aveErr != nil {
		return domain.Review{}, fmt.Errorf("incrementing user average: %v", aveErr)
	}
	return review, nil
}

func (a Application) GetReview(userID string, reviewerID string) (domain.Review, error) {
	review, err := a.db.Get(userID, reviewerID)
	if err != nil {
		return domain.Review{}, err
	}
	return review, nil
}
func (a Application) UpdateReview(id string, review domain.Review) (domain.Review, error) {
	res, err := a.db.Update(id, review.Rating);
	if  err != nil {
		fmt.Println("Updating review:", err)
		return domain.Review{}, err
	}

	if err := a.db.IncrementRating(res.UserID, review.Rating - res.Rating, 0); err != nil {
		return domain.Review{}, err
	}
	return domain.Review{ID: review.ID}, nil
}
func (a Application) DeleteReview(id string) (domain.Review, error) {
	if err := a.db.Delete(id); err != nil {
		fmt.Println(err)
		return domain.Review{}, err
	}
	return domain.Review{ID: id}, nil
}

func (a Application) GetUserAverage(id string) (float32, error) {
	ave, err := a.db.AverageReview(id)
	if err != nil {
		return 0.0, err
	}
	return ave, nil
}
