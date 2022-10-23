var vueObj = {
	name: 'admin',
	data() {
		return {
			adminList: [],
			roleList: [{
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
			}],
			pageInfo: {
				nowPage: 1,
				pageSize: 6,
				total: 12
			},

			adminSelect: { // 查询提交的数据
				adminName: "",
				adminId: "",
				nowPage: 1,
				pageSize: 6,
				methodName: "getAdminByPage" // 调用的servlet中方法名
			},
			editFlag: false,
			user: {
				adminName: "",
				adminImage: "",
				adminState: 1,
				roleId: 1,
				methodName: "saveAdmin"
			},
			menuList: [],
			defaultProps: {
				children: 'sonList',
				label: 'menuName'
			},
			checkedMenu: [],
			roleMenusFlage: false,
			title: "添加管理员",


		}
	},
	methods: {


		//修改管理员信息的初始化
		editAdmin(row) {
			this.title = "修改管理员信息";
			this.editFlag = true;
			this.user.adminId = row.adminId;
			this.user.adminName = row.adminName;
			this.user.adminImage = row.adminImage;
			this.user.roleId = row.roleId;
			this.user.adminState = row.adminState;
			this.user.methodName = "editAdmin";



		},


		//删除管理员,状态改为0
		deleteUser(adminId) {
			console.log(adminId);
			this.$axios.post("http://localhost:8088/admin.do?methodName=deleteAdmin&adminId=" + adminId).then(
				resp => {
					if (resp.data == "success") {
						this.$message({
							type: "success",
							message: "删除成功"
						});

						this.queryAdminInfo();

					} else {
						alert("系统忙,请稍后重试!");
					}
				})
		},

		//按条件查询点击按钮
		queryCustomerAsset() {
			this.queryAdminInfo();
		},
		initSave() {
			this.title = "添加管理员信息";
			this.editFlag = true;
			this.user = { // 添加/修改 管理员的数据值
				adminName: "",
				adminImage: "",
				adminState: 1,
				roleId: 1,
				methodName: "saveAdmin"
			};
		},
		//编辑员工的方法(添加和修改)
		submitForm() {
			var data = this.$qs.stringify(this.user);
			if (this.title == "添加管理员信息") {
				//添加逻辑
				this.$axios.post("http://localhost:8088/admin.do", data).then(resp => {
					if (resp.data == true) {
						this.$message({
							type: "success",
							message: "添加成功"
						});
						this.editFlag = false;

						this.queryAdminInfo();
					} else {
						alert("添加失败");
					}
				});

			} else {
				//修改逻辑

				this.$axios.post("http://localhost:8088/admin.do", data).then(resp => {
					if (resp.data == true) {
						this.$message({
							type: "success",
							message: "修改成功"
						});
						this.editFlag = false;
						this.queryAdminInfo();
					} else {
						alert("修改失败");
					}
				});
			}



		},
		getImage(imageName) { // 拼接图片的路径
			return "http://localhost:8088/" + imageName;
		},
		// res:组件触发事件之后，自动调用该方法，并且有element ui 传递3个参数，response  tomcat服务器传递的数据, file 上传的文件, fileList 上传组件上传过的文件集合
		getImageName(res) { //获取图片上传成之后的图片名称
			console.log(res)
			this.user.adminImage = res; // 将文件赋值给user中的adminImage中
		},
		// roleId：角色Id
		getUserMenu(roleId) { // 通过用户的角色ID获取用户的所有权限
			
			//发送ajax
			this.$axios.get("http://localhost:8088/role.do?methodName=getQxByRoleId&roleId=" + 
				roleId).then(resp => {
				this.menuList = resp.data.data;
				this.checkedMenu = resp.data.ids;
			});
			
			// this.$refs.tree.setCheckedKeys(this.checkedMenu);
			
			this.roleMenusFlage=true;
		},
		opened() {
			this.$refs.tree.setCheckedKeys(this.checkedMenu);
		
		},
		checkNode(checkNodeObj, checkedFlag) {
			// console.log(childFlag)
			// console.log(checkNodeObj);
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
		
		},
		consoleQx(){
			this.checkedMenu=[];
			this.roleMenusFlage=false;
		},
		pageSizeChange(pageSize) {
			console.log(pageSize);
			this.adminSelect.pageSize = pageSize;
			// 查询管理员数据
			this.queryAdminInfo();
		},
		nowPageChange(nowPage) {
			console.log(nowPage)
			this.adminSelect.nowPage = nowPage;
			// 查询管理员数据
			this.queryAdminInfo();
		},
		queryAdminInfo() { // 查询管理员
			this.$axios.get("http://localhost:8088/admin.do", {
				params: this.adminSelect
			}).then(resp => {
				console.log(resp.data); // resp.data：resultCode对象（Pageinfo）

				// 获取分页对象
				var page = resp.data;
				// 获取分页数据 
				var list = page.data;
				// 分页数据
				this.adminList = list;
				this.pageInfo.total = page.total;
			});
		}


	},
	created() {
		// 查询管理员
		this.queryAdminInfo();
		//查询用户角色表赋值到roleList
		this.$axios.get("http://localhost:8088/admin.do?methodName=getRole").then(resp => {
			this.roleList = resp.data;
		});

	}
};

