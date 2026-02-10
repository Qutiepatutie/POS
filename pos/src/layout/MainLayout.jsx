import styles from "../styles/mainlayout.module.css"

import { Outlet } from "react-router-dom"

import Sidebar from "../components/Sidebar"


export default function MainLayout() {
    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <Sidebar />
            </div>
            <div className={styles.content}>
                <Outlet />
            </div>
        </div>
    )
}