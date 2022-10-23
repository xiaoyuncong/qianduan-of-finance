<template>
	<div id="app">
		<div id="app">
			<h4>独角兽管理 > 用户资产</h4>

			<el-row :gutter="20">
				<el-form ref="form" :model="customerAssetSelect" label-width="80px">
					<el-col :span="4">
						<el-form-item label="姓名">
							<el-input v-model="customerAssetSelect.userName"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="4">
						<el-form-item label="电话">
							<el-input v-model="customerAssetSelect.iphone"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="2">
						<el-button type="primary" plain @click="queryCustomerAsset()">查询</el-button>
					</el-col>
				</el-form>
			</el-row>

			<el-table :data="customerAssetsList" style="width: 85%">
				<el-table-column align="center" type="selection" width="60">
				</el-table-column>
				<el-table-column prop="userCode" label="编号" width="150"></el-table-column>
				<el-table-column prop="" label="客户姓名" width="150">
					<template slot-scope="scope">
						<el-tag type="primary" disable-transitions>
							{{scope.row.userName}}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="iphone" label="电话" width="150"></el-table-column>
				<el-table-column prop="businessName" label="公司" width="150"></el-table-column>
				<el-table-column prop="holdNumber" label="购买数量" width="150"></el-table-column>
				<el-table-column prop="holdMoney" label="成本价格" width="150"></el-table-column>
			</el-table>


			<el-pagination @size-change="pageSizeChange" @current-change="nowPageChange" :small="true"
				:current-page="pageInfo.nowPage" :page-size="pageInfo.pageSize" :page-sizes="[3,6,9,12]"
				layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	export default {
		name: "assets",
		data() {
			return {
				customerAssetsList: [{ // 用户所有资产
					"businessName": "纬德信息",
					"customerId": 1,
					"holdMoney": 25.22,
					"holdNumber": 30,
					"iphone": "13530204563",
					"userCode": "43290",
					"userName": "admin"
				}, {
					"businessName": "杭州园林",
					"customerId": 2,
					"holdMoney": 18.88,
					"holdNumber": 78,
					"iphone": "13530204563",
					"userCode": "43290",
					"userName": "admin"
				}, {
					"businessName": "纬德信息",
					"customerId": 3,
					"holdMoney": 38.23,
					"holdNumber": 25,
					"iphone": "13533204563",
					"userCode": "33290",
					"userName": "xiaobai"
				}, {
					"businessName": "纬德信息",
					"customerId": 7,
					"holdMoney": 14.38,
					"holdNumber": 130,
					"iphone": "13578204563",
					"userCode": "23290",
					"userName": "xiaohong"
				}, {
					"businessName": "杭州园林",
					"customerId": 8,
					"holdMoney": 28.38,
					"holdNumber": 10,
					"iphone": "13578204563",
					"userCode": "23290",
					"userName": "xiaohong"
				}, {
					"businessName": "澳华内镜",
					"customerId": 9,
					"holdMoney": 34.47,
					"holdNumber": 88,
					"iphone": "13578204563",
					"userCode": "23290",
					"userName": "xiaohong"
				}],
				customerAssetSelect: { // 条件查询提交到服务器的数据
					type: "showCustomer",
					pageSize: 3,
					nowPage: 1,
					userName: "", // 姓名
					iphone: "" // 电话
				},
				pageInfo: {
					pageSize: 6,
					nowPage: 1,
					total: 15
				}
			}
		},
		methods: {
			pageSizeChange(pageSize) {
				this.customerAssetSelect.pageSize = pageSize;
			},
			nowPageChange(nowPage) {
				this.customerAssetSelect.nowPage = nowPage;
			}
		}
	}
</script>

<style>
</style>
