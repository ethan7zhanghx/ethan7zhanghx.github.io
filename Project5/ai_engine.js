export class AIEngine {
    constructor() {
        this.interventionMessages = [
            "检测到您正在浏览社交媒体，这可能会影响专注度。建议关闭不相关的标签页。",
            "您的心率似乎有些偏高，建议稍作休息，进行几次深呼吸。",
            "注意到您切换任务过于频繁，建议一次只专注于一个子任务。",
            "长时间未喝水？保持水分对维持认知功能很重要。",
            "看起来您有些困惑，需要暂停5分钟，重新梳理一下思路吗？"
        ];

        this.breakSuggestions = {
            short: [
                { icon: "wind", title: "深呼吸放松", description: "进行2分钟的4-7-8呼吸法，快速恢复注意力。", duration: "2分钟" },
                { icon: "eye", title: "远眺窗外", description: "花2分钟时间远眺窗外或闭目养神，缓解眼部疲劳。", duration: "2分钟" }
            ],
            medium: [
                { icon: "coffee", title: "轻度活动", description: "起身走动，做简单的拉伸运动，补充水分。", duration: "5分钟" },
                { icon: "music", title: "听首好歌", description: "听一首轻松的音乐，让大脑放松一下。", duration: "5分钟" }
            ],
            long: [
                { icon: "brain", title: "正念冥想", description: "进行10分钟的引导式冥想，彻底清空思绪，为下一个任务做好准备。", duration: "10分钟" },
                { icon: "walk", title: "散步片刻", description: "在室内或室外散步15分钟，活动身体，呼吸新鲜空气。", duration: "15分钟" }
            ]
        };
    }

    analyzeTask(taskText) {
        let pomodoros = 1 + Math.floor(Math.random() * 2);
        let cognitiveLoad = "低";
        const subtasks = [];
        const keywords = {
            '报告': { p: 1, load: '中等' },
            '设计': { p: 1, load: '中等' },
            '编码': { p: 2, load: '高' },
            '开发': { p: 2, load: '高' },
            '研究': { p: 2, load: '高' },
            '学习': { p: 1, load: '中等' },
            '规划': { p: 0, load: '低' },
        };

        for (const key in keywords) {
            if (taskText.includes(key)) {
                pomodoros += keywords[key].p;
                cognitiveLoad = keywords[key].load;
            }
        }
        if (taskText.length > 20) pomodoros += 1;
        
        pomodoros = Math.min(Math.max(pomodoros, 1), 4);

        if (taskText.includes("报告")) {
            subtasks.push({ name: "资料收集与分析", estimatedTime: "25分钟" });
            subtasks.push({ name: "撰写初稿", estimatedTime: "50分钟" });
            subtasks.push({ name: "审校与修改", estimatedTime: "25分钟" });
        } else if (taskText.includes("设计") || taskText.includes("界面")) {
             subtasks.push({ name: "需求理解与草图绘制", estimatedTime: "25分钟" });
             subtasks.push({ name: "高保真原型设计", estimatedTime: "50分钟" });
             subtasks.push({ name: "交互细节完善", estimatedTime: "25分钟" });
        } else if (taskText.includes("编码") || taskText.includes("开发")) {
             subtasks.push({ name: "功能逻辑实现", estimatedTime: "50分钟" });
             subtasks.push({ name: "编写单元测试", estimatedTime: "25分钟" });
             subtasks.push({ name: "代码重构与优化", estimatedTime: "25分钟" });
        } else {
             subtasks.push({ name: "任务拆解与规划", estimatedTime: "25分钟" });
             subtasks.push({ name: "核心部分执行", estimatedTime: `${Math.max(pomodoros - 1, 1) * 25}分钟` });
             if(pomodoros > 2) subtasks.push({ name: "检查与复盘", estimatedTime: "25分钟" });
        }
        
        const environmentSuggestions = [
            { icon: "volume-x", title: "静音环境", description: "关闭所有通知，保持专注" }
        ];
        if (cognitiveLoad === "高") {
            environmentSuggestions.push({ icon: "coffee", title: "保持精力", description: "准备好水或提神饮料" });
        }

        return {
            suggestedPomodoros: pomodoros,
            cognitiveLoad: cognitiveLoad,
            subtasks: subtasks.slice(0, pomodoros),
            environmentSuggestions: environmentSuggestions,
            priorityRecommendation: "AI建议：这是一个" + cognitiveLoad + "负荷任务，请确保为其分配连续、无干扰的时间段。",
        };
    }

    getDistractionIntervention() {
        const randomIndex = Math.floor(Math.random() * this.interventionMessages.length);
        return this.interventionMessages[randomIndex];
    }

    getBreakSuggestion(pomodorosCompleted) {
         let suggestionSet;
         if (pomodorosCompleted >= 3) {
             suggestionSet = this.breakSuggestions.long;
         } else if (pomodorosCompleted >= 2) {
             suggestionSet = this.breakSuggestions.medium;
         } else {
             suggestionSet = this.breakSuggestions.short;
         }
         const randomIndex = Math.floor(Math.random() * suggestionSet.length);
         const suggestion = suggestionSet[randomIndex];

         return {
             ...suggestion,
             reasoning: `您已连续完成 ${pomodorosCompleted} 个番茄钟，适合进行一次${suggestion.duration}的${suggestion.title}来恢复精力。`
         };
    }

    generateReviewInsights(sessionData) {
        const { task, focusDuration, distractionCount } = sessionData;
        
        let insights = `在“${task}”任务中，您总共专注了 ${focusDuration} 分钟。`;
        let suggestions = "";

        if (distractionCount > 2) {
            insights += `共记录到 ${distractionCount} 次分心。这是一个需要注意的信号。`;
            suggestions = "建议在开始下一个任务前，整理好工作区，并关闭不必要的应用和通知，尝试创造一个更专注的环境。";
        } else if (distractionCount > 0) {
            insights += `分心次数为 ${distractionCount} 次，控制得不错。`;
            suggestions = "继续保持！尝试在下一个专注周期中挑战零分心。";
        } else {
            insights += "整个过程零分心，非常棒！您的专注能力令人印象深刻。";
            suggestions = "您的工作模式非常高效，请继续保持这个良好的势头！";
        }
        
        if (task.includes("编码") && distractionCount > 1) {
            suggestions += " 对于编码类任务，预先规划好函数和逻辑可以有效减少中途查询资料导致的分心。";
        }
        if (task.includes("报告") && focusDuration > 50) {
            suggestions += " 长时间撰写报告容易导致思维疲劳，下次可以尝试每2个番茄钟就进行一次5分钟的短休息。";
        }

        const focusScore = Math.max(50, 100 - distractionCount * 15 - Math.max(0, 25 - focusDuration) * 2);
        const efficiency = `+${Math.floor(focusScore / 10)}%`;

        return {
            insights: insights,
            suggestions: suggestions,
            focusScore: Math.round(focusScore),
            efficiency: efficiency
        };
    }
}
