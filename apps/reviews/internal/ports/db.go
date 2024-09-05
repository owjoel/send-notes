package ports

import "github.com/owjoel/send-notes/reviews/internal/application/core/domain"

type DBPort interface {
	Get(userId string, reviewerId string) (domain.Review, error)
	Save(*domain.Review) (string, error)
	Update(id string, rating int32) error
	Delete(id string) error
}
