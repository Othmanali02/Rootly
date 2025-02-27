<script setup>
import axios from 'axios';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
onMounted(async () => {
    let queryString = Object.keys(route.query)
        .map(key => `${key}=${encodeURIComponent(route.query[key])}`)
        .join('&');

    const finalUrl = "/api/rootly/users/redirect?" + queryString;

    try {
        console.log("making the request");
        const response = await axios.get(finalUrl, { withCredentials: true });
        console.log(response);
        if (response.status === 200) {
            console.log('Redirecting...');

            window.location.href = 'http://localhost:8080';
        }
    } catch (error) {
        console.error('Error in request:', error);
    }
});
</script>

<template>
    <div class="min-h-screen">
        redirecting...
    </div>
</template>
