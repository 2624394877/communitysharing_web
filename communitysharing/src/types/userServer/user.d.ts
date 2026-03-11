interface userParams {
    success: boolean,
    errorCode?:string,
    message?: string
}

type followORUnfollow = (followingUserId: string) => Promise<userParams>;