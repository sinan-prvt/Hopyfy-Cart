import { useState } from "react";
import axios from "axios";
import { useAuth } from "../Contexts/AuthContext";

const ReviewForm = ({ productId, onReviewSubmit }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Login to submit a review");

    const reviewData = {
      userId: user.id,
      productId,
      rating,
      comment,
      created_at: new Date().toISOString()
    };

    console.log("Submitting review:", reviewData);

    try {
      const res = await axios.post("http://localhost:3000/reviews", reviewData);
      console.log("Review posted:", res.data);

      setComment("");
      setRating(5);
      onReviewSubmit();
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Check console.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div>
        <label>Rating:</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="ml-2 p-1 border rounded"
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>{r} ★</option>
          ))}
        </select>
      </div>
      <div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review..."
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
      >
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
