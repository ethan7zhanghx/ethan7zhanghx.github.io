document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    const pacingChartCanvas = document.getElementById('pacingChart');
    if (pacingChartCanvas) {
        const ctx = pacingChartCanvas.getContext('2d');

        const gradient = ctx.createLinearGradient(0, 0, 0, 150);
        gradient.addColorStop(0, 'rgba(96, 165, 250, 0.6)');
        gradient.addColorStop(1, 'rgba(96, 165, 250, 0.1)');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['开端', '建置', '转折', '高潮', '结局'],
                datasets: [{
                    label: '叙事节奏',
                    data: [20, 45, 40, 80, 30],
                    borderColor: 'rgba(96, 165, 250, 1)', // blue-400
                    backgroundColor: gradient,
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(224, 231, 255, 1)', // blue-100
                    pointBorderColor: 'rgba(96, 165, 250, 1)',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(96, 165, 250, 1)',
                    tension: 0.4,
                    fill: true,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(17, 24, 39, 0.8)', // gray-900
                        titleColor: 'rgba(209, 213, 219, 1)', // gray-300
                        bodyColor: 'rgba(156, 163, 175, 1)', // gray-400
                        borderColor: 'rgba(55, 65, 81, 1)', // gray-700
                        borderWidth: 1,
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(55, 65, 81, 0.5)' // gray-700
                        },
                        ticks: {
                            color: 'rgba(156, 163, 175, 1)', // gray-400
                            font: {
                                family: "'Noto Sans SC', sans-serif"
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: 'rgba(156, 163, 175, 1)', // gray-400
                            font: {
                                family: "'Noto Sans SC', sans-serif"
                            }
                        }
                    }
                }
            }
        });
    }
});
