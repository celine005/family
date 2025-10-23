// 数据结构定义
const familyData = {
    "沟通": {
        icon: "💬",
        subcategories: {
            "语言沟通": {
                icon: "🗣️",
                items: {
                    "日常闲聊": { description: "生活琐事、工作分享", score: 1 },
                    "问题协商": { description: "家庭决策、矛盾解决", score: 1 },
                    "情感表达": { description: "夸赞、道歉、倾诉委屈", score: 1 }
                }
            },
            "表情沟通": {
                icon: "😊",
                items: {
                    "积极表情": { description: "微笑、点头、眼神鼓励", score: 1 },
                    "消极表情": { description: "皱眉、冷漠、不耐烦", score: -1 }
                }
            },
            "肢体沟通": {
                icon: "🤗",
                items: {
                    "亲密动作": { description: "拥抱、牵手、拍肩安慰", score: 1 },
                    "排斥动作": { description: "推开、转身背对、拒绝接触", score: -1 }
                }
            }
        }
    },
    "家务": {
        icon: "🏠",
        subcategories: {
            "日常清洁": {
                icon: "🧹",
                items: {
                    "家居打扫": { description: "扫地、拖地、擦家具", score: 1 },
                    "厨卫清洁": { description: "洗碗、刷马桶、清理油烟机", score: 1 },
                    "衣物处理": { description: "洗衣、晾衣、叠衣、熨烫", score: 1 }
                }
            },
            "饮食相关": {
                icon: "🍳",
                items: {
                    "食材采购": { description: "买菜、买日用品", score: 1 },
                    "餐食制作": { description: "做饭、煲汤、准备早餐", score: 1 },
                    "餐后整理": { description: "收拾餐桌、倒垃圾", score: 1 }
                }
            },
            "家居维护": {
                icon: "🔧",
                items: {
                    "物品收纳": { description: "整理衣柜、书架、抽屉", score: 1 },
                    "家电维护": { description: "简单维修、定期清洁家电", score: 1 },
                    "环境布置": { description: "换床单、装饰房间", score: 1 }
                }
            }
        }
    },
    "孩子": {
        icon: "👶",
        subcategories: {
            "教育辅导": {
                icon: "📚",
                items: {
                    "学业帮助": { description: "辅导作业、检查试卷、讲解知识点", score: 1 },
                    "兴趣培养": { description: "陪练乐器、辅导绘画、报兴趣班", score: 1 },
                    "习惯养成": { description: "监督作息、纠正不良习惯、培养阅读习惯", score: 1 }
                }
            },
            "生活照料": {
                icon: "🍼",
                items: {
                    "日常陪护": { description: "接送上学/兴趣班、陪玩、哄睡", score: 1 },
                    "健康管理": { description: "带看病、喂药、记录疫苗、关注饮食营养", score: 1 },
                    "物品准备": { description: "买衣服、书包、文具、整理书包", score: 1 }
                }
            },
            "亲子互动": {
                icon: "🎮",
                items: {
                    "家庭活动": { description: "陪逛公园、看电影、做手工", score: 1 },
                    "情感陪伴": { description: "倾听孩子心事、安慰情绪、解答疑问", score: 1 },
                    "规则建立": { description: "制定家庭规则、执行奖惩、教孩子社交礼仪", score: 1 }
                }
            }
        }
    }
};

// 全局变量
let maleScores = {};
let femaleScores = {};
let currentPhase = 'male';

// 初始化分数对象
function initializeScores() {
    for (let category in familyData) {
        maleScores[category] = {};
        femaleScores[category] = {};
        for (let subcategory in familyData[category].subcategories) {
            maleScores[category][subcategory] = {};
            femaleScores[category][subcategory] = {};
            for (let item in familyData[category].subcategories[subcategory].items) {
                maleScores[category][subcategory][item] = 0;
                femaleScores[category][subcategory][item] = 0;
            }
        }
    }
}

