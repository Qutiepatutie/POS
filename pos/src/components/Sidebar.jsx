import styles from "../styles/components/sidebar.module.css"

import cashier from "../assets/icons/bill.png"
import inventory  from "../assets/icons/inventory.png"
import logs from "../assets/icons/history.png"
import orders from "../assets/icons/shopping-cart.png"

import { NavLink } from "react-router-dom"

export default function Sidebar() {

    const openOrdersTab = () => {
        window.open("/orders", "_blank");
    }

    return (
        <div className={styles.sidebar}>
            <NavLink
                to={"/"}
                className={styles.button}
            >
                <img 
                    className={styles.icon}
                    src={cashier}
                />
            </NavLink>
            <NavLink
                to={"/inventory"}
                className={styles.button}
            >
                <img 
                    className={styles.icon}
                    src={inventory}
                />
            </NavLink>
            <NavLink
                to={"/saleslog"}
                className={styles.button}
            >
                <img 
                    className={styles.icon}
                    src={logs}
                />
            </NavLink>
            <div 
                className={styles.button}
                onClick={openOrdersTab}
            >
                <img 
                    className={styles.icon}
                    src={orders}
                />
            </div> 
        </div>
    )
}