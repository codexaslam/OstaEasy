import axios from "axios";
import {
  Activity,
  BarChart3,
  Calendar,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../config/api";
import { useAuth } from "../contexts/AuthContext";
import { useCurrency } from "../contexts/CurrencyContext";
import { formatDualCurrency } from "../utils/currency";

const Dashboard = () => {
  const { user } = useAuth();
  const { currency } = useCurrency();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    overview: {},
    categories: [],
    top_sellers: [],
    daily_sales: [],
    price_distribution: [],
    user_stats: {},
    daily_registrations: [],
  });

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [overviewRes, salesRes, usersRes] = await Promise.all([
        axios.get(API_ENDPOINTS.ANALYTICS_OVERVIEW, { headers }),
        axios.get(API_ENDPOINTS.ANALYTICS_SALES, { headers }),
        axios.get(API_ENDPOINTS.ANALYTICS_USERS, { headers }),
      ]);

      setAnalytics({
        ...overviewRes.data,
        ...salesRes.data,
        ...usersRes.data,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="dashboard-container">
        <div className="auth-message">
          <h2>Please login to access the dashboard</h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">
          <Activity className="animate-spin h-8 w-8" />
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  const { overview } = analytics;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          <BarChart3 className="h-8 w-8" />
          ostaeasy Analytics Dashboard
        </h1>
        <p className="dashboard-subtitle">
          Comprehensive insights into your marketplace performance
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card metric-card--primary">
          <div className="metric-header">
            <div className="metric-title">
              <DollarSign className="metric-icon" />
              Total Revenue
            </div>
          </div>
          <div className="metric-content">
            <div className="metric-value">
              {formatDualCurrency(overview.total_revenue || 0, currency)}
            </div>
            <p className="metric-subtitle">
              From {overview.total_purchases || 0} completed sales
            </p>
          </div>
        </div>

        <div className="metric-card metric-card--success">
          <div className="metric-header">
            <div className="metric-title">
              <Package className="metric-icon" />
              Active Listings
            </div>
          </div>
          <div className="metric-content">
            <div className="metric-value">{overview.active_listings || 0}</div>
            <p className="metric-subtitle">
              Out of {overview.total_items || 0} total items
            </p>
          </div>
        </div>

        <div className="metric-card metric-card--info">
          <div className="metric-header">
            <div className="metric-title">
              <Users className="metric-icon" />
              Total Users
            </div>
          </div>
          <div className="metric-content">
            <div className="metric-value">{overview.total_users || 0}</div>
            <p className="metric-subtitle">
              +{overview.recent_users || 0} this month
            </p>
          </div>
        </div>

        <div className="metric-card metric-card--warning">
          <div className="metric-header">
            <div className="metric-title">
              <ShoppingCart className="metric-icon" />
              Recent Sales
            </div>
          </div>
          <div className="metric-content">
            <div className="metric-value">{overview.recent_purchases || 0}</div>
            <p className="metric-subtitle">Sales in the last 30 days</p>
          </div>
        </div>
      </div>

      {/* Category Performance */}
      <div className="analytics-section">
        <div className="analytics-card">
          <div className="card-header">
            <div className="section-title">
              <TrendingUp className="section-icon" />
              Category Performance
            </div>
          </div>
          <div className="card-content">
            <div className="category-grid">
              {analytics.categories?.map((category, index) => (
                <div key={index} className="category-item">
                  <div className="category-header">
                    <h4 className="category-name">{category.category}</h4>
                    <span className="category-count">
                      {category.count} items
                    </span>
                  </div>
                  <div className="category-stats">
                    <div className="stat">
                      <span className="stat-label">Listed:</span>
                      <span className="stat-value">{category.count}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Sold:</span>
                      <span className="stat-value stat-value--success">
                        {category.sold}
                      </span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Success Rate:</span>
                      <span className="stat-value">
                        {category.count > 0
                          ? Math.round((category.sold / category.count) * 100)
                          : 0}
                        %
                      </span>
                    </div>
                  </div>
                  <div className="category-progress">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${
                          category.count > 0
                            ? (category.sold / category.count) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Sellers */}
      <div className="analytics-section">
        <div className="analytics-card">
          <div className="card-header">
            <div className="section-title">
              <Users className="section-icon" />
              Top Sellers
            </div>
          </div>
          <div className="card-content">
            <div className="sellers-list">
              {analytics.top_sellers?.map((seller, index) => (
                <div key={index} className="seller-item">
                  <div className="seller-rank">#{index + 1}</div>
                  <div className="seller-info">
                    <h4 className="seller-name">{seller.username}</h4>
                    <p className="seller-stats">
                      {seller.items_sold} items sold •{" "}
                      {formatDualCurrency(seller.revenue, currency)} revenue
                    </p>
                  </div>
                  <div className="seller-badge">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                </div>
              ))}
              {analytics.top_sellers?.length === 0 && (
                <p className="no-data">No sales data available yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Summary */}
      <div className="analytics-section">
        <div className="analytics-card">
          <div className="card-header">
            <div className="section-title">
              <Calendar className="section-icon" />
              Recent Activity (Last 30 Days)
            </div>
          </div>
          <div className="card-content">
            <div className="activity-summary">
              <div className="activity-item">
                <div className="activity-icon activity-icon--users">
                  <Users className="h-5 w-5" />
                </div>
                <div className="activity-content">
                  <h4 className="activity-title">New Users</h4>
                  <p className="activity-value">{overview.recent_users || 0}</p>
                  <p className="activity-subtitle">users joined</p>
                </div>
              </div>

              <div className="activity-item">
                <div className="activity-icon activity-icon--items">
                  <Package className="h-5 w-5" />
                </div>
                <div className="activity-content">
                  <h4 className="activity-title">New Listings</h4>
                  <p className="activity-value">
                    {overview.recent_listings || 0}
                  </p>
                  <p className="activity-subtitle">items listed</p>
                </div>
              </div>

              <div className="activity-item">
                <div className="activity-icon activity-icon--sales">
                  <ShoppingCart className="h-5 w-5" />
                </div>
                <div className="activity-content">
                  <h4 className="activity-title">Sales Made</h4>
                  <p className="activity-value">
                    {overview.recent_purchases || 0}
                  </p>
                  <p className="activity-subtitle">items sold</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="dashboard-actions">
        <button
          onClick={fetchAnalytics}
          disabled={loading}
          className="refresh-btn"
        >
          {loading ? (
            <>
              <Activity className="h-4 w-4 animate-spin mr-2" />
              Refreshing...
            </>
          ) : (
            <>
              <TrendingUp className="h-4 w-4 mr-2" />
              Refresh Analytics
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
