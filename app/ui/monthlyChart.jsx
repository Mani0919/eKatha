import React from 'react';
import { View, Text, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

// Function to get ordinal suffix
const getOrdinalSuffix = (number) => {
  const j = number % 10;
  const k = number % 100;
  if (j == 1 && k != 11) return number + "st";
  if (j == 2 && k != 12) return number + "nd";
  if (j == 3 && k != 13) return number + "rd";
  return number + "th";
};

// Validate monthly stats data
const isValidMonthlyStats = (stats) => {
  if (!stats || typeof stats !== 'object') return false;
  return Object.values(stats).every(stat => 
    stat && 
    typeof stat === 'object' && 
    'totalAmount' in stat &&
    'totalVisits' in stat
  );
};

const MonthlyStatsChart = ({ data }) => {
  // Enhanced data validation
  if (!data) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Loading statistics...</Text>
      </View>
    );
  }

  // Validate monthlyStats structure
  if (!data.monthlyStats || !isValidMonthlyStats(data.monthlyStats) || Object.keys(data.monthlyStats).length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No statistics available</Text>
      </View>
    );
  }

  // Safely transform data with error handling
  try {
    const barData = Object.entries(data.monthlyStats).map(([month, stats], index) => {
      const amount = Number(stats?.totalAmount) || 0;
      return {
        value: amount,
        label: getOrdinalSuffix(index + 1),
        topLabelComponent: () => (
          <Text style={styles.barTopLabel}>
            ₹{amount.toLocaleString()}
          </Text>
        ),
        frontColor: '#3b82f6',
        gradientColor: '#60a5fa',
        labelTextStyle: styles.barLabel,
        spacing: 12,
        labelWidth: 40,
      };
    });

    const maxValue = Math.max(...barData.map(item => item.value), 1); // Ensure non-zero
    const yAxisLabelCount = 5;
    const roundedMax = Math.ceil(maxValue / 1000) * 1000;

    return (
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Header Stats */}
          <View style={styles.headerCard}>
            <Text style={styles.headerTitle}>Monthly Performance</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  ₹{(Number(data.totalAmount) || 0).toLocaleString()}
                </Text>
                <Text style={styles.statLabel}>Total Revenue</Text>
              </View>
              <View style={[styles.statItem, styles.borderLeft]}>
                <Text style={styles.statValue}>
                  {(Number(data.totalVisits) || 0).toLocaleString()}
                </Text>
                <Text style={styles.statLabel}>Total Visits</Text>
              </View>
            </View>
          </View>

          {/* Chart Section */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Revenue Trend</Text>
            <View style={styles.chartWrapper}>
              {barData.length > 0 ? (
                <BarChart
                  data={barData}
                  width={Dimensions.get('window').width - 60}
                  height={220}
                  barWidth={28}
                  spacing={24}
                  hideRules
                  xAxisColor={'#ddd'}
                  xAxisLength={250}
                  yAxisColor={'#ddd'}
                  yAxisTextStyle={styles.yAxisText}
                  noOfSections={yAxisLabelCount}
                  maxValue={roundedMax || 1000} // Ensure non-zero
                  labelWidth={40}
                  barBorderRadius={6}
                  yAxisLabelWidth={60}
                  yAxisLabelPrefix="₹"
                  yAxisLabelSuffix="k"
                  formatYLabel={(label) => (parseInt(label) / 1000).toString()}
                  isAnimated
                  xAxisLabelTextStyle={styles.xAxisLabel}
                  renderTooltip={(item) => (
                    <View style={styles.tooltip}>
                      <Text style={styles.tooltipText}>
                        ₹{item.value.toLocaleString()}
                      </Text>
                    </View>
                  )}
                />
              ) : (
                <Text style={styles.emptyText}>No chart data available</Text>
              )}
            </View>
          </View>

          {/* Monthly Breakdown */}
          <View style={styles.breakdownCard}>
            <Text style={styles.breakdownTitle}>Monthly Breakdown</Text>
            {Object.entries(data.monthlyStats).map(([month, stats], index) => (
              <View key={month} style={styles.breakdownRow}>
                <View style={styles.monthContainer}>
                  <Text style={styles.monthText}>
                    {getOrdinalSuffix(index + 1)} Month
                  </Text>
                  <Text style={styles.visitText}>
                    {Number(stats?.totalVisits || 0).toLocaleString()} visits
                  </Text>
                </View>
                <Text style={styles.amountText}>
                  ₹{Number(stats?.totalAmount || 0).toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  } catch (error) {
    console.error('Error rendering MonthlyStatsChart:', error);
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Error loading statistics</Text>
      </View>
    );
  }
};

// ... (styles remain the same)
const styles = {
  // ... (previous styles remain the same)
  xAxisLabel: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
    // backgroundColor: '#f8fafc',
  },
  container: {
    padding: 16,
    gap: 16,
  },
  headerCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  borderLeft: {
    borderLeftWidth: 1,
    borderLeftColor: '#e2e8f0',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3b82f6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  chartWrapper: {
    marginTop: 10,
  },
  barTopLabel: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  barLabel: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
  },
  yAxisText: {
    color: '#64748b',
    fontSize: 12,
  },
  tooltip: {
    backgroundColor: '#1e293b',
    padding: 8,
    borderRadius: 6,
  },
  tooltipText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  breakdownCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  breakdownTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  monthContainer: {
    flex: 1,
  },
  monthText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  visitText: {
    fontSize: 13,
    color: '#64748b',
  },
  amountText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3b82f6',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
};

export default MonthlyStatsChart;