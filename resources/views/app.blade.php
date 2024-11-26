<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    {{-- <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" /> --}}

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased bg-gray-100 dark:bg-gray-900 ">

    {{-- <button id="theme-toggle" class="p-2 bg-gray-100 dark:bg-gray-900  dark:text-white">
            Toggle Dark Mode
        </button> --}}

    @inertia

    {{-- <script>
            const themeToggleBtn = document.getElementById('theme-toggle');
            const rootElement = document.documentElement;

            // On load, check if a theme is saved in localStorage and apply it
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') {
                rootElement.classList.add('dark');
            } else {
                rootElement.classList.remove('dark');
            }

            themeToggleBtn.addEventListener('click', () => {
                // Toggle dark mode
                if (rootElement.classList.contains('dark')) {
                    rootElement.classList.remove('dark');
                    localStorage.setItem('theme', 'light'); // Save preference to light
                } else {
                    rootElement.classList.add('dark');
                    localStorage.setItem('theme', 'dark'); // Save preference to dark
                }
            });
        </script> --}}
</body>

</html>
