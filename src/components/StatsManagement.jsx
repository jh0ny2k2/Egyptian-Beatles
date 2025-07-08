import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

function StatsManagement() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para los datos de estadísticas
  const [productStats, setProductStats] = useState({
    totalProducts: 0,
    categoryCounts: {},
    stockStatus: { inStock: 0, lowStock: 0, outOfStock: 0 }
  });
  
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    adminCount: 0,
    regularUserCount: 0,
    monthlyRegistrations: {}
  });
  
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    monthlySales: {},
    topProducts: []
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchProductStats(),
        fetchUserStats(),
        fetchOrderStats()
      ]);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      setError('Error al cargar las estadísticas');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductStats = async () => {
    try {
      // Obtener todos los productos
      const { data: products, error } = await supabase
        .from('productos')
        .select('*');

      if (error) throw error;

      // Calcular estadísticas
      const categoryCounts = {};
      const stockStatus = { inStock: 0, lowStock: 0, outOfStock: 0 };

      products.forEach(product => {
        // Contar por categoría
        categoryCounts[product.categoria] = (categoryCounts[product.categoria] || 0) + 1;
        
        // Contar por estado de stock
        if (product.stock === 0) {
          stockStatus.outOfStock++;
        } else if (product.stock < 5) {
          stockStatus.lowStock++;
        } else {
          stockStatus.inStock++;
        }
      });

      setProductStats({
        totalProducts: products.length,
        categoryCounts,
        stockStatus
      });
    } catch (error) {
      console.error('Error al cargar estadísticas de productos:', error);
    }
  };

  const fetchUserStats = async () => {
    try {
      // Obtener todos los usuarios
      const { data: users, error } = await supabase
        .from('usuarios')
        .select('*');

      if (error) throw error;

      // Calcular estadísticas
      const adminCount = users.filter(user => user.role === 'admin').length;
      const regularUserCount = users.length - adminCount;
      
      // Calcular registros mensuales (últimos 6 meses)
      const monthlyRegistrations = {};
      const today = new Date();
      const sixMonthsAgo = new Date(today);
      sixMonthsAgo.setMonth(today.getMonth() - 6);
      
      // Inicializar los últimos 6 meses
      for (let i = 0; i < 6; i++) {
        const date = new Date(today);
        date.setMonth(today.getMonth() - i);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        monthlyRegistrations[monthYear] = 0;
      }
      
      // Contar usuarios por mes de registro
      users.forEach(user => {
        if (user.created_at) {
          const createdAt = new Date(user.created_at);
          if (createdAt >= sixMonthsAgo) {
            const monthYear = `${createdAt.getMonth() + 1}/${createdAt.getFullYear()}`;
            if (monthlyRegistrations[monthYear] !== undefined) {
              monthlyRegistrations[monthYear]++;
            }
          }
        }
      });

      setUserStats({
        totalUsers: users.length,
        adminCount,
        regularUserCount,
        monthlyRegistrations
      });
    } catch (error) {
      console.error('Error al cargar estadísticas de usuarios:', error);
    }
  };

  const fetchOrderStats = async () => {
    try {
      // Obtener todos los pedidos
      const { data: orders, error } = await supabase
        .from('pedidos')
        .select('*, pedido_items(*)');

      if (error) throw error;

      // Calcular estadísticas
      let totalRevenue = 0;
      const monthlySales = {};
      const productSales = {};
      
      // Inicializar ventas mensuales (últimos 6 meses)
      const today = new Date();
      for (let i = 0; i < 6; i++) {
        const date = new Date(today);
        date.setMonth(today.getMonth() - i);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        monthlySales[monthYear] = 0;
      }
      
      // Procesar pedidos
      orders.forEach(order => {
        // Sumar ingresos totales
        totalRevenue += order.total || 0;
        
        // Agrupar ventas por mes
        if (order.created_at) {
          const createdAt = new Date(order.created_at);
          const monthYear = `${createdAt.getMonth() + 1}/${createdAt.getFullYear()}`;
          if (monthlySales[monthYear] !== undefined) {
            monthlySales[monthYear] += order.total || 0;
          }
        }
        
        // Contar ventas por producto
        if (order.pedido_items && Array.isArray(order.pedido_items)) {
          order.pedido_items.forEach(item => {
            if (item.producto_id) {
              productSales[item.producto_id] = (productSales[item.producto_id] || 0) + (item.cantidad || 1);
            }
          });
        }
      });
      
      // Obtener los 5 productos más vendidos
      const topProductIds = Object.entries(productSales)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(entry => entry[0]);
      
      // Obtener detalles de los productos más vendidos
      const { data: topProductsData } = await supabase
        .from('productos')
        .select('id, nombre, precio')
        .in('id', topProductIds);
      
      // Combinar con la cantidad vendida
      const topProducts = topProductsData.map(product => ({
        ...product,
        vendidos: productSales[product.id] || 0
      })).sort((a, b) => b.vendidos - a.vendidos);

      setOrderStats({
        totalOrders: orders.length,
        totalRevenue,
        monthlySales,
        topProducts
      });
    } catch (error) {
      console.error('Error al cargar estadísticas de pedidos:', error);
    }
  };

  // Preparar datos para los gráficos
  const prepareCategoryChartData = () => {
    const labels = Object.keys(productStats.categoryCounts);
    const data = labels.map(category => productStats.categoryCounts[category]);
    
    return {
      labels,
      datasets: [
        {
          label: 'Productos por Categoría',
          data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const prepareStockChartData = () => {
    return {
      labels: ['En Stock', 'Stock Bajo', 'Sin Stock'],
      datasets: [
        {
          label: 'Estado de Stock',
          data: [
            productStats.stockStatus.inStock,
            productStats.stockStatus.lowStock,
            productStats.stockStatus.outOfStock
          ],
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(255, 99, 132, 0.6)'
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const prepareUserRoleChartData = () => {
    return {
      labels: ['Administradores', 'Usuarios Regulares'],
      datasets: [
        {
          label: 'Distribución de Roles',
          data: [userStats.adminCount, userStats.regularUserCount],
          backgroundColor: [
            'rgba(153, 102, 255, 0.6)',
            'rgba(54, 162, 235, 0.6)'
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const prepareMonthlyRegistrationsChartData = () => {
    const sortedMonths = Object.keys(userStats.monthlyRegistrations).sort((a, b) => {
      const [monthA, yearA] = a.split('/');
      const [monthB, yearB] = b.split('/');
      return new Date(yearA, monthA - 1) - new Date(yearB, monthB - 1);
    });
    
    return {
      labels: sortedMonths,
      datasets: [
        {
          label: 'Registros Mensuales',
          data: sortedMonths.map(month => userStats.monthlyRegistrations[month]),
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          tension: 0.1,
          fill: true,
        },
      ],
    };
  };

  const prepareMonthlySalesChartData = () => {
    const sortedMonths = Object.keys(orderStats.monthlySales).sort((a, b) => {
      const [monthA, yearA] = a.split('/');
      const [monthB, yearB] = b.split('/');
      return new Date(yearA, monthA - 1) - new Date(yearB, monthB - 1);
    });
    
    return {
      labels: sortedMonths,
      datasets: [
        {
          label: 'Ventas Mensuales (€)',
          data: sortedMonths.map(month => orderStats.monthlySales[month]),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1,
          fill: true,
        },
      ],
    };
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold mb-4">Estadísticas de la Tienda</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div>
          {/* Resumen de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Productos</h3>
              <div className="text-3xl font-bold">{productStats.totalProducts}</div>
              <p className="text-gray-500 mt-1">Total de productos</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Usuarios</h3>
              <div className="text-3xl font-bold">{userStats.totalUsers}</div>
              <p className="text-gray-500 mt-1">Usuarios registrados</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ventas</h3>
              <div className="text-3xl font-bold">{orderStats.totalOrders}</div>
              <p className="text-gray-500 mt-1">Pedidos realizados</p>
            </div>
          </div>
          
          {/* Gráficos de productos */}
          <div className="mb-12">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Estadísticas de Productos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="text-md font-medium mb-2">Productos por Categoría</h4>
                <div className="h-64">
                  <Bar data={prepareCategoryChartData()} options={{ maintainAspectRatio: false }} />
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="text-md font-medium mb-2">Estado de Stock</h4>
                <div className="h-64">
                  <Pie data={prepareStockChartData()} options={{ maintainAspectRatio: false }} />
                </div>
              </div>
            </div>
          </div>
          
          {/* Gráficos de usuarios */}
          <div className="mb-12">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Estadísticas de Usuarios</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="text-md font-medium mb-2">Distribución de Roles</h4>
                <div className="h-64">
                  <Pie data={prepareUserRoleChartData()} options={{ maintainAspectRatio: false }} />
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="text-md font-medium mb-2">Registros Mensuales</h4>
                <div className="h-64">
                  <Line data={prepareMonthlyRegistrationsChartData()} options={{ maintainAspectRatio: false }} />
                </div>
              </div>
            </div>
          </div>
          
          {/* Gráficos de ventas */}
          <div className="mb-12">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Estadísticas de Ventas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="text-md font-medium mb-2">Ventas Mensuales</h4>
                <div className="h-64">
                  <Line data={prepareMonthlySalesChartData()} options={{ maintainAspectRatio: false }} />
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="text-md font-medium mb-2">Productos Más Vendidos</h4>
                <div className="overflow-y-auto h-64">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendidos</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orderStats.topProducts.map((product) => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.nombre}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.precio}€</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.vendidos}</td>
                        </tr>
                      ))}
                      {orderStats.topProducts.length === 0 && (
                        <tr>
                          <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">No hay datos de ventas</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StatsManagement;