// 渲染分类界面
function renderCategories(containerId, gender) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    for (let categoryName in familyData) {
        const category = familyData[categoryName];
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';
        
        categoryDiv.innerHTML = `
            <div class="category-header" onclick="toggleCategory('${categoryName}', '${gender}')">
                <span class="category-icon">${category.icon}</span>
                <span class="category-name">${categoryName}</span>
                <span class="category-score">${getCategoryScore(categoryName, gender)}</span>
                <span class="toggle-icon">▼</span>
            </div>
            <div class="subcategories" id="${gender}-${categoryName}-subcategories">
                ${renderSubcategories(categoryName, gender)}
            </div>
        `;
        
        container.appendChild(categoryDiv);
    }
}

// 渲染子分类
function renderSubcategories(categoryName, gender) {
    const category = familyData[categoryName];
    let html = '';
    
    for (let subcategoryName in category.subcategories) {
        const subcategory = category.subcategories[subcategoryName];
        html += `
            <div class="subcategory">
                <div class="subcategory-header" onclick="toggleSubcategory('${categoryName}', '${subcategoryName}', '${gender}')">
                    <span class="subcategory-icon">${subcategory.icon}</span>
                    <span class="subcategory-name">${subcategoryName}</span>
                    <span class="subcategory-score">${getSubcategoryScore(categoryName, subcategoryName, gender)}</span>
                    <span class="toggle-icon">▼</span>
                </div>
                <div class="items" id="${gender}-${categoryName}-${subcategoryName}-items">
                    ${renderItems(categoryName, subcategoryName, gender)}
                </div>
            </div>
        `;
    }
    
    return html;
}

// 渲染具体事项
function renderItems(categoryName, subcategoryName, gender) {
    const subcategory = familyData[categoryName].subcategories[subcategoryName];
    let html = '';
    
    for (let itemName in subcategory.items) {
        const item = subcategory.items[itemName];
        const currentCount = getCurrentScore(categoryName, subcategoryName, itemName, gender);
        
        html += `
            <div class="item">
                <div class="item-info">
                    <div class="item-name">${itemName}</div>
                    <div class="item-description">${item.description}</div>
                </div>
                <div class="item-controls">
                    <span class="item-count">${currentCount}</span>
                    <button class="add-btn" onclick="addScore('${categoryName}', '${subcategoryName}', '${itemName}', '${gender}')">+</button>
                </div>
            </div>
        `;
    }
    
    return html;
}

// 获取当前分数
function getCurrentScore(category, subcategory, item, gender) {
    const scores = gender === 'male' ? maleScores : femaleScores;
    return scores[category][subcategory][item] || 0;
}

// 获取子分类总分
function getSubcategoryScore(category, subcategory, gender) {
    const scores = gender === 'male' ? maleScores : femaleScores;
    let total = 0;
    for (let item in scores[category][subcategory]) {
        const itemScore = scores[category][subcategory][item];
        const itemData = familyData[category].subcategories[subcategory].items[item];
        total += itemScore * itemData.score;
    }
    return total;
}

// 获取大分类总分
function getCategoryScore(category, gender) {
    let total = 0;
    for (let subcategory in familyData[category].subcategories) {
        total += getSubcategoryScore(category, subcategory, gender);
    }
    return total;
}

// 获取总分
function getTotalScore(gender) {
    let total = 0;
    for (let category in familyData) {
        total += getCategoryScore(category, gender);
    }
    return total;
}

// 添加分数
function addScore(category, subcategory, item, gender) {
    const scores = gender === 'male' ? maleScores : femaleScores;
    scores[category][subcategory][item]++;
    
    // 更新显示
    updateScoreDisplays(gender);
    
    // 重新渲染当前项目的计数
    const itemElement = event.target.parentElement.querySelector('.item-count');
    itemElement.textContent = scores[category][subcategory][item];
    
    // 更新分类和子分类的分数显示
    updateCategoryScores(category, subcategory, gender);
}

// 更新分数显示
function updateScoreDisplays(gender) {
    const scoreElement = document.getElementById(gender + 'Score');
    scoreElement.textContent = getTotalScore(gender);
}

