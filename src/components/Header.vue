<template>

	<div id="head">


		<el-dialog title="提示" :visible.sync="dialogVisible" width="30%" >
			原密码:<el-input type="password" v-model="pwd.pwd1" placeholder="" @blur="validate()"></el-input>
			密码:<el-input type="password" v-model="pwd.pwd2" placeholder=""></el-input>
			确认密码:<el-input type="password" v-model="pwd.pwd3" placeholder="" @blur="validate()"></el-input>
			{{this.pwd.msg}}
			<el-button type="primary" @click="updatePwd()">修改密码</el-button>
		</el-dialog>

		<el-menu class="el-menu-demo" mode="horizontal" background-color="#334157" text-color="#fff"
			active-text-color="#fff">
			<el-button class="buttonimg">
				<img class="showimg" :src="collapsed?imgsq:imgshow" @click="toggle(collapsed)">
			</el-button>
			<el-submenu index="2" class="submenu">
				<!-- <template slot="title">{{user.userRealName}}</template> -->
				<template slot="title">欢迎你,{{user.adminName}}</template>
				<el-menu-item index="2-1" @click="initPwd()">修改密码</el-menu-item>
				<el-menu-item @click="content()" index="2-2">个人中心</el-menu-item>
				<el-menu-item @click="exit()" index="2-3">安全退出</el-menu-item>
			</el-submenu>



		</el-menu>

	</div>





</template>
<script>
	export default {
		name: 'navcon',



		data() {

			return {
				collapsed: true,
				imgshow: require('../assets/img/show.png'),
				imgsq: require('../assets/img/sq.png'),
				user: {},
				dialogVisible: false,
				pwd: {
					pwd1: "",
					pwd2: "",
					pwd3: "",
					msg:""
				}


			}
		},



		methods: {
			
			initPwd(){
				this.dialogVisible=true;
				this.pwd.pwd1='';
				this.pwd.pwd2='';
				this.pwd.pwd3='';
			},
			
			
			updatePwd(){
				
				var data = this.$qs.stringify(this.user);
				this.$axios.post("http://localhost:8088/admin.do?methodName=updatePwd&pwd="+this.pwd.pwd2,data).then(resp =>{
					if(resp.data==true){
						
						setTimeout(() => {
							this.$message({
								type: 'success',
								message: '密码修改成功!'
							})
							this.$axios.post(
								"http://localhost:8088/getData.do?methodName=logout"
							) //发送请求,清除session,删除cookie
							this.$router.replace({
								path: '/'
							})
							
						}, 1000);
					}else {
						alert("修改失败");
					}
				})
				
				
			},
			
			//验证密码
			validate(){
				if(this.pwd.pwd1!=this.user.adminPwd){
					alert("密码不正确!");
				}
				
				if(this.pwd.pwd2!=this.pwd.pwd3){
					alert("两次密码不一致!");
				}
				
			},
			
			// 退出登录
			exit() {
				this.$confirm('退出登录, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
					.then(() => {
						setTimeout(() => {
							this.$store.commit('logout', 'false');
							this.$axios.post(
								"http://localhost:8088/getData.do?methodName=logout"
							) //发送请求,清除session,删除cookie
							this.$router.push({
								path: '/'
							})
							this.$message({
								type: 'success',
								message: '已退出登录!'
							})
						}, 1000);
					})
					.catch(() => {
						this.$message({
							type: 'info',
							message: '已取消'
						});
					})
			}

		},
		// 创建完毕状态(里面是操作)
		created() {

			this.$axios.get("http://localhost:8088/getData.do?methodName=getLoginAdmin").then(resp => {
				this.user = resp.data
			})

		}
	};
</script>
<style scoped>
	.el-menu-vertical-demo:not(.el-menu--collapse) {
		border: none;
	}

	.submenu {
		float: right;
	}

	.buttonimg {
		height: 60px;
		background-color: transparent;
		border: none;
	}

	.showimg {
		width: 26px;
		height: 26px;
		position: absolute;
		top: 17px;
		left: 17px;
	}

	.showimg:active {
		border: none;
	}
</style>
