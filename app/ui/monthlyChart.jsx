import React from 'react';
import { View, Text, Dimensions, ActivityIndicator } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const MonthlyStatsChart = ({ data }) => {
  // Check if data is empty or invalid
  if (!data || !data.monthlyStats || Object.keys(data.monthlyStats).length === 0) {
    return (
      <View className="w-full bg-white p-4 rounded-lg shadow-sm items-center justify-center h-40">
        <Text className="text-gray-500">No data available</Text>
      </View>
    );
  }

  // Transform the monthlyStats data for the chart
  const chartData = {
    labels: Object.keys(data.monthlyStats),
    datasets: [
      {
        data: Object.values(data.monthlyStats).map(stat => stat?.totalAmount || 0),
      },
    ],
  };

  return (
    <View className="w-full bg-white p-4 rounded-lg shadow-sm">
      <View className="space-y-2">
        <Text className="text-xl font-semibold">Monthly Statistics</Text>
        <View className="flex flex-row justify-between">
          <Text className="text-sm text-gray-600">
            Total Visits: {data.totalVisits || 0}
          </Text>
          <Text className="text-sm text-gray-600">
            Total Amount: ₹{data.totalAmount || "0.00"}
          </Text>
        </View>
      </View>

      <View className="w-full mt-4">
        {chartData.datasets[0].data.length > 0 ? (
          <BarChart
            data={chartData}
            width={Dimensions.get('window').width - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
              labelColor: () => '#4b5563',
              style: {
                borderRadius: 16,
              },
              barPercentage: 0.7,
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
            showValuesOnTopOfBars={true}
            fromZero={true}
          />
        ) : (
          <View className="h-52 items-center justify-center">
            <Text className="text-gray-500">No chart data available</Text>
          </View>
        )}
      </View>

      <View className="mt-4 space-y-4">
        <Text className="text-lg font-medium">Monthly Breakdown</Text>
        {Object.entries(data.monthlyStats).map(([month, stats]) => (
          <View key={month} className="flex flex-row justify-between p-2 bg-gray-50 rounded-lg">
            <Text className="text-gray-700">{month}</Text>
            <View className="flex flex-row space-x-4">
              <Text className="text-gray-600">Visits: {stats?.totalVisits || 0}</Text>
              <Text className="text-gray-600">₹{(stats?.totalAmount || 0).toFixed(2)}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default MonthlyStatsChart;