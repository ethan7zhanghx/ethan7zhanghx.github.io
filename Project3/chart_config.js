export function createFocusChart(data) {
    const ctx = document.getElementById('focus-realtime-chart');
    if (!ctx) {
        console.error("Canvas element for realtime chart not found!");
        return null;
    }

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: '专注度',
                data: data.values,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    display: false
                },
                y: {
                    display: false,
                    min: 50,
                    max: 100
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            animation: {
                duration: 750
            }
        }
    });
}

export function createWeeklyChart(data) {
    const ctx = document.getElementById('weekly-chart');
    if (!ctx) {
        console.error("Canvas element for weekly chart not found!");
        return null;
    }

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: '专注时长',
                data: data.focusHours,
                backgroundColor: '#3b82f6',
                borderRadius: 4,
                maxBarThickness: 30
            }, {
                label: '完成任务',
                data: data.completedTasks,
                backgroundColor: '#10b981',
                borderRadius: 4,
                maxBarThickness: 30
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,
                        padding: 15,
                        font: {
                            size: 11
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 10
                        }
                    }
                },
                y: {
                    grid: {
                        color: '#f1f5f9'
                    },
                    ticks: {
                        font: {
                            size: 10
                        }
                    }
                }
            }
        }
    });
}

export function createTeamChart(data) {
    const ctx = document.getElementById('team-chart');
    if (!ctx) {
        console.error("Canvas element for team chart not found!");
        return null;
    }

    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.values,
                backgroundColor: [
                    '#3b82f6',
                    '#10b981',
                    '#f59e0b',
                    '#ef4444'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        boxWidth: 8,
                        padding: 10,
                        font: {
                            size: 10
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });
}
