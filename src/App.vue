<template>
	<div id="app">
		<!-- 如果只有占位符，加载path=/的vue文件 -->
		<router-view />
	</div>
</template>

<style>
	html,
	body {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		padding: 0px;
		margin: 0px;
	}

	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		/* text-align: center; */
		color: #2c3e50;
		width: 100%;
		height: 100%;
	}

	#nav {
		padding: 30px;
	}

	#nav a {
		font-weight: bold;
		color: #2c3e50;
	}

	#nav a.router-link-exact-active {
		color: #42b983;
	}
</style>
