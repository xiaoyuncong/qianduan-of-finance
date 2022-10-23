<template>
	<div id="business">
		<h4> 独角兽管理 > 企业信息管理</h4>

		<el-row :gutter="20">
			<el-form ref="form" :model="businessSelect" label-width="80px">
				<el-col :span="4">
					<el-form-item label="企业名">
						<el-input v-model="businessSelect.business"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-button type="primary" plain @click="queryCustomerAsset()">查询</el-button>
					<el-button type="primary" plain @click="initSave()">新增</el-button>
				</el-col>
			</el-form>
		</el-row>

		<el-table :data="customerAssetsList" style="width: 85%">
			<el-table-column align="center" type="selection" width="60">
			</el-table-column>
			<el-table-column prop="businessname" label="企业名称" width="150"></el-table-column>
			<el-table-column prop="transactioncode" label="交易代码" width="150">
			</el-table-column>
			<el-table-column prop="businessorder" label="顺序" width="150"></el-table-column>
			<el-table-column prop="businessPrice" label="最新挂牌价" width="150"></el-table-column>
			<el-table-column label="操作" width="280">
				<template slot-scope="scope">
					<el-button @click="handleClick(scope.row)" type="text" size="small">详情</el-button>
					<el-button type="text" size="small">修改</el-button>
					<el-button type="text" size="small">删除</el-button>
					<el-button type="text" size="small" @click="initSaveOrderPrice(scope.row)">编辑挂单</el-button>
					<el-button type="text" size="small" @click="initHistoricalFinancing(scope.row)">历史融资</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-pagination @size-change="pageSizeChange" @current-change="nowPageChange" :small="true"
			:current-page="pageInfo.nowPage" :page-size="pageInfo.pageSize" :page-sizes="[3,6,9,12]"
			layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total">
		</el-pagination>

		<!-- 历史融资 -->
		<el-dialog title="挂单价" :visible.sync="historicalFinancingFlag" width="850px">
			<el-table :data="historicalFinancingList">
				<el-table-column prop="businessName" label="企业名称" width="120"></el-table-column>
				<el-table-column prop="investdate" label="投资日期" width="100"></el-table-column>
				<el-table-column prop="investround" label="投资轮" width="100">
					<template slot-scope="scope">
						{{scope.row.investround==0?"天使轮":""}}
						{{scope.row.investround==1?"A轮":""}}
						{{scope.row.investround==2?"B轮":""}}
						{{scope.row.investround==3?"C轮":""}}
						{{scope.row.investround==4?"D轮":""}}
					</template>
				</el-table-column>
				<el-table-column prop="investmoney" label="投资资金(百万)" width="120"></el-table-column>
				<el-table-column prop="investvaluation" label="投后估值(百万)" width="120"></el-table-column>
				<el-table-column prop="issuenumber" label="总发行股数(百万)" width="130"></el-table-column>
				<el-table-column prop="persharemoney" label="每股单价" width="120"></el-table-column>
			</el-table>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="historicalFinancingFlag=false">取消</el-button>
			</div>
		</el-dialog>
		<!-- 挂单价 -->
		<!-- 通过企业查询企业的挂单价，安装降序进行排序 -->
		<el-dialog title="挂单价" :visible.sync="OrderPriceFlag" width="30%">
			<el-form label-width="80px" :rules="rules" ref="orderPrice">
				<el-row :gutter="20">
					<el-col :span="12">
						{{orderBusinessName}}
						<br>
						<br>
					</el-col>
				</el-row>
				<el-row v-for="(orderIn,index) in orderInPriceList" :key="orderIn.orderPrice">
					<el-col :span="12">
						<el-form-item :label="getLabelIn(index)">
							<el-input size="small" v-model="orderIn.orderPrice" auto-complete="off" placeholder="买一价">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="买入几手">
							<el-input size="small" v-model="orderIn.orderNum" auto-complete="off" placeholder="买入几手">
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<hr><br>
				<el-row v-for="(orderOut,index) in orderOutPriceList" :key="orderOut.orderPrice">
					<el-col :span="12">
						<el-form-item :label="getLabelOut(index)">
							<el-input size="small" v-model="orderOut.orderPrice" auto-complete="off" placeholder="买一价">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="买入几手">
							<el-input size="small" v-model="orderOut.orderNum" auto-complete="off" placeholder="买入几手">
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="OrderPriceFlag=false">取消</el-button>
				<el-button size="small" type="primary" class="title" @click="submitForm('orderPrice')">保存
				</el-button>
			</div>
		</el-dialog>

		<el-dialog title="编辑企业信息" :visible.sync="editFlag" width="50%">
			<el-form label-width="100px" :model='business'>
				<el-row>
					<el-col :span="12">
						<el-form-item label="企业名称">
							<el-input v-model="business.businessname"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="交易代码">
							<el-input v-model="business.transactioncode"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="企业logo">
							<el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" multiple
								:limit="3">
								<el-button size="small" type="primary">点击上传</el-button>
								<!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
							</el-upload>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="app端logo">
							<el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" multiple
								:limit="3">
								<el-button size="small" type="primary">点击上传</el-button>
								<!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
							</el-upload>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="所属行业">
							<el-select v-model="business.trade">
								<el-option value="软件开发" label="软件开发"></el-option>
								<el-option value="医疗器械" label="医疗器械"></el-option>
								<el-option value="有色金属" label="有色金属"></el-option>
								<el-option value="工程建设" label="工程建设"></el-option>
								<el-option value="专用设备" label="专用设备"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="成立年份">
							<el-date-picker v-model="business.foundyear" type="date" placeholder="选择日期">
							</el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="CEO">
							<el-input v-model="business.ceo"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="企业所在地">
							<el-input v-model="business.address"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="费率(%)">
							<el-input v-model="business.rate"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="企业顺序">
							<el-input-number v-model="business.businessorder"></el-input-number>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="24">
						<el-form-item label="介绍">
							<el-input type="textarea" v-model="business.businessintroduce"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="editFlag=false">取消</el-button>
				<el-button size="small" type="primary" class="title" @click="submitForm('orderPrice')">保存
				</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: "business",
		data() {
			return {
				customerAssetsList: [{
					"address": "广州市黄埔区科学大道182号C1栋401房",
					"applogo": "wdxx_app.jpg",
					"bid": 1,
					"businessPrice": 35.5,
					"businessintroduce": "广东纬德信息科技股份有限公司主要从事智能安全设备和信息安全云平台的研发、生产和销售。\r\n公司根据多年经营管理经验及科学管理方式,结合产品及服务特点、所处行业特点、\r\n上下游行业的发展情况以及自身所处的发展阶段等因素,经综合考量和实践后形成了现有经营模式",
					"businesslogo": "wdxx.jpg",
					"businessname": "纬德信息",
					"businessorder": 1,
					"ceo": "尹健",
					"foundyear": "2012-04-24",
					"rate": "0.05%",
					"state": 1,
					"trade": "软件开发",
					"transactioncode": "688171"
				}, {
					"address": "杭州市西湖区杨公堤32号",
					"applogo": "hzyl_app.jpg",
					"bid": 2,
					"businessPrice": 27.5,
					"businessintroduce": "杭州园林设计院股份有限公司始创于1952年,公司前身为杭州园林设计院,2002年完成了改制任务,并于2011年改制为民营股份制企业。",
					"businesslogo": "hzyl.jpg",
					"businessname": "杭州园林",
					"businessorder": 2,
					"ceo": "吕明华",
					"foundyear": "2001-11-13",
					"rate": "0.05%",
					"state": 1,
					"trade": "软件开发",
					"transactioncode": "300649"
				}, {
					"address": "上海市闵行区光中路133弄66号",
					"applogo": "ahnj_app.jpg",
					"bid": 3,
					"businessPrice": 52.5,
					"businessintroduce": "上海澳华内镜股份有限公司是一家主要从事电子内窥镜设备及内窥镜诊疗手术耗材研发、生产和销售的高新技术企业。\r\n公司以“成为国际领先的内镜整体解决方案提供商”为愿景,经过20多年的专注与创新,产品已应用于消化科、呼吸科、耳鼻喉科、妇科、急诊科等临床科室",
					"businesslogo": "ahnj.jpg",
					"businessname": "澳华内镜",
					"businessorder": 3,
					"ceo": "顾康",
					"foundyear": "1994-10-27",
					"rate": "0.05%",
					"state": 1,
					"trade": "医疗器械",
					"transactioncode": "688171"
				}, {
					"address": "安徽省芜湖市经济技术开发区珠江路3号",
					"applogo": "xkcl_app.jpg",
					"bid": 4,
					"businessPrice": 6.36,
					"businessintroduce": "安徽鑫科新材料股份有限公司(ANHUI XINKE NEW MATERIALS CO.,LTD.)是国家火炬计划重点高新技术企业,\r\n是安徽省铜合金材料加工工程研究中心的主要发起人和产业依托单位,拥有国家级企业认定技术中心和多家相关产业分子公司、控股公司、参股公司",
					"businesslogo": "xkcl.jpg",
					"businessname": "鑫科材料",
					"businessorder": 4,
					"ceo": "宋志刚",
					"foundyear": "2012-04-24",
					"rate": "0.05%",
					"state": 1,
					"trade": "有色金属",
					"transactioncode": "600255"
				}, {
					"address": "杭州市之江路599号",
					"applogo": "cbgf_app.jpg",
					"bid": 5,
					"businessPrice": 7.36,
					"businessintroduce": "诚邦生态环境股份有限公司(简称:诚邦股份〡603316)成立于1996年,作为生态环境行业区域领军企业,公司以综合设计、\r\n环境建设、生态环保、文化旅游为核心业务,以投资发展为推力,形成了“4+1”的业务发展体系,旗下拥有诚邦设计集团、诚邦环保科技、浙江诚邦绿化工程等子公司,\r\n是集投资、设计、建设、运营于一体的生态环境综合服务运营商。在设计集团板块,主要涵盖文化产业落地、风貌综合更新、旅游景区创建、生态环境修复、\r\n空间价值重构等设计领域;在环境建设板块,主要涵盖园林绿化、公园城市、市政公用、古建筑、水利水电、电力照明等工程领域",
					"businesslogo": "cbgf.jpg",
					"businessname": "诚邦股份",
					"businessorder": 5,
					"ceo": "方利强",
					"foundyear": "1996-04-08",
					"rate": "0.05%",
					"state": 1,
					"trade": "工程建设",
					"transactioncode": "603316"
				}, {
					"address": "济南市天桥区大魏庄东路99号",
					"applogo": "tegf_app.jpg",
					"bid": 6,
					"businessPrice": 25.5,
					"businessintroduce": "山东天鹅棉业机械股份有限公司是山东省供销社控股上市公司,其前身创建于1946年。\r\n集科研开发、精工制造、营销服务于一体,专业提供“机采棉全程机械化、智能化、信息化装备一站式供货及服务”",
					"businesslogo": "tegf.jpg",
					"businessname": "天鹅股份",
					"businessorder": 6,
					"ceo": "王新亭",
					"foundyear": "2002-07-08",
					"rate": "0.05%",
					"state": 1,
					"trade": "专用设备",
					"transactioncode": "603029"
				}], // 用户所有资产
				businessSelect: { // 条件查询提交到服务器的数据
					type: "showBusiness",
					pageSize: 3,
					nowPage: 1,
					businessName: "" // 姓名
				},
				pageInfo: {
					pageSize: 5,
					nowPage: 1,
					total: 15
				},
				choseBusiness: {},
				OrderPriceFlag: false,
				orderBusinessName: "",
				// 买入价格
				orderInPriceList: [{
					orderBusinessId: 0, // 挂单公司
					orderBusinessName: "",
					orderPrice: 20.01,
					orderNum: 11
				}, {
					orderBusinessId: 0, // 挂单公司
					orderBusinessName: "",
					orderPrice: 20.21,
					orderNum: 11
				}, {
					orderBusinessId: 0, // 挂单公司
					orderBusinessName: "",
					orderPrice: 20.31,
					orderNum: 11
				}],
				// 买出价格
				orderOutPriceList: [{
					orderBusinessId: 0, // 挂单公司
					orderBusinessName: "",
					orderPrice: 20.23,
					orderNum: 11
				}, {
					orderBusinessId: 0, // 挂单公司
					orderBusinessName: "",
					orderPrice: 20.34,
					orderNum: 11
				}, {
					orderBusinessId: 0, // 挂单公司
					orderBusinessName: "",
					orderPrice: 20.36,
					orderNum: 11
				}],
				rules: {
					buyOnePrice: [],
					buyOneNumber: []
				},
				historicalFinancingFlag: false,
				historicalFinancingSelect: {
					type: "showHistoricalFinancing",
					businessId: 0
				},
				historicalFinancingList: [{
					"businessName": "澳华内镜",
					"hfbusinessid": 3,
					"hfid": 9,
					"investdate": "1997-02-28",
					"investmoney": 1,
					"investround": 0,
					"investvaluation": 2,
					"issuenumber": 1,
					"persharemoney": 2.0,
					"state": 1
				}, {
					"businessName": "澳华内镜",
					"hfbusinessid": 3,
					"hfid": 10,
					"investdate": "2002-02-02",
					"investmoney": 5,
					"investround": 1,
					"investvaluation": 10,
					"issuenumber": 1,
					"persharemoney": 7.0,
					"state": 1
				}, {
					"businessName": "澳华内镜",
					"hfbusinessid": 3,
					"hfid": 11,
					"investdate": "2004-02-02",
					"investmoney": 10,
					"investround": 2,
					"investvaluation": 345,
					"issuenumber": 23,
					"persharemoney": 15.0,
					"state": 1
				}, {
					"businessName": "澳华内镜",
					"hfbusinessid": 3,
					"hfid": 12,
					"investdate": "2004-12-02",
					"investmoney": 25,
					"investround": 3,
					"investvaluation": 575,
					"issuenumber": 25,
					"persharemoney": 23.0,
					"state": 1
				}, {
					"businessName": "澳华内镜",
					"hfbusinessid": 3,
					"hfid": 13,
					"investdate": "2008-09-09",
					"investmoney": 50,
					"investround": 4,
					"investvaluation": 120,
					"issuenumber": 30,
					"persharemoney": 40.0,
					"state": 1
				}],
				editFlag: false,
				business: {
					businessname: "", //企业名称
					transactioncode: "", // 交易代码
					businesslogo: "", // 企业logo
					applogo: "", // app logo
					trade: "", // 所属行业
					foundyear: "", // 成立年份
					ceo: "",
					address: "", // 企业地址
					rate: "", // 费率
					businessorder: "", // 企业费率
					businessintroduce: ""

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

			},
			initSaveOrderPrice(business) {
				this.OrderPriceFlag = true;
				this.orderBusinessName = business.businessname;
			},
			initHistoricalFinancing(business) {
				console.log(business)
				this.historicalFinancingFlag = true;

			},
			submitForm(formName) {
				this.editFlag = false;
				console.log(formName)
			},
			initSave() {
				this.editFlag = true;
			},
			getLabelOut(index) {
				return "卖" + (index + 1);
			},
			getLabelIn(index) {
				return "买" + (index + 1);
			}

		},
		created() {
			this.queryBusiness();
		}
	};
</script>

<style>
</style>
