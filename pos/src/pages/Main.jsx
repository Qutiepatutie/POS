import styles from "../styles/main.module.css"
import placeholder from "../assets/placeholder.jpg"

import { useState, useEffect, useRef } from "react";

import OrdersTable from "../components/OrdersTable";
import ConfirmDialog from "../components/ConfirmDialog";

import { useUpdateTable }  from "../hooks/useUpdateTable";
import { useInventory } from "../hooks/useInventory";
import { useLog } from "../hooks/useLog";

const calcButtons = [
    "7","8","9",
    "4","5","6",
    "1","2","3",
    "00","0", "←",
    "Clear Payment", "↲", "Cancel Order"
];

export default function Main() {

    const channelRef = useRef(null);
    const confirmRef = useRef(null);

    const [cashierName,setCashierName] = useState("");

    const {
        records,
        addLog,
    } = useLog();

    useEffect(() => {
        console.log(records);
    }, [records]);

    const {
        items,
        setItems,
    } = useInventory();

    const {
        orderList,
        totalPrice,
        payment,
        change,
        setChange,
        setOrderList,
        setTotalPrice,
        setPayment,
        addItem,
        reduceItem,
        addPayment,
        resetItems,
    } = useUpdateTable();

    useEffect(() => {
        setChange(Number(payment) - Number(totalPrice));
    }, [payment, totalPrice]);

    useEffect(() => {
        channelRef.current = new BroadcastChannel("orders_channel");

        return () => channelRef.current.close();
    }, []);

    const openConfirmDialog = () => {
        confirmRef.current?.showModal();
    }

    const closeConfirmDialog = () => {
        confirmRef.current?.close();
    }

    const addOrder = (item) => {

        if(item.qty === 0) return;

        setItems(prevItems => {
            const updatedQty = prevItems.map(currItem => 
                currItem.name === item.name
                    ? {
                        ...currItem,
                        qty: Math.max(Number(currItem.qty) - 1, 0)
                    }
                    : currItem
            );

            localStorage.setItem("items", JSON.stringify(updatedQty)); 
            return updatedQty;
        })

        const itemPayload = {name: item.name, type: item.type, price: item.price, qty:1};

        channelRef.current.postMessage({type: "ADD_ITEM", itemPayload});

        addItem(setOrderList, itemPayload);
        setTotalPrice(prevTotal => Number(prevTotal) + Number(itemPayload.price));
    }

    const reduceQty = (item) => {
        channelRef.current.postMessage({type: "REDUCE_ITEM", item});

        setItems(prevItems => {
            const updatedQty = prevItems.map(currItem => 
                currItem.name === item.name
                    ? { ...currItem, qty: currItem.qty +1 }
                    : currItem
            );

            localStorage.setItem("items", JSON.stringify(updatedQty));
            return updatedQty;
        });

        reduceItem(setOrderList, item);
        setTotalPrice(prevTotal => Number(prevTotal) - Number(item.price));
    }

    const useCalcButton = (button) => {

        if(button === "Cancel Order") {
            setItems(prevItems => {
                const updatedQty = prevItems.map(currItem => {
                    const orderedItem = orderList.find(order => order.name === currItem.name);
                    if(orderedItem) {
                        return {...currItem, qty: currItem.qty + orderedItem.qty};
                    }
                    return currItem;
                });

                localStorage.setItem("items", JSON.stringify(updatedQty));
                return updatedQty;
            });
        }

        channelRef.current.postMessage({type: "SET_PAYMENT", button});
        
        addPayment(
            setPayment,
            button,
            "main",
            openConfirmDialog,
            orderList
        );
    }

    const confirmOrder = () => {
        addLog(orderList, cashierName);
        channelRef.current.postMessage({type: "CONFIRM"});
    }

    return (
        <>
            <ConfirmDialog 
                ref={confirmRef}
                cashierName={cashierName}
                setCashierName={setCashierName}
                closeConfirmDialog={closeConfirmDialog}
                resetItems={resetItems}
                confirmOrder={confirmOrder}
            />
            <div className={styles.pos}>
                <div className={styles.itemsContainer}>
                    {items.map((item,index) => {
                        const itemImg = `${item.name.replaceAll(" ", "_").toLowerCase()}.png`;

                        console.log(itemImg);

                        return (
                            <div key={index}
                                className={styles.itemsPanel}
                                onClick={() => addOrder(item)}    
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
                                    <p>Quantity: {item.qty}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className={styles.calculatorContainer}>
                    <OrdersTable 
                        items={orderList}
                        totalPrice={totalPrice}
                        payment={payment}
                        change={change}
                        reduceQty={reduceQty}
                        page={"main"}
                    />
                    <div className={styles.calculator}>
                        {calcButtons.map((value, index) => (
                            <button
                                className={styles.calcButton}
                                key={index}
                                value={value}
                                onClick={() => useCalcButton(value)}
                            >
                                {value}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}