import React, { useEffect } from 'react'
import "../styles/Users.css"
import useCafeStore from '../store/cafe_store'
import { RiDeleteBin5Fill } from "react-icons/ri"

const UserAdmin = () => {
    const {
        users,
        listUsers,
        nextPage,
        prevPage,
        userSkip,
        userLimit,
        userTotal,
        updateRoleUsers,
        deleteUser
    } = useCafeStore()

    useEffect(() => {
        listUsers(0, 20)
    }, [])

    return (
        <section className='header-user'>
            <div className="main-title_user">
                <h2 className="tile_user">User Manager</h2>
            </div>
            <table className="main-table-user">
                <thead className='head-user'>
                    <tr className='list-user'>
                        <th className='title-user'>No.</th>
                        <th className='title-user'>Name</th>
                        <th className='title-user'>emali</th>
                        <th className='title-user'>role</th>
                        <th className='title-user'>remove</th>
                    </tr>
                </thead>

                <tbody className='body-user'>
                    {users.map((u, i) => (
                        <tr key={u.id} className='list-user'>
                            <td className='p-user'>{i + 1 + userSkip}</td>
                            <td className='p-user'>{u.username}</td>
                            <td className='p-user'>{u.email}</td>
                            <td className='p-user'>
                                <select
                                    value={u.role}
                                    onChange={(e) => updateRoleUsers(u.id, e.target.value)}
                                    className='select-role-user'
                                >
                                    <option className='drop-role-user' value="user">user</option>
                                    <option className='drop-role-user' value="admin">admin</option>
                                </select>
                            </td>
                            <td className='p-user'><button onClick={() => {
                                if (window.confirm("คุณแน่ใจว่าจะลบ user นี้?")) {
                                    deleteUser(u.id)
                                }
                            }} className='btn-remove-user'><RiDeleteBin5Fill /></button></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {userTotal > userLimit && (
                <div className='main-prev-next-user'>
                    <button className='btn-prev-user' onClick={prevPage} disabled={userSkip === 0}>
                        Prev
                    </button>

                    <span className='page-user'>
                        Page {userSkip / userLimit + 1}
                    </span>

                    <button className='btn-next-user'
                        onClick={nextPage}
                        disabled={userSkip + userLimit >= userTotal}
                    >
                        Next
                    </button>
                </div>
            )}
        </section>
    )
}

export default UserAdmin