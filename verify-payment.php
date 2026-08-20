<?php

header("Content-Type: application/json");

// =====================================================
// PAYSTACK TEST SECRET KEY
// =====================================================

$paystackSecretKey = "sk_test_aa1b6a8d9eac4a0bf25b83dd8a4c005b0e3874cb";


// =====================================================
// GET TRANSACTION REFERENCE
// =====================================================

$input = json_decode(
    file_get_contents("php://input"),
    true
);

$reference = $input["reference"] ?? "";


// =====================================================
// CHECK REFERENCE
// =====================================================

if (empty($reference)) {

    http_response_code(400);

    echo json_encode([
        "status" => false,
        "message" => "Transaction reference is missing."
    ]);

    exit;
}


// =====================================================
// VERIFY WITH PAYSTACK
// =====================================================

$url =
    "https://api.paystack.co/transaction/verify/"
    . urlencode($reference);


$ch = curl_init($url);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

curl_setopt($ch, CURLOPT_HTTPHEADER, [

    "Authorization: Bearer " . $paystackSecretKey,

    "Cache-Control: no-cache",

]);

$response = curl_exec($ch);

$httpCode =
    curl_getinfo(
        $ch,
        CURLINFO_HTTP_CODE
    );

curl_close($ch);


// =====================================================
// HANDLE PAYSTACK RESPONSE
// =====================================================

if ($response === false) {

    http_response_code(500);

    echo json_encode([
        "status" => false,
        "message" => "Unable to contact Paystack."
    ]);

    exit;
}


$data =
    json_decode(
        $response,
        true
    );


// =====================================================
// CHECK PAYMENT STATUS
// =====================================================

if (

    $httpCode === 200 &&

    isset($data["status"]) &&

    $data["status"] === true &&

    isset($data["data"]["status"]) &&

    $data["data"]["status"] === "success"

) {

    echo json_encode([

        "status" => true,

        "message" =>
            "Payment verified successfully.",

        "reference" =>
            $data["data"]["reference"],

        "amount" =>
            $data["data"]["amount"],

        "currency" =>
            $data["data"]["currency"],

    ]);

    exit;
}


// =====================================================
// PAYMENT NOT VERIFIED
// =====================================================

http_response_code(400);

echo json_encode([

    "status" => false,

    "message" =>
        "Payment could not be verified.",

]);

?>