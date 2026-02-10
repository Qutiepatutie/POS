import { useState, useEffect } from "react";

export function useLog() {

    const [records, setRecords] = useState([]);

    useEffect(() => {
        const storedRecord = localStorage.getItem("orderLog");

        if(!storedRecord) return;
        try {
            setRecords(JSON.parse(storedRecord));
        } catch (err){
            console.log("Local Storage Error");
            localStorage.removeItem("orderLog");
        }
    }, []);

    function addLog(order, cashierName) {

        const now = new Date();
        const formattedDate = now.toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
        });

        const record = order.map(item => ({
            ...item,
            price: item.price * item.qty,
            cashier: cashierName,
            dateAndTime : formattedDate
        }));

        const existingLogs = JSON.parse(localStorage.getItem("orderLog")) || [];

        const updatedLogs = [...existingLogs, ...record];

        localStorage.setItem("orderLog", JSON.stringify(updatedLogs));
        setRecords(prevRecords => [...prevRecords, record]);
    }

    return {records, setRecords, addLog};
}