// 更新分类分数显示
function updateCategoryScores(category, subcategory, gender) {
    // 更新子分类分数
    const subcategoryScoreElement = document.querySelector(`#${gender}-${category}-${subcategory}-items`).parentElement.querySelector('.subcategory-score');
    if (subcategoryScoreElement) {
        subcategoryScoreElement.textContent = getSubcategoryScore(category, subcategory, gender);
    }
    
    // 更新大分类分数
    const categoryScoreElement = document.querySelector(`#${gender}-${category}-subcategories`).parentElement.querySelector('.category-score');
    if (categoryScoreElement) {
        categoryScoreElement.textContent = getCategoryScore(category, gender);
    }
}

// 切换分类展开/收起
function toggleCategory(categoryName, gender) {
    const subcategoriesDiv = document.getElementById(`${gender}-${categoryName}-subcategories`);
    const toggleIcon = event.target.closest('.category-header').querySelector('.toggle-icon');
    
    if (subcategoriesDiv.style.display === 'none' || subcategoriesDiv.style.display === '') {
        subcategoriesDiv.style.display = 'block';
        toggleIcon.textContent = '▲';
    } else {
        subcategoriesDiv.style.display = 'none';
        toggleIcon.textContent = '▼';
    }
}

// 切换子分类展开/收起
function toggleSubcategory(categoryName, subcategoryName, gender) {
    const itemsDiv = document.getElementById(`${gender}-${categoryName}-${subcategoryName}-items`);
    const toggleIcon = event.target.closest('.subcategory-header').querySelector('.toggle-icon');
    
    if (itemsDiv.style.display === 'none' || itemsDiv.style.display === '') {
        itemsDiv.style.display = 'block';
        toggleIcon.textContent = '▲';
    } else {
        itemsDiv.style.display = 'none';
        toggleIcon.textContent = '▼';
    }
}

// 切换阶段
function switchPhase(phase) {
    // 隐藏所有阶段
    document.querySelectorAll('.phase-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.phase-btn').forEach(el => el.classList.remove('active'));
    
    // 显示选中阶段
    if (phase === 'male') {
        document.getElementById('malePhase').classList.add('active');
        document.getElementById('malePhaseBtn').classList.add('active');
    } else if (phase === 'female') {
        document.getElementById('femalePhase').classList.add('active');
        document.getElementById('femalePhaseBtn').classList.add('active');
    } else if (phase === 'result') {
        document.getElementById('resultPhase').classList.add('active');
        document.getElementById('resultPhaseBtn').classList.add('active');
        showResults();
    }
}

// 显示结果
function showResults() {
    const maleTotal = getTotalScore('male');
    const femaleTotal = getTotalScore('female');
    
    document.getElementById('finalMaleScore').textContent = maleTotal;
    document.getElementById('finalFemaleScore').textContent = femaleTotal;
    
    // 先生成建议，确保即使图表库未加载也能显示建议
    generateSuggestions(maleTotal, femaleTotal);
    
    // 再尝试创建图表
    createChart(maleTotal, femaleTotal);
}

