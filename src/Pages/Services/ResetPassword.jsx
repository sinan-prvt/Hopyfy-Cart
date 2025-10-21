  import { useState } from "react";
  import { useParams, useNavigate } from "react-router-dom";
  import api from "../../api";
  import { toast } from "react-toastify";

  const ResetPassword = () => {
    const { uid, token } = useParams(); // from /reset-password/:uid/:token
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await api.post(`auth/password-reset-confirm/${uid}/${token}/`, { password });
        toast.success("Password reset successfully!");
        navigate("/login");
      } catch (err) {
        toast.error("Invalid or expired reset link");
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-4 py-2 rounded mb-4"
            required
          />
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
            Reset Password
          </button>
        </form>
      </div>
    );
  };

  export default ResetPassword;
