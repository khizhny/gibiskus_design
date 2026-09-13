<?php
declare(strict_types=1);
header('Cross-Origin-Opener-Policy: same-origin-allow-popups');
header('Referrer-Policy: no-referrer-when-downgrade');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-cache');
readfile(__DIR__ . '/auth.html');

