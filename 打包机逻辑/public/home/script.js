document.addEventListener('DOMContentLoaded', function () {
    // DOM元素缓存
    const elements = {
        // 用户相关
        currentUsername: document.getElementById('current-username'),
        logoutBtn: document.getElementById('logout-btn'),

        // 项目相关
        addProjectBtn: document.getElementById('add-project-btn'),
        projectModal: document.getElementById('project-modal'),
        modalContent: document.getElementById('modal-content'),
        closeModal: document.getElementById('close-modal'),
        cancelCreate: document.getElementById('cancel-create'),
        projectForm: document.getElementById('project-form'),
        projectName: document.getElementById('project-name'),
        projectSVN: document.getElementById('project-svn'),
        projectPath: document.getElementById('project-path'),
        confirmCreate: document.getElementById('confirm-create'),
        projectGrid: document.getElementById('project-grid'),
        projectLoading: document.getElementById('project-loading'),
        projectEmpty: document.getElementById('project-empty'),

        logModal: document.getElementById('log-modal'),
        logModalContent: document.getElementById('log-modal-content'),
        logContentArea: document.getElementById('log-modal-content-area'),
        closeLogModal: document.getElementById('close-log-modal'),
        confirmCloseLog: document.getElementById('confirm-close-log'),

        // 提示组件
        successToast: document.getElementById('success-toast'),
        toastMessage: document.getElementById('toast-message')
    };

    elements.closeLogModal.addEventListener('click', function () {
        elements.logModal.classList.add('hidden');
    });

    elements.confirmCloseLog.addEventListener('click', function () {
        elements.logModal.classList.add('hidden');
    });

    // 全局状态管理
    const state = {
        selectedProjectId: null,    // 选中的项目ID
        projects: [],               // 所有项目数据
        UID: ""                     // 当前用户ID
    };

    // 初始化用户信息（从LocalStorage读取）
    function initUserInfo() {
        const userInfoStr = localStorage.getItem('userInfo');
        if (userInfoStr) {
            state.UID = JSON.parse(userInfoStr).uid;
        } else {
            // 未登录，跳回登录页
            window.location.href = 'index.html';
        }
    }

    // 加载项目列表
    function loadProjects() {
        // 移除加载状态元素
        elements.projectLoading.remove();

        // 调用API获取项目列表
        postApi('getProjects', { uid: state.UID }, data => {
            if (data.code === 200) {
                // 清空现有项目数据
                state.projects = [];

                // 处理无项目情况
                if (data.message.length === 0) {
                    renderProjectCards();
                    elements.projectEmpty.classList.remove('hidden');
                    return;
                }

                // 批量获取项目详情
                data.message.forEach(projectId => {
                    postApi('getProjectDataById', { id: projectId }, projectData => {
                        if (projectData.code === 200) {
                            state.projects.push(projectData.message);

                            // 所有项目加载完成后渲染
                            if (state.projects.length === data.message.length) {
                                renderProjectCards();
                            }
                        }
                    });
                });
            } else {
                console.error('获取项目列表失败:', data.message);
            }
        });
    }

    // 渲染项目卡片（单选模式）
    function renderProjectCards() {
        // 清空现有项目卡片
        elements.projectGrid.innerHTML = '';

        state.projects.forEach(project => {
            const isSelected = project.id === state.selectedProjectId;
            const projectCard = document.createElement('div');

            // 设置卡片样式
            projectCard.className = `border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${isSelected ? 'border-primary bg-primary/5 shadow-card-selected' : 'border-gray-200 hover:border-gray-300'
                }`;
            projectCard.setAttribute('data-project-id', project.id);
            //获取状态
            postApi('getProjectState', { id: project.id }, data => {
                if (data.code === 200) {
                    let projectStateData = data.message;//state = 0 正常，state = 1 发布中  lastPublishState:0 正常，lastPublishState:1 失败


                    project.status = projectStateData.state;
                    // 卡片内容
                    projectCard.innerHTML = `
    <div class="flex justify-between items-start mb-3">
        <h4 class="font-semibold text-gray-700 ${isSelected ? 'text-primary' : ''}">${project.name}</h4>
        <div class="flex items-center gap-2">
            <!-- 运行状态标识：0=正常（绿色），1=发布中（红色），默认正常 -->
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${project.status === 1
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }">
                <i class="fa ${project.status === 1
                            ? 'fa-spinner fa-spin mr-1'
                            : 'fa-check-circle mr-1'
                        }"></i>
                ${project.status === 1 ? '发布中' : '正常'}
            </span>
            ${isSelected ? '<i class="fa fa-check text-primary"></i>' : ''}
        </div>
    </div>
    <div class="text-sm text-gray-500 space-y-1 mb-4">
        <p><i class="fa fa-folder mr-1 text-gray-400"></i> 路径：${project.path}</p>
        <!-- 上次发布状态：0=无记录，1=成功，2=失败，默认无记录 -->
        <p>
            <i class="fa ${projectStateData.lastPublishState === 1 ? 'fa-check-circle mr-1 text-green-500' :
                            projectStateData.lastPublishState === 2 ? 'fa-times-circle mr-1 text-red-500' :
                                'fa-history mr-1 text-gray-400'
                        }"></i>
            上次发布：${projectStateData.lastPublishState === 1 ? '<span class="text-green-500">发布成功</span>' :
                            projectStateData.lastPublishState === 2 ? '<span class="text-red-500">发布失败</span>' :
                                '暂无发布记录'
                        }
            ${/* 可选：显示上次发布时间（如果有） */ project.publishTime ? `（${project.publishTime}）` : ''}
        </p>
    </div>
    <div class="flex gap-2">
        <button class="flex-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-all">
            <i class="fa fa-play mr-1"></i> 运行
        </button>
        <!-- 新增日志按钮：放在运行后面，样式保持一致 -->
        <button id="viewLog" class="flex-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-all">
            <i class="fa fa-file-text-o mr-1"></i> 日志
        </button>
        <button id="publish" class="flex-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-all">
            <i class="fa fa-upload mr-1"></i> 发布
        </button>
    </div>
`;

                    // 绑定发布按钮点击事件
                    projectCard.querySelector('#publish').addEventListener('click', () => {
                        postApi('publishProject', { id: project.id }, (data) => {
                            if (data.code === 200) {
                                //更新状态
                                renderProjectCards();
                            } else {
                                alert(data.message);
                            }
                        });

                    });

                    projectCard.querySelector('#viewLog').addEventListener('click', () => {
                        postApi('getPublishLog', { id: project.id }, (data) => {
                            if (data.code === 200) {
                                //显示logpanel
                                elements.logModal.classList.remove('hidden');
                                elements.logContentArea.innerHTML = data.message;
                                elements.logModalContent.classList.remove('scale-95', 'opacity-0');
                                elements.logModalContent.classList.add('scale-100', 'opacity-100');
                            } else {
                                alert(data.message);
                            }
                        })
                    });

                    elements.projectGrid.appendChild(projectCard);
                }
            })

        });
    }

    // 弹窗控制
    function openModal() {
        elements.projectModal.classList.remove('hidden');
        // 弹窗动画
        setTimeout(() => {
            elements.modalContent.classList.remove('scale-95', 'opacity-0');
            elements.modalContent.classList.add('scale-100', 'opacity-100');
        }, 10);
        // 重置表单
        elements.projectForm.reset();
    }

    function closeModalFunc() {
        elements.modalContent.classList.remove('scale-100', 'opacity-100');
        elements.modalContent.classList.add('scale-95', 'opacity-0');
        // 延迟隐藏背景，保持动画流畅
        setTimeout(() => {
            elements.projectModal.classList.add('hidden');
        }, 300);
    }

    // 显示成功提示
    function showSuccessToast(message) {
        elements.toastMessage.textContent = message;
        elements.successToast.classList.remove('hidden');
        setTimeout(() => {
            elements.successToast.classList.remove('translate-y-[-20px]', 'opacity-0');
        }, 10);

        // 3秒后自动隐藏
        setTimeout(() => {
            elements.successToast.classList.add('translate-y-[-20px]', 'opacity-0');
            setTimeout(() => {
                elements.successToast.classList.add('hidden');
            }, 300);
        }, 3000);
    }

    // 处理项目创建提交
    function handleProjectCreate(e) {
        e.preventDefault();

        const name = elements.projectName.value.trim();
        const path = elements.projectPath.value.trim();
        const svn = elements.projectSVN.value.trim();

        if (!name || !path) {
            alert('请填写完整的项目信息');
            return;
        }

        // 提交状态处理
        elements.confirmCreate.disabled = true;
        elements.confirmCreate.innerHTML = '<i class="fa fa-spinner fa-spin mr-2"></i>创建中...';

        // 调用创建项目API
        postApi('createProject', { name, path, svn }, data => {
            elements.confirmCreate.disabled = false;
            elements.confirmCreate.innerHTML = '创建项目';

            if (data.code === 200) {
                closeModalFunc();
                showSuccessToast('项目创建成功！');
                loadProjects(); // 重新加载项目列表
                elements.projectEmpty.classList.add('hidden');
            } else {
                alert(data.message);
            }
        });
    }

    // 退出登录
    function handleLogout() {
        if (confirm('确定要退出登录吗？')) {
            localStorage.removeItem('userInfo');
            window.location.href = 'index.html';
        }
    }

    // 绑定事件处理
    function bindEvents() {
        // 初始化用户信息
        initUserInfo();

        // 加载项目列表
        loadProjects();

        // 项目相关事件
        elements.addProjectBtn.addEventListener('click', openModal);
        elements.closeModal.addEventListener('click', closeModalFunc);
        elements.cancelCreate.addEventListener('click', closeModalFunc);
        elements.projectForm.addEventListener('submit', handleProjectCreate);

        // 点击弹窗背景关闭
        elements.projectModal.addEventListener('click', e => {
            if (e.target === elements.projectModal) closeModalFunc();
        });

        // 退出登录
        elements.logoutBtn.addEventListener('click', handleLogout);
    }

    // API请求封装
    function postApi(apiName, data, cb) {
        fetch(`/api/${apiName}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
            .then(res => res.json())
            .then(data => cb(data))
            .catch(err => {
                console.error(`API错误 [${apiName}]`, err);
                alert('请求失败，请重试');
            });
    }

    // 初始化应用
    bindEvents();
});