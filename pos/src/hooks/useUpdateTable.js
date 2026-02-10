import { useState } from "react";

export function useUpdateTable() {

    const [orderList, setOrderList] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [payment, setPayment] = useState("0");
    const [change, setChange] = useState(0);

    function resetItems() {        
        setOrderList([]);
        setTotalPrice(0);
        setPayment("0");
        setChange(0);
    }

    function addItem( setItems, item) {
        setItems(prevItems => {
            const isExisting = prevItems.find(i => i.name === item.name);
    
            if(isExisting) {
                return prevItems.map(i => 
                    i.name === item.name
                        ? {...i, qty: i.qty + 1}
                        : i
                );
            }
            return [...prevItems, {...item, qty: 1}];
        });
    }
    
    function reduceItem (setItems, item) {
        setItems((prev) => 
            prev.map((i) =>
                i.name === item.name
                ? {...i, qty: i.qty - 1}
                : i
            ).filter((i) => i.qty > 0)
        );
    }
    
    function addPayment(
        setPayment, 
        button, 
        page, 
        openDialog, 
        itemList
    ) {
        setPayment(prevPayment => {
            const value = prevPayment || "0";

            if(button === "Cancel Order") {
                resetItems();
                return 0;
            }
    
            if(button === "Clear Payment") return 0;
    
            if(button === "←"){
                return value.length === 1 
                    ? "0" 
                    : value.slice(0 ,-1)
            }
    
            if(button === "↲"){
                if(page !== "main") return value;
                
                if(value === "0" || itemList.length === 0) 
                    return value;
                
                openDialog();
                return value;
            }
    
            if(["00", "0"].includes(button) && value === "0") {
                return value;
            }
            
            return value === "0" ? button : value + button;
        });
    }

    return {orderList, totalPrice, payment, change, setChange, setOrderList, setTotalPrice, setPayment, addItem, reduceItem, addPayment, resetItems}

}    
