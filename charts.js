// ===== Initialize Charts =====
function initCharts() {
    createMoodChart();
    createStressChart();
}

// ===== Mood Chart =====
function createMoodChart() {
    const canvas = document.getElementById('moodChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Check if chart already exists and destroy it
    if (window.moodChartInstance) {
        window.moodChartInstance.destroy();
    }
    
    // Mood data (1-5 scale)
    const moodData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Mood Level',
            data: [4, 3, 5, 2, 4, 5, 4],
            borderColor: '#556B4F',
            backgroundColor: 'rgba(85, 107, 79, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#556B4F',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8
        }]
    };
    
    const config = {
        type: 'line',
        data: moodData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(85, 107, 79, 0.9)',
                    titleFont: { family: 'Inter' },
                    bodyFont: { family: 'Inter' },
                    cornerRadius: 12,
                    padding: 12
                }
            },
            scales: {
                y: {
                    min: 1,
                    max: 5,
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            const moods = ['', 'Very Sad', 'Sad', 'Neutral', 'Happy', 'Very Happy'];
                            return moods[value] || '';
                        },
                        font: { family: 'Inter' }
                    },
                    grid: {
                        color: 'rgba(85, 107, 79, 0.06)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: { family: 'Inter' }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    };
    
    window.moodChartInstance = new Chart(ctx, config);
}

// ===== Stress Chart =====
function createStressChart() {
    const canvas = document.getElementById('stressChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Check if chart already exists and destroy it
    if (window.stressChartInstance) {
        window.stressChartInstance.destroy();
    }
    
    // Stress data (1-10 scale)
    const stressData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Stress Level',
            data: [3, 5, 7, 8, 4, 2, 3],
            backgroundColor: [
                'rgba(85, 107, 79, 0.6)',
                'rgba(85, 107, 79, 0.5)',
                'rgba(85, 107, 79, 0.4)',
                'rgba(85, 107, 79, 0.3)',
                'rgba(85, 107, 79, 0.2)',
                'rgba(85, 107, 79, 0.1)',
                'rgba(85, 107, 79, 0.05)'
            ],
            borderColor: '#556B4F',
            borderWidth: 2,
            borderRadius: 8,
            barPercentage: 0.6
        }]
    };
    
    const config = {
        type: 'bar',
        data: stressData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(85, 107, 79, 0.9)',
                    titleFont: { family: 'Inter' },
                    bodyFont: { family: 'Inter' },
                    cornerRadius: 12,
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            let level = 'Low';
                            if (value >= 7) level = 'High';
                            else if (value >= 4) level = 'Moderate';
                            return `Stress Level: ${value}/10 (${level})`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    min: 0,
                    max: 10,
                    ticks: {
                        stepSize: 2,
                        font: { family: 'Inter' }
                    },
                    grid: {
                        color: 'rgba(85, 107, 79, 0.06)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: { family: 'Inter' }
                    }
                }
            }
        }
    };
    
    window.stressChartInstance = new Chart(ctx, config);
}

// ===== Resize Handler =====
window.addEventListener('resize', function() {
    if (window.moodChartInstance) {
        window.moodChartInstance.resize();
    }
    if (window.stressChartInstance) {
        window.stressChartInstance.resize();
    }
});