// 创建对比图表
 function createChart(maleTotal, femaleTotal) {
     const container = document.querySelector('.chart-container');
     let canvas = document.getElementById('comparisonChart');

     // 如果canvas被之前的降级提示替换了，则重新创建canvas
     if (!canvas && container) {
         container.innerHTML = '<canvas id="comparisonChart"></canvas>';
         canvas = document.getElementById('comparisonChart');
     }

     if (!canvas) return; // 无法获取canvas则退出
     const ctx = canvas.getContext('2d');
 
     // 新增：统一计算各大类分数，供Chart.js与手绘两种路径共用
     const maleCategories = [];
     const femaleCategories = [];
     const categoryNames = [];
     for (let category in familyData) {
         categoryNames.push(category);
         maleCategories.push(getCategoryScore(category, 'male'));
         femaleCategories.push(getCategoryScore(category, 'female'));
     }
 
     // 如果图表库未加载，提供友好提示或手绘渲染
     if (typeof Chart === 'undefined') {
         // 使用Canvas手绘一个简单的分组柱状图
         // 设置canvas尺寸
         const containerWidth = (container && container.clientWidth) ? container.clientWidth : 600;
         canvas.width = Math.max(500, containerWidth - 40);
         canvas.height = 320;
         const ctx2 = canvas.getContext('2d');
         // 背景
         ctx2.clearRect(0, 0, canvas.width, canvas.height);
         // 计算尺度
         const padding = 40;
         const chartWidth = canvas.width - padding * 2;
         const chartHeight = canvas.height - padding * 2;
         const maxVal = Math.max(1, ...maleCategories, ...femaleCategories);
         const groupCount = categoryNames.length;
         const groupWidth = chartWidth / groupCount;
         const barWidth = Math.max(12, (groupWidth - 20) / 3);
         // 轴线
         ctx2.strokeStyle = '#888';
         ctx2.lineWidth = 1;
         ctx2.beginPath();
         ctx2.moveTo(padding, padding);
         ctx2.lineTo(padding, padding + chartHeight);
         ctx2.lineTo(padding + chartWidth, padding + chartHeight);
         ctx2.stroke();
         // 标题
         ctx2.fillStyle = '#333';
         ctx2.font = '16px sans-serif';
         ctx2.textAlign = 'center';
         ctx2.fillText('各类别得分对比（简易渲染）', padding + chartWidth / 2, 24);
         // 画柱子
         for (let i = 0; i < groupCount; i++) {
             const baseX = padding + i * groupWidth + 10;
             const maleVal = maleCategories[i];
             const femaleVal = femaleCategories[i];
             const maleBarHeight = (maleVal / maxVal) * chartHeight;
             const femaleBarHeight = (femaleVal / maxVal) * chartHeight;
             // 男方柱
             ctx2.fillStyle = 'rgba(54, 162, 235, 0.8)';
             ctx2.fillRect(baseX, padding + chartHeight - maleBarHeight, barWidth, maleBarHeight);
             // 女方柱
             ctx2.fillStyle = 'rgba(255, 99, 132, 0.8)';
             ctx2.fillRect(baseX + barWidth + 6, padding + chartHeight - femaleBarHeight, barWidth, femaleBarHeight);
             // 分类标签
             ctx2.fillStyle = '#333';
             ctx2.font = '12px sans-serif';
             ctx2.textAlign = 'center';
             ctx2.fillText(categoryNames[i], baseX + barWidth, padding + chartHeight + 15);
             // 数值标签
             ctx2.fillStyle = '#444';
             ctx2.font = '11px sans-serif';
             ctx2.fillText(String(maleVal), baseX + barWidth / 2, padding + chartHeight - maleBarHeight - 6);
             ctx2.fillText(String(femaleVal), baseX + barWidth + 6 + barWidth / 2, padding + chartHeight - femaleBarHeight - 6);
         }
         // 图例
         const legendY = padding - 10;
         ctx2.fillStyle = 'rgba(54, 162, 235, 0.8)';
         ctx2.fillRect(padding + 10, legendY, 14, 14);
         ctx2.fillStyle = '#333';
         ctx2.font = '12px sans-serif';
         ctx2.textAlign = 'left';
         ctx2.fillText('男方', padding + 28, legendY + 12);
         ctx2.fillStyle = 'rgba(255, 99, 132, 0.8)';
         ctx2.fillRect(padding + 70, legendY, 14, 14);
         ctx2.fillStyle = '#333';
         ctx2.fillText('女方', padding + 88, legendY + 12);
         return;
     }
 
     // 新增：销毁旧图表实例，避免重复渲染冲突
     if (window.comparisonChart) {
         try { window.comparisonChart.destroy(); } catch (e) {}
     }
 
     try {
         window.comparisonChart = new Chart(ctx, {
             type: 'bar',
             data: {
                 labels: categoryNames,
                 datasets: [{
                     label: '男方得分',
                     data: maleCategories,
                     backgroundColor: 'rgba(54, 162, 235, 0.8)',
                     borderColor: 'rgba(54, 162, 235, 1)',
                     borderWidth: 1
                 }, {
                     label: '女方得分',
                     data: femaleCategories,
                     backgroundColor: 'rgba(255, 99, 132, 0.8)',
                     borderColor: 'rgba(255, 99, 132, 1)',
                     borderWidth: 1
                 }]
             },
             options: {
                 responsive: true,
                 maintainAspectRatio: false,
                 scales: {
                     y: {
                         beginAtZero: true
                     }
                 },
                 plugins: {
                     title: {
                         display: true,
                         text: '各类别得分对比'
                     }
                 }
             }
         });
     } catch (err) {
         if (container) {
             container.innerHTML = '<div class="chart-fallback">图表渲染失败：' + (err && err.message ? err.message : '未知错误') + '</div>';
         }
     }
 }

