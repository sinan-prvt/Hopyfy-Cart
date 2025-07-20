import { useState } from "react";
import axios from "axios";
import { useAuth } from "../Contexts/AuthContext";

const ReviewForm = ({ productId, onReviewSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return alert("Please select a star rating");

    const newReview = {
      productId: parseInt(productId),
      userId: user.id,
      rating,
    };

    try {
      await axios.post("http://localhost:3000/reviews", newReview);
      onReviewSubmit(); // refresh reviews
      setRating(0); // reset
      alert("Thank you for your review!");
    } catch (err) {
      console.error("Error submitting review", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex space-x-2 text-3xl mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className={`cursor-pointer ${
              star <= (hover || rating) ? "text-yellow-400" : "text-gray-400"
            }`}
          >
            ★
          </span>
        ))}
      </div>
      <button
        type="submit"
        className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Submit Rating
      </button>
    </form>
  );
};

export default ReviewForm;
