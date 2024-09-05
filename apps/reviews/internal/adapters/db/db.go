package db

import (
	"context"
	"fmt"
	"time"

	"github.com/owjoel/send-notes/reviews/internal/application/core/domain"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Review struct {
	ID         string    `bson:"_id,omitempty"`
	UserID     string    `bson:"user_id"`
	ReviewerID string    `bson:"reviewer_id"`
	Rating     int32     `bson:"rating"`
	CreatedAt  time.Time `bson:"created_at"`
}

type Adapter struct {
	db *mongo.Database
}

func NewAdapter(uri string) (*Adapter, error) {
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		panic(err)
	}
	fmt.Println("database connected")
	return &Adapter{db: client.Database("dev")}, nil
}

func (a *Adapter) Close() {
	// a.db.Client().Disconnect()
}

func (a Adapter) Get(userId string, reviewerId string) (domain.Review, error) {
	var reviewEntity Review
	fmt.Println(userId, reviewerId)
	if err := a.db.Collection("reviews").FindOne(context.TODO(), bson.M{"user_id": userId, "reviewer_id": reviewerId}).Decode(&reviewEntity); err != nil {
		return domain.Review{}, err
	}

	review := domain.Review{
		ID:         reviewEntity.ID,
		UserID:     reviewEntity.UserID,
		ReviewerID: reviewEntity.ReviewerID,
		Rating:     reviewEntity.Rating,
		CreatedAt:  reviewEntity.CreatedAt.Unix(),
	}
	return review, nil
}

func (a Adapter) Save(r *domain.Review) (string, error) {
	reviewEntity := &Review{
		UserID:     r.UserID,
		ReviewerID: r.ReviewerID,
		Rating:     r.Rating,
		CreatedAt:  time.Now(),
	}
	fmt.Println(reviewEntity)
	res, err := a.db.Collection("reviews").InsertOne(context.TODO(), reviewEntity)
	fmt.Println(res, err)
	if err != nil {
		return "", err
	}
	insertedID := res.InsertedID.(primitive.ObjectID).Hex()
	fmt.Printf("Inserted document with ObjectID: %v", insertedID)
	return insertedID, nil
}
func (a *Adapter) Update(id int64, rating int) error {
	return nil
}
func (a *Adapter) Delete(id int64) error {
	return nil
}
