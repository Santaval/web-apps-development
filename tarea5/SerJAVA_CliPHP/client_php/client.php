<?php

/**
 * PHP Client for Java SOAP Service using file_get_contents
 * SerJAVA_CltPHP - Client PHP
 */

echo "=== PHP Client for Java SOAP Service (Simple Version) ===\n";

$soap_url = "http://localhost:8080/factorservice";

$test_cases = [
    [
        'numbers' => [1, 5, 23, 25, 35, 78, 30, 96],
        'divisor' => 5,
        'expected' => "5, 25, 35, 30"
    ],
    [
        'numbers' => [3, 20, 15],
        'divisor' => 3,
        'expected' => "3, 15"
    ]
];

foreach ($test_cases as $index => $test_case) {
    echo "\n--- Test Case " . ($index + 1) . " ---\n";
    echo "Numbers: [" . implode(', ', $test_case['numbers']) . "]\n";
    echo "Divisor: " . $test_case['divisor'] . "\n";

    $soap_request = createSoapRequest($test_case['numbers'], $test_case['divisor']);

    echo "Sending SOAP Request...\n";

    $response = sendSoapRequestStream($soap_url, $soap_request);

    if ($response !== false) {
        $result = extractSoapResponse($response);

        echo "Result: " . $result . "\n";
        echo "Expected: " . $test_case['expected'] . "\n";

        if ($result === $test_case['expected']) {
            echo "TEST PASSED!\n";
        } else {
            echo "TEST FAILED!\n";
        }

        echo "Raw Response:\n" . $response . "\n";
    } else {
        echo "Error sending SOAP request\n";
    }
}

/**
 * Create SOAP request XML
 */
function createSoapRequest($numbers, $divisor)
{
    $numbers_str = implode(',', $numbers);

    return '<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <findFactors>
            <numbers>' . $numbers_str . '</numbers>
            <divisor>' . $divisor . '</divisor>
        </findFactors>
    </soap:Body>
</soap:Envelope>';
}

/**
 * Send SOAP request using stream context (no cURL required)
 */
function sendSoapRequestStream($url, $soap_request)
{
    $options = [
        'http' => [
            'method' => 'POST',
            'header' =>
            "Content-Type: text/xml; charset=utf-8\r\n" .
                "SOAPAction: findFactors\r\n" .
                "Content-Length: " . strlen($soap_request) . "\r\n",
            'content' => $soap_request,
            'timeout' => 30
        ]
    ];

    $context = stream_context_create($options);

    $response = @file_get_contents($url, false, $context);

    if ($response === false) {
        $error = error_get_last();
        echo "HTTP Error: " . $error['message'] . "\n";
        return false;
    }

    return $response;
}

/**
 * Extract result from SOAP response
 */
function extractSoapResponse($soap_response)
{
    $start = strpos($soap_response, '<result>');
    $end = strpos($soap_response, '</result>');

    if ($start !== false && $end !== false && $end > $start) {
        $start += 8; // length of '<result>'
        return substr($soap_response, $start, $end - $start);
    }

    return "Error: Could not parse response. Raw: " . $soap_response;
}

echo "\n=== Test Complete ===\n";
