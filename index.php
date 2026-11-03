<?php
// Auto-redirect to compiled portfolio dist
$isVirtualHost = isset($_SERVER['HTTP_HOST']) && strpos($_SERVER['HTTP_HOST'], 'portofolio.test') !== false;

if ($isVirtualHost) {
    if (file_exists(__DIR__ . '/dist/index.html')) {
        include __DIR__ . '/dist/index.html';
        exit;
    }
} else {
    header('Location: dist/');
    exit;
}

