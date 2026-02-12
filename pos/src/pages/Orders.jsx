import styles from "../styles/orders.module.css"
import placeholder from "../assets/placeholder.jpg"

import { useState, useEffect, useRef } from "react"

import OrdersTable from "../components/OrdersTable.jsx"

import { useUpdateTable } from "../hooks/useUpdateTable.js"

export default function Orders() {
    const [items, setItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [payment, setPayment] = useState("0");
    const [change, setChange] = useState(0); 

    const channelRef = useRef(null);

    const {
        addItem,
        reduceItem,
        addPayment
    } = useUpdateTable();

    useEffect(() => {
        setChange(payment - totalPrice);
    }, [payment, totalPrice]);

    useEffect(() => {
        channelRef.current = new BroadcastChannel("orders_channel");
        
        channelRef.current.onmessage = (event) => {
            const data = event.data;

            if(data.type === "ADD_ITEM") {
                const item = data.itemPayload
                
                addItem(setItems,item);

                setTotalPrice(prevTotal => prevTotal + item.price);
                
            } else if (data.type === "REDUCE_ITEM"){
                const item = data.item
                
                reduceItem(setItems, item);

                setTotalPrice(prevTotal => prevTotal - item.price);
            
            }else if (data.type === "SET_PAYMENT") {
                
                const button = data.button;

                if(button === "Cancel Order") {
                    setItems([]);
                    setTotalPrice(0);
                    setPayment(0);
                    return;
                }

                console.log(button);
                addPayment(setPayment, button);
            
                console.log(payment);
            }
        };

        return () => channelRef.current.close();
    }, []);
    
    return(
        <>
            <div className={styles.container}>
                <div className={styles.items}>
                    {items.map((item, index) => {
                        const itemImg = `${item.name.replaceAll(" ", "_").toLowerCase()}.png`;

                        return (
                            <div
                                key={index}
                                className={styles.itemsPanel}
                            >
                                <div className={styles.itemImgContainer}>
                                    <img
                                        className={styles.itemImg}
                                        src={itemImg}
                                        onError={(e) => {
                                            e.currentTarget.src = placeholder;
                                        }}
                                    />
                                </div>
                                <div className={styles.info}>
                                    <p>{item.name}</p>
                                    <p>X{item.qty}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className={styles.receipt}>
                    <OrdersTable 
                        items={items}
                        totalPrice={totalPrice}
                        payment={payment}
                        change={change}
                        page={"orders"}
                    />
                </div>
            </div>
        </>
    )
}