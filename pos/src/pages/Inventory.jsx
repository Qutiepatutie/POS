import { useState } from "react";

import styles from "../styles/inventory.module.css"
import exportIcon from "../assets/icons/export.png"
import importIcon from "../assets/icons/import.png"
import clear from "../assets/icons/trash.png"
import edit from "../assets/icons/edit.png"

import { useInventory } from "../hooks/useInventory";

export default function Inventory() {
    
    const [isEditing, setIsEditing] = useState(false);
    
    const { 
        items,
        editDraft,
        setItems,
        setEditDraft,
        clearInventory,
        handleFileImport,
        handleFileExport,
        editInventory
    } = useInventory();

    const startEdit = () => {
        setEditDraft(items);
        setIsEditing(true);
    }

    const saveEdit = () => {
        localStorage.setItem("items", JSON.stringify(editDraft));
        setItems(editDraft);
        setIsEditing(false);
    }

    const addRow = () => {
        const newRow = {name: "Item name", type: "Item Type", qty: 1, price: 10};

        setEditDraft(prevItem => [
            ...prevItem,
            newRow,
        ]);
    }

    const removeRow = (index) => {
        setEditDraft(prevItems => prevItems.filter((_, prevIndex) => prevIndex !== index));
    }

    const increase = (index, field) => {
        setEditDraft(prevItems => prevItems.map((item, itemIndex) => 
            itemIndex === index
                ? { ...item, [field]: item[field] + 1}
                : item
        ));
    }

    const decrease = (index,field) => {
        setEditDraft(prevItems => prevItems.map((item, itemIndex) => 
            itemIndex === index
                ? { ...item, [field]: Math.max((item[field] - 1), 0)}
                : item
            )
        );
    }
    return (
        <div className={styles.container}>
            <div className={styles.tableContainer}>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Quantity</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(isEditing ? editDraft : items).map((item,index) => (
                            <tr key={index}>
                                <td>
                                    <div className={styles.editWrapper}>
                                        <div
                                            className={`
                                                ${styles.rmvRow}
                                                ${isEditing ? "" : styles.hidden}
                                                `}
                                            onClick={() => removeRow(index)}
                                        />
                                        <input
                                            type="text"
                                            value={item.name}
                                            onChange={(e) => editInventory(index, "name", e.target.value)}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <input 
                                        type="text"
                                        value={item.type}
                                        onChange={(e) => editInventory(index, "type", e.target.value)}
                                        disabled={!isEditing}
                                    />    
                                </td>
                                <td>
                                    <div className={styles.editWrapper}>
                                        <div
                                            className={`
                                                ${styles.qtyDown}
                                                ${isEditing ? "" : styles.hidden}
                                            `}
                                            onClick={() => decrease(index,"qty")}
                                        />
                                        <input 
                                            type="number" 
                                            value={item.qty}
                                            onChange={(e) => editInventory(index, "qty", e.target.value)}
                                            disabled={!isEditing}
                                            />
                                        <div 
                                            className={`
                                                ${styles.qtyUp}
                                                ${isEditing ? "" : styles.hidden}
                                            `}
                                            onClick={() => increase(index,"qty")}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div className={styles.editWrapper}>
                                        <div
                                            className={`
                                                ${styles.qtyDown}
                                                ${isEditing ? "" : styles.hidden}
                                                `}
                                            onClick={() => decrease(index,"price")}
                                        />
                                        <input 
                                            type="number" 
                                            value={item.price}
                                            onChange={(e) => editInventory(index, "price", e.target.value)}
                                            disabled={!isEditing}
                                            />
                                        <div 
                                            className={`
                                                ${styles.qtyUp}
                                                ${isEditing ? "" : styles.hidden}
                                            `}
                                            onClick={() => increase(index,"price")}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className={styles.buttons}>
                <div className={styles.filesBtns}>
                    <div
                        className={styles.btn}
                        onClick={() => handleFileExport(items, "Inventory", "inventory")}    
                    >
                        <img 
                            className={styles.btnIcon}
                            src={exportIcon}
                        />
                        Export
                    </div>
                    <label className={styles.btn}>
                        <img 
                            className={styles.btnIcon}
                            src={importIcon}
                        />
                        Import
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={handleFileImport}
                            hidden
                        />
                    </label>
                    <div
                        className={styles.btn}
                        onClick={() => clearInventory()}
                    >
                        <img 
                            className={styles.btnIcon}
                            src={clear}
                        />
                        Clear Table
                    </div>        
                </div>
                <div className={styles.tableBtns}>
                    <div 
                        className={`
                            ${isEditing ? styles.btn : styles.hidden}
                        `}
                        onClick={() => setIsEditing(false)}
                    
                    >
                        Cancel
                    </div>
                    <div 
                        className={`
                            ${isEditing ? styles.btn : styles.hidden}
                        `}
                        onClick={addRow}
                    >
                        Add Row
                    </div>
                    <div
                        className={styles.btn}
                        onClick={() =>{
                            if(!isEditing) startEdit();
                            else saveEdit();
                        }}
                    >
                        {!isEditing && <img 
                            className={styles.btnIcon}
                            src={edit}
                        />}
                        {isEditing ? "Save" : "Edit Table"}
                    </div>
                </div>
            </div>
        </div>
    )
}