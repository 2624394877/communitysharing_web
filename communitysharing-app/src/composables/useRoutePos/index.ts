const routerName = ref<string>('首页')

export const RouterName = (name: string) => {
    routerName.value = name
}

export const getRouterName = () => {
    return routerName.value
}