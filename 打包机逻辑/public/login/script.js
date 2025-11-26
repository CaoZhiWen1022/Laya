document.addEventListener('DOMContentLoaded', function () {


    // 新增：获取登录/注册按钮、输入框
    const loginBtn = document.getElementById('login-btn');
    // 登录输入框
    const loginUsername = document.getElementById('login-username');
    const loginPassword = document.getElementById('login-password');

    // 新增：登录请求
    function handleLogin() {
        const username = loginUsername.value.trim();
        const password = loginPassword.value.trim();

        if (!username || !password) {
            alert('请填写账号和密码');
            return;
        }

        // 调用后端登录接口
        fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
            .then(res => res.json())
            .then(data => {
                if (data.code === 200) {
                    // 登录成功后的逻辑（如跳转到首页）
                    let uid = data.message.uid;
                    let userInfo = { uid: uid };
                    localStorage.setItem('userInfo', JSON.stringify(userInfo));
                    window.location.href = '../home/index.html';
                }
            })
            .catch(err => {
                console.error('登录请求失败:', err);
                alert('网络错误，请重试');
            });
    }

    // 新增：为登录按钮添加点击事件
    loginBtn.addEventListener('click', handleLogin);

});