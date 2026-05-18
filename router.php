<?php
/**
 * Local Router Script for PHP Built-in Server (php -S localhost:8000 router.php)
 * This replicates production Apache/LiteSpeed 404 routing locally!
 */

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

// 1. If it's a directory, check for index.html inside it
if (is_dir(__DIR__ . $uri)) {
    $index = rtrim(__DIR__ . $uri, '/') . '/index.html';
    if (file_exists($index)) {
        // Serve directory index
        include $index;
        exit;
    }
}

// 2. If the exact file exists, let the PHP built-in server handle it normally
if ($uri !== '/' && file_exists(__DIR__ . $uri)) {
    return false;
}

// 3. Otherwise, return 404 status and serve the custom 404.html page
http_response_code(404);
include __DIR__ . '/404.html';
exit;
