import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { FiUsers, FiShoppingBag, FiDollarSign, FiPackage, FiTrendingUp } from "react-icons/fi";
import { format, subDays, isAfter } from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

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
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [productDistribution, setProductDistribution] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [userActivity, setUserActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          axios.get(`${API_BASE}/users`),
          axios.get(`${API_BASE}/products`),
          axios.get(`${API_BASE}/order`), // Fixed endpoint to /order
        ]);

        const totalRevenue = ordersRes.data.reduce((sum, order) => sum + order.totalAmount, 0);
        const avgOrderValue = ordersRes.data.length > 0 
          ? totalRevenue / ordersRes.data.length 
          : 0;
        
        const thirtyDaysAgo = subDays(new Date(), 30);
        const newCustomers = usersRes.data.filter(
          user => user.created_at && isAfter(new Date(user.created_at), thirtyDaysAgo)
        ).length;

        setMetrics({
          totalUsers: usersRes.data.length,
          totalProducts: productsRes.data.length,
          totalOrders: ordersRes.data.length,
          totalRevenue,
          newCustomers,
          avgOrderValue: parseFloat(avgOrderValue.toFixed(2)),
        });

        const sortedOrders = [...ordersRes.data]
          .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
          .slice(0, 5)
          .map(order => {
            const user = usersRes.data.find(u => u.id === order.userId);
            return {
              ...order,
              customerName: user ? user.name : 'Unknown',
              customerEmail: user ? user.email : 'Unknown',
              createdAt: order.orderDate ? format(new Date(order.orderDate), "MMM dd, yyyy") : 'N/A',
            };
          });
        setRecentOrders(sortedOrders);

        const monthlyRevenueData = Array(12).fill(0);
        ordersRes.data.forEach(order => {
          if (order.orderDate) {
            const month = new Date(order.orderDate).getMonth();
            monthlyRevenueData[month] += order.totalAmount;
          }
        });
        setMonthlyRevenue(monthlyRevenueData);

        const productSales = {};
        ordersRes.data.forEach(order => {
          // Handle missing items array
          const items = order.items || [];
          items.forEach(item => {  
            const product = productsRes.data.find(p => p.id === item.productId);
            if (product) {
              productSales[product.id] = productSales[product.id] || {
                name: product.name,
                image: product.image || null,
                count: 0,
                category: product.category,
              };
              productSales[product.id].count += item.quantity;
            }
          });
        });
        
        const sortedProducts = Object.values(productSales)
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        setProductDistribution(sortedProducts);

        const statusCount = {};
        ordersRes.data.forEach(order => {
          const status = order.status || 'pending';
          statusCount[status] = (statusCount[status] || 0) + 1;
        });
        setOrderStatusData(Object.entries(statusCount));

        const userOrderCountMap = ordersRes.data.reduce((acc, order) => {
          acc[order.userId] = (acc[order.userId] || 0) + 1;
          return acc;
        }, {});

        const userActivityData = usersRes.data
          .filter(user => !user.isAdmin) // Exclude admin users
          .map(user => ({
            ...user,
            lastLogin: user.lastLogin || null
          }))
          .sort((a, b) => {
            if (!a.lastLogin && !b.lastLogin) return 0;
            if (!a.lastLogin) return 1;
            if (!b.lastLogin) return -1;
            return new Date(b.lastLogin) - new Date(a.lastLogin);
          })
          .map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            lastLogin: user.lastLogin ? format(new Date(user.lastLogin), "MMM dd, yyyy") : 'Never logged in',
            orders: userOrderCountMap[user.id] || 0,
          }));
          
        setUserActivity(userActivityData);

        setLoading(false);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
        setError("Failed to load dashboard data. Please try again later.");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [API_BASE]);

  const getColorClasses = (color) => {
    switch (color) {
      case 'blue':
        return {
          gradient: 'bg-gradient-to-br from-blue-50 to-white',
          border: 'border-blue-100',
          bg: 'bg-blue-100',
          text: 'text-blue-600'
        };
      case 'green':
        return {
          gradient: 'bg-gradient-to-br from-green-50 to-white',
          border: 'border-green-100',
          bg: 'bg-green-100',
          text: 'text-green-600'
        };
      case 'purple':
        return {
          gradient: 'bg-gradient-to-br from-purple-50 to-white',
          border: 'border-purple-100',
          bg: 'bg-purple-100',
          text: 'text-purple-600'
        };
      case 'amber':
        return {
          gradient: 'bg-gradient-to-br from-amber-50 to-white',
          border: 'border-amber-100',
          bg: 'bg-amber-100',
          text: 'text-amber-600'
        };
      case 'teal':
        return {
          gradient: 'bg-gradient-to-br from-teal-50 to-white',
          border: 'border-teal-100',
          bg: 'bg-teal-100',
          text: 'text-teal-600'
        };
      default:
        return {
          gradient: 'bg-gradient-to-br from-gray-50 to-white',
          border: 'border-gray-100',
          bg: 'bg-gray-100',
          text: 'text-gray-600'
        };
    }
  };

  const revenueData = useMemo(() => ({
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
    datasets: [
      {
        label: "Revenue (₹)",
        data: monthlyRevenue,
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      },
    ],
  }), [monthlyRevenue]);

  const productData = useMemo(() => ({
    labels: productDistribution.map(p => p.name),
    datasets: [
      {
        label: "Units Sold",
        data: productDistribution.map(p => p.count),
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
    labels: orderStatusData.map(s => s[0].toUpperCase()),
    datasets: [
      {
        data: orderStatusData.map(s => s[1]),
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

  const baseChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: "top",
        labels: {
          font: {
            size: 12,
          }
        }
      }
    }
  };

  const revenueChartOptions = {
    ...baseChartOptions,
    plugins: {
      ...baseChartOptions.plugins,
      tooltip: {
        callbacks: {
          label: (context) => `₹${context.parsed.y.toLocaleString()}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `₹${value.toLocaleString()}`
        }
      }
    }
  };

  const barChartOptions = {
    ...baseChartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value} units`,
          font: {
            size: 10,
          }
        }
      },
      x: {
        ticks: {
          font: {
            size: 10,
          }
        }
      }
    },
    plugins: {
      ...baseChartOptions.plugins,
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y} units sold`
        }
      }
    }
  };

  const pieChartOptions = {
    ...baseChartOptions,
    plugins: {
      ...baseChartOptions.plugins,
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw} orders`
        }
      }
    }
  };

  const MetricCard = ({ title, value, icon, color, subtext }) => {
    const colorClasses = getColorClasses(color);
    
    return (
      <div className={`p-5 rounded-xl shadow-sm border ${colorClasses.gradient} ${colorClasses.border}`}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm text-gray-500 font-medium mb-1">{title}</h3>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            {subtext && <div className="mt-1 text-xs text-gray-500">{subtext}</div>}
          </div>
          <div className={`p-2.5 rounded-lg ${colorClasses.bg} ${colorClasses.text}`}>
            {icon}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-xl"></div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            <div className="lg:col-span-2 h-80 bg-gray-100 rounded-xl"></div>
            <div className="h-80 bg-gray-100 rounded-xl"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <div className="h-80 bg-gray-100 rounded-xl"></div>
            <div className="h-80 bg-gray-100 rounded-xl"></div>
          </div>
          
          <div className="h-96 bg-gray-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Reload Dashboard
          </button>
        </div>
      </div>
    );
  }

  const formatStatus = (status) => {
    const statusMap = {
      pending: "Pending",
      processing: "Processing",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
      refunded: "Refunded"
    };
    
    return statusMap[status.toLowerCase()] || status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Admin Dashboard</h2>
        <div className="text-sm text-gray-500">
          {format(new Date(), "EEEE, MMMM d, yyyy")}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
        <MetricCard 
          title="Total Users" 
          value={metrics.totalUsers} 
          icon={<FiUsers size={20} />} 
          color="blue"
          subtext={`${metrics.newCustomers} new this month`}
        />
        
        <MetricCard 
          title="Total Products" 
          value={metrics.totalProducts} 
          icon={<FiPackage size={20} />} 
          color="green"
        />
        
        <MetricCard 
          title="Total Orders" 
          value={metrics.totalOrders} 
          icon={<FiShoppingBag size={20} />} 
          color="purple"
          subtext="All time orders"
        />
        
        <MetricCard 
          title="Total Revenue" 
          value={`₹${metrics.totalRevenue.toLocaleString()}`} 
          icon={<FiDollarSign size={20} />} 
          color="amber"
        />
        
        <MetricCard 
          title="Avg Order Value" 
          value={`₹${metrics.avgOrderValue.toLocaleString()}`} 
          icon={<FiTrendingUp size={15} />} 
          color="teal"
          subtext="Per order average"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Monthly Revenue</h3>
          <div className="h-72">
            <Line data={revenueData} options={revenueChartOptions} />
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Order Status Distribution</h3>
          <div className="h-72">
            <Pie data={statusData} options={pieChartOptions} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Top Selling Products</h3>
          <div className="h-72">
            <Bar 
              data={productData} 
              options={barChartOptions} 
            />
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Recent User Activity</h3>
          <div className="overflow-hidden max-h-[288px] overflow-y-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Last Active</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {userActivity.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">{user.lastLogin}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
                        {user.orders}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {userActivity.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No user activity found
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Recent Orders</h3>
          <button
            onClick={() => navigate("/admin/orders")}
            className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center text-sm"
          >
            View All Orders
            <span className="ml-1">→</span>
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">
                    #{order.id.toString().slice(0, 8)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{order.customerName}</div>
                    <div className="text-sm text-gray-500">{order.customerEmail}</div>
                  </td>
                  <td className="py-3 px-4 font-semibold">₹{order.totalAmount.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      order.status === "delivered" 
                        ? "bg-green-100 text-green-800" 
                        : order.status === "cancelled" 
                          ? "bg-red-100 text-red-800" 
                          : order.status === "shipped"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "processing"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {formatStatus(order.status)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {order.createdAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {recentOrders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No orders found
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;