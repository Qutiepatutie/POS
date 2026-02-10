import styles from "../styles/components/orderstable.module.css"

export default function OrdersTable({ items, totalPrice, payment, change, reduceQty, page}) {
    return (
        <div className={`${styles.table} ${styles[page]}`}>
            <div className={styles.itemsTableContainer}>
                <table className={styles.itemsTable}>
                    <colgroup>
                        <col />
                        <col />
                        <col />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>Item/s</th>
                            <th>Qty</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    {page === "main" &&
                                        <div 
                                            className={styles.reduce}
                                            onClick={() => reduceQty(item)}    
                                        />
                                    }
                                    {item.name}
                                </td>
                                <td>{item.qty}</td>
                                <td><p><span className={styles.unit}>P</span>{item.price * item.qty}</p></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className={styles.paymentTableContainer}>
                <table className={styles.paymentTable}>
                    <tbody>
                        <tr>
                            <td>Total: </td>
                            <td><p><span className={styles.unit}>P</span>{totalPrice}</p></td>
                        </tr>
                        <tr>
                            <td>Payment: </td>
                            <td><p><span className={styles.unit}>P</span>{payment || "0"}</p></td>
                        </tr>
                        <tr>
                            <td>Change:</td>
                            <td><p><span className={styles.unit}>P</span>{change}</p></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}