import { useState } from "react";
import { LiaCogSolid, LiaLockSolid, LiaUserSolid } from "react-icons/lia";
import CurrencySelector from "../components/CurrencySelector";
import { useAuth } from "../contexts/AuthContext";

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
        <div className="auth-header">
          <h2 className="auth-title">Account Settings</h2>
          <p className="auth-subtitle">
            Manage your account information and preferences
          </p>
        </div>

        {/* User Information Section */}
        <div className="account-section">
          <h3 className="section-title">
            <LiaUserSolid className="section-icon" />
            Personal Information
          </h3>
          <div className="user-info-grid">
            <div className="info-card">
              <span className="info-label">Username</span>
              <span className="info-value">{user.username}</span>
            </div>
            <div className="info-card">
              <span className="info-label">Email</span>
              <span className="info-value">{user.email}</span>
            </div>
            {user.phone_number && (
              <div className="info-card">
                <span className="info-label">Phone</span>
                <span className="info-value">{user.phone_number}</span>
              </div>
            )}
            {user.address && (
              <div className="info-card">
                <span className="info-label">Address</span>
                <span className="info-value">{user.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Currency Settings Section */}
        <div className="account-section">
          <h3 className="section-title">
            <LiaCogSolid className="section-icon" />
            Preferences
          </h3>
          <CurrencySelector />
        </div>

        {/* Password Change Section */}
        <div className="account-section">
          <h3 className="section-title">
            <LiaLockSolid className="section-icon" />
            Security
          </h3>
          <p className="section-subtitle">
            Update your password to keep your account secure
          </p>

          <form onSubmit={handlePasswordSubmit} className="auth-form">
            {error && (
              <div className="auth-error">
                <span>{error}</span>
              </div>
            )}

            {message && (
              <div className="auth-success">
                <span>{message}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="old_password" className="form-label">
                Current Password
              </label>
              <input
                type="password"
                id="old_password"
                name="old_password"
                value={passwordForm.old_password}
                onChange={handlePasswordChange}
                required
                placeholder="Enter your current password"
                className="form-input"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="new_password" className="form-label">
                  New Password
                </label>
                <input
                  type="password"
                  id="new_password"
                  name="new_password"
                  value={passwordForm.new_password}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Enter new password"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirm_password" className="form-label">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirm_password"
                  name="confirm_password"
                  value={passwordForm.confirm_password}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Confirm new password"
                  className="form-input"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="auth-button auth-button--password"
            >
              {loading ? (
                <>
                  <span className="loading-spinner">⏳</span>
                  Updating Password...
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Account;
