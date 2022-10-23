<template>
	<div id="app">
		<div id="app">
			<h4>产品管理 > 产品系列管理</h4>

			<el-row :gutter="20">
				<el-form ref="form" :model="productLineSelect" label-width="80px">
					<el-col :span="4">
						<el-form-item label="产品系列名称">
							<el-input v-model="productLineSelect.productLineChineseName"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="4">
						<el-button type="primary" plain @click="queryCustomerAsset()">查询</el-button>
						<el-button type="primary" plain @click="initSave()">添加</el-button>

					</el-col>
				</el-form>
			</el-row>

			<el-table :data="productLineList" style="width: 85%">
				<el-table-column align="center" type="selection" width="60">
				</el-table-column>
				<el-table-column prop="productLineId" label="产品系列ID" width="150"></el-table-column>
				<el-table-column prop="productLineChineseName" label="产品中文名称" width="150"></el-table-column>
				<el-table-column prop="productLineEnglishName" label="产品英文名称" width="150"></el-table-column>
				<el-table-column prop="collectionBankName" label="汇款信息概略" width="170"></el-table-column>
				<el-table-column label="操作" width="150">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="initEdit(scope.row)">修改</el-button>
						<el-button type="text" size="small" @click="initSaveRemittance(scope.row)">汇款信息</el-button>
					</template>
				</el-table-column>
			</el-table>

			<el-pagination @size-change="pageSizeChange" @current-change="nowPageChange" :small="true"
				:current-page="pageInfo.nowPage" :page-size="pageInfo.pageSize" :page-sizes="[3,6,9,12]"
				layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total">
			</el-pagination>
		</div>

		<el-dialog :title="title" :visible.sync="editFlag" width="50%">
			<el-form label-width="100px" :model='productLine'>
				<el-row>
					<el-col :span="14">
						<el-form-item label="产品渠道">
							<el-select v-model="productLine.productLineQudao">
								<el-option :value="1" label="香港资管"></el-option>
								<el-option :value="2" label="内地资管"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="14">
						<el-form-item label="产品分类">
							<el-select v-model="productLine.productLineType">
								<el-option :value="1" label="基金"></el-option>
								<el-option :value="2" label="保险"></el-option>
								<el-option :value="3" label="证券"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="14">
						<el-form-item label="中文名称">
							<el-input v-model="productLine.productLineChineseName"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="14">
						<el-form-item label="英文名称">
							<el-input v-model="productLine.productLineEnglishName"></el-input>
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


		<el-dialog title="汇款信息" :visible.sync="remittanceFlag" width="50%">
			<el-form label-width="100px" :model='remittance'>

				<el-row>
					<el-col :span="12">
						<el-form-item label="收款银行名称">
							<el-input v-model="remittance.bankName"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="银行SWIFT码">
							<el-input v-model="remittance.bankswift"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="BANK CODE">
							<el-input v-model="remittance.bankCode"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="CNAPS编号">
							<el-input v-model="remittance.cnaps"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="收款银行地区">
							<el-input v-model="remittance.collectionBankArea"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="收款银行城市">
							<el-input v-model="remittance.collectionBankCity"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="收款人户名">
							<el-input v-model="remittance.collectionBankName"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="收款人账号">
							<el-input v-model="remittance.collectionBankAccount"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="24">
						<el-form-item label="收款人地址">
							<el-input v-model="remittance.accountAddress"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="24">
						<el-form-item label="资管机构">
							<el-input v-model="remittance.management"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="remittanceFlag=false">取消</el-button>
				<el-button size="small" type="primary" class="title" @click="remittanceSubmitForm()">保存
				</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: "assets",
		data() {
			return {
				title: "",
				productLineList: [],
				productLineSelect: { // 条件查询提交到服务器的数据
					productLineChineseName: "", // 姓名
					nowPage: 1,
					pageSize: 6
				},
				pageInfo: {
					pageSize: 6,
					nowPage: 1,
					total: 15
				},
				productLine: {
					productLineQudao: 1,
					productLineType: 1,
					productLineChineseName: "",
					productLineEnglishName: "",
					productLineId:""
				},
				editFlag: false,
				remittanceFlag: false,
				remittance: {
					productLineId: 1, // 产品系列ID
					bankName: "", // 银行名称
					bankswift: "", // 银行 SWIFT 码
					bankCode: "", // 银行Code
					cnaps: "", // CNAPS 编号，每个支行的地址对应的唯一编码
					collectionBankArea: "", // 收款银行地区
					collectionBankCity: "", // 收款银行城市
					collectionBankName: "", // 收款户名
					collectionBankAccount: "", // 收款人账号
					accountAddress: "", // 收款人地址
					management: ""
				}
			}
		},
		methods: {

			//条件查询
			queryCustomerAsset() {
				this.queryByConditionForPage();
			},
			//初始化修改
			initEdit(row) {
				
				this.title = "修改产品系列";
				this.productLine=row;
				
				this.editFlag=true;
			},
			pageSizeChange(pageSize) {
				console.log(pageSize);
				this.productLineSelect.pageSize = pageSize;

				this.queryByConditionForPage();

			},
			nowPageChange(nowPage) {
				this.productLineSelect.nowPage = nowPage;

				this.queryByConditionForPage();
			},
			initSave() {
				this.editFlag = true;
				this.title = "添加产品系列";
				this.productLine = {};
			},
			submitForm() {

				var data = this.$qs.stringify(this.productLine);
				if (this.title == "添加产品系列") {
					//添加逻辑
					this.$axios.post("http://localhost:8088/bpl.do?methodName=add", data).then(resp => {
						if (resp.data == true) {
							this.$message({
								type: "success",
								message: "添加成功",
								duration: 1000
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
					this.$axios.post("http://localhost:8088/bpl.do?methodName=update", data).then(resp => {
						if (resp.data == true) {
							alert("修改成功");
							this.editFlag = false;
							//重新查询菜单列表
							this.queryByConditionForPage();

						} else {
							alert("修改失败");
						}
					})
				}

			},
			initSaveRemittance(row) {
				this.remittanceFlag = true;
				
				this.remittance.productLineId = row.productLineId;
				// alert(this.remittance.productLineId);
			},
			remittanceSubmitForm() {

				var data = this.$qs.stringify(this.remittance);
				this.$axios.post("http://localhost:8088/bpl.do?methodName=addRemittance", data).then(response => {
							if (response.data == true) {
								this.$message({
									type: "success",
									message: "添加成功",
									duration: 1000
								});
								this.queryByConditionForPage();
								this.remittanceFlag = false;
								this.remittance={};
							} else {
								alert("添加失败")
							}
						});
					},
					queryByConditionForPage() {
						// var data = this.$qs.stringify(this.productLineSelect);
						this.$axios.get("http://localhost:8088/bpl.do?methodName=queryByPage", {
							params: this.productLineSelect
						}).then(resp => {
							this.productLineList = resp.data.data;
							this.pageInfo.total = resp.data.total;
						})
					}
			},
			mounted() {

				this.queryByConditionForPage();








				this.productLineList = [{
					"collectionBankName": "交易型开放式指数基金",
					"productlinechinesename": "ETF基金",
					"productlineenglishname": "ETF fund",
					"productlineid": 1,
					"productlinequdao": 1,
					"productlinetype": 1
				}, {
					"collectionBankName": "交易型开放式指数基金",
					"productlinechinesename": "满易贷",
					"productlineenglishname": "Manyi loan",
					"productlineid": 2,
					"productlinequdao": 1,
					"productlinetype": 1
				}, {
					"collectionBankName": "鹏华深圳能源清洁能源",
					"productlinechinesename": "鹏华前海REIT",
					"productlineenglishname": "Penghua Qianhai",
					"productlineid": 3,
					"productlinequdao": 1,
					"productlinetype": 1
				}, {
					"collectionBankName": "鹏华深圳能源清洁能源",
					"productlinechinesename": "原油LOF易方达",
					"productlineenglishname": "Crude oil lof e-fonda",
					"productlineid": 4,
					"productlinequdao": 2,
					"productlinetype": 1
				}, {
					"collectionBankName": "招商基金管理有限公司",
					"productlinechinesename": "招商丰泰LOF",
					"productlineenglishname": "China Merchants Fengtai lof",
					"productlineid": 5,
					"productlinequdao": 2,
					"productlinetype": 1
				}, {
					"collectionBankName": "招商基金管理有限公司",
					"productlinechinesename": "高铁LOF",
					"productlineenglishname": "High speed rail lof",
					"productlineid": 6,
					"productlinequdao": 2,
					"productlinetype": 1
				}];

			}
		}
</script>

<style>
</style>
