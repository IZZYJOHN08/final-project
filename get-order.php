<?php

header("Content-Type: application/json");

require_once "db.php";


// =====================================================
// GET ORDER NUMBER
// =====================================================

$orderNumber = trim(
    $_GET["order_number"] ?? ""
);


if (empty($orderNumber)) {

    http_response_code(400);

    echo json_encode([
        "status" => false,
        "message" => "Order number is missing."
    ]);

    exit;
}


// =====================================================
// FIND ORDER
// =====================================================

$stmt = $conn->prepare(
    "SELECT
        id,
        order_number,
        payment_reference,
        payment_status,
        customer_first_name,
        customer_last_name,
        customer_email,
        customer_phone,
        delivery_address,
        delivery_city,
        delivery_state,
        subtotal,
        discount,
        shipping,
        total,
        currency,
        created_at
     FROM orders
     WHERE order_number = ?
     LIMIT 1"
);


$stmt->bind_param(
    "s",
    $orderNumber
);


$stmt->execute();


$result =
    $stmt->get_result();


$order =
    $result->fetch_assoc();


$stmt->close();


if (!$order) {

    http_response_code(404);

    echo json_encode([
        "status" => false,
        "message" => "Order not found."
    ]);

    exit;
}


// =====================================================
// GET ORDER ITEMS
// =====================================================

$itemStmt = $conn->prepare(
    "SELECT
        product_name,
        product_brand,
        product_image,
        price,
        quantity
     FROM order_items
     WHERE order_id = ?
     ORDER BY id ASC"
);


$itemStmt->bind_param(
    "i",
    $order["id"]
);


$itemStmt->execute();


$itemResult =
    $itemStmt->get_result();


$items = [];


while (
    $item =
    $itemResult->fetch_assoc()
) {

    $items[] = $item;

}


$itemStmt->close();


// =====================================================
// REMOVE INTERNAL DATABASE ID
// =====================================================

unset($order["id"]);


// =====================================================
// RETURN COMPLETE ORDER
// =====================================================

echo json_encode([

    "status" => true,

    "order" => $order,

    "items" => $items

]);


$conn->close();

?>