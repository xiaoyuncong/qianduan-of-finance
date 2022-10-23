import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
	// {
	// 	path:"/",
	// 	name:"Login",
	// 	component:()=>import('../views/Login2.vue')
	// }
	{
		path: "/",
		name: "Login",
		component: () => import('../views/Login.vue')
	},
	{
		path: "/main",
		name: "Main",
		component: () => import('../views/Main.vue'),
		children: [{
				path: "/base/admin",
				name: "Admin",
				component: () => import('../views/system/Admin.vue')
			}, {
				path: "/base/role",
				name: "Role",
				component: () => import('../views/system/Role.vue')
			}, {
				path: "/base/menu",
				name: "Menu",
				component: () => import('../views/system/Menu.vue')
			},
			{
				path: "/unicorn/assets",
				name: "Assets",
				component: () => import('../views/unicorn/Assets.vue')
			}, {
				path: "/unicorn/business",
				name: "Business",
				component: () => import('../views/unicorn/Business.vue')
			}, {
				path: "/unicorn/recharge",
				name: "Recharge",
				component: () => import('../views/unicorn/Recharge.vue')
			},
			{
				path: "/product/series",
				name: "Series",
				component: () => import('../views/product/Series.vue')
			}, {
				path: "/product/basics",
				name: "Basics",
				component: () => import('../views/product/Basics.vue')
			}, {
				path: "/product/examine",
				name: "Examine",
				component: () => import('../views/product/Examine.vue')
			}, {
				path: "/product/recommend",
				name: "Recommend",
				component: () => import('../views/product/Recommend.vue')
			}

		]
	}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router
