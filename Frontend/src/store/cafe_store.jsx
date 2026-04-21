import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { login, register, logout } from '../server/auth.api'
import { getMenuByCategory, userToday, featured } from '../server/admin.api'
import { getMenu, listMenu, removeMenu, searchMenu } from '../server/menu.api'
import { category, crateCategory, updateCategory, removeCategory } from '../server/category.api'
import { listUsers, updateRoleUsers, removeUsers } from '../server/users.api'
import { listRecommended, removeRecommended } from '../server/Recommended.api'

const cafeStore = (set, get) => ({
    user: null,
    menuByCategory: [],
    categories: [],
    users: [],
    userTotal: 0,
    userSkip: 0,
    userLimit: 20,
    userHasMore: true,
    menus: [],
    menuTotal: 0,
    menuSkip: 0,
    menuLimit: 20,
    recommended: [],
    token: null,

    actionLogin: async (formData) => {
        const res = await login(formData)
        set({
            user: res.data.user,
            token: res.data.access_token 
        })
        localStorage.setItem('token', res.data.access_token)
        return res
    },
    actionRegister: async (formData) => {
        const res = await register(formData)
        return res
    },
    actionLogout: async () => {
        await logout()
        set({ user: null, token: null })
        localStorage.removeItem('token')
    },
    fetchMenuByCategory: async () => {
        const res = await getMenuByCategory()
        set({ menuByCategory: res.data })
    },
    fetchUsersToday: async () => {
        const res = await userToday()
        return res.data
    },

    fetchCategories: async () => {
        const res = await category()
        set({ categories: res.data })
    },

    fetchFeatured: async () => {
        const res = await featured()
        return res.data.count
    },
    fetchMenu: async () => {
        const res = await getMenu()
        return res.data.total
    },
    createCategory: async (formData) => {
        const res = await crateCategory(formData)
        return res
    },
    updateCategory: async (id, formData) => {
        const res = await updateCategory(id, formData)

        set((state) => ({
            categories: state.categories.map((item) =>
                item.id === id ? res.data : item
            )
        }))
        return res
    },
    deleteCategory: async (id) => {
        const res = await removeCategory(id)

        set((state) => ({
            categories: state.categories.filter(
                (item) => item.id !== id
            )
        }))
        return res
    },
    listUsers: async (skip = 0, limit = 20) => {
        const res = await listUsers(skip, limit)

        set({
            users: res.data.users,
            userTotal: res.data.total,
            userSkip: skip,
            userLimit: limit
        })
    },
    nextPage: async () => {
        const { userSkip, userLimit, userTotal } = get()

        const newSkip = userSkip + userLimit

        if (newSkip >= userTotal) return

        await get().listUsers(newSkip, userLimit)
    },

    prevPage: async () => {
        const { userSkip, userLimit } = get()

        const newSkip = Math.max(0, userSkip - userLimit)

        await get().listUsers(newSkip, userLimit)
    },
    updateRoleUsers: async (id, role) => {
        const res = await updateRoleUsers(id, role)

        set((state) => ({
            users: state.users.map((u) =>
                u.id === id ? res.data : u
            )
        }))
    },
    deleteUser: async (id) => {
        const res = await removeUsers(id)

        set((state) => ({
            users: state.users.filter(
                (user) => user.id !== id
            )
        }))

        return res
    },
    listMenu: async (skip = 0, limit = 20, search = '') => {
        const res = search
            ? await searchMenu(search, skip, limit)
            : await listMenu(skip, limit)

        set({
            menus: res.data.menus,
            menuTotal: res.data.total,
            menuSkip: res.data.skip ?? skip,
            menuLimit: res.data.limit ?? limit
        })
    },
    deleteMenu: async (id) => {
        const res = await removeMenu(id)

        set((state) => ({
            menus: state.menus.filter(
                (item) => item.id !== id
            )
        }))

        return res
    },
    getRecommended: async () => {
        const res = await listRecommended()

        set({
            recommended: res.data
        })
    },
    deleteRecommended: async (id) => {
        const res = await removeRecommended(id)

        set((state) => ({
            recommended: state.recommended.filter(
                (item) => item.id !== id
            )
        }))

        return res
    }
})

const useCafeStore = create(persist(cafeStore, {
    name: 'cafe-storage',
    storage: createJSONStorage(() => localStorage)
}))

export default useCafeStore