var allMenus = [{
	"menuicon": "el-icon-share",
	"menuname": "系统管理",
	"menuurl": "",
	"mid": 1,
	"parentid": 0,
	"sonList": [{
		"menuicon": "el-icon-user",
		"menuname": "人员管理",
		"menuurl": "/base/admin",
		"mid": 4,
		"parentid": 1,
		"state": 1
	}, {
		"menuicon": "el-icon-user",
		"menuname": "菜单管理",
		"menuurl": "/base/menu",
		"mid": 5,
		"parentid": 1,
		"state": 1
	}, {
		"menuicon": "el-icon-user",
		"menuname": "角色管理",
		"menuurl": "/base/role",
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
		"menuurl": "/unicorn/assets",
		"mid": 8,
		"parentid": 2,
		"state": 1
	}, {
		"menuicon": "el-icon-info",
		"menuname": "企业信息管理",
		"menuurl": "/unicorn/business",
		"mid": 9,
		"parentid": 2,
		"state": 1
	}, {
		"menuicon": "el-icon-info",
		"menuname": "充值提现信息",
		"menuurl": "/unicorn/recharge",
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
		"menuurl": "/product/series",
		"mid": 11,
		"parentid": 3,
		"state": 1
	}, {
		"menuicon": "el-icon-s-cooperation",
		"menuname": "产品基础管理",
		"menuurl": "/product/basics",
		"mid": 12,
		"parentid": 3,
		"state": 1
	}, {
		"menuicon": "el-icon-s-cooperation",
		"menuname": "产品推荐管理",
		"menuurl": "/product/recommend",
		"mid": 13,
		"parentid": 3,
		"state": 1
	}, {
		"menuicon": "el-icon-s-cooperation",
		"menuname": "产品审核",
		"menuurl": "/product/examine",
		"mid": 14,
		"parentid": 3,
		"state": 1
	}],
	"state": 1
}];

var productMenus = [{
	"menuicon": "el-icon-s-finance",
	"menuname": "产品管理",
	"menuurl": "",
	"mid": 3,
	"parentid": 0,
	"sonList": [{
		"menuicon": "el-icon-s-cooperation",
		"menuname": "产品系列管理",
		"menuurl": "/product/series",
		"mid": 11,
		"parentid": 3,
		"state": 1
	}, {
		"menuicon": "el-icon-s-cooperation",
		"menuname": "产品基础管理",
		"menuurl": "/product/basics",
		"mid": 12,
		"parentid": 3,
		"state": 1
	}, {
		"menuicon": "el-icon-s-cooperation",
		"menuname": "产品推荐管理",
		"menuurl": "/product/recommend",
		"mid": 13,
		"parentid": 3,
		"state": 1
	}, {
		"menuicon": "el-icon-s-cooperation",
		"menuname": "产品审核",
		"menuurl": "/product/examine",
		"mid": 14,
		"parentid": 3,
		"state": 1
	}],
	"state": 1
}];

var unicornMenus = [{
	"menuicon": "el-icon-s-marketing",
	"menuname": "独角兽管理",
	"menuurl": "",
	"mid": 2,
	"parentid": 0,
	"sonList": [{
		"menuicon": "el-icon-info",
		"menuname": "用户资产",
		"menuurl": "/unicorn/assets",
		"mid": 8,
		"parentid": 2,
		"state": 1
	}, {
		"menuicon": "el-icon-info",
		"menuname": "企业信息管理",
		"menuurl": "/unicorn/business",
		"mid": 9,
		"parentid": 2,
		"state": 1
	}, {
		"menuicon": "el-icon-info",
		"menuname": "充值提现信息",
		"menuurl": "/unicorn/recharge",
		"mid": 10,
		"parentid": 2,
		"state": 1
	}],
	"state": 1
}];

var systemMenus = [{
	"menuicon": "el-icon-share",
	"menuname": "系统管理",
	"menuurl": "",
	"mid": 1,
	"parentid": 0,
	"sonList": [{
		"menuicon": "el-icon-user",
		"menuname": "人员管理",
		"menuurl": "/base/admin",
		"mid": 4,
		"parentid": 1,
		"state": 1
	}, {
		"menuicon": "el-icon-user",
		"menuname": "菜单管理",
		"menuurl": "/base/menu",
		"mid": 5,
		"parentid": 1,
		"state": 1
	}, {
		"menuicon": "el-icon-user",
		"menuname": "角色管理",
		"menuurl": "/base/role",
		"mid": 6,
		"parentid": 1,
		"state": 1
	}],
	"state": 1
}];

console.log(allMenus);
console.log(productMenus);
console.log(systemMenus);
console.log(unicornMenus)

export default vueObj;
