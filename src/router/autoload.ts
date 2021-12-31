import { RouteRecordRaw } from 'vue-router'
import { env } from '@/utils/helper'
const layouts = import.meta.globEager('../layouts/*.vue')
const views = import.meta.globEager('../views/**/*.vue')

function getRoutes() {
	const layoutRoutes = [] as RouteRecordRaw[]
	Object.entries(layouts).forEach(([file, module]) => {
		const route = getRouteByModule(file, module)
		route.children = getChildrenRoutes(route)
		layoutRoutes.push(route)
	})
	return layoutRoutes
}

// 添加布局页面子路由
function getChildrenRoutes(layoutRoute: RouteRecordRaw) {
	const routes = [] as RouteRecordRaw[]
	Object.entries(views).forEach(([file, module]) => {
		if (file.includes(`../views/${layoutRoute.name as string}`)) {
			const route = getRouteByModule(file, module)
			routes.push(route)
		}
	})
	return routes
}

// 获取路由
function getRouteByModule(file: string, module: { [key: string]: any }) {
	const name = file.replace(/\.\.\/(layouts|views)\/|.vue/gi, '')
	const route = {
		name: name.replace(/\//, '.'),
		path: `/${name}`,
		component: module.default,
	} as RouteRecordRaw

	return Object.assign(route, module.default?.route)
}

console.log()
const routes = env.VITE_ROUTER_AUTOLOAD ? getRoutes() : ([] as RouteRecordRaw[])
export default routes
