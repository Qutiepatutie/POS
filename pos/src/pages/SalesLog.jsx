import styles from "../styles/saleslog.module.css"

import { useLog } from "../hooks/useLog"
import { useInventory } from "../hooks/useInventory"
import exportIcon from "../assets/icons/export.png"

export default function SalesLog() {
    const {
        records,
        setRecords,
    } = useLog();

    const {
        handleFileExport
    } = useInventory(setRecords);

    return (
        <div className={styles.container}>
            <div className={styles.header}>

            </div>
            <div className={styles.tableContainer}>
                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Type</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Cashier</th>
                            <th>Date & Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((item,index) => (
                            <tr key={index}>
                                <td>{item.name}</td>
                                <td>{item.type}</td>
                                <td>{item.qty}</td>
                                <td>{item.price}</td>
                                <td>{item.cashier}</td>
                                <td>{item.dateAndTime}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div
                className={styles.exportBtn}
                onClick={() => handleFileExport(records, "Sales_Log", "logs")}
            >
                <img 
                    className={styles.btnIcon}
                    src={exportIcon}
                />
                Export
            </div>
        </div>
    )
}