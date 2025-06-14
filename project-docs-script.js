// project-docs-script.js

const docContentTitle = document.getElementById('doc-content-title');
const docContentDiv = document.getElementById('doc-content');
const loadingIndicator = document.getElementById('loading-indicator');
const errorMessage = document.getElementById('error-message');

const projectGroups = document.querySelectorAll('.project-group'); // 获取所有的项目组
const projectSelectors = document.querySelectorAll('.project-selector');
let docTypeSelectors = null; // 初始化为 null，将在项目选中后获取

let currentProjectId = null;
let currentDocType = null;
let currentLanguage = 'cn'; // 假设默认语言为中文，根据您的实际多语言切换逻辑调整

// 定义文档内容的相对路径映射
// 仍然使用 .html 或 .md 后缀，这里以 .html 为例
const docPaths = {
    project1: {
        biz: {
            cn: 'docs/project1/biz_cn.html',
            en: 'docs/project1/biz_en.html'
        },
        prd: {
            cn: 'docs/project1/prd_cn.html',
            en: 'docs/project1/prd_en.html'
        }
    },
    project2: {
        biz: {
            cn: 'docs/project2/biz_cn.html',
            en: 'docs/project2/biz_en.html'
        },
        prd: {
            cn: 'docs/project2/prd_cn.html',
            en: 'docs/project2/prd_en.html'
        }
    },
    project3: {
        biz: {
            cn: 'docs/project3/biz_cn.html',
            en: 'docs/project3/biz_en.html'
        },
        prd: {
            cn: 'docs/project3/prd_cn.html',
            en: 'docs/project3/prd_en.html'
        }
    },
    project4: {
        biz: {
            cn: 'docs/project4/biz_cn.html',
            en: 'docs/project4/biz_en.html'
        },
        prd: {
            cn: 'docs/project4/prd_cn.html',
            en: 'docs/project4/prd_en.html'
        }
    },
    project5: {
        biz: {
            cn: 'docs/project5/biz_cn.html',
            en: 'docs/project5/biz_en.html'
        },
        prd: {
            cn: 'docs/project5/prd_cn.html',
            en: 'docs/project5/prd_en.html'
        }
    }
};

// 辅助函数：更新语言
document.addEventListener('DOMContentLoaded', () => {
    currentLanguage = localStorage.getItem('language') || 'cn'; // 默认中文

    document.addEventListener('languageChanged', (event) => {
        currentLanguage = event.detail.lang;
        updateAllSelectorTexts(); // 语言变化时更新所有选择器文本
        fetchDocContent(); // 语言变化时重新渲染内容 (如果当前有内容)
    });
});

// 解析URL参数
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        projectId: params.get('project'),
        docType: params.get('type')
    };
}

// 更新所有选择器按钮的语言文本
function updateAllSelectorTexts() {
    projectSelectors.forEach(btn => {
        btn.textContent = btn.dataset[`lang${currentLanguage.charAt(0).toUpperCase() + currentLanguage.slice(1)}`];
    });
    // docTypeSelectors 可能尚未初始化，或者需要针对特定项目组更新
    projectGroups.forEach(group => {
        const docTypes = group.querySelectorAll('.doc-type-selector');
        docTypes.forEach(btn => {
            btn.textContent = btn.dataset[`lang${currentLanguage.charAt(0).toUpperCase() + currentLanguage.slice(1)}`];
        });
    });

    // 更新文档标题的默认文本和提示文本
    const defaultTitleCn = docContentTitle.dataset.langCn || "请选择一个项目和文档类型";
    const defaultTitleEn = docContentTitle.dataset.langEn || "Please select a project and document type";
    if (!currentProjectId || !currentDocType) { // 只有在没有选中项目和类型时才显示默认提示
        docContentTitle.textContent = (currentLanguage === 'cn' ? defaultTitleCn : defaultTitleEn);
    }
    const defaultP = docContentDiv.querySelector('p[data-lang-cn]');
    if (defaultP) {
        const defaultPCn = defaultP.dataset.langCn || "选择左侧的项目和文档类型，以查看详细内容。";
        const defaultPEn = defaultP.dataset.langEn || "Select a project and document type from the left to view detailed content.";
        defaultP.textContent = (currentLanguage === 'cn' ? defaultPCn : defaultPEn);
    }

    // 更新错误信息的语言文本
    if (errorMessage) {
        errorMessage.querySelector('p').textContent = currentLanguage === 'cn' ? "加载文档失败，请稍后再试或联系管理员。" : "Failed to load document. Please try again later or contact the administrator.";
    }
    // 更新加载指示器的语言文本
    if (loadingIndicator) {
        loadingIndicator.querySelector('p').textContent = currentLanguage === 'cn' ? "文档加载中..." : "Document loading...";
    }
}


// 更新选择器按钮的活跃状态和显示/隐藏文档类型
function updateSelectorStates() {
    projectGroups.forEach(group => {
        const projectBtn = group.querySelector('.project-selector');
        const docTypeGroup = group.querySelector('.doc-type-group');

        if (projectBtn.dataset.projectId === currentProjectId) {
            projectBtn.classList.add('bg-blue-100', 'text-blue-800', 'font-semibold');
            projectBtn.classList.remove('text-gray-700', 'hover:bg-blue-50', 'hover:text-blue-700');
            docTypeGroup.classList.remove('hidden'); // 显示该项目下的文档类型选择
        } else {
            projectBtn.classList.remove('bg-blue-100', 'text-blue-800', 'font-semibold');
            projectBtn.classList.add('text-gray-700', 'hover:bg-blue-50', 'hover:text-blue-700');
            docTypeGroup.classList.add('hidden'); // 隐藏其他项目下的文档类型选择
        }

        // 更新文档类型按钮的活跃状态
        const docTypeBtns = docTypeGroup.querySelectorAll('.doc-type-selector');
        docTypeBtns.forEach(btn => {
            if (btn.dataset.docType === currentDocType && projectBtn.dataset.projectId === currentProjectId) {
                btn.classList.add('bg-blue-200', 'text-blue-800', 'font-semibold'); // 选中文档类型的样式
                btn.classList.remove('text-gray-600', 'hover:bg-blue-50', 'hover:text-blue-700');
            } else {
                btn.classList.remove('bg-blue-200', 'text-blue-800', 'font-semibold');
                btn.classList.add('text-gray-600', 'hover:bg-blue-50', 'hover:text-blue-700');
            }
        });
    });
    updateAllSelectorTexts(); // 确保文本语言也同步更新
}


// 异步加载文档内容
async function fetchDocContent() {
    docContentDiv.innerHTML = ''; // 清空内容
    docContentTitle.textContent = ''; // 清空标题
    errorMessage.classList.add('hidden');
    loadingIndicator.classList.remove('hidden'); // 显示加载指示器

    if (!currentProjectId || !currentDocType) {
        loadingIndicator.classList.add('hidden');
        const defaultTitleCn = docContentTitle.dataset.langCn || "请选择一个项目和文档类型";
        const defaultTitleEn = docContentTitle.dataset.langEn || "Please select a project and document type";
        docContentTitle.textContent = (currentLanguage === 'cn' ? defaultTitleCn : defaultTitleEn);
        docContentDiv.innerHTML = `<p data-lang-cn="选择左侧的项目和文档类型，以查看详细内容。" data-lang-en="Select a project and document type from the left to view detailed content.">${currentLanguage === 'cn' ? "选择左侧的项目和文档类型，以查看详细内容。" : "Select a project and document type from the left to view detailed content."}</p>`;
        updateSelectorStates(); // 即使没有选中，也要更新按钮状态
        return;
    }

    const pathConfig = docPaths[currentProjectId] && docPaths[currentProjectId][currentDocType];
    let filePath = pathConfig && pathConfig[currentLanguage]; // 尝试获取当前语言的路径
    if (!filePath && pathConfig && pathConfig['en']) { // 如果当前语言路径不存在，尝试使用英文
        filePath = pathConfig['en'];
    }

    if (!filePath) {
        loadingIndicator.classList.add('hidden');
        docContentTitle.textContent = currentLanguage === 'cn' ? "文档不存在" : "Document not found";
        errorMessage.classList.remove('hidden');
        errorMessage.querySelector('p').textContent = currentLanguage === 'cn' ? "未能找到您选择的文档内容，请检查链接或稍后再试。" : "The document content you selected could not be found. Please check the link or try again later.";
        updateSelectorStates();
        return;
    }

    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let content = await response.text();

        // 根据文件后缀判断是否为 Markdown
        if (filePath.endsWith('.md')) {
            content = marked.parse(content); // 使用 marked.js 渲染 Markdown
        }
        
        const selectedProjectText = projectSelectors.find(btn => btn.dataset.projectId === currentProjectId).textContent;
        // 获取当前项目下对应的文档类型按钮文本
        const currentProjectGroup = document.querySelector(`.project-group button[data-project-id="${currentProjectId}"]`).closest('.project-group');
        const selectedDocTypeText = currentProjectGroup.querySelector(`.doc-type-selector[data-doc-type="${currentDocType}"]`).textContent;

        docContentTitle.textContent = `${selectedProjectText} - ${selectedDocTypeText}`;
        docContentDiv.innerHTML = content;

    } catch (error) {
        console.error('Error loading document:', error);
        errorMessage.classList.remove('hidden');
        errorMessage.querySelector('p').textContent = currentLanguage === 'cn' ? "加载文档失败，请稍后再试或联系管理员。" : "Failed to load document. Please try again later or contact the administrator.";
        docContentTitle.textContent = currentLanguage === 'cn' ? "文档加载错误" : "Document Load Error";
    } finally {
        loadingIndicator.classList.add('hidden'); // 隐藏加载指示器
    }
    updateSelectorStates(); // 确保选择器状态正确更新
}


// 初始化：根据URL参数加载内容
document.addEventListener('DOMContentLoaded', () => {
    const params = getUrlParams();
    currentProjectId = params.projectId;
    currentDocType = params.docType;

    // 添加项目选择事件监听器
    projectSelectors.forEach(button => {
        button.addEventListener('click', () => {
            currentProjectId = button.dataset.projectId;
            // 每次点击项目时，重置文档类型，或者选择默认类型
            // 这里我们选择默认类型 'biz'，并如果URL中有指定类型则优先使用
            const defaultType = 'biz';
            currentDocType = params.docType || defaultType; // 如果URL有type，则使用，否则用默认
            
            // 如果从URL过来没有指定type，但选中了项目，则清空URL中的type参数
            // 这有助于保持URL的整洁，但同时允许初始跳转
            if (!params.docType && currentProjectId && currentDocType) {
                const newUrl = new URL(window.location.href);
                newUrl.searchParams.set('project', currentProjectId);
                newUrl.searchParams.set('type', currentDocType);
                window.history.pushState({}, '', newUrl); // 更新URL而不重新加载页面
            }

            fetchDocContent(); // 重新加载内容
        });
    });

    // 为每个项目组内的文档类型按钮添加事件监听器
    projectGroups.forEach(group => {
        const docTypeBtns = group.querySelectorAll('.doc-type-selector');
        docTypeBtns.forEach(button => {
            button.addEventListener('click', () => {
                // 确保点击的文档类型按钮属于当前选中的项目
                const clickedProjectId = group.querySelector('.project-selector').dataset.projectId;
                if (clickedProjectId === currentProjectId) {
                    currentDocType = button.dataset.docType;
                    // 更新URL参数
                    const newUrl = new URL(window.location.href);
                    newUrl.searchParams.set('project', currentProjectId);
                    newUrl.searchParams.set('type', currentDocType);
                    window.history.pushState({}, '', newUrl); // 更新URL而不重新加载页面
                    fetchDocContent(); // 重新加载内容
                }
            });
        });
    });

    // 初始加载：如果URL中有项目ID，模拟点击该项目
    if (currentProjectId) {
        const initialProjectBtn = document.querySelector(`.project-selector[data-project-id="${currentProjectId}"]`);
        if (initialProjectBtn) {
            // 触发点击事件，这样会处理文档类型选择和内容加载
            initialProjectBtn.click();
        } else {
            // 如果URL中的项目ID无效，则显示默认提示
            fetchDocContent();
        }
    } else {
        // 如果URL中没有项目ID，显示默认提示
        fetchDocContent();
    }
});