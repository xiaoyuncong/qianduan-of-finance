<template>
	<div id="app">
		<h4>产品管理 > 产品推荐</h4>

		<el-row :gutter="20">
			<el-form ref="form" :model="recommendProductSelect" label-width="80px">
				<el-col :span="4">
					<el-form-item label="系列名称">
						<el-input v-model="recommendProductSelect.productName"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-button type="primary" plain @click="queryCustomerAsset()">查询</el-button>
					<el-button type="primary" plain @click="initSave()">添加</el-button>
				</el-col>
			</el-form>
		</el-row>

		<el-table :data="recommendProductList" style="width: 85%">
			<el-table-column align="center" type="selection" width="60">
			</el-table-column>
			<el-table-column prop="productName" label="产品名称" width="150"></el-table-column>
			<el-table-column prop="recommendDegree" label="推荐度" width="150">
				<template slot-scope="scope">
					{{scope.row.recommendDegree == "1"?"超级推荐":""}}
					{{scope.row.recommendDegree == "2"?"推荐":""}}
					{{scope.row.recommendDegree == "3"?"一般推荐":""}}
				</template>
			</el-table-column>
			<el-table-column prop="isFirst" label="是否首发" width="150">
				<template slot-scope="scope">
					{{scope.row.isFirst == "1"?"是":""}}
					{{scope.row.isFirst == "0"?"否":""}}
				</template>
			</el-table-column>
			<el-table-column prop="onlineSubscription" label="线上申购" width="150">
				<template slot-scope="scope">
					{{scope.row.onlineSubscription == "1"?"是":""}}
					{{scope.row.onlineSubscription == "0"?"否":""}}
				</template>
			</el-table-column>
			<el-table-column prop="ordered" label="排序" width="150"></el-table-column>
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="initEdit(scope.row)">修改</el-button>
					<el-button type="text" size="small" @click="initGuanlian(scope.row)">关联申购</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-pagination @size-change="pageSizeChange" @current-change="nowPageChange" :small="true"
			:current-page="pageInfo.nowPage" :page-size="pageInfo.pageSize" :page-sizes="[3,6,9,12]"
			layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total">
		</el-pagination>

		<el-dialog :title="title" :visible.sync="editFlag" width="40%">
			<el-form label-width="150px" :model='recommendProduct'>
				<el-row>
					<el-col :span="20">
						<el-form-item label="推荐产品">
							<el-select v-model="recommendProduct.productId">
								<el-option v-for="product in productList" :value="product.productId"
									:label="product.productName" :key="product.productId">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="20">
						<el-form-item label="推荐度">
							<el-select v-model="recommendProduct.recommendDegree">
								<el-option :value="1" label="超级推荐"></el-option>
								<el-option :value="2" label="推荐"></el-option>
								<el-option :value="3" label="一般推荐"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="20">
						<el-form-item label="投顾端是否可见">
							<el-radio v-model="recommendProduct.isVisable" :label="1">是</el-radio>
							<el-radio v-model="recommendProduct.isVisable" :label="0">否</el-radio>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="20">
						<el-form-item label="是否首发">
							<el-radio v-model="recommendProduct.isFirst" :label="1">是</el-radio>
							<el-radio v-model="recommendProduct.isFirst" :label="0">否</el-radio>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="20">
						<el-form-item label="线上申购 ">
							<el-radio v-model="recommendProduct.onlineSubscription" :label="1">是</el-radio>
							<el-radio v-model="recommendProduct.onlineSubscription" :label="0">否</el-radio>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="20">
						<el-form-item label="排序">
							<el-input v-model="recommendProduct.ordered"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="20">
						<el-form-item label="推荐理由 ">
							<el-input v-model="recommendProduct.description"></el-input>
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


		<el-dialog :title="recommendRelationTitle" :visible.sync="recommendRelationFlag" width="50%">
			<el-form label-width="100px" :model='recommendRelation'>
				<el-row>
					<el-col :span="9">
						<el-form-item label="未关联">
							<el-select v-model="recommendRelation.relationProductId" multiple placeholder="请选择">
								<el-option v-for="product in NproductList" :value="product.productId"
									:label="product.productName" :key="product.productId">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="4" style="padding-left: 40px;">
						<el-button type="primary" plain @click="associatedProduct()">关联</el-button>
						<br />
						<br />
						<el-button plain type="warning" @click="quitAssociate()">取消关联</el-button>
					</el-col>
					<el-col :span="10">
						<el-form-item label="已关联">
							<el-select v-model="recommendRelation.relationAssociatedId" multiple placeholder="请选择">
								<el-option v-for="product in RproductList" :value="product.productId"
									:label="product.productName" :key="product.productId">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="recommendRelationFlag=false">取消</el-button>
				<el-button size="small" type="primary" class="title" @click="netWorthSubmitForm()">保存</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: "assets",
		data() {
			return {
				NproductList: [],
				recommendProductList: [],
				RproductList: [],
				productList: [],
				recommendProductSelect: { // 条件查询提交到服务器的数据
					productName: "", // 姓名
					nowPage: 1,
					pageSize: 6
				},
				pageInfo: {
					pageSize: 6,
					nowPage: 1,
					total: 15
				},
				recommendProduct: {
					productId: 1,
					admin: 1, // 推荐人，当前的登录人
					recommendDegree: 1, // 推荐度  1超级推荐  2推荐  3一般推荐
					isVisable: 1, // 投顾端是否可见  1：是  0：否
					isFirst: 1, // 是否首发 1：是  0：否
					onlineSubscription: 1, // 线上申购  1：是  0：否
					description: "",
					ordered: ""
				},
				editFlag: false,
				recommendRelationFlag: false,
				recommendRelation: {
					relationProductId: [],
					recommendProductId: 1,
					productName: "",
					relationAssociatedId: []
				},
				recommendRelationTitle: ""
			}
		},
		methods: {
			
			
			quitAssociate(){
				// this.recommendRelation.relationAssociatedId=[];
				// this.recommendRelation.relationProductId=[];
				//取消关联,把已关联的id数组,赋值给未关联的id数组,然后把已关联的id数组志为空
				let recommendId = this.recommendRelation.relationAssociatedId;
				this.recommendRelation.relationProductId = recommendId;
				this.recommendRelation.relationAssociatedId=[];
				
			},

			//按条件查询
			queryCustomerAsset() {
				this.queryByConditionForPage();
			},

			//初始化推荐
			initEdit(row) {
				//查询所有产品
				console.log(row);
				this.$axios.get("http://localhost:8088/bp.do?methodName=selectAll").then(resp => {
					this.productList = resp.data;
				})
				this.recommendProduct = row;
				this.title = "修改产品推荐";
				this.editFlag = true;

			},
			pageSizeChange(pageSize) {
				this.recommendProductSelect.pageSize = pageSize;
				this.queryByConditionForPage();
			},
			nowPageChange(nowPage) {
				this.recommendProductSelect.nowPage = nowPage;
				this.queryByConditionForPage();
			},
			initSave() {

				this.title = "添加产品推荐";
				this.recommendProduct = {};
				//查询所有产品
				this.$axios.get("http://localhost:8088/bp.do?methodName=selectAll").then(resp => {
					this.productList = resp.data;
				})
				this.editFlag = true;
			},
			submitForm() {
				var data = this.$qs.stringify(this.recommendProduct);
				if (this.title == "添加产品推荐") {
					//添加逻辑
					this.$axios.post("http://localhost:8088/rp.do?methodName=add", data).then(resp => {
						if (resp.data == true) {
							this.$message({
								type: "success",
								message: "添加成功",
							});
							this.editFlag = false;
							//重新查询菜单列表
							this.queryByConditionForPage();

						} else {
							alert("添加失败");
						}
					})

				} else {
					//修改逻辑
					this.$axios.post("http://localhost:8088/rp.do?methodName=update", data).then(resp => {
						if (resp.data == true) {
							this.$message({
								type: "success",
								message: "修改成功",
								duration: 1000
							});
							this.editFlag = false;
							//重新查询菜单列表
							this.queryByConditionForPage();


						} else {
							alert("修改失败");
						}
					})
				}
			},
			netWorthSubmitForm() {
				// this.recommendRelation.relationAssociatedId .forEach(id => {
				// 	this.recommendRelation.relationAssociatedId.push(id)
				// })
				
				this.$axios.get("http://localhost:8088/prc.do?methodName=addRelated&pId=" + this.recommendRelation
					.productId+"&ids="+this.recommendRelation.relationAssociatedId+"&noIds="+this.recommendRelation.relationProductId).then(resp => {
						if(resp.data==true)
						alert("关联成功")
				
				})
				this.recommendRelationFlag = false;
				this.recommendRelation.relationAssociatedId=[];
				this.recommendRelation.relationProductId=[];
			},
			initGuanlian(row) {
				// this.recommendRelation.relationAssociatedId=[];
				// this.recommendRelation.relationProductId=[];
				
				this.recommendRelation.productName = row.productName;
				this.recommendRelation.productId = row.productId;
				this.recommendRelationTitle = row.productName + "关联";
				this.NproductList = [];
				this.RproductList = [];
					
				//查询所有的产品
				this.$axios.get("http://localhost:8088/bp.do?methodName=selectAll").then(resp => {
					this.productList = resp.data;
				})

				//携带productId发送ajax ,分别查询和productId相关联的产品id数组存入relationAssociatedId
				//查询和productId未关联的产品id数组存入relationProductId
				this.$axios.get("http://localhost:8088/prc.do?methodName=getRIds&productId=" + this.recommendRelation
					.productId).then(resp => {
					// this.recommendProduct.relationAssociatedId=resp.data;
					this.productList.forEach(p => {
						resp.data.forEach(i => {
							if (p.productId == i)
								this.RproductList.push(p);
						})
					})
				})
				this.$axios.get("http://localhost:8088/prc.do?methodName=getNoRIds&productId=" + this.recommendRelation
					.productId).then(resp => {
					// this.recommendProduct.relationProductId=resp.data;
					this.productList.forEach(p => {
						resp.data.forEach(i => {
							if (p.productId == i)
								this.NproductList.push(p);
						})
					})
				})
				
				this.recommendRelationFlag = true;


			},
			associatedProduct() {
				// 获取选择的未关联的数据
				// this.recommendRelation.relationAssociatedId=[];
				// this.recommendRelation.relationProductId=[];
				let recommendId = this.recommendRelation.relationProductId;

				// recommendId.forEach(id => {
				// 	this.recommendRelation.relationAssociatedId.push(id)
				// })

				// this.$axios.get("http://localhost:8088/prc.do?methodName=addRelated&pId=" + this.recommendRelation
				// 	.productId,this.recommendRelation.relationAssociatedId).then(resp => {
				// 		if(resp.data==true)
				// 		this.flushRelated();

				// })



				// // 赋值给已关联的下拉列表
				this.recommendRelation.relationAssociatedId = recommendId;
				this.recommendRelation.relationProductId=[];
			},
			
			flushRelated(){
				
				this.NproductList = [];
				this.RproductList = [];
				
				this.$axios.get("http://localhost:8088/bp.do?methodName=selectAll").then(resp => {
					this.productList = resp.data;
				})
				
				//携带productId发送ajax ,分别查询和productId相关联的产品id数组存入relationAssociatedId
				//查询和productId未关联的产品id数组存入relationProductId
				this.$axios.get("http://localhost:8088/prc.do?methodName=getRIds&productId=" + this.recommendRelation
					.productId).then(resp => {
					// this.recommendProduct.relationAssociatedId=resp.data;
					this.productList.forEach(p => {
						resp.data.forEach(i => {
							if (p.productId == i)
								this.RproductList.push(p);
						})
					})
				})
				this.$axios.get("http://localhost:8088/prc.do?methodName=getNoRIds&productId=" + this.recommendRelation
					.productId).then(resp => {
					// this.recommendProduct.relationProductId=resp.data;
					this.productList.forEach(p => {
						resp.data.forEach(i => {
							if (p.productId == i)
								this.NproductList.push(p);
						})
					})
				})
			},

			//按条件分页查询
			queryByConditionForPage() {
				// var data = this.$qs.stringify(this.productSelect);

				this.$axios.get("http://localhost:8088/rp.do?methodName=queryByPage", {
					params: this.recommendProductSelect
				}).then(resp => {
					this.recommendProductList = resp.data.data;
					this.pageInfo.total = resp.data.total;
				})
			}
		},
		mounted() {
			this.queryByConditionForPage();
		}
	}
</script>

<style>
</style>
