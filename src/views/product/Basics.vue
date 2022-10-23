<template>
	<div id="app">
		<div id="app">
			<h4>产品管理 > 产品基础管理</h4>

			<el-row :gutter="20">
				<el-form ref="form" :model="productSelect" label-width="80px">
					<el-col :span="4">
						<el-form-item label="产品名称">
							<el-input v-model="productSelect.productName"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="4">
						<el-form-item label="产品类型">
							<el-select v-model="productSelect.productTypeId">
								<el-option >全部</el-option>
								<el-option :value="4" label="对冲基金"></el-option>
								<el-option :value="5" label="其他基金"></el-option>
								<el-option :value="6" label="阳光私募"></el-option>
								<el-option :value="7" label="储蓄险"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="4">
						<el-form-item label="审核状态">
							<el-select v-model="productSelect.auditState">
								<el-option >全部</el-option>
								<el-option :value="1" label="审核通过"></el-option>
								<el-option :value="2" label="审核为通过"></el-option>
								<el-option :value="0" label="未审核"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="4">
						<el-button type="primary" plain @click="queryCustomerAsset()">查询</el-button>
						<el-button type="primary" plain @click="initSave()">添加</el-button>
					</el-col>
				</el-form>
			</el-row>

			<el-table :data="productList" style="width: 85%">
				<el-table-column align="center" type="selection" width="60">
				</el-table-column>
				<el-table-column prop="productName" label="产品名称" width="150"></el-table-column>
				<el-table-column prop="productLineChineseName" label="产品系列" width="150"></el-table-column>
				<el-table-column prop="productTypeId" label="二级分类" width="150">
					<template slot-scope="scope">
						{{scope.row.productTypeId == "4"?"对冲基金":""}}
						{{scope.row.productTypeId == "5"?"其他基金":""}}
						{{scope.row.productTypeId == "6"?"阳光私募":""}}
						{{scope.row.productTypeId == "7"?"储蓄险":""}}
					</template>
				</el-table-column>
				<el-table-column prop="manageOrgnazition" label="机构名称" width="150"></el-table-column>
				<el-table-column prop="openTime" label="开放时间" width="150"></el-table-column>
				<el-table-column prop="currencyType" label="币种" width="150">
					<template slot-scope="scope">
						{{scope.row.currencyType == "1"?"美元":""}}
						{{scope.row.currencyType == "2"?"人民币":""}}
						{{scope.row.currencyType == "3"?"日元":""}}
						{{scope.row.currencyType == "4"?"韩元":""}}
					</template>
				</el-table-column>
				<el-table-column prop="auditState" label="审核状态" width="150">
					<template slot-scope="scope">
						{{scope.row.auditState == "0"?"未审核":""}}
						{{scope.row.auditState == "1"?"审核通过":""}}
						{{scope.row.auditState == "2"?"审核不通过":""}}
					</template>
				</el-table-column>
				<el-table-column label="操作" width="150">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="initEdit(scope.row)">修改</el-button>
						<el-button type="text" size="small" @click="initNetWorth(scope.row)">净值管理</el-button>
					</template>
				</el-table-column>
			</el-table>

			<el-pagination @size-change="pageSizeChange" @current-change="nowPageChange" :small="true"
				:current-page="pageInfo.nowPage" :page-size="pageInfo.pageSize" :page-sizes="[3,6,9,12]"
				layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total">
			</el-pagination>
		</div>

		<el-dialog :title="title" :visible.sync="editFlag" width="50%">
			<el-form label-width="150px" :model='productInfo'>
				<el-divider content-position="left">基本信息</el-divider>
				<el-row>
					<el-col :span="12">
						<el-form-item label="产品系列">
							<el-select v-model="productInfo.productLineId">
								<el-option v-for="productLine in productLineList" :value="productLine.productLineId"
									:label="productLine.productLineChineseName" :key="productLine.productLineId">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="管理机构">
							<el-input v-model="productInfo.manageOrgnazition"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="产品名称">
							<el-input v-model="productInfo.productName"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="二级分类">
							<el-select v-model="productInfo.productTypeId">
								<el-option :value="4" label="对冲基金"></el-option>
								<el-option :value="5" label="其他基金"></el-option>
								<el-option :value="6" label="阳光私募"></el-option>
								<el-option :value="7" label="储蓄险"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="年化收益率">
							<el-input v-model="productInfo.annualYield"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="货币类型">
							<el-select v-model="productInfo.currencyType">
								<el-option :value="1" label="美元"></el-option>
								<el-option :value="2" label="人民币"></el-option>
								<el-option :value="3" label="日元"></el-option>
								<el-option :value="4" label="韩元"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>

				<el-divider content-position="left">认购属性</el-divider>
				<el-row>
					<el-col :span="12">
						<el-form-item label="开发时间">
							<el-date-picker v-model="productInfo.openTime"  value-format="yyyy-MM-dd" type="date" placeholder="选择日期">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="认购周期">
							<el-input v-model="productInfo.subscriptionCycle"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="基金管理费率">
							<el-input v-model="productInfo.fundManageRates"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="认购费率">
							<el-input v-model="productInfo.subscriptionRates"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="起投金额">
							<el-input v-model="productInfo.subscriptionStartMoney"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="认购费收取方式">
							<el-select v-model="productInfo.collectType">
								<el-option :value="1" label="前端收费"></el-option>
								<el-option :value="2" label="后端收费"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>


				<el-divider content-position="left">赎回属性</el-divider>
				<el-row>
					<el-col :span="12">
						<el-form-item label="赎回周期">
							<el-input v-model="productInfo.collectCycle"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="赎回起始金额">
							<el-input v-model="productInfo.collectStartMoney"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="赎回费">
							<el-input v-model="productInfo.collectMoney"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="锁定期">
							<el-input v-model="productInfo.lockPeriod"></el-input>
						</el-form-item>
					</el-col>
				</el-row>


				<el-divider content-position="left">审核</el-divider>
				<el-row>
					<el-col :span="12">
						<!-- <el-form-item label="审核人">
							<el-input v-model="productInfo.adminId"></el-input>
						</el-form-item> -->
						<el-form-item label="审核人">
							<el-select v-model="productInfo.adminId">
								<el-option v-for="admin in adminList" :value="admin.adminId"
									:label="admin.adminName" :key="admin.adminId">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<!-- <el-col :span="12">
						<el-form-item label="是否通过">
							<el-radio v-model="productInfo.examineState" label="1">审核通过</el-radio>
							<el-radio v-model="productInfo.examineState" label="2">审核不通过</el-radio>
						</el-form-item>
					</el-col> -->
				</el-row>
				<!-- <el-row>
					<el-col :span="24">
						<el-form-item label="审核意见">
							<el-input v-model="productInfo.examineMassage"></el-input>
						</el-form-item>
					</el-col>
				</el-row> -->

			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="editFlag=false">取消</el-button>
				<el-button size="small" type="primary" class="title" @click="submitForm()">保存
				</el-button>
			</div>
		</el-dialog>


		<el-dialog title="编辑净值" :visible.sync="netWorthFlag" width="50%">
			<el-form label-width="100px" :model='netWorth'>
				<el-row>
					<el-col :span="24">
						<el-form-item label="产品名称">
							<el-input v-model="netWorth.productName" disabled></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="单位净值">
							<el-input v-model="netWorth.netWorthCompany"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="净值基准日">
							<el-date-picker v-model="netWorth.netWorthBenchmark" type="date">
							</el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="累计增长率">
							<el-input v-model="netWorth.growthRate"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="netWorthFlag=false">取消</el-button>
				<el-button size="small" type="primary" class="title" @click="netWorthSubmitForm()">保存
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
				title:"",
				productList: [],
				adminList:[],
				productLineList: [],
				productSelect: { // 条件查询提交到服务器的数据
					productName: "", // 姓名
					productTypeId: "",
					auditState: "",
					pageSize:6,
					nowPage:1
					
				},
				pageInfo: {
					pageSize: 6,
					nowPage: 1,
					total: 15
				},
				productInfo: {
					"adminId": 1,//审核人id
					"collectCycle": 1,//赎回周期
					"collectMoney": 0,//赎回费率
					"collectStartMoney": 0,//赎回起始金额
					"collectType": 1,//认购费收取方式
					"createtime": "",//创建时间
					"currencyType": 2,//货币类型
					"edittime": "",//编辑时间
					"examineMassage": "",//审核意见
					"auditState": 0,//审核状态
					"fundManageRates": 0,//基金管理费率
					"lockPeriod": 3,//锁定期
					"manageOrgnazition": "私募投资基金募",//管理机构
					"subscriptionRates": 0.,//认购费率
					"openTime": "",//开放时间
					"productId": 1,
					"productLineId": 1,
					"productName": "",
					"subscriptionStartMoney": 0,//认购起投金额
					"subscriptionCycle": 0,//认购周期
					"annualYield": 0.03,//年利率
					"productTypeId": 4
				},
				editFlag: false,
				netWorthFlag: false,
				netWorth: {
					productId: 1,
					productName: "",
					unitNet: 0, // 单位净值
					netBase: "", //净值基准日
					growthRate: 0 //累计增长率
				}
			}
		},
		methods: {
			
			//条件查询
			queryCustomerAsset() {
				this.queryByConditionForPage();
			},
			
			initEdit(row){
				this.productInfo=row;
				this.title="修改产品";
				this.$axios.get("http://localhost:8088/bpl.do?methodName=selectAll").then(resp => {
						this.productLineList = resp.data;
					})
				//查询所有具有产品审核权限的admin 为了选中
				this.$axios.get("http://localhost:8088/bp.do?methodName=selectAllAdminForAudit").then(resp =>{
					this.adminList =resp.data;
				})
				this.editFlag=true;				
			},
			
			pageSizeChange(pageSize) {
				this.productSelect.pageSize = pageSize;
				this.queryByConditionForPage();
			},
			nowPageChange(nowPage) {
				this.productSelect.nowPage = nowPage;
				this.queryByConditionForPage();
			},
			initSave() {
				this.editFlag = true;
				this.title="添加产品";
				this.$axios.get("http://localhost:8088/bpl.do?methodName=selectAll").then(resp => {
						this.productLineList = resp.data;
					})
				//查询所有具有产品审核权限的admin
				this.$axios.get("http://localhost:8088/bp.do?methodName=selectAllAdminForAudit").then(resp =>{
					this.adminList =resp.data;
				})
				
				this.productInfo={};
				
				
			},
			submitForm() {
				var data = this.$qs.stringify(this.productInfo);
				if (this.title == "添加产品") {
					//添加逻辑
					this.$axios.post("http://localhost:8088/bp.do?methodName=add", data).then(resp => {
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
					this.$axios.post("http://localhost:8088/bp.do?methodName=update", data).then(resp => {
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
				var data = this.$qs.stringify(this.netWorth);
				this.$axios.post("http://localhost:8088/pn.do?methodName=add", data).then(resp => {
					if (resp.data == true) {
						this.$message({
							type: "success",
							message: "添加成功",
						});
						this.netWorthFlag=false;
						//重新查询菜单列表
						this.queryByConditionForPage();
						
					} else {
						alert("添加失败");
					}
				});
				
			},
			initNetWorth(row) {
				this.netWorthFlag = true;
				this.netWorth.productName = row.productName;
				this.netWorth.productId = row.productId;
			},
			queryByConditionForPage() {
				// var data = this.$qs.stringify(this.productSelect);
				this.$axios.get("http://localhost:8088/bp.do?methodName=queryByPage", {params:this.productSelect}
				).then(resp => {
					this.productList = resp.data.data;
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
