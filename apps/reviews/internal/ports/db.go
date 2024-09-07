package ports

import "github.com/owjoel/send-notes/reviews/internal/application/core/domain"

type DBPort interface {
	Get(userId string, reviewerId string) (domain.Review, error)
	Save(*domain.Review) (string, error)
	Update(id string, rating int32) (domain.Review, error)
	Delete(id string) error
	AverageReview(id string) (float32, error)
	IncrementRating(id string, rating int32, inc int32) error
}
