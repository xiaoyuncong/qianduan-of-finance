<template>
	<div id="app">
		<h4> 独角兽管理 > 充值提现信息</h4>

		<el-row :gutter="20">
			<el-form ref="form" :model="rechargeSelect" label-width="80px">
				<el-col :span="4">
					<el-form-item label="姓名">
						<el-input v-model="rechargeSelect.business"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="4">
					<el-form-item label="电话">
						<el-input v-model="rechargeSelect.iphone"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="4">
					<el-form-item label="交易类型">
						<el-select v-model="rechargeSelect.investMoneyType">
							<el-option :value=1 label="体现"></el-option>
							<el-option :value=0 label="充值"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="4">
					<el-form-item label="交易状态">
						<el-select v-model="rechargeSelect.invertState">
							<el-option :value=0 label="未汇款"></el-option>
							<el-option :value=1 label="已到 PTN 账号"></el-option>
							<el-option :value=2 label="已汇款到用户"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-button type="primary" plain @click="queryCustomerAsset()">查询</el-button>
				</el-col>
			</el-form>
		</el-row>

		<el-table :data="customerAssetsList" style="width: 90%">
			<el-table-column align="center" type="selection" width="60"></el-table-column>
			<el-table-column prop="userCode" label="客户编号" width="120"></el-table-column>
			<el-table-column prop="userName" label="客户名称" width="100">
				<template slot-scope="scope">
					<el-tag type="primary" disable-transitions>
						{{scope.row.userName}}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="investmoneytype" label="交易类型" width="100">
				<template slot-scope="scope">
					{{scope.row.investmoneytype == "1"?"提现":""}}
					{{scope.row.investmoneytype == "0"?"充值":""}}
				</template>
			</el-table-column>
			<el-table-column prop="investmoney" label="金额(万)" width="100"> </el-table-column>
			<el-table-column prop="investhandletime" label="请求时间" width="160"> </el-table-column>
			<el-table-column prop="investrequesttime" label="处理完成时间" width="160"> </el-table-column>
			<el-table-column prop="investbankcode" label="银行交易编号" width="150"> </el-table-column>
			<el-table-column prop="invertstate" label="状态" width="150">
				<template slot-scope="scope">
					{{scope.row.invertstate == "1"?"已到 PTN 账号":""}}
					{{scope.row.invertstate == "0"?"未汇款":""}}
					{{scope.row.invertstate == "2"?"已汇款到用户":""}}
				</template>
			</el-table-column>
		</el-table>

		<el-pagination @size-change="pageSizeChange" @current-change="nowPageChange" :small="true"
			:current-page="pageInfo.nowPage" :page-size="pageInfo.pageSize" :page-sizes="[3,6,9,12]"
			layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total">
		</el-pagination>

	</div>
</template>

<script>
	export default {
		name: "recharge",
		data() {
			return {
				customerAssetsList: [{
					"invertstate": 2,
					"investbankcode": 679134,
					"investhandletime": "2012-02-09 11:34:19",
					"investmoney": 1000.0,
					"investmoneyid": 1,
					"investmoneytype": 0,
					"investrequesttime": "2012-02-02 08:12:19",
					"state": 1,
					"userCode": "43290",
					"userName": "admin",
					"userid": 1
				}, {
					"invertstate": 2,
					"investbankcode": 679134,
					"investhandletime": "2012-05-11 10:01:01",
					"investmoney": 1500.0,
					"investmoneyid": 2,
					"investmoneytype": 1,
					"investrequesttime": "2012-05-06 09:12:14",
					"state": 1,
					"userCode": "43290",
					"userName": "admin",
					"userid": 1
				}, {
					"invertstate": 2,
					"investbankcode": 679134,
					"investhandletime": "2013-01-15 09:34:19",
					"investmoney": 100.0,
					"investmoneyid": 3,
					"investmoneytype": 0,
					"investrequesttime": "2013-01-08 10:03:09",
					"state": 1,
					"userCode": "43290",
					"userName": "admin",
					"userid": 1
				}, {
					"invertstate": 2,
					"investbankcode": 679134,
					"investhandletime": "2013-09-29 15:04:09",
					"investmoney": 10.0,
					"investmoneyid": 4,
					"investmoneytype": 0,
					"investrequesttime": "2013-09-22 14:02:11",
					"state": 1,
					"userCode": "43290",
					"userName": "admin",
					"userid": 1
				}, {
					"invertstate": 2,
					"investbankcode": 679134,
					"investhandletime": "2013-10-19 09:06:03",
					"investmoney": 10.0,
					"investmoneyid": 5,
					"investmoneytype": 1,
					"investrequesttime": "2013-10-12 08:12:19",
					"state": 1,
					"userCode": "43290",
					"userName": "admin",
					"userid": 1
				}], // 用户所有资产
				rechargeSelect: { // 条件查询提交到服务器的数据
					type: "showRecharge",
					pageSize: 3,
					nowPage: 1,
					businessName: "", // 姓名
					investMoneyType: "",
					invertState: ""
				},
				pageInfo: {
					pageSize: 3,
					nowPage: 1,
					total: 15
				}
			}
		},
		methods: {
			pageSizeChange(pageSize) {
				this.businessSelect.pageSize = pageSize;
				this.queryBusiness();
			},
			nowPageChange(nowPage) {
				this.businessSelect.nowPage = nowPage;
				this.queryBusiness();
			},
			queryBusiness() { // 查询所有的用户资产
				// axios.get("http://localhost:8088/recharge.do", {
				//   params: this.rechargeSelect
				// }).then(response => {
				//   console.log(response.data)
				//   this.customerAssetsList = response.data;
				//   this.pageInfo = {
				//     pageSize: 5,
				//     nowPage: 1,
				//     total: 10
				//   }
				// });
			}
		},
		created() {
			this.queryBusiness();
		}

	}
</script>

<style>
</style>
