<?php

header("Content-Type: application/json");

require_once "db.php";


// =====================================================
// GET ORDER DATA
// =====================================================

$input = json_decode(
    file_get_contents("php://input"),
    true
);


if (!$input) {

    http_response_code(400);

    echo json_encode([
        "status" => false,
        "message" => "Invalid order data."
    ]);

    exit;
}


// =====================================================
// BASIC DATA
// =====================================================

$orderNumber =
    trim($input["orderNumber"] ?? "");

$paymentReference =
    trim($input["paymentReference"] ?? "");

$paymentStatus =
    trim($input["paymentStatus"] ?? "");

$customer =
    $input["customer"] ?? [];

$items =
    $input["items"] ?? [];

$subtotal =
    (float) ($input["subtotal"] ?? 0);

$discount =
    (float) ($input["discount"] ?? 0);

$shipping =
    (float) ($input["shipping"] ?? 0);

$total =
    (float) ($input["total"] ?? 0);


// =====================================================
// VALIDATION
// =====================================================

if (
    empty($orderNumber) ||
    empty($paymentReference) ||
    empty($customer) ||
    empty($items)
) {

    http_response_code(400);

    echo json_encode([
        "status" => false,
        "message" => "Required order information is missing."
    ]);

    exit;
}


// =====================================================
// CUSTOMER DATA
// =====================================================

$firstName =
    trim($customer["firstName"] ?? "");

$lastName =
    trim($customer["lastName"] ?? "");

$email =
    trim($customer["email"] ?? "");

$phone =
    trim($customer["phone"] ?? "");

$address =
    trim($customer["address"] ?? "");

$city =
    trim($customer["city"] ?? "");

$state =
    trim($customer["state"] ?? "");


if (
    empty($firstName) ||
    empty($lastName) ||
    empty($email) ||
    empty($phone) ||
    empty($address) ||
    empty($city) ||
    empty($state)
) {

    http_response_code(400);

    echo json_encode([
        "status" => false,
        "message" => "Customer information is incomplete."
    ]);

    exit;
}


// =====================================================
// PREVENT DUPLICATE ORDER
// =====================================================

$check =
    $conn->prepare(
        "SELECT id, order_number
         FROM orders
         WHERE payment_reference = ?
         LIMIT 1"
    );

$check->bind_param(
    "s",
    $paymentReference
);

$check->execute();

$existing =
    $check->get_result()->fetch_assoc();

$check->close();


if ($existing) {

    echo json_encode([

        "status" => true,

        "message" =>
            "Order already exists.",

        "order_number" =>
            $existing["order_number"]

    ]);

    exit;
}


// =====================================================
// START DATABASE TRANSACTION
// =====================================================

$conn->begin_transaction();


try {


    // =================================================
    // SAVE ORDER
    // =================================================

    $stmt =
        $conn->prepare(
            "INSERT INTO orders (
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
                currency
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );


    $currency = "NGN";


    $stmt->bind_param(
        "ssssssssssdddds",

        $orderNumber,

        $paymentReference,

        $paymentStatus,

        $firstName,

        $lastName,

        $email,

        $phone,

        $address,

        $city,

        $state,

        $subtotal,

        $discount,

        $shipping,

        $total,

        $currency
    );


    if (!$stmt->execute()) {

        throw new Exception(
            "Failed to save order."
        );

    }


    $orderId =
        $conn->insert_id;


    $stmt->close();


    // =================================================
    // SAVE ORDER ITEMS
    // =================================================

    $itemStmt =
        $conn->prepare(
            "INSERT INTO order_items (
                order_id,
                product_name,
                product_brand,
                product_image,
                price,
                quantity
            )
            VALUES (?, ?, ?, ?, ?, ?)"
        );


    foreach ($items as $item) {

        $productName =
            trim($item["name"] ?? "");

        $productBrand =
            trim($item["brand"] ?? "");

        $productImage =
            trim($item["image"] ?? "");

        $price =
            (float) ($item["price"] ?? 0);

        $quantity =
            (int) ($item["quantity"] ?? 1);


        if (
            empty($productName) ||
            $quantity < 1
        ) {

            throw new Exception(
                "Invalid product information."
            );

        }


        $itemStmt->bind_param(

            "isssdi",

            $orderId,

            $productName,

            $productBrand,

            $productImage,

            $price,

            $quantity

        );


        if (!$itemStmt->execute()) {

            throw new Exception(
                "Failed to save order item."
            );

        }

    }


    $itemStmt->close();


    // =================================================
    // COMMIT
    // =================================================

    $conn->commit();


    echo json_encode([

        "status" => true,

        "message" =>
            "Order saved successfully.",

        "order_number" =>
            $orderNumber,

        "order_id" =>
            $orderId

    ]);

} catch (Exception $e) {


    // =================================================
    // ROLLBACK
    // =================================================

    $conn->rollback();


    http_response_code(500);


    echo json_encode([

        "status" => false,

        "message" =>
            $e->getMessage()

    ]);

}


$conn->close();

?>