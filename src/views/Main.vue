<template>
	<el-container class="index-con">
		<el-aside width="280px" class="showclass">
			<el-menu default-active="2" class="el-menu-vertical-demo main-con" background-color="#545c64"
				text-color="#fff" active-text-color="#ffd04b" :router="true">

				<el-submenu v-for=" menu in menuList" :key="menu.menuName" :index="menu.menuUrl">
					<template slot="title">
						<i :class="menu.menuIcon"></i>
						<span>{{menu.menuName}}</span>
					</template>
					<el-menu-item-group v-if="menu.sonList">
						<el-menu-item v-for="son in menu.sonList" :key="son.menuName" :index="son.menuUrl">
							<i :class="son.menuIcon"></i>
							{{son.menuName}}
						</el-menu-item>
					</el-menu-item-group>
				</el-submenu>



			</el-menu>

		</el-aside>
		<el-container>
			<el-header class="index-header">
				<Header></Header>
			</el-header>
			<el-main clss="index-main">
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	// import LeftNav from '../components/LeftNav.vue'
	import Header from "../components/Header.vue"


	export default {
		name: "Main",
		data() {
			return {
				menuList: [],
				roleId: "",
				update: ""
			}
		},

		// 注册组件
		components: {

			Header
		},

		methods: {
			getMenu(id) {
				this.$axios.get("http://localhost:8088/getData.do?methodName=getNowMenuInfo&roleId=" + id).then(
					resp => {
						console.log(resp.data)
						this.menuList = resp.data;
					});
			},
			getNow() {
				
					// this.$axios.get("http://localhost:8088/getData.do?methodName=getLoginMenu").then(resp => {
					// 	console.log(resp.data)
					// 	this.menuList = resp.data;
					// });
				
				this.bus.$on('sendTo', name => {
					if (name != "-1") {
						
						this.roleId = name;
						this.getMenu(name);
						// location.reload();
					} else {
						
						this.$axios.get("http://localhost:8088/getData.do?methodName=getLoginAdmin").then(resp => {
							this.roleId = resp.data.roleId
							this.getMenu(resp.data.roleId);
							// location.reload();
						})


					}

				});
				
			
			}
		},
		created() {
			// 查询用户的菜单
			// this.bus.$on('sendTo', name => {
			// 	if (name != "-1") {
			// 		alert(name)
			// 		this.roleId = name;
			// 		this.getMenu(name);
			// 		location.reload();
			// 	} else {
			// 		alert(name);
			// 		this.$axios.get("http://localhost:8088/getData.do?methodName=getLoginAdmin").then(resp => {
			// 			this.roleId = resp.data.roleId
			// 			this.getMenu(resp.data.roleId);
			// 			location.reload();
			// 		})


			// 	}

			// });
			

			if (this.roleId == "") {
				
				this.$axios.get("http://localhost:8088/getData.do?methodName=getLoginMenu").then(resp => {
					console.log(resp.data)
					this.menuList = resp.data;
				});

			}
			
			this.getNow();


		}
	}
</script>

<style scoped>
	.index-con {
		height: 100%;
		width: 100%;
		box-sizing: border-box;
	}

	.asideshow[data-v-fae5bece] {
		width: 300px !important;
	}

	.aside {
		width: 64px !important;
		height: 100%;
		background-color: #334157;
		margin: 0px;
	}


	.asideshow {
		width: 300px !important;
		height: 100%;
		background-color: #334157;
		margin: 0px;
	}

	.index-header,
	.index-main {
		padding: 0px;
		border-left: 2px solid #333;
	}

	html,
	body {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		padding: 0px;
		margin: 0px;
	}

	#app {
		height: 100%;
		width: 100%;
	}

	.index-con {
		height: 100%;
		width: 100%;
		box-sizing: border-box;
	}

	.aside {
		/* width: 179px !important; */
		height: 100%;
		background-color: #334157;
		margin: 0px;
	}

	.el-aside {
		background-color: mistyrose;
	}

	.asideshow {
		width: 240px !important;
		height: 100%;
		background-color: #334157;
		margin: 0px;
	}

	.index-header,
	.index-main {
		padding: 0px;
		border-left: 2px solid #333;
	}

	.el-menu-vertical-demo:not(.el-menu--collapse) {
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

	.el-menu-vertical-demo:not(.el-menu--collapse) {
		width: 200px;
		min-height: 400px;
	}

	.el-menu-vertical-demo:not(.el-menu--collapse) {
		border: none;
		text-align: left;
	}

	.el-menu-item-group__title {
		padding: 0px;
	}

	.el-menu-bg {
		background-color: #1f2d3d !important;
	}

	.el-menu {
		border: none;
		background-color: mistyrose;
	}

	.el-menu-vertical-demo:not(.el-menu--collapse) {
		width: 280px;
		background-color: mistyrose;
		height: 100%;
	}

	.logobox {
		height: 40px;
		line-height: 40px;
		color: #9d9d9d;
		font-size: 20px;
		text-align: center;
		padding: 20px 0px;
		width: 240px;
	}

	.logoimg {
		height: 40px;
	}
</style>
