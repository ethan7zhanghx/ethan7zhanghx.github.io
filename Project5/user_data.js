export const userData = {
    focusData: {
        labels: ['0:00', '2:00', '4:00', '6:00', '8:00', '10:00'],
        datasets: [{
            label: '专注度',
            data: [85, 88, 82, 90, 86, 89],
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            tension: 0.4,
            fill: true
        }]
    },

    weeklyData: {
        labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        datasets: [{
            label: '专注时长(小时)',
            data: [6.5, 7.2, 5.8, 8.1, 6.9, 4.2, 3.5],
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 1
        }]
    },

    teamData: {
        labels: ['团队平均', '您的表现'],
        datasets: [{
            data: [75, 89],
            backgroundColor: ['rgba(156, 163, 175, 0.8)', 'rgba(34, 197, 94, 0.8)'],
            borderColor: ['rgb(156, 163, 175)', 'rgb(34, 197, 94)'],
            borderWidth: 2
        }]
    },

    insights: {
        personal: "基于您过去30天的数据，AI发现您在上午9-11点的专注效率最高，建议将重要任务安排在这个时间段。"
    },

    schedule: [
        {
            task: "产品设计评审",
            time: "明天 9:00-10:30",
            priority: "high",
            label: "高优先级"
        },
        {
            task: "代码重构",
            time: "明天 14:00-16:00",
            priority: "medium",
            label: "适合时段"
        }
    ]
};
