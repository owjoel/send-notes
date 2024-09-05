package api

import (
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
	return review, nil
}

func (a Application) GetReview(userID string, reviewerID string) (domain.Review, error) {
	review, err := a.db.Get(userID, reviewerID)
	if err != nil {
		return domain.Review{}, err
	}
	return review, nil
}
func (a Application) UpdateReview(id string) (domain.Review, error) {
	return domain.Review{}, nil
}
func (a Application) DeleteReview(id string) (domain.Review, error) {
	return domain.Review{}, nil
}
