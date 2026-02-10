import styles from "../styles/components/confirmdialog.module.css"

export default function ConfirmDialog({ref, cashierName, setCashierName, closeConfirmDialog, resetItems, confirmOrder}) {
    return (
        <dialog ref={ref} className={styles.confirmPopUp}>
            <div className={styles.inputField}>
                <label>Enter Cashier name</label>
                <input 
                    value={cashierName}
                    onChange={(e) => setCashierName(e.target.value)}
                />
            </div>
            <div className={styles.buttons}>
                <button onClick={() => closeConfirmDialog()}>
                    Close
                </button>
                <button onClick={() => {
                        if(!cashierName.trim()) return;
                        confirmOrder();
                        closeConfirmDialog();
                        resetItems();
                        setCashierName("");
                    }}>
                    Confirm
                </button>
            </div>
        </dialog>
    )
}