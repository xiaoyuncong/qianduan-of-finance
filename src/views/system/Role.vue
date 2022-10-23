<template>

	<div id="app">
		<h4> 系统管理 > 角色管理</h4>

		<el-row :gutter="20">
			<el-form ref="form" :model="roleSelect" label-width="80px">
				<el-col :span="4">
					<el-form-item label="角色名">
						<el-input v-model="roleSelect.roleName"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-button type="primary" plain @click="queryCustomerAsset()">查询</el-button>
					<el-button type="primary" plain @click="initSave()">新增</el-button>
				</el-col>
			</el-form>
		</el-row>

		<el-table :data="roleList" style="width: 90%">
			<el-table-column align="center" type="selection" width="60"> </el-table-column>
			<el-table-column prop="roleId" label="角色ID" width="120"></el-table-column>
			<el-table-column prop="roleName" label="角色名称" width="150"> </el-table-column>
			<el-table-column label="操作" width="180">
				<template slot-scope="scope">
					<el-button @click="handleClick(scope.row)" type="text" size="small">详情</el-button>
					<el-button type="text" size="small" @click="initEdit(scope.row.roleId)">修改</el-button>
					<el-button type="text" size="small" @click="deleteRole(scope.row.roleId)">删除</el-button>
					<el-button type="text" size="small" @click="initGrant(scope.row)">授权</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-pagination @size-change="pageSizeChange" @current-change="nowPageChange" :small="true"
			:current-page="pageInfo.nowPage" :page-size="pageInfo.pageSize" :page-sizes="[3,6,9,12]"
			layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total">
		</el-pagination>

		<el-dialog :title="title" :visible.sync="editFlag" width="50%">
			<el-form label-width="100px" :model='role'>
				<el-row>
					<el-col :span="14">
						<el-form-item label="角色名称">
							<el-input v-model="role.roleName"></el-input>
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


		<!-- @open：对话框再打开时的回调 -->
		<el-dialog title="授权" :visible.sync="grantFlag" width="50%" @opened="opened">
			<el-form label-width="100px" :model='grantInfo'>
				<el-row>
					<el-col :span="14">
						<el-form-item label="角色名称">
							<el-input v-model="grantInfo.roleName" :disabled="true"></el-input>
						</el-form-item>
					</el-col>
				</el-row>


				<el-row>
					<el-col :span="14">
						<el-form-item label="权限列表">
							<el-tree :data="menuList" check-strictly show-checkbox default-expand-all node-key="menuId"
								ref="tree" highlight-current :props="defaultProps" @check-change="checkNode">
							</el-tree>
						</el-form-item>
					</el-col>
				</el-row>

			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="grantFlag=false">取消</el-button>
				<el-button size="small" type="primary" class="title" @click="saveTree()">保存
				</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
	export default {
		name: 'Role',
		data() {
			return {
				roleList: [],
				title: "",
				editFlag: false,
				role: {
					roleName: "",
					roleId: 1,
				},
				pageInfo: {
					nowPage: 1,
					pageSize: 6,
					total: 12
				},
				roleSelect: {
					roleName: "",
					nowPage: 1,
					pageSize: 6
				},
				grantFlag: false,
				menuList: [],
				checkedMenu: [],
				defaultProps: {
					children: 'sonList',
					label: 'menuName'
				},
				grantInfo: {
					roleId: 1,
					roleName: ""
				},
				checkRoleId: 0,
				flag: false
			}
		},
		methods: {
			//提交权限
			saveTree() {
				this.$axios.post("http://localhost:8088/role.do?methodName=updateQx&roleId="+this.checkRoleId+"&checkedMenu="+this.checkedMenu
				).then(resp => {
					if(resp.data==true){
						alert("授权成功!");
						this.bus.$emit('sendTo',this.checkRoleId);
					}else{
						alert("授权失败");
					}
				});
				
				this.grantFlag=false;
			},


			queryCustomerAsset() {
				this.queryRoleInfoByConditionForPage();
			},
			queryRoleInfoByConditionForPage() { //按条件分页查询菜单信息
				this.$axios.get("http://localhost:8088/role.do?methodName=selectAll", {
					params: this.roleSelect
				}).then(resp => {
					console.log(resp.data)
					this.pageInfo.total = resp.data.total;
					this.roleList = resp.data.data;
				});

			},
			//删除角色
			deleteRole(roleId) {
				this.$axios.post("http://localhost:8088/role.do?methodName=deleteRole&roleId=" + roleId).then(resp => {
					if (resp.data == true) {
						alert("删除成功");
						this.queryRoleInfoByConditionForPage();
					}

				})

			},
			initEdit(roleId) {
				this.role.roleId = roleId;
				this.title = "修改角色";
				this.editFlag = true;

			},

			initSave() {
				this.title = "添加角色";
				this.role = {};
				this.editFlag = true;

			},
			submitForm() {
				var data = this.$qs.stringify(this.role);
				if (this.title == "添加角色") {
					//添加逻辑
					this.$axios.post("http://localhost:8088/role.do?methodName=addRole", data).then(resp => {
						if (resp.data == true) {
							alert("添加成功");
							this.editFlag = false;
							//重新查询菜单列表
							
							this.queryRoleInfoByConditionForPage();

						} else {
							alert("添加失败");
						}
					});

				} else {
					//修改逻辑
					this.$axios.post("http://localhost:8088/role.do?methodName=updateRole", data).then(resp => {
						if (resp.data == true) {
							alert("修改成功");
							this.editFlag = false;
							//重新查询菜单列表
							this.queryRoleInfoByConditionForPage();

						} else {
							alert("修改失败");
						}
					});


				}
			},
			initGrant(role) { // 根据角色Id查询角色对应的权限
				this.grantFlag = true;
				this.grantInfo = {
					roleId: role.roleId,
					roleName: role.roleName
				};
				this.checkRoleId = role.roleId;

				/*
					授权功能实现梳理:
					1.页面加载完成后,从数据库中查询所有的角色  roleList
					2.点击授权按钮后拿到对应的角色roleId,和角色名 roleName;
					3.用拿到的roleId 和roleList中的roleId 进行逐一比对,成功后,携带roleId发送ajax请求,拿到自己权限的menuId数组,赋值给checkdMenu		
				*/
				this.roleList.forEach((role) => {
					if (role.roleId == this.checkRoleId) {
						//发送ajax
						this.$axios.get("http://localhost:8088/role.do?methodName=getQxByRoleId&roleId=" + this
							.checkRoleId).then(resp => {
							this.menuList = resp.data.data;
							this.checkedMenu = resp.data.ids;
							
						})
					}
				})

				this.grantFlag = true;				
			},
			// pageSize：每页显示几条数据
			pageSizeChange(pageSize) { // 选择每页显示几天数据之后触发的事件调用的方法
				// axios.get 发送请求到tomcat服务器查询数据
				console.log(pageSize)
				this.roleSelect.pageSize = pageSize;
				this.queryRoleInfoByConditionForPage();
			},
			// nowPage：当前页
			nowPageChange(nowPage) { // 选择每页显示几天数据之后触发的事件调用的方法
				// axios.get 发送请求到tomcat服务器查询数据
				console.log(nowPage)
				this.roleSelect.nowPage = nowPage;
				this.queryRoleInfoByConditionForPage();
			},
			// 设置需要选中的权限有哪些， el-Dialog 中的内容是懒加载的所以在对话框打开之前不能加载tree空间中的数据，
			opened() {
				this.$refs.tree.setCheckedKeys(this.checkedMenu);
			},
			// changeCheckTree(checkNode, flag) {
			// 	console.log(checkNode, flag)
			// },
			checkNode(checkNodeObj, checkedFlag) {
				// console.log(childFlag)
				console.log(checkNodeObj);
				if (checkedFlag) { // 如果当前节点是选中的状态
					// 如果是子节点，则获取到父节点，并且选中父节点
					if (checkNodeObj.parentId != 0) {
						// console.log(checkNodeObj.parentId)
						// 获取到父节点
						let fu = this.$refs.tree.getNode(checkNodeObj.parentId) //返回选中子节点的父节点的key
						// console.log(fu);
						// 获取父级节点的选中状态
						if (!fu.checked) {
							fu.checked = true;
						}
					}
				
				}
				
				this.checkedMenu=this.$refs.tree.getCheckedKeys();
				
				// console.log(this.checkedMenu);

			}

		},
		mounted() {
			this.queryRoleInfoByConditionForPage();
			this.roleList = [{
				roleId: 1,
				roleName: "超级管理员"
			}, {
				roleId: 2,
				roleName: "系统管理员"
			}, {
				roleId: 3,
				roleName: "独角兽管理员"
			}, {
				roleId: 4,
				roleName: "产品管理员"
			}];
			this.menuList = [{
				"menuicon": "el-icon-share",
				"menuname": "系统管理",
				"menuurl": "",
				"mid": 1,
				"parentid": 0,
				"sonList": [{
					"menuicon": "el-icon-user",
					"menuname": "人员管理",
					"menuurl": "page/base/user",
					"mid": 4,
					"parentid": 1,
					"state": 1
				}, {
					"menuicon": "el-icon-user",
					"menuname": "菜单管理",
					"menuurl": "page/base/menu",
					"mid": 5,
					"parentid": 1,
					"state": 1
				}, {
					"menuicon": "el-icon-user",
					"menuname": "角色管理",
					"menuurl": "page/base/role",
					"mid": 6,
					"parentid": 1,
					"state": 1
				}],
				"state": 1
			}, {
				"menuicon": "el-icon-s-marketing",
				"menuname": "独角兽管理",
				"menuurl": "",
				"mid": 2,
				"parentid": 0,
				"sonList": [{
					"menuicon": "el-icon-info",
					"menuname": "用户资产",
					"menuurl": "page/unicorn/assets",
					"mid": 8,
					"parentid": 2,
					"state": 1
				}, {
					"menuicon": "el-icon-info",
					"menuname": "企业信息管理",
					"menuurl": "page/unicorn/business",
					"mid": 9,
					"parentid": 2,
					"state": 1
				}, {
					"menuicon": "el-icon-info",
					"menuname": "充值提现信息",
					"menuurl": "page/unicorn/recharge",
					"mid": 10,
					"parentid": 2,
					"state": 1
				}],
				"state": 1
			}, {
				"menuicon": "el-icon-s-finance",
				"menuname": "产品管理",
				"menuurl": "",
				"mid": 3,
				"parentid": 0,
				"sonList": [{
					"menuicon": "el-icon-s-cooperation",
					"menuname": "产品系列管理",
					"menuurl": "page/product/series",
					"mid": 11,
					"parentid": 3,
					"state": 1
				}, {
					"menuicon": "el-icon-s-cooperation",
					"menuname": "产品基础管理",
					"menuurl": "page/product/basics",
					"mid": 12,
					"parentid": 3,
					"state": 1
				}, {
					"menuicon": "el-icon-s-cooperation",
					"menuname": "产品推荐管理",
					"menuurl": "page/product/recommend",
					"mid": 13,
					"parentid": 3,
					"state": 1
				}, {
					"menuicon": "el-icon-s-cooperation",
					"menuname": "产品审核",
					"menuurl": "page/product/examine",
					"mid": 14,
					"parentid": 3,
					"state": 1
				}],
				"state": 1
			}];
		}
	}
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
</style>
