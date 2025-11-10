'use client'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

// Third Party Imports
import type { ApexOptions } from 'apexcharts'

// Service Imports
import type { ScoreDistributionItem } from '@/services/dashboard.service'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

type ScoreDistributionChartProps = {
  data: ScoreDistributionItem[]
}

const ScoreDistributionChart = ({ data }: ScoreDistributionChartProps) => {
  // Hooks
  const theme = useTheme()

  // Prepare chart data
  const categories = data.map((item) => item.range)
  const seriesData = data.map((item) => item.count)

  const series = [
    {
      name: 'Số lượng',
      data: seriesData
    }
  ]

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
      type: 'bar'
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: '60%',
        distributed: true,
        dataLabels: {
          position: 'top'
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => val.toString(),
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ['var(--mui-palette-text-primary)']
      }
    },
    colors: [
      'var(--mui-palette-error-main)',
      'var(--mui-palette-warning-main)',
      'var(--mui-palette-info-main)',
      'var(--mui-palette-success-main)'
    ],
    grid: {
      borderColor: 'var(--mui-palette-divider)',
      strokeDashArray: 6,
      xaxis: {
        lines: { show: false }
      },
      yaxis: {
        lines: { show: true }
      },
      padding: {
        top: -10,
        left: -7,
        right: 5,
        bottom: 5
      }
    },
    legend: {
      show: false
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} học sinh`
      }
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          fontSize: '12px',
          colors: 'var(--mui-palette-text-secondary)'
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px',
          colors: 'var(--mui-palette-text-secondary)'
        },
        formatter: (val: number) => Math.floor(val).toString()
      }
    },
    responsive: [
      {
        breakpoint: theme.breakpoints.values.xl,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '50%'
            }
          }
        }
      },
      {
        breakpoint: theme.breakpoints.values.lg,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '60%'
            }
          }
        }
      },
      {
        breakpoint: theme.breakpoints.values.md,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '70%'
            }
          }
        }
      }
    ]
  }

  return (
    <Card>
      <CardHeader
        title='Phân bố điểm số'
        subheader='Thống kê số lượng học sinh theo từng khoảng điểm'
      />
      <CardContent>
        <AppReactApexCharts type='bar' height={350} width='100%' series={series} options={options} />
        <div className='flex flex-wrap gap-4 mt-4'>
          {data.map((item, index) => (
            <div key={index} className='flex items-center gap-2'>
              <div
                className='w-3 h-3 rounded'
                style={{
                  backgroundColor:
                    index === 0
                      ? 'var(--mui-palette-error-main)'
                      : index === 1
                        ? 'var(--mui-palette-warning-main)'
                        : index === 2
                          ? 'var(--mui-palette-info-main)'
                          : 'var(--mui-palette-success-main)'
                }}
              />
              <Typography variant='body2' color='text.secondary'>
                {item.range}: {item.count} học sinh
              </Typography>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default ScoreDistributionChart

