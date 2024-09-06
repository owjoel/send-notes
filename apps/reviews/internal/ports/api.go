package ports

import "github.com/owjoel/send-notes/reviews/internal/application/core/domain"

type APIPort interface {
	SubmitReview(review domain.Review) (domain.Review, error)
	GetReview(userID string, reviewerID string) (domain.Review, error)
	UpdateReview(id string, review domain.Review) (domain.Review, error)
	DeleteReview(id string) (domain.Review, error)

	GetUserAverage(id string) (float32, error)
	// UpdateUserAverage(id string, rating int32) error
}
