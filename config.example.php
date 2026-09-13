<?php

declare(strict_types=1);

// Copy this file to config.php on the server. Keep the SQLite database outside
// the public web directory because nginx does not read .htaccess deny rules.
return [
    'SITE_DB_PATH' => dirname(__DIR__) . '/private/site.sqlite',
    'GOOGLE_CLIENT_ID' => '151504652377-jn5pfpqgf7vc4k04ce9bkmph653d88ad.apps.googleusercontent.com',
];

