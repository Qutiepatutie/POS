import { useState, useEffect } from "react";

import * as XLSX from "xlsx"
import { saveAs } from "file-saver";

export function useInventory(setRecords) {
    const [items, setItems] = useState([]);
    const [editDraft, setEditDraft] = useState([]);

    useEffect(() => {
        const storedItems = localStorage.getItem("items");

        if(!storedItems) return;
        try {
            setItems(JSON.parse(storedItems));
        } catch (err){
            console.log("Local Storage Error");
            localStorage.removeItem("items");
        }
    }, []);

    function handleFileImport(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (evt) => {
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: "array" });

            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // Convert to array of arrays
            const rows = XLSX.utils.sheet_to_json(sheet, {
                header: 1,   // raw rows
                defval: ""   // avoid undefined
            });

            // Remove header row
            const [, ...dataRows] = rows;

            // Convert rows to objects (manual mapping)
            const json = dataRows.map(row => ({
                name: row[0].toString().trim() ?? "",
                type: row[1].toString().trim() ?? "",
                qty: Number(row[2]) || 0,
                price: Number(row[3]) || 0
            }))
            .filter(item  =>
                item.name !== "" ||
                item.type !== "" ||
                item.qty !==  0 ||
                item.price !== 0
            );

            localStorage.setItem("items", JSON.stringify(json));
            setItems(json);
        };

        reader.readAsArrayBuffer(file);
    }


    function handleFileExport(data, filename, exportFrom) {
        if (!data || !data.length) return;

        filename = `${filename}.xlsx`;

        let formattedData = []
        let confirmClear = false;

        if(exportFrom === "logs"){
            formattedData = data.map(item => ({
                "Item Name"     : item.name,
                "Item Type"     : item.type,
                "Quantity"      : item.qty,
                "Price"         : item.price,
                "Date and Time" : item.dateAndTime, 
            })); 

            confirmClear = window.confirm(
                "Export starting. Do you want to clear the logs?"
            );
        } else if(exportFrom === "inventory"){
            formattedData = data.map(item => ({
                "Item Name"     : item.name,
                "Item Type"     : item.type,
                "Quantity"      : item.qty,
                "Price"         : item.price,
            })); 
        }

        try {

            // Convert data to worksheet
            const worksheet = XLSX.utils.json_to_sheet(formattedData);
            
            // Create a new workbook and append the worksheet
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            
            // Write the workbook to a buffer
            const excelBuffer = XLSX.write(workbook, {
                bookType: "xlsx",
                type: "array"
            });
            
            // Save the file
            const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
            saveAs(blob, filename);
        
            if(confirmClear) {
                localStorage.removeItem("orderLog");
                setRecords([]);
            }

        } catch (err) {
            console.error("Export failed: ", err);
            alert("Export failed");
        }
    }

    function editInventory(index, name, value) {
        setEditDraft(prev =>
            prev.map((item, i) => 
                i === index
                    ? {...item, [name] : value}
                    : item
            )
        );
    }

    function clearInventory() {
        const confirmClear = window.confirm(
            "Are you sure you want to clear the inventory?"
        );

        if(!confirmClear) return;
        localStorage.removeItem("items");
        setItems([]);
    }

    return { items, editDraft, setItems, setEditDraft, clearInventory, handleFileImport, handleFileExport, editInventory };
}