import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import "./Auth.css";

const Account = () => {
  const { user, changePassword } = useAuth();
  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setError("New passwords do not match");
      setLoading(false);
      return;
    }

    const result = await changePassword(
      passwordForm.old_password,
      passwordForm.new_password
    );

    if (result.success) {
      setMessage("Password changed successfully!");
      setPasswordForm({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  if (!user) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Please login to view your account</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Account Information</h2>

        <div className="user-info">
          <div className="info-item">
            <strong>Username:</strong> {user.username}
          </div>
          <div className="info-item">
            <strong>Email:</strong> {user.email}
          </div>
          {user.phone_number && (
            <div className="info-item">
              <strong>Phone:</strong> {user.phone_number}
            </div>
          )}
          {user.address && (
            <div className="info-item">
              <strong>Address:</strong> {user.address}
            </div>
          )}
        </div>

        <div className="password-section">
          <h3>Change Password</h3>
          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label htmlFor="old_password">Current Password</label>
              <input
                type="password"
                id="old_password"
                name="old_password"
                value={passwordForm.old_password}
                onChange={handlePasswordChange}
                required
                placeholder="Enter current password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="new_password">New Password</label>
              <input
                type="password"
                id="new_password"
                name="new_password"
                value={passwordForm.new_password}
                onChange={handlePasswordChange}
                required
                placeholder="Enter new password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirm_password">Confirm New Password</label>
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                value={passwordForm.confirm_password}
                onChange={handlePasswordChange}
                required
                placeholder="Confirm new password"
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? "Changing Password..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Account;
