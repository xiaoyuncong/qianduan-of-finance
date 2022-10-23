<template>
	<el-container class="index-con">
		<el-aside :class="showclass">
			<LeftNav></LeftNav>
		</el-aside>
		<el-container class="main-con">
			<el-header class="index-header">
				<Header></Header>
			</el-header>
			<el-main clss="index-main">
				<router-view />
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	import LeftNav from '../components/LeftNav.vue'
	import Header from "../components/Header.vue"
	export default {
		name: 'Index',
		data() {
			return {
				showclass: 'asideshow',
				showtype: false,
				tabArray: [{
					title: '首页',
					name: 'index',
					content: '放点啥子好呢...'
				}],
				activeName: 2
			}
		},
		// 注册组件
		components: {
			LeftNav,
			Header
		},
		methods: {},
		created() {
			// 监听
			// this.$root.Bus.$on('toggle', value => {
			// 	if (value) {
			// 		this.showclass = 'asideshow'
			// 	} else {
			// 		setTimeout(() => {
			// 			this.showclass = 'aside'
			// 		}, 300)
			// 	}
			// })
			
			
			
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