// 生成建议
function generateSuggestions(maleTotal, femaleTotal) {
    const suggestionsList = document.getElementById('suggestionsList');
    suggestionsList.innerHTML = '';
    
    let suggestions = [];
    
    if (maleTotal < femaleTotal) {
        suggestions.push({
            target: '男方',
            message: `男方总分比女方低 ${femaleTotal - maleTotal} 分，建议多参与以下活动：`
        });
        suggestions = suggestions.concat(getSpecificSuggestions('male'));
    } else if (femaleTotal < maleTotal) {
        suggestions.push({
            target: '女方',
            message: `女方总分比男方低 ${maleTotal - femaleTotal} 分，建议多参与以下活动：`
        });
        suggestions = suggestions.concat(getSpecificSuggestions('female'));
    } else {
        suggestions.push({
            target: '双方',
            message: '双方得分相当，继续保持良好的家庭分工！'
        });
    }
    
    suggestions.forEach(suggestion => {
        const suggestionDiv = document.createElement('div');
        suggestionDiv.className = 'suggestion-item';
        suggestionDiv.innerHTML = `
            <div class="suggestion-target">${suggestion.target}</div>
            <div class="suggestion-message">${suggestion.message}</div>
            ${suggestion.items ? `<ul class="suggestion-items">${suggestion.items.map(item => `<li>${item}</li>`).join('')}</ul>` : ''}
        `;
        suggestionsList.appendChild(suggestionDiv);
    });
}

// 获取具体建议
function getSpecificSuggestions(gender) {
    const suggestions = [];
    const otherGender = gender === 'male' ? 'female' : 'male';
    
    // 找出差距最大的分类
    const categoryGaps = [];
    for (let category in familyData) {
        const myScore = getCategoryScore(category, gender);
        const otherScore = getCategoryScore(category, otherGender);
        const gap = otherScore - myScore;
        if (gap > 0) {
            categoryGaps.push({ category, gap, myScore, otherScore });
        }
    }
    
    // 按差距排序
    categoryGaps.sort((a, b) => b.gap - a.gap);
    
    // 为差距最大的分类提供建议
    categoryGaps.slice(0, 2).forEach(categoryGap => {
        const category = categoryGap.category;
        const categoryData = familyData[category];
        const items = [];
        
        // 收集该分类下的具体建议
        for (let subcategory in categoryData.subcategories) {
            for (let item in categoryData.subcategories[subcategory].items) {
                const itemData = categoryData.subcategories[subcategory].items[item];
                if (itemData.score > 0) { // 只推荐正分项目
                    items.push(`${item}：${itemData.description}`);
                }
            }
        }
        
        suggestions.push({
            target: `${category}方面`,
            message: `在${category}方面落后 ${categoryGap.gap} 分`,
            items: items.slice(0, 3) // 只显示前3个建议
        });
    });
    
    return suggestions;
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeScores();
    renderCategories('maleCategories', 'male');
    renderCategories('femaleCategories', 'female');
    
    // 绑定阶段切换按钮
    document.getElementById('malePhaseBtn').addEventListener('click', () => switchPhase('male'));
    document.getElementById('femalePhaseBtn').addEventListener('click', () => switchPhase('female'));
    document.getElementById('resultPhaseBtn').addEventListener('click', () => switchPhase('result'));
    
    // 初始化分数显示
    updateScoreDisplays('male');
    updateScoreDisplays('female');
});