export const mockData = {
    analysis: {
        pomodoros: "6-8",
        cognitiveLoad: "高",
        subTasks: [
            "规划演示结构及核心信息",
            "收集数据并制作核心幻灯片（问题、解决方案）",
            "设计视觉元素并最终敲定幻灯片",
            "撰写并演练演讲者笔记"
        ]
    },
    intervention: {
        message: "AI检测到您在执行高强度任务时出现了分心模式。为保护您的心流状态，我可以暂时屏蔽非必要通知。是否继续？"
    },
    break: {
        recommendation: {
            icon: "coffee",
            title: "短暂的正念散步",
            description: "您上一个专注时段的强度非常高。AI建议进行一次短暂的正念散步。这种特定的活动被证明可以改善血液流动、重置认知通路，从而为您下一个工作单元激发创造力。"
        }
    },
    review: {
        chartData: {
            labels: ["0分", "5分", "10分", "15分", "20分", "25分"],
            data: [90, 85, 95, 30, 80, 85],
            distractionPoint: 3
        },
        insights: {
            personal: "您在处理创造性任务时能保持高度专注，但在15分钟左右容易受到干扰。此模式表明，通过预设的微休息来分解较长的创意工作，可以显著提升您的持续专注力。",
            predictive: "对于您下一个关于“设计视觉元素”的任务，AI建议采用一个20分钟的专注时段，然后进行5分钟的微休息，以主动管理认知负荷并保持巅峰的创造力。"
        }
    }
};
