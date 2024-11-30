import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import Slider from '@react-native-community/slider';

// Formato de fecha para mostrar en el rango
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

interface WeeklyStat {
  startWeek: string;
  endWeek: string;
  totalCounter: number;
  meanStreak: number;
  expectedCounter: number;
}

// Ajuste de ancho y alto de gráficos
const chartWidth = Dimensions.get('window').width / 3; // Reduce a un tercio
const chartHeight = 120;

// Gráfico de líneas con slider y manejo de datos vacíos
export function HabitCounterLineChart({
  data,
  habitTitle,
}: {
  data: WeeklyStat[];
  habitTitle: string;
}) {
  const [timeRange, setTimeRange] = useState(data.length); // Rango de tiempo ajustable

  if (data.length === 0) {
    // Mostrar mensaje "Sin información" si no hay datos
    return (
      <View style={styles.container}>
        <Text style={styles.header}>{habitTitle}</Text>
        <Text style={styles.subHeader}>Sin información disponible</Text>
        <View
          style={[
            styles.emptyChart,
            { width: chartWidth, height: chartHeight },
          ]}
        >
          <Text style={styles.emptyText}>Sin información</Text>
        </View>
      </View>
    );
  }

  const slicedData = data.slice(-timeRange);

  // Obtener las fechas de inicio y fin del rango seleccionado
  const startDate = formatDate(slicedData[0].startWeek);
  const endDate = formatDate(slicedData[slicedData.length - 1].endWeek);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{habitTitle}</Text>
      <Text style={styles.subHeader}>
        Counter de {timeRange} semana{timeRange === 1 ? '' : 's'}
      </Text>
      <LineChart
        data={{
          labels: slicedData.map((item) => item.startWeek),
          datasets: [
            {
              data: slicedData.map((item) => item.totalCounter),
              color: (opacity = 1) => `rgba(34, 139, 230, ${opacity})`,
              strokeWidth: 2,
            },
            {
              data: slicedData.map((item) => item.expectedCounter),
              color: (opacity = 1) => `rgba(255, 69, 58, ${opacity})`,
              strokeWidth: 2,
            },
          ],
          legend: ['Total Counter', 'Expected Counter'],
        }}
        width={chartWidth}
        height={chartHeight}
        chartConfig={{
          backgroundColor: '#000',
          backgroundGradientFrom: '#e0f7fa',
          backgroundGradientTo: '#fffafa',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        style={{ marginVertical: 8, borderRadius: 8 }}
      />
      <Text style={styles.sliderLabel}>
        Rango de tiempo: {startDate} a {endDate}
      </Text>
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={data.length}
        step={1}
        value={timeRange}
        onValueChange={(value) => setTimeRange(value)}
        minimumTrackTintColor="#228be6"
        maximumTrackTintColor="#d3d3d3"
      />
    </View>
  );
}

// Gráfico de pastel con slider y manejo de datos vacíos
export function HabitCounterCompletion({
  data,
  habitTitle,
}: {
  data: WeeklyStat[];
  habitTitle: string;
}) {
  const [timeRange, setTimeRange] = useState(data.length);

  if (data.length === 0) {
    // Mostrar gráfico de pastel gris si no hay datos
    const pieData = [
      {
        name: 'Sin información',
        population: 100,
        color: 'rgba(211, 211, 211, 1)', // Gris claro
        legendFontColor: '#000',
        legendFontSize: 12,
      },
    ];

    return (
      <View style={styles.container}>
        <Text style={styles.header}>{habitTitle}</Text>
        <Text style={styles.subHeader}>Sin información disponible</Text>
        <PieChart
          data={pieData}
          width={chartWidth}
          height={chartHeight}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor={'population'}
          backgroundColor={'transparent'}
          paddingLeft={'15'}
          absolute={true}
        />
      </View>
    );
  }

  const slicedData = data.slice(-timeRange);
  const achievedWeeks = slicedData.filter(
    (item) => item.totalCounter >= item.expectedCounter,
  ).length;
  const missedWeeks = slicedData.length - achievedWeeks;

  const pieData = [
    {
      name: 'Achieved',
      population: achievedWeeks,
      color: 'rgba(34, 139, 230, 1)',
      legendFontColor: '#000',
      legendFontSize: 12,
    },
    {
      name: 'Missed',
      population: missedWeeks,
      color: 'rgba(255, 69, 58, 1)',
      legendFontColor: '#000',
      legendFontSize: 12,
    },
  ];

  // Obtener las fechas de inicio y fin del rango seleccionado
  const startDate = formatDate(slicedData[0].startWeek);
  const endDate = formatDate(slicedData[slicedData.length - 1].endWeek);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{habitTitle}</Text>
      <Text style={styles.subHeader}>
        Completitud de {timeRange} semana{timeRange === 1 ? '' : 's'}
      </Text>
      <PieChart
        data={pieData}
        width={chartWidth}
        height={chartHeight}
        chartConfig={{
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor={'population'}
        backgroundColor={'transparent'}
        paddingLeft={'15'}
        absolute={true}
      />
      <Text style={styles.sliderLabel}>
        Rango de tiempo: {startDate} a {endDate}
      </Text>
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={data.length}
        step={1}
        value={timeRange}
        onValueChange={(value) => setTimeRange(value)}
        minimumTrackTintColor="#228be6"
        maximumTrackTintColor="#d3d3d3"
      />
    </View>
  );
}

// Datos ficticios
const mockWeeklyStats: WeeklyStat[] = [
  {
    startWeek: '2024-01-01',
    endWeek: '2024-01-07',
    totalCounter: 10,
    meanStreak: 2,
    expectedCounter: 8,
  },
  {
    startWeek: '2024-01-08',
    endWeek: '2024-01-14',
    totalCounter: 7,
    meanStreak: 3,
    expectedCounter: 8,
  },
  {
    startWeek: '2024-01-15',
    endWeek: '2024-01-21',
    totalCounter: 9,
    meanStreak: 4,
    expectedCounter: 8,
  },
  {
    startWeek: '2024-01-22',
    endWeek: '2024-01-28',
    totalCounter: 8,
    meanStreak: 5,
    expectedCounter: 8,
  },
  {
    startWeek: '2024-01-29',
    endWeek: '2024-02-04',
    totalCounter: 6,
    meanStreak: 3,
    expectedCounter: 8,
  },
];

// Mock con títulos
export function MockLineChart() {
  return <HabitCounterLineChart data={mockWeeklyStats} habitTitle="Lectura" />;
}

export function MockPieChart() {
  return <HabitCounterCompletion data={mockWeeklyStats} habitTitle="Lectura" />;
}

// Datos vacíos para simular gráficos sin información
const emptyWeeklyStats: WeeklyStat[] = [];

// Mock de gráfico de líneas con datos vacíos
export function MockEmptyLineChart() {
  return <HabitCounterLineChart data={emptyWeeklyStats} habitTitle="Trote" />;
}

// Mock de gráfico de pastel con datos vacíos
export function MockEmptyPieChart() {
  return <HabitCounterCompletion data={emptyWeeklyStats} habitTitle="Trote" />;
}

// Diccionario exportado
export function HabitCharts() {
  return {
    HabitCounterLineChart,
    HabitCounterCompletion,
    MockLineChart,
    MockPieChart,
    MockEmptyLineChart,
    MockEmptyPieChart,
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#f7f7f7',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 16,
    marginVertical: 4,
  },
  sliderLabel: {
    marginVertical: 4,
    fontSize: 14,
  },
  emptyChart: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  emptyText: {
    color: '#888',
    fontSize: 14,
    fontWeight: 'bold',
  },
  slider: {
    width: '90%',
    height: 40,
    paddingBottom: 30,
  },
});

export default HabitCharts;
