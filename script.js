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
const DEFAULT_FAMILY_DATA = JSON.parse(JSON.stringify(familyData));

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

// 添加分数（带本地持久化）
function addScore(category, subcategory, item, gender) {
    const scores = gender === 'male' ? maleScores : femaleScores;
    scores[category][subcategory][item]++;
    
    updateScoreDisplays(gender);
    const itemElement = event.target.parentElement.querySelector('.item-count');
    itemElement.textContent = scores[category][subcategory][item];
    updateCategoryScores(category, subcategory, gender);

    // 保存到本地
    try {
        localStorage.setItem('maleScores_v1', JSON.stringify(maleScores));
        localStorage.setItem('femaleScores_v1', JSON.stringify(femaleScores));
    } catch (e) { console.warn('保存scores失败', e); }
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

// 切换阶段（加入配置编辑页）
function switchPhase(phase) {
    document.querySelectorAll('.phase-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.phase-btn').forEach(el => el.classList.remove('active'));

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
    } else if (phase === 'config') {
        document.getElementById('configPhase').classList.add('active');
        document.getElementById('configPhaseBtn').classList.add('active');
        renderConfigSelectors();
        renderConfigTree();
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

// 配置编辑脚本（选择器、树渲染、数据持久化与事件绑定）
function saveData() {
    try { localStorage.setItem('familyData_v1', JSON.stringify(familyData)); } catch(e) { console.warn('保存familyData失败', e); }
}

function renderConfigSelectors() {
    const catSelectForSub = document.getElementById('addSubCategoryCategory');
    const catSelectForItem = document.getElementById('addItemCategory');
    const subSelectForItem = document.getElementById('addItemSubcategory');
    if (!catSelectForSub || !catSelectForItem || !subSelectForItem) return;

    const categories = Object.keys(familyData);
    catSelectForSub.innerHTML = '';
    catSelectForItem.innerHTML = '';
    categories.forEach(c => {
        const o1 = document.createElement('option'); o1.value = c; o1.textContent = c; catSelectForSub.appendChild(o1);
        const o2 = document.createElement('option'); o2.value = c; o2.textContent = c; catSelectForItem.appendChild(o2);
    });

    const fillSub = (cat) => {
        subSelectForItem.innerHTML = '';
        if (!cat || !familyData[cat]) return;
        Object.keys(familyData[cat].subcategories || {}).forEach(sc => {
            const o = document.createElement('option'); o.value = sc; o.textContent = sc; subSelectForItem.appendChild(o);
        });
    };
    fillSub(catSelectForItem.value || categories[0] || '');

    catSelectForItem.addEventListener('change', (e) => fillSub(e.target.value));
}

function renderConfigTree() {
    const tree = document.getElementById('configTree');
    if (!tree) return;
    tree.innerHTML = '';
    const categories = Object.keys(familyData);
    if (categories.length === 0) { tree.textContent = '暂无数据'; return; }

    const ul = document.createElement('ul');
    categories.forEach(cat => {
        const li = document.createElement('li');
        const header = document.createElement('div');
        header.className = 'tree-node';
        header.innerHTML = `<span class="tree-label">${familyData[cat].icon || '📁'} ${cat}</span>
            <div class="tree-actions">
                <button class="rename-category" data-category="${cat}">重命名</button>
                <button class="delete-category" data-category="${cat}">删除</button>
            </div>`;
        li.appendChild(header);

        const scUl = document.createElement('ul');
        const subcats = Object.keys(familyData[cat].subcategories || {});
        subcats.forEach(sc => {
            const scLi = document.createElement('li');
            const scHeader = document.createElement('div');
            scHeader.className = 'tree-node';
            scHeader.innerHTML = `<span class="tree-label">${familyData[cat].subcategories[sc].icon || '📂'} ${sc}</span>
                <div class="tree-actions">
                    <button class="rename-subcategory" data-category="${cat}" data-subcategory="${sc}">重命名</button>
                    <button class="delete-subcategory" data-category="${cat}" data-subcategory="${sc}">删除</button>
                </div>`;
            scLi.appendChild(scHeader);

            const itemUl = document.createElement('ul');
            const items = familyData[cat].subcategories[sc].items || {};
            Object.keys(items).forEach(itemName => {
                const itemLi = document.createElement('li');
                const item = items[itemName];
                const itemDiv = document.createElement('div');
                itemDiv.className = 'tree-node';
                itemDiv.innerHTML = `<span class="tree-label">📝 ${itemName}（${item.description || '无描述'}，分值：${item.score}）</span>
                    <div class="tree-actions">
                        <button class="edit-item" data-category="${cat}" data-subcategory="${sc}" data-item="${itemName}">编辑</button>
                        <button class="delete-item" data-category="${cat}" data-subcategory="${sc}" data-item="${itemName}">删除</button>
                    </div>`;
                itemLi.appendChild(itemDiv);
                itemUl.appendChild(itemLi);
            });

            scLi.appendChild(itemUl);
            scUl.appendChild(scLi);
        });

        li.appendChild(scUl);
        ul.appendChild(li);
    });
    tree.appendChild(ul);
}

function renameCategory(oldName, newName) {
    if (!newName || newName === oldName || familyData[newName]) return false;
    const value = familyData[oldName];
    delete familyData[oldName];
    familyData[newName] = value;
    if (maleScores[oldName]) { maleScores[newName] = maleScores[oldName]; delete maleScores[oldName]; }
    if (femaleScores[oldName]) { femaleScores[newName] = femaleScores[oldName]; delete femaleScores[oldName]; }
    return true;
}

function renameSubcategory(category, oldName, newName) {
    if (!familyData[category] || !newName || newName === oldName || familyData[category].subcategories[newName]) return false;
    const value = familyData[category].subcategories[oldName];
    delete familyData[category].subcategories[oldName];
    familyData[category].subcategories[newName] = value;
    if (maleScores?.[category]?.[oldName]) {
        maleScores[category][newName] = maleScores[category][oldName];
        delete maleScores[category][oldName];
    }
    if (femaleScores?.[category]?.[oldName]) {
        femaleScores[category][newName] = femaleScores[category][oldName];
        delete femaleScores[category][oldName];
    }
    return true;
}

function renameItem(category, subcategory, oldName, newName) {
    const items = familyData?.[category]?.subcategories?.[subcategory]?.items;
    if (!items || !newName || newName === oldName || items[newName]) return false;
    const value = items[oldName];
    delete items[oldName];
    items[newName] = value;
    if (maleScores?.[category]?.[subcategory]?.[oldName] !== undefined) {
        maleScores[category][subcategory][newName] = maleScores[category][subcategory][oldName];
        delete maleScores[category][subcategory][oldName];
    }
    if (femaleScores?.[category]?.[subcategory]?.[oldName] !== undefined) {
        femaleScores[category][subcategory][newName] = femaleScores[category][subcategory][oldName];
        delete femaleScores[category][subcategory][oldName];
    }
    return true;
}

function bindConfigUI() {
    const addCategoryBtn = document.getElementById('addCategoryBtn');
    const addSubCategoryBtn = document.getElementById('addSubCategoryBtn');
    const addItemBtn = document.getElementById('addItemBtn');
    const resetBtn = document.getElementById('resetDataBtn');

    if (addCategoryBtn) addCategoryBtn.addEventListener('click', () => {
        const name = document.getElementById('addCategoryName').value.trim();
        const icon = document.getElementById('addCategoryIcon').value.trim();
        if (!name) { alert('请输入类别名称'); return; }
        if (familyData[name]) { alert('该类别已存在'); return; }
        familyData[name] = { icon: icon || '📁', subcategories: {} };
        initializeScores();
        saveData();
        renderCategories('maleCategories','male');
        renderCategories('femaleCategories','female');
        renderConfigSelectors();
        renderConfigTree();
        updateScoreDisplays('male'); updateScoreDisplays('female');
    });

    if (addSubCategoryBtn) addSubCategoryBtn.addEventListener('click', () => {
        const parent = document.getElementById('addSubCategoryCategory').value;
        const name = document.getElementById('addSubCategoryName').value.trim();
        const icon = document.getElementById('addSubCategoryIcon').value.trim();
        if (!parent) { alert('请选择所属类别'); return; }
        if (!name) { alert('请输入子分类名称'); return; }
        const target = familyData[parent];
        if (!target.subcategories[name]) target.subcategories[name] = { icon: icon || '📂', items: {} };
        initializeScores();
        saveData();
        renderCategories('maleCategories','male');
        renderCategories('femaleCategories','female');
        renderConfigSelectors();
        renderConfigTree();
        updateScoreDisplays('male'); updateScoreDisplays('female');
    });

    if (addItemBtn) addItemBtn.addEventListener('click', () => {
        const cat = document.getElementById('addItemCategory').value;
        const sub = document.getElementById('addItemSubcategory').value;
        const name = document.getElementById('addItemName').value.trim();
        const desc = document.getElementById('addItemDesc').value.trim();
        const scoreVal = parseInt(document.getElementById('addItemScore').value, 10);
        if (!cat || !sub) { alert('请选择所属类别与子分类'); return; }
        if (!name) { alert('请输入事件名称'); return; }
        if (Number.isNaN(scoreVal)) { alert('请输入有效分值'); return; }
        const items = familyData[cat].subcategories[sub].items;
        if (items[name]) { alert('该事件已存在'); return; }
        items[name] = { description: desc || '', score: scoreVal };
        initializeScores();
        saveData();
        renderCategories('maleCategories','male');
        renderCategories('femaleCategories','female');
        renderConfigTree();
        updateScoreDisplays('male'); updateScoreDisplays('female');
    });

    if (resetBtn) resetBtn.addEventListener('click', () => {
        if (!confirm('确认恢复默认数据？此操作会清除本地修改与统计。')) return;
        Object.keys(familyData).forEach(k => delete familyData[k]);
        Object.assign(familyData, JSON.parse(JSON.stringify(DEFAULT_FAMILY_DATA)));
        initializeScores();
        try { localStorage.removeItem('familyData_v1'); localStorage.removeItem('maleScores_v1'); localStorage.removeItem('femaleScores_v1'); } catch(e){}
        renderCategories('maleCategories','male');
        renderCategories('femaleCategories','female');
        renderConfigSelectors();
        renderConfigTree();
        updateScoreDisplays('male'); updateScoreDisplays('female');
    });

    const tree = document.getElementById('configTree');
    if (tree) {
        tree.addEventListener('click', (e) => {
            const t = e.target;
            if (!(t instanceof HTMLElement)) return;
            if (t.classList.contains('rename-category')) {
                const cat = t.dataset.category;
                const nn = prompt('新的类别名称', cat);
                if (nn && nn.trim() && nn !== cat) {
                    if (renameCategory(cat, nn.trim())) {
                        saveData(); renderCategories('maleCategories','male'); renderCategories('femaleCategories','female'); renderConfigSelectors(); renderConfigTree(); updateScoreDisplays('male'); updateScoreDisplays('female');
                    } else { alert('重命名失败，可能与现有名称冲突'); }
                }
            }
            if (t.classList.contains('delete-category')) {
                const cat = t.dataset.category;
                if (confirm(`删除类别【${cat}】？该类别下的子分类与事件会同时删除。`)) {
                    delete familyData[cat];
                    delete maleScores[cat];
                    delete femaleScores[cat];
                    saveData(); renderCategories('maleCategories','male'); renderCategories('femaleCategories','female'); renderConfigSelectors(); renderConfigTree(); updateScoreDisplays('male'); updateScoreDisplays('female');
                }
            }
            if (t.classList.contains('rename-subcategory')) {
                const cat = t.dataset.category;
                const sc = t.dataset.subcategory;
                const nn = prompt('新的子分类名称', sc);
                if (nn && nn.trim() && nn !== sc) {
                    if (renameSubcategory(cat, sc, nn.trim())) {
                        saveData(); renderCategories('maleCategories','male'); renderCategories('femaleCategories','female'); renderConfigSelectors(); renderConfigTree(); updateScoreDisplays('male'); updateScoreDisplays('female');
                    } else { alert('重命名失败，可能与现有名称冲突'); }
                }
            }
            if (t.classList.contains('delete-subcategory')) {
                const cat = t.dataset.category;
                const sc = t.dataset.subcategory;
                if (confirm(`删除子分类【${sc}】？其下事件会同时删除。`)) {
                    delete familyData[cat].subcategories[sc];
                    if (maleScores?.[cat]?.[sc]) delete maleScores[cat][sc];
                    if (femaleScores?.[cat]?.[sc]) delete femaleScores[cat][sc];
                    saveData(); renderCategories('maleCategories','male'); renderCategories('femaleCategories','female'); renderConfigSelectors(); renderConfigTree(); updateScoreDisplays('male'); updateScoreDisplays('female');
                }
            }
            if (t.classList.contains('edit-item')) {
                const cat = t.dataset.category;
                const sc = t.dataset.subcategory;
                const item = t.dataset.item;
                const current = familyData[cat].subcategories[sc].items[item];
                const newName = prompt('新的事件名称（留空则不改）', item);
                const newScoreStr = prompt('新的分值（可负数）', String(current.score));
                const newDesc = prompt('新的描述（留空则不改）', current.description || '');
                let changed = false;
                if (newName && newName.trim() && newName.trim() !== item) {
                    if (!familyData[cat].subcategories[sc].items[newName.trim()]) {
                        renameItem(cat, sc, item, newName.trim()); changed = true;
                    } else { alert('事件重命名失败：与现有名称冲突'); }
                }
                if (newScoreStr !== null) {
                    const v = parseInt(newScoreStr, 10);
                    if (!Number.isNaN(v)) {
                        const targetItem = newName && newName.trim() && newName.trim() !== item ? familyData[cat].subcategories[sc].items[newName.trim()] : familyData[cat].subcategories[sc].items[item];
                        targetItem.score = v; changed = true;
                    }
                }
                if (newDesc !== null && newDesc.trim() !== (current.description || '')) {
                    const targetItem = newName && newName.trim() && newName.trim() !== item ? familyData[cat].subcategories[sc].items[newName.trim()] : familyData[cat].subcategories[sc].items[item];
                    targetItem.description = newDesc.trim(); changed = true;
                }
                if (changed) {
                    saveData(); renderCategories('maleCategories','male'); renderCategories('femaleCategories','female'); renderConfigTree(); updateScoreDisplays('male'); updateScoreDisplays('female');
                }
            }
            if (t.classList.contains('delete-item')) {
                const cat = t.dataset.category;
                const sc = t.dataset.subcategory;
                const item = t.dataset.item;
                if (confirm(`删除事件【${item}】？`)) {
                    delete familyData[cat].subcategories[sc].items[item];
                    if (maleScores?.[cat]?.[sc]?.[item] !== undefined) delete maleScores[cat][sc][item];
                    if (femaleScores?.[cat]?.[sc]?.[item] !== undefined) delete femaleScores[cat][sc][item];
                    saveData(); renderCategories('maleCategories','male'); renderCategories('femaleCategories','female'); renderConfigTree(); updateScoreDisplays('male'); updateScoreDisplays('female');
                }
            }
        });
    }

    renderConfigSelectors();
    renderConfigTree();
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
 
     // 如果图表库未加载，提供友好提示或手绘渲染（支持负分）
    if (typeof Chart === 'undefined') {
        // 使用Canvas手绘一个分组柱状图（正负值以0轴为界）
        const containerWidth = (container && container.clientWidth) ? container.clientWidth : 600;
        canvas.width = Math.max(500, containerWidth - 40);
        canvas.height = 340;
        const ctx2 = canvas.getContext('2d');
        ctx2.clearRect(0, 0, canvas.width, canvas.height);

        // 尺度计算（考虑正负）
        const padding = 48;
        const chartWidth = canvas.width - padding * 2;
        const chartHeight = canvas.height - padding * 2;
        const maxVal = Math.max(0, ...maleCategories, ...femaleCategories);
        const minVal = Math.min(0, ...maleCategories, ...femaleCategories);
        const range = Math.max(1, maxVal - minVal);
        let zeroY = padding + chartHeight * (maxVal / range);
        if (maxVal === 0 && minVal === 0) zeroY = padding + chartHeight; // 全0时把0轴放到底部

        const groupCount = categoryNames.length;
        const groupWidth = chartWidth / Math.max(1, groupCount);
        const barWidth = Math.max(12, (groupWidth - 24) / 3);

        // 轴线：Y轴与0轴（横线）
        ctx2.strokeStyle = '#888';
        ctx2.lineWidth = 1;
        ctx2.beginPath();
        ctx2.moveTo(padding, padding);
        ctx2.lineTo(padding, padding + chartHeight);
        ctx2.moveTo(padding, zeroY);
        ctx2.lineTo(padding + chartWidth, zeroY);
        ctx2.stroke();

        // 标题
        ctx2.fillStyle = '#333';
        ctx2.font = '16px sans-serif';
        ctx2.textAlign = 'center';
        ctx2.fillText('各类别得分对比（简易渲染，含负分）', padding + chartWidth / 2, 24);

        // 绘制柱子（分正负）
        for (let i = 0; i < groupCount; i++) {
            const baseX = padding + i * groupWidth + 12;
            const maleVal = maleCategories[i];
            const femaleVal = femaleCategories[i];
            const maleHeight = Math.abs(maleVal) * chartHeight / range;
            const femaleHeight = Math.abs(femaleVal) * chartHeight / range;
            // 男方柱
            ctx2.fillStyle = 'rgba(54, 162, 235, 0.8)';
            if (maleVal >= 0) {
                ctx2.fillRect(baseX, zeroY - maleHeight, barWidth, maleHeight);
                ctx2.fillStyle = '#444';
                ctx2.font = '11px sans-serif';
                ctx2.textAlign = 'center';
                ctx2.fillText(String(maleVal), baseX + barWidth / 2, zeroY - maleHeight - 6);
            } else {
                ctx2.fillRect(baseX, zeroY, barWidth, maleHeight);
                ctx2.fillStyle = '#444';
                ctx2.font = '11px sans-serif';
                ctx2.textAlign = 'center';
                ctx2.fillText(String(maleVal), baseX + barWidth / 2, zeroY + maleHeight + 12);
            }
            // 女方柱
            ctx2.fillStyle = 'rgba(255, 99, 132, 0.8)';
            const fx = baseX + barWidth + 8;
            if (femaleVal >= 0) {
                ctx2.fillRect(fx, zeroY - femaleHeight, barWidth, femaleHeight);
                ctx2.fillStyle = '#444';
                ctx2.font = '11px sans-serif';
                ctx2.textAlign = 'center';
                ctx2.fillText(String(femaleVal), fx + barWidth / 2, zeroY - femaleHeight - 6);
            } else {
                ctx2.fillRect(fx, zeroY, barWidth, femaleHeight);
                ctx2.fillStyle = '#444';
                ctx2.font = '11px sans-serif';
                ctx2.textAlign = 'center';
                ctx2.fillText(String(femaleVal), fx + barWidth / 2, zeroY + femaleHeight + 12);
            }

            // 分类标签
            ctx2.fillStyle = '#333';
            ctx2.font = '12px sans-serif';
            ctx2.textAlign = 'center';
            ctx2.fillText(categoryNames[i], baseX + barWidth, padding + chartHeight + 18);
        }

        // 图例
        const legendY = padding - 12;
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

// 页面加载完成后初始化（加入本地存储读取与配置按钮）
document.addEventListener('DOMContentLoaded', function() {
    // 读取本地存储
    try {
        const fd = localStorage.getItem('familyData_v1');
        if (fd) {
            const loaded = JSON.parse(fd);
            if (loaded && typeof loaded === 'object') {
                // 深度替换到familyData（保持引用）
                Object.keys(familyData).forEach(k => delete familyData[k]);
                Object.assign(familyData, loaded);
            }
        }
    } catch (e) { console.warn('读取familyData失败', e); }

    initializeScores();
    // 合并本地计数
    try {
        const ms = localStorage.getItem('maleScores_v1');
        const fs = localStorage.getItem('femaleScores_v1');
        if (ms) {
            const lm = JSON.parse(ms);
            for (let c in maleScores) {
                for (let s in maleScores[c]) {
                    for (let i in maleScores[c][s]) {
                        if (lm?.[c]?.[s]?.[i] !== undefined) maleScores[c][s][i] = lm[c][s][i];
                    }
                }
            }
        }
        if (fs) {
            const lf = JSON.parse(fs);
            for (let c in femaleScores) {
                for (let s in femaleScores[c]) {
                    for (let i in femaleScores[c][s]) {
                        if (lf?.[c]?.[s]?.[i] !== undefined) femaleScores[c][s][i] = lf[c][s][i];
                    }
                }
            }
        }
    } catch (e) { console.warn('读取scores失败', e); }

    renderCategories('maleCategories', 'male');
    renderCategories('femaleCategories', 'female');

    // 绑定配置编辑交互
    bindConfigUI();
    
    // 绑定阶段切换按钮
    document.getElementById('malePhaseBtn').addEventListener('click', () => switchPhase('male'));
    document.getElementById('femalePhaseBtn').addEventListener('click', () => switchPhase('female'));
    document.getElementById('resultPhaseBtn').addEventListener('click', () => switchPhase('result'));
    document.getElementById('configPhaseBtn').addEventListener('click', () => switchPhase('config'));
    
    // 初始化分数显示
    updateScoreDisplays('male');
    updateScoreDisplays('female');
});
