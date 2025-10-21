import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler } from "chart.js";
import { FiUsers, FiShoppingBag, FiDollarSign, FiPackage, FiTrendingUp, FiActivity, FiBox, FiShoppingCart } from "react-icons/fi";
import { format, subDays, isAfter } from "date-fns";
import api from "../../api";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    newCustomers: 0,
    avgOrderValue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState(Array(12).fill(0));
  const [productDistribution, setProductDistribution] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [userActivity, setUserActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [usersRes, productsRes, ordersRes] = await Promise.all([
          api.get("/admin/users/"),
          api.get("/admin/products/"),
          api.get("/admin/orders/"),
        ]);

        const users = usersRes.data || [];
        const products = productsRes.data || [];
        const orders = ordersRes.data || [];

        // ---------------- Metrics ----------------
        const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
        const avgOrderValue = orders.length ? totalRevenue / orders.length : 0;
        const newCustomers = users.filter(user => user.created_at && isAfter(new Date(user.created_at), subDays(new Date(), 30))).length;

        setMetrics({
          totalUsers: users.length,
          totalProducts: products.length,
          totalOrders: orders.length,
          totalRevenue: Number(totalRevenue.toFixed(2)),
          newCustomers,
          avgOrderValue: Number(avgOrderValue.toFixed(2)),
        });

        // ---------------- Recent Orders ----------------
        const sortedOrders = [...orders]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5)
          .map(order => ({
            ...order,
            totalAmount: order.total_amount || 0, // Safe default
            customerName: order.user?.username || "Unknown",
            customerEmail: order.user?.email || "Unknown",
            createdAt: order.created_at ? format(new Date(order.created_at), "MMM dd, yyyy") : 'N/A',
          }));
        setRecentOrders(sortedOrders);

        // ---------------- Monthly Revenue ----------------
        const monthlyRevenueData = Array(12).fill(0);
        orders.forEach(order => {
          if (order.created_at) {
            monthlyRevenueData[new Date(order.created_at).getMonth()] += order.total_amount || 0;
          }
        });
        setMonthlyRevenue(monthlyRevenueData);

        // ---------------- Top Products ----------------
        const productSales = {};
        orders.forEach(order => {
          const items = order.items || [];
          items.forEach(item => {
            const product = products.find(p => p.id === item.product.id);
            if (product) {
              productSales[product.id] = productSales[product.id] || {
                name: product.name,
                count: 0,
                image: product.image || null,
                category: product.category || "Unknown",
              };
              productSales[product.id].count += item.quantity || 0;
            }
          });
        });
        setProductDistribution(Object.values(productSales).sort((a, b) => b.count - a.count).slice(0, 5));

        // ---------------- Order Status ----------------
        const statusCount = {};
        orders.forEach(order => {
          const status = order.status || 'pending';
          statusCount[status] = (statusCount[status] || 0) + 1;
        });
        setOrderStatusData(Object.entries(statusCount));

        // ---------------- User Activity ----------------
        const userOrderCount = orders.reduce((acc, order) => {
          if (order.user?.id) acc[order.user.id] = (acc[order.user.id] || 0) + 1;
          return acc;
        }, {});

        const userActivityData = users
          .filter(user => user.role !== 'admin')
          .map(user => ({
            id: user.id,
            name: user.username || "Unknown",
            email: user.email || "Unknown",
            lastLogin: user.last_login ? format(new Date(user.last_login), "MMM dd, yyyy") : "Never logged in",
            orders: userOrderCount[user.id] || 0,
          }))
          .sort((a, b) => {
            if (!a.lastLogin && !b.lastLogin) return 0;
            if (!a.lastLogin) return 1;
            if (!b.lastLogin) return -1;
            return new Date(b.lastLogin) - new Date(a.lastLogin);
          });

        setUserActivity(userActivityData);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // ---------------- Helper Functions ----------------
  const getColorClasses = (color) => {
    switch (color) {
      case 'blue': return { gradient: 'bg-gradient-to-br from-blue-50 to-white', border: 'border-blue-100', bg: 'bg-blue-100', text: 'text-blue-600' };
      case 'green': return { gradient: 'bg-gradient-to-br from-green-50 to-white', border: 'border-green-100', bg: 'bg-green-100', text: 'text-green-600' };
      case 'purple': return { gradient: 'bg-gradient-to-br from-purple-50 to-white', border: 'border-purple-100', bg: 'bg-purple-100', text: 'text-purple-600' };
      case 'amber': return { gradient: 'bg-gradient-to-br from-amber-50 to-white', border: 'border-amber-100', bg: 'bg-amber-100', text: 'text-amber-600' };
      case 'teal': return { gradient: 'bg-gradient-to-br from-teal-50 to-white', border: 'border-teal-100', bg: 'bg-teal-100', text: 'text-teal-600' };
      default: return { gradient: 'bg-gradient-to-br from-gray-50 to-white', border: 'border-gray-100', bg: 'bg-gray-100', text: 'text-gray-600' };
    }
  };

  const formatStatus = (status) => {
    const statusMap = {
      pending: "Pending",
      processing: "Processing",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
      refunded: "Refunded"
    };
    return statusMap[status?.toLowerCase()] || status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown";
  };

  // ---------------- Chart Data ----------------
  const revenueData = useMemo(() => ({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Revenue (₹)",
        data: monthlyRevenue.map(r => r || 0),
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 2,
        tension: 0.3,
        fill: true,
        pointBackgroundColor: "rgba(99, 102, 241, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(99, 102, 241, 1)",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  }), [monthlyRevenue]);

  const productData = useMemo(() => ({
    labels: productDistribution.map(p => p.name || "Unknown"),
    datasets: [
      {
        label: "Units Sold",
        data: productDistribution.map(p => p.count || 0),
        backgroundColor: [
          "rgba(239, 68, 68, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(139, 92, 246, 0.7)",
          "rgba(245, 158, 11, 0.7)",
          "rgba(59, 130, 246, 0.7)",
        ],
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  }), [productDistribution]);

  const statusData = useMemo(() => ({
    labels: orderStatusData.map(s => s[0]?.toUpperCase() || "Unknown"),
    datasets: [
      {
        data: orderStatusData.map(s => s[1] || 0),
        backgroundColor: [
          "rgba(245, 158, 11, 0.7)",
          "rgba(59, 130, 246, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(239, 68, 68, 0.7)",
          "rgba(153, 102, 255, 0.7)",
          "rgba(201, 203, 207, 0.7)",
        ],
        hoverOffset: 4,
      },
    ],
  }), [orderStatusData]);

  // ---------------- Chart Options ----------------
  const baseChartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "top", labels: { font: { size: 12 } } } } };
  const revenueChartOptions = { 
    ...baseChartOptions, 
    plugins: { 
      ...baseChartOptions.plugins, 
      tooltip: { 
        callbacks: { label: (context) => `₹${(context.parsed.y || 0).toLocaleString()}` }, 
        backgroundColor: 'rgba(30, 41, 59, 0.9)',
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        padding: 10,
        displayColors: false,
        borderColor: 'rgba(99, 102, 241, 0.5)',
        borderWidth: 1,
      } 
    },
    interaction: { intersect: false, mode: 'index' },
    scales: { 
      y: { beginAtZero: true, ticks: { callback: (value) => `₹${(value || 0).toLocaleString()}`, font: { size: 11 } }, grid: { color: 'rgba(0, 0, 0, 0.03)' } },
      x: { grid: { display: false }, ticks: { font: { size: 11 } } }
    }
  };
  const barChartOptions = { ...baseChartOptions, scales: { y: { beginAtZero: true, ticks: { callback: (value) => `${value || 0} units`, font: { size: 10 } } }, x: { ticks: { font: { size: 10 } } } }, plugins: { ...baseChartOptions.plugins, tooltip: { callbacks: { label: (context) => `${context.parsed.y || 0} units sold` } } } };
  const pieChartOptions = { ...baseChartOptions, plugins: { ...baseChartOptions.plugins, tooltip: { callbacks: { label: (context) => `${context.label || 'Unknown'}: ${context.raw || 0} orders` } } } };

  // ---------------- MetricCard Component ----------------
  const MetricCard = ({ title, value, icon, color, subtext }) => {
    const colorClasses = getColorClasses(color);
    return (
      <div className={`p-5 rounded-xl shadow-sm border ${colorClasses.gradient} ${colorClasses.border} transition-all hover:shadow-md`}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm text-gray-500 font-medium mb-1">{title}</h3>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            {subtext && <div className="mt-1 text-xs text-gray-500">{subtext}</div>}
          </div>
          <div className={`p-2.5 rounded-lg ${colorClasses.bg} ${colorClasses.text}`}>{icon}</div>
        </div>
      </div>
    );
  };

  // ---------------- Loading & Error Handling ----------------
  if (loading) return <div className="max-w-7xl mx-auto p-6 min-h-screen">Loading...</div>;
  if (error) return <div className="max-w-7xl mx-auto p-6 min-h-screen text-red-500">{error}</div>;

  // ---------------- Main Render ----------------
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 min-h-screen">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
        <MetricCard title="Total Users" value={metrics.totalUsers} icon={<FiUsers size={20} />} color="blue" subtext={`${metrics.newCustomers} new this month`} />
        <MetricCard title="Total Products" value={metrics.totalProducts} icon={<FiPackage size={20} />} color="green" />
        <MetricCard title="Total Orders" value={metrics.totalOrders} icon={<FiShoppingBag size={17} />} color="purple" subtext="All time orders" />
        <MetricCard title="Total Revenue" value={`₹${(metrics.totalRevenue || 0).toLocaleString()}`} icon={<FiDollarSign size={12} />} color="amber" />
        <MetricCard title="Avg Order Value" value={`₹${(metrics.avgOrderValue || 0).toLocaleString()}`} icon={<FiTrendingUp size={15} />} subtext="Per order average" color="teal" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Monthly Revenue</h3>
          <div className="h-72"><Line data={revenueData} options={revenueChartOptions} /></div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Order Status Distribution</h3>
          <div className="h-72"><Pie data={statusData} options={pieChartOptions} /></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Top Selling Products</h3>
          <div className="h-72"><Bar data={productData} options={barChartOptions} /></div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Recent User Activity</h3>
          <table className="min-w-full">
            <thead><tr>
              <th>User</th><th>Last Active</th><th>Orders</th>
            </tr></thead>
            <tbody>
              {userActivity.slice(0, 5).map(u => (
                <tr key={u.id}>
                  <td>{u.name || 'Unknown'} <div className="text-xs">{u.email || 'Unknown'}</div></td>
                  <td>{u.lastLogin}</td>
                  <td>{u.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white p-5 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Recent Orders</h3>
        <table className="min-w-full">
          <thead><tr>
            <th>Order ID</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th>
          </tr></thead>
          <tbody>
            {recentOrders.map(order => (
              <tr key={order.id}>
                <td>#{order.id?.toString()?.slice(0,8)}</td>
                <td>{order.customerName} <div className="text-xs">{order.customerEmail}</div></td>
                <td>₹{(order.totalAmount || 0).toLocaleString()}</td>
                <td>{formatStatus(order.status)}</td>
                <td>{order.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
