<template>
	<div class="login-wrap">
		<el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px"
			class="demo-ruleForm login-container">
			<h3 class="title">用户登录</h3>
			<el-form-item prop="username">
				<el-input type="text" v-model="ruleForm.adminName" auto-complete="off" placeholder="账号">
				</el-input>
			</el-form-item>
			<el-form-item prop="pwd">
				<el-input type="password" v-model="ruleForm.adminPwd" auto-complete="off" placeholder="密码">
				</el-input>
			</el-form-item>
			<el-row>
				<el-col :span="12">
					<el-form-item prop="code">
						<el-input type="text" v-model="ruleForm.code" auto-complete="off" placeholder="验证码"
							@blue="submitForm('ruleForm')"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12" class="code-box">
					<div @click="refreshCode">
						<SIdentify ref="child" :identifyCode="identifyCode"></SIdentify>
					</div>
					{{identifyCode}}
				</el-col>
			</el-row>
			<el-checkbox class="remember" v-model="ruleForm.rememberpwd">记住密码</el-checkbox>
			<el-form-item style="width:100%;">
				<el-button type="primary" style="width:100%;" @click="submitForm('ruleForm')" :loading="logining">登录
				</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<!-- 通过script标签的src属性导入js文件 -->
<script src="@/assets/js/Login.js">
</script>

<!-- 
	scoped：将sytle中的样式私有化，设置为当前页面中的局部样式
		在vue项目中通常会给style标签加上scope属性，以此来实现样式的私有化，避免全局污染。
		但有的时候这个属性又会带来麻烦：当引入第三方组件且需要修改其样式时，通常出现没有修改成功的情况
 -->
<style src="../assets/css/Login.css" scoped>
</style>

