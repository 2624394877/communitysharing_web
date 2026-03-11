const user = {
    findUserById: "/user/user/findUserById",
    searchUserServer: '/es/search/user',
    follwing: '/users/relation/following',
    unfollowing: '/users/relation/unfollow'
} as const;

export default user;