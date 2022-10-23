<template>

	<div id="app">
		<h4> 系统管理 > 员工管理</h4>
		<!-- 条件查询 -->
		<el-row :gutter="20">
			<el-form ref="form" :model="adminSelect" label-width="80px">
				<el-col :span="4">
					<el-form-item label="用户姓名">
						<el-input v-model="adminSelect.adminName"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="4">
					<el-form-item label="用户ID">
						<el-input v-model="adminSelect.adminId"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="4">
					<el-button type="primary" plain @click="queryCustomerAsset()">查询</el-button>
					<el-button type="primary" plain @click="initSave()">新增</el-button>
				</el-col>
			</el-form>
		</el-row>
		<!-- 数据展示table -->
		<el-table :data="adminList" style="width: 90%">
			<el-table-column type="expand">
				<template slot-scope="props">
					<el-form label-position="left" inline class="demo-table-expand">
						<el-form-item label="用户名">
							<span>{{ props.row.adminName }}</span>
						</el-form-item>
						<el-form-item label="人员状态">
							<span>
								{{props.row.adminState == "1"?"在上班":""}}
								{{props.row.adminState == "2"?"休假":""}}
								{{props.row.adminState == "3"?"离职":""}}
							</span>
						</el-form-item>
						<el-form-item label="最后登录时间">
							<span>{{ props.row.loginTime }}</span>
						</el-form-item>
						<el-form-item label="用户图片">
							<span>
								<img :src="getImage(props.row.adminImage)" style="width: 100px; height: 100px" />
							</span>
						</el-form-item>
					</el-form>
				</template>
			</el-table-column>
			<el-table-column align="center" type="selection" width="60"> </el-table-column>
			<el-table-column prop="adminId" label="用户ID" width="120"></el-table-column>
			<el-table-column prop="adminName" label="用户名称" width="100"> </el-table-column>
			<el-table-column prop="adminState" label="人员状态" width="100">
				<template slot-scope="scope">
					{{scope.row.adminState == "1"?"在上班":""}}
					{{scope.row.adminState == "2"?"休假":""}}
					{{scope.row.adminState == "3"?"离职":""}}
				</template>
			</el-table-column>
			<el-table-column prop="loginTime" label="最后登录时间" width="160">
			</el-table-column>
			<el-table-column label="用户图像" width="100">
				<template slot-scope="scope">
					<!-- 图片一般上传到tomcat服务器端，所以在这里需要拼接图片的地址：http://localhost:8088/iamge/图片名 -->
					<el-image style="width: 100px; height: 100px" :src="getImage(scope.row.adminImage)"></el-image>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="editAdmin(scope.row)">修改</el-button>
					<el-button type="text" size="small" @click="deleteUser(scope.row.adminId)">删除</el-button>
					<!-- 选做 -->
					<el-button type="text" size="small" @click="getUserMenu(scope.row.roleId)">查看权限</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 分页组件 -->
		<el-pagination @size-change="pageSizeChange" @current-change="nowPageChange" :small="true"
			:current-page="pageInfo.nowPage" :page-size="pageInfo.pageSize" :page-sizes="[3,6,9,12]"
			layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total">
		</el-pagination>

		<!-- 员工编辑对话框 -->
		<el-dialog :title="title" :visible.sync="editFlag" width="50%">
			<el-form label-width="100px" :model='user'>
				<el-row>
					<el-col :span="14">
						<el-form-item label="用户名">
							<el-input v-model="user.adminName"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="14">
						<el-form-item label="人员状态">
							<el-select v-model="user.adminState">
								<el-option :value="1" label="在上班"></el-option>
								<el-option :value="2" label="休假中"></el-option>
								<el-option :value="3" label="离职"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="14">
						<el-form-item label="人员角色">
							<el-select v-model="user.roleId">
								<el-option v-for="role in roleList" :key="role.roleId" :value="role.roleId"
									:label="role.roleName">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="14">
						<el-form-item label="用户头像">
							<!-- :on-success：图片上传成功之后，调用的函数，用于获取图片名，函数名的后面不要加 ()，
							否则在js中的函数中无法获取到tomcat服务器传递到页面上的文件名 -->
							<el-upload class="avatar-uploader" action="http://localhost:8088/upload.do"
								:on-success="getImageName">
								<img v-if="user.adminImage" :src="getImage(user.adminImage)" class="avatar">
								<i v-else class="el-icon-plus avatar-uploader-icon"></i>
							</el-upload>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="editFlag=false">取消</el-button>
				<el-button size="small" type="primary" class="title" @click="submitForm()">保存
				</el-button>
			</div>
		</el-dialog>

		<el-dialog title="用户权限" :visible.sync="roleMenusFlage" width="30%" @opened="opened">

			<!-- <el-tree :data="menuList" default-expand-all node-key="menuId" ref="tree" highlight-current
				:props="defaultProps">
			</el-tree> -->
			<el-tree :data="menuList"  show-checkbox default-expand-all node-key="menuId" ref="tree"
				highlight-current :props="defaultProps" @check-change="checkNode()">
			</el-tree>

			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="consoleQx()">取消</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
	import admin from "@/assets/js/admin.js";
	export default admin;
</script>

<style>
	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}

	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 178px;
		height: 178px;
		line-height: 178px;
		text-align: center;
	}

	.avatar {
		width: 178px;
		height: 178px;
		display: block;
	}

	.el-select {
		width: 100%;
	}

	.demo-table-expand {
		font-size: 0;
	}

	.demo-table-expand label {
		width: 120px;
		color: #99a9bf;
	}

	.el-form--label-left .el-form-item__label {
		text-align: right;
	}

	.demo-table-expand .el-form-item {
		margin-right: 0;
		margin-bottom: 0;
		width: 50%;
	}
</style>
