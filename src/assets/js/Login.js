import SIdentify from '../../components/SIdentify.vue'
var login = {
	name: "login",
	components: {
		SIdentify
	},
	data() {
		return {
			//定义loading默认为false
			logining: false,
			ruleForm: {
				methodName: "login",
				//username和password默认为空
				adminName: '',
				adminPwd: '',
				code: '',
				// 记住密码
				rememberpwd: false,
				randomStr: '',
				codeimg: ''
			},
			//rules前端验证
			rules: {
				adminName: [{
					required: true,
					message: '请输入账号',
					trigger: 'blur'
				}],
				adminPwd: [{
					required: true,
					message: '请输入密码',
					trigger: 'blur'
				}],
				code: [{
					required: true,
					message: '请输入验证码',
					trigger: 'blur'
				}]
			},
			identifyCodes: '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', // 验证码字符的集合
			identifyCode: ''
		}
	},
	methods: {
		//获取info列表
		submitForm(formName) {
			console.log(formName);
			// location.href = "main.html";
			// 验证表单
			this.$refs[formName].validate((valid) => {
				if (valid) {


					var data = this.$qs.stringify(this.ruleForm);
					// 跨域访问
					// 同域：服务器（电脑）一致、端口号一致
					// 跨域：服务器不同、端口号不一致，axios中不允许跨域访问
					this.$axios.post("http://localhost:8088/login.do", data).then(response => {
						if (response.data.message == "登录成功") {
							this.$message({
								type: "success",
								message: "登录成功",
								duration: 1000
							});

							var vm = this; // this:vue对象
							// setTimeout(function() {
								// console.log(this) //  window
								// 通过路由跳转到vue文件中
								vm.$router.push({
									path: "main"
								});
							// }, 1000);

						}else {
							this.$message.error(response.data.message);
							
						}
					});
				}
			});
		},
		refreshCode() { // 刷新验证码
			this.identifyCode = ''
			this.makeCode(this.identifyCodes, 4)
		},
		makeCode(o, l) { //生成验证码
			for (let i = 0; i < l; i++) {
				this.identifyCode += this.identifyCodes[this.$refs.child.randomNum(0, this.identifyCodes.length)]
			}
		}
	},
	mounted() {
		// this.ruleForm.codeimg='../../assets/img/validate1.png';
		this.identifyCode = ''
		this.makeCode(this.identifyCodes, 4)
		
		
		const username = this.$cookies.get("adminName");
		const password = this.$cookies.get("adminPwd");
		// const rememberMe = Cookies.get("rememberMe");
		if(this.$cookies.isKey("adminName")){
			this.ruleForm.methodName='login';
			this.ruleForm.adminName=username;
			this.ruleForm.adminPwd=password;
		}
		
	}
};
export default login;
