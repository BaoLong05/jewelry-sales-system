<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://192.168.33.11:5173',
    ],

    'allowed_headers' => ['*'],

    'supports_credentials' => true,

];