<template>

	<div id="app">
		<h4> 系统管理 > 菜单管理</h4>

		<el-row :gutter="20">
			<el-form ref="form" :model="menuSelect" label-width="80px">
				<el-col :span="4">
					<el-form-item label="菜单名称">
						<el-input v-model="menuSelect.menuName"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="4">
					<el-form-item label="父级菜单">
						<el-select v-model="menuSelect.parentId">
							<el-option :value="-1" label="所有"></el-option>
							<el-option :value="0" label="无上级"></el-option>
							<el-option :value="1" label="系统管理"></el-option>
							<el-option :value="2" label="独角兽管理"></el-option>
							<el-option :value="3" label="产品管理"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-button type="primary" plain @click="queryCustomerAsset()">查询</el-button>
					<el-button type="primary" plain @click="initSave()">新增</el-button>
				</el-col>
			</el-form>
		</el-row>

		<el-table :data="menuList" style="width: 90%">
			<el-table-column align="center" type="selection" width="60"> </el-table-column>
			<el-table-column prop="menuName" label="菜单名称" width="120"></el-table-column>
			<el-table-column prop="parentId" label="父级菜单编号" width="150"> </el-table-column>
			<el-table-column prop="parentName" label="父级菜单名称" width="150"> </el-table-column>
			<el-table-column prop="menuUrl" label="访问地址" width="190"> </el-table-column>
			<el-table-column prop="menuIcon" label="图标" width="160"> </el-table-column>
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button @click="handleClick(scope.row)" type="text" size="small">详情</el-button>
					<el-button type="text" size="small" @click="initEdit(scope.row)">修改</el-button>
					<el-button type="text" size="small" @click="deleteMenu(scope.row.menuId)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-pagination @size-change="pageSizeChange" @current-change="nowPageChange" :small="true"
			:current-page="pageInfo.nowPage" :page-size="pageInfo.pageSize" :page-sizes="[3,6,9,12]"
			layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total">
		</el-pagination>

		<el-dialog :title="title" :visible.sync="editFlag" width="50%">
			<el-form label-width="100px" :model='menu'>
				<el-row>
					<el-col :span="14">
						<el-form-item label="菜单名称">
							<el-input v-model="menu.menuName"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="14">
						<el-form-item label="父级菜单">
							<el-select v-model="menu.parentId">
								<el-option :value="0" label="无上级"></el-option>
								<el-option :value="1" label="系统管理"></el-option>
								<el-option :value="2" label="独角兽管理"></el-option>
								<el-option :value="3" label="产品管理"></el-option>
								<!-- <el-option v-for="m in menuList" :key="m.mid" :value="m.mid"
									:label="m.menuname">
								</el-option> -->
							</el-select>

						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="14">
						<el-form-item label="访问地址">
							<el-input v-model="menu.menuUrl"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="14">
						<el-form-item label="菜单图标">
							<el-input v-model="menu.menuIcon"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="editFlag=false">取消</el-button>
				<el-button size="small" type="primary" class="title" @click="submitForm()">提交
				</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
	export default {
		name: 'Menu',
		data() {
			return {
				menuList: [{
					"menuicon": "el-icon-share",
					"menuname": "系统管理",
					"menuurl": "",
					"mid": 1,
					"parentid": 0,
					"state": 1
				}, {
					"menuicon": "el-icon-s-marketing",
					"menuname": "独角兽管理",
					"menuurl": "",
					"mid": 2,
					"parentid": 0,
					"state": 1
				}, {
					"menuicon": "el-icon-s-finance",
					"menuname": "产品管理",
					"menuurl": "",
					"mid": 3,
					"parentid": 0,
					"state": 1
				}, {
					"menuicon": "el-icon-user",
					"menuname": "人员管理",
					"menuurl": "/pages/system/user.jsp",
					"mid": 4,
					"parentName": "系统管理",
					"parentid": 1,
					"state": 1
				}, {
					"menuicon": "el-icon-user",
					"menuname": "菜单管理",
					"menuurl": "/pages/system/menu.jsp",
					"mid": 5,
					"parentName": "系统管理",
					"parentid": 1,
					"state": 1
				}],
				editFlag: false,
				title: "",
				menu: {
					menuName: "",
					menuUrl: "",
					menuState: 1,
					parentId: 1,
					menuIcon: "",
					menuId: "",
				},
				pageInfo: {
					nowPage: 1,
					pageSize: 6,
					total: 12,
				},
				menuSelect: {
					menuName: "",
					parentId: -1,
					menuUrl: "",
					menuIcon: "",
					nowPage: 1,
					pageSize: 6,
					methodName: "selectAll",
				}

			}
		},
		methods: {
			//删除菜单
			deleteMenu(menuId){
				console.log(menuId);
				this.$axios.post("http://localhost:8088/menu.do?methodName=deleteMenu&menuId="+menuId).then(resp =>{
					if(resp.data==true){
						alert("删除成功");
						this.editFlag= false;
						this.queryMenuInfoByConditionForPage();
					}else{
						alert("删除失败");
					}
				})
			},
			initEdit(row){
				this.title="修改菜单";
				this.menu=row;
				this.editFlag=true;
			},
			
			initSave() {
				this.title = "添加菜单";
				this.editFlag = true;
				this.menu = {};

			},
			submitForm() {

				var data = this.$qs.stringify(this.menu);
				if (this.title == "添加菜单") {
					//添加逻辑
					this.$axios.post("http://localhost:8088/menu.do?methodName=addMenu", data).then(resp => {
						if (resp.data == true) {
							alert("添加成功");
							this.editFlag = false;
							//重新查询菜单列表
							this.queryMenuInfoByConditionForPage();
						} else {
							alert("添加失败");
						}
					})

				} else {
					//修改逻辑
					this.$axios.post("http://localhost:8088/menu.do?methodName=editMenu", data).then(resp => {
						if (resp.data == true) {
							alert("修改成功");
							this.editFlag = false;
							this.bus.$emit('sendTo',"-1");
							//重新查询菜单列表
							this.queryMenuInfoByConditionForPage();
						} else {
							alert("修改失败");
						}
					})


				}




			},
			// pageSize：每页显示几条数据
			pageSizeChange(pageSize) { // 选择每页显示几天数据之后触发的事件调用的方法
				// axios.get 发送请求到tomcat服务器查询数据
				console.log(pageSize)
				this.menuSelect.pageSize = pageSize;
				this.queryMenuInfoByConditionForPage();
			},
			// nowPage：当前页
			nowPageChange(nowPage) { // 选择每页显示几天数据之后触发的事件调用的方法
				// axios.get 发送请求到tomcat服务器查询数据
				console.log(nowPage)
				this.menuSelect.nowPage = nowPage;
				this.queryMenuInfoByConditionForPage();
			},
			queryMenuInfoByConditionForPage() { //按条件分页查询菜单信息
				this.$axios.get("http://localhost:8088/menu.do", {
					params: this.menuSelect
				}).then(resp => {
					console.log(resp.data)
					this.pageInfo.total = resp.data.total;
					this.menuList = resp.data.data;
				});

			},
			queryCustomerAsset(){
				this.queryMenuInfoByConditionForPage();
			}

		},
		created() {
			this.queryMenuInfoByConditionForPage